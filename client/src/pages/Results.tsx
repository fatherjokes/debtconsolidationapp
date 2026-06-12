import { useState, useRef } from "react";
import { useParams, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, Share2, Download, MessageCircle, ChevronDown, ChevronUp, AlertTriangle, CheckCircle, XCircle, Clock, TrendingDown, Copy, Check, Phone } from "lucide-react";
import type { DebtRecommendation, RecommendationResult } from "../../../shared/types";
import { CREDIT_SCORE_LABELS, HOME_TIMELINE_LABELS, PRIORITY_LABELS, RISK_LABELS } from "../../../shared/types";
import { Streamdown } from "streamdown";
import { toast } from "sonner";

const CREDIT_IMPACT_CONFIG = {
  none: { label: "No Impact", color: "text-green-700", bg: "bg-green-50", border: "border-green-200" },
  minimal: { label: "Minimal Impact", color: "text-green-600", bg: "bg-green-50", border: "border-green-200" },
  moderate: { label: "Moderate Impact", color: "text-yellow-700", bg: "bg-yellow-50", border: "border-yellow-200" },
  significant: { label: "Significant Impact", color: "text-orange-700", bg: "bg-orange-50", border: "border-orange-200" },
  severe: { label: "Severe Impact", color: "text-red-700", bg: "bg-red-50", border: "border-red-300" },
};

function ScoreBadge({ score, rank }: { score: number; rank: number }) {
  const isTop = rank === 1;
  return (
    <div className={`flex flex-col items-center justify-center ${isTop ? "w-16 h-16 bg-red-600 text-white" : "w-14 h-14 bg-black text-white"}`}>
      <span className={`font-black leading-none ${isTop ? "text-2xl" : "text-xl"}`}>{score}</span>
      <span className="text-xs opacity-70 font-medium">/100</span>
    </div>
  );
}

