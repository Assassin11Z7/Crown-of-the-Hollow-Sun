export function ProseText({ text }: { text: string }) {
  const parts = text.split(/(\*[^*]+\*)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
          return <em key={i}>{part.slice(1, -1)}</em>;
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

export function isBreak(paragraph: string) {
  const t = paragraph.trim();
  return t === "*" || t === "⁂" || t === "* * *";
}

export function DropCapParagraph({ text }: { text: string }) {
  const trimmed = text.trim();
  if (!trimmed) return null;
  const first = trimmed[0] ?? "";
  const rest = trimmed.slice(1);
  return (
    <p>
      <span className="drop-letter">{first}</span>
      <ProseText text={rest} />
    </p>
  );
}
