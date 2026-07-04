import { Link, useParams } from "wouter";
import { useEffect } from "react";
import { Clock, ArrowLeft, ArrowRight } from "lucide-react";
import { getBlogPost, BLOG_POSTS } from "@/data/blogPosts";
import { trpc } from "@/lib/trpc";

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();

  // Try DB first; fall back to static data
  const { data: dbPost, isLoading: dbLoading } = trpc.blog.getBySlug.useQuery(
    { slug: slug ?? "" },
    { enabled: !!slug, retry: false }
  );

  const staticPost = getBlogPost(slug ?? "");

  // Normalise DB post shape to match static post interface
  const post = dbPost
    ? {
        slug: dbPost.slug,
        title: dbPost.title,
        excerpt: dbPost.excerpt,
        category: dbPost.category,
        categoryColor: dbPost.categoryColor,
        source: dbPost.sourceLabel,
        sourceLabel: dbPost.sourceLabel,
        publishedAt: dbPost.publishedAt
          ? new Date(dbPost.publishedAt).toISOString().split("T")[0]
          : new Date(dbPost.createdAt).toISOString().split("T")[0],
        readingTime: dbPost.readingTime,
        author: dbPost.author,
        content: dbPost.content,
      }
    : staticPost;

  // Inject JSON-LD structured data for this article
  useEffect(() => {
    if (!post) return;

    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": post.title,
      "description": post.excerpt,
      "datePublished": post.publishedAt,
      "dateModified": post.publishedAt,
      "author": {
        "@type": "Person",
        "name": "Adam Tijerina",
        "url": "https://debtconsolidationapp.com/about",
        "jobTitle": "Personal Finance Expert & Marketing Consultant",
        "description": "15+ years in personal finance, 9 years at National Debt Relief, author of Getting Through the Muck.",
        "sameAs": [
          "https://www.amazon.com/Getting-Through-Muck-Personal-Overcoming/dp/1507791836",
          "https://www.linkedin.com/in/adamtijerina"
        ]
      },
      "publisher": {
        "@type": "Organization",
        "name": "DebtConsolidationApp",
        "url": "https://debtconsolidationapp.com",
        "logo": {
          "@type": "ImageObject",
          "url": "https://debtconsolidationapp.com/favicon.ico"
        }
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `https://debtconsolidationapp.com/blog/${post.slug}`
      },
      "articleSection": post.category,
      "keywords": `debt relief, ${post.category.toLowerCase()}, debt consolidation, personal finance`,
      "timeRequired": `PT${post.readingTime}M`,
      "inLanguage": "en-US"
    };

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = "article-jsonld";
    script.textContent = JSON.stringify(jsonLd);
    document.head.appendChild(script);

    // Also update page title and meta description for SEO
    const prevTitle = document.title;
    document.title = `${post.title} | DebtConsolidationApp`;

    let metaDesc = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.name = "description";
      document.head.appendChild(metaDesc);
    }
    const prevDesc = metaDesc.content;
    metaDesc.content = post.excerpt;

    return () => {
      document.getElementById("article-jsonld")?.remove();
      document.title = prevTitle;
      if (metaDesc) metaDesc.content = prevDesc;
    };
  }, [post]);

  // Show loading while DB query is in-flight and no static fallback exists
  if (dbLoading && !staticPost) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 font-mono text-sm uppercase tracking-widest">Loading article…</p>
        </div>
      </div>
    );
  }

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
            <Link
              href="/assessment"
              className="bg-red-600 text-white text-xs font-black tracking-widest uppercase px-3 py-2 hover:bg-red-700 transition-colors flex items-center gap-1.5"
            >
              Free Assessment
            </Link>
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

      {/* Assessment Banner */}
      <div className="bg-red-600 py-3 px-4">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-white text-sm font-medium text-center sm:text-left">
            Not sure which debt relief option is right for you? Find out in 60 seconds — free.
          </p>
          <Link
            href="/assessment"
            className="bg-white text-red-600 text-xs font-black tracking-widest uppercase px-4 py-2 hover:bg-gray-100 transition-colors whitespace-nowrap"
          >
            Start Free Assessment →
          </Link>
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
              <p className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-2">About the Author</p>
              <h3 className="text-lg font-black mb-3">Adam Tijerina</h3>
              <p className="text-gray-600 text-sm mb-4">15+ years in personal finance. 9 years at National Debt Relief. Settled $43,000 of his own debt. He built this tool to help others do the same.</p>
              <Link
                href="/about"
                className="bg-black text-white text-xs font-black tracking-widest uppercase px-5 py-2.5 hover:bg-gray-900 transition-colors w-full flex items-center justify-center gap-2"
                style={{ color: '#ffffff' }}
              >
                Read His Story →
              </Link>
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
