// Assessment input types
export type CreditScoreRange = "excellent" | "good" | "fair" | "poor" | "bad";
export type HomePurchaseTimeline =
  | "within_1_year"
  | "within_2_years"
  | "within_3_years"
  | "within_5_years"
  | "not_planning";
export type PrimaryPriority = "speed" | "credit_preservation" | "lowest_payment";
export type RiskTolerance = "conservative" | "moderate" | "aggressive";

export type DebtOptionType =
  | "consolidation_loan"
  | "balance_transfer"
  | "debt_management_plan"
  | "debt_settlement"
  | "bankruptcy";

export interface AssessmentInput {
  totalDebt: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  creditScoreRange: CreditScoreRange;
  numberOfCreditors: number;
  homePurchaseTimeline: HomePurchaseTimeline;
  primaryPriority: PrimaryPriority;
  riskTolerance: RiskTolerance;
}

export interface DebtRecommendation {
  type: DebtOptionType;
  name: string;
  suitabilityScore: number; // 0-100
  rank: number; // 1 = best fit
  plainLanguageExplanation: string;
  estimatedCreditImpact: "none" | "minimal" | "moderate" | "significant" | "severe";
  creditImpactDetail: string;
  estimatedTimeline: string;
  estimatedMonthlySavings?: number;
  pros: string[];
  cons: string[];
  isAggressive: boolean; // true for settlement/bankruptcy
  aggressiveWarning?: string;
}

export interface RecommendationResult {
  summary: string;
  recommendations: DebtRecommendation[];
  debtToIncomeRatio: number;
  disposableIncome: number;
  assessmentInput: AssessmentInput;
}

// Credit score label helpers
export const CREDIT_SCORE_LABELS: Record<CreditScoreRange, string> = {
  excellent: "Excellent (750+)",
  good: "Good (700–749)",
  fair: "Fair (650–699)",
  poor: "Poor (600–649)",
  bad: "Bad (Below 600)",
};

export const HOME_TIMELINE_LABELS: Record<HomePurchaseTimeline, string> = {
  within_1_year: "Within 1 year",
  within_2_years: "Within 2 years",
  within_3_years: "Within 3 years",
  within_5_years: "Within 5 years",
  not_planning: "Not planning to buy",
};

export const PRIORITY_LABELS: Record<PrimaryPriority, string> = {
  speed: "Pay off debt as fast as possible",
  credit_preservation: "Preserve my credit score",
  lowest_payment: "Minimize my monthly payment",
};

export const RISK_LABELS: Record<RiskTolerance, string> = {
  conservative: "Conservative — I want the safest path",
  moderate: "Moderate — I'm open to some trade-offs",
  aggressive: "Aggressive — I want the fastest resolution",
};

export const OPTION_NAMES: Record<DebtOptionType, string> = {
  consolidation_loan: "Debt Consolidation Loan",
  balance_transfer: "Balance Transfer Card",
  debt_management_plan: "Debt Management Plan",
  debt_settlement: "Debt Settlement",
  bankruptcy: "Bankruptcy",
};
