import Link from "next/link";
import { roman, type Post } from "@/lib/content";

/** A contents page: numeral, title, a dotted leader, and the date where a page number would be. */
export default function WritingLog({ posts }: { posts: Post[] }) {
  return (
    <ol className="contents">
      {posts.map((p, i) => {
        const row = (
          <>
            <span className="c-num">{roman(i + 1)}.</span>
            <span className="c-title">{p.title}</span>
            <span className="c-dots" aria-hidden="true" />
            <span className="c-when">{p.draft ? "soon" : p.when}</span>
            <span className="c-brief">{p.brief}</span>
          </>
        );
        return (
          <li key={p.title} className={p.draft ? "draft" : undefined}>
            {p.href ? (
              <Link href={p.href}>{row}</Link>
            ) : (
              <div>{row}</div>
            )}
          </li>
        );
      })}
    </ol>
  );
}
