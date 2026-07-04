import { Link } from "wouter";
import { Clock, ArrowRight, BookOpen } from "lucide-react";
import { BLOG_POSTS } from "@/data/blogPosts";

export default function Blog() {
  const featuredPost = BLOG_POSTS[0];
  const remainingPosts = BLOG_POSTS.slice(1);

  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-red-600 rounded-sm" />
            <span className="font-black text-sm tracking-widest uppercase text-gray-900 hidden sm:block">
              DebtConsolidationApp
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/about" className="text-xs font-bold tracking-widest uppercase text-gray-600 hover:text-gray-900 hidden md:block">
              About
            </Link>
            <Link href="/assessment" className="bg-red-600 text-white text-xs font-black tracking-widest uppercase px-4 py-2 hover:bg-red-700 transition-colors">
              Free Assessment
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="bg-black text-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 bg-red-600" />
            <span className="text-xs font-bold tracking-widest uppercase text-gray-400">Debt Education Blog</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black leading-tight mb-4">
            Real Answers to Real<br />Debt Questions
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl">
            Written by Adam Tijerina — 15+ years in personal finance, 9 years at National Debt Relief, and someone who settled $43,000 in debt himself. No sponsored content. No generic advice.
          </p>
        </div>
      </div>

      {/* Assessment Banner */}
      <div className="bg-black border-t border-gray-800 py-4 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white text-sm font-medium text-center sm:text-left">
            <span className="text-red-400 font-bold">Not sure where to start?</span> Take the free 60-second assessment to find your best debt relief option.
          </p>
          <Link href="/assessment" className="bg-red-600 text-white text-xs font-black tracking-widest uppercase px-5 py-2.5 hover:bg-red-700 transition-colors whitespace-nowrap">
            Start Free Assessment →
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Featured Post */}
        <div className="mb-12">
          <p className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-4">Featured Article</p>
          <Link href={`/blog/${featuredPost.slug}`}>
            <div className="border-2 border-black hover:border-red-600 transition-colors group cursor-pointer">
              <div className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <span className={`${featuredPost.categoryColor} text-white text-xs font-bold tracking-widest uppercase px-3 py-1`}>
                    {featuredPost.category}
                  </span>
                  <span className="text-xs font-bold tracking-widest uppercase text-gray-400 border border-gray-300 px-2 py-1">
                    {featuredPost.sourceLabel}
                  </span>
                </div>
                <h2 className="text-2xl md:text-3xl font-black leading-tight mb-4 group-hover:text-red-600 transition-colors">
                  {featuredPost.title}
                </h2>
                <p className="text-gray-600 text-base leading-relaxed mb-6 max-w-3xl">
                  {featuredPost.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="font-bold">{featuredPost.author}</span>
                    <span>·</span>
                    <span>{new Date(featuredPost.publishedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {featuredPost.readingTime} min read
                    </span>
                  </div>
                  <span className="text-red-600 font-black text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                    Read Article <ArrowRight size={16} />
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Article Grid */}
        <div className="mb-6">
          <p className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-6">All Articles</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {remainingPosts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`}>
                <div className="border border-gray-200 hover:border-black transition-colors group cursor-pointer h-full flex flex-col">
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`${post.categoryColor} text-white text-xs font-bold tracking-widest uppercase px-2 py-0.5`}>
                        {post.category}
                      </span>
                    </div>
                    <h3 className="text-lg font-black leading-tight mb-3 group-hover:text-red-600 transition-colors flex-1">
                      {post.title}
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <span>{new Date(post.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <Clock size={11} />
                          {post.readingTime} min
                        </span>
                      </div>
                      <span className="text-red-600 font-black text-xs flex items-center gap-1 group-hover:gap-2 transition-all">
                        Read <ArrowRight size={13} />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Source Legend */}
        <div className="border border-gray-200 p-6 mt-10">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen size={16} className="text-gray-500" />
            <p className="text-xs font-bold tracking-widest uppercase text-gray-500">Content Sources</p>
          </div>
          <p className="text-sm text-gray-600 mb-4">Every article on this blog is sourced from one of five verified data streams:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-sm">
            {[
              { label: "CFPB / FTC Enforcement", desc: "Regulatory actions protecting consumers" },
              { label: "Federal Reserve Data", desc: "Consumer debt & interest rate statistics" },
              { label: "Bureau of Labor Statistics", desc: "Employment, wages & economic trends" },
              { label: "Google Trends", desc: "Top-searched debt questions" },
              { label: "Breaking News", desc: "Bankruptcy filings & debt relief industry news" },
            ].map((s) => (
              <div key={s.label} className="flex gap-2">
                <div className="w-1.5 h-1.5 bg-red-600 mt-1.5 flex-shrink-0" />
                <div>
                  <p className="font-bold text-gray-900 text-xs">{s.label}</p>
                  <p className="text-gray-500 text-xs">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="bg-black text-white p-8 mt-10 text-center">
          <p className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-3">Ready to Find Your Path Out?</p>
          <h2 className="text-2xl font-black mb-4">Take the Free 60-Second Assessment</h2>
          <p className="text-gray-400 mb-6 max-w-xl mx-auto text-sm">
            Answer 8 questions about your debt situation. Our AI ranks every available option — from consolidation to bankruptcy — by what actually fits your life.
          </p>
          <Link href="/assessment">
            <button className="bg-red-600 text-white font-black tracking-widest uppercase px-8 py-3 hover:bg-red-700 transition-colors">
              Start Free Assessment →
            </button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-black bg-black text-white mt-0">
        <div className="swiss-container py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Brand */}
            <div className="lg:col-span-3">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-3 h-3 bg-red-600 flex-shrink-0" />
                <span className="font-black text-sm tracking-widest uppercase">DebtConsolidationApp</span>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                AI-powered debt relief recommendations. Educational purposes only — not financial advice.
              </p>
            </div>
            {/* Quick links */}
            <div className="lg:col-span-3">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Quick Links</p>
              <ul className="space-y-2">
                {[
                  { href: "/", label: "Home" },
                  { href: "/assessment", label: "Free Assessment" },
                  { href: "/scenarios", label: "Debt Scenarios" },
                  { href: "/blog", label: "Blog" },
                  { href: "/about", label: "About Adam" },
                ].map((l) => (
                  <li key={l.href}>
                    <Link href={l.href}>
                      <span className="text-xs text-gray-400 hover:text-white transition-colors cursor-pointer">{l.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-500">
              © {new Date().getFullYear()} DebtConsolidationApp.com · Educational content only · Not financial advice
            </p>
            <div className="flex items-center gap-6 text-xs text-gray-500">
              <Link href="/"><span className="hover:text-white cursor-pointer transition-colors">Home</span></Link>
              <Link href="/assessment"><span className="hover:text-white cursor-pointer transition-colors">Assessment</span></Link>
              <Link href="/scenarios"><span className="hover:text-white cursor-pointer transition-colors">Scenarios</span></Link>
              <Link href="/blog"><span className="hover:text-white cursor-pointer transition-colors">Blog</span></Link>
              <Link href="/about"><span className="hover:text-white cursor-pointer transition-colors">About</span></Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
