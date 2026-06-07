import { useState } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, ArrowRight, DollarSign, Users, Home, Target, Shield, TrendingDown } from "lucide-react";
import { trpc } from "@/lib/trpc";
import type {
  CreditScoreRange,
  HomePurchaseTimeline,
  PrimaryPriority,
  RiskTolerance,
} from "../../../shared/types";

interface FormData {
  totalDebt: string;
  monthlyIncome: string;
  monthlyExpenses: string;
  creditScoreRange: CreditScoreRange | "";
  numberOfCreditors: string;
  homePurchaseTimeline: HomePurchaseTimeline | "";
  primaryPriority: PrimaryPriority | "";
  riskTolerance: RiskTolerance | "";
}

const STEPS = [
  { id: 1, label: "Total Debt", icon: DollarSign },
  { id: 2, label: "Income", icon: TrendingDown },
  { id: 3, label: "Budget", icon: Target },
  { id: 4, label: "Credit", icon: Shield },
  { id: 5, label: "Creditors", icon: Users },
  { id: 6, label: "Home Plans", icon: Home },
  { id: 7, label: "Priority", icon: Target },
  { id: 8, label: "Risk", icon: Shield },
];

const initialForm: FormData = {
  totalDebt: "",
  monthlyIncome: "",
  monthlyExpenses: "",
  creditScoreRange: "",
  numberOfCreditors: "",
  homePurchaseTimeline: "",
  primaryPriority: "",
  riskTolerance: "",
};

