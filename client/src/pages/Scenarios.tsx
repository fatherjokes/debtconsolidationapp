import { Link } from "wouter";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { SCENARIO_CATEGORIES, ALL_SCENARIOS } from "@/data/scenarios";

export default function Scenarios() {
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
          <Link href="/">
            <span className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-black transition-colors cursor-pointer">
              <ArrowLeft className="w-4 h-4" />
              Home
            </span>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="border-b border-black bg-black text-white">
        <div className="max-w-5xl mx-auto px-6 py-14">
          <div className="flex items-start gap-4">
            <span className="w-1 h-16 bg-red-600 flex-shrink-0 mt-1" />
            <div>
              <p className="text-red-400 text-xs font-bold uppercase tracking-widest mb-2">
                Educational Scenarios
              </p>
              <h1 className="text-3xl md:text-4xl font-black leading-tight mb-3">
                20 Real-World Debt Scenarios
              </h1>
              <p className="text-gray-300 text-lg leading-relaxed max-w-2xl">
                Explore detailed analyses of common financial situations — each with ranked debt relief options, credit impact assessments, and plain-language explanations.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Stats bar */}
        <div className="grid grid-cols-3 border border-black mb-12">
          {[
            { value: "20", label: "Unique Scenarios" },
            { value: "5", label: "Options Per Scenario" },
            { value: "100+", label: "Factors Analyzed" },
          ].map((stat, i) => (
            <div
              key={i}
              className={`p-6 text-center ${i < 2 ? "border-r border-black" : ""}`}
            >
              <p className="text-3xl font-black text-red-600">{stat.value}</p>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mt-1">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Categories */}
        <div className="space-y-12">
          {SCENARIO_CATEGORIES.map((cat) => (
            <section key={cat.label}>
              <div className="flex items-center gap-3 mb-6">
                <span className="w-4 h-px bg-red-600 flex-shrink-0" />
                <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400">
                  {cat.label}
                </h2>
                <span className="flex-1 h-px bg-gray-100" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {cat.scenarios.map((s) => {
                  const full = ALL_SCENARIOS.find((a) => a.slug === s.slug);
                  return (
                    <Link key={s.slug} href={`/scenarios/${s.slug}`}>
                      <div className="border border-gray-200 p-5 hover:border-black hover:shadow-sm transition-all cursor-pointer group">
                        <p className="text-sm font-bold text-black group-hover:text-red-600 transition-colors mb-2 leading-snug">
                          {s.title}
                        </p>
                        {full && (
                          <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-3">
                            {full.subheadline}
                          </p>
                        )}
                        <span className="text-xs font-bold uppercase tracking-wider text-red-600 flex items-center gap-1 group-hover:gap-2 transition-all">
                          Read Analysis <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        {/* All scenarios grid */}
        <section className="mt-16">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-4 h-px bg-red-600 flex-shrink-0" />
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400">
              All 20 Scenarios
            </h2>
            <span className="flex-1 h-px bg-gray-100" />
          </div>
          <div className="border border-black divide-y divide-gray-100">
            {ALL_SCENARIOS.map((s, i) => (
              <Link key={s.slug} href={`/scenarios/${s.slug}`}>
                <div className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-black text-gray-300 tabular-nums w-5">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <p className="text-sm font-bold text-black group-hover:text-red-600 transition-colors">
                        {s.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">{s.profile.totalDebt} · {s.profile.creditScore}</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-red-600 transition-colors flex-shrink-0" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mt-16 bg-black text-white p-10 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-red-400 mb-3">
            None of these match your situation exactly?
          </p>
          <h3 className="text-2xl font-black mb-4">Get a Personalized Analysis</h3>
          <p className="text-gray-300 text-sm mb-6 max-w-lg mx-auto leading-relaxed">
            Answer 8 questions about your specific financial situation and receive AI-powered recommendations tailored to your exact profile.
          </p>
          <Link href="/assessment">
            <button className="bg-red-600 text-white text-sm font-bold uppercase tracking-widest px-8 py-4 hover:bg-red-700 transition-colors">
              Start Free Assessment →
            </button>
          </Link>
        </section>
      </div>

      {/* Footer */}
      <footer className="border-t border-black mt-16 py-8">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-400">
            © 2025 DebtConsolidationApp.com · Educational content only · Not financial advice
          </p>
          <div className="flex items-center gap-6 text-xs text-gray-400">
            <Link href="/"><span className="hover:text-black cursor-pointer">Home</span></Link>
            <Link href="/assessment"><span className="hover:text-black cursor-pointer">Assessment</span></Link>
            <Link href="/scenarios"><span className="hover:text-black cursor-pointer">Scenarios</span></Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
