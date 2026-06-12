import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type SortMode = "savings" | "speed" | "success";

interface OptionData {
  id: string;
  name: string;
  description: string;
  // Savings view
  avgSavingsPct: number;
  avgSavingsNote: string;
  // Speed view
  timelineMonths: number;
  timelineLabel: string;
  timelineNote: string;
  // Success view
  successRate: number;
  successNote: string;
  successSource: string;
  // Shared
  creditImpact: "none" | "minimal" | "moderate" | "severe" | "extreme";
  creditImpactLabel: string;
  caveat: string;
}

const OPTIONS: OptionData[] = [
  {
    id: "settlement",
    name: "Debt Settlement",
    description: "Negotiate to pay 40–60¢ on the dollar. Creditors accept lump-sum payments below the full balance.",
    avgSavingsPct: 54,
    avgSavingsNote: "Avg. 46–54% of enrolled debt settled; net savings ~30–35% after fees (AFCC 2023)",
    timelineMonths: 30,
    timelineLabel: "24–48 months",
    timelineNote: "Accounts settled one by one as funds accumulate in escrow",
    successRate: 35,
    successNote: "~35% of enrollees fully complete the program and settle all accounts (CFPB / CRL data)",
    successSource: "CFPB, Center for Responsible Lending",
    creditImpact: "severe",
    creditImpactLabel: "Severe — 100–150 pt drop, 7 yrs",
    caveat: "Settled accounts reported as 'settled for less than full amount.' Forgiven debt may be taxable income unless insolvent.",
  },
  {
    id: "bankruptcy7",
    name: "Chapter 7 Bankruptcy",
    description: "Legal discharge of most unsecured debt in 4–6 months. Requires passing a means test.",
    avgSavingsPct: 100,
    avgSavingsNote: "100% of eligible unsecured debt discharged — no partial payment required",
    timelineMonths: 5,
    timelineLabel: "4–6 months",
    timelineNote: "Fastest path to a clean slate for qualifying filers",
    successRate: 94,
    successNote: "94.1% discharge rate with an attorney (ABI); ~70% overall including pro se filers",
    successSource: "American Bankruptcy Institute (ABI)",
    creditImpact: "extreme",
    creditImpactLabel: "Extreme — 130–200 pt drop, 10 yrs",
    caveat: "Student loans, child support, alimony, and recent taxes are NOT dischargeable. Requires means test.",
  },
  {
    id: "dmp",
    name: "Debt Management Plan",
    description: "Nonprofit agency negotiates reduced interest rates (avg. 8%) and consolidates payments.",
    avgSavingsPct: 30,
    avgSavingsNote: "Avg. $48,000 saved over life of plan for completers; interest reduced from ~22% to ~8% (NFCC)",
    timelineMonths: 48,
    timelineLabel: "3–5 years",
    timelineNote: "Fixed monthly payment; all accounts paid in full at program end",
    successRate: 32,
    successNote: "Only 25–40% of enrollees complete the full 3–5 year program (NFCC internal data, academic studies)",
    successSource: "NFCC, Journal of Financial Counseling",
    creditImpact: "minimal",
    creditImpactLabel: "Minimal — accounts closed, score improves over time",
    caveat: "60–75% dropout rate. Payment must be affordable every month for 3–5 years. Accounts are closed upon enrollment.",
  },
  {
    id: "consolidation",
    name: "Debt Consolidation Loan",
    description: "Replace multiple high-rate debts with one lower-rate personal loan.",
    avgSavingsPct: 25,
    avgSavingsNote: "Avg. $10,000–$30,000 in interest saved on $25K balance vs. minimum payments (LendingTree 2024)",
    timelineMonths: 36,
    timelineLabel: "2–5 years",
    timelineNote: "Fixed term; loan paid in full at end with no credit damage",
    successRate: 75,
    successNote: "~70–80% of personal loan borrowers pay off on schedule (TransUnion / Experian data)",
    successSource: "TransUnion, Experian",
    creditImpact: "none",
    creditImpactLabel: "None to minimal — score may improve as utilization drops",
    caveat: "Requires DTI below 43–50% and credit score 620+. High-DTI borrowers are often denied or receive rates above 24% APR.",
  },
  {
    id: "balance",
    name: "Balance Transfer Card",
    description: "Move high-interest balances to a 0% APR promotional card for 12–21 months.",
    avgSavingsPct: 18,
    avgSavingsNote: "Avg. $2,000–$6,000 in interest saved on $10K–$15K balance during promo window (Bankrate 2024)",
    timelineMonths: 18,
    timelineLabel: "12–21 months",
    timelineNote: "Must clear full balance before promo period ends or rate resets to 20–29% APR",
    successRate: 45,
    successNote: "~40–50% of cardholders pay off the full balance before the promo period expires (Bankrate / Javelin)",
    successSource: "Bankrate, Javelin Strategy",
    creditImpact: "none",
    creditImpactLabel: "None — hard inquiry only; score recovers quickly",
    caveat: "Requires good credit (670+). Transfer fees 3–5%. Balances not cleared by promo end revert to 20–29% APR.",
  },
];

