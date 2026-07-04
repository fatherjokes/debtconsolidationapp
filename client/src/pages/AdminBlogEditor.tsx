import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────────────────────────

interface DraftResult {
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  categoryColor: string;
  sourceLabel: string;
  readingTime: number;
  content: string;
}

interface Props {
  editId?: number; // if set, we're editing an existing post
}

const CATEGORY_COLORS = [
  { label: "Red (Default)", value: "bg-red-600" },
  { label: "Blue", value: "bg-blue-700" },
  { label: "Green", value: "bg-green-700" },
  { label: "Purple", value: "bg-purple-700" },
  { label: "Orange", value: "bg-orange-600" },
];

const SOURCE_TYPES = ["CFPB/FTC", "Federal Reserve", "BLS", "Google Trends", "Breaking News", "Editorial"] as const;

// ─── Editor Component ─────────────────────────────────────────────────────────

export default function AdminBlogEditor({ editId }: Props) {
  const { user, loading: authLoading } = useAuth();
  const [, navigate] = useLocation();

  // AI draft form
  const [topic, setTopic] = useState("");
  const [keywords, setKeywords] = useState("");
  const [draftCategory, setDraftCategory] = useState("");
  const [sourceType, setSourceType] = useState<typeof SOURCE_TYPES[number]>("Editorial");
  const [isGenerating, setIsGenerating] = useState(false);

  // Article fields
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [categoryColor, setCategoryColor] = useState("bg-red-600");
  const [sourceLabel, setSourceLabel] = useState("Editorial");
  const [author, setAuthor] = useState("Adam Tijerina");
  const [readingTime, setReadingTime] = useState(5);
  const [status, setStatus] = useState<"draft" | "published">("draft");

  const [isSaving, setIsSaving] = useState(false);
  const [savedId, setSavedId] = useState<number | null>(editId ?? null);
  const [previewMode, setPreviewMode] = useState(false);

  // Load existing post if editing
  const { data: existingPost } = trpc.blog.getById.useQuery(
    { id: editId! },
    { enabled: !!editId && !!user && user.role === "admin" }
  );

  useEffect(() => {
    if (existingPost) {
      setTitle(existingPost.title);
      setSlug(existingPost.slug);
      setExcerpt(existingPost.excerpt);
      setContent(existingPost.content);
      setCategory(existingPost.category);
      setCategoryColor(existingPost.categoryColor);
      setSourceLabel(existingPost.sourceLabel);
      setAuthor(existingPost.author);
      setReadingTime(existingPost.readingTime);
      setStatus(existingPost.status);
    }
  }, [existingPost]);

  // tRPC mutations
  const generateDraft = trpc.blog.generateDraft.useMutation();
  const createPost = trpc.blog.create.useMutation();
  const updatePost = trpc.blog.update.useMutation();
  const submitIndexNow = trpc.blog.submitToIndexNow.useMutation();

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

  // ── Handlers ───────────────────────────────────────────────────────────────

  async function handleGenerate() {
    if (!topic.trim()) { toast.error("Enter a topic first"); return; }
    setIsGenerating(true);
    try {
      const draft = await generateDraft.mutateAsync({
        topic,
        keywords: keywords || undefined,
        category: draftCategory || undefined,
        sourceType: sourceType || undefined,
      }) as DraftResult;
      setTitle(draft.title);
      setSlug(draft.slug);
      setExcerpt(draft.excerpt);
      setContent(draft.content);
      setCategory(draft.category);
      setCategoryColor(draft.categoryColor ?? "bg-red-600");
      setSourceLabel(draft.sourceLabel ?? "Editorial");
      setReadingTime(draft.readingTime ?? 7);
      toast.success("Draft generated! Review and edit before publishing.");
    } catch (err: unknown) {
      toast.error("Generation failed: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setIsGenerating(false);
    }
  }

  async function handleSave(targetStatus: "draft" | "published") {
    if (!title.trim() || !slug.trim() || !content.trim()) {
      toast.error("Title, slug, and content are required");
      return;
    }
    setIsSaving(true);
    try {
      if (savedId) {
        await updatePost.mutateAsync({
          id: savedId,
          title, slug, excerpt, content, category, categoryColor,
          sourceLabel, author, readingTime, status: targetStatus,
        });
        setStatus(targetStatus);
        toast.success(targetStatus === "published" ? "Article published!" : "Draft saved");
      } else {
        const { id } = await createPost.mutateAsync({
          title, slug, excerpt, content, category, categoryColor,
          sourceLabel, author, readingTime, status: targetStatus,
        });
        setSavedId(id);
        setStatus(targetStatus);
        toast.success(targetStatus === "published" ? "Article published!" : "Draft saved");
        navigate(`/admin/blog/edit/${id}`);
      }

      // Submit to IndexNow if publishing
      if (targetStatus === "published") {
        const url = `https://debtconsolidationapp.com/blog/${slug}`;
        const result = await submitIndexNow.mutateAsync({ url });
        if (result.success) {
          toast.success("URL submitted to IndexNow ✓");
        } else {
          toast.warning("IndexNow submission skipped (key not configured)");
        }
      }
    } catch (err: unknown) {
      toast.error("Save failed: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setIsSaving(false);
    }
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-black bg-black text-white sticky top-0 z-30">
        <div className="swiss-container py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/blog" className="text-xs font-mono uppercase tracking-widest text-gray-400 hover:text-white transition-colors">
              ← Blog Admin
            </Link>
            <span className="text-xs font-mono text-gray-500">|</span>
            <span className="text-sm font-bold uppercase tracking-widest">
              {editId ? "Edit Article" : "New Article"}
            </span>
            {status === "published" && (
              <span className="text-xs font-mono bg-green-700 text-white px-2 py-0.5 uppercase tracking-widest">
                Published
              </span>
            )}
            {status === "draft" && savedId && (
              <span className="text-xs font-mono bg-yellow-600 text-white px-2 py-0.5 uppercase tracking-widest">
                Draft
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="text-xs font-mono uppercase tracking-widest rounded-none border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white px-4 py-2"
              onClick={() => setPreviewMode(!previewMode)}
            >
              {previewMode ? "Edit" : "Preview"}
            </Button>
            <Button
              variant="outline"
              className="text-xs font-mono uppercase tracking-widest rounded-none border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white px-4 py-2"
              onClick={() => handleSave("draft")}
              disabled={isSaving}
            >
              {isSaving ? <Spinner className="h-3 w-3" /> : "Save Draft"}
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-widest rounded-none px-5 py-2"
              onClick={() => handleSave("published")}
              disabled={isSaving}
            >
              {isSaving ? <Spinner className="h-3 w-3" /> : status === "published" ? "Update & Re-Index" : "Publish + IndexNow →"}
            </Button>
          </div>
        </div>
      </div>

      <div className="swiss-container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── Left: AI Draft Generator ── */}
          <div className="lg:col-span-1">
            <div className="border border-black p-6 mb-6">
              <h2 className="text-xs font-mono uppercase tracking-widest text-red-600 mb-4">
                AI Draft Generator
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-mono uppercase tracking-widest text-gray-500 block mb-1">
                    Topic *
                  </label>
                  <Textarea
                    value={topic}
                    onChange={e => setTopic(e.target.value)}
                    placeholder="e.g. How rising interest rates affect debt consolidation options in 2025"
                    className="rounded-none border-gray-300 text-sm font-mono resize-none"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="text-xs font-mono uppercase tracking-widest text-gray-500 block mb-1">
                    Target Keywords
                  </label>
                  <Input
                    value={keywords}
                    onChange={e => setKeywords(e.target.value)}
                    placeholder="debt consolidation, interest rates, 2025"
                    className="rounded-none border-gray-300 text-sm font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono uppercase tracking-widest text-gray-500 block mb-1">
                    Category
                  </label>
                  <Input
                    value={draftCategory}
                    onChange={e => setDraftCategory(e.target.value)}
                    placeholder="Debt Consolidation, Credit Score, etc."
                    className="rounded-none border-gray-300 text-sm font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono uppercase tracking-widest text-gray-500 block mb-1">
                    Primary Source
                  </label>
                  <select
                    value={sourceType}
                    onChange={e => setSourceType(e.target.value as typeof SOURCE_TYPES[number])}
                    className="w-full border border-gray-300 text-sm font-mono px-3 py-2 bg-white"
                  >
                    {SOURCE_TYPES.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <Button
                  className="w-full bg-black hover:bg-gray-900 text-white text-xs font-bold uppercase tracking-widest rounded-none py-3"
                  onClick={handleGenerate}
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <span className="flex items-center gap-2">
                      <Spinner className="h-3 w-3" /> Generating…
                    </span>
                  ) : (
                    "Generate Draft →"
                  )}
                </Button>
                {isGenerating && (
                  <p className="text-xs font-mono text-gray-400 text-center">
                    Writing in Adam's voice… ~20-30 seconds
                  </p>
                )}
              </div>
            </div>

            {/* Metadata panel */}
            <div className="border border-gray-200 p-6 space-y-4">
              <h2 className="text-xs font-mono uppercase tracking-widest text-gray-500 mb-2">
                Article Metadata
              </h2>
              <div>
                <label className="text-xs font-mono uppercase tracking-widest text-gray-500 block mb-1">Title *</label>
                <Input
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="rounded-none border-gray-300 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-mono uppercase tracking-widest text-gray-500 block mb-1">Slug *</label>
                <Input
                  value={slug}
                  onChange={e => setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""))}
                  className="rounded-none border-gray-300 text-sm font-mono"
                  placeholder="url-friendly-slug"
                />
                {slug && (
                  <p className="text-xs font-mono text-gray-400 mt-1">/blog/{slug}</p>
                )}
              </div>
              <div>
                <label className="text-xs font-mono uppercase tracking-widest text-gray-500 block mb-1">Excerpt</label>
                <Textarea
                  value={excerpt}
                  onChange={e => setExcerpt(e.target.value)}
                  className="rounded-none border-gray-300 text-sm resize-none"
                  rows={2}
                />
              </div>
              <div>
                <label className="text-xs font-mono uppercase tracking-widest text-gray-500 block mb-1">Category</label>
                <Input
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="rounded-none border-gray-300 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-mono uppercase tracking-widest text-gray-500 block mb-1">Category Color</label>
                <select
                  value={categoryColor}
                  onChange={e => setCategoryColor(e.target.value)}
                  className="w-full border border-gray-300 text-sm font-mono px-3 py-2 bg-white"
                >
                  {CATEGORY_COLORS.map(c => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-mono uppercase tracking-widest text-gray-500 block mb-1">Source Label</label>
                <Input
                  value={sourceLabel}
                  onChange={e => setSourceLabel(e.target.value)}
                  className="rounded-none border-gray-300 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-mono uppercase tracking-widest text-gray-500 block mb-1">Author</label>
                <Input
                  value={author}
                  onChange={e => setAuthor(e.target.value)}
                  className="rounded-none border-gray-300 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-mono uppercase tracking-widest text-gray-500 block mb-1">Reading Time (min)</label>
                <Input
                  type="number"
                  value={readingTime}
                  onChange={e => setReadingTime(parseInt(e.target.value) || 5)}
                  className="rounded-none border-gray-300 text-sm"
                  min={1}
                  max={60}
                />
              </div>
            </div>
          </div>

          {/* ── Right: Content Editor / Preview ── */}
          <div className="lg:col-span-2">
            <div className="border border-gray-200">
              <div className="border-b border-gray-200 px-4 py-2 flex items-center gap-3 bg-gray-50">
                <span className="text-xs font-mono uppercase tracking-widest text-gray-500">
                  {previewMode ? "Preview" : "HTML Content Editor"}
                </span>
                {!previewMode && (
                  <span className="text-xs font-mono text-gray-400">
                    Use &lt;h2&gt;, &lt;h3&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;strong&gt;, &lt;blockquote&gt; tags
                  </span>
                )}
              </div>
              {previewMode ? (
                <div
                  className="p-6 prose prose-sm max-w-none min-h-[600px]"
                  dangerouslySetInnerHTML={{ __html: content }}
                />
              ) : (
                <Textarea
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  className="rounded-none border-0 text-sm font-mono min-h-[600px] resize-y w-full p-4"
                  placeholder="<h2>Section Title</h2><p>Article content goes here...</p>"
                />
              )}
            </div>

            {/* Character / word count */}
            {content && (
              <p className="text-xs font-mono text-gray-400 mt-2 text-right">
                ~{Math.ceil(content.replace(/<[^>]+>/g, "").split(/\s+/).filter(Boolean).length / 200)} min read
                {" · "}
                {content.replace(/<[^>]+>/g, "").split(/\s+/).filter(Boolean).length} words
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
