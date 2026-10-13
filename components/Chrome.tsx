"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { emit, on, reducedMotion } from "./bus";
import DriftGame from "./DriftGame";
import { asciiPortrait, loadPortrait, scramble } from "./portrait-canvas";
import { currentTheme, setTheme, useTheme } from "./theme";

type Pop = "keys" | "game" | null;

const isTyping = (t: EventTarget | null) =>
  t instanceof HTMLElement &&
  (t.isContentEditable || t.tagName === "TEXTAREA" || (t.tagName === "INPUT" && (t as HTMLInputElement).type !== "range"));

/**
 * Footer, keyboard shortcuts, the lights, and the two overlays (keys / spot the drift) plus the
 * press-p portrait. `main` is the page with the drag and the mind list; sub pages get fewer keys.
 */
export default function Chrome({ game, main, resume }: { game: boolean; main: boolean; resume: boolean }) {
  const [pop, setPop] = useState<Pop>(null);
  const [egg, setEgg] = useState(false);
  const theme = useTheme();
  const opener = useRef<HTMLElement | null>(null);
  const eggPre = useRef<HTMLPreElement>(null);
  const eggBtn = useRef<HTMLButtonElement>(null);

  const toggle = useCallback(
    (p: Exclude<Pop, null>) => {
      if (pop !== p) opener.current = document.activeElement as HTMLElement | null;
      setPop(pop === p ? null : p);
    },
    [pop],
  );

  const close = useCallback(() => {
    setPop(null);
    opener.current?.focus?.();
  }, []);

  const openEgg = useCallback(() => {
    opener.current = document.activeElement as HTMLElement | null;
    setPop(null);
    setEgg(true);
  }, []);

  const closeEgg = useCallback(() => {
    setEgg(false);
    opener.current?.focus?.();
  }, []);

  useEffect(() => on("egg:open", openEgg), [openEgg]);

  // Draw the ASCII portrait whenever the egg opens or the lights flip under it.
  useEffect(() => {
    if (!egg) return;
    eggBtn.current?.focus();
    let cancel = () => {};
    let alive = true;
    loadPortrait()
      .then((img) => {
        if (!alive || !eggPre.current) return;
        const cols = window.innerWidth < 760 ? 64 : 96;
        const art = asciiPortrait(img, cols, theme);
        // Fill most of the screen: big enough that the characters read as a face.
        const rows = art.split("\n").length;
        const line = Math.min((window.innerHeight * 0.8) / rows, (window.innerWidth * 0.94) / (cols * 0.6));
        eggPre.current.style.fontSize = `${line}px`;
        eggPre.current.style.lineHeight = `${line}px`;
        if (reducedMotion()) eggPre.current.textContent = art;
        else cancel = scramble(eggPre.current, art);
      })
      .catch((err) => {
        console.error(err);
        if (alive && eggPre.current) eggPre.current.textContent = "(the photo didn't load)";
      });
    return () => {
      alive = false;
      cancel();
    };
  }, [egg, theme]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || isTyping(e.target)) return;
      if (egg) {
        e.preventDefault();
        closeEgg();
        return;
      }
      const k = e.key;
      if (k === "?") toggle("keys");
      else if (k === "t") setTheme(currentTheme() === "dark" ? "light" : "dark");
      else if (k === "p") openEgg();
      else if (k === "d" && game) toggle("game");
      else if (k === "Escape" && pop) close();
      else if (main && (k === "+" || k === "=")) emit("mind:more");
      else if (main && (k === "ArrowRight" || k === "ArrowLeft") && (e.target as HTMLElement)?.tagName !== "INPUT")
        emit("drag:step", k === "ArrowRight" ? 1 : -1);
      else return;
      e.preventDefault();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [egg, pop, game, main, toggle, close, openEgg, closeEgg]);

  const keys: [string, string][] = [
    ...(main
      ? ([
          ["← →", "move the square"],
          ["+", "one more thing on my mind"],
        ] as [string, string][])
      : []),
    ["p", "say hi"],
    ...(game ? ([["d", "spot the drift"]] as [string, string][]) : []),
    ["t", "flip the lights"],
    ["esc", "close this"],
  ];

  return (
    <>
      <footer className="foot">
        <button type="button" onClick={() => toggle("keys")} aria-expanded={pop === "keys"} aria-controls="keys-pop">
          press<kbd>?</kbd>for keys
        </button>
        {resume && (
          <a href="/resume.pdf" target="_blank" rel="noopener noreferrer">
            resume.pdf
          </a>
        )}
        <span className="lights" role="group" aria-label="Lights">
          <button type="button" aria-pressed={theme === "light"} onClick={() => setTheme("light")}>
            light
          </button>
          <button type="button" aria-pressed={theme === "dark"} onClick={() => setTheme("dark")}>
            dark
          </button>
        </span>
        {game && (
          <button type="button" onClick={() => toggle("game")} aria-expanded={pop === "game"} aria-controls="game-pop">
            <span className="ne" aria-hidden="true">
              ≠
            </span>
            spot the drift
          </button>
        )}
      </footer>

      {pop === "keys" && (
        <Popover id="keys-pop" title="keys" onClose={close}>
          <dl className="keys">
            {keys.map(([k, what]) => (
              <div key={k}>
                <dt>
                  <kbd>{k}</kbd>
                </dt>
                <dd>{what}</dd>
              </div>
            ))}
          </dl>
        </Popover>
      )}

      {pop === "game" && game && (
        <Popover id="game-pop" title="spot the drift" onClose={close} className="game">
          <DriftGame />
        </Popover>
      )}

      {egg && (
        <button ref={eggBtn} type="button" className="egg" onClick={closeEgg} aria-label="Close the big portrait">
          <pre ref={eggPre} aria-hidden="true" />
          <p>hi, I&apos;m reet. press any key.</p>
        </button>
      )}
    </>
  );
}

function Popover({
  id,
  title,
  onClose,
  className = "",
  children,
}: {
  id: string;
  title: string;
  onClose: () => void;
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const first =
      ref.current?.querySelector<HTMLElement>("button:not([data-close]), a") ??
      ref.current?.querySelector<HTMLElement>("[data-close]");
    first?.focus();
  }, []);
  return (
    <div ref={ref} id={id} role="dialog" aria-labelledby={`${id}-t`} className={`pop ${className}`}>
      <header>
        <span id={`${id}-t`}>{title}</span>
        <button type="button" data-close onClick={onClose} aria-label="Close">
          ×
        </button>
      </header>
      {children}
    </div>
  );
}
