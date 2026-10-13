"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { BIRD, BIRD_X, flap, GAP, GROUND, H, newGame, step, W, WALL_W, type Game } from "@/lib/fly";
import { GLYPH_COLORS, glyphPath } from "@/lib/glyphs";
import { on } from "./bus";
import Glyph from "./Glyph";

const BEST_KEY = "tota-best";

function readBest(): number {
  try {
    return Number(localStorage.getItem(BEST_KEY)) || 0;
  } catch {
    return 0; // blocked storage: the best score just lasts for this visit
  }
}

function saveBest(n: number) {
  try {
    localStorage.setItem(BEST_KEY, String(n));
  } catch {
    // same as above
  }
}

const ink = () => getComputedStyle(document.documentElement).getPropertyValue("--ink").trim();
const mute = () => getComputedStyle(document.documentElement).getPropertyValue("--mute").trim();

let paths: { body: Path2D; beak: Path2D; bug: Path2D } | null = null;
const glyphs = () => (paths ??= { body: new Path2D(glyphPath("parrot")), beak: new Path2D(glyphPath("parrot", "+")), bug: new Path2D(glyphPath("bug")) });

function draw(ctx: CanvasRenderingContext2D, g: Game, best: number, now: number) {
  const { body, beak, bug } = glyphs();
  const fg = ink();
  ctx.clearRect(0, 0, W, H);

  // Walls of bugs, 12px tiles, two wide, with the gap cut out.
  ctx.fillStyle = fg;
  for (const w of g.walls) {
    for (let y = 0; y < GROUND; y += 12) {
      if (y + 12 > w.gapY && y < w.gapY + GAP) continue;
      for (let x = 0; x < WALL_W; x += 12) {
        ctx.save();
        ctx.translate(Math.round(w.x + x), y);
        ctx.fill(bug);
        ctx.restore();
      }
    }
  }

  // The ground: a dashed line that scrolls while she flies.
  ctx.strokeStyle = fg;
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 6]);
  ctx.lineDashOffset = g.phase === "flying" ? (g.t * 140) % 10 : 0;
  ctx.beginPath();
  ctx.moveTo(0, GROUND + 0.5);
  ctx.lineTo(W, GROUND + 0.5);
  ctx.stroke();
  ctx.setLineDash([]);

  // Tota, nosing up when she flaps and down as she falls. She bobs while waiting.
  const bob = g.phase === "ready" ? Math.sin(now / 260) * 4 : 0;
  const tilt = g.phase === "ready" ? 0 : Math.max(-0.45, Math.min(0.9, g.vy / 600));
  const s = BIRD / 12;
  ctx.save();
  ctx.translate(BIRD_X + BIRD / 2, g.y + BIRD / 2 + bob);
  ctx.rotate(tilt);
  ctx.scale(s, s);
  ctx.translate(-6, -6);
  ctx.fillStyle = GLYPH_COLORS.parrot.fill;
  ctx.fill(body);
  ctx.fillStyle = GLYPH_COLORS.parrot.accent ?? GLYPH_COLORS.parrot.fill;
  ctx.fill(beak);
  ctx.restore();

  // Score top left, behind nothing: walls come in from the right.
  ctx.font = "500 12px ui-monospace, monospace";
  ctx.textAlign = "left";
  ctx.fillStyle = fg;
  ctx.fillText(String(g.score), 10, 20);
  ctx.fillStyle = mute();
  ctx.fillText(`best ${best}`, 10, 36);

  ctx.textAlign = "center";
  if (g.phase === "ready") {
    ctx.fillStyle = fg;
    ctx.fillText("tap, enter or space to fly", W / 2, H / 2 + 40);
  } else if (g.phase === "over") {
    ctx.fillStyle = fg;
    ctx.font = "500 15px ui-sans-serif, system-ui, sans-serif";
    ctx.fillText(`bonk. ${g.score} ${g.score === 1 ? "bug wall" : "bug walls"}.`, W / 2, H / 2 - 6);
    ctx.font = "12px ui-monospace, monospace";
    ctx.fillStyle = mute();
    ctx.fillText("enter to fly again", W / 2, H / 2 + 14);
  }
}

/**
 * "play this", in the corner: tota flies through walls of bugs. Tap the game, or press Enter,
 * Space or the up arrow, to flap. Esc closes it. The footer parrot opens it too.
 */
export default function FlyGame() {
  const [open, setOpen] = useState(false);
  const [said, setSaid] = useState("");
  const canvas = useRef<HTMLCanvasElement>(null);
  const launcher = useRef<HTMLButtonElement>(null);
  const game = useRef<Game>(newGame());
  const best = useRef(0);

  const close = useCallback(() => {
    setOpen(false);
    launcher.current?.focus();
  }, []);

  const tap = useCallback(() => {
    const before = game.current.phase;
    game.current = flap(game.current);
    if (before !== "flying") setSaid("");
  }, []);

  useEffect(() => on("game:open", () => setOpen(true)), []);

  useEffect(() => {
    if (!open) return;
    const c = canvas.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) throw new Error("tota flies: 2d canvas unavailable");
    const dpr = Math.min(3, window.devicePixelRatio || 1);
    c.width = W * dpr;
    c.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    best.current = readBest();
    game.current = newGame((Math.random() * 1e9) | 0);
    c.focus({ preventScroll: true });

    let raf = 0;
    let last = performance.now();
    const frame = (now: number) => {
      const was = game.current.phase;
      game.current = step(game.current, (now - last) / 1000);
      last = now;
      if (was === "flying" && game.current.phase === "over") {
        const n = game.current.score;
        if (n > best.current) {
          best.current = n;
          saveBest(n);
        }
        setSaid(`Bonk. ${n} ${n === 1 ? "wall" : "walls"}. Best ${best.current}. Press Enter to fly again.`);
      }
      draw(ctx, game.current, best.current, now);
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        return;
      }
      // Enter on the close button or the launcher should press that button, not flap.
      if ((e.target as HTMLElement)?.closest?.("[data-close], .play")) return;
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowUp") {
        e.preventDefault(); // no page scroll on Space
        tap();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close, tap]);

  return (
    <>
      {open && (
        <div className="fly" role="dialog" aria-label="tota flies">
          <header>
            <span>
              <b>tota flies</b> <span className="mute">dodge the bugs</span>
            </span>
            <button type="button" data-close onClick={close} aria-label="Close the game">
              ×
            </button>
          </header>
          <canvas
            ref={canvas}
            tabIndex={0}
            aria-label="tota flies. Press Enter or Space to flap through the gaps."
            onPointerDown={(e) => {
              e.preventDefault();
              tap();
            }}
          />
          <p className="sr" aria-live="polite">
            {said}
          </p>
        </div>
      )}
      <button
        ref={launcher}
        type="button"
        className={`play${open ? " on" : ""}`}
        aria-expanded={open}
        onClick={() => (open ? close() : setOpen(true))}
      >
        <Glyph name="parrot" color className="play-g" />
        play this
      </button>
    </>
  );
}