const CREDIT_COLORS: Record<string, string> = {
  none: "text-emerald-700 bg-emerald-50 border-emerald-200",
  minimal: "text-emerald-700 bg-emerald-50 border-emerald-200",
  moderate: "text-amber-700 bg-amber-50 border-amber-200",
  severe: "text-red-700 bg-red-50 border-red-200",
  extreme: "text-red-900 bg-red-100 border-red-300",
};

const SORT_CONFIGS = {
  savings: {
    label: "Highest Savings",
    description: "Ranked by how much of your original debt you avoid paying back",
    metric: (o: OptionData) => o.avgSavingsPct,
    renderBar: (o: OptionData) => (
      <div className="space-y-1">
        <div className="flex justify-between text-xs font-mono">
          <span className="text-zinc-500">Avg. debt avoided</span>
          <span className="font-bold text-zinc-900">{o.avgSavingsPct}%</span>
        </div>
        <div className="h-2 bg-zinc-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-zinc-900 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${o.avgSavingsPct}%` }}
            transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          />
        </div>
        <p className="text-xs text-zinc-500 leading-snug">{o.avgSavingsNote}</p>
      </div>
    ),
  },
  speed: {
    label: "Fastest Resolution",
    description: "Ranked by how quickly you can be completely out of debt",
    metric: (o: OptionData) => -o.timelineMonths,
    renderBar: (o: OptionData) => {
      const maxMonths = 60;
      const pct = Math.min((o.timelineMonths / maxMonths) * 100, 100);
      return (
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-zinc-500">Time to debt-free</span>
            <span className="font-bold text-zinc-900">{o.timelineLabel}</span>
          </div>
          <div className="h-2 bg-zinc-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-zinc-900 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${100 - pct}%` }}
              transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
            />
          </div>
          <p className="text-xs text-zinc-500 leading-snug">{o.timelineNote}</p>
        </div>
      );
    },
  },
  success: {
    label: "Highest Success Rate",
    description: "Ranked by the percentage of people who complete the program and become debt-free",
    metric: (o: OptionData) => o.successRate,
    renderBar: (o: OptionData) => (
      <div className="space-y-1">
        <div className="flex justify-between text-xs font-mono">
          <span className="text-zinc-500">Completion rate</span>
          <span className="font-bold text-zinc-900">{o.successRate}%</span>
        </div>
        <div className="h-2 bg-zinc-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-zinc-900 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${o.successRate}%` }}
            transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          />
        </div>
        <p className="text-xs text-zinc-500 leading-snug">{o.successNote}</p>
        <p className="text-xs text-zinc-400">Source: {o.successSource}</p>
      </div>
    ),
  },
};

