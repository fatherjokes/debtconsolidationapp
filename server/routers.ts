import { z } from "zod";
import { nanoid } from "nanoid";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { invokeLLM } from "./_core/llm";
import { saveAssessment, saveResult, getResultById, saveSharedLink, getSharedLinkByToken, getAssessmentById } from "./db";
import type { RecommendationResult, AssessmentInput } from "../shared/types";

// ─── Zod schemas ──────────────────────────────────────────────────────────────

const assessmentInputSchema = z.object({
  totalDebt: z.number().positive(),
  monthlyIncome: z.number().positive(),
  monthlyExpenses: z.number().nonnegative(),
  creditScoreRange: z.enum(["excellent", "good", "fair", "poor", "bad"]),
  numberOfCreditors: z.number().int().positive(),
  homePurchaseTimeline: z.enum(["within_1_year", "within_2_years", "within_3_years", "within_5_years", "not_planning"]),
  primaryPriority: z.enum(["speed", "credit_preservation", "lowest_payment"]),
  riskTolerance: z.enum(["conservative", "moderate", "aggressive"]),
});

// ─── LLM prompt builder ───────────────────────────────────────────────────────

function buildAnalysisPrompt(input: AssessmentInput): string {
  const dti = ((input.monthlyExpenses / input.monthlyIncome) * 100).toFixed(1);
  const disposable = (input.monthlyIncome - input.monthlyExpenses).toFixed(0);
  const monthsToPayoff = input.monthlyIncome > input.monthlyExpenses
    ? Math.ceil(input.totalDebt / (input.monthlyIncome - input.monthlyExpenses))
    : 999;

  const creditMap: Record<string, string> = {
    excellent: "750+",
    good: "700-749",
    fair: "650-699",
    poor: "600-649",
    bad: "below 600",
  };

  const timelineMap: Record<string, string> = {
    within_1_year: "within 1 year",
    within_2_years: "within 2 years",
    within_3_years: "within 3 years",
    within_5_years: "within 5 years",
    not_planning: "not planning to buy a home",
  };

  const priorityMap: Record<string, string> = {
    speed: "pay off debt as fast as possible",
    credit_preservation: "preserve their credit score",
    lowest_payment: "minimize their monthly payment",
  };

  return `You are a certified debt relief counselor AI. Analyze this person's financial profile and provide a comprehensive, personalized debt relief recommendation.

FINANCIAL PROFILE:
- Total unsecured debt: $${input.totalDebt.toLocaleString()}
- Monthly take-home income: $${input.monthlyIncome.toLocaleString()}
- Monthly expenses (including min payments): $${input.monthlyExpenses.toLocaleString()}
- Estimated disposable income: $${disposable}/month
- Debt-to-income ratio: ${dti}%
- Credit score range: ${creditMap[input.creditScoreRange] || input.creditScoreRange}
- Number of creditors: ${input.numberOfCreditors}
- Home purchase timeline: ${timelineMap[input.homePurchaseTimeline] || input.homePurchaseTimeline}
- Primary priority: ${priorityMap[input.primaryPriority] || input.primaryPriority}
- Risk tolerance: ${input.riskTolerance}
- Estimated months to pay off at current disposable income: ${monthsToPayoff > 500 ? "Not feasible without intervention" : monthsToPayoff + " months"}

TASK: Analyze ALL FIVE debt relief options and rank them by suitability for this specific person. You MUST include all five options even if some are not recommended.

For each option, consider:
1. Whether the person qualifies (credit score, debt amount, income)
2. Impact on their home purchase timeline goal
3. Alignment with their primary priority
4. Their risk tolerance
5. Their debt-to-income ratio and disposable income

CRITICAL RULES:
- If home purchase is within 1-2 years, debt settlement and bankruptcy should score very low (10-30) due to credit damage
- If credit score is excellent/good, balance transfer and consolidation loan should score higher
- If credit score is poor/bad, consolidation loan and balance transfer will be hard to qualify for
- If disposable income is very low or negative, debt management plan or settlement may be necessary
- Always provide honest, balanced pros and cons — do not sugarcoat aggressive options
- The aggressiveWarning for settlement and bankruptcy must explicitly state: credit score drops 100-200+ points, stays on record 7-10 years, makes mortgage qualification very difficult

Respond with ONLY valid JSON matching this exact schema:
{
  "summary": "2-3 sentence personalized summary of their situation and overall recommendation",
  "recommendations": [
    {
      "type": "consolidation_loan" | "balance_transfer" | "debt_management_plan" | "debt_settlement" | "bankruptcy",
      "name": "Full option name",
      "suitabilityScore": 0-100,
      "rank": 1-5,
      "plainLanguageExplanation": "2-3 sentences explaining why this option does or does not fit their specific situation, referencing their actual numbers",
      "estimatedCreditImpact": "none" | "minimal" | "moderate" | "significant" | "severe",
      "creditImpactDetail": "Specific description of credit impact for this person",
      "estimatedTimeline": "e.g. '3-5 years' or '12-18 months'",
      "estimatedMonthlySavings": number or null,
      "pros": ["pro1", "pro2", "pro3"],
      "cons": ["con1", "con2", "con3"],
      "isAggressive": true | false,
      "aggressiveWarning": "string only if isAggressive is true, must mention credit score drop and duration"
    }
  ]
}

The recommendations array must contain exactly 5 items, one for each option type, sorted by rank (rank 1 = best fit first).`;
}

