import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock the database and LLM modules
vi.mock("./db", () => ({
  saveAssessment: vi.fn().mockResolvedValue(1),
  saveResult: vi.fn().mockResolvedValue(42),
  getResultById: vi.fn().mockResolvedValue({
    id: 42,
    assessmentId: 1,
    recommendations: {
      summary: "Test summary",
      recommendations: [
        {
          type: "consolidation_loan",
          name: "Debt Consolidation Loan",
          suitabilityScore: 85,
          rank: 1,
          plainLanguageExplanation: "Good fit for your profile.",
          estimatedCreditImpact: "minimal",
          creditImpactDetail: "Minimal impact expected.",
          estimatedTimeline: "3-5 years",
          pros: ["Lower interest rate"],
          cons: ["Requires good credit"],
          isAggressive: false,
        },
      ],
      debtToIncomeRatio: 0.45,
      disposableIncome: 500,
      assessmentInput: {
        totalDebt: 15000,
        monthlyIncome: 4000,
        monthlyExpenses: 3500,
        creditScoreRange: "good",
        numberOfCreditors: 3,
        homePurchaseTimeline: "within_3_years",
        primaryPriority: "credit_preservation",
        riskTolerance: "conservative",
      },
    },
    summary: "Test summary",
    createdAt: new Date(),
  }),
  saveSharedLink: vi.fn().mockResolvedValue("test-token-123"),
  getSharedLinkByToken: vi.fn().mockResolvedValue({
    id: 1,
    token: "test-token-123",
    assessmentId: 1,
    resultId: 42,
    createdAt: new Date(),
  }),
  upsertUser: vi.fn(),
  getUserByOpenId: vi.fn(),
}));

vi.mock("./_core/llm", () => ({
  invokeLLM: vi.fn().mockResolvedValue({
    choices: [
      {
        message: {
          content: JSON.stringify({
            summary: "Based on your profile, a debt consolidation loan is your best option.",
            recommendations: [
              {
                type: "consolidation_loan",
                name: "Debt Consolidation Loan",
                suitabilityScore: 88,
                rank: 1,
                plainLanguageExplanation: "With a good credit score and stable income, you qualify for competitive rates.",
                estimatedCreditImpact: "minimal",
                creditImpactDetail: "Hard inquiry causes a small temporary dip.",
                estimatedTimeline: "3-5 years",
                estimatedMonthlySavings: 150,
                pros: ["Lower interest rate", "Single payment", "Fixed timeline"],
                cons: ["Requires good credit", "May extend repayment period"],
                isAggressive: false,
              },
              {
                type: "balance_transfer",
                name: "Balance Transfer Card",
                suitabilityScore: 72,
                rank: 2,
                plainLanguageExplanation: "0% APR promotional period could save significant interest.",
                estimatedCreditImpact: "minimal",
                creditImpactDetail: "Small temporary dip from hard inquiry.",
                estimatedTimeline: "12-18 months",
                pros: ["0% APR period", "Fast payoff"],
                cons: ["Transfer fees", "High rate after promo"],
                isAggressive: false,
              },
              {
                type: "debt_management_plan",
                name: "Debt Management Plan",
                suitabilityScore: 60,
                rank: 3,
                plainLanguageExplanation: "A DMP would work but your credit score qualifies you for better options.",
                estimatedCreditImpact: "moderate",
                creditImpactDetail: "Accounts noted as enrolled in DMP.",
                estimatedTimeline: "4-5 years",
                pros: ["Reduced interest rates", "Single payment"],
                cons: ["Monthly fee", "Restricted credit use"],
                isAggressive: false,
              },
              {
                type: "debt_settlement",
                name: "Debt Settlement",
                suitabilityScore: 20,
                rank: 4,
                plainLanguageExplanation: "Not recommended given your home purchase timeline and credit score.",
                estimatedCreditImpact: "severe",
                creditImpactDetail: "100-200 point drop, stays 7 years.",
                estimatedTimeline: "2-4 years",
                pros: ["Reduce total debt owed"],
                cons: ["Severe credit damage", "Tax implications", "Creditor lawsuits"],
                isAggressive: true,
                aggressiveWarning: "Debt settlement causes a 100-200+ point credit score drop and remains on your credit report for 7 years, making mortgage qualification very difficult.",
              },
              {
                type: "bankruptcy",
                name: "Bankruptcy",
                suitabilityScore: 5,
                rank: 5,
                plainLanguageExplanation: "Not appropriate for your situation. You have income and assets to repay debt.",
                estimatedCreditImpact: "severe",
                creditImpactDetail: "Stays on credit report 7-10 years.",
                estimatedTimeline: "3-6 months (Ch.7) or 3-5 years (Ch.13)",
                pros: ["Legal debt discharge", "Immediate creditor protection"],
                cons: ["Severe long-term credit damage", "Public record", "Asset liquidation risk"],
                isAggressive: true,
                aggressiveWarning: "Bankruptcy causes a severe credit score drop and remains on your credit report for 7-10 years, making mortgage qualification nearly impossible for years.",
              },
            ],
          }),
        },
      },
    ],
  }),
}));

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

const validInput = {
  totalDebt: 15000,
  monthlyIncome: 4000,
  monthlyExpenses: 3500,
  creditScoreRange: "good" as const,
  numberOfCreditors: 3,
  homePurchaseTimeline: "within_3_years" as const,
  primaryPriority: "credit_preservation" as const,
  riskTolerance: "conservative" as const,
};

describe("assessment.analyze", () => {
  it("returns a resultId and assessmentId on valid input", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.assessment.analyze(validInput);
    expect(result).toHaveProperty("resultId");
    expect(result).toHaveProperty("assessmentId");
    expect(typeof result.resultId).toBe("number");
    expect(typeof result.assessmentId).toBe("number");
  });

  it("rejects negative totalDebt", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    await expect(
      caller.assessment.analyze({ ...validInput, totalDebt: -100 })
    ).rejects.toThrow();
  });

  it("rejects zero monthlyIncome", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    await expect(
      caller.assessment.analyze({ ...validInput, monthlyIncome: 0 })
    ).rejects.toThrow();
  });

  it("rejects invalid creditScoreRange", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    await expect(
      caller.assessment.analyze({ ...validInput, creditScoreRange: "superb" as never })
    ).rejects.toThrow();
  });
});

describe("assessment.getResult", () => {
  it("returns a result for a valid resultId", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.assessment.getResult({ resultId: 42 });
    expect(result).toBeDefined();
    expect(result.id).toBe(42);
    expect(result.assessmentId).toBe(1);
  });
});

describe("assessment.createShareLink", () => {
  it("returns a token for valid resultId and assessmentId", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.assessment.createShareLink({ resultId: 42, assessmentId: 1 });
    expect(result).toHaveProperty("token");
    expect(typeof result.token).toBe("string");
    expect(result.token.length).toBeGreaterThan(0);
  });
});

describe("assessment.getByToken", () => {
  it("returns a result for a valid share token", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.assessment.getByToken({ token: "test-token-123" });
    expect(result).toBeDefined();
    expect(result.id).toBe(42);
  });
});
