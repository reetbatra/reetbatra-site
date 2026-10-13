"use client";

import { useEffect, useRef, useState } from "react";
import { DRIFT_ROUNDS } from "@/lib/content";

type Mark = "" | "right" | "wrong";

function lineMark(answered: boolean, i: number, answer: number, picked?: number): Mark {
  if (!answered) return "";
  if (i === answer) return "right";
  return i === picked ? "wrong" : "";
}

function pipClass(pick: number | undefined, answer: number) {
  if (pick === undefined) return "";
  return pick === answer ? "y" : "n";
}

/** Three real bugs from merged PRs. Pick the line that drifted from the code. */
export default function DriftGame() {
  const [round, setRound] = useState(0);
  const [picks, setPicks] = useState<(number | undefined)[]>([]);
  const next = useRef<HTMLButtonElement>(null);
  const code = useRef<HTMLDivElement>(null);
  const moved = useRef(false);
  const r = DRIFT_ROUNDS[round];
  const picked = picks[round];
  const answered = picked !== undefined;
  const last = round === DRIFT_ROUNDS.length - 1;
  const score = picks.filter((p, i) => p === DRIFT_ROUNDS[i].answer).length;

  useEffect(() => {
    if (answered) next.current?.focus();
  }, [answered]);

  // The next button unmounts when a new round starts, so hand focus to the first line.
  useEffect(() => {
    if (moved.current && !answered) code.current?.querySelector("button")?.focus();
  }, [round, answered]);

  const pick = (i: number) => {
    if (answered) return;
    setPicks((p) => {
      const copy = [...p];
      copy[round] = i;
      return copy;
    });
  };

  return (
    <div>
      <p className="q">
        <span className="of">
          {round + 1} of {DRIFT_ROUNDS.length} ·{" "}
        </span>
        {r.question}
      </p>
      <div ref={code} className="code" role="group" aria-label="Lines of code">
        {r.lines.map((line, i) => {
          const state = lineMark(answered, i, r.answer, picked);
          return (
            <button
              key={line}
              type="button"
              className={state}
              aria-disabled={answered}
              aria-label={state ? `${line}, ${state === "right" ? "the drifted line" : "your pick, not it"}` : undefined}
              onClick={() => pick(i)}
            >
              {line}
            </button>
          );
        })}
      </div>
      {answered && (
        <p className="why" aria-live="polite">
          {picked === r.answer ? "Yes. " : "Not that one. "}
          {r.why} I fixed this one:{" "}
          <a href={r.pr.href} target="_blank" rel="noopener noreferrer">
            {r.pr.label}
          </a>
          .
        </p>
      )}
      <div className="row">
        <span className="pips" aria-label={`${score} right so far`}>
          {DRIFT_ROUNDS.map((d, i) => (
            <i key={i} className={pipClass(picks[i], d.answer)} />
          ))}
        </span>
        {answered && (
          <span>
            {last && (
              <span className="score">
                you got {score}/{DRIFT_ROUNDS.length}. all three were real.
              </span>
            )}
            <button
              ref={next}
              type="button"
              onClick={() => {
                moved.current = true;
                if (last) {
                  setPicks([]);
                  setRound(0);
                } else setRound(round + 1);
              }}
            >
              {last ? "again" : "next"}
            </button>
          </span>
        )}
      </div>
    </div>
  );
}
