import { SITES, WORK } from "@/lib/content";
import { postsFor } from "@/lib/posts";
import { PRODUCTION_ORIGIN, siteFromHost } from "@/lib/sites";

/** llms.txt: a plain map of this page for AI answer engines (llmstxt.org). */
export function GET(request: Request) {
  const id = siteFromHost(request.headers.get("host"));
  const s = SITES[id];
  const home = PRODUCTION_ORIGIN.home;
  const work = WORK.filter((w) => !w.on || w.on.includes(id))
    .sort((a, b) => b.date.localeCompare(a.date))
    .map((w) => `- [${w.title}](${w.href}): ${w.what}`);
  const posts = postsFor(id)
    .filter((p) => !p.draft)
    .map((p) => `- [${p.title}](${home}${p.href}): ${p.brief}`);
  const body = [`# Reet Batra`, "", `> ${s.description}`, "", "## Work", ...work, "", "## Writing", ...posts, ""].join("\n");
  return new Response(body, { headers: { "content-type": "text/plain; charset=utf-8" } });
}
