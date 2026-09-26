/**
 * Miracle-only block for her case study: a soft sakura sky (falling petals, rising hearts,
 * twinkles) behind the page, and a keepsake card with her name. Pure CSS motion, fixed
 * positions (no randomness) so server and browser render the same thing.
 */

const PETALS = [
  { x: 4, d: 14, delay: -2, s: 1, sway: 40 },
  { x: 12, d: 18, delay: -9, s: 0.7, sway: -30 },
  { x: 21, d: 16, delay: -5, s: 0.9, sway: 50 },
  { x: 30, d: 20, delay: -13, s: 0.6, sway: -40 },
  { x: 38, d: 15, delay: -1, s: 1.1, sway: 35 },
  { x: 47, d: 19, delay: -11, s: 0.8, sway: -50 },
  { x: 55, d: 17, delay: -7, s: 1, sway: 30 },
  { x: 63, d: 21, delay: -15, s: 0.7, sway: -35 },
  { x: 71, d: 16, delay: -4, s: 0.9, sway: 45 },
  { x: 79, d: 18, delay: -10, s: 1.2, sway: -30 },
  { x: 87, d: 15, delay: -6, s: 0.8, sway: 40 },
  { x: 95, d: 20, delay: -12, s: 0.9, sway: -45 },
  { x: 9, d: 22, delay: -17, s: 0.6, sway: 30 },
  { x: 67, d: 23, delay: -19, s: 0.65, sway: -25 },
];

const HEARTS = [
  { x: 7, d: 13, delay: -3, s: 0.8 },
  { x: 18, d: 16, delay: -10, s: 0.55 },
  { x: 33, d: 14, delay: -6, s: 1 },
  { x: 44, d: 18, delay: -13, s: 0.6 },
  { x: 58, d: 15, delay: -1, s: 0.9 },
  { x: 69, d: 17, delay: -8, s: 0.7 },
  { x: 82, d: 14, delay: -11, s: 1.05 },
  { x: 92, d: 19, delay: -4, s: 0.6 },
];

const TWINKLES = [
  { x: 8, y: 22, delay: 0 },
  { x: 26, y: 12, delay: 1.2 },
  { x: 49, y: 30, delay: 2.1 },
  { x: 74, y: 16, delay: 0.6 },
  { x: 90, y: 40, delay: 1.7 },
  { x: 15, y: 62, delay: 2.6 },
  { x: 61, y: 70, delay: 0.9 },
  { x: 86, y: 78, delay: 2.2 },
];

const ORBS = [
  { x: 10, y: 18, size: 180, d: 16, delay: 0 },
  { x: 78, y: 12, size: 240, d: 20, delay: -6 },
  { x: 62, y: 58, size: 160, d: 18, delay: -3 },
  { x: 18, y: 74, size: 220, d: 22, delay: -9 },
  { x: 88, y: 82, size: 140, d: 15, delay: -5 },
];

const HEART_PATH = "M12 21s-7.5-4.6-10-9.3C.3 8.4 2 4.5 5.8 4.1c2.2-.2 3.6 1 4.4 2.3.3.5 1.3.5 1.6 0 .8-1.3 2.2-2.5 4.4-2.3C20 4.5 21.7 8.4 22 11.7 19.5 16.4 12 21 12 21z";

type Vars = React.CSSProperties & Record<`--${string}`, string>;

export default function MiracleTribute({ kana, name, line, foot }: { kana: string; name: string; line: string; foot: string }) {
  return (
    <>
      <div className="miracle-sky" aria-hidden="true">
        {ORBS.map((o, i) => (
          <span
            key={`o${i}`}
            className="miracle-orb"
            style={{ "--x": `${o.x}%`, "--y": `${o.y}%`, "--size": `${o.size}px`, "--d": `${o.d}s`, "--delay": `${o.delay}s` } as Vars}
          />
        ))}
        {PETALS.map((p, i) => (
          <span
            key={`p${i}`}
            className="miracle-petal"
            style={{ "--x": `${p.x}%`, "--d": `${p.d}s`, "--delay": `${p.delay}s`, "--s": `${p.s}`, "--sway": `${p.sway}px` } as Vars}
          />
        ))}
        {HEARTS.map((h, i) => (
          <svg
            key={`h${i}`}
            className="miracle-float-heart"
            viewBox="0 0 24 24"
            style={{ "--x": `${h.x}%`, "--d": `${h.d}s`, "--delay": `${h.delay}s`, "--s": `${h.s}` } as Vars}
          >
            <path d={HEART_PATH} />
          </svg>
        ))}
        {TWINKLES.map((t, i) => (
          <span
            key={`t${i}`}
            className="miracle-twinkle"
            style={{ "--x": `${t.x}%`, "--y": `${t.y}%`, "--delay": `${t.delay}s` } as Vars}
          />
        ))}
      </div>

      <section className="miracle-keepsake">
        <div className="miracle-card">
          <span className="miracle-spark miracle-spark-a" aria-hidden="true" />
          <span className="miracle-spark miracle-spark-b" aria-hidden="true" />
          <span className="miracle-spark miracle-spark-c" aria-hidden="true" />
          <div className="miracle-heart-wrap" aria-hidden="true">
            <span className="miracle-halo" />
            <svg className="miracle-heart" viewBox="0 0 24 24">
              <defs>
                <linearGradient id="miracle-heart-fill" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#ffb3cf" />
                  <stop offset="55%" stopColor="#f0679f" />
                  <stop offset="100%" stopColor="#c44b93" />
                </linearGradient>
              </defs>
              <path d={HEART_PATH} fill="url(#miracle-heart-fill)" />
              <ellipse cx="7.6" cy="8.2" rx="2.1" ry="1.3" fill="#fff" opacity=".55" transform="rotate(-32 7.6 8.2)" />
            </svg>
          </div>
          <p className="miracle-kana">{kana}</p>
          <p className="miracle-name">{name}</p>
          <p className="miracle-line">{line}</p>
          <p className="miracle-foot">{foot}</p>
        </div>
      </section>
    </>
  );
}
