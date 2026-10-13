import { test } from "node:test";
import assert from "node:assert/strict";
import { cells, GLYPH_COLORS, GLYPH_SIZE, GLYPHS, glyphPath, type GlyphName } from "./glyphs.ts";

const names = Object.keys(GLYPHS) as GlyphName[];

test("every glyph is a clean 12x12 grid of #, + and .", () => {
  for (const n of names) {
    assert.equal(GLYPHS[n].length, GLYPH_SIZE, n);
    for (const row of GLYPHS[n]) assert.match(row, /^[#+.]{12}$/, `${n}: ${row}`);
  }
});

test("every glyph has enough ink to read and enough paper to be a shape", () => {
  for (const n of names) {
    const ink = cells(n).length + cells(n, "+").length;
    assert.ok(ink >= 18 && ink <= 110, `${n} has ${ink} ink cells`);
  }
});

test("glyphPath covers exactly the cells of each ink", () => {
  for (const n of names) {
    for (const ink of ["#", "+"] as const) {
      const area = [...glyphPath(n, ink).matchAll(/h(\d+)/g)].reduce((a, m) => a + Number(m[1]), 0);
      assert.equal(area, cells(n, ink).length, `${n} ${ink}`);
    }
  }
});

const luminance = (hex: string) => {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (a: string, b: string) => {
  const [x, y] = [luminance(a), luminance(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};

test("every cover colour holds 3:1 on both the light and the dark page", () => {
  for (const n of names) {
    const c = GLYPH_COLORS[n];
    assert.ok(c, `${n} has no colour`);
    for (const hex of [c.fill, c.accent].filter(Boolean) as string[]) {
      for (const page of ["#ffffff", "#0a0a0a"]) {
        const r = contrast(hex, page);
        assert.ok(r >= 3, `${n} ${hex} on ${page} is only ${r.toFixed(2)}:1`);
      }
    }
  }
});

test("a glyph with accent pixels has an accent colour, and only then", () => {
  for (const n of names) assert.equal(cells(n, "+").length > 0, !!GLYPH_COLORS[n].accent, n);
});

test("no two glyphs are the same drawing", () => {
  const seen = new Set(names.map((n) => GLYPHS[n].join("")));
  assert.equal(seen.size, names.length);
});
