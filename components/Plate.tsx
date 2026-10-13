"use client";

import { useEffect, useRef, useState } from "react";
import { emit, reducedMotion } from "./bus";
import { drawEngraving, loadPortrait, portraitLuma } from "./portrait-canvas";
import { useTheme } from "./theme";

// Canvas size in CSS pixels, and the resolution the engraving is computed at. The luma grid is
// a little coarser than the canvas so each line has room to swell.
const W = 232;
const H = 261;
const LW = 200;
const LH = 225;

/**
 * Plate i: the portrait as a copperplate engraving. It prints top to bottom the first time it
 * scrolls into view, ripples while you hover it, and a click opens the big ASCII one.
 */
export default function Plate({ caption }: { caption: string }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const printed = useRef(false);
  const hovering = useRef(false);
  const raf = useRef(0);
  const theme = useTheme();
  // The ripple runs across renders, so it reads the lights from here rather than its closure.
  const themeNow = useRef(theme);
  useEffect(() => {
    themeNow.current = theme;
  }, [theme]);

  useEffect(() => {
    let alive = true;
    loadPortrait()
      .then((i) => alive && setImg(i))
      .catch((err) => {
        console.error(err);
        if (alive) setFailed(true);
      });
    return () => {
      alive = false;
    };
  }, []);

  // Size the backing store for sharp lines on high density screens.
  useEffect(() => {
    const c = canvas.current;
    if (!c) return;
    const dpr = Math.min(3, window.devicePixelRatio || 1);
    c.width = Math.round(W * dpr);
    c.height = Math.round(H * dpr);
  }, []);

  // Print once it's on screen; after that, redraw whenever the lights flip.
  useEffect(() => {
    const c = canvas.current;
    if (!c || !img) return;
    const luma = portraitLuma(img, LW, LH);
    if (printed.current || reducedMotion()) {
      printed.current = true;
      drawEngraving(c, luma, theme);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const step = (t: number) => {
          const p = Math.min(1, (t - start) / 1100);
          drawEngraving(c, luma, theme, { progress: p });
          if (p < 1) raf.current = requestAnimationFrame(step);
          else printed.current = true;
        };
        raf.current = requestAnimationFrame(step);
      },
      { threshold: 0.3 },
    );
    io.observe(c);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf.current);
    };
  }, [img, theme]);

  const ripple = () => {
    const c = canvas.current;
    if (!c || !img || !printed.current || reducedMotion()) return;
    hovering.current = true;
    const luma = portraitLuma(img, LW, LH);
    const start = performance.now();
    const step = (t: number) => {
      if (!hovering.current) {
        drawEngraving(c, luma, themeNow.current);
        return;
      }
      drawEngraving(c, luma, themeNow.current, { phase: (t - start) / 260 });
      raf.current = requestAnimationFrame(step);
    };
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(step);
  };

  return (
    <figure className="plate">
      <button
        type="button"
        className="plate-frame"
        onPointerEnter={(e) => e.pointerType === "mouse" && ripple()}
        onPointerLeave={() => (hovering.current = false)}
        onClick={() => emit("egg:open")}
        aria-label="Open the big portrait"
      >
        <canvas
          ref={canvas}
          style={{ width: W, height: H }}
          role="img"
          aria-label="Reet on stage, drawn as an engraving"
        />
        {failed && <span className="plate-fail">the photo didn&apos;t load</span>}
      </button>
      <figcaption>
        <span className="sc">plate i.</span> <em>{caption}</em>
      </figcaption>
    </figure>
  );
}
