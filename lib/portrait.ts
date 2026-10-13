// Pure image math for the portrait: luminance, a 1-bit Floyd-Steinberg dither, and ASCII.
// No DOM here so it can be tested in node. The canvas glue lives in components/portrait-canvas.ts.

export type Ink = "light" | "dark";

export interface Luma {
  w: number;
  h: number;
  /** 0 = black, 1 = white, contrast-stretched over the opaque pixels only. */
  lum: Float32Array;
  /** 0 = transparent (background removed), 1 = subject. */
  alpha: Float32Array;
}

const OPAQUE = 0.5;

/** RGBA bytes (canvas ImageData layout) to stretched luminance + alpha. */
export function toLuma(rgba: ArrayLike<number>, w: number, h: number): Luma {
  if (rgba.length !== w * h * 4) {
    throw new Error(`toLuma: expected ${w * h * 4} bytes for ${w}x${h}, got ${rgba.length}`);
  }
  const n = w * h;
  const lum = new Float32Array(n);
  const alpha = new Float32Array(n);
  const opaque: number[] = [];
  for (let i = 0; i < n; i++) {
    lum[i] = (0.299 * rgba[i * 4] + 0.587 * rgba[i * 4 + 1] + 0.114 * rgba[i * 4 + 2]) / 255;
    alpha[i] = rgba[i * 4 + 3] / 255;
    if (alpha[i] >= OPAQUE) opaque.push(lum[i]);
  }
  // Stretch the 2nd..98th percentile of the subject to the full range, so a dim photo
  // still dithers into a readable face instead of a grey smear.
  if (opaque.length > 0) {
    opaque.sort((a, b) => a - b);
    const lo = opaque[Math.floor(opaque.length * 0.02)];
    const hi = opaque[Math.min(opaque.length - 1, Math.floor(opaque.length * 0.98))];
    const span = hi - lo || 1;
    for (let i = 0; i < n; i++) lum[i] = Math.min(1, Math.max(0, (lum[i] - lo) / span));
  }
  return { w, h, lum, alpha };
}

/**
 * Unsharp mask over the subject: lum + amount * (lum - local mean). The face is evenly lit, so
 * at ASCII resolution the glasses and eyes melt into the skin. This pulls those edges back out.
 * The local mean ignores removed background, so the outline doesn't get a halo.
 */
export function sharpen({ w, h, lum, alpha }: Luma, amount = 1.5, radius = 2): Luma {
  const out = new Float32Array(lum.length);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const k = y * w + x;
      let sum = 0;
      let n = 0;
      for (let dy = -radius; dy <= radius; dy++) {
        const Y = y + dy;
        if (Y < 0 || Y >= h) continue;
        for (let dx = -radius; dx <= radius; dx++) {
          const X = x + dx;
          if (X < 0 || X >= w || alpha[Y * w + X] < OPAQUE) continue;
          sum += lum[Y * w + X];
          n++;
        }
      }
      const mean = n ? sum / n : lum[k];
      out[k] = Math.min(1, Math.max(0, lum[k] + amount * (lum[k] - mean)));
    }
  }
  return { w, h, lum: out, alpha };
}

/**
 * 1-bit Floyd-Steinberg dither. Returns 1 where the page should draw ink.
 *
 * On a light page ink is black, so ink goes where the photo is dark. On a dark page ink is
 * white, so ink goes where the photo is bright. Either way the face looks like a photo, not
 * a negative. Removed background never gets ink.
 */
export function dither({ w, h, lum, alpha }: Luma, ink: Ink): Uint8Array {
  const v = Float32Array.from(lum);
  const paper = ink === "light" ? 1 : 0; // what the page colour is, in luminance terms
  for (let i = 0; i < v.length; i++) if (alpha[i] < OPAQUE) v[i] = paper;

  const out = new Uint8Array(w * h);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const k = y * w + x;
      const old = v[k];
      const bit = old >= 0.5 ? 1 : 0;
      const err = old - bit;
      v[k] = bit;
      if (x + 1 < w) v[k + 1] += (err * 7) / 16;
      if (y + 1 < h) {
        if (x > 0) v[k + w - 1] += (err * 3) / 16;
        v[k + w] += (err * 5) / 16;
        if (x + 1 < w) v[k + w + 1] += err / 16;
      }
      if (alpha[k] >= OPAQUE) out[k] = ink === "light" ? 1 - bit : bit;
    }
  }
  return out;
}

/** Light to dense. Index 0 is never used for the subject so the outline always shows. */
export const RAMP = " .:-=+*%#@";

/**
 * ASCII portrait, one character per cell of `luma` (sample it at cols x rows first).
 * Dense characters carry ink, so on a light page they go on shadows and on a dark page on
 * highlights, same rule as the dither.
 */
export function ascii({ w, h, lum, alpha }: Luma, ink: Ink): string {
  const last = RAMP.length - 1;
  const lines: string[] = [];
  for (let y = 0; y < h; y++) {
    let line = "";
    for (let x = 0; x < w; x++) {
      const k = y * w + x;
      if (alpha[k] < OPAQUE) {
        line += " ";
        continue;
      }
      const density = ink === "light" ? 1 - lum[k] : lum[k];
      line += RAMP[Math.max(1, Math.min(last, Math.floor(density * RAMP.length)))];
    }
    lines.push(line.replace(/\s+$/, ""));
  }
  return lines.join("\n");
}

/** Rows to sample for an ASCII grid, correcting for monospace cells being taller than wide. */
export function asciiRows(cols: number, imgW: number, imgH: number, cellAspect = 0.55): number {
  return Math.max(1, Math.round(cols * (imgH / imgW) * cellAspect));
}

/** Block sizes the portrait steps through as it "develops": coarse to the final 1px dither. */
export const DEVELOP_STEPS = [18, 12, 8, 6, 4, 3, 2, 1] as const;
