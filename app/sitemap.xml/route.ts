import { allPosts } from "@/lib/posts";
import { PRODUCTION_ORIGIN, siteFromHost } from "@/lib/sites";

/**
 * Each front door lists only its own pages. Posts are listed once, on www, where their
 * canonical URLs point.
 */
export function GET(request: Request) {
  const site = siteFromHost(request.headers.get("host"));
  const origin = PRODUCTION_ORIGIN[site];
  const urls = [`${origin}/`, `${origin}/work`, `${origin}/writing`];
  if (site === "home") urls.push(...allPosts().map((p) => `${origin}/writing/${p.slug}`));
  const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map((u) => `<url><loc>${u}</loc></url>`).join("")}</urlset>`;
  return new Response(xml, { headers: { "content-type": "application/xml; charset=utf-8" } });
}
