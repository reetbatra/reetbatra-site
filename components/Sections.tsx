import Link from "next/link";
import { CURRENTLY_UPDATED, type CoverObject, type Rich as RichT, type Site } from "@/lib/content";
import Glyph from "./Glyph";
import Plate from "./Plate";
import Rich from "./Rich";

const ext = (href: string) => (href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {});

/** The engraved portrait beside a few lines about me, and the one ask if the page has one. */
export function Intro({ site, caption }: { site: Site; caption: string }) {
  return (
    <section className="sec intro" aria-label="About">
      <Plate caption={caption} />
      <div className="intro-text">
        {site.intro.map((p, i) => (
          <p key={i}>
            <Rich parts={p} />
          </p>
        ))}
        {site.ask && (
          <p>
            <Link className="ask" href={site.ask.href}>
              {site.ask.text} →
            </Link>
          </p>
        )}
      </div>
    </section>
  );
}

/** What I'm doing this week, with a little stack of the objects for it. */
export function Currently({ rows, objects }: { rows: Site["currently"]; objects: CoverObject[] }) {
  return (
    <section className="sec" aria-labelledby="currently-t">
      <div className="currently">
        <div>
          <h2 id="currently-t">currently</h2>
          <dl>
            {rows.map((r) => (
              <div key={r.label}>
                <dt>{r.label}</dt>
                <dd>
                  {r.href ? (
                    <a href={r.href} {...ext(r.href)}>
                      {r.text}
                    </a>
                  ) : (
                    r.text
                  )}
                </dd>
              </div>
            ))}
          </dl>
          <p className="updated">
            <span className="dot" aria-hidden="true" />
            last updated {CURRENTLY_UPDATED}
          </p>
        </div>
        <div className="stack" aria-hidden="true">
          {objects.slice(0, 3).map((o) => (
            <span key={o.to} className="tile">
              <Glyph name={o.glyph} />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Year in the gutter, one short line per thing. */
export function Timeline({ years, seeAll }: { years: { year: string; rows: { key: string; line: RichT }[] }[]; seeAll: string }) {
  return (
    <section className="sec" id="timeline" aria-labelledby="timeline-t">
      <header className="sec-head">
        <h2 id="timeline-t">so far</h2>
        <Link href="/work">{seeAll} →</Link>
      </header>
      <ol className="years">
        {years.map((y) => (
          <li key={y.year}>
            <span className="year">{y.year}</span>
            <ul>
              {y.rows.map((r) => (
                <li key={r.key}>
                  <Rich parts={r.line} />
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </section>
  );
}

/** Short notes, newest first, date on the right. */
export function Notes({ items }: { items: { date: string; text: string; href?: string }[] }) {
  return (
    <section className="sec" id="notes" aria-labelledby="notes-t">
      <header className="sec-head">
        <h2 id="notes-t">notes</h2>
        <Link href="/writing">writing →</Link>
      </header>
      <ul className="notes">
        {items.map((m) => (
          <li key={m.date + m.text}>
            {m.href ? (
              <a href={m.href} {...ext(m.href)}>
                <span className="n-text">{m.text}</span>
                <span className="n-date">{m.date}</span>
              </a>
            ) : (
              <div>
                <span className="n-text">{m.text}</span>
                <span className="n-date">{m.date}</span>
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
