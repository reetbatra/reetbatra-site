// One-off import of every post from reet.hashnode.dev into content/posts/*.md, so the blog
// lives on reetbatra.com. Run with `npm run import:hashnode`. Safe to re-run: it rewrites the
// files from Hashnode, so edit posts here only after you stop publishing there.
//
// Sources: the RSS feed carries the full HTML of the newest 20 posts. Older ones (the feed
// stops at 20) come from the post page itself, from its article body. Hashnode's GraphQL API
// was shut down, so there is no markdown to fetch directly.
//
// Images are downloaded into public/writing/<slug>/ because the site's CSP only allows images
// from its own origin.
import { createHash } from "node:crypto";
import { mkdirSync, writeFileSync } from "node:fs";
import { extname } from "node:path";
import { DOMParser, parseHTML } from "linkedom";
import TurndownService from "turndown";
import sharp from "sharp";
import { gfm } from "turndown-plugin-gfm";

const BLOG = "https://reet.hashnode.dev";
const OUT = "content/posts";

// Posts that aren't in the feed, by slug.
const EXTRA = ["is-devrel-the-right-career-choice-for-you-guide-to-becoming-a-devrel"];

// Topic decides order on the page: building and devrel first, protocols (Web3 history) last.
const PROTOCOL = /starknet|cairo|zk|zero-knowledge|ethereum|evm|mina|polygon|biconomy|chain|web3|midnight|dojo|paymaster|session-keys|cartridge|solidity|equiid|snark|stark/i;
const DEVREL = /devrel|technical-writing|commit-messages/i;
const topicOf = (slug) => (PROTOCOL.test(slug) ? "protocols" : DEVREL.test(slug) ? "devrel" : "building");

async function get(url, as = "text") {
  const res = await fetch(url, { headers: { "user-agent": "reetbatra-site importer" } });
  if (!res.ok) throw new Error(`import: ${url} answered ${res.status}`);
  return as === "buffer" ? Buffer.from(await res.arrayBuffer()) : res.text();
}

const td = new TurndownService({ headingStyle: "atx", codeBlockStyle: "fenced", bulletListMarker: "-", emDelimiter: "*" });
td.use(gfm);
td.remove(["script", "style", "noscript", "button"]);
// Hashnode wraps code in <pre><code class="language-x">. Keep the language on the fence.
td.addRule("fenced", {
  filter: (n) => n.nodeName === "PRE" && n.querySelector("code"),
  replacement: (_c, n) => {
    const code = n.querySelector("code");
    const lang = (code.getAttribute("class") ?? "").match(/language-([\w+-]+)/)?.[1] ?? "";
    return `\n\n\`\`\`${lang}\n${code.textContent.replace(/\n$/, "")}\n\`\`\`\n\n`;
  },
});
// Embeds become plain links: no third party frames on the site.
td.addRule("embeds", {
  filter: ["iframe", "video", "embed"],
  replacement: (_c, n) => {
    const src = n.getAttribute("src");
    return src ? `\n\n[watch it here](${src})\n\n` : "";
  },
});
// Heading anchors Hashnode adds ("#heading-..."), noise in markdown.
td.addRule("anchors", {
  filter: (n) => n.nodeName === "A" && /^#heading-/.test(n.getAttribute("href") ?? "") && !n.textContent.trim(),
  replacement: () => "",
});

async function localiseImages(html, slug) {
  const { document } = parseHTML(`<main>${html}</main>`);
  const imgs = [...document.querySelectorAll("img")];
  let n = 0;
  for (const img of imgs) {
    const src = img.getAttribute("src");
    if (!src || !/^https?:/.test(src)) continue;
    const buf = await get(src, "buffer");
    const ext = (extname(new URL(src).pathname) || ".png").toLowerCase();
    const base = `${String(++n).padStart(2, "0")}-${createHash("sha1").update(src).digest("hex").slice(0, 6)}`;
    mkdirSync(`public/writing/${slug}`, { recursive: true });
    // Stills become WebP at most 1400px wide; GIFs keep their animation as they are.
    let name = `${base}${ext}`;
    if (ext === ".gif") writeFileSync(`public/writing/${slug}/${name}`, buf);
    else {
      name = `${base}.webp`;
      await sharp(buf).resize({ width: 1400, withoutEnlargement: true }).webp({ quality: 80 }).toFile(`public/writing/${slug}/${name}`);
    }
    img.setAttribute("src", `/writing/${slug}/${name}`);
    img.removeAttribute("srcset");
    img.removeAttribute("loading");
  }
  return { html: document.querySelector("main").innerHTML, images: n };
}

