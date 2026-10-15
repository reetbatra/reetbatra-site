// Hand-drawn 12x12 pixel objects, one per thing I made or fixed. They sit between "reet" and
// "batra" on the cover and label the cards in the workshop. "#" is ink, "+" is the accent (a
// parrot's beak, a bell's clapper), anything else is paper. On the cover each object gets its
// own colour from GLYPH_COLORS; everywhere else both inks are the page ink.
// Pure data so the tests can check every glyph is a clean 12x12 grid.

export const GLYPH_SIZE = 12;

export const GLYPHS = {
  // AskTota: tota means parrot.
  parrot: [
    "...####.....",
    "..######....",
    ".###.####...",
    ".#########..",
    ".######.+++.",
    ".######..++.",
    ".#######.+..",
    ".#######....",
    "..######....",
    "...#####....",
    "....##.#....",
    "...##..##...",
  ],
  // docsParity: the docs say one thing, the code another.
  neq: [
    "............",
    ".........##.",
    "........##..",
    ".##########.",
    ".##########.",
    "......##....",
    ".....##.....",
    ".##########.",
    ".##########.",
    "...##.......",
    "..##........",
    "............",
  ],
  // The drift, fixed: docs and code agree again.
  eq: [
    "............",
    "............",
    "............",
    ".##########.",
    ".##########.",
    "............",
    "............",
    ".##########.",
    ".##########.",
    "............",
    "............",
    "............",
  ],
  // Blunt: a speech coach.
  mic: [
    "....####....",
    "...######...",
    "...##..##...",
    "...######...",
    "...##..##...",
    ".#.######.#.",
    ".#..####..#.",
    "..#......#..",
    "...######...",
    ".....##.....",
    ".....##.....",
    "...######...",
  ],
  // Muscle Mommy: lifting.
  dumbbell: [
    "............",
    "............",
    ".##......##.",
    "###......###",
    "###......###",
    "############",
    "############",
    "###......###",
    "###......###",
    ".##......##.",
    "............",
    "............",
  ],
  // Nudge: one push a morning.
  bell: [
    ".....##.....",
    "....####....",
    "...######...",
    "..########..",
    "..###..###..",
    "..########..",
    "..########..",
    ".##########.",
    "############",
    "............",
    ".....++.....",
    "....++++....",
  ],
  // hook-catch: webhooks.
  hook: [
    ".....####...",
    "....##..##..",
    "....##..##..",
    ".....####...",
    "......##....",
    "......##....",
    "......##....",
    ".#....##....",
    ".##...##....",
    ".##..##.....",
    "..#####.....",
    "...###......",
  ],
  // bestie, don't.: after a breakup.
  heart: [
    "............",
    ".###....###.",
    "#####..#####",
    "#####.######",
    "####.#######",
    "#####.######",
    ".#####.####.",
    "..####.###..",
    "...###.##...",
    "....##.#....",
    ".....#......",
    "............",
  ],
  // lcdoctor: checks an upgrade.
  cross: [
    "............",
    "....####....",
    "....####....",
    "....####....",
    ".##########.",
    ".##########.",
    ".##########.",
    ".##########.",
    "....####....",
    "....####....",
    "....####....",
    "............",
  ],
  // kya bola: "what did they say?"
  bubble: [
    "............",
    ".##########.",
    "##........##",
    "##..####..##",
    "##.##..##.##",
    "##....##..##",
    "##...##...##",
    "##........##",
    ".####.#####.",
    "....###.....",
    "....##......",
    "....#.......",
  ],
  // A bug in someone's quickstart.
  bug: [
    "..#......#..",
    "...#....#...",
    "....####....",
    "#..######..#",
    ".#.##..##.#.",
    "...######...",
    "####.##.####",
    "...######...",
    ".#.##..##.#.",
    "#..######..#",
    "....####....",
    "............",
  ],
  // Merged upstream: the check.
  check: [
    "............",
    "..........##",
    ".........###",
    "........###.",
    ".......###..",
    "##....###...",
    "###..###....",
    ".######.....",
    "..####......",
    "...##.......",
    "............",
    "............",
  ],
  // Docs.
  book: [
    "............",
    ".####..####.",
    "#....##....#",
    "#.##.##.##.#",
    "#....##....#",
    "#.##.##.##.#",
    "#....##....#",
    "#.##.##.##.#",
    "#....##....#",
    ".####..####.",
    ".....##.....",
    "............",
  ],
  // A video.
  play: [
    "............",
    ".##########.",
    "#..........#",
    "#...#......#",
    "#...##.....#",
    "#...###....#",
    "#...####...#",
    "#...###....#",
    "#...##.....#",
    "#...#......#",
    ".##########.",
    "............",
  ],
  // A terminal.
  prompt: [
    "############",
    "#..........#",
    "#.#........#",
    "#..#.......#",
    "#...#......#",
    "#..#.......#",
    "#.#..####..#",
    "#..........#",
    "############",
    "............",
    "....####....",
    "..########..",
  ],
  // Shipped, in a box.
  box: [
    "............",
    "..########..",
    ".#...##...#.",
    "############",
    "#....##....#",
    "#....##....#",
    "#..........#",
    "#..........#",
    "#..........#",
    "#..........#",
    "############",
    "............",
  ],
} as const satisfies Record<string, readonly string[]>;

export type GlyphName = keyof typeof GLYPHS;

/** "#" is the main ink, "+" the accent. */
export type Ink = "#" | "+";

/** Cells of one ink as [x, y] pairs. */
export function cells(name: GlyphName, ink: Ink = "#"): [number, number][] {
  const out: [number, number][] = [];
  GLYPHS[name].forEach((row, y) => {
    for (let x = 0; x < row.length; x++) if (row[x] === ink) out.push([x, y]);
  });
  return out;
}

/**
 * One SVG path for a glyph, merging each horizontal run of ink into a single rect.
 * Fewer nodes than a rect per pixel, and no hairline seams between neighbours.
 */
export function glyphPath(name: GlyphName, ink: Ink = "#"): string {
  let d = "";
  GLYPHS[name].forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      if (row[x] !== ink) {
        x++;
        continue;
      }
      const start = x;
      while (x < row.length && row[x] === ink) x++;
      d += `M${start} ${y}h${x - start}v1h${start - x}z`;
    }
  });
  return d;
}

/**
 * Cover colours, one per object, so a row of them reads like a box of sweets. Each one has to
 * hold 3:1 contrast against both the white page and the near-black one (tested), which keeps
 * them in a band of mid tones: no pastel that vanishes on white, no navy that vanishes on black.
 */
export const GLYPH_COLORS: Record<GlyphName, { fill: string; accent?: string }> = {
  parrot: { fill: "#1f9d55", accent: "#e8590c" },
  heart: { fill: "#e5484d" },
  neq: { fill: "#2f6fed" },
  eq: { fill: "#1f9d55" },
  mic: { fill: "#8b5cf6" },
  dumbbell: { fill: "#e8590c" },
  bell: { fill: "#b07c00", accent: "#e5484d" },
  hook: { fill: "#0e9488" },
  cross: { fill: "#e5484d" },
  bubble: { fill: "#d6409f" },
  bug: { fill: "#e8590c" },
  check: { fill: "#1f9d55" },
  book: { fill: "#8b5cf6" },
  prompt: { fill: "#0e9488" },
  play: { fill: "#d6409f" },
  box: { fill: "#b07c00" },
};
