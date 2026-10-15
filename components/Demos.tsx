"use client";

import { useState } from "react";
import Glyph from "./Glyph";

// One tiny sketch per product, drawn in ink on the card. CSS runs the loops: they play while
// the card is hovered or focused (or on screen, on phones) and sit still with reduced motion.
// They are sketches of what each thing does, not screenshots, and the words are mine.

function AskTota() {
  return (
    <div className="d-chat">
      <p className="me">tota, should I text him?</p>
      <p className="tota">
        <Glyph name="parrot" className="av" />
        <span>your moon says wait till thursday.</span>
      </p>
    </div>
  );
}

function Bestie() {
  const [panic, setPanic] = useState(false);
  return (
    <div className="d-bestie">
      <p className="streak">
        no contact <b>day 12</b>
      </p>
      <button type="button" className="panic" aria-pressed={panic} onClick={() => setPanic((p) => !p)}>
        {panic ? "okay. phone down." : "panic"}
      </button>
    </div>
  );
}

function DocsParity() {
  return (
    <div className="d-parity">
      <div>
        <span className="lbl">docs</span>
        <code>cw.twins()</code>
      </div>
      <span className="ne" aria-hidden="true">
        ≠
      </span>
      <div>
        <span className="lbl">code</span>
        <code>cw.twin()</code>
      </div>
      <span className="filed">issue filed</span>
    </div>
  );
}

const BARS = [3, 6, 9, 5, 11, 7, 4, 10, 6, 12, 8, 5, 9, 3, 7, 11, 6, 4, 8, 5];

function Blunt() {
  return (
    <div className="d-blunt">
      <div className="wave" aria-hidden="true">
        {BARS.map((h, i) => (
          <i key={i} style={{ "--h": h, "--i": i } as React.CSSProperties} />
        ))}
      </div>
      <p>
        <s>um</s> so the <s>like</s> plan is
      </p>
      <p className="again">say it again.</p>
    </div>
  );
}

function MuscleMommy() {
  const [tried, setTried] = useState(false);
  return (
    <div className="d-lift">
      <p className="set">
        next set <b>3 × 8 · 2.5 kg</b>
      </p>
      <button type="button" onClick={() => setTried((t) => !t)} aria-pressed={tried}>
        {tried ? "5 kg? too big a jump." : "go heavier"}
      </button>
    </div>
  );
}

function Nudge() {
  return (
    <div className="d-nudge">
      <p className="time">9:00</p>
      <p className="push">
        <Glyph name="bell" className="av" />
        <span>one thing today: apply to the role you saved.</span>
      </p>
    </div>
  );
}

function HookCatch() {
  const [run, setRun] = useState(0);
  return (
    <div className="d-hook">
      <ol key={run}>
        <li>POST /hook · 200</li>
        <li>POST /hook · 200</li>
        <li>POST /hook · 500</li>
      </ol>
      <button type="button" onClick={() => setRun((r) => r + 1)}>
        replay
      </button>
    </div>
  );
}

function LcDoctor() {
  return (
    <div className="d-lc">
      <code className="old">from langchain.llms import OpenAI</code>
      <code className="new">from langchain_openai import OpenAI</code>
    </div>
  );
}

// The fact behind kya bola, drawn: the Vaani corpus has 64 languages and commercial speech
// APIs support 19 of them (from the kya-bola README). Filled dots are supported, hollow aren't.
const LANGS = Array.from({ length: 64 }, (_, i) => i < 19);
const VOICE = [4, 7, 10, 6, 12, 8, 5, 11, 7, 13, 9, 6, 10, 4, 8, 12, 6, 9];

function KyaBola() {
  return (
    <div className="d-kya">
      <div className="wave" aria-hidden="true">
        {VOICE.map((h, i) => (
          <i key={i} style={{ "--h": h, "--i": i } as React.CSSProperties} />
        ))}
      </div>
      <div className="langs" role="img" aria-label="64 languages, 19 with a commercial speech API">
        {LANGS.map((on, i) => (
          <i key={i} className={on ? "on" : undefined} style={{ "--i": i } as React.CSSProperties} />
        ))}
      </div>
      <p>
        <b>19</b> of 64 languages have a speech API
      </p>
    </div>
  );
}

export const DEMOS: Record<string, () => React.ReactNode> = {
  asktota: AskTota,
  bestie: Bestie,
  docsparity: DocsParity,
  blunt: Blunt,
  musclemommy: MuscleMommy,
  nudge: Nudge,
  hookcatch: HookCatch,
  lcdoctor: LcDoctor,
  kyabola: KyaBola,
};

export function Demo({ id }: { id: string }) {
  const D = DEMOS[id];
  if (!D) throw new Error(`workshop: no demo for "${id}"`);
  return <D />;
}
