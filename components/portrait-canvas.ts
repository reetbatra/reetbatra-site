"use client";

import { ascii, asciiRows, engrave, sharpen, toLuma, type Ink, type Luma } from "@/lib/portrait";

const SRC = "/portrait.png";
let loading: Promise<HTMLImageElement> | null = null;

export function loadPortrait(): Promise<HTMLImageElement> {
  if (!loading) {
    loading = new Promise((resolve, reject) => {
      const img = new Image();
      img.decoding = "async";
      img.onload = () => resolve(img);
      img.onerror = () => {
        loading = null; // let the next hover try again
        reject(new Error(`portrait: failed to load ${SRC}`));
      };
      img.src = SRC;
    });
  }
  return loading;
}

type Rect = { x: number; y: number; w: number; h: number };

/** The head in portrait.png (320x360): hair to chin. The big ASCII uses only this. */
const HEAD: Rect = { x: 36, y: 22, w: 260, h: 220 };

function sample(img: HTMLImageElement, w: number, h: number, src?: Rect): Luma {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("portrait: 2d canvas unavailable");
  if (src) ctx.drawImage(img, src.x, src.y, src.w, src.h, 0, 0, w, h);
  else ctx.drawImage(img, 0, 0, w, h);
  return toLuma(ctx.getImageData(0, 0, w, h).data, w, h);
}

const cssVar = (name: string) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

/** Luminance of the portrait at `w`x`h`, cached per size: hovering redraws every frame. */
const lumaCache = new Map<string, Luma>();
export function portraitLuma(img: HTMLImageElement, w: number, h: number): Luma {
  const key = `${w}x${h}`;
  let l = lumaCache.get(key);
  if (!l) {
    l = sample(img, w, h);
    lumaCache.set(key, l);
  }
  return l;
}

/**
 * Draws the portrait as a copperplate engraving. `progress` (0..1) prints it top to bottom,
 * the way a plate comes off the press; `phase` ripples the lines.
 */
export function drawEngraving(
  canvas: HTMLCanvasElement,
  luma: Luma,
  ink: Ink,
  { progress = 1, phase = 0 }: { progress?: number; phase?: number } = {},
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("portrait: 2d canvas unavailable");
  const sx = canvas.width / luma.w;
  const sy = canvas.height / luma.h;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.setTransform(sx, 0, 0, sy, 0, 0);
  ctx.fillStyle = cssVar("--ink");
  const cut = luma.h * progress;
  for (const stroke of engrave(luma, ink, { phase })) {
    // Each stroke is a ribbon: walk out along the top edge, back along the bottom.
    const pts = progress < 1 ? stroke.filter((p) => p[1] <= cut) : stroke;
    if (pts.length < 2) continue;
    ctx.beginPath();
    for (let i = 0; i < pts.length; i++) {
      const [x, y, half] = pts[i];
      if (i === 0) ctx.moveTo(x, y - half);
      else ctx.lineTo(x, y - half);
    }
    for (let i = pts.length - 1; i >= 0; i--) {
      const [x, y, half] = pts[i];
      ctx.lineTo(x, y + half);
    }
    ctx.closePath();
    ctx.fill();
  }
}

/** Full-screen ASCII of the head, for press p. */
export function asciiPortrait(img: HTMLImageElement, cols: number, ink: Ink): string {
  return ascii(sharpen(sample(img, cols, asciiRows(cols, HEAD.w, HEAD.h), HEAD)), ink);
}

const GLYPHS = "!<>-_\\/[]{}=+*^?#01";

/** Characters resolve from noise into `target` over `ms`. Returns a cancel function. */
export function scramble(el: HTMLElement, target: string, ms = 650): () => void {
  let raf = 0;
  const start = performance.now();
  const frame = (t: number) => {
    const p = Math.min(1, (t - start) / ms);
    let out = "";
    for (let i = 0; i < target.length; i++) {
      const ch = target[i];
      if (ch === "\n" || ch === " ") {
        out += ch;
        continue;
      }
      const r = ((i * 9301 + 49297) % 233280) / 233280; // fixed per cell so it settles left to right-ish
      out += r < p ? ch : GLYPHS[(Math.random() * GLYPHS.length) | 0];
    }
    el.textContent = out;
    if (p < 1) raf = requestAnimationFrame(frame);
  };
  raf = requestAnimationFrame(frame);
  return () => cancelAnimationFrame(raf);
}
