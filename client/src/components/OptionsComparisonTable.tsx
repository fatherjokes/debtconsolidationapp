interface OptionsComparisonTableProps {
  highlightOption?: string; // slug of the top recommended option to highlight
}

const OPTIONS = [
  {
    id: "consolidation-loan",
    name: "Debt Consolidation Loan",
    successRate: "70–80%",
    successNote: "High completion when payment is affordable; denied for DTI > 43–50%",
    avgSavings: "20–40%",
    savingsNote: "Interest savings vs. carrying high-APR balances to term",
    timeline: "2–5 years",
    creditImpact: "Minimal",
    creditColor: "text-green-700 bg-green-50",
    creditDetail: "Hard inquiry at application (−5 pts); on-time payments rebuild score over time",
    pros: [
      "Single monthly payment replaces multiple creditors",
      "Fixed interest rate (typically 8–18% APR vs. 20–29% on cards)",
      "No credit score damage if payments are made on time",
      "Predictable payoff date",
    ],
    cons: [
      "Requires credit score of 620+ and DTI below 43–50% to qualify",
      "High-DTI borrowers receive rates of 24–36% APR — no real savings",
      "Does not reduce principal; you repay 100% of what you owe",
      "Secured loans risk collateral if you default",
    ],
    whoItFits: "Good-to-excellent credit (660+), stable income, DTI below 43%, debt under $50K",
    riskLevel: "Low",
    riskColor: "bg-green-100 text-green-800",
  },
  {
    id: "balance-transfer",
    name: "Balance Transfer Card",
    successRate: "40–50%",
    successNote: "Only ~40–50% of users pay off the full balance before the 0% promo period expires",
    avgSavings: "15–30%",
    savingsNote: "Near-total interest savings during promo window; reverts to 20–29% APR if not cleared",
    timeline: "12–21 months",
    creditImpact: "Minimal to Moderate",
    creditColor: "text-yellow-700 bg-yellow-50",
    creditDetail: "Hard inquiry at application; high utilization on new card can temporarily lower score",
    pros: [
      "0% APR promotional period (12–21 months) eliminates interest temporarily",
      "Every dollar paid reduces principal directly",
      "No credit score damage if managed correctly",
      "Fast path to debt-free for disciplined payors",
    ],
    cons: [
      "Requires good credit (670+) to qualify for best offers",
      "Transfer fees of 3–5% of balance",
      "Balance not cleared by promo end reverts to 20–29% APR — often worse than before",
      "Only ~40–50% of users actually pay off the balance in time",
      "Not viable for balances over $15,000–20,000",
    ],
    whoItFits: "Good credit (670+), moderate debt under $15K, strong monthly cash flow, disciplined payoff plan",
    riskLevel: "Medium",
    riskColor: "bg-yellow-100 text-yellow-800",
  },
  {
    id: "dmp",
    name: "Debt Management Plan (DMP)",
    successRate: "25–40%",
    successNote: "60–75% of enrollees drop out before completing the 3–5 year program (NFCC / academic data)",
    avgSavings: "30–50%",
    savingsNote: "Interest rate reductions to 6–9% and waived fees for completers; zero savings for dropouts",
    timeline: "3–5 years",
    creditImpact: "Moderate",
    creditColor: "text-yellow-700 bg-yellow-50",
    creditDetail: "Accounts closed during program hurts utilization ratio; no new credit allowed; score recovers after completion",
    pros: [
      "Creditors reduce interest rates to 6–9% APR (from 20–29%)",
      "Late fees and over-limit fees typically waived",
      "Single monthly payment to the agency",
      "No credit score damage from the enrollment itself",
      "Nonprofit agencies are regulated and fee-capped",
    ],
    cons: [
      "Only 25–40% of enrollees complete the full program",
      "3–5 year commitment with no flexibility for income disruption",
      "All enrolled credit card accounts must be closed",
      "No new credit allowed during the program",
      "Monthly agency fee of $25–$75",
      "Creditor participation is voluntary — not all creditors agree to reduced rates",
      "Unaffordable if DMP payment exceeds disposable income",
    ],
    whoItFits: "Stable income with 20%+ buffer above DMP payment, fair-to-good credit, not yet severely delinquent",
    riskLevel: "Medium",
    riskColor: "bg-yellow-100 text-yellow-800",
  },
  {
    id: "settlement",
    name: "Debt Settlement",
    successRate: "35–55%",
    successNote: "35–55% of enrolled accounts are successfully settled; for-profit firms settle ~65% of accounts for completers (AFCC data)",
    avgSavings: "40–60%",
    savingsNote: "Settle for 40–60 cents on the dollar; net savings after fees (~22%) average 18–38% of original balance",
    timeline: "2–4 years",
    creditImpact: "Severe",
    creditColor: "text-red-700 bg-red-50",
    creditDetail: "Score drops 100–150+ points; settled accounts reported as 'settled for less than full amount'; stays on report 7 years",
    pros: [
      "Settle for 40–60 cents on the dollar — significant principal reduction",
      "Resolves debt in 2–4 years vs. 20–30 years on minimum payments",
      "Saves significantly more total money than minimum payments at high APR",
      "Viable when consolidation loan is denied due to high DTI or poor credit",
      "Social Security and most retirement income cannot be garnished",
      "Credit recovers within 2–4 years of program completion",
    ],
    cons: [
      "Credit score drops 100–150+ points during the program",
      "Settled status remains on credit report for 7 years",
      "Creditors may sue for unpaid balances during the savings period",
      "Forgiven debt over $600 may be taxable as income (IRS Form 1099-C)",
      "Program fees typically 15–25% of enrolled debt",
      "Not all creditors will negotiate — some accounts may go to collections",
      "Cannot buy a home or qualify for new credit during the program",
    ],
    whoItFits: "High DTI (50%+), denied for consolidation loan, paycheck-to-paycheck, debt $25K+, not planning to buy a home within 4 years",
    riskLevel: "High",
    riskColor: "bg-red-100 text-red-800",
  },
  {
    id: "bankruptcy",
    name: "Bankruptcy",
    successRate: "Ch.7: 94% (with attorney) · Ch.13: ~49%",
    successNote: "Chapter 7 discharge rate is 94.1% with an attorney; Chapter 13 completion is ~49% nationally (ABI 2024)",
    avgSavings: "Ch.7: 100% of eligible debt · Ch.13: Partial",
    savingsNote: "Chapter 7 discharges virtually all unsecured debt; Chapter 13 repays a portion over 3–5 years",
    timeline: "Ch.7: 4–6 months · Ch.13: 3–5 years",
    creditImpact: "Catastrophic",
    creditColor: "text-red-800 bg-red-100",
    creditDetail: "Chapter 7 stays on credit report 10 years; Chapter 13 stays 7 years; score drops 130–200+ points",
    pros: [
      "Chapter 7 eliminates virtually all unsecured debt in 4–6 months",
      "Automatic stay immediately stops all collection calls, lawsuits, and garnishments",
      "Fresh financial start — no ongoing payment obligations for Ch.7",
      "Student loans, child support, and recent taxes are NOT dischargeable",
      "Chapter 13 allows keeping assets while restructuring debt",
    ],
    cons: [
      "Chapter 7 stays on credit report for 10 years",
      "Score drops 130–200+ points immediately",
      "Cannot qualify for mortgage, auto loan, or most credit for years",
      "All non-exempt assets may be liquidated in Chapter 7",
      "Chapter 13 has only a ~49% completion rate",
      "Attorney fees: $1,500–$4,000 (Ch.7) or $3,000–$6,000 (Ch.13)",
      "Must pass means test for Chapter 7 eligibility",
      "Public record — visible to employers and landlords",
    ],
    whoItFits: "Overwhelming debt with no realistic repayment path, facing lawsuits or wage garnishment, income below state median (Ch.7 means test)",
    riskLevel: "Extreme",
    riskColor: "bg-red-200 text-red-900",
  },
];

