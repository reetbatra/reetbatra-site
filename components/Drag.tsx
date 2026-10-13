"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { Receipt, Stage } from "@/lib/content";
import { on } from "./bus";

/** The one interaction on the page: drag from `from` to `to` through real stops. */
export default function Drag({ lead, from, to, stages }: { lead: string; from: string; to: string; stages: Stage[] }) {
  const [v, setV] = useState(0);
  const [touched, setTouched] = useState(false);
  const last = stages.length - 1;
  const i = Math.round(v * last);
  const stage = stages[i];
  const small = from.length > 2;

  const step = useCallback(
    (dir: 1 | -1) => {
      setTouched(true);
      setV((cur) => Math.min(last, Math.max(0, Math.round(cur * last) + dir)) / last);
    },
    [last],
  );

  useEffect(() => on("drag:step", step), [step]);

  return (
    <section className="hero" data-done={v >= 0.99 ? "1" : "0"} aria-label={`${lead} ${from} to ${to}`}>
      <p className="lead">{lead}</p>
      <div className="rail">
        <div className={`big from${small ? " sm" : ""}`} aria-hidden="true">
          {from}
        </div>
        <div className="track">
          <div className="bar" />
          <div className="fill" style={{ width: `${v * 100}%` }} />
          <div className="seam" style={{ left: `${v * 100}%` }} />
          <span className="hint" style={{ opacity: touched ? 0 : 1 }} aria-hidden="true">
            drag me →
          </span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={v}
            aria-label={`From ${from} to ${to}`}
            aria-valuetext={`step ${i + 1} of ${stages.length}: ${stage.text}`}
            onChange={(e) => {
              setTouched(true);
              setV(parseFloat(e.target.value));
            }}
            onKeyDown={(e) => {
              // Arrow keys jump stop to stop instead of crawling 1% at a time.
              if (e.key === "ArrowRight" || e.key === "ArrowUp") step(1);
              else if (e.key === "ArrowLeft" || e.key === "ArrowDown") step(-1);
              else if (e.key === "Home") setV(0);
              else if (e.key === "End") setV(1);
              else return;
              e.preventDefault();
            }}
          />
        </div>
        <div className={`big to${small ? " sm" : ""}`} aria-hidden="true">
          {to}
        </div>
      </div>
      <div className="stage" aria-live="polite">
        <div>
          <span className="num" aria-hidden="true">
            {v.toFixed(2)}
          </span>
          <span className="t">{stage.text}</span>
        </div>
        {stage.receipt && <ReceiptLink r={stage.receipt} />}
      </div>
    </section>
  );
}

export function ReceiptLink({ r }: { r: Receipt }) {
  const inner = (
    <>
      <span>{r.label}</span>
      <b>{r.state}</b>
    </>
  );
  return r.href.startsWith("/") ? (
    <Link className="rc" href={r.href}>
      {inner}
    </Link>
  ) : (
    <a className="rc" href={r.href} target="_blank" rel="noopener noreferrer">
      {inner}
    </a>
  );
}
