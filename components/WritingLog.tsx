import Link from "next/link";
import { roman, type Post } from "@/lib/content";

/**
 * A contents page in blocks by year: numeral, title, a dotted leader, and the date where a page
 * number would be. Numerals run on across the blocks, like chapters.
 */
export default function WritingLog({ blocks }: { blocks: { label: string; posts: Post[] }[] }) {
  let n = 0;
  return (
    <div className="contents-blocks">
      {blocks.map((b) => (
        <section key={b.label} aria-labelledby={`y-${b.label}`}>
          <h3 className="c-year" id={`y-${b.label}`}>
            {b.label}
          </h3>
          <ol className="contents">
            {b.posts.map((p) => {
              n++;
              const row = (
                <>
                  <span className="c-num">{roman(n)}.</span>
                  <span className="c-title">{p.title}</span>
                  <span className="c-dots" aria-hidden="true" />
                  <span className="c-when">{p.draft ? "soon" : p.when.split(" ")[0]}</span>
                  <span className="c-brief">{p.brief}</span>
                </>
              );
              return (
                <li key={p.title} className={p.draft ? "draft" : undefined}>
                  {p.href ? <Link href={p.href}>{row}</Link> : <div>{row}</div>}
                </li>
              );
            })}
          </ol>
        </section>
      ))}
    </div>
  );
}