export default function OptionsComparisonTable({ highlightOption }: OptionsComparisonTableProps) {
  return (
    <div className="border border-black bg-white">
      {/* Header */}
      <div className="border-b border-black px-6 py-4 flex items-center gap-3">
        <span className="w-3 h-3 bg-red-600 flex-shrink-0" />
        <h3 className="font-black text-sm tracking-widest uppercase">
          All 5 Options Compared
        </h3>
      </div>

      {/* Context callout */}
      <div className="border-b border-black bg-gray-50 px-6 py-3">
        <p className="text-xs text-gray-600 leading-relaxed">
          <strong>How to read this table:</strong> Credit impact is one factor — not the only factor. Staying in debt for 20+ years at 22% APR costs 2–3× the original balance. Debt settlement, despite its credit hit, can eliminate debt in 2–4 years at 40–60 cents on the dollar. The right option depends on your income stability, DTI, and timeline — not just credit score.
        </p>
      </div>

      {/* Desktop table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="border-b border-black bg-black text-white">
              <th className="text-left px-4 py-3 font-bold uppercase tracking-widest w-44">Option</th>
              <th className="text-left px-4 py-3 font-bold uppercase tracking-widest">Success Rate</th>
              <th className="text-left px-4 py-3 font-bold uppercase tracking-widest">Avg. Savings</th>
              <th className="text-left px-4 py-3 font-bold uppercase tracking-widest">Timeline</th>
              <th className="text-left px-4 py-3 font-bold uppercase tracking-widest">Credit Impact</th>
              <th className="text-left px-4 py-3 font-bold uppercase tracking-widest">Risk</th>
            </tr>
          </thead>
          <tbody>
            {OPTIONS.map((opt, i) => {
              const isHighlighted = highlightOption && opt.id === highlightOption;
              return (
                <tr
                  key={opt.id}
                  className={`border-b border-gray-200 ${isHighlighted ? "bg-red-50" : i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                >
                  <td className="px-4 py-3 font-bold">
                    {isHighlighted && (
                      <span className="inline-block bg-red-600 text-white text-xs px-1.5 py-0.5 font-bold uppercase tracking-widest mr-2 mb-1">
                        Top Pick
                      </span>
                    )}
                    <span className={isHighlighted ? "text-red-700" : ""}>{opt.name}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-black">{opt.successRate}</span>
                    <p className="text-gray-400 mt-0.5 leading-snug">{opt.successNote}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-black">{opt.avgSavings}</span>
                    <p className="text-gray-400 mt-0.5 leading-snug">{opt.savingsNote}</p>
                  </td>
                  <td className="px-4 py-3 font-semibold whitespace-nowrap">{opt.timeline}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-0.5 font-bold rounded-sm ${opt.creditColor}`}>
                      {opt.creditImpact}
                    </span>
                    <p className="text-gray-400 mt-1 leading-snug">{opt.creditDetail}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-0.5 text-xs font-bold rounded-sm ${opt.riskColor}`}>
                      {opt.riskLevel}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="lg:hidden divide-y divide-gray-200">
        {OPTIONS.map((opt) => {
          const isHighlighted = highlightOption && opt.id === highlightOption;
          return (
            <div key={opt.id} className={`p-4 ${isHighlighted ? "bg-red-50" : ""}`}>
              <div className="flex items-start justify-between gap-2 mb-3">
                <div>
                  {isHighlighted && (
                    <span className="inline-block bg-red-600 text-white text-xs px-1.5 py-0.5 font-bold uppercase tracking-widest mb-1">
                      Top Pick
                    </span>
                  )}
                  <h4 className={`font-black text-sm ${isHighlighted ? "text-red-700" : ""}`}>{opt.name}</h4>
                </div>
                <span className={`inline-block px-2 py-0.5 text-xs font-bold rounded-sm flex-shrink-0 ${opt.riskColor}`}>
                  {opt.riskLevel}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs mb-3">
                <div>
                  <p className="text-gray-500 uppercase tracking-widest font-semibold mb-0.5">Success Rate</p>
                  <p className="font-black">{opt.successRate}</p>
                </div>
                <div>
                  <p className="text-gray-500 uppercase tracking-widest font-semibold mb-0.5">Avg. Savings</p>
                  <p className="font-black">{opt.avgSavings}</p>
                </div>
                <div>
                  <p className="text-gray-500 uppercase tracking-widest font-semibold mb-0.5">Timeline</p>
                  <p className="font-semibold">{opt.timeline}</p>
                </div>
                <div>
                  <p className="text-gray-500 uppercase tracking-widest font-semibold mb-0.5">Credit Impact</p>
                  <span className={`inline-block px-1.5 py-0.5 font-bold rounded-sm ${opt.creditColor}`}>
                    {opt.creditImpact}
                  </span>
                </div>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">{opt.successNote}</p>
            </div>
          );
        })}
      </div>

      {/* Pros/Cons detail section */}
      <div className="border-t border-black">
        <div className="px-6 py-4 border-b border-gray-200">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Detailed Pros & Cons by Option</p>
        </div>
        <div className="divide-y divide-gray-100">
          {OPTIONS.map((opt) => {
            const isHighlighted = highlightOption && opt.id === highlightOption;
            return (
              <div key={opt.id} className={`px-6 py-5 ${isHighlighted ? "bg-red-50" : ""}`}>
                <div className="flex items-center gap-3 mb-4">
                  {isHighlighted && <span className="w-2 h-2 bg-red-600 flex-shrink-0" />}
                  <h4 className={`font-black text-sm uppercase tracking-widest ${isHighlighted ? "text-red-700" : ""}`}>
                    {opt.name}
                  </h4>
                  <span className={`ml-auto text-xs px-2 py-0.5 font-bold rounded-sm ${opt.creditColor}`}>
                    Credit: {opt.creditImpact}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Pros */}
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-green-700 mb-2">Pros</p>
                    <ul className="space-y-1.5">
                      {opt.pros.map((pro, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-gray-700">
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0 mt-1.5" />
                          {pro}
                        </li>
                      ))}
                    </ul>
                  </div>
                  {/* Cons */}
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-red-700 mb-2">Cons</p>
                    <ul className="space-y-1.5">
                      {opt.cons.map((con, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-gray-700">
                          <span className="w-1.5 h-1.5 bg-red-500 rounded-full flex-shrink-0 mt-1.5" />
                          {con}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 flex flex-col sm:flex-row gap-4 text-xs">
                  <div>
                    <span className="font-bold uppercase tracking-widest text-gray-500">Best For: </span>
                    <span className="text-gray-700">{opt.whoItFits}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sources footer */}
      <div className="border-t border-black bg-gray-50 px-6 py-3">
        <p className="text-xs text-gray-400 leading-relaxed">
          <strong>Sources:</strong> NFCC (National Foundation for Credit Counseling) DMP completion data · AFCC (American Fair Credit Council) settlement outcomes · American Bankruptcy Institute (ABI) Chapter 13 completion rates · FTC Consumer Sentinel Network · Bankrate balance transfer research. All figures are industry averages; individual results vary.
        </p>
      </div>
    </div>
  );
}