function OptionCard({ rec, index }: { rec: DebtRecommendation; index: number }) {
  const [expanded, setExpanded] = useState(index === 0);
  const impact = CREDIT_IMPACT_CONFIG[rec.estimatedCreditImpact];

  return (
    <div className={`option-card ${rec.rank === 1 ? "rank-1" : ""} slide-up`} style={{ animationDelay: `${index * 80}ms` }}>
      {rec.rank === 1 && (
        <div className="absolute -top-px left-0 right-0 h-0.5 bg-red-600" />
      )}

      {/* Card header */}
      <div className="flex items-start gap-4 mb-4">
        <ScoreBadge score={rec.suitabilityScore} rank={rec.rank} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="swiss-label text-gray-400">#{rec.rank} Best Fit</span>
            {rec.rank === 1 && (
              <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5">TOP RECOMMENDATION</span>
            )}
            {rec.isAggressive && (
              <span className="text-xs font-bold text-red-700 bg-red-100 px-2 py-0.5 flex items-center gap-1">
                <AlertTriangle size={10} />
                HIGH RISK
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
        <button
          onClick={() => setExpanded(e => !e)}
          className="p-2 border border-black hover:bg-black hover:text-white transition-colors"
          aria-label={expanded ? "Collapse" : "Expand"}
        >
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>

      {/* Plain language explanation */}
      <p className="text-gray-700 text-sm leading-relaxed mb-4">{rec.plainLanguageExplanation}</p>

      {/* Aggressive warning */}
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

      {/* Expanded details */}
      {expanded && (
        <div className="fade-in">
          <div className="swiss-rule my-4" />

          {/* Credit impact detail */}
          <div className={`p-3 ${impact.bg} border ${impact.border} mb-4`}>
            <div className="flex items-center gap-2 mb-1">
              <TrendingDown size={14} className={impact.color} />
              <span className="text-xs font-bold uppercase tracking-wider">Credit Score Impact</span>
            </div>
            <p className="text-sm text-gray-700">{rec.creditImpactDetail}</p>
          </div>

          {/* Pros & Cons */}
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

          {rec.estimatedMonthlySavings != null && rec.estimatedMonthlySavings > 0 && (
            <div className="mt-4 p-3 border border-black bg-gray-50">
              <span className="swiss-label block mb-1">Estimated Monthly Savings</span>
              <span className="font-black text-2xl">
                ${rec.estimatedMonthlySavings.toLocaleString()}
                <span className="text-sm font-normal text-gray-500 ml-2">/month</span>
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ChatPanel({ resultId, onClose }: { resultId: number; onClose: () => void }) {
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([
    { role: "assistant", content: "Hi! I've reviewed your debt assessment results. What questions do you have about your recommendations? I can explain any of the options in more detail, clarify financial terms, or help you think through the trade-offs." },
  ]);
  const [input, setInput] = useState("");
  const chatMutation = trpc.assessment.chat.useMutation({
    onSuccess: (data) => {
      setMessages(prev => [...prev, { role: "assistant" as const, content: String(data.reply) }]);
    },
  });

  const SUGGESTIONS = [
    "What's the difference between a DMP and debt settlement?",
    "How long will debt settlement affect my credit?",
    "What is a debt-to-income ratio?",
    "Can I qualify for a consolidation loan with my credit score?",
  ];

  function sendMessage(text: string) {
    if (!text.trim() || chatMutation.isPending) return;
    const newMessages = [...messages, { role: "user" as const, content: text }];
    setMessages(newMessages);
    setInput("");
    chatMutation.mutate({
      resultId,
      messages: newMessages.filter(m => m.role !== "assistant" || newMessages.indexOf(m) > 0),
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40">
      <div className="w-full sm:max-w-lg bg-white border border-black flex flex-col" style={{ height: "85vh", maxHeight: 640 }}>
        {/* Chat header */}
        <div className="flex items-center justify-between p-4 border-b border-black">
          <div className="flex items-center gap-3">
            <span className="swiss-accent" />
            <div>
              <p className="font-bold text-sm">Ask Your Debt Advisor</p>
              <p className="text-xs text-gray-500">AI-powered follow-up chat</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 border border-black hover:bg-black hover:text-white transition-colors text-xs font-bold">
            CLOSE
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-xs sm:max-w-sm p-3 text-sm ${msg.role === "user" ? "bg-black text-white" : "border border-black bg-white"}`}>
                {msg.role === "assistant" ? (
                  <Streamdown className="prose prose-sm max-w-none">{msg.content}</Streamdown>
                ) : (
                  <p>{msg.content}</p>
                )}
              </div>
            </div>
          ))}
          {chatMutation.isPending && (
            <div className="flex justify-start">
              <div className="border border-black p-3 flex items-center gap-2">
                <span className="inline-block w-3 h-3 border-2 border-black border-t-transparent rounded-full animate-spin" />
                <span className="text-xs text-gray-500">Thinking...</span>
              </div>
            </div>
          )}
        </div>

        {/* Suggestions */}
        {messages.length <= 2 && (
          <div className="px-4 pb-2">
            <p className="swiss-label mb-2">Suggested questions</p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.map((s, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(s)}
                  className="text-xs border border-black px-2 py-1 hover:bg-black hover:text-white transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t border-black flex gap-2">
          <input
            className="swiss-input flex-1 text-sm py-2"
            placeholder="Ask a question..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && sendMessage(input)}
            disabled={chatMutation.isPending}
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || chatMutation.isPending}
            className="btn-swiss btn-swiss-red px-4 py-2 text-xs disabled:opacity-40"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

function ShareButton({ resultId, assessmentId }: { resultId: number; assessmentId: number }) {
  const [copied, setCopied] = useState(false);
  const shareMutation = trpc.assessment.createShareLink.useMutation({
    onSuccess: (data) => {
      const url = `${window.location.origin}/share/${data.token}`;
      navigator.clipboard.writeText(url).then(() => {
        setCopied(true);
        toast.success("Share link copied to clipboard!");
        setTimeout(() => setCopied(false), 3000);
      });
    },
  });

  return (
    <button
      onClick={() => shareMutation.mutate({ resultId, assessmentId })}
      disabled={shareMutation.isPending}
      className="btn-swiss flex items-center gap-2 text-xs"
    >
      {copied ? <Check size={14} /> : <Share2 size={14} />}
      {copied ? "Copied!" : shareMutation.isPending ? "Generating..." : "Share Results"}
    </button>
  );
}

function PrintButton({ result }: { result: RecommendationResult }) {
  const printRef = useRef<HTMLDivElement>(null);

  function handlePrint() {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Debt Relief Assessment — DebtConsolidationApp.com</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 11pt; color: #171717; background: white; padding: 40px; }
    h1 { font-size: 24pt; font-weight: 900; letter-spacing: -0.03em; margin-bottom: 4px; }
    h2 { font-size: 14pt; font-weight: 800; margin-bottom: 8px; margin-top: 24px; }
    h3 { font-size: 12pt; font-weight: 700; margin-bottom: 4px; }
    .header { border-bottom: 2px solid #171717; padding-bottom: 16px; margin-bottom: 24px; }
    .accent { display: inline-block; width: 16px; height: 16px; background: #CC1F1F; margin-right: 8px; vertical-align: middle; }
    .label { font-size: 7pt; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; color: #666; }
    .summary { background: #f7f7f7; border-left: 3px solid #CC1F1F; padding: 12px 16px; margin-bottom: 24px; font-size: 11pt; line-height: 1.6; }
    .profile-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 24px; border: 1px solid #171717; }
    .profile-item { padding: 8px 12px; border-right: 1px solid #eee; }
    .profile-item:nth-child(even) { border-right: none; }
    .option { border: 1px solid #171717; margin-bottom: 16px; padding: 16px; page-break-inside: avoid; }
    .option.rank-1 { border: 2px solid #CC1F1F; }
    .score { display: inline-flex; align-items: center; justify-content: center; width: 48px; height: 48px; background: #171717; color: white; font-weight: 900; font-size: 16pt; }
    .score.top { background: #CC1F1F; }
    .option-header { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 8px; }
    .tag { display: inline-block; font-size: 7pt; font-weight: 700; padding: 2px 6px; text-transform: uppercase; letter-spacing: 0.1em; }
    .tag-risk { background: #fee2e2; color: #b91c1c; }
    .tag-top { background: #CC1F1F; color: white; }
    .warning { background: #fee2e2; border: 1px solid #CC1F1F; padding: 10px 12px; margin: 8px 0; font-size: 10pt; }
    .pros-cons { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 12px; }
    ul { padding-left: 16px; }
    li { font-size: 10pt; line-height: 1.5; margin-bottom: 4px; }
    .disclaimer { border-top: 1px solid #171717; margin-top: 32px; padding-top: 16px; font-size: 9pt; color: #666; line-height: 1.6; }
    .footer { margin-top: 24px; font-size: 9pt; color: #999; }
    @media print { body { padding: 20px; } }
  </style>
</head>
<body>
  <div class="header">
    <div><span class="accent"></span><span style="font-size:8pt;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;">DebtConsolidationApp.com</span></div>
    <h1>Debt Relief Assessment</h1>
    <p class="label">Personalized Recommendations — ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
  </div>

  <div class="summary">${result.summary}</div>

  <h2>Your Financial Profile</h2>
  <div class="profile-grid">
    <div class="profile-item"><div class="label">Total Debt</div><strong>$${result.assessmentInput.totalDebt.toLocaleString()}</strong></div>
    <div class="profile-item"><div class="label">Monthly Income</div><strong>$${result.assessmentInput.monthlyIncome.toLocaleString()}</strong></div>
    <div class="profile-item"><div class="label">Monthly Expenses</div><strong>$${result.assessmentInput.monthlyExpenses.toLocaleString()}</strong></div>
    <div class="profile-item"><div class="label">Disposable Income</div><strong>$${result.disposableIncome.toLocaleString()}/mo</strong></div>
    <div class="profile-item"><div class="label">Credit Score</div><strong>${CREDIT_SCORE_LABELS[result.assessmentInput.creditScoreRange]}</strong></div>
    <div class="profile-item"><div class="label">Creditors</div><strong>${result.assessmentInput.numberOfCreditors}</strong></div>
    <div class="profile-item"><div class="label">Home Purchase</div><strong>${HOME_TIMELINE_LABELS[result.assessmentInput.homePurchaseTimeline]}</strong></div>
    <div class="profile-item"><div class="label">Debt-to-Income</div><strong>${(result.debtToIncomeRatio * 100).toFixed(1)}%</strong></div>
  </div>

  <h2>Ranked Recommendations</h2>
  ${result.recommendations.map(rec => `
    <div class="option ${rec.rank === 1 ? "rank-1" : ""}">
      <div class="option-header">
        <div class="score ${rec.rank === 1 ? "top" : ""}">${rec.suitabilityScore}</div>
        <div>
          <div class="label" style="color:#999;">#${rec.rank} Best Fit &nbsp;•&nbsp; ${rec.estimatedTimeline}</div>
          <h3>${rec.name}</h3>
          ${rec.rank === 1 ? '<span class="tag tag-top">Top Recommendation</span>' : ""}
          ${rec.isAggressive ? '<span class="tag tag-risk" style="margin-left:4px;">High Risk</span>' : ""}
        </div>
      </div>
      <p style="font-size:10pt;line-height:1.6;margin-bottom:8px;">${rec.plainLanguageExplanation}</p>
      ${rec.isAggressive && rec.aggressiveWarning ? `<div class="warning"><strong>⚠ Warning:</strong> ${rec.aggressiveWarning}</div>` : ""}
      <div class="pros-cons">
        <div><div class="label" style="color:#166534;margin-bottom:6px;">Advantages</div><ul>${rec.pros.map(p => `<li>${p}</li>`).join("")}</ul></div>
        <div><div class="label" style="color:#991b1b;margin-bottom:6px;">Disadvantages</div><ul>${rec.cons.map(c => `<li>${c}</li>`).join("")}</ul></div>
      </div>
    </div>
  `).join("")}

  <div class="disclaimer">
    <strong>Important Disclaimer:</strong> This report is generated by an AI tool for educational and informational purposes only. It does not constitute financial, legal, or credit counseling advice. Debt settlement and bankruptcy carry severe long-term consequences including significant credit score damage (100–200+ point drops) and records that remain on your credit report for 7–10 years, making it difficult to qualify for mortgages, car loans, and other credit products. Always consult a licensed financial advisor, nonprofit credit counselor, or bankruptcy attorney before making debt relief decisions.
  </div>
  <div class="footer">Generated by DebtConsolidationApp.com — ${window.location.origin}</div>
</body>
</html>`;

    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.onload = () => {
      printWindow.print();
    };
  }

  return (
    <button onClick={handlePrint} className="btn-swiss flex items-center gap-2 text-xs">
      <Download size={14} />
      Download PDF
    </button>
  );
}

export default function Results() {
  const params = useParams<{ id: string }>();
  const resultId = parseInt(params.id || "0");
  const [chatOpen, setChatOpen] = useState(false);

  const { data: resultRow, isLoading, error } = trpc.assessment.getResult.useQuery(
    { resultId },
    { enabled: !!resultId }
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mb-4" />
          <p className="swiss-label">Loading your results...</p>
        </div>
      </div>
    );
  }

  if (error || !resultRow) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-sm">
          <span className="swiss-accent-xl mx-auto mb-6 block" />
          <h2 className="font-black mb-2">Results Not Found</h2>
          <p className="text-gray-500 text-sm mb-6">This assessment result could not be found.</p>
          <Link href="/assessment">
            <button className="btn-swiss btn-swiss-red text-sm">Start New Assessment</button>
          </Link>
        </div>
      </div>
    );
  }

  const result = resultRow.recommendations as unknown as RecommendationResult;
  const assessmentId = resultRow.assessmentId;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <nav className="border-b border-black sticky top-0 bg-white z-40">
        <div className="swiss-container flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3">
            <span className="swiss-accent" style={{ width: 16, height: 16 }} />
            <span className="font-black text-sm tracking-widest uppercase hidden sm:block">DebtConsolidationApp</span>
          </Link>
          <div className="flex items-center gap-2">
            <a
              href="tel:+18005551234"
              className="btn-swiss btn-swiss-red flex items-center gap-2 text-xs"
            >
              <Phone size={14} />
              <span className="hidden sm:inline">Talk to a Specialist</span>
              <span className="sm:hidden">Call Free</span>
            </a>
            <ShareButton resultId={resultId} assessmentId={assessmentId} />
            <PrintButton result={result} />
            <button
              onClick={() => setChatOpen(true)}
              className="btn-swiss flex items-center gap-2 text-xs"
            >
              <MessageCircle size={14} />
              <span className="hidden sm:inline">Ask AI</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Above-the-fold specialist CTA banner */}
      <div className="bg-black text-white">
        <div className="swiss-container py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-red-600 flex-shrink-0" />
            <p className="text-sm font-semibold">Your results are ready — a licensed debt specialist can help you act on them.</p>
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

      <div className="swiss-container py-12">
        {/* Back link */}
        <Link href="/assessment" className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gray-500 hover:text-black transition-colors mb-8">
          <ArrowLeft size={14} />
          New Assessment
        </Link>

        {/* Results header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 border border-black mb-12">
          <div className="lg:col-span-8 p-8 lg:border-r border-black">
            <div className="flex items-center gap-3 mb-4">
              <span className="swiss-accent" />
              <span className="swiss-label">Your Personalized Results</span>
            </div>
            <h1 className="font-black text-3xl mb-4">Debt Relief Recommendations</h1>
            <p className="text-gray-700 leading-relaxed">{result.summary}</p>
          </div>
          <div className="lg:col-span-4 p-8 bg-gray-50">
            <p className="swiss-label mb-4">Your Profile</p>
            <div className="space-y-3">
              {[
                ["Total Debt", `$${result.assessmentInput.totalDebt.toLocaleString()}`],
                ["Monthly Income", `$${result.assessmentInput.monthlyIncome.toLocaleString()}`],
                ["Disposable Income", `$${result.disposableIncome.toLocaleString()}/mo`],
                ["Debt-to-Income", `${(result.debtToIncomeRatio * 100).toFixed(1)}%`],
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

        {/* Ranked options */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="swiss-accent" />
            <span className="swiss-label">All 5 Options — Ranked by Suitability</span>
          </div>
          <div className="space-y-4">
            {result.recommendations.map((rec, i) => (
              <OptionCard key={rec.type} rec={rec} index={i} />
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="border-2 border-black p-8 bg-gray-50">
          <div className="flex items-start gap-4">
            <AlertTriangle size={20} className="text-black mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-black text-lg mb-3">Important Disclaimer & Educational Notice</h3>
              <div className="space-y-3 text-sm text-gray-700 leading-relaxed">
                <p>
                  This tool provides <strong>educational information and AI-generated recommendations for informational purposes only</strong>. It does not constitute financial, legal, or credit counseling advice. Always consult a licensed financial advisor, nonprofit credit counselor, or bankruptcy attorney before making debt relief decisions.
                </p>
                <div className="border-l-2 border-red-600 pl-4">
                  <p className="font-bold text-black mb-1">Debt Settlement — Long-Term Credit Consequences</p>
                  <p>Debt settlement typically causes a <strong>credit score drop of 100–200+ points</strong> and remains on your credit report for <strong>7 years</strong>. During the settlement process (typically 2–4 years), you will stop paying creditors, which causes ongoing delinquencies. This makes it extremely difficult to qualify for a mortgage, car loan, or new credit during and after the program. Settled accounts are reported as "settled for less than full amount," which is viewed negatively by future lenders.</p>
                </div>
                <div className="border-l-2 border-red-600 pl-4">
                  <p className="font-bold text-black mb-1">Bankruptcy — Severe and Long-Lasting Impact</p>
                  <p>Chapter 7 bankruptcy remains on your credit report for <strong>10 years</strong>; Chapter 13 for <strong>7 years</strong>. It causes an immediate and severe credit score drop and makes qualifying for a mortgage nearly impossible for at least 2–4 years after discharge. While bankruptcy provides legal protection and can eliminate debt, it should be considered only as a last resort after exhausting all other options.</p>
                </div>
                <p className="text-gray-500 text-xs">
                  Nonprofit credit counseling is available through the National Foundation for Credit Counseling (NFCC) at nfcc.org. Free bankruptcy consultations are available through many legal aid organizations.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Talk to a Specialist CTA */}
        <div className="mt-8 border border-black">
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-black">
            {/* Phone CTA */}
            <div className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-black text-white">
              <div>
                <p className="font-black text-lg mb-1">Talk to a Debt Specialist</p>
                <p className="text-sm text-gray-400">Get a free consultation with a licensed debt specialist who can review your options and help you take the next step.</p>
              </div>
              <a
                href="tel:+18005551234"
                className="btn-swiss border border-white text-white bg-transparent hover:bg-white hover:text-black transition-colors flex items-center gap-2 text-sm whitespace-nowrap flex-shrink-0"
              >
                <Phone size={15} />
                Call Now — Free
              </a>
            </div>
            {/* AI Chat CTA */}
            <div className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="font-bold mb-1">Have questions about your results?</p>
                <p className="text-sm text-gray-500">Our AI advisor can explain any option in detail, clarify financial terms, or explore alternative scenarios.</p>
              </div>
              <button
                onClick={() => setChatOpen(true)}
                className="btn-swiss btn-swiss-red flex items-center gap-2 text-sm whitespace-nowrap flex-shrink-0"
              >
                <MessageCircle size={16} />
                Ask AI
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Chat panel */}
      {chatOpen && (
        <ChatPanel resultId={resultId} onClose={() => setChatOpen(false)} />
      )}
    </div>
  );
}
