"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/**
 * Renders a musing's Notes (Strapi Rich Text / Markdown) into themed HTML.
 * - remark-gfm enables real-world Markdown: bullet/numbered lists, tables,
 *   strikethrough, task lists, auto-links.
 * - normalize() repairs the most common authoring slip: a list written with no
 *   blank line above it (which strict Markdown would swallow into the paragraph).
 * No raw HTML is allowed (react-markdown is safe by default), so editor content
 * can't inject scripts.
 */

function normalize(md: string): string {
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  const out: string[] = [];
  const isListItem = (l: string) => /^\s*([-*+]|\d+[.)])\s+/.test(l);
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const prev = out[out.length - 1];
    // if a list item directly follows a non-blank, non-list line, insert a blank line
    if (isListItem(line) && prev !== undefined && prev.trim() !== "" && !isListItem(prev)) {
      out.push("");
    }
    out.push(line);
  }
  return out.join("\n");
}

export default function MusingBody({ markdown }: { markdown: string }) {
  return (
    <article className="mus-article">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ href, children }) => (
            <a href={href} target="_blank" rel="noopener noreferrer">
              {children}
            </a>
          ),
        }}
      >
        {normalize(markdown)}
      </ReactMarkdown>
    </article>
  );
}