// ─── Chat context builder ─────────────────────────────────────────────────────

function buildChatSystemPrompt(result: RecommendationResult): string {
  const topOption = result.recommendations[0];
  return `You are a helpful debt relief counselor AI assistant. The user has just completed a debt assessment and received personalized recommendations.

THEIR FINANCIAL PROFILE:
- Total debt: $${result.assessmentInput.totalDebt.toLocaleString()}
- Monthly income: $${result.assessmentInput.monthlyIncome.toLocaleString()}
- Monthly expenses: $${result.assessmentInput.monthlyExpenses.toLocaleString()}
- Disposable income: $${result.disposableIncome.toLocaleString()}/month
- Credit score: ${result.assessmentInput.creditScoreRange}
- Creditors: ${result.assessmentInput.numberOfCreditors}
- Home purchase timeline: ${result.assessmentInput.homePurchaseTimeline}
- Priority: ${result.assessmentInput.primaryPriority}
- Risk tolerance: ${result.assessmentInput.riskTolerance}
- Debt-to-income ratio: ${(result.debtToIncomeRatio * 100).toFixed(1)}%

THEIR TOP RECOMMENDATION: ${topOption?.name} (suitability score: ${topOption?.suitabilityScore}/100)

SUMMARY: ${result.summary}

ALL RECOMMENDATIONS (ranked):
${result.recommendations.map((r, i) => `${i + 1}. ${r.name} — Score: ${r.suitabilityScore}/100, Timeline: ${r.estimatedTimeline}, Credit Impact: ${r.estimatedCreditImpact}`).join("\n")}

Your role:
- Answer follow-up questions about their specific recommendations
- Explain financial terms clearly (APR, debt-to-income ratio, credit utilization, etc.)
- Help them understand the trade-offs between options
- Explore alternative scenarios if they ask
- Always be honest about the risks of aggressive options (settlement, bankruptcy)
- Never provide legal advice; recommend consulting a licensed professional for legal matters
- Keep responses concise and practical — this person is stressed about debt

Respond in plain, empathetic language. Use their actual numbers when relevant.`;
}

