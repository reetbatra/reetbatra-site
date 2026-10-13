"use client";

import { useState } from "react";
import type { CoverObject } from "@/lib/content";
import Clock from "./Clock";
import Glyph from "./Glyph";

type Link = { label: string; href: string };

const ext = (href: string) => (href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {});

/** Scroll to a card and make it blink once, so it's obvious which one the object meant. */
function go(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "center" });
  el.classList.remove("ping");
  void el.offsetWidth; // restart the animation if it's the same card twice
  el.classList.add("ping");
  history.replaceState(null, "", `#${id}`);
}

/**
 * The first screen: small print across the top (who, where to find me, what I do) and my name
 * across the middle, split by the
 * things I made. Hover an object to read what it is; click it to jump to it.
 */
export default function Cover({
  first,
  last,
  tagline,
  role,
  city,
  objects,
  links,
}: {
  first: string;
  last: string;
  tagline: string;
  role: string;
  city: string;
  objects: CoverObject[];
  links: Link[];
}) {
  const [hover, setHover] = useState<string | null>(null);

  return (
    <section className="cover" aria-labelledby="who">
      <div className="corner tl">
        <h1 id="who" className="who">
          {first} {last}
        </h1>
        <p className="mute">{tagline}</p>
      </div>

      <ul className="corner tc">
        {links.map((l) => (
          <li key={l.label}>
            <a href={l.href} {...ext(l.href)}>
              {l.label}
            </a>
          </li>
        ))}
      </ul>

      <div className="corner tr">
        <p>{role}</p>
        <p className="mute">
          {city}
          <Clock prefix=", " />
        </p>
      </div>

      <div className="mark">
        <span className="word" aria-hidden="true">
          {first}
        </span>
        <nav className="objects" aria-label="Things I made" onPointerLeave={() => setHover(null)}>
          {objects.map((o, i) => (
            <a
              key={o.to}
              href={`#${o.to}`}
              className="obj"
              style={{ "--i": i } as React.CSSProperties}
              aria-label={o.label}
              onPointerEnter={() => setHover(o.label)}
              onFocus={() => setHover(o.label)}
              onBlur={() => setHover(null)}
              onClick={(e) => {
                e.preventDefault();
                go(o.to);
              }}
            >
              <Glyph name={o.glyph} color />
            </a>
          ))}
        </nav>
        <span className="word" aria-hidden="true">
          {last}
        </span>
      </div>
      <p className="hovering" aria-hidden="true">
        {hover ?? " "}
      </p>

    </section>
  );
}
