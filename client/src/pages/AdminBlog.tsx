import { useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────────────────────────

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  status: "draft" | "published";
  author: string;
  readingTime: number;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Admin Blog List Page ─────────────────────────────────────────────────────

export default function AdminBlog() {
  const { user, loading: authLoading } = useAuth();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const { data: posts, isLoading, refetch } = trpc.blog.list.useQuery(
    { status: "all" },
    { enabled: !!user && user.role === "admin" }
  );

  const deleteMutation = trpc.blog.delete.useMutation({
    onSuccess: () => {
      toast.success("Article deleted");
      refetch();
      setDeletingId(null);
    },
    onError: (err) => {
      toast.error("Delete failed: " + err.message);
      setDeletingId(null);
    },
  });

  // ── Auth gate ──────────────────────────────────────────────────────────────
  if (authLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Spinner className="h-8 w-8 text-red-600" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
        <p className="text-gray-600 font-mono text-sm uppercase tracking-widest">Admin access required</p>
        <a href={getLoginUrl()} className="btn-swiss-red px-6 py-3 text-sm font-bold uppercase tracking-widest">
          Sign In
        </a>
      </div>
    );
  }

  if (user.role !== "admin") {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
        <p className="text-red-600 font-mono text-sm uppercase tracking-widest">Access denied — admin only</p>
        <Link href="/" className="text-sm text-gray-500 underline">Back to home</Link>
      </div>
    );
  }

  // ── Admin UI ───────────────────────────────────────────────────────────────
  const published = (posts as BlogPost[] | undefined)?.filter(p => p.status === "published") ?? [];
  const drafts = (posts as BlogPost[] | undefined)?.filter(p => p.status === "draft") ?? [];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-black bg-black text-white">
        <div className="swiss-container py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="text-xs font-mono uppercase tracking-widest text-gray-400 hover:text-white transition-colors">
              ← Site
            </Link>
            <span className="text-xs font-mono uppercase tracking-widest text-gray-500">|</span>
            <span className="text-sm font-bold uppercase tracking-widest">Blog Admin</span>
          </div>
          <Link href="/admin/blog/new">
            <Button className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-widest rounded-none px-5 py-2">
              + New Article
            </Button>
          </Link>
        </div>
      </div>

      <div className="swiss-container py-10">
        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {[
            { label: "Total Articles", value: (posts as BlogPost[] | undefined)?.length ?? 0 },
            { label: "Published", value: published.length },
            { label: "Drafts", value: drafts.length },
          ].map(stat => (
            <div key={stat.label} className="border border-gray-200 p-5">
              <p className="text-xs font-mono uppercase tracking-widest text-gray-400 mb-1">{stat.label}</p>
              <p className="text-3xl font-black">{stat.value}</p>
            </div>
          ))}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Spinner className="h-8 w-8 text-red-600" />
          </div>
        ) : (posts as BlogPost[] | undefined)?.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-gray-300">
            <p className="text-gray-400 font-mono text-sm uppercase tracking-widest mb-4">No articles yet</p>
            <Link href="/admin/blog/new">
              <Button className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-widest rounded-none px-6 py-3">
                Create First Article
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-0 border-t border-gray-200">
            {(posts as BlogPost[]).map(post => (
              <div
                key={post.id}
                className="border-b border-gray-200 py-5 flex items-start justify-between gap-4 group hover:bg-gray-50 transition-colors px-2"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <Badge
                      className={`text-xs font-mono uppercase tracking-widest rounded-none px-2 py-0.5 ${
                        post.status === "published"
                          ? "bg-green-100 text-green-800 border border-green-300"
                          : "bg-yellow-100 text-yellow-800 border border-yellow-300"
                      }`}
                    >
                      {post.status}
                    </Badge>
                    <span className="text-xs font-mono text-gray-400 uppercase tracking-widest">{post.category}</span>
                    <span className="text-xs font-mono text-gray-400">{post.readingTime} min read</span>
                  </div>
                  <h3 className="font-bold text-base leading-tight mb-1 truncate">{post.title}</h3>
                  <p className="text-sm text-gray-500 line-clamp-1">{post.excerpt}</p>
                  <p className="text-xs font-mono text-gray-400 mt-1">
                    {post.status === "published" && post.publishedAt
                      ? `Published ${new Date(post.publishedAt).toLocaleDateString()}`
                      : `Created ${new Date(post.createdAt).toLocaleDateString()}`}
                    {" · "}
                    <a
                      href={`/blog/${post.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-red-600 hover:underline"
                    >
                      /blog/{post.slug}
                    </a>
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Link href={`/admin/blog/edit/${post.id}`}>
                    <Button
                      variant="outline"
                      className="text-xs font-mono uppercase tracking-widest rounded-none border-black hover:bg-black hover:text-white transition-colors px-4 py-2"
                    >
                      Edit
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    className="text-xs font-mono uppercase tracking-widest rounded-none border-red-300 text-red-600 hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors px-4 py-2"
                    onClick={() => {
                      if (confirm(`Delete "${post.title}"? This cannot be undone.`)) {
                        setDeletingId(post.id);
                        deleteMutation.mutate({ id: post.id });
                      }
                    }}
                    disabled={deletingId === post.id}
                  >
                    {deletingId === post.id ? <Spinner className="h-3 w-3" /> : "Delete"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
