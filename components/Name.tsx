"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { DEVELOP_STEPS } from "@/lib/portrait";
import { emit, reducedMotion } from "./bus";
import { drawDither, loadPortrait } from "./portrait-canvas";
import { useTheme } from "./theme";

/**
 * The name, and the photo behind it. Hover (or tap, or focus) and the portrait develops like a
 * Polaroid: big 1-bit blocks that sharpen into a fine dither in about a second.
 */
export default function Name({ name, caption, describedBy }: { name: string; caption: string; describedBy?: string }) {
  const [open, setOpen] = useState(false);
  const [failed, setFailed] = useState(false);
  const canvas = useRef<HTMLCanvasElement>(null);
  const wrap = useRef<HTMLDivElement>(null);
  const run = useRef(0);
  const lastTheme = useRef<string | null>(null);
  const wasOpen = useRef(false);
  const pointer = useRef("");
  const theme = useTheme();
  const id = useId();

  const develop = useCallback(
    async (instant: boolean) => {
      const mine = ++run.current;
      let img: HTMLImageElement;
      try {
        img = await loadPortrait();
      } catch (err) {
        console.error(err);
        setFailed(true);
        return;
      }
      setFailed(false);
      const steps = instant || reducedMotion() ? [1] : DEVELOP_STEPS;
      for (const scale of steps) {
        if (mine !== run.current || !canvas.current) return;
        drawDither(canvas.current, img, scale, theme);
        if (scale !== 1) await new Promise((r) => setTimeout(r, 120));
      }
    },
    [theme],
  );

  // Develop every time it opens. If the lights flip while it's open, redraw sharp straight away.
  useEffect(() => {
    const flippedWhileOpen = wasOpen.current && lastTheme.current !== theme;
    lastTheme.current = theme;
    wasOpen.current = open;
    if (!open) {
      run.current++;
      return;
    }
    develop(flippedWhileOpen);
  }, [open, theme, develop]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onDown = (e: PointerEvent) => {
      if (wrap.current && !wrap.current.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  return (
    <div
      ref={wrap}
      className="namewrap"
      onPointerEnter={(e) => e.pointerType === "mouse" && setOpen(true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && setOpen(false)}
      onBlur={(e) => !wrap.current?.contains(e.relatedTarget as Node) && setOpen(false)}
    >
      <h1>
        <button
          type="button"
          className="name"
          aria-expanded={open}
          aria-controls={id}
          aria-describedby={describedBy}
          onPointerDown={(e) => (pointer.current = e.pointerType)}
          onClick={() => {
            // A mouse already opened it on hover, so its click goes bigger. Touch and keyboard toggle.
            if (pointer.current === "mouse") emit("egg:open");
            else setOpen((o) => !o);
            pointer.current = "";
          }}
          onFocus={(e) => e.currentTarget.matches(":focus-visible") && setOpen(true)}
        >
          {name}
          <span className="caret" aria-hidden="true" />
        </button>
      </h1>
      <div id={id} className={`portrait${open ? " on" : ""}`} aria-hidden={!open}>
        <canvas
          ref={canvas}
          width={200}
          height={225}
          role="img"
          aria-label="Photo of Reet speaking on stage, drawn in black and white dots"
        />
        <div className="cap">
          <span>{failed ? "the photo didn't load" : caption}</span>
          <button type="button" tabIndex={open ? 0 : -1} onClick={() => emit("egg:open")}>
            bigger <span aria-hidden="true">(p)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