const yaml = (s) => JSON.stringify(s); // JSON strings are valid YAML scalars

/** Slugs being imported, so links between my own posts can stay on my site. */
const SLUGS = new Set();

async function write({ slug, title, date, brief, html }) {
  const { html: local, images } = await localiseImages(html, slug);
  const md = td
    .turndown(local)
    .replace(/^[ \t]+$/gm, "")
    .replace(/https:\/\/reet\.hashnode\.dev\/([a-z0-9-]+)/g, (m, s) => (SLUGS.has(s) ? `/writing/${s}` : m))
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  const front = [
    "---",
    `title: ${yaml(title)}`,
    `date: ${yaml(date)}`,
    `brief: ${yaml(brief)}`,
    `topic: ${topicOf(slug)}`,
    `original: ${yaml(`${BLOG}/${slug}`)}`,
    "---",
  ].join("\n");
  writeFileSync(`${OUT}/${slug}.md`, `${front}\n\n${md}\n`);
  console.log(`${date}  ${slug}  (${md.length} chars, ${images} images)`);
}

const firstSentences = (text, max = 180) => {
  const t = text.replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max);
  const end = Math.max(cut.lastIndexOf(". "), cut.lastIndexOf("? "));
  return end > 60 ? cut.slice(0, end + 1) : `${cut.slice(0, cut.lastIndexOf(" "))}…`;
};

mkdirSync(OUT, { recursive: true });

const rss = await get(`${BLOG}/rss.xml`);
const feed = new DOMParser().parseFromString(rss.replace(/<(\/?)content:encoded>/g, "<$1encoded>"), "text/xml");
const items = [...feed.getElementsByTagName("item")];
if (!items.length) throw new Error("import: the feed had no items");
for (const item of items) {
  const link = item.getElementsByTagName("link")[0]?.textContent?.trim() ?? "";
  SLUGS.add(new URL(link).pathname.replace(/^\/|\/$/g, ""));
}
EXTRA.forEach((s) => SLUGS.add(s));
for (const item of items) {
  const tag = (name) => item.getElementsByTagName(name)[0]?.textContent?.trim() ?? "";
  const link = tag("link") || tag("guid");
  const slug = new URL(link).pathname.replace(/^\/|\/$/g, "");
  const html = tag("encoded");
  if (!html) throw new Error(`import: ${slug} has no content in the feed`);
  const date = new Date(tag("pubDate")).toISOString().slice(0, 10);
  const { document } = parseHTML(`<main>${html}</main>`);
  await write({
    slug,
    title: tag("title"),
    date,
    brief: firstSentences(tag("description") || document.querySelector("main").textContent),
    html,
  });
}

for (const slug of EXTRA) {
  const page = await get(`${BLOG}/${slug}`);
  const { document } = parseHTML(page);
  const body = [...document.querySelectorAll("div.prose")].find((d) => d.className.includes("prose-pre"));
  if (!body) throw new Error(`import: couldn't find the article body on ${slug}`);
  const title = document.querySelector("h1")?.textContent?.trim();
  const date = document.querySelector('meta[property="article:published_time"]')?.getAttribute("content")?.slice(0, 10);
  if (!title || !date) throw new Error(`import: ${slug} is missing its title or date`);
  const brief = document.querySelector('meta[name="description"]')?.getAttribute("content") ?? body.textContent;
  await write({ slug, title, date, brief: firstSentences(brief), html: body.innerHTML });
}
