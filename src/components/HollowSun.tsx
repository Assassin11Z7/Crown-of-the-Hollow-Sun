import { cn } from "@/lib/utils";

export function HollowSun({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={cn("text-accent", className)}
      fill="none"
      aria-hidden="true"
    >
      <circle cx="16" cy="16" r="11.5" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="16" cy="16" r="3.6" stroke="currentColor" strokeWidth="1.2" />
      <path
        d="M16 2.8v3.2M16 26v3.2M2.8 16h3.2M26 16h3.2M6.4 6.4l2.2 2.2M23.4 23.4l2.2 2.2M6.4 25.6l2.2-2.2M23.4 8.6l2.2-2.2"
        stroke="currentColor"
        strokeWidth="1.15"
        strokeLinecap="round"
      />
    </svg>
  );
}
