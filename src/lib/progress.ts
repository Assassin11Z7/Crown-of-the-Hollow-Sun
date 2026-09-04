const KEY = "hollow-sun-progress-v1";

export type BookProgress = {
  chapter: number;
  scroll: number;
  updated: number;
};

export type ProgressMap = Record<string, BookProgress>;

function read(): ProgressMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return {};
    return JSON.parse(raw) as ProgressMap;
  } catch {
    return {};
  }
}

function write(map: ProgressMap) {
  try {
    localStorage.setItem(KEY, JSON.stringify(map));
  } catch {
    /* ignore quota */
  }
}

export function getProgress(bookId: string): BookProgress | null {
  return read()[bookId] ?? null;
}

export function setProgress(bookId: string, chapter: number, scroll = 0) {
  const map = read();
  map[bookId] = { chapter, scroll, updated: Date.now() };
  write(map);
}

export function getLastRead(): { bookId: string; progress: BookProgress } | null {
  const map = read();
  let best: { bookId: string; progress: BookProgress } | null = null;
  for (const [bookId, progress] of Object.entries(map)) {
    if (!best || progress.updated > best.progress.updated) {
      best = { bookId, progress };
    }
  }
  return best;
}
