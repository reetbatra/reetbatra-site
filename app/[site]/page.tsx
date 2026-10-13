import type { Metadata } from "next";
import Link from "next/link";
import Chrome from "@/components/Chrome";
import Drag from "@/components/Drag";
import Mind from "@/components/Mind";
import Name from "@/components/Name";
import { MIND, PERSON, SITES } from "@/lib/content";
import { siteParam } from "@/lib/site-param";

export const metadata: Metadata = { alternates: { canonical: "/" } };

export default async function Home({ params }: { params: Promise<{ site: string }> }) {
  const s = SITES[await siteParam(params)];
  return (
    <>
      <main>
        <div className="top">
          <div>
            <Name name={PERSON.name} caption={PERSON.photoCaption} describedBy="tagline" />
            <p className="tagline" id="tagline">
              {s.tagline}
            </p>
            <p className="motto">{s.motto}</p>
            <nav className="nav" aria-label="Pages">
              {s.nav.map((n) =>
                n.external ? (
                  <a key={n.href} href={n.href} target="_blank" rel="noopener noreferrer">
                    {n.label}
                    <span>{n.hint} ↗</span>
                  </a>
                ) : (
                  <Link key={n.href} href={n.href}>
                    {n.label}
                    <span>{n.hint} →</span>
                  </Link>
                ),
              )}
            </nav>
            <p className="contact">
              {PERSON.links.map((l) => (
                <a key={l.label} href={l.href} {...(l.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                  {l.label}
                </a>
              ))}
            </p>
            {s.ask && (
              <Link className="ask" href={s.ask.href}>
                {s.ask.text}
              </Link>
            )}
          </div>
          <Mind items={MIND} />
        </div>
        <Drag lead={s.lead} from={s.from} to={s.to} stages={s.stages} />
      </main>
      <Chrome game={s.game} main resume={s.resume} />
    </>
  );
}
