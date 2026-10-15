"use client";

import { useEffect, useState } from "react";
import type { TocEntry } from "@/lib/posts";

/**
 * The post's sections down the left side. The one you're reading is in ink, the rest grey;
 * click one to jump there. Hidden on narrow screens, where there's no side to put it on.
 */
export default function Toc({ entries }: { entries: TocEntry[] }) {
  const [active, setActive] = useState(entries[0]?.id ?? "");

  useEffect(() => {
    const heads = entries.map((e) => document.getElementById(e.id)).filter((h): h is HTMLElement => !!h);
    if (!heads.length) return;
    // The current section is the last heading that has scrolled above a line a third of the
    // way down the screen.
    const pick = () => {
      const line = window.innerHeight / 3;
      let current = heads[0].id;
      for (const h of heads) if (h.getBoundingClientRect().top <= line) current = h.id;
      setActive(current);
    };
    pick();
    window.addEventListener("scroll", pick, { passive: true });
    window.addEventListener("resize", pick);
    return () => {
      window.removeEventListener("scroll", pick);
      window.removeEventListener("resize", pick);
    };
  }, [entries]);

  if (entries.length < 2) return null;
  return (
    <nav className="toc" aria-label="In this post">
      <ol>
        {entries.map((e) => (
          <li key={e.id}>
            <a href={`#${e.id}`} aria-current={e.id === active ? "location" : undefined}>
              {e.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
