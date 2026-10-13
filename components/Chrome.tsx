"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { emit, on, reducedMotion } from "./bus";
import FlyGame from "./FlyGame";
import Clock from "./Clock";
import Glyph from "./Glyph";
import { asciiPortrait, loadPortrait, scramble } from "./portrait-canvas";
import { currentTheme, setTheme, useTheme } from "./theme";

const isTyping = (t: EventTarget | null) =>
  t instanceof HTMLElement && (t.isContentEditable || t.tagName === "TEXTAREA" || t.tagName === "INPUT");

/**
 * The footer (year, the time in Bengaluru, the lights, a parrot that opens the game), the
 * three keys (t lights, p hello, d the drift game), the press-p ASCII portrait, and the
 * "play this" game in the corner.
 */
export default function Chrome({ name, city, game, resume }: { name: string; city: string; game: boolean; resume: boolean }) {
  const [egg, setEgg] = useState(false);
  const theme = useTheme();
  const opener = useRef<HTMLElement | null>(null);
  const eggPre = useRef<HTMLPreElement>(null);
  const eggBtn = useRef<HTMLButtonElement>(null);

  const openEgg = useCallback(() => {
    opener.current = document.activeElement as HTMLElement | null;
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
      if (e.key === "t") setTheme(currentTheme() === "dark" ? "light" : "dark");
      else if (e.key === "p") openEgg();
      else if (e.key === "d" && game) {
        const el = document.getElementById("drift");
        if (!el) return;
        el.scrollIntoView({ behavior: reducedMotion() ? "auto" : "smooth", block: "center" });
        el.querySelector<HTMLButtonElement>(".code button")?.focus({ preventScroll: true });
      } else return;
      e.preventDefault();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [egg, game, openEgg, closeEgg]);

  return (
    <>
      <footer className="foot">
        <button type="button" className="pal" onClick={() => emit("game:open")} aria-label="Play tota flies">
          <Glyph name="parrot" />
        </button>
        <div className="foot-row">
          <p className="mute">
            © {new Date().getFullYear()} {name}
            <br />
            <Clock suffix={` in ${city}`} />
          </p>
          <div className="foot-right">
            <p className="keys mute" aria-hidden="true">
              <kbd>t</kbd> lights <kbd>p</kbd> hello{game && (
                <>
                  {" "}
                  <kbd>d</kbd> drift
                </>
              )}
            </p>
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
          </div>
        </div>
      </footer>

      <FlyGame />

      {egg && (
        <button ref={eggBtn} type="button" className="egg" onClick={closeEgg} aria-label="Close the big portrait">
          <pre ref={eggPre} aria-hidden="true" />
          <p>hi, I&apos;m reet. press any key.</p>
        </button>
      )}
    </>
  );
}
