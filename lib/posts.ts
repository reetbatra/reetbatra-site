// The blog: Markdown files in content/posts, imported from Hashnode by
// scripts/import-hashnode.mjs and edited here from now on. Server only (reads the disk at build).

import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { Marked, type Tokens } from "marked";
import { DRAFTS, type Post, type PostTopic } from "./content.ts";
import type { SiteId } from "./sites.ts";

export interface PostFile {
  slug: string;
  title: string;
  /** yyyy-mm-dd */
  date: string;
  brief: string;
  topic: PostTopic;
  /** Where it was first published. */
  original?: string;
  /** Markdown body. */
  body: string;
}

const DIR = join(process.cwd(), "content", "posts");
const TOPICS: PostTopic[] = ["building", "devrel", "protocols"];

/** Splits "---\nkey: value\n---\nbody". Values are JSON strings or bare words. */
export function parsePost(slug: string, raw: string): PostFile {
  const m = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) throw new Error(`posts: ${slug} has no front matter`);
  const meta: Record<string, string> = {};
  for (const line of m[1].split("\n")) {
    const i = line.indexOf(":");
    if (i < 1) throw new Error(`posts: ${slug} has a bad front matter line: ${line}`);
    const key = line.slice(0, i).trim();
    const value = line.slice(i + 1).trim();
    meta[key] = value.startsWith('"') ? JSON.parse(value) : value;
  }
  for (const k of ["title", "date", "brief", "topic"]) if (!meta[k]) throw new Error(`posts: ${slug} is missing ${k}`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(meta.date)) throw new Error(`posts: ${slug} has a bad date ${meta.date}`);
  if (!TOPICS.includes(meta.topic as PostTopic)) throw new Error(`posts: ${slug} has an unknown topic ${meta.topic}`);
  return {
    slug,
    title: meta.title,
    date: meta.date,
    brief: meta.brief,
    topic: meta.topic as PostTopic,
    original: meta.original,
    body: m[2].trim(),
  };
}

let cache: PostFile[] | null = null;

/** Every published post, newest first. */
export function allPosts(): PostFile[] {
  if (!cache) {
    cache = readdirSync(DIR)
      .filter((f) => f.endsWith(".md"))
      .map((f) => parsePost(f.slice(0, -3), readFileSync(join(DIR, f), "utf8")))
      .sort((a, b) => b.date.localeCompare(a.date));
  }
  return cache;
}

export function getPost(slug: string): PostFile | undefined {
  return allPosts().find((p) => p.slug === slug);
}

const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
/** "2024-04-02" → "apr 2024" */
export const monthYear = (date: string) => `${MONTHS[Number(date.slice(5, 7)) - 1]} ${date.slice(0, 4)}`;

/** Minutes to read at 220 words a minute, never less than one. */
export function readingMinutes(markdown: string): number {
  const words = markdown.replace(/```[\s\S]*?```/g, " ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

/**
 * Posts for one page: drafts first, then newest first, with protocol posts (Web3 history)
 * last so they never lead.
 */
export function postsFor(site: SiteId): Post[] {
  const published: Post[] = allPosts().map((p) => ({
    date: p.date,
    when: monthYear(p.date),
    title: p.title,
    href: `/writing/${p.slug}`,
    brief: p.brief,
    topic: p.topic,
  }));
  const rank = (p: Post) => {
    if (p.draft) return 0;
    return p.topic === "protocols" ? 2 : 1;
  };
  return [...DRAFTS, ...published]
    .filter((p) => !p.on || p.on.includes(site))
    .sort((a, b) => rank(a) - rank(b) || b.date.localeCompare(a.date));
}

export const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/<[^>]+>/g, "")
    .replace(/&[a-z]+;/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/**
 * Markdown to HTML for a post. Headings get ids so they can be linked, outside links open in a
 * new tab, images load lazily, and raw HTML in the Markdown is shown as text (only <br> is
 * kept), so nothing in a post can inject markup or script.
 */
export function renderMarkdown(md: string): string {
  const seen = new Map<string, number>();
  const marked = new Marked({ gfm: true });
  marked.use({
    renderer: {
      heading({ tokens, depth }: Tokens.Heading) {
        const text = this.parser.parseInline(tokens);
        const base = slugify(text) || "section";
        const n = seen.get(base) ?? 0;
        seen.set(base, n + 1);
        const id = n ? `${base}-${n}` : base;
        // The page title is the h1, so post headings start at h2.
        const level = Math.min(6, Math.max(2, depth));
        return `<h${level} id="${id}"><a href="#${id}" class="hash" aria-hidden="true" tabindex="-1">#</a>${text}</h${level}>\n`;
      },
      link({ href, title, tokens }: Tokens.Link) {
        const text = this.parser.parseInline(tokens);
        // Site paths, but not protocol-relative "//host" ones, which leave the site.
        const safe = /^(https?:|mailto:|\/(?!\/)|#)/.test(href) ? href : "#";
        const ext = /^https?:/.test(safe) ? ' target="_blank" rel="noopener noreferrer"' : "";
        const t = title ? ` title="${escapeHtml(title)}"` : "";
        return `<a href="${escapeHtml(safe)}"${t}${ext}>${text}</a>`;
      },
      image({ href, text }: Tokens.Image) {
        if (!/^\/writing\//.test(href)) return escapeHtml(text);
        return `<img src="${escapeHtml(href)}" alt="${escapeHtml(text)}" loading="lazy" decoding="async">`;
      },
      html({ text }: Tokens.HTML | Tokens.Tag) {
        return /^<br\s*\/?>$/i.test(text.trim()) ? "<br>" : escapeHtml(text);
      },
    },
  });
  return marked.parse(md, { async: false });
}