// ─── Router ───────────────────────────────────────────────────────────────────

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  assessment: router({
    // Analyze assessment and return ranked recommendations
    analyze: publicProcedure
      .input(assessmentInputSchema)
      .mutation(async ({ input }) => {
        const prompt = buildAnalysisPrompt(input);

        const llmResponse = await invokeLLM({
          messages: [
            { role: "system", content: "You are a certified debt relief counselor AI. Always respond with valid JSON only, no markdown, no explanation outside the JSON." },
            { role: "user", content: prompt },
          ],
          response_format: {
            type: "json_schema",
            json_schema: {
              name: "debt_recommendations",
              strict: false,
              schema: {
                type: "object",
                properties: {
                  summary: { type: "string" },
                  recommendations: { type: "array" },
                },
                required: ["summary", "recommendations"],
              },
            },
          },
        });

        const rawContent = llmResponse.choices[0]?.message?.content;
        if (!rawContent) throw new Error("No response from AI");
        const content = typeof rawContent === "string" ? rawContent : JSON.stringify(rawContent);

        let parsed: { summary: string; recommendations: RecommendationResult["recommendations"] };
        try {
          parsed = JSON.parse(content);
        } catch {
          // Try to extract JSON from the response
          const match = content.match(/\{[\s\S]*\}/);
          if (!match) throw new Error("Invalid AI response format");
          parsed = JSON.parse(match[0]);
        }

        const disposableIncome = input.monthlyIncome - input.monthlyExpenses;
        const debtToIncomeRatio = input.monthlyExpenses / input.monthlyIncome;

        const fullResult: RecommendationResult = {
          summary: parsed.summary,
          recommendations: parsed.recommendations,
          debtToIncomeRatio,
          disposableIncome,
          assessmentInput: input,
        };

        // Save to database
        const assessmentId = await saveAssessment({
          totalDebt: input.totalDebt,
          monthlyIncome: input.monthlyIncome,
          monthlyExpenses: input.monthlyExpenses,
          creditScoreRange: input.creditScoreRange,
          numberOfCreditors: input.numberOfCreditors,
          homePurchaseTimeline: input.homePurchaseTimeline,
          primaryPriority: input.primaryPriority,
          riskTolerance: input.riskTolerance,
        });

        const resultId = await saveResult({
          assessmentId,
          recommendations: fullResult as unknown as Record<string, unknown>,
          summary: parsed.summary,
        });

        return { resultId, assessmentId };
      }),

    // Get result by ID
    getResult: publicProcedure
      .input(z.object({ resultId: z.number() }))
      .query(async ({ input }) => {
        const result = await getResultById(input.resultId);
        if (!result) throw new Error("Result not found");
        return result;
      }),

    // Get result by share token
    getByToken: publicProcedure
      .input(z.object({ token: z.string() }))
      .query(async ({ input }) => {
        const link = await getSharedLinkByToken(input.token);
        if (!link) throw new Error("Share link not found or expired");
        const result = await getResultById(link.resultId);
        if (!result) throw new Error("Result not found");
        return result;
      }),

    // Create a shareable link
    createShareLink: publicProcedure
      .input(z.object({ resultId: z.number(), assessmentId: z.number() }))
      .mutation(async ({ input }) => {
        const token = nanoid(16);
        await saveSharedLink({
          token,
          resultId: input.resultId,
          assessmentId: input.assessmentId,
        });
        return { token };
      }),

    // Chat with AI about results
    chat: publicProcedure
      .input(z.object({
        resultId: z.number(),
        messages: z.array(z.object({
          role: z.enum(["user", "assistant"]),
          content: z.string(),
        })),
      }))
      .mutation(async ({ input }) => {
        const resultRow = await getResultById(input.resultId);
        if (!resultRow) throw new Error("Result not found");

        const fullResult = resultRow.recommendations as unknown as RecommendationResult;
        const systemPrompt = buildChatSystemPrompt(fullResult);

        const response = await invokeLLM({
          messages: [
            { role: "system", content: systemPrompt },
            ...input.messages,
          ],
        });

        const reply = response.choices[0]?.message?.content;
        if (!reply) throw new Error("No response from AI");
        return { reply };
      }),

    // Generate PDF data (returns HTML string for client-side printing)
    generatePdfData: publicProcedure
      .input(z.object({ resultId: z.number() }))
      .query(async ({ input }) => {
        const result = await getResultById(input.resultId);
        if (!result) throw new Error("Result not found");
        return result;
      }),
  }),
});

export type AppRouter = typeof appRouter;
