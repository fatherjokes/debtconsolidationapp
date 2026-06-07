import { useParams, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { ArrowRight, AlertTriangle, CheckCircle, XCircle, Clock, TrendingDown, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import type { DebtRecommendation, RecommendationResult } from "../../../shared/types";
import { CREDIT_SCORE_LABELS, HOME_TIMELINE_LABELS } from "../../../shared/types";

const CREDIT_IMPACT_CONFIG = {
  none: { label: "No Impact", color: "text-green-700", bg: "bg-green-50", border: "border-green-200" },
  minimal: { label: "Minimal Impact", color: "text-green-600", bg: "bg-green-50", border: "border-green-200" },
  moderate: { label: "Moderate Impact", color: "text-yellow-700", bg: "bg-yellow-50", border: "border-yellow-200" },
  significant: { label: "Significant Impact", color: "text-orange-700", bg: "bg-orange-50", border: "border-orange-200" },
  severe: { label: "Severe Impact", color: "text-red-700", bg: "bg-red-50", border: "border-red-300" },
};

function OptionCard({ rec, index }: { rec: DebtRecommendation; index: number }) {
  const [expanded, setExpanded] = useState(index === 0);
  const impact = CREDIT_IMPACT_CONFIG[rec.estimatedCreditImpact];

  return (
    <div className={`option-card ${rec.rank === 1 ? "rank-1" : ""}`}>
      <div className="flex items-start gap-4 mb-4">
        <div className={`flex flex-col items-center justify-center ${rec.rank === 1 ? "w-16 h-16 bg-red-600 text-white" : "w-14 h-14 bg-black text-white"}`}>
          <span className={`font-black leading-none ${rec.rank === 1 ? "text-2xl" : "text-xl"}`}>{rec.suitabilityScore}</span>
          <span className="text-xs opacity-70">/100</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="swiss-label text-gray-400">#{rec.rank} Best Fit</span>
            {rec.rank === 1 && <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5">TOP RECOMMENDATION</span>}
            {rec.isAggressive && (
              <span className="text-xs font-bold text-red-700 bg-red-100 px-2 py-0.5 flex items-center gap-1">
                <AlertTriangle size={10} /> HIGH RISK
              </span>
            )}
          </div>
          <h3 className="font-black text-xl">{rec.name}</h3>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-1.5">
              <Clock size={12} className="text-gray-400" />
              <span className="text-xs text-gray-500">{rec.estimatedTimeline}</span>
            </div>
            <span className={`text-xs font-semibold px-2 py-0.5 ${impact.bg} ${impact.color} border ${impact.border}`}>
              {impact.label}
            </span>
          </div>
        </div>
        <button onClick={() => setExpanded(e => !e)} className="p-2 border border-black hover:bg-black hover:text-white transition-colors">
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>

      <p className="text-gray-700 text-sm leading-relaxed mb-4">{rec.plainLanguageExplanation}</p>

      {rec.isAggressive && rec.aggressiveWarning && (
        <div className="p-4 border-2 border-red-600 bg-red-50 mb-4">
          <div className="flex items-start gap-2">
            <AlertTriangle size={16} className="text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-bold text-red-700 mb-1">Important Warning</p>
              <p className="text-sm text-red-700">{rec.aggressiveWarning}</p>
            </div>
          </div>
        </div>
      )}

      {expanded && (
        <div className="fade-in">
          <div className="swiss-rule my-4" />
          <div className={`p-3 ${impact.bg} border ${impact.border} mb-4`}>
            <div className="flex items-center gap-2 mb-1">
              <TrendingDown size={14} className={impact.color} />
              <span className="text-xs font-bold uppercase tracking-wider">Credit Score Impact</span>
            </div>
            <p className="text-sm text-gray-700">{rec.creditImpactDetail}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle size={14} className="text-green-600" />
                <span className="swiss-label text-green-700">Advantages</span>
              </div>
              <ul className="space-y-2">
                {rec.pros.map((pro, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="swiss-accent mt-1.5" style={{ width: 6, height: 6, flexShrink: 0 }} />
                    {pro}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-3">
                <XCircle size={14} className="text-red-600" />
                <span className="swiss-label text-red-700">Disadvantages</span>
              </div>
              <ul className="space-y-2">
                {rec.cons.map((con, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="mt-1.5 flex-shrink-0" style={{ width: 6, height: 6, background: "#CC1F1F" }} />
                    {con}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Share() {
  const params = useParams<{ token: string }>();
  const token = params.token || "";

  const { data: resultRow, isLoading, error } = trpc.assessment.getByToken.useQuery(
    { token },
    { enabled: !!token }
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mb-4" />
          <p className="swiss-label">Loading shared results...</p>
        </div>
      </div>
    );
  }

  if (error || !resultRow) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-sm">
          <span className="swiss-accent-xl mx-auto mb-6 block" />
          <h2 className="font-black mb-2">Link Not Found</h2>
          <p className="text-gray-500 text-sm mb-6">This share link is invalid or has expired.</p>
          <Link href="/assessment">
            <button className="btn-swiss btn-swiss-red text-sm flex items-center gap-2">
              Start Your Own Assessment <ArrowRight size={14} />
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const result = resultRow.recommendations as unknown as RecommendationResult;

  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-black">
        <div className="swiss-container flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3">
            <span className="swiss-accent" style={{ width: 16, height: 16 }} />
            <span className="font-black text-sm tracking-widest uppercase">DebtConsolidationApp</span>
          </Link>
          <Link href="/assessment">
            <button className="btn-swiss btn-swiss-red text-xs flex items-center gap-2">
              Get My Results <ArrowRight size={12} />
            </button>
          </Link>
        </div>
      </nav>

      <div className="swiss-container py-12">
        <div className="border border-black p-4 bg-gray-50 mb-8 flex items-center gap-3">
          <span className="swiss-accent" style={{ width: 8, height: 8 }} />
          <p className="text-sm text-gray-600">
            You are viewing a <strong>shared debt relief assessment</strong>. These results are personalized to someone else's financial profile.{" "}
            <Link href="/assessment" className="font-bold underline">Get your own free assessment →</Link>
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 border border-black mb-12">
          <div className="lg:col-span-8 p-8 lg:border-r border-black">
            <div className="flex items-center gap-3 mb-4">
              <span className="swiss-accent" />
              <span className="swiss-label">Shared Assessment Results</span>
            </div>
            <h1 className="font-black text-3xl mb-4">Debt Relief Recommendations</h1>
            <p className="text-gray-700 leading-relaxed">{result.summary}</p>
          </div>
          <div className="lg:col-span-4 p-8 bg-gray-50">
            <p className="swiss-label mb-4">Financial Profile</p>
            <div className="space-y-3">
              {[
                ["Total Debt", `$${result.assessmentInput.totalDebt.toLocaleString()}`],
                ["Monthly Income", `$${result.assessmentInput.monthlyIncome.toLocaleString()}`],
                ["Disposable Income", `$${result.disposableIncome.toLocaleString()}/mo`],
                ["Credit Score", CREDIT_SCORE_LABELS[result.assessmentInput.creditScoreRange]],
                ["Home Purchase", HOME_TIMELINE_LABELS[result.assessmentInput.homePurchaseTimeline]],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between items-center text-sm border-b border-gray-200 pb-2">
                  <span className="text-gray-500">{label}</span>
                  <span className="font-bold">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4 mb-8">
          {result.recommendations.map((rec, i) => (
            <OptionCard key={rec.type} rec={rec} index={i} />
          ))}
        </div>

        <div className="border-2 border-black p-8 bg-gray-50 mb-8">
          <div className="flex items-start gap-4">
            <AlertTriangle size={20} className="text-black mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-black text-lg mb-3">Important Disclaimer</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                This report is generated by an AI tool for educational and informational purposes only. It does not constitute financial, legal, or credit counseling advice. Debt settlement and bankruptcy carry severe long-term consequences including significant credit score damage (100–200+ point drops) and records that remain for 7–10 years. Always consult a licensed financial advisor or nonprofit credit counselor before making debt relief decisions.
              </p>
            </div>
          </div>
        </div>

        <div className="p-8 border border-black bg-black text-white text-center">
          <h3 className="font-black text-2xl mb-2">Get Your Own Personalized Results</h3>
          <p className="text-gray-400 mb-6">Free, anonymous, and takes less than 60 seconds.</p>
          <Link href="/assessment">
            <button className="btn-swiss btn-swiss-red flex items-center gap-2 mx-auto">
              Start Free Assessment <ArrowRight size={16} />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
