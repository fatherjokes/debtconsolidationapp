import { Link } from "wouter";
import { ArrowLeft, BookOpen, ExternalLink, Phone, Award, Users, TrendingDown, FileText } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-white text-black">
      {/* Nav */}
      <nav className="border-b border-black sticky top-0 bg-white z-40">
        <div className="swiss-container flex items-center justify-between h-16">
          <Link href="/">
            <span className="flex items-center gap-3 cursor-pointer">
              <span className="swiss-accent" style={{ width: 16, height: 16 }} />
              <span className="font-black text-sm tracking-widest uppercase hidden sm:block">DebtConsolidationApp</span>
            </span>
          </Link>
          <Link href="/assessment">
            <button className="btn-swiss btn-swiss-red text-xs px-4 py-2">
              Start Free Assessment
            </button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="border-b border-black bg-black text-white">
        <div className="swiss-container py-16">
          <Link href="/">
            <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gray-400 hover:text-white transition-colors mb-10 cursor-pointer w-fit">
              <ArrowLeft size={14} />
              Back to Home
            </span>
          </Link>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            <div className="lg:col-span-8 lg:border-r border-gray-700 lg:pr-16">
              <div className="flex items-center gap-3 mb-6">
                <span className="w-4 h-4 bg-red-600 flex-shrink-0" />
                <span className="text-xs font-bold uppercase tracking-widest text-red-400">About This Tool</span>
              </div>
              <h1 className="font-black text-4xl md:text-5xl leading-none mb-6">
                Built by Someone Who<br />Has Seen It All
              </h1>
              <p className="text-gray-300 text-lg leading-relaxed max-w-2xl">
                DebtConsolidationApp.com was created by Adam Tijerina — a San Antonio-based personal finance expert with over 15 years of experience helping consumers navigate debt relief, credit, and financial recovery.
              </p>
            </div>
            <div className="lg:col-span-4 lg:pl-16 pt-10 lg:pt-0">
              <div className="space-y-6">
                {[
                  { stat: "15+", label: "Years in Personal Finance" },
                  { stat: "9", label: "Years at National Debt Relief" },
                  { stat: "2", label: "Published Books" },
                  { stat: "1000s", label: "Consumers Helped" },
                ].map(({ stat, label }) => (
                  <div key={label} className="border-l-2 border-red-600 pl-4">
                    <p className="font-black text-3xl leading-none">{stat}</p>
                    <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mt-1">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="swiss-container py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

          {/* Main bio */}
          <div className="lg:col-span-8 space-y-12">

            {/* Who is Adam */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <span className="w-4 h-px bg-red-600 inline-block" />
                <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Background</span>
              </div>
              <h2 className="font-black text-2xl mb-5">Adam Tijerina — Personal Finance Expert & Consumer Advocate</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  Adam Tijerina was born and raised in San Antonio, Texas, where he continues to live with his wife and family. His career in personal finance spans more than 15 years, during which he has written hundreds of articles, been quoted as an expert in national publications, and worked directly inside one of the country's largest debt relief companies.
                </p>
                <p>
                  For <strong>9 years at National Debt Relief</strong>, Adam served as a consumer advocate and marketing manager, working at the intersection of debt relief operations and consumer education. He helped develop the affiliate program that generated thousands of enrolled clients, ran conversion optimization on landing pages that helped consumers understand their debt relief options, and built email campaigns that re-engaged people who needed help but hadn't yet taken action. His work gave him a ground-level view of how real Americans fall into debt — and what actually helps them get out.
                </p>
                <p>
                  Alongside his role at National Debt Relief, Adam ran <strong>Debt Consolidation USA</strong>, a consumer finance education platform where he published practical, plain-language guides on budgeting, credit card debt, divorce finances, and debt consolidation. His writing was distributed through PRWeb, featured on <strong>Credit.com</strong>, and syndicated across personal finance publications including JenningsWire and Yahoo Finance.
                </p>
                <p>
                  Today, Adam works as an independent <strong>marketing consultant</strong> for debt consolidation and debt relief companies, applying his decade of inside-industry knowledge to help those companies reach and educate consumers more effectively. DebtConsolidationApp.com is the centerpiece of that work — a free assessment tool that connects people with the right type of debt relief provider based on their actual financial profile, generating qualified leads for the companies Adam works with.
                </p>
                <p>
                  Adam's philosophy is straightforward: most people searching for a debt consolidation loan don't actually qualify for one — and the industry does a poor job of telling them that upfront. This tool was built to change that. It gives every visitor an honest, AI-powered assessment of all five debt relief paths, ranked by what actually fits their financial profile, not by what earns the highest referral fee.
                </p>
              </div>
            </section>

            {/* Career highlights */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <span className="w-4 h-px bg-red-600 inline-block" />
                <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Career Highlights</span>
              </div>
              <div className="space-y-0 border border-black">
                {[
                  {
                    icon: <TrendingDown size={18} />,
                    title: "9 Years — National Debt Relief",
                    role: "Consumer Advocate & Marketing Manager",
                    description: "Worked inside one of the nation's largest debt settlement companies, managing consumer education, affiliate partnerships, and digital marketing. Helped thousands of consumers understand and enroll in debt relief programs. Managed an affiliate program that generated 3,800+ enrolled clients at 14% under target acquisition costs.",
                  },
                  {
                    icon: <FileText size={18} />,
                    title: "Debt Consolidation USA",
                    role: "Founder & Personal Finance Writer",
                    description: "Built and operated a consumer finance education platform covering debt consolidation, credit card management, budgeting, and financial recovery. Published hundreds of articles distributed via PRWeb and syndicated to national outlets. Featured as a personal finance expert on Credit.com.",
                  },
                  {
                    icon: <Users size={18} />,
                    title: "National Media Contributor",
                    role: "Quoted Expert — Yahoo Finance, Credit.com, JenningsWire",
                    description: "Quoted as a consumer debt expert in Yahoo Finance on the gender debt gap, contributed practical financial advice to JenningsWire, and was cited across multiple national personal finance publications on topics including credit card debt, impulse spending, and debt consolidation strategy.",
                  },
                  {
                    icon: <Award size={18} />,
                    title: "LendIt USA 2015",
                    role: "Strategic Partnerships — Marketplace Lending Conference",
                    description: "Represented National Debt Relief at LendIt USA, the leading marketplace lending conference, developing strategic partnerships with marketplace lenders and building relationships across the fintech and consumer lending ecosystem.",
                  },
                  {
                    icon: <Users size={18} />,
                    title: "Marketing Consultant — Debt Relief Industry",
                    role: "Current Role",
                    description: "After leaving National Debt Relief, Adam now works independently as a marketing consultant for debt consolidation and debt relief companies. He leverages his 15+ years of consumer finance expertise and deep industry relationships to help companies reach consumers who genuinely need their services. DebtConsolidationApp.com is his flagship lead generation platform, connecting pre-qualified consumers with the right type of debt relief provider.",
                  },
                ].map(({ icon, title, role, description }, i) => (
                  <div key={i} className={`p-6 ${i < 4 ? "border-b border-black" : ""}`}>
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-black text-white flex items-center justify-center flex-shrink-0">
                        {icon}
                      </div>
                      <div>
                        <p className="font-black text-base">{title}</p>
                        <p className="text-xs font-bold uppercase tracking-widest text-red-600 mb-2">{role}</p>
                        <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Books */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <span className="w-4 h-px bg-red-600 inline-block" />
                <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Published Books</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  {
                    title: "Getting Through the Muck: Personal Stories of Overcoming Hard Times",
                    year: "2015",
                    publisher: "CreateSpace Independent Publishing Platform",
                    description: "A collection of inspiring personal stories covering career challenges, health setbacks, financial hardship, and life transitions. Adam contributed a chapter drawing on his personal finance expertise, offering practical guidance alongside motivational narratives. Described by readers as \"full of inspiring and motivating stories to find hope in many different situations.\"",
                    isbn: "978-1507791837",
                    url: "https://www.amazon.com/dp/1507791836",
                  },
                  {
                    title: "Inside Greatness: How Ordinary People Do Extraordinary Things",
                    year: "2015",
                    publisher: "Multi-author anthology (Kindle)",
                    description: "A 368-page anthology featuring contributors who have mastered their crafts — from marketing and productivity to personal finance and creative skills. Adam contributed a chapter on personal finance and debt management, sharing practical insights on how everyday consumers can take control of their financial lives.",
                    isbn: "B00SVS3GFE",
                    url: "https://www.amazon.com/dp/B00SVS3GFE",
                  },
                ].map(({ title, year, publisher, description, isbn, url }) => (
                  <div key={isbn} className="border border-black p-6">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-10 h-10 bg-red-600 text-white flex items-center justify-center flex-shrink-0">
                        <BookOpen size={18} />
                      </div>
                      <div>
                        <p className="font-black text-sm leading-tight">{title}</p>
                        <p className="text-xs text-gray-400 mt-1">{year} · {publisher}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed mb-4">{description}</p>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-black hover:text-red-600 transition-colors"
                    >
                      <ExternalLink size={12} />
                      View on Amazon
                    </a>
                  </div>
                ))}
              </div>
            </section>

            {/* Personal Debt Journey */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <span className="w-4 h-px bg-red-600 inline-block" />
                <span className="text-xs font-bold uppercase tracking-widest text-gray-400">My Debt Journey</span>
              </div>
              <h2 className="font-black text-2xl mb-5">I've Been Where You Are</h2>

              {/* Timeline */}
              <div className="space-y-0 border-l-2 border-black ml-3">
                {[
                  {
                    year: "2008",
                    label: "The Starting Point",
                    color: "bg-black",
                    body: "Adam started The Credit Blogger — a public, real-time journal of his own debt payoff journey — with $62,124 in credit card debt spread across five cards: Bank of America, Chase, AT&T Universal, USAA, and Discover. As a self-employed freelancer and web developer, he was determined to pay it all off through discipline and the debt snowball method.",
                  },
                  {
                    year: "2009",
                    label: "The Crisis Hits",
                    color: "bg-red-600",
                    body: "A perfect storm arrived: unexpected medical bills for his daughter, an IRS self-employment tax bill approaching $9,000, student loans coming off deferment, and a drop in freelance income. Monthly credit card payments exceeded $1,000 — more than he could sustain. He began researching bankruptcy and debt settlement, and by late summer 2009 he stopped making credit card payments entirely.",
                  },
                  {
                    year: "2009–2010",
                    label: "Going Through Debt Settlement",
                    color: "bg-red-600",
                    body: "Adam used a DIY debt settlement program called ZipDebt to navigate the process himself. For 3–4 months, no creditor would negotiate. The collection calls were relentless. But after 5–6 months, Bank of America, Chase, and Citibank agreed to settle. He settled over $43,000 in credit card debt for $13,000 — using money from family, a whole life insurance policy, and savings. Discover Card did not settle.",
                  },
                  {
                    year: "2011",
                    label: "The Road Back",
                    color: "bg-gray-700",
                    body: "With the settled accounts behind him, Adam turned to the remaining balances: USAA, Discover, Capital One, an IRS payment plan of $450/month, and over $35,000 in student loans. He documented each step publicly, sharing the real numbers — not a polished success story, but the messy, honest reality of rebuilding after a financial crisis.",
                  },
                  {
                    year: "2013+",
                    label: "Turning Experience Into Expertise",
                    color: "bg-black",
                    body: "Having lived through the full spectrum of debt relief — from disciplined payoff to DIY settlement to IRS payment plans — Adam joined National Debt Relief, where he spent 9 years helping other consumers navigate the same decisions he had faced. His personal journey gave him something no training manual could: he knew exactly what it felt like to get those collection calls, to weigh bankruptcy against settlement, and to wonder which path was actually right.",
                  },
                ].map(({ year, label, color, body }, i) => (
                  <div key={i} className="relative pl-8 pb-10 last:pb-0">
                    <span className={`absolute left-0 top-1 w-4 h-4 ${color} -translate-x-[9px] flex-shrink-0`} />
                    <p className="text-xs font-bold uppercase tracking-widest text-red-600 mb-1">{year}</p>
                    <p className="font-black text-base mb-2">{label}</p>
                    <p className="text-sm text-gray-600 leading-relaxed">{body}</p>
                  </div>
                ))}
              </div>

              {/* Pull quote */}
              <blockquote className="mt-10 border-l-4 border-red-600 pl-6 py-2">
                <p className="text-lg font-black leading-snug mb-2">
                  "I settled over $43,000 in credit card debt for $13,000. I know what that process actually looks like from the inside — and I know what the industry doesn't tell you."
                </p>
                <footer className="text-xs font-bold uppercase tracking-widest text-gray-400">— Adam Tijerina, TheCreditBlogger.com</footer>
              </blockquote>
            </section>

            {/* Why this tool */}
            <section className="border-2 border-black p-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-4 h-4 bg-red-600 flex-shrink-0" />
                <span className="text-xs font-bold uppercase tracking-widest">Why This Tool Exists</span>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">
                After nearly a decade inside the debt relief industry, Adam saw the same pattern repeat itself: people searched for "debt consolidation loan," didn't qualify because their debt-to-income ratio was too high, and were left with no clear next step. The industry's incentive structure meant consumers were often steered toward whatever product paid the highest referral fee — not what was actually best for their situation.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                DebtConsolidationApp.com was built to close that gap. The AI-powered assessment uses the same qualification criteria that real lenders and debt relief programs use — including DTI thresholds, credit score ranges, and disposable income calculations — to give every visitor an honest, ranked view of all five debt relief paths.
              </p>
              <p className="text-gray-700 leading-relaxed">
                <strong>No upselling. No hiding options. No pretending everyone qualifies for a consolidation loan.</strong> Just a clear, personalized analysis of what will actually work for your situation.
              </p>
              <div className="mt-5 pt-5 border-t border-gray-200">
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Advertising Disclosure</p>
                <p className="text-xs text-gray-500 leading-relaxed">
                  This site is operated by Adam Tijerina as a marketing consultant for debt consolidation and debt relief companies. When you call the number on this site or submit a request, you may be connected with a partner company. This site may receive compensation when consumers are matched with debt relief providers. This does not affect the objectivity of the assessment — all five debt relief paths are evaluated using the same criteria regardless of any referral arrangement.
                </p>
              </div>
            </section>

          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-8">

            {/* Quick facts */}
            <div className="border border-black p-6">
              <p className="swiss-label mb-4">Quick Facts</p>
              <div className="space-y-3">
                {[
                  ["Based in", "San Antonio, Texas"],
                  ["Experience", "15+ years in personal finance"],
                  ["Industry tenure", "9 years at National Debt Relief"],
                  ["Current role", "Marketing Consultant, Debt Relief Industry"],
                  ["Previous role", "Consumer Advocate & Mktg Mgr, NDR"],
                  ["Published", "2 books (2015)"],
                  ["Blog", "TheCreditBlogger.com"],
                  ["Media", "Credit.com, Yahoo Finance, JenningsWire"],
                  ["Education", "Trinity University"],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between items-start text-sm border-b border-gray-100 pb-2 gap-3">
                    <span className="text-gray-500 flex-shrink-0">{label}</span>
                    <span className="font-semibold text-right">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* As seen in */}
            <div className="border border-black p-6">
              <p className="swiss-label mb-4">Featured In</p>
              <div className="space-y-2">
                {[
                  "TheCreditBlogger.com (founder)",
                  "Credit.com",
                  "Yahoo Finance",
                  "JenningsWire",
                  "PRWeb (50+ press releases)",
                  "National Debt Relief Blog",
                  "Debt Consolidation USA",
                ].map((pub) => (
                  <div key={pub} className="flex items-center gap-2 text-sm">
                    <span className="w-1.5 h-1.5 bg-red-600 flex-shrink-0" />
                    {pub}
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="bg-black text-white p-6">
              <p className="font-black text-lg mb-2">Talk to a Specialist</p>
              <p className="text-sm text-gray-400 mb-5">Get a free consultation with a licensed debt specialist who can review your specific situation.</p>
              <a
                href="tel:+18005551234"
                className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm font-black uppercase tracking-widest px-5 py-3 transition-colors w-full"
              >
                <Phone size={14} />
                Call Now — Free
              </a>
            </div>

            {/* Disclaimer */}
            <div className="border border-gray-200 p-5 bg-gray-50">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Editorial Note</p>
              <p className="text-xs text-gray-500 leading-relaxed">
                This tool provides educational information and AI-generated recommendations for informational purposes only. It does not constitute financial, legal, or credit counseling advice. Always consult a licensed financial advisor or nonprofit credit counselor before making debt relief decisions.
              </p>
            </div>

          </aside>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="border-t border-black bg-black text-white">
        <div className="swiss-container py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="font-black text-2xl mb-2">Ready to Find Your Best Path Out of Debt?</p>
            <p className="text-gray-400">Answer 8 questions. Get a personalized, AI-powered analysis in 60 seconds.</p>
          </div>
          <Link href="/assessment">
            <button className="btn-swiss bg-red-600 text-white border-red-600 hover:bg-red-700 hover:border-red-700 text-sm whitespace-nowrap flex-shrink-0">
              Start Free Assessment →
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
