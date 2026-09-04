import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Download,
  List,
  Minus,
  Plus,
  X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { bookById } from "@/data/meta";
import { HollowSun } from "@/components/HollowSun";
import { useBook } from "@/lib/use-book";
import { DropCapParagraph, isBreak, ProseText } from "@/lib/prose";
import { getProgress, setProgress } from "@/lib/progress";
import { cn } from "@/lib/utils";

type Theme = "night" | "lamp" | "dusk";
type Search = { c: number };

export const Route = createFileRoute("/read/$slug")({
  validateSearch: (raw: Record<string, unknown>): Search => {
    const n = Number(raw.c);
    return { c: Number.isFinite(n) ? n : 1 };
  },
  component: ReaderPage,
});

function ReaderPage() {
  const { slug } = Route.useParams();
  const { c } = Route.useSearch();
  const meta = bookById(slug);
  if (!meta) throw notFound();

  const navigate = useNavigate({ from: Route.fullPath });
  const { book, loading, error } = useBook(slug);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [theme, setTheme] = useState<Theme>("night");
  const [fontPx, setFontPx] = useState(18);
  const [tocOpen, setTocOpen] = useState(false);
  const [prefsReady, setPrefsReady] = useState(false);

  useEffect(() => {
    try {
      const t = window.localStorage.getItem("hollow-sun-theme");
      if (t === "lamp" || t === "dusk" || t === "night") setTheme(t);
      const n = Number(window.localStorage.getItem("hollow-sun-font"));
      if (Number.isFinite(n) && n >= 16 && n <= 24) setFontPx(n);
    } catch {
      /* ignore */
    }
    setPrefsReady(true);
  }, []);

  useEffect(() => {
    if (!prefsReady) return;
    try {
      localStorage.setItem("hollow-sun-theme", theme);
      localStorage.setItem("hollow-sun-font", String(fontPx));
    } catch {
      /* ignore */
    }
  }, [theme, fontPx, prefsReady]);

  const chapterCount = book?.chapters.length ?? 0;
  const maxC = chapterCount;
  const chapterIndex = Math.min(Math.max(c, 0), maxC || 0);
  const chapter =
    book && chapterIndex > 0
      ? book.chapters.find((ch) => ch.number === chapterIndex) ?? null
      : null;

  const go = useCallback(
    (next: number) => {
      const clamped = Math.max(0, Math.min(next, maxC || 1));
      setProgress(slug, clamped || 1, 0);
      navigate({ search: { c: clamped }, resetScroll: false });
      scrollRef.current?.scrollTo({ top: 0 });
    },
    [maxC, navigate, slug],
  );

  useEffect(() => {
    if (!book) return;
    setProgress(slug, chapterIndex || 1, 0);
  }, [book, chapterIndex, slug]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA")) return;
      if (e.key === "ArrowRight") go(chapterIndex + 1);
      if (e.key === "ArrowLeft") go(chapterIndex - 1);
      if (e.key === "Escape") setTocOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [chapterIndex, go]);

  const themeClass =
    theme === "lamp" ? "theme-lamp" : theme === "dusk" ? "theme-dusk" : "theme-night";

  const chrome =
    theme === "lamp" ? "border-lamp-ink/15 text-lamp-muted" : "border-border text-fg-muted";

  const progressPct = useMemo(() => {
    if (!chapterCount) return 0;
    return Math.round((chapterIndex / chapterCount) * 100);
  }, [chapterIndex, chapterCount]);

  return (
    <div
      className={cn(
        "flex min-h-dvh flex-col",
        theme === "lamp"
          ? "bg-lamp text-lamp-ink"
          : theme === "dusk"
            ? "bg-dusk text-dusk-ink"
            : "bg-bg text-fg",
        themeClass,
      )}
    >
      <header
        className={cn(
          "sticky top-0 z-30 border-b backdrop-blur-md",
          chrome,
          theme === "lamp" ? "bg-lamp/90" : "bg-bg/90",
        )}
      >
        <div className="mx-auto flex max-w-3xl items-center gap-2 px-3 py-2 sm:px-6">
          <Link
            to="/book/$slug"
            params={{ slug }}
            className="inline-flex size-11 items-center justify-center rounded-md hover:text-fg"
            aria-label="Back to volume"
          >
            <ArrowLeft className="size-4" />
          </Link>
          <div className="min-w-0 flex-1">
            <p className="truncate font-sans text-[10px] tracking-[0.18em] uppercase">
              {meta.series} · {meta.title}
            </p>
            <p className="truncate font-serif text-sm">
              {chapterIndex === 0
                ? "Front matter"
                : chapter
                  ? `Chapter ${chapter.number} · ${chapter.title}`
                  : "Opening…"}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setTocOpen(true)}
            className="inline-flex size-11 items-center justify-center rounded-md hover:text-fg"
            aria-label="Table of contents"
          >
            <List className="size-4" />
          </button>
        </div>
        <div className="h-0.5 bg-border" aria-hidden>
          <div
            className="h-full bg-accent transition-[width] duration-200"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <article
          className="prose-chapter mx-auto max-w-2xl px-5 py-10 sm:px-8 sm:py-14"
          style={{ fontSize: `${fontPx}px` }}
        >
          {loading ? (
            <p className="font-serif text-fg-muted">Opening the binding…</p>
          ) : error ? (
            <p className="font-serif text-fg-muted">{error}</p>
          ) : chapterIndex === 0 && book ? (
            <FrontMatter
              dedication={book.dedication}
              epigraph={book.epigraph}
              title={book.title}
              series={book.series}
            />
          ) : chapter ? (
            <ChapterBody chapter={chapter} />
          ) : (
            <p className="font-serif text-fg-muted">That chapter is not in this volume.</p>
          )}
        </article>

        <nav className="mx-auto flex max-w-2xl items-center justify-between gap-3 px-5 pt-2 pb-10 sm:px-8">
          <button
            type="button"
            disabled={chapterIndex <= 0}
            onClick={() => go(chapterIndex - 1)}
            className="inline-flex min-h-11 items-center gap-1 rounded-md px-3 text-sm disabled:opacity-30"
          >
            <ChevronLeft className="size-4" />
            Previous
          </button>
          <span className="font-sans text-xs tabular-nums text-fg-subtle">
            {chapterIndex} / {chapterCount}
          </span>
          <button
            type="button"
            disabled={!book || chapterIndex >= chapterCount}
            onClick={() => go(chapterIndex + 1)}
            className="inline-flex min-h-11 items-center gap-1 rounded-md px-3 text-sm disabled:opacity-30"
          >
            Next
            <ChevronRight className="size-4" />
          </button>
        </nav>
      </div>

      <footer
        className={cn(
          "sticky bottom-0 z-20 border-t backdrop-blur-md",
          chrome,
          theme === "lamp" ? "bg-lamp/90" : "bg-bg/90",
        )}
      >
        <div className="mx-auto flex max-w-3xl items-center gap-1 overflow-x-auto px-3 py-2 sm:px-6">
          <span className="mr-1 hidden font-sans text-[10px] tracking-[0.16em] text-fg-subtle uppercase sm:inline">
            Theme
          </span>
          {(["night", "lamp", "dusk"] as Theme[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTheme(t)}
              className={cn(
                "min-h-11 rounded-md px-3 text-xs capitalize",
                theme === t ? "bg-fg text-bg" : "hover:text-fg",
              )}
            >
              {t}
            </button>
          ))}
          <span className="mx-2 h-4 w-px bg-border" aria-hidden />
          <button
            type="button"
            onClick={() => setFontPx((n) => Math.max(16, n - 1))}
            className="inline-flex size-11 items-center justify-center rounded-md"
            aria-label="Smaller type"
          >
            <Minus className="size-3.5" />
          </button>
          <span className="font-sans text-xs tabular-nums">{fontPx}</span>
          <button
            type="button"
            onClick={() => setFontPx((n) => Math.min(24, n + 1))}
            className="inline-flex size-11 items-center justify-center rounded-md"
            aria-label="Larger type"
          >
            <Plus className="size-3.5" />
          </button>
          <span className="flex-1" />
          <a
            href={meta.docx}
            download={meta.filename}
            className="inline-flex min-h-11 items-center gap-2 rounded-md px-3 text-xs hover:text-fg"
          >
            <Download className="size-3.5" />
            Word
          </a>
        </div>
      </footer>

      {tocOpen ? (
        <div className="fixed inset-0 z-50 flex">
          <button
            type="button"
            className="absolute inset-0 bg-bg/70"
            aria-label="Close contents"
            onClick={() => setTocOpen(false)}
          />
          <aside
            className={cn(
              "relative ml-auto flex h-full w-full max-w-sm flex-col border-l",
              theme === "lamp"
                ? "border-lamp-ink/15 bg-lamp text-lamp-ink"
                : "border-border bg-bg-elevated text-fg",
            )}
          >
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-2">
                <HollowSun className="size-5" />
                <h2 className="font-display text-xl">Contents</h2>
              </div>
              <button
                type="button"
                className="inline-flex size-11 items-center justify-center"
                onClick={() => setTocOpen(false)}
                aria-label="Close"
              >
                <X className="size-4" />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto px-2 pb-8">
              <button
                type="button"
                onClick={() => {
                  go(0);
                  setTocOpen(false);
                }}
                className={cn(
                  "flex w-full min-h-11 items-center rounded-md px-3 text-left font-serif text-sm",
                  chapterIndex === 0 ? "bg-fg text-bg" : "",
                )}
              >
                Dedication & epigraph
              </button>
              {book?.chapters.map((ch) => (
                <button
                  key={ch.number}
                  type="button"
                  onClick={() => {
                    go(ch.number);
                    setTocOpen(false);
                  }}
                  className={cn(
                    "flex w-full min-h-11 items-baseline gap-3 rounded-md px-3 text-left",
                    chapterIndex === ch.number ? "bg-fg text-bg" : "",
                  )}
                >
                  <span className="w-6 shrink-0 font-sans text-xs tabular-nums opacity-60">
                    {String(ch.number).padStart(2, "0")}
                  </span>
                  <span className="font-serif text-sm">{ch.title}</span>
                </button>
              ))}
            </nav>
          </aside>
        </div>
      ) : null}
    </div>
  );
}

