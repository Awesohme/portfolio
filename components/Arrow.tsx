/**
 * Drawn arrow icon (currentColor, sized to the text around it).
 * Used instead of arrow characters: phones swap ↗ ↘ ⬇ for colour emoji.
 */
const PATH = {
  right: "M3 12h18M15.5 6.5 21 12l-5.5 5.5",
  left: "M21 12H3M8.5 6.5 3 12l5.5 5.5",
  down: "M12 3v18M6.5 15.5 12 21l5.5-5.5",
  up: "M12 21V3M6.5 8.5 12 3l5.5 5.5",
  "up-right": "M4 20 20 4M11 4h9v9",
  "down-right": "M4 4l16 16M20 11v9h-9",
} as const;

export type ArrowDir = keyof typeof PATH;

export default function Arrow({ dir = "right", weight = 1.75 }: { dir?: ArrowDir; weight?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="none"
      stroke="currentColor"
      strokeWidth={weight}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="arrow-icon"
      style={{ display: "inline-block", verticalAlign: "-0.125em", flexShrink: 0 }}
    >
      <path d={PATH[dir]} />
    </svg>
  );
}
