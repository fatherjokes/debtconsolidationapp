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
  const dtiNum = parseFloat(dti);
  const disposable = (input.monthlyIncome - input.monthlyExpenses).toFixed(0);
  const disposableNum = input.monthlyIncome - input.monthlyExpenses;
  const monthsToPayoff = disposableNum > 0
    ? Math.ceil(input.totalDebt / disposableNum)
    : 999;
  const totalInterestIfMinimums = disposableNum > 0 && monthsToPayoff < 500
    ? Math.round((monthsToPayoff * input.monthlyExpenses) - input.totalDebt)
    : null;
  // Qualification flags
  const likelyQualifiesForConsolidationLoan =
    (input.creditScoreRange === "excellent" || input.creditScoreRange === "good") && dtiNum < 43;
  const marginalConsolidationLoanQualification =
    input.creditScoreRange === "fair" && dtiNum < 50;
  const consolidationLoanLikelyDenied =
    input.creditScoreRange === "poor" || input.creditScoreRange === "bad" || dtiNum >= 50;
  const likelyQualifiesForBalanceTransfer =
    (input.creditScoreRange === "excellent" || input.creditScoreRange === "good") && input.totalDebt < 25000;
  const paycheckToPaycheck = disposableNum < (input.monthlyIncome * 0.05);
  const debtTakesDecades = monthsToPayoff > 120; // 10+ years at current pace
  const settlementMakesFinancialSense =
    (paycheckToPaycheck || debtTakesDecades) &&
    (input.creditScoreRange === "poor" || input.creditScoreRange === "bad" || input.creditScoreRange === "fair") &&
    input.totalDebt > 10000;

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

  return `You are a certified debt relief counselor AI with expertise in real-world loan qualification criteria, credit underwriting, and debt program success rates. Analyze this person's financial profile and provide a comprehensive, accurate, personalized debt relief recommendation.

FINANCIAL PROFILE:
- Total unsecured debt: $${input.totalDebt.toLocaleString()}
- Monthly take-home income: $${input.monthlyIncome.toLocaleString()}
- Monthly expenses (including min payments): $${input.monthlyExpenses.toLocaleString()}
- Estimated disposable income: $${disposable}/month
- Debt-to-income ratio (DTI): ${dti}%
- Credit score range: ${creditMap[input.creditScoreRange] || input.creditScoreRange}
- Number of creditors: ${input.numberOfCreditors}
- Home purchase timeline: ${timelineMap[input.homePurchaseTimeline] || input.homePurchaseTimeline}
- Primary priority: ${priorityMap[input.primaryPriority] || input.primaryPriority}
- Risk tolerance: ${input.riskTolerance}
- Estimated months to pay off at current pace: ${monthsToPayoff > 500 ? "Not feasible — debt will never be paid off without intervention" : monthsToPayoff + " months (" + Math.round(monthsToPayoff/12) + " years)"}
${totalInterestIfMinimums !== null ? `- Estimated total interest cost at current pace: $${totalInterestIfMinimums.toLocaleString()} (${Math.round(totalInterestIfMinimums/input.totalDebt*100)}% more than original debt)` : "- Total interest cost: Incalculable — debt is growing faster than it can be paid"}
- Living paycheck to paycheck: ${paycheckToPaycheck ? "YES — disposable income is less than 5% of monthly income" : "No"}
- Debt takes 10+ years at current pace: ${debtTakesDecades ? "YES" : "No"}
- Debt settlement makes financial sense: ${settlementMakesFinancialSense ? "YES — mathematically superior to decades of minimum payments" : "Not necessarily"}

QUALIFICATION ASSESSMENT (pre-computed — use these in your analysis):
- Consolidation loan likely approved: ${likelyQualifiesForConsolidationLoan ? "YES (good/excellent credit, DTI under 43%)" : "NO"}
- Consolidation loan marginal: ${marginalConsolidationLoanQualification ? "MARGINAL (fair credit, DTI under 50% — expect 20-30% APR, not much better than cards)" : "N/A"}
- Consolidation loan likely denied: ${consolidationLoanLikelyDenied ? "YES — poor/bad credit or DTI ≥50% means most lenders will decline or offer predatory rates" : "No"}
- Balance transfer likely approved: ${likelyQualifiesForBalanceTransfer ? "YES (good/excellent credit, manageable balance)" : "NO — requires good/excellent credit and typically under $25,000"}

TASK: Analyze ALL FIVE debt relief options and rank them by suitability. You MUST include all five options.

CRITICAL QUALIFICATION RULES — THESE ARE HARD GATES, NOT SUGGESTIONS:

1. DEBT CONSOLIDATION LOAN:
   - ONLY recommend as top option if consolidation loan is "likely approved" above
   - If "marginal": rank it 2nd or 3rd at most; warn that the rate offered may be 20-30% APR — barely better than credit cards — and the person may be declined after a hard credit inquiry
   - If "likely denied": rank it 4th or 5th; explain clearly that lenders require DTI under 43-50% and credit score above 640-670; applying will result in hard inquiry damage with likely rejection
   - NEVER recommend a consolidation loan as the top option for someone with poor/bad credit or DTI ≥ 50%

2. BALANCE TRANSFER:
   - ONLY recommend as a top option if balance transfer is "likely approved" above
   - Requires good/excellent credit (700+) and typically a balance under $20,000-25,000
   - If credit is fair/poor/bad: rank 4th or 5th; explain the person will not qualify for 0% promotional cards

3. DEBT MANAGEMENT PLAN (DMP):
   - DMP completion rates are only 25-40% industry-wide (NFCC data). 60-75% of enrollees drop out before finishing.
   - DMPs require 3-5 years of consistent payments. Life changes, income disruptions, or unexpected expenses frequently cause dropout.
   - When recommending DMP, ALWAYS include in the cons: "Only 25-40% of enrollees complete the full program; dropout returns accounts to original high-interest rates with no credit benefit"
   - DMP is appropriate when: credit score is fair/poor (can't qualify for consolidation loan), person has stable income, debt is $10,000-$50,000, and they are NOT living paycheck to paycheck
   - DMP is NOT appropriate as the primary recommendation when: disposable income is less than 5% of income (paycheck to paycheck), income is irregular/gig-based, or debt is so large the 3-5 year timeline is unrealistic
   - If the person is living paycheck to paycheck AND has fair/poor/bad credit AND debt takes decades to pay off, debt settlement likely outranks DMP in suitability

4. DEBT SETTLEMENT:
   - Settlement is appropriate (and can be the TOP recommendation) when ALL of the following are true:
     a) Person cannot qualify for a consolidation loan (poor/bad credit or high DTI)
     b) Person is living paycheck to paycheck OR debt would take 10+ years to pay off
     c) Total debt is over $10,000
     d) Home purchase is NOT within 1-2 years
   - Settlement resolves debt for 40-60 cents on the dollar but damages credit 100-200 points for 7 years
   - When settlement makes financial sense, it is often BETTER than paying 3-5x the original balance over decades — be honest about this math
   - The aggressiveWarning MUST state: credit score drops 100-200+ points, negative marks stay 7 years, mortgage qualification becomes very difficult for 2-4 years after completion

5. BANKRUPTCY:
   - Chapter 7 is appropriate when: monthly expenses exceed income, wage garnishment is active or imminent, or total debt is so large that even settlement is not feasible
   - Chapter 13 is appropriate when: person has regular income but needs court-supervised repayment restructuring
   - Bankruptcy stays on credit report 7-10 years (Chapter 13 / Chapter 7 respectively)
   - If home purchase is within 1-2 years, settlement and bankruptcy score very low (10-30) regardless of other factors

ADDITIONAL RULES:
- Always reference the person's actual numbers (DTI %, disposable income, months to payoff, total interest cost)
- If the person would pay more than 2x their original debt at the current pace, say so explicitly in the relevant option explanations
- Never recommend a product the person cannot realistically qualify for as the #1 option
- Always provide honest, balanced pros and cons — do not sugarcoat aggressive options or oversell optimistic ones
- The plainLanguageExplanation must reference their actual DTI, credit score, and payoff timeline when relevant

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
