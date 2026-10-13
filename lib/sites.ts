// One app, three front doors. The host a visitor arrives on decides which page they get,
// and nothing on any page links to the other two.

export const SITE_IDS = ["home", "devrel", "fde"] as const;
export type SiteId = (typeof SITE_IDS)[number];

export const PRODUCTION_ORIGIN: Record<SiteId, string> = {
  home: "https://www.reetbatra.com", // reetbatra.com 308s to www
  devrel: "https://devrel.reetbatra.com",
  fde: "https://fde.reetbatra.com",
};

export function isSiteId(value: string): value is SiteId {
  return (SITE_IDS as readonly string[]).includes(value);
}

/**
 * Picks the page from the request host.
 *
 *   devrel.reetbatra.com, devrel.localhost:3000, reetbatra-site-devrel.vercel.app  → devrel
 *   fde.reetbatra.com,    fde.localhost:3000,    reetbatra-site-fde.vercel.app     → fde
 *   anything else (reetbatra.com, www., a preview deployment URL)                  → home
 *
 * The "-devrel" / "-fde" suffix form exists because a vercel.app alias can't have a dot
 * in its own label, and it lets each page be previewed on its own URL before cutover.
 */
export function siteFromHost(host: string | null | undefined): SiteId {
  if (!host) return "home";
  const label = host.trim().toLowerCase().split(":")[0].split(".")[0];
  for (const id of ["devrel", "fde"] as const) {
    if (label === id || label.endsWith(`-${id}`)) return id;
  }
  return "home";
}
