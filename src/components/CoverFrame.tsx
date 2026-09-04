import { cn } from "@/lib/utils";

export function CoverFrame({
  src,
  alt,
  className,
  priority = false,
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <div
      className={cn(
        "cover-tilt relative overflow-hidden rounded-sm bg-bg-subtle shadow-[var(--shadow-cover)]",
        "ring-1 ring-border",
        className,
      )}
    >
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-3 bg-linear-to-r from-bg/60 to-transparent"
        aria-hidden
      />
      <img
        src={src}
        alt={alt}
        className="block h-full w-full object-cover"
        draggable={false}
        decoding="async"
        fetchPriority={priority ? "high" : "auto"}
      />
    </div>
  );
}
