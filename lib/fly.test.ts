import { test } from "node:test";
import assert from "node:assert/strict";
import { BIRD, BIRD_X, flap, GAP, GROUND, hits, newGame, rand, speed, step, WALL_W, type Game } from "./fly.ts";

const run = (g: Game, seconds: number, onFrame?: (g: Game) => Game) => {
  for (let t = 0; t < seconds; t += 1 / 60) g = step(onFrame ? onFrame(g) : g, 1 / 60);
  return g;
};

test("nothing moves until the first flap", () => {
  const g = newGame();
  assert.deepEqual(step(g, 1), g);
  assert.equal(flap(g).phase, "flying");
  assert.ok(flap(g).vy < 0, "a flap goes up");
});

test("without flapping, tota falls and lands on the ground: game over", () => {
  const g = run(flap(newGame()), 3);
  assert.equal(g.phase, "over");
  assert.equal(g.y, GROUND - BIRD);
});

test("walls arrive, and the gap is always inside the sky", () => {
  let g = flap(newGame(7));
  g = run(g, 0.5, (x) => (x.vy > 120 ? flap(x) : x));
  assert.ok(g.walls.length > 0);
  for (let s = 1; s < 200; s++) {
    const [r] = rand(s);
    assert.ok(r >= 0 && r < 1);
  }
  for (const w of g.walls) assert.ok(w.gapY >= 0 && w.gapY + GAP <= GROUND, `${w.gapY}`);
});

test("hitting a wall ends it; flying through the gap doesn't", () => {
  const wall = { x: BIRD_X, gapY: 80, passed: false };
  assert.equal(hits(80 + GAP / 2 - BIRD / 2, wall), false, "middle of the gap");
  assert.equal(hits(10, wall), true, "above the gap");
  assert.equal(hits(80 + GAP, wall), true, "below the gap");
  assert.equal(hits(10, { ...wall, x: BIRD_X + BIRD + 5 }), false, "wall still ahead");
});

test("a pilot that aims for each gap scores, and the game speeds up but tops out", () => {
  // Flap whenever she sinks below the lower part of the next gap: a flap lifts her about 46px,
  // so aiming low keeps the whole bounce inside the gap.
  const pilot = (g: Game) => {
    const next = g.walls.find((w) => w.x + WALL_W > BIRD_X);
    const target = next ? next.gapY + GAP * 0.7 : GROUND / 2;
    return g.y + BIRD / 2 > target && g.vy > 0 ? flap(g) : g;
  };
  const g = run(flap(newGame(3)), 20, pilot);
  assert.ok(g.score >= 5, `scored ${g.score}`);
  assert.ok(speed(100) <= 200 && speed(0) < speed(10));
});

test("after a crash, a flap starts a fresh flight", () => {
  const over = run(flap(newGame()), 3);
  const again = flap(over);
  assert.equal(again.phase, "flying");
  assert.equal(again.score, 0);
  assert.deepEqual(again.walls, []);
});

test("a huge frame gap (a background tab) is clamped", () => {
  const g = flap(newGame());
  const a = step(g, 5);
  assert.ok(a.phase === "flying", "one long frame shouldn't kill her");
});
