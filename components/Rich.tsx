import type { Rich as RichT } from "@/lib/content";

/** A sentence with links in it. Outside links open in a new tab. */
export default function Rich({ parts }: { parts: RichT }) {
  return (
    <>
      {parts.map((p, i) =>
        typeof p === "string" ? (
          p
        ) : (
          <a key={i} href={p.href} {...(p.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
            {p.text}
          </a>
        ),
      )}
    </>
  );
}
