import { Fragment } from "react";

/**
 * Renders text written in the admin portal exactly as typed:
 *  - a blank line starts a new paragraph (with space between paragraphs)
 *  - a single Enter keeps a line break
 *  - **double asterisks** make text bold
 * Text is rendered as plain React nodes (never as raw HTML), so it is safe.
 */
function renderInline(line: string) {
  return line.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith("**") && part.endsWith("**") && part.length > 4 ? (
      <strong key={i}>{part.slice(2, -2)}</strong>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    )
  );
}

export function FormattedText({
  text,
  className = "",
  paragraphClassName = "",
}: {
  text: string;
  className?: string;
  paragraphClassName?: string;
}) {
  const paragraphs = (text || "")
    .replace(/\r\n?/g, "\n")
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div className={`space-y-4 ${className}`}>
      {paragraphs.map((p, i) => (
        <p key={i} className={`whitespace-pre-line break-words ${paragraphClassName}`}>
          {renderInline(p)}
        </p>
      ))}
    </div>
  );
}
