"use client";

import { useEffect, useRef } from "react";

/** Typed/erasing tagline used in the Spec hero bubble. Prefix + words come from Site Settings. */
export default function SpecTagline({ prefix, words }: { prefix: string; words: string[] }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let w = 0,
      c = 0,
      del = false;
    let timer: ReturnType<typeof setTimeout>;
    const type = () => {
      const word = words[w];
      if (ref.current) ref.current.textContent = del ? word.slice(0, c--) : word.slice(0, c++);
      if (!del && c === word.length + 1) {
        del = true;
        timer = setTimeout(type, 1500);
        return;
      }
      if (del && c < 0) {
        del = false;
        w = (w + 1) % words.length;
        c = 0;
      }
      timer = setTimeout(type, del ? 40 : 80);
    };
    timer = setTimeout(type, 600);
    return () => clearTimeout(timer);
  }, [words]);

  return (
    <span className="spec-tag">
      {prefix} <span ref={ref}>{words[0]}</span>
      <span className="cur" />
    </span>
  );
}
