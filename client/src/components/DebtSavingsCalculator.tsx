import { useState, useMemo } from "react";

interface DebtSavingsCalculatorProps {
  defaultDebt?: number;
  defaultApr?: number;
  defaultSettlementPct?: number;
}

function calcMinimumPayments(
  balance: number,
  apr: number,
  minPctOfBalance = 0.02,
  minFloor = 25
): { months: number; totalPaid: number; totalInterest: number } {
  const monthlyRate = apr / 100 / 12;
  let bal = balance;
  let totalPaid = 0;
  let months = 0;
  const maxMonths = 600; // 50 years cap

  while (bal > 0.01 && months < maxMonths) {
    const interest = bal * monthlyRate;
    const payment = Math.max(bal * minPctOfBalance, minFloor, interest + 0.01);
    const actualPayment = Math.min(payment, bal + interest);
    totalPaid += actualPayment;
    bal = bal + interest - actualPayment;
    months++;
  }

  return { months, totalPaid, totalInterest: totalPaid - balance };
}

function calcSettlement(
  balance: number,
  settlementPct: number,
  programFeesPct = 0.22
): { settledAmount: number; fees: number; totalCost: number; totalSaved: number } {
  const settledAmount = balance * (settlementPct / 100);
  const fees = balance * programFeesPct;
  const totalCost = settledAmount + fees;
  const totalSaved = balance - totalCost;
  return { settledAmount, fees, totalCost, totalSaved: Math.max(totalSaved, 0) };
}

function formatCurrency(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}

function formatYearsMonths(months: number) {
  const y = Math.floor(months / 12);
  const m = months % 12;
  if (y === 0) return `${m} months`;
  if (m === 0) return `${y} year${y > 1 ? "s" : ""}`;
  return `${y} yr ${m} mo`;
}

