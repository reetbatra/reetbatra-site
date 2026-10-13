"use client";

import { useEffect, useState } from "react";
import type { MIND } from "@/lib/content";
import { on } from "./bus";

/** $ tail -f mind. Three lines to start, one more each press of + . */
export default function Mind({ items, start = 3 }: { items: typeof MIND; start?: number }) {
  const [n, setN] = useState(Math.min(start, items.length));
  const [grew, setGrew] = useState(false);
  const left = items.length - n;

  useEffect(
    () =>
      on("mind:more", () => {
        setGrew(true);
        setN((c) => Math.min(items.length, c + 1));
      }),
    [items.length],
  );

  return (
    <aside className="mind" aria-labelledby="mind-h">
      <h2 id="mind-h">$ tail -f mind</h2>
      <ol aria-live="polite">
        {items.slice(0, n).map((m, idx) => (
          <li key={m.date + m.text} className={grew && idx === n - 1 ? "new" : undefined}>
            <span className="ts">{m.date}</span>
            <span className="tx">
              {m.href ? (
                <a href={m.href} target="_blank" rel="noopener noreferrer">
                  {m.text}
                </a>
              ) : (
                m.text
              )}
            </span>
          </li>
        ))}
      </ol>
      <button
        type="button"
        className="more"
        disabled={!left}
        onClick={() => {
          setGrew(true);
          setN((c) => Math.min(items.length, c + 1));
        }}
      >
        {left ? `+ one more · ${left} left` : "that's everything for now"}
      </button>
    </aside>
  );
}
