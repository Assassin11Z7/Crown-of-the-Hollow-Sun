import { createFileRoute, Link } from "@tanstack/react-router";
import { Download, BookOpen } from "lucide-react";
import { BOOKS, SERIES, TRILOGY_ZIP } from "@/data/meta";
import { CoverFrame } from "@/components/CoverFrame";
import { HollowSun } from "@/components/HollowSun";
import { getLastRead, getProgress } from "@/lib/progress";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const [resume, setResume] = useState<null | { slug: string; chapter: number; title: string }>(
    null,
  );

  useEffect(() => {
    const last = getLastRead();
    if (!last) return;
    const meta = BOOKS.find((b) => b.id === last.bookId);
    if (!meta) return;
    const ch = last.progress.chapter || 1;
    setResume({ slug: meta.id, chapter: ch, title: meta.title });
  }, []);

  return (
    <main className="relative min-h-dvh overflow-x-hidden bg-bg text-fg">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[420px] opacity-40"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% -10%, color-mix(in oklab, var(--color-accent) 22%, transparent), transparent 70%)",
        }}
      />

      <header className="relative mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 pt-6 pb-2 sm:px-8">
        <div className="flex items-center gap-2.5 text-accent">
          <HollowSun className="size-7" />
          <span className="font-sans text-[11px] font-medium tracking-[0.22em] text-fg-muted uppercase">
            The Ashveil Cycle
          </span>
        </div>
        <a
          href={TRILOGY_ZIP}
          download
          className="inline-flex min-h-11 items-center gap-2 rounded-md border border-border px-3.5 text-sm font-medium text-fg-muted transition-colors duration-150 hover:border-border-strong hover:text-fg"
        >
          <Download className="size-4" />
          <span className="hidden sm:inline">Download trilogy for Word</span>
          <span className="sm:hidden">All three</span>
        </a>
      </header>

      <section className="relative mx-auto max-w-3xl px-5 pt-10 pb-8 text-center sm:px-8 sm:pt-14">
        <p className="font-sans text-[11px] font-medium tracking-[0.28em] text-accent uppercase">
          A complete trilogy
        </p>
        <h1 className="mt-3 font-display text-[2.6rem] leading-[0.95] font-semibold tracking-tight text-fg sm:text-6xl">
          Crown of the Hollow Sun
        </h1>
        <p className="mt-5 font-serif text-lg text-fg-muted italic sm:text-xl">
          {SERIES.tagline}
        </p>
        <p className="mx-auto mt-6 max-w-xl font-serif text-[1.05rem] leading-relaxed text-fg-muted">
          {SERIES.premise}
        </p>
        {resume ? (
          <Link
            to="/read/$slug"
            params={{ slug: resume.slug }}
            search={{ c: resume.chapter }}
            className="mt-8 inline-flex min-h-11 items-center gap-2 rounded-md bg-accent px-5 font-sans text-sm font-medium text-accent-fg transition-opacity duration-150 hover:opacity-90"
          >
            <BookOpen className="size-4" />
            {`Resume ${resume.title}, chapter ${resume.chapter}`}
          </Link>
        ) : null}
      </section>

      <section className="relative mx-auto grid max-w-6xl gap-10 px-5 py-6 sm:px-8 md:grid-cols-3 md:gap-6 lg:gap-10">
        {BOOKS.map((book, i) => (
          <BookCard key={book.id} book={book} priority={i === 0} />
        ))}
      </section>

      <section className="relative mx-auto max-w-2xl px-5 py-12 text-center sm:px-8">
        <div className="ornament" aria-hidden>
          *
        </div>
        <p className="font-serif text-base leading-relaxed text-fg-muted">
          Three novels. Three Word files. Read them here in the lamp-light, or
          download each volume and open it in Word — title pages, chapters, and
          all.
        </p>
      </section>

      <footer className="border-t border-border px-5 py-8 text-center sm:px-8">
        <p className="font-sans text-xs tracking-wide text-fg-subtle">
          Crown of the Hollow Sun · Ignition · Ascension · Eclipse
        </p>
      </footer>
    </main>
  );
}

function BookCard({
  book,
  priority,
}: {
  book: (typeof BOOKS)[number];
  priority: boolean;
}) {
  const [chapter, setChapter] = useState<number | null>(null);
  useEffect(() => {
    const p = getProgress(book.id);
    setChapter(p?.chapter ?? null);
  }, [book.id]);

  return (
    <article className="flex flex-col">
      <Link
        to="/book/$slug"
        params={{ slug: book.id }}
        className="group block"
        aria-label={`${book.series}, Book ${book.roman}: ${book.title}`}
      >
        <CoverFrame
          src={book.cover}
          alt=""
          priority={priority}
          className="aspect-2/3 w-full"
        />
        <div className="mt-5 text-center md:text-left">
          <p className="font-sans text-[11px] font-medium tracking-[0.22em] text-accent uppercase">
            Book {book.roman}
          </p>
          <h2 className="mt-1 font-display text-3xl font-semibold tracking-tight">
            {book.title}
          </h2>
          <p className="mt-1 font-serif text-sm text-fg-muted italic">{book.subtitle}</p>
        </div>
      </Link>
      <p className="mt-3 line-clamp-4 font-serif text-sm leading-relaxed text-fg-muted">
        {book.synopsis}
      </p>
      <div className="mt-5 flex flex-wrap gap-2">
        <Link
          to="/read/$slug"
          params={{ slug: book.id }}
          search={{ c: chapter && chapter > 0 ? chapter : 1 }}
          className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-md bg-fg px-4 text-sm font-medium text-bg transition-opacity duration-150 hover:opacity-90"
        >
          <BookOpen className="size-4" />
          {chapter && chapter > 1 ? "Continue" : "Read"}
        </Link>
        <a
          href={book.docx}
          download={book.filename}
          className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-md border border-border px-4 text-sm font-medium text-fg transition-colors duration-150 hover:border-border-strong"
        >
          <Download className="size-4" />
          Word
        </a>
      </div>
    </article>
  );
}
