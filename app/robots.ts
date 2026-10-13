import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { PRODUCTION_ORIGIN, siteFromHost } from "@/lib/sites";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const site = siteFromHost((await headers()).get("host"));
  return { rules: { userAgent: "*", allow: "/" }, sitemap: `${PRODUCTION_ORIGIN[site]}/sitemap.xml` };
}
