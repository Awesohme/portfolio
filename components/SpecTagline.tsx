"use client";

import { useEffect, useRef } from "react";

const WORDS = [
  "business outcome.",
  "activation lift.",
  "retention.",
  "a validated bet.",
  "revenue.",
];

/** Typed/erasing tagline used in the Spec hero bubble. */
export default function SpecTagline() {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let w = 0,
      c = 0,
      del = false;
    let timer: ReturnType<typeof setTimeout>;
    const type = () => {
      const word = WORDS[w];
      if (ref.current) ref.current.textContent = del ? word.slice(0, c--) : word.slice(0, c++);
      if (!del && c === word.length + 1) {
        del = true;
        timer = setTimeout(type, 1500);
        return;
      }
      if (del && c < 0) {
        del = false;
        w = (w + 1) % WORDS.length;
        c = 0;
      }
      timer = setTimeout(type, del ? 40 : 80);
    };
    timer = setTimeout(type, 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <span className="spec-tag">
      From bet → <span ref={ref}>business outcome.</span>
      <span className="cur" />
    </span>
  );
}
