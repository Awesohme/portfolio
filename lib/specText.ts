/**
 * /v2 (Spec) drops em/en dashes from the shared project copy in lib/projects.ts
 * WITHOUT mutating that file (the galaxy site still reads it as-is).
 * Date ranges ("2022 – Present") become "to"; prose dashes become a comma.
 */
export const cleanDashes = (s: string): string =>
  s
    .replace(/\s*[—–]\s*(Present|present|\d)/g, " to $1")
    .replace(/\s*[—–]\s*/g, ", ")
    .replace(/[—–]/g, ", ");

/** Split multi-line CMS copy (headings typed with line breaks in Studio) into lines. */
export const splitLines = (s: string): string[] =>
  s.split("\n").map((l) => l.trim()).filter(Boolean);

/** Header copy from the CMS: words wrapped in [square brackets] show in grey. */
export const greyParts = (s: string): { text: string; grey: boolean }[] =>
  s.split(/\[([^\]]+)\]/).map((text, i) => ({ text, grey: i % 2 === 1 })).filter((p) => p.text);

/** The same copy with the grey markers removed, for plain-text places (tab titles, labels). */
export const stripGrey = (s: string): string => s.replace(/\[([^\]]+)\]/g, "$1");
