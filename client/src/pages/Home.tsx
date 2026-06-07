import { Link } from "wouter";
import { ArrowRight, Shield, Zap, BarChart3, ChevronRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-black">
      {/* ── Navigation ──────────────────────────────────────────────────── */}
      <nav className="border-b border-black">
        <div className="swiss-container flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <span className="swiss-accent-lg" />
            <span className="font-black text-sm tracking-widest uppercase">
              DebtConsolidationApp
            </span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#how-it-works" className="text-xs font-semibold tracking-widest uppercase text-gray-600 hover:text-black transition-colors">
              How It Works
            </a>
            <a href="#options" className="text-xs font-semibold tracking-widest uppercase text-gray-600 hover:text-black transition-colors">
              Options
            </a>
            <Link href="/assessment">
              <button className="btn-swiss btn-swiss-red text-xs px-4 py-2">
                Start Free
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section className="border-b border-black">
        <div className="swiss-container py-20 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            {/* Left column */}
            <div className="lg:col-span-7 lg:border-r border-black lg:pr-16">
              <div className="flex items-center gap-3 mb-8">
                <span className="swiss-accent" />
                <span className="swiss-label">AI-Powered Debt Analysis</span>
              </div>
              <h1 className="font-black mb-6 leading-none">
                Find Your Best<br />
                Path Out of Debt
              </h1>
              <p className="text-lg text-gray-600 mb-10 max-w-lg leading-relaxed">
                Answer 8 questions about your financial situation. Our AI analyzes your profile and ranks every debt relief option — from consolidation loans to bankruptcy — by what actually fits your life.
              </p>
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <Link href="/assessment">
                  <button className="btn-swiss btn-swiss-red flex items-center gap-2 text-sm">
                    Start Your Free Assessment
                    <ArrowRight size={16} />
                  </button>
                </Link>
                <a href="#how-it-works">
                  <button className="btn-swiss text-sm">
                    See How It Works
                  </button>
                </a>
              </div>
              <div className="mt-10 flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <span className="swiss-accent" style={{ width: 8, height: 8 }} />
                  <span className="text-xs text-gray-500 font-medium">Free &amp; Anonymous</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="swiss-accent" style={{ width: 8, height: 8 }} />
                  <span className="text-xs text-gray-500 font-medium">No Sign-up Required</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="swiss-accent" style={{ width: 8, height: 8 }} />
                  <span className="text-xs text-gray-500 font-medium">Results in 60 Seconds</span>
                </div>
              </div>
            </div>

            {/* Right column — stat block */}
            <div className="lg:col-span-5 lg:pl-16 pt-12 lg:pt-0">
              <div className="grid grid-cols-2 gap-0">
                {[
                  { number: "5", label: "Debt Relief Options Analyzed" },
                  { number: "8", label: "Questions to Get Started" },
                  { number: "60s", label: "Average Time to Results" },
                  { number: "100%", label: "Free & Confidential" },
                ].map((stat, i) => (
                  <div
                    key={i}
                    className={`p-6 border-black ${i % 2 === 0 ? "border-r" : ""} ${i < 2 ? "border-b" : ""}`}
                  >
                    <div className="swiss-number text-4xl font-black mb-1">{stat.number}</div>
                    <div className="swiss-label mt-2">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works ────────────────────────────────────────────────── */}
      <section id="how-it-works" className="border-b border-black">
        <div className="swiss-container py-20">
          <div className="flex items-center gap-3 mb-12">
            <span className="swiss-accent" />
            <span className="swiss-label">Process</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 border border-black">
            {[
              {
                step: "01",
                title: "Answer 8 Questions",
                desc: "Tell us your total debt, income, monthly budget, credit score range, number of creditors, home-buying timeline, and what matters most to you.",
                icon: <BarChart3 size={20} />,
              },
              {
                step: "02",
                title: "AI Analyzes Your Profile",
                desc: "Our engine calculates your debt-to-income ratio, disposable income, and credit sensitivity, then scores all five debt relief options against your specific situation.",
                icon: <Zap size={20} />,
              },
              {
                step: "03",
                title: "Get Ranked Recommendations",
                desc: "Receive a personalized report ranking every option by suitability, with plain-language explanations, credit impact, timelines, and a follow-up AI chat.",
                icon: <Shield size={20} />,
              },
            ].map((item, i) => (
              <div
                key={i}
                className={`p-8 lg:p-10 ${i < 2 ? "border-b lg:border-b-0 lg:border-r border-black" : ""}`}
              >
                <div className="flex items-start justify-between mb-6">
                  <span className="font-black text-5xl text-gray-100 leading-none select-none">
                    {item.step}
                  </span>
                  <div className="p-2 border border-black">
                    {item.icon}
                  </div>
                </div>
                <h3 className="font-bold text-xl mb-3">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Options Overview ─────────────────────────────────────────────── */}
      <section id="options" className="border-b border-black bg-gray-50">
        <div className="swiss-container py-20">
          <div className="flex items-center gap-3 mb-4">
            <span className="swiss-accent" />
            <span className="swiss-label">What We Analyze</span>
          </div>
          <h2 className="font-black mb-12 max-w-2xl">
            All Five Debt Relief Options, Ranked for You
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-0 border border-black">
            {[
              {
                name: "Debt Consolidation Loan",
                tag: "Low Risk",
                tagColor: "bg-green-100 text-green-800",
                desc: "Combine multiple debts into one lower-interest loan.",
              },
              {
                name: "Balance Transfer Card",
                tag: "Low Risk",
                tagColor: "bg-green-100 text-green-800",
                desc: "Move high-interest balances to a 0% APR promotional card.",
              },
              {
                name: "Debt Management Plan",
                tag: "Moderate",
                tagColor: "bg-yellow-100 text-yellow-800",
                desc: "Work with a nonprofit credit counselor to reduce rates.",
              },
              {
                name: "Debt Settlement",
                tag: "High Risk",
                tagColor: "bg-red-100 text-red-800",
                desc: "Negotiate to pay less than you owe. Significant credit damage.",
              },
              {
                name: "Bankruptcy",
                tag: "Severe",
                tagColor: "bg-red-200 text-red-900",
                desc: "Legal debt discharge. Stays on credit report 7–10 years.",
              },
            ].map((opt, i) => (
              <div
                key={i}
                className={`p-6 bg-white ${i < 4 ? "border-b md:border-b-0 md:border-r border-black" : ""}`}
              >
                <span className={`text-xs font-bold px-2 py-1 ${opt.tagColor} mb-4 inline-block`}>
                  {opt.tag}
                </span>
                <h4 className="font-bold text-sm mb-2 leading-tight">{opt.name}</h4>
                <p className="text-xs text-gray-500 leading-relaxed">{opt.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 p-6 border border-black bg-white">
            <div className="flex items-start gap-3">
              <span className="swiss-accent mt-1" style={{ width: 8, height: 8, flexShrink: 0 }} />
              <p className="text-sm text-gray-600">
                <strong className="text-black">Important:</strong> Debt settlement and bankruptcy carry severe, long-term credit consequences. Our tool clearly identifies when these options are and are not appropriate for your situation, and always presents lower-risk alternatives first.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────────────────────────────── */}
      <section className="border-b border-black bg-black text-white">
        <div className="swiss-container py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-8">
            <div className="lg:col-span-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="swiss-accent" />
                <span className="swiss-label text-gray-400">Free Assessment</span>
              </div>
              <h2 className="font-black text-white mb-3">
                Ready to Find Your Best Path?
              </h2>
              <p className="text-gray-400 text-lg">
                No sign-up. No credit check. Just answers.
              </p>
            </div>
            <div className="lg:col-span-4 flex justify-start lg:justify-end">
              <Link href="/assessment">
                <button className="btn-swiss btn-swiss-red flex items-center gap-2">
                  Start Free Assessment
                  <ChevronRight size={16} />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer className="border-t border-black">
        <div className="swiss-container py-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="swiss-accent" />
                <span className="font-black text-sm tracking-widest uppercase">DebtConsolidationApp</span>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed max-w-md">
                This tool provides educational information and AI-generated recommendations for informational purposes only. It does not constitute financial, legal, or credit counseling advice. Always consult a licensed financial professional before making debt relief decisions.
              </p>
            </div>
            <div className="lg:col-span-6 flex flex-col lg:items-end justify-between">
              <div className="flex gap-6">
                <Link href="/assessment" className="text-xs font-semibold tracking-widest uppercase text-gray-600 hover:text-black transition-colors">
                  Assessment
                </Link>
                <a href="#how-it-works" className="text-xs font-semibold tracking-widest uppercase text-gray-600 hover:text-black transition-colors">
                  How It Works
                </a>
              </div>
              <p className="text-xs text-gray-400 mt-4">
                © {new Date().getFullYear()} DebtConsolidationApp.com
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
