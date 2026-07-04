import { Link, useParams } from "wouter";
import { Clock, ArrowLeft, Phone, ArrowRight } from "lucide-react";
import { getBlogPost, BLOG_POSTS } from "@/data/blogPosts";

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const post = getBlogPost(slug);

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-black mb-4">Article Not Found</h1>
          <Link href="/blog" className="text-red-600 font-bold">← Back to Blog</Link>
        </div>
      </div>
    );
  }

  const relatedPosts = BLOG_POSTS.filter((p) => p.slug !== slug).slice(0, 3);

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
          <div className="flex items-center gap-3">
            <Link href="/blog" className="text-xs font-bold tracking-widest uppercase text-gray-600 hover:text-gray-900 hidden md:block">
              Blog
            </Link>
            <a
              href="tel:+18004850094"
              className="bg-red-600 text-white text-xs font-black tracking-widest uppercase px-3 py-2 hover:bg-red-700 transition-colors flex items-center gap-1.5"
            >
              <Phone size={12} />
              <span className="hidden sm:inline">Call Free</span>
            </a>
          </div>
        </div>
      </nav>

      {/* Article Header */}
      <div className="bg-black text-white py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <Link href="/blog" className="inline-flex items-center gap-1.5 text-gray-400 hover:text-white text-xs font-bold tracking-widest uppercase mb-6 transition-colors">
            <ArrowLeft size={13} /> Back to Blog
          </Link>
          <div className="flex items-center gap-3 mb-5">
            <span className={`${post.categoryColor} text-white text-xs font-bold tracking-widest uppercase px-3 py-1`}>
              {post.category}
            </span>
            <span className="text-xs font-bold tracking-widest uppercase text-gray-500 border border-gray-700 px-2 py-1">
              {post.sourceLabel}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black leading-tight mb-5">
            {post.title}
          </h1>
          <p className="text-gray-400 text-base leading-relaxed mb-6">{post.excerpt}</p>
          <div className="flex items-center gap-4 text-xs text-gray-500 border-t border-gray-800 pt-5">
            <span className="font-bold text-gray-300">{post.author}</span>
            <span>·</span>
            <span>{new Date(post.publishedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Clock size={12} />
              {post.readingTime} min read
            </span>
          </div>
        </div>
      </div>

      {/* Call Banner */}
      <div className="bg-red-600 py-3 px-4">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-white text-sm font-medium text-center sm:text-left">
            Questions about your debt situation? Talk to a specialist — free.
          </p>
          <a
            href="tel:+18004850094"
            className="bg-white text-red-600 text-xs font-black tracking-widest uppercase px-4 py-2 hover:bg-gray-100 transition-colors whitespace-nowrap"
          >
            800-485-0094
          </a>
        </div>
      </div>

      {/* Article Content */}
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div
          className="prose-article"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Article Footer CTA */}
        <div className="border-t-4 border-black mt-12 pt-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-black text-white p-6">
              <p className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-2">Free Assessment</p>
              <h3 className="text-lg font-black mb-3">Find Your Best Path Out of Debt</h3>
              <p className="text-gray-400 text-sm mb-4">Answer 8 questions. Get a personalized ranking of every debt relief option for your situation.</p>
              <Link href="/assessment">
                <button className="bg-red-600 text-white text-xs font-black tracking-widest uppercase px-5 py-2.5 hover:bg-red-700 transition-colors w-full">
                  Start Free →
                </button>
              </Link>
            </div>
            <div className="bg-gray-50 border border-gray-200 p-6">
              <p className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-2">Talk to a Specialist</p>
              <h3 className="text-lg font-black mb-3">Get a Free Consultation</h3>
              <p className="text-gray-600 text-sm mb-4">Speak directly with a licensed debt specialist who can review your specific situation.</p>
              <a
                href="tel:+18004850094"
                className="bg-black text-white text-xs font-black tracking-widest uppercase px-5 py-2.5 hover:bg-gray-800 transition-colors w-full flex items-center justify-center gap-2"
              >
                <Phone size={13} /> 800-485-0094
              </a>
            </div>
          </div>
        </div>

        {/* Related Articles */}
        {relatedPosts.length > 0 && (
          <div className="mt-12">
            <p className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-6">More Articles</p>
            <div className="space-y-4">
              {relatedPosts.map((related) => (
                <Link key={related.slug} href={`/blog/${related.slug}`}>
                  <div className="flex items-start gap-4 p-4 border border-gray-200 hover:border-black transition-colors group cursor-pointer">
                    <span className={`${related.categoryColor} text-white text-xs font-bold tracking-widest uppercase px-2 py-0.5 whitespace-nowrap mt-0.5`}>
                      {related.category}
                    </span>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-black text-sm leading-snug group-hover:text-red-600 transition-colors line-clamp-2">
                        {related.title}
                      </h4>
                      <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                        <Clock size={11} /> {related.readingTime} min read
                      </p>
                    </div>
                    <ArrowRight size={16} className="text-gray-400 group-hover:text-red-600 transition-colors flex-shrink-0 mt-1" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
