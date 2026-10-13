import { notFound } from "next/navigation";
import { isSiteId, type SiteId } from "./sites";

/** Reads the [site] segment. The proxy only ever rewrites to the three valid ones. */
export async function siteParam(params: Promise<{ site: string }>): Promise<SiteId> {
  const { site } = await params;
  if (!isSiteId(site)) notFound();
  return site;
}
