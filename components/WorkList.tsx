"use client";

import { useMemo, useState } from "react";
import type { WorkItem, WorkKind } from "@/lib/content";

const GROUP: Record<WorkKind, string> = {
  product: "built and shipped",
  pr: "merged upstream",
  report: "reported, fixed by the maintainers",
  role: "before",
};

/**
 * Receipts, grouped by what this page leads with. The scrubber walks the same items in date
 * order: everything after the square fades, so you can watch the pile grow.
 */
export default function WorkList({ items }: { items: WorkItem[] }) {
  const timeline = useMemo(() => [...items].sort((a, b) => a.date.localeCompare(b.date)), [items]);
  const [at, setAt] = useState(timeline.length - 1);
  const cur = timeline[at];
  const pct = timeline.length > 1 ? (at / (timeline.length - 1)) * 100 : 100;

  const groups: { kind: WorkKind; rows: WorkItem[] }[] = [];
  for (const it of items) {
    const g = groups.at(-1);
    if (g && g.kind === it.kind) g.rows.push(it);
    else groups.push({ kind: it.kind, rows: [it] });
  }

  return (
    <>
      <div className="scrub">
        <div className="now" aria-hidden="true">
          {at === timeline.length - 1 ? "now" : cur.when}
        </div>
        <div className="big-row" aria-hidden="true">
          {cur.title}
        </div>
        <div className="track">
          <div className="bar" />
          <div className="fill" style={{ width: `${pct}%` }} />
          <div className="seam" style={{ left: `${pct}%` }} />
          <input
            type="range"
            min={0}
            max={timeline.length - 1}
            step={1}
            value={at}
            aria-label="Scrub through the work by date"
            aria-valuetext={`${cur.when}: ${cur.title}`}
            onChange={(e) => setAt(parseInt(e.target.value, 10))}
          />
        </div>
        <div className="ends" aria-hidden="true">
          <span>{timeline[0].date.slice(0, 4)}</span>
          <span>now</span>
        </div>
      </div>

      {groups.map((g) => (
        <section key={g.kind} aria-labelledby={`g-${g.kind}`}>
          <h2 className="group" id={`g-${g.kind}`}>
            {GROUP[g.kind]}
          </h2>
          <ul className="rows">
            {g.rows.map((w) => {
              const later = w.date > cur.date;
              return (
                <li key={w.href} aria-current={w === cur ? "true" : undefined} className={later ? "later" : undefined}>
                  <a href={w.href} target={w.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">
                    <span className="r-when">{w.when}</span>
                    <span className="r-title">{w.title}</span>
                    <span className={`chip ${w.status}`}>{w.status}</span>
                    <span className="r-what">{w.what}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </>
  );
}
