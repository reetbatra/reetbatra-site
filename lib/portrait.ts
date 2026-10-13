// Pure image math for the portrait: luminance, sharpening, the engraving, and ASCII.
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


/** One engraved stroke: points along the line, each with the stroke's half-width there. */
export type Stroke = [x: number, y: number, half: number][];

export interface EngraveOptions {
  /** Distance between engraved lines, in pixels of `luma`. */
  spacing?: number;
  /** Line angle in degrees. Negative tilts up to the right, like a copperplate. */
  angle?: number;
  /** How far each line wanders, in pixels. 0 is ruler straight. */
  wobble?: number;
  /** Shifts the wobble along the lines, so the plate can ripple. */
  phase?: number;
}

/**
 * Copperplate engraving: parallel lines that swell where the picture is dark (on a light page)
 * or bright (on a dark page), the way an etched frontispiece is printed. Lines break where the
 * picture has no ink or the background was removed, so the outline is drawn by the lines
 * ending, not by a border.
 */
export function engrave({ w, h, lum, alpha }: Luma, ink: Ink, opts: EngraveOptions = {}): Stroke[] {
  const { spacing = 3, angle = -14, wobble = 0.6, phase = 0 } = opts;
  if (spacing <= 0) throw new Error(`engrave: spacing must be positive, got ${spacing}`);
  const rad = (angle * Math.PI) / 180;
  const [dx, dy] = [Math.cos(rad), Math.sin(rad)];
  const [nx, ny] = [-dy, dx];
  const [cx, cy] = [w / 2, h / 2];
  const reach = Math.hypot(w, h) / 2;
  const maxHalf = spacing * 0.48;
  const strokes: Stroke[] = [];

  for (let o = -reach; o <= reach; o += spacing) {
    let run: Stroke = [];
    for (let s = -reach; s <= reach; s += 1) {
      const off = o + wobble * Math.sin(s * 0.09 + o * 0.35 + phase);
      const x = cx + nx * off + dx * s;
      const y = cy + ny * off + dy * s;
      const xi = Math.floor(x);
      const yi = Math.floor(y);
      let half = 0;
      if (xi >= 0 && yi >= 0 && xi < w && yi < h) {
        const k = yi * w + xi;
        if (alpha[k] >= OPAQUE) {
          const density = ink === "light" ? 1 - lum[k] : lum[k];
          // Gamma so skin and mid tones stay open and only real shadows (hair, glasses) go solid.
          half = maxHalf * Math.pow(density, 1.7);
        }
      }
      if (half >= 0.18) run.push([x, y, half]);
      else if (run.length) {
        if (run.length > 1) strokes.push(run);
        run = [];
      }
    }
    if (run.length > 1) strokes.push(run);
  }
  return strokes;
}
