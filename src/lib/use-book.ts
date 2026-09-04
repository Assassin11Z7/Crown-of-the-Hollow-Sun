import { useEffect, useState } from "react";
import type { BookContent } from "@/lib/types";

const cache = new Map<string, BookContent>();

export function useBook(id: string | undefined) {
  const [book, setBook] = useState<BookContent | null>(() =>
    id && cache.has(id) ? cache.get(id)! : null,
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(!book);

  useEffect(() => {
    if (!id) return;
    if (cache.has(id)) {
      setBook(cache.get(id)!);
      setLoading(false);
      setError(null);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetch(`/content/${id}.json`)
      .then(async (res) => {
        if (!res.ok) throw new Error("This volume has not been bound yet.");
        return (await res.json()) as BookContent;
      })
      .then((data) => {
        if (cancelled) return;
        cache.set(id, data);
        setBook(data);
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Could not open the book.");
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  return { book, error, loading };
}
