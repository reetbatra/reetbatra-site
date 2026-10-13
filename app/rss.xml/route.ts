import { allPosts, renderMarkdown } from "@/lib/posts";
import { PRODUCTION_ORIGIN } from "@/lib/sites";

export const dynamic = "force-static";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const cdata = (s: string) => `<![CDATA[${s.replace(/]]>/g, "]]]]><![CDATA[>")}]]>`;

/** Full-text RSS of every post, at their one canonical home on www. */
export function GET() {
  const site = PRODUCTION_ORIGIN.home;
  const items = allPosts()
    .map((p) => {
      const url = `${site}/writing/${p.slug}`;
      // Images in the body are site-relative; feed readers need them absolute.
      const html = renderMarkdown(p.body).replace(/(src|href)="\//g, `$1="${site}/`);
      return `<item><title>${esc(p.title)}</title><link>${url}</link><guid isPermaLink="true">${url}</guid><pubDate>${new Date(`${p.date}T09:00:00Z`).toUTCString()}</pubDate><description>${esc(p.brief)}</description><content:encoded>${cdata(html)}</content:encoded></item>`;
    })
    .join("");
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>reet batra · writing</title><link>${site}/writing</link><atom:link href="${site}/rss.xml" rel="self" type="application/rss+xml"/><description>Notes from building things and teaching developers.</description><language>en</language>${items}</channel></rss>`;
  return new Response(xml, { headers: { "content-type": "application/rss+xml; charset=utf-8" } });
}
