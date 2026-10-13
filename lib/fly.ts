// "tota flies": the game in the corner. Tota is a parrot, so she flies rather than runs: tap
// (or Enter, or Space) to flap, and slip through the gaps in walls of bugs. Pure state and
// physics here so it can be tested; components/FlyGame.tsx draws it.

export const W = 340;
export const H = 220;
export const GROUND = H - 14;

export const BIRD_X = 70;
export const BIRD = 20; // drawn size of the parrot, px
const HIT_INSET = 4; // forgiving hitbox: feathers can brush a bug

export const GRAVITY = 980; // px/s²
export const FLAP = -300; // px/s, upward
export const WALL_W = 24; // two bug tiles wide
export const GAP = 88;
const SPACING = 175;
const BASE_SPEED = 120;
const MAX_SPEED = 200;

export interface Wall {
  x: number;
  /** Top of the gap. */
  gapY: number;
  passed: boolean;
}

export type Phase = "ready" | "flying" | "over";

export interface Game {
  phase: Phase;
  y: number;
  vy: number;
  walls: Wall[];
  score: number;
  /** Seconds since the flight started; drives the wing beat. */
  t: number;
  seed: number;
}

/** Small seeded generator (mulberry32), so a test can replay a flight exactly. */
export function rand(seed: number): [number, number] {
  let t = (seed + 0x6d2b79f5) | 0;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return [((t ^ (t >>> 14)) >>> 0) / 4294967296, (seed + 0x6d2b79f5) | 0];
}

export function newGame(seed = 1): Game {
  return { phase: "ready", y: H / 2 - BIRD / 2, vy: 0, walls: [], score: 0, t: 0, seed };
}

export const speed = (score: number) => Math.min(MAX_SPEED, BASE_SPEED + score * 4);

/** Tap: start, flap, or (after a crash) start over. */
export function flap(g: Game): Game {
  if (g.phase === "over") return { ...newGame(g.seed), phase: "flying", vy: FLAP };
  return { ...g, phase: "flying", vy: FLAP };
}

function spawn(g: Game, x: number): [Wall, number] {
  const [r, seed] = rand(g.seed);
  const min = 22;
  const max = GROUND - GAP - 22;
  return [{ x, gapY: Math.round(min + r * (max - min)), passed: false }, seed];
}

export function hits(y: number, w: Wall): boolean {
  const left = BIRD_X + HIT_INSET;
  const right = BIRD_X + BIRD - HIT_INSET;
  if (right <= w.x || left >= w.x + WALL_W) return false;
  return y + HIT_INSET < w.gapY || y + BIRD - HIT_INSET > w.gapY + GAP;
}

/** Advance the game by `dt` seconds. Ready and over don't move (ready bobs in the drawing). */
export function step(g: Game, dt: number): Game {
  if (g.phase !== "flying") return g;
  dt = Math.min(dt, 1 / 20); // a backgrounded tab shouldn't teleport her into a wall
  let { y, vy, score, seed } = g;
  vy += GRAVITY * dt;
  y += vy * dt;
  const v = speed(score);
  let walls = g.walls.map((w) => ({ ...w, x: w.x - v * dt })).filter((w) => w.x + WALL_W > -2);

  const last = walls.at(-1);
  if (!last || last.x < W - SPACING) {
    const [wall, next] = spawn({ ...g, seed }, last ? last.x + SPACING : W + 40);
    walls = [...walls, wall];
    seed = next;
  }

  walls = walls.map((w) => {
    if (!w.passed && w.x + WALL_W < BIRD_X) {
      score++;
      return { ...w, passed: true };
    }
    return w;
  });

  const crashed = y + BIRD >= GROUND || y < -BIRD || walls.some((w) => hits(y, w));
  if (y + BIRD >= GROUND) y = GROUND - BIRD;
  return { ...g, phase: crashed ? "over" : "flying", y, vy, walls, score, seed, t: g.t + dt };
}
