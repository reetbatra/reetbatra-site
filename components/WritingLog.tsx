"use client";

import { useState } from "react";
import type { Post } from "@/lib/content";

/** Titles on the left. Hover or focus one and its first lines show alongside. */
export default function WritingLog({ posts }: { posts: Post[] }) {
  const [active, setActive] = useState(0);
  const p = posts[active];

  return (
    <div className="log">
      <ul className="rows">
        {posts.map((post, i) => {
          const body = (
            <>
              <span className="r-when">{post.when}</span>
              <span className="r-title">{post.title}</span>
              <span className={`chip${post.draft ? " draft" : ""}`}>{post.draft ? "draft" : "read"}</span>
              <span className="brief-inline">{post.brief}</span>
            </>
          );
          return (
            <li key={post.title} onPointerEnter={() => setActive(i)} aria-current={i === active ? "true" : undefined}>
              {post.href ? (
                <a href={post.href} target="_blank" rel="noopener noreferrer" onFocus={() => setActive(i)}>
                  {body}
                </a>
              ) : (
                <div>{body}</div>
              )}
            </li>
          );
        })}
      </ul>
      <aside className="preview" aria-live="polite">
        <div className="p-when">{p.draft ? "draft, coming soon" : p.when}</div>
        <p>{p.brief}</p>
      </aside>
    </div>
  );
}
