import { Link } from "wouter";
import { ArrowLeft, AlertTriangle, CheckCircle, XCircle, Clock, TrendingDown, Star, Phone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import DebtSavingsCalculator from "@/components/DebtSavingsCalculator";
import OptionsComparisonTable from "@/components/OptionsComparisonTable";

export interface OptionData {
  rank: number;
  name: string;
  suitabilityScore: number;
  creditImpact: "none" | "minimal" | "moderate" | "significant" | "severe";
  timeline: string;
  summary: string;
  pros: string[];
  cons: string[];
  isAggressive?: boolean;
  warning?: string;
}

export interface ScenarioData {
  slug: string;
  title: string;
  metaDescription: string;
  headline: string;
  subheadline: string;
  profile: {
    totalDebt: string;
    monthlyIncome: string;
    monthlyExpenses: string;
    creditScore: string;
    creditors: string;
    homePurchase: string;
    priority: string;
    riskTolerance: string;
  };
  situation: string;
  keyFactors: string[];
  topRecommendation: string;
  topRecommendationReason: string;
  options: OptionData[];
  disclaimer: string;
  relatedScenarios: { slug: string; title: string }[];
  // Optional calculator defaults derived from profile
  calculatorDefaults?: {
    debt?: number;
    apr?: number;
    settlementPct?: number;
  };
  // Optional comparison table highlight — maps to option id
  comparisonHighlight?: string;
}

const CREDIT_IMPACT_CONFIG: Record<
  OptionData["creditImpact"],
  { label: string; color: string; bg: string }
> = {
  none: { label: "No Impact", color: "text-green-700", bg: "bg-green-50" },
  minimal: { label: "Minimal Impact", color: "text-blue-700", bg: "bg-blue-50" },
  moderate: { label: "Moderate Impact", color: "text-yellow-700", bg: "bg-yellow-50" },
  significant: { label: "Significant Impact", color: "text-orange-700", bg: "bg-orange-50" },
  severe: { label: "Severe Impact", color: "text-red-700", bg: "bg-red-50" },
};

function SuitabilityBar({ score }: { score: number }) {
  const color =
    score >= 80 ? "bg-green-500" : score >= 50 ? "bg-yellow-500" : score >= 25 ? "bg-orange-500" : "bg-red-500";
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${color}`}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className="text-sm font-bold tabular-nums w-8 text-right">{score}</span>
    </div>
  );
}

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1)
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-black text-white text-xs font-bold uppercase tracking-wider">
        <Star className="w-3 h-3" /> Top Pick
      </span>
    );
  return (
    <span className="inline-flex items-center px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-bold uppercase tracking-wider">
      #{rank}
    </span>
  );
}

export default function ScenarioPage({ scenario }: { scenario: ScenarioData }) {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <header className="border-b border-black">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/">
            <span className="flex items-center gap-2 text-sm font-medium hover:text-red-600 transition-colors cursor-pointer">
              <span className="w-4 h-4 bg-red-600 inline-block" />
              DebtConsolidationApp
            </span>
          </Link>
          <Link href="/#scenarios">
            <span className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-black transition-colors cursor-pointer">
              <ArrowLeft className="w-4 h-4" />
              All Scenarios
            </span>
          </Link>
        </div>
      </header>

      {/* Above-the-fold specialist CTA banner */}
      <div className="bg-black text-white">
        <div className="max-w-5xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-red-600 flex-shrink-0" />
            <p className="text-sm font-semibold">Talk to a licensed debt specialist — free consultation, no obligation.</p>
          </div>
          <a
            href="tel:+18005551234"
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm font-black uppercase tracking-widest px-5 py-2.5 transition-colors whitespace-nowrap flex-shrink-0"
          >
            <Phone size={14} />
            Call Now — Free
          </a>
        </div>
      </div>

      {/* Hero */}
      <section className="border-b border-black bg-black text-white">
        <div className="max-w-5xl mx-auto px-6 py-14">
          <div className="flex items-start gap-4 mb-6">
            <span className="w-1 h-16 bg-red-600 flex-shrink-0 mt-1" />
            <div>
              <p className="text-red-400 text-xs font-bold uppercase tracking-widest mb-2">
                Scenario Analysis
              </p>
              <h1 className="text-3xl md:text-4xl font-black leading-tight mb-3">
                {scenario.headline}
              </h1>
              <p className="text-gray-300 text-lg leading-relaxed max-w-2xl">
                {scenario.subheadline}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-10">
            {/* Situation */}
            <section>
              <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2">
                <span className="w-4 h-px bg-red-600 inline-block" /> The Situation
              </h2>
              <p className="text-gray-700 leading-relaxed text-base">{scenario.situation}</p>
            </section>

            {/* Key Factors */}
            <section>
              <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2">
                <span className="w-4 h-px bg-red-600 inline-block" /> Key Factors
              </h2>
              <ul className="space-y-2">
                {scenario.keyFactors.map((f, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                    <span className="w-1.5 h-1.5 bg-red-600 rounded-full mt-2 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </section>

            {/* Top Recommendation */}
            <section className="border border-black p-6">
              <p className="text-xs font-bold uppercase tracking-widest text-red-600 mb-2">
                Top Recommendation
              </p>
              <h3 className="text-xl font-black mb-3">{scenario.topRecommendation}</h3>
              <p className="text-gray-700 text-sm leading-relaxed">{scenario.topRecommendationReason}</p>
            </section>

            <Separator className="bg-black" />

            {/* All 5 Options */}
            <section>
              <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6 flex items-center gap-2">
                <span className="w-4 h-px bg-red-600 inline-block" /> All Options Ranked
              </h2>
              <div className="space-y-6">
                {scenario.options.map((opt) => {
                  const impact = CREDIT_IMPACT_CONFIG[opt.creditImpact];
                  return (
                    <Card
                      key={opt.rank}
                      className={`border rounded-none shadow-none ${
                        opt.isAggressive ? "border-red-200 bg-red-50/30" : "border-gray-200"
                      } ${opt.rank === 1 ? "border-black" : ""}`}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <RankBadge rank={opt.rank} />
                            <CardTitle className="text-base font-black">{opt.name}</CardTitle>
                            {opt.isAggressive && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-100 text-red-700 text-xs font-bold uppercase tracking-wider">
                                <AlertTriangle className="w-3 h-3" /> Aggressive
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="mt-3 space-y-2">
                          <div className="flex items-center gap-6 text-xs text-gray-500">
                            <span className={`px-2 py-0.5 text-xs font-medium ${impact.bg} ${impact.color}`}>
                              <TrendingDown className="w-3 h-3 inline mr-1" />
                              {impact.label}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" /> {opt.timeline}
                            </span>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400 mb-1 font-medium">Suitability Score</p>
                            <SuitabilityBar score={opt.suitabilityScore} />
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-sm text-gray-700 leading-relaxed">{opt.summary}</p>

                        {opt.warning && (
                          <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200">
                            <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                            <p className="text-xs text-red-700 leading-relaxed">{opt.warning}</p>
                          </div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Pros</p>
                            <ul className="space-y-1">
                              {opt.pros.map((p, i) => (
                                <li key={i} className="flex items-start gap-2 text-xs text-gray-700">
                                  <CheckCircle className="w-3.5 h-3.5 text-green-600 flex-shrink-0 mt-0.5" />
                                  {p}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Cons</p>
                            <ul className="space-y-1">
                              {opt.cons.map((c, i) => (
                                <li key={i} className="flex items-start gap-2 text-xs text-gray-700">
                                  <XCircle className="w-3.5 h-3.5 text-red-500 flex-shrink-0 mt-0.5" />
                                  {c}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </section>

            {/* Savings Calculator */}
            <section>
              <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2">
                <span className="w-4 h-px bg-red-600 inline-block" /> Savings Calculator
              </h2>
              <DebtSavingsCalculator
                defaultDebt={scenario.calculatorDefaults?.debt}
                defaultApr={scenario.calculatorDefaults?.apr}
                defaultSettlementPct={scenario.calculatorDefaults?.settlementPct}
              />
            </section>

            <Separator className="bg-black" />

            {/* Options Comparison Table */}
            <section>
              <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2">
                <span className="w-4 h-px bg-red-600 inline-block" /> Compare All Options
              </h2>
              <OptionsComparisonTable highlightOption={scenario.comparisonHighlight} />
            </section>

            {/* Disclaimer */}
            <section className="border-t border-gray-200 pt-8">
              <p className="text-xs text-gray-500 leading-relaxed italic">{scenario.disclaimer}</p>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Profile Card */}
            <div className="border border-black p-5 sticky top-6">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">
                Financial Profile
              </p>
              <dl className="space-y-3">
                {Object.entries(scenario.profile).map(([key, val]) => (
                  <div key={key}>
                    <dt className="text-xs text-gray-400 uppercase tracking-wider mb-0.5">
                      {key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase())}
                    </dt>
                    <dd className="text-sm font-semibold text-black">{val}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* CTA */}
            <div className="bg-black text-white p-5">
              <p className="text-xs font-bold uppercase tracking-widest text-red-400 mb-2">
                Your Situation Is Unique
              </p>
              <p className="text-sm text-gray-300 mb-4 leading-relaxed">
                Get a personalized recommendation based on your exact financial profile — not a generic scenario.
              </p>
              <Link href="/">
                <button className="w-full bg-red-600 text-white text-xs font-bold uppercase tracking-widest py-3 hover:bg-red-700 transition-colors">
                  Start Free Assessment →
                </button>
              </Link>
            </div>

            {/* Related Scenarios */}
            <div className="border border-gray-200 p-5">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">
                Related Scenarios
              </p>
              <ul className="space-y-2">
                {scenario.relatedScenarios.map((s) => (
                  <li key={s.slug}>
                    <Link href={`/scenarios/${s.slug}`}>
                      <span className="text-sm text-gray-700 hover:text-red-600 transition-colors cursor-pointer flex items-center gap-2">
                        <span className="w-1 h-1 bg-red-600 rounded-full flex-shrink-0" />
                        {s.title}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>

      {/* Footer CTA */}
      <section className="border-t border-black bg-gray-50 py-12">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
            Ready to find your path?
          </p>
          <h3 className="text-2xl font-black mb-4">Get Your Personalized Debt Relief Plan</h3>
          <p className="text-gray-600 mb-6 max-w-xl mx-auto text-sm">
            Answer 8 questions and receive AI-powered recommendations tailored to your exact financial situation — free, instant, and no account required.
          </p>
          <Link href="/assessment">
            <button className="bg-red-600 text-white text-sm font-bold uppercase tracking-widest px-8 py-4 hover:bg-red-700 transition-colors">
              Start Your Free Assessment
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}
