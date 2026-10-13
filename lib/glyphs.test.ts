import { test } from "node:test";
import assert from "node:assert/strict";
import { cells, GLYPH_SIZE, GLYPHS, glyphPath, type GlyphName } from "./glyphs.ts";

const names = Object.keys(GLYPHS) as GlyphName[];

test("every glyph is a clean 12x12 grid of # and .", () => {
  for (const n of names) {
    assert.equal(GLYPHS[n].length, GLYPH_SIZE, n);
    for (const row of GLYPHS[n]) assert.match(row, /^[#.]{12}$/, `${n}: ${row}`);
  }
});

test("every glyph has enough ink to read and enough paper to be a shape", () => {
  for (const n of names) {
    const ink = cells(n).length;
    assert.ok(ink >= 18 && ink <= 110, `${n} has ${ink} ink cells`);
  }
});

test("glyphPath covers exactly the ink cells", () => {
  for (const n of names) {
    const area = [...glyphPath(n).matchAll(/h(\d+)/g)].reduce((a, m) => a + Number(m[1]), 0);
    assert.equal(area, cells(n).length, n);
  }
});

test("no two glyphs are the same drawing", () => {
  const seen = new Set(names.map((n) => GLYPHS[n].join("")));
  assert.equal(seen.size, names.length);
});
