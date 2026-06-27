"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function normalize(md: string): string {
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  const out: string[] = [];
  const isListItem = (l: string) => /^\s*([-*+]|\d+[.)])\s+/.test(l);
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const prev = out[out.length - 1];
    if (isListItem(line) && prev !== undefined && prev.trim() !== "" && !isListItem(prev)) {
      out.push("");
    }
    out.push(line);
  }
  return out.join("\n");
}

export default function SpecProse({ content, className }: { content: string; className?: string }) {
  return (
    <div className={`spec-prose ${className ?? ""}`}>
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
        {normalize(content)}
      </ReactMarkdown>
    </div>
  );
}
