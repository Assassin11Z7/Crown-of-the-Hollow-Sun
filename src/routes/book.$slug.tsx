import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, BookOpen, Download } from "lucide-react";
import { bookById } from "@/data/meta";
import { CoverFrame } from "@/components/CoverFrame";
import { HollowSun } from "@/components/HollowSun";
import { useBook } from "@/lib/use-book";
import { getProgress } from "@/lib/progress";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/book/$slug")({
  component: BookPage,
});

function BookPage() {
  const { slug } = Route.useParams();
  const meta = bookById(slug);
  if (!meta) throw notFound();

  const { book, loading } = useBook(slug);
  const [resumeAt, setResumeAt] = useState(1);
  useEffect(() => {
    const p = getProgress(slug);
    setResumeAt(p?.chapter && p.chapter > 0 ? p.chapter : 1);
  }, [slug]);

  return (
    <main className="min-h-dvh bg-bg text-fg">
      <header className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-5 py-5 sm:px-8">
        <Link
          to="/"
          className="inline-flex min-h-11 items-center gap-2 text-sm text-fg-muted transition-colors hover:text-fg"
        >
          <ArrowLeft className="size-4" />
          Library
        </Link>
        <div className="flex items-center gap-2 text-accent">
          <HollowSun className="size-5" />
        </div>
      </header>

      <section className="mx-auto grid max-w-5xl gap-10 px-5 pb-16 sm:px-8 lg:grid-cols-[280px_1fr] lg:gap-14">
        <div className="mx-auto w-full max-w-[260px] lg:mx-0">
          <CoverFrame src={meta.cover} alt="" priority className="aspect-2/3 w-full" />
        </div>

        <div>
          <p className="font-sans text-[11px] font-medium tracking-[0.22em] text-accent uppercase">
            Book {meta.roman} · {meta.series}
          </p>
          <h1 className="mt-2 font-display text-5xl font-semibold tracking-tight sm:text-6xl">
            {meta.title}
          </h1>
          <p className="mt-2 font-serif text-lg text-fg-muted italic">{meta.subtitle}</p>
          <p className="mt-6 max-w-xl font-serif text-base leading-relaxed text-fg-muted">
            {meta.synopsis}
          </p>

          <blockquote className="mt-8 max-w-md border-l border-accent/50 pl-4">
            <p className="font-serif text-base text-fg italic">{meta.epigraph.text}</p>
            <footer className="mt-2 font-sans text-xs tracking-wide text-fg-subtle">
              {meta.epigraph.attribution}
            </footer>
          </blockquote>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/read/$slug"
              params={{ slug: meta.id }}
              search={{ c: resumeAt }}
              className="inline-flex min-h-11 items-center gap-2 rounded-md bg-fg px-5 text-sm font-medium text-bg transition-opacity hover:opacity-90"
            >
              <BookOpen className="size-4" />
              {resumeAt > 1 ? `Continue at chapter ${resumeAt}` : "Begin reading"}
            </Link>
            <a
              href={meta.docx}
              download={meta.filename}
              className="inline-flex min-h-11 items-center gap-2 rounded-md border border-border px-5 text-sm font-medium transition-colors hover:border-border-strong"
            >
              <Download className="size-4" />
              Download for Word
            </a>
          </div>

          <div className="mt-12">
            <h2 className="font-sans text-[11px] font-medium tracking-[0.22em] text-fg-subtle uppercase">
              Contents
            </h2>
            {loading ? (
              <p className="mt-4 font-serif text-sm text-fg-muted">Opening the binding…</p>
            ) : book ? (
              <ol className="mt-4 divide-y divide-border">
                <li>
                  <Link
                    to="/read/$slug"
                    params={{ slug: meta.id }}
                    search={{ c: 0 }}
                    className="flex min-h-11 items-baseline justify-between gap-4 py-3 font-serif text-fg-muted transition-colors hover:text-fg"
                  >
                    <span>Dedication & epigraph</span>
                    <span className="font-sans text-xs text-fg-subtle">Front</span>
                  </Link>
                </li>
                {book.chapters.map((ch) => (
                  <li key={ch.number}>
                    <Link
                      to="/read/$slug"
                      params={{ slug: meta.id }}
                      search={{ c: ch.number }}
                      className="flex min-h-11 items-baseline justify-between gap-4 py-3 transition-colors hover:text-accent"
                    >
                      <span className="font-serif">
                        <span className="mr-3 font-sans text-xs tracking-wider text-fg-subtle">
                          {String(ch.number).padStart(2, "0")}
                        </span>
                        {ch.title}
                      </span>
                    </Link>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="mt-4 font-serif text-sm text-fg-muted">
                Chapters will appear here once the volume is bound.
              </p>
            )}
            {book ? (
              <p className="mt-6 font-sans text-xs text-fg-subtle">
                {book.chapters.length} chapters · {book.wordCount.toLocaleString()} words
              </p>
            ) : null}
          </div>
        </div>
      </section>
    </main>
  );
}
