import { test } from "node:test";
import assert from "node:assert/strict";
import { ascii, asciiRows, dither, RAMP, sharpen, toLuma, type Luma } from "./portrait.ts";

function flat(w: number, h: number, value: number, opaque = true): Luma {
  return {
    w,
    h,
    lum: new Float32Array(w * h).fill(value),
    alpha: new Float32Array(w * h).fill(opaque ? 1 : 0),
  };
}

const share = (bits: Uint8Array) => bits.reduce((a, b) => a + b, 0) / bits.length;

test("toLuma rejects a buffer that doesn't match the size", () => {
  assert.throws(() => toLuma(new Uint8Array(10), 2, 2), /expected 16 bytes/);
});

test("toLuma stretches the subject's contrast and ignores the removed background", () => {
  // Two subject pixels at grey 100 and 150, one transparent pixel at pure white.
  const rgba = [100, 100, 100, 255, 150, 150, 150, 255, 255, 255, 255, 0];
  const { lum, alpha } = toLuma(rgba, 3, 1);
  assert.equal(lum[0], 0);
  assert.equal(lum[1], 1);
  assert.equal(alpha[2], 0);
});

test("dither on a light page inks the dark share of a flat grey", () => {
  const bits = dither(flat(64, 64, 0.25), "light");
  assert.ok(Math.abs(share(bits) - 0.75) < 0.03, `ink share ${share(bits)}`);
});

test("dither on a dark page inks the bright share, so the photo is not a negative", () => {
  const bits = dither(flat(64, 64, 0.25), "dark");
  assert.ok(Math.abs(share(bits) - 0.25) < 0.03, `ink share ${share(bits)}`);
});

test("the removed background never gets ink in either theme", () => {
  for (const ink of ["light", "dark"] as const) {
    assert.equal(share(dither(flat(16, 16, 0.5, false), ink)), 0);
  }
});

test("pure black and pure white dither to solid and empty", () => {
  assert.equal(share(dither(flat(8, 8, 0), "light")), 1);
  assert.equal(share(dither(flat(8, 8, 1), "light")), 0);
  assert.equal(share(dither(flat(8, 8, 1), "dark")), 1);
});

test("dither does not mutate its input", () => {
  const l = flat(8, 8, 0.4);
  dither(l, "light");
  assert.ok(l.lum.every((v) => Math.abs(v - 0.4) < 1e-6));
});

test("ascii has one line per row, spaces for background, dense glyphs for ink", () => {
  const l: Luma = {
    w: 3,
    h: 2,
    lum: Float32Array.from([0, 1, 0.5, 0, 0, 0]),
    alpha: Float32Array.from([1, 1, 1, 0, 1, 0]),
  };
  const lines = ascii(l, "light").split("\n");
  assert.equal(lines.length, 2);
  assert.equal(lines[0][0], RAMP[RAMP.length - 1]); // black on a light page: densest
  assert.equal(lines[0][1], RAMP[1]); // white subject still shows a faint dot, not a hole
  assert.equal(lines[1], " " + RAMP[RAMP.length - 1]); // trailing background trimmed
});

test("ascii flips density on a dark page", () => {
  const l = flat(1, 1, 1);
  assert.equal(ascii(l, "dark"), RAMP[RAMP.length - 1]);
  assert.equal(ascii(l, "light"), RAMP[1]);
});

test("asciiRows corrects for tall monospace cells", () => {
  assert.equal(asciiRows(100, 320, 360), 62);
  assert.equal(asciiRows(1, 1000, 1), 1);
});

test("sharpen leaves a flat area flat", () => {
  const out = sharpen(flat(6, 6, 0.4)).lum;
  assert.ok(out.every((v) => Math.abs(v - 0.4) < 1e-6));
});

test("sharpen pushes a thin dark line darker and its bright neighbours brighter", () => {
  // A 1px dark stripe (think: the frame of a pair of glasses) in mid-grey skin.
  const w = 7;
  const lum = new Float32Array(w * w).fill(0.6);
  for (let x = 0; x < w; x++) lum[3 * w + x] = 0.45;
  const out = sharpen({ w, h: w, lum, alpha: new Float32Array(w * w).fill(1) }).lum;
  assert.ok(out[3 * w + 3] < 0.45, `line ${out[3 * w + 3]}`);
  assert.ok(out[2 * w + 3] > 0.6, `neighbour ${out[2 * w + 3]}`);
});

test("sharpen ignores removed background, so the outline gets no halo", () => {
  const w = 5;
  const lum = new Float32Array(w * w).fill(0.5);
  const alpha = new Float32Array(w * w).fill(1);
  for (let y = 0; y < w; y++) {
    lum[y * w] = 1; // background column, white
    alpha[y * w] = 0;
  }
  const out = sharpen({ w, h: w, lum, alpha }).lum;
  assert.ok(Math.abs(out[2 * w + 1] - 0.5) < 1e-6, `edge pixel ${out[2 * w + 1]}`);
});

test("sharpen clamps to 0..1 and doesn't mutate its input", () => {
  const l: Luma = { w: 3, h: 1, lum: Float32Array.from([0, 1, 0]), alpha: Float32Array.from([1, 1, 1]) };
  const out = sharpen(l, 10).lum;
  assert.ok(out.every((v) => v >= 0 && v <= 1));
  assert.deepEqual(Array.from(l.lum), [0, 1, 0]);
});