function FrontMatter({
  dedication,
  epigraph,
  title,
  series,
}: {
  dedication: string;
  epigraph: { text: string; attribution: string };
  title: string;
  series: string;
}) {
  return (
    <div className="py-8 text-center">
      <p className="font-sans text-[11px] tracking-[0.24em] text-fg-subtle uppercase">{series}</p>
      <h1 className="mt-4 font-display text-5xl font-semibold">{title}</h1>
      <div className="ornament">*</div>
      <p className="mx-auto max-w-sm font-serif text-lg italic">{dedication}</p>
      <div className="ornament">*</div>
      <blockquote className="mx-auto max-w-md">
        <p className="font-serif text-xl leading-snug italic">{epigraph.text}</p>
        <footer className="mt-4 font-sans text-xs tracking-wide text-fg-subtle">
          {epigraph.attribution}
        </footer>
      </blockquote>
    </div>
  );
}

function ChapterBody({
  chapter,
}: {
  chapter: { number: number; title: string; paragraphs: string[] };
}) {
  const firstReal = chapter.paragraphs.findIndex((p) => !isBreak(p));
  return (
    <>
      <header className="mb-10 text-center">
        <p className="font-sans text-[11px] tracking-[0.28em] text-accent uppercase">
          Chapter {chapter.number}
        </p>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
          {chapter.title}
        </h1>
      </header>
      {chapter.paragraphs.map((p, i) =>
        isBreak(p) ? (
          <p key={i} className="ornament">
            *
          </p>
        ) : i === firstReal ? (
          <DropCapParagraph key={i} text={p} />
        ) : (
          <p key={i}>
            <ProseText text={p} />
          </p>
        ),
      )}
    </>
  );
}
