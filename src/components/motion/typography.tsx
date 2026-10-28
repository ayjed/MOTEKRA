import { Reveal } from "./reveal";

// Heading and line content remain Server Components, passed through a small
// client animation boundary. No DOM splitting, duplicated speech or aria hiding.
export function SplitHeading({
  lines,
  as: Tag = "h2",
  className = "",
}: {
  lines: readonly string[];
  as?: "h1" | "h2" | "h3";
  className?: string;
}) {
  const fullText = lines.join(" ");

  return (
    <Reveal kind="lines">
      <Tag className={`split-heading ${className}`} aria-label={fullText}>
        {lines.map((line, index) => (
          <span className="line-mask" key={`${index}-${line}`} aria-hidden="true">
            <span data-line>{line}</span>
            {index < lines.length - 1 ? " " : null}
          </span>
        ))}
      </Tag>
    </Reveal>
  );
}