export default function SortableOptionsView() {
  const [mode, setMode] = useState<SortMode>("savings");

  const config = SORT_CONFIGS[mode];
  const sorted = [...OPTIONS].sort((a, b) => config.metric(b) - config.metric(a));

  return (
    <section className="py-20 border-t border-zinc-200">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          <div className="lg:col-span-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 bg-red-600" />
              <span className="text-xs font-mono tracking-widest text-zinc-500 uppercase">Compare Options</span>
            </div>
            <h2 className="text-4xl font-black text-zinc-900 leading-tight">
              All Five Debt Relief Options
            </h2>
          </div>
          <div className="lg:col-span-7 flex flex-col justify-end">
            <p className="text-zinc-600 mb-6">
              The right option depends on what matters most to you. Sort by the factor that fits your situation — some options save more money, others protect your credit, others get you out of debt fastest.
            </p>
            {/* Sort Tabs */}
            <div className="flex flex-wrap gap-2">
              {(Object.keys(SORT_CONFIGS) as SortMode[]).map((key) => (
                <button
                  key={key}
                  onClick={() => setMode(key)}
                  className={`px-4 py-2 text-sm font-mono font-semibold border transition-all duration-150 ${
                    mode === key
                      ? "bg-zinc-900 text-white border-zinc-900"
                      : "bg-white text-zinc-600 border-zinc-300 hover:border-zinc-900 hover:text-zinc-900"
                  }`}
                >
                  {key === "savings" ? "Sort: Most Savings" : key === "speed" ? "Sort: Fastest" : "Sort: Success Rate"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Sort description */}
        <div className="mb-6 px-4 py-3 bg-zinc-50 border border-zinc-200">
          <p className="text-sm text-zinc-600">
            <span className="font-semibold text-zinc-900">Sorted by: {config.label}</span>
            {" — "}{config.description}
          </p>
        </div>

        {/* Option Cards */}
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {sorted.map((option, idx) => (
              <motion.div
                key={option.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25, delay: idx * 0.04, ease: [0.23, 1, 0.32, 1] }}
                className="border border-zinc-200 bg-white hover:border-zinc-400 transition-colors duration-150"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                  {/* Rank + Name */}
                  <div className="lg:col-span-1 flex items-center justify-center border-b lg:border-b-0 lg:border-r border-zinc-200 p-4">
                    <span className="text-3xl font-black text-zinc-200 font-mono">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <div className="lg:col-span-3 p-5 border-b lg:border-b-0 lg:border-r border-zinc-200 flex flex-col justify-center">
                    <h3 className="text-base font-bold text-zinc-900 mb-1">{option.name}</h3>
                    <p className="text-sm text-zinc-500 leading-snug">{option.description}</p>
                  </div>

                  {/* Primary metric bar */}
                  <div className="lg:col-span-4 p-5 border-b lg:border-b-0 lg:border-r border-zinc-200 flex flex-col justify-center">
                    {config.renderBar(option)}
                  </div>

                  {/* Credit impact + caveat */}
                  <div className="lg:col-span-4 p-5 flex flex-col justify-center gap-2">
                    <span className={`inline-flex self-start text-xs font-mono font-semibold px-2 py-1 border ${CREDIT_COLORS[option.creditImpact]}`}>
                      {option.creditImpactLabel}
                    </span>
                    <p className="text-xs text-zinc-500 leading-snug">{option.caveat}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Context note */}
        <div className="mt-8 p-5 border border-zinc-200 bg-zinc-50">
          <p className="text-sm text-zinc-600 leading-relaxed">
            <span className="font-semibold text-zinc-900">Important context: </span>
            Credit score impact is one factor — but it is not the only factor. A borrower paying minimum payments on $40,000 at 22% APR will pay{" "}
            <span className="font-semibold text-zinc-900">$80,000–$120,000 over 20–30 years</span> and never escape the debt cycle. Debt settlement, despite its credit impact, can result in paying{" "}
            <span className="font-semibold text-zinc-900">40–60 cents on the dollar</span> and being debt-free in 2–4 years. Our assessment weighs your full financial picture — not just credit score — to recommend the option that makes the most sense for your life.
          </p>
        </div>

        {/* CTA */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <a
            href="/assessment"
            className="inline-flex items-center justify-center gap-2 bg-red-600 text-white px-8 py-4 text-sm font-mono font-bold tracking-widest uppercase hover:bg-red-700 transition-colors duration-150"
          >
            Get My Personalized Ranking →
          </a>
          <a
            href="/scenarios"
            className="inline-flex items-center justify-center gap-2 border border-zinc-900 text-zinc-900 px-8 py-4 text-sm font-mono font-bold tracking-widest uppercase hover:bg-zinc-900 hover:text-white transition-colors duration-150"
          >
            See Real-World Examples
          </a>
        </div>
      </div>
    </section>
  );
}