function formatCurrency(val: string): string {
  const num = parseFloat(val.replace(/[^0-9.]/g, ""));
  if (isNaN(num)) return val;
  return num.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

export default function Assessment() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(initialForm);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [, navigate] = useLocation();

  const analyzeMutation = trpc.assessment.analyze.useMutation({
    onSuccess: (data) => {
      navigate(`/results/${data.resultId}`);
    },
  });

  const totalSteps = STEPS.length;
  const progress = (step / totalSteps) * 100;

  function validate(): boolean {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    if (step === 1) {
      const val = parseFloat(form.totalDebt);
      if (!form.totalDebt || isNaN(val) || val <= 0) newErrors.totalDebt = "Please enter a valid debt amount.";
      else if (val < 100) newErrors.totalDebt = "Minimum debt amount is $100.";
    }
    if (step === 2) {
      const val = parseFloat(form.monthlyIncome);
      if (!form.monthlyIncome || isNaN(val) || val <= 0) newErrors.monthlyIncome = "Please enter your monthly income.";
    }
    if (step === 3) {
      const val = parseFloat(form.monthlyExpenses);
      if (!form.monthlyExpenses || isNaN(val) || val < 0) newErrors.monthlyExpenses = "Please enter your monthly expenses.";
    }
    if (step === 4 && !form.creditScoreRange) newErrors.creditScoreRange = "Please select your credit score range.";
    if (step === 5) {
      const val = parseInt(form.numberOfCreditors);
      if (!form.numberOfCreditors || isNaN(val) || val < 1) newErrors.numberOfCreditors = "Please enter at least 1 creditor.";
    }
    if (step === 6 && !form.homePurchaseTimeline) newErrors.homePurchaseTimeline = "Please select your home-buying timeline.";
    if (step === 7 && !form.primaryPriority) newErrors.primaryPriority = "Please select your primary priority.";
    if (step === 8 && !form.riskTolerance) newErrors.riskTolerance = "Please select your risk tolerance.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleNext() {
    if (!validate()) return;
    if (step < totalSteps) {
      setStep(s => s + 1);
    } else {
      handleSubmit();
    }
  }

  function handleBack() {
    if (step > 1) setStep(s => s - 1);
  }

  function handleSubmit() {
    analyzeMutation.mutate({
      totalDebt: parseFloat(form.totalDebt),
      monthlyIncome: parseFloat(form.monthlyIncome),
      monthlyExpenses: parseFloat(form.monthlyExpenses),
      creditScoreRange: form.creditScoreRange as CreditScoreRange,
      numberOfCreditors: parseInt(form.numberOfCreditors),
      homePurchaseTimeline: form.homePurchaseTimeline as HomePurchaseTimeline,
      primaryPriority: form.primaryPriority as PrimaryPriority,
      riskTolerance: form.riskTolerance as RiskTolerance,
    });
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") handleNext();
  }

  const MoneyInput = ({ field, label, hint }: { field: "totalDebt" | "monthlyIncome" | "monthlyExpenses"; label: string; hint?: string }) => (
    <div>
      <label className="swiss-label block mb-3">{label}</label>
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
        <input
          type="number"
          min="0"
          step="1"
          className="swiss-input pl-8"
          placeholder="0"
          value={form[field]}
          onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
          onKeyDown={handleKeyDown}
          autoFocus
        />
      </div>
      {hint && <p className="text-xs text-gray-500 mt-2">{hint}</p>}
      {errors[field] && <p className="text-xs text-red-600 mt-2 font-medium">{errors[field]}</p>}
    </div>
  );

  const OptionButton = <T extends string>({
    value,
    current,
    label,
    sublabel,
    field,
    warning,
  }: {
    value: T;
    current: string;
    label: string;
    sublabel?: string;
    field: keyof FormData;
    warning?: boolean;
  }) => (
    <button
      type="button"
      onClick={() => {
        setForm(f => ({ ...f, [field]: value }));
        setErrors(e => ({ ...e, [field]: undefined }));
      }}
      className={`w-full text-left p-4 border transition-all duration-150 ${
        current === value
          ? warning
            ? "border-red-600 bg-red-50"
            : "border-black bg-black text-white"
          : "border-black bg-white hover:bg-gray-50"
      }`}
    >
      <div className={`font-bold text-sm ${current === value && !warning ? "text-white" : "text-black"}`}>
        {label}
      </div>
      {sublabel && (
        <div className={`text-xs mt-1 ${current === value && !warning ? "text-gray-300" : "text-gray-500"}`}>
          {sublabel}
        </div>
      )}
    </button>
  );

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="slide-up">
            <div className="flex items-center gap-3 mb-2">
              <span className="swiss-accent" />
              <span className="swiss-label">Step 1 of 8</span>
            </div>
            <h2 className="font-black mb-2">What is your total debt?</h2>
            <p className="text-gray-500 text-sm mb-8">Include all credit cards, personal loans, medical bills, and other unsecured debts. Do not include your mortgage.</p>
            <MoneyInput field="totalDebt" label="Total Unsecured Debt" hint="Example: credit cards, personal loans, medical bills" />
          </div>
        );

      case 2:
        return (
          <div className="slide-up">
            <div className="flex items-center gap-3 mb-2">
              <span className="swiss-accent" />
              <span className="swiss-label">Step 2 of 8</span>
            </div>
            <h2 className="font-black mb-2">What is your monthly income?</h2>
            <p className="text-gray-500 text-sm mb-8">Enter your total take-home pay after taxes. Include all income sources.</p>
            <MoneyInput field="monthlyIncome" label="Monthly Take-Home Income" hint="After-tax income from all sources" />
          </div>
        );

      case 3:
        return (
          <div className="slide-up">
            <div className="flex items-center gap-3 mb-2">
              <span className="swiss-accent" />
              <span className="swiss-label">Step 3 of 8</span>
            </div>
            <h2 className="font-black mb-2">What are your monthly expenses?</h2>
            <p className="text-gray-500 text-sm mb-8">Include rent/mortgage, utilities, groceries, transportation, insurance, and all minimum debt payments.</p>
            <MoneyInput field="monthlyExpenses" label="Total Monthly Expenses" hint="Include all bills and minimum debt payments" />
            {form.monthlyIncome && form.monthlyExpenses && (
              <div className="mt-6 p-4 border border-black bg-gray-50">
                <span className="swiss-label block mb-1">Estimated Disposable Income</span>
                <span className="font-black text-2xl">
                  {formatCurrency(String(Math.max(0, parseFloat(form.monthlyIncome) - parseFloat(form.monthlyExpenses))))}
                  <span className="text-sm font-normal text-gray-500 ml-2">/month</span>
                </span>
              </div>
            )}
          </div>
        );

      case 4:
        return (
          <div className="slide-up">
            <div className="flex items-center gap-3 mb-2">
              <span className="swiss-accent" />
              <span className="swiss-label">Step 4 of 8</span>
            </div>
            <h2 className="font-black mb-2">What is your credit score range?</h2>
            <p className="text-gray-500 text-sm mb-8">An estimate is fine. Your credit score significantly affects which options are available to you.</p>
            <div className="grid grid-cols-1 gap-2">
              {([
                ["excellent", "Excellent", "750 or above"],
                ["good", "Good", "700 – 749"],
                ["fair", "Fair", "650 – 699"],
                ["poor", "Poor", "600 – 649"],
                ["bad", "Bad", "Below 600"],
              ] as [CreditScoreRange, string, string][]).map(([val, label, sub]) => (
                <OptionButton key={val} value={val} current={form.creditScoreRange} label={label} sublabel={sub} field="creditScoreRange" />
              ))}
            </div>
            {errors.creditScoreRange && <p className="text-xs text-red-600 mt-2 font-medium">{errors.creditScoreRange}</p>}
          </div>
        );

      case 5:
        return (
          <div className="slide-up">
            <div className="flex items-center gap-3 mb-2">
              <span className="swiss-accent" />
              <span className="swiss-label">Step 5 of 8</span>
            </div>
            <h2 className="font-black mb-2">How many creditors do you owe?</h2>
            <p className="text-gray-500 text-sm mb-8">Count each separate lender or credit card issuer. This affects which consolidation strategies are most practical.</p>
            <div>
              <label className="swiss-label block mb-3">Number of Creditors</label>
              <input
                type="number"
                min="1"
                max="50"
                className="swiss-input"
                placeholder="e.g. 4"
                value={form.numberOfCreditors}
                onChange={e => setForm(f => ({ ...f, numberOfCreditors: e.target.value }))}
                onKeyDown={handleKeyDown}
                autoFocus
              />
              {errors.numberOfCreditors && <p className="text-xs text-red-600 mt-2 font-medium">{errors.numberOfCreditors}</p>}
            </div>
          </div>
        );

      case 6:
        return (
          <div className="slide-up">
            <div className="flex items-center gap-3 mb-2">
              <span className="swiss-accent" />
              <span className="swiss-label">Step 6 of 8</span>
            </div>
            <h2 className="font-black mb-2">Are you planning to buy a home?</h2>
            <p className="text-gray-500 text-sm mb-8">This is critical. Options like debt settlement and bankruptcy can make it impossible to qualify for a mortgage for years.</p>
            <div className="grid grid-cols-1 gap-2">
              {([
                ["within_1_year", "Yes, within 1 year", "Credit impact is critical — aggressive options are not recommended"],
                ["within_2_years", "Yes, within 2 years", "Credit preservation is very important"],
                ["within_3_years", "Yes, within 3 years", "Some credit impact may be acceptable"],
                ["within_5_years", "Yes, within 5 years", "More options available; credit can recover"],
                ["not_planning", "Not planning to buy", "Credit impact is less of a constraint"],
              ] as [HomePurchaseTimeline, string, string][]).map(([val, label, sub]) => (
                <OptionButton key={val} value={val} current={form.homePurchaseTimeline} label={label} sublabel={sub} field="homePurchaseTimeline" />
              ))}
            </div>
            {errors.homePurchaseTimeline && <p className="text-xs text-red-600 mt-2 font-medium">{errors.homePurchaseTimeline}</p>}
          </div>
        );

      case 7:
        return (
          <div className="slide-up">
            <div className="flex items-center gap-3 mb-2">
              <span className="swiss-accent" />
              <span className="swiss-label">Step 7 of 8</span>
            </div>
            <h2 className="font-black mb-2">What matters most to you?</h2>
            <p className="text-gray-500 text-sm mb-8">Your primary goal shapes which options we rank highest. Choose the one that best reflects your situation.</p>
            <div className="grid grid-cols-1 gap-2">
              {([
                ["speed", "Pay off debt as fast as possible", "I want to be debt-free quickly, even if it costs more"],
                ["credit_preservation", "Preserve my credit score", "Protecting my credit rating is the top priority"],
                ["lowest_payment", "Minimize my monthly payment", "I need to reduce what I pay each month right now"],
              ] as [PrimaryPriority, string, string][]).map(([val, label, sub]) => (
                <OptionButton key={val} value={val} current={form.primaryPriority} label={label} sublabel={sub} field="primaryPriority" />
              ))}
            </div>
            {errors.primaryPriority && <p className="text-xs text-red-600 mt-2 font-medium">{errors.primaryPriority}</p>}
          </div>
        );

      case 8:
        return (
          <div className="slide-up">
            <div className="flex items-center gap-3 mb-2">
              <span className="swiss-accent" />
              <span className="swiss-label">Step 8 of 8</span>
            </div>
            <h2 className="font-black mb-2">What is your risk tolerance?</h2>
            <p className="text-gray-500 text-sm mb-8">Some debt relief options involve significant trade-offs. How comfortable are you with aggressive strategies?</p>
            <div className="grid grid-cols-1 gap-2">
              {([
                ["conservative", "Conservative", "I want the safest path with minimal credit damage and no legal risk"],
                ["moderate", "Moderate", "I'm open to some trade-offs if it means a better outcome"],
                ["aggressive", "Aggressive", "I'm willing to accept significant credit damage or legal processes for the fastest resolution"],
              ] as [RiskTolerance, string, string][]).map(([val, label, sub]) => (
                <OptionButton key={val} value={val} current={form.riskTolerance} label={label} sublabel={sub} field="riskTolerance" warning={val === "aggressive"} />
              ))}
            </div>
            {errors.riskTolerance && <p className="text-xs text-red-600 mt-2 font-medium">{errors.riskTolerance}</p>}
            <div className="mt-6 p-4 border border-black bg-gray-50">
              <p className="text-xs text-gray-600">
                <strong>Note:</strong> Aggressive options such as debt settlement and bankruptcy carry severe, long-term consequences including credit score drops of 100–200+ points and records that remain for 7–10 years. Our recommendations will clearly flag these risks.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <nav className="border-b border-black">
        <div className="swiss-container flex items-center justify-between h-16">
          <a href="/" className="flex items-center gap-3">
            <span className="swiss-accent" style={{ width: 16, height: 16 }} />
            <span className="font-black text-sm tracking-widest uppercase">DebtConsolidationApp</span>
          </a>
          <span className="swiss-label">Free Assessment</span>
        </div>
      </nav>

      {/* Progress bar */}
      <div className="border-b border-black">
        <div className="h-1 bg-gray-100">
          <div
            className="h-full bg-black transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="swiss-container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {STEPS.map((s) => (
                <div
                  key={s.id}
                  className={`step-dot ${s.id === step ? "active" : s.id < step ? "completed" : ""}`}
                />
              ))}
            </div>
            <span className="swiss-label">
              {step} / {totalSteps} — {STEPS[step - 1]?.label}
            </span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="swiss-container py-16">
        <div className="max-w-xl mx-auto">
          {renderStep()}

          {/* Navigation buttons */}
          <div className="flex items-center justify-between mt-12 pt-8 border-t border-black">
            <button
              type="button"
              onClick={handleBack}
              disabled={step === 1}
              className={`btn-swiss flex items-center gap-2 text-sm ${step === 1 ? "opacity-30 cursor-not-allowed" : ""}`}
            >
              <ArrowLeft size={14} />
              Back
            </button>

            <button
              type="button"
              onClick={handleNext}
              disabled={analyzeMutation.isPending}
              className="btn-swiss btn-swiss-red flex items-center gap-2 text-sm"
            >
              {analyzeMutation.isPending ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Analyzing...
                </>
              ) : step === totalSteps ? (
                <>
                  Get My Recommendations
                  <ArrowRight size={14} />
                </>
              ) : (
                <>
                  Continue
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </div>

          {analyzeMutation.isError && (
            <div className="mt-4 p-4 border border-red-600 bg-red-50">
              <p className="text-sm text-red-700 font-medium">
                Something went wrong analyzing your profile. Please try again.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
