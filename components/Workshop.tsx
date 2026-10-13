"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import type { Card } from "@/lib/content";
import { Demo } from "./Demos";
import DriftGame from "./DriftGame";
import Glyph from "./Glyph";

const ext = { target: "_blank", rel: "noopener noreferrer" } as const;

/**
 * The workshop: a grid of small live sketches, one per thing. On a mouse they play on hover;
 * on a phone, where nothing hovers, each one plays while it's on screen.
 */
export default function Workshop({ cards, seeAll }: { cards: Card[]; seeAll: string }) {
  const list = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(hover: none)").matches || !list.current) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.target.classList.toggle("inview", e.isIntersecting)),
      { threshold: 0.6 },
    );
    list.current.querySelectorAll(".card").forEach((c) => io.observe(c));
    return () => io.disconnect();
  }, []);

  return (
    <section className="sec wide" aria-labelledby="workshop-t">
      <header className="sec-head">
        <h2 id="workshop-t">workshop</h2>
        <Link href="/work">{seeAll} →</Link>
      </header>
      <ul ref={list} className="lab">
        {cards.map((c) => {
          if (c.type === "drift")
            return (
              <li key="drift" id="drift" className="card drift">
                <div className="stage">
                  <p className="drift-t">
                    <Glyph name="neq" className="mini" /> spot the drift
                  </p>
                  <DriftGame />
                </div>
                <div className="meta">
                  <span className="t">three real bugs, three merged fixes</span>
                  <span className="when">play</span>
                </div>
              </li>
            );
          if (c.type === "diff") {
            const d = c.diff;
            return (
              <li key={d.id} id={d.id} className="card diff">
                <div className="stage">
                  <div className="d-diff">
                    <code className="old">
                      <span aria-hidden="true">- </span>
                      {d.before}
                    </code>
                    <code className="new">
                      <span aria-hidden="true">+ </span>
                      {d.after}
                    </code>
                    <p>{d.note}</p>
                  </div>
                </div>
                <div className="meta">
                  <a className="t" href={d.pr.href} {...ext}>
                    {d.title}
                  </a>
                  <span className="when">merged</span>
                </div>
                <p className="what mono">{d.pr.label}</p>
              </li>
            );
          }
          const w = c.item;
          return (
            <li key={w.id} id={w.id} className="card">
              <div className="stage">
                <Glyph name={w.glyph} className="mark-g" />
                <Demo id={w.id} />
              </div>
              <div className="meta">
                <a className="t" href={w.href} {...ext}>
                  {w.title}
                </a>
                <span className="when">{w.when}</span>
              </div>
              <p className="what">{w.what}</p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