export default function DebtSavingsCalculator({
  defaultDebt = 35000,
  defaultApr = 24,
  defaultSettlementPct = 50,
}: DebtSavingsCalculatorProps) {
  const [debt, setDebt] = useState(defaultDebt);
  const [apr, setApr] = useState(defaultApr);
  const [settlementPct, setSettlementPct] = useState(defaultSettlementPct);

  const minPay = useMemo(() => calcMinimumPayments(debt, apr), [debt, apr]);
  const settlement = useMemo(() => calcSettlement(debt, settlementPct), [debt, settlementPct]);

  // Settlement program is typically 24–48 months
  const settlementMonths = 36;
  const netSavings = minPay.totalPaid - settlement.totalCost;
  const savingsPct = minPay.totalPaid > 0 ? (netSavings / minPay.totalPaid) * 100 : 0;

  // Bar chart widths — normalize to the larger of the two
  const maxBar = Math.max(minPay.totalPaid, settlement.totalCost);
  const minPayWidth = (minPay.totalPaid / maxBar) * 100;
  const settlementWidth = (settlement.totalCost / maxBar) * 100;

  return (
    <div className="border border-black bg-white">
      {/* Header */}
      <div className="border-b border-black px-6 py-4 flex items-center gap-3">
        <span className="w-3 h-3 bg-red-600 flex-shrink-0" />
        <h3 className="font-black text-sm tracking-widest uppercase">
          Debt Savings Calculator
        </h3>
      </div>

      <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* ── Inputs ── */}
        <div className="space-y-6">
          <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold">Adjust Your Numbers</p>

          {/* Total Debt */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold uppercase tracking-widest">Total Debt</label>
              <span className="font-black text-lg text-red-600">{formatCurrency(debt)}</span>
            </div>
            <input
              type="range"
              min={5000}
              max={150000}
              step={1000}
              value={debt}
              onChange={(e) => setDebt(Number(e.target.value))}
              className="w-full accent-red-600 cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>$5,000</span><span>$150,000</span>
            </div>
          </div>

          {/* APR */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold uppercase tracking-widest">Average APR</label>
              <span className="font-black text-lg text-red-600">{apr}%</span>
            </div>
            <input
              type="range"
              min={10}
              max={36}
              step={0.5}
              value={apr}
              onChange={(e) => setApr(Number(e.target.value))}
              className="w-full accent-red-600 cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>10%</span><span>36%</span>
            </div>
          </div>

          {/* Settlement % */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold uppercase tracking-widest">Settlement Rate</label>
              <span className="font-black text-lg text-red-600">{settlementPct}¢ on the $</span>
            </div>
            <input
              type="range"
              min={30}
              max={70}
              step={5}
              value={settlementPct}
              onChange={(e) => setSettlementPct(Number(e.target.value))}
              className="w-full accent-red-600 cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>30¢ (best case)</span><span>70¢ (worst case)</span>
            </div>
          </div>

          <p className="text-xs text-gray-400 leading-relaxed border-l-2 border-gray-200 pl-3">
            Settlement rate reflects the negotiated payoff as a percentage of the original balance. Industry average is 40–60 cents on the dollar. Program fees of ~22% of enrolled debt are included in the settlement total.
          </p>
        </div>

        {/* ── Results ── */}
        <div className="space-y-6">
          <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold">Side-by-Side Comparison</p>

          {/* Visual bars */}
          <div className="space-y-4">
            {/* Minimum payments bar */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs font-bold uppercase tracking-widest text-gray-700">Minimum Payments Only</span>
                <span className="text-xs font-black text-gray-900">{formatCurrency(minPay.totalPaid)}</span>
              </div>
              <div className="h-8 bg-gray-100 relative overflow-hidden">
                <div
                  className="h-full bg-gray-800 transition-all duration-500"
                  style={{ width: `${minPayWidth}%` }}
                />
                <div className="absolute inset-0 flex items-center px-3">
                  <span className="text-xs text-white font-bold drop-shadow">
                    {formatYearsMonths(minPay.months)} · {formatCurrency(minPay.totalInterest)} in interest
                  </span>
                </div>
              </div>
            </div>

            {/* Settlement bar */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs font-bold uppercase tracking-widest text-red-700">Debt Settlement Program</span>
                <span className="text-xs font-black text-red-700">{formatCurrency(settlement.totalCost)}</span>
              </div>
              <div className="h-8 bg-red-50 relative overflow-hidden">
                <div
                  className="h-full bg-red-600 transition-all duration-500"
                  style={{ width: `${settlementWidth}%` }}
                />
                <div className="absolute inset-0 flex items-center px-3">
                  <span className="text-xs text-white font-bold drop-shadow">
                    ~{formatYearsMonths(settlementMonths)} · {formatCurrency(settlement.fees)} in fees
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Key metrics grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="border border-black p-3">
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">You Could Save</p>
              <p className="font-black text-2xl text-red-600">{formatCurrency(Math.max(netSavings, 0))}</p>
              <p className="text-xs text-gray-500 mt-0.5">vs. minimum payments</p>
            </div>
            <div className="border border-black p-3">
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Savings Rate</p>
              <p className="font-black text-2xl text-red-600">{Math.max(savingsPct, 0).toFixed(0)}%</p>
              <p className="text-xs text-gray-500 mt-0.5">less than min. payments</p>
            </div>
            <div className="border border-black p-3">
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Time to Debt-Free</p>
              <div className="flex items-end gap-2">
                <p className="font-black text-lg text-red-600">{formatYearsMonths(settlementMonths)}</p>
                <p className="text-xs text-gray-400 mb-0.5">vs. {formatYearsMonths(minPay.months)}</p>
              </div>
            </div>
            <div className="border border-black p-3">
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Interest Avoided</p>
              <p className="font-black text-lg text-red-600">{formatCurrency(minPay.totalInterest)}</p>
              <p className="text-xs text-gray-500 mt-0.5">never paid to creditors</p>
            </div>
          </div>

          {/* Disclaimer */}
          <p className="text-xs text-gray-400 leading-relaxed border-l-2 border-red-200 pl-3">
            <strong className="text-gray-600">Important:</strong> These are estimates for educational purposes. Actual results vary based on creditor negotiations, credit score impact, and individual circumstances. Debt settlement will negatively impact your credit score for 2–4 years.
          </p>
        </div>
      </div>

      {/* Minimum payment breakdown callout */}
      {minPay.months >= 240 && (
        <div className="border-t border-black bg-gray-50 px-6 py-4">
          <div className="flex items-start gap-3">
            <span className="w-2 h-2 bg-red-600 flex-shrink-0 mt-1" />
            <p className="text-xs text-gray-700 leading-relaxed">
              <strong>At minimum payments, this debt would take {formatYearsMonths(minPay.months)} to pay off</strong> — and you would pay {formatCurrency(minPay.totalPaid)} total on a {formatCurrency(debt)} balance. That is {((minPay.totalPaid / debt)).toFixed(1)}× what you originally borrowed. Debt settlement resolves this in ~3 years for significantly less.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
