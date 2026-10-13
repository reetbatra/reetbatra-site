import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Chrome from "@/components/Chrome";
import { PERSON, SITES } from "@/lib/content";
import { allPosts, getPost, monthYear, postsFor, readingMinutes, renderMarkdown } from "@/lib/posts";
import { siteParam } from "@/lib/site-param";
import { PRODUCTION_ORIGIN } from "@/lib/sites";

export const dynamicParams = false;

export function generateStaticParams() {
  return allPosts().map((p) => ({ slug: p.slug }));
}

type Params = Promise<{ site: string; slug: string }>;

// One home for each post, whichever of the three front doors it's read through, so search
// engines and answer engines credit a single URL.
const canonical = (slug: string) => `${PRODUCTION_ORIGIN.home}/writing/${slug}`;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const p = getPost(slug);
  if (!p) return {};
  return {
    title: p.title,
    description: p.brief,
    alternates: { canonical: canonical(slug) },
    authors: [{ name: "Reet Batra", url: PRODUCTION_ORIGIN.home }],
    openGraph: { type: "article", title: p.title, description: p.brief, publishedTime: p.date, authors: ["Reet Batra"], url: canonical(slug) },
    twitter: { card: "summary_large_image", title: p.title, description: p.brief, creator: "@reet_batra" },
  };
}

export default async function PostPage({ params }: { params: Params }) {
  const site = await siteParam(params);
  const { slug } = await params;
  const p = getPost(slug);
  if (!p) notFound();
  const s = SITES[site];
  const list = postsFor(site).filter((x) => !x.draft);
  const i = list.findIndex((x) => x.href === `/writing/${slug}`);
  const newer = i > 0 ? list[i - 1] : undefined;
  const older = i >= 0 && i < list.length - 1 ? list[i + 1] : undefined;
  const minutes = readingMinutes(p.body);

  // Structured data for search and answer engines: who wrote it, when, and where it lives.
  const ld = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: p.title,
    description: p.brief,
    datePublished: p.date,
    dateModified: p.date,
    url: canonical(slug),
    mainEntityOfPage: canonical(slug),
    inLanguage: "en",
    timeRequired: `PT${minutes}M`,
    author: { "@type": "Person", name: "Reet Batra", url: PRODUCTION_ORIGIN.home, sameAs: PERSON.links.filter((l) => l.href.startsWith("https")).map((l) => l.href) },
    ...(p.original ? { isBasedOn: p.original } : {}),
  };

  return (
    <div className="column">
      <main>
        <header className="sub">
          <div className="sub-corners">
            <Link href="/" className="who">
              {PERSON.name}
            </Link>
            <Link href="/writing" className="mute">
              ← contents
            </Link>
          </div>
          <p className="post-meta">
            <time dateTime={p.date}>{monthYear(p.date)}</time> · {minutes} min read
          </p>
          <h1 className="post-title">{p.title}</h1>
        </header>
        <article className="prose" dangerouslySetInnerHTML={{ __html: renderMarkdown(p.body) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, "\\u003c") }} />
        <nav className="post-nav" aria-label="More posts">
          {newer ? (
            <Link href={newer.href!}>
              <span className="mute">← newer</span>
              {newer.title}
            </Link>
          ) : (
            <span />
          )}
          {older && (
            <Link href={older.href!} className="older">
              <span className="mute">older →</span>
              {older.title}
            </Link>
          )}
        </nav>
      </main>
      <Chrome name={PERSON.name} city={PERSON.city} game={false} resume={s.resume} />
    </div>
  );
}
