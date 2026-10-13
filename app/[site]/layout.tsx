import type { Metadata } from "next";
import { SITES } from "@/lib/content";
import { siteParam } from "@/lib/site-param";
import { PRODUCTION_ORIGIN, SITE_IDS } from "@/lib/sites";

export const dynamicParams = false;

export function generateStaticParams() {
  return SITE_IDS.map((site) => ({ site }));
}

export async function generateMetadata({ params }: { params: Promise<{ site: string }> }): Promise<Metadata> {
  const s = SITES[await siteParam(params)];
  return {
    metadataBase: new URL(PRODUCTION_ORIGIN[s.id]),
    title: { default: s.title, template: `%s · ${s.title}` },
    description: s.description,
    openGraph: { title: s.title, description: s.description, type: "website", url: "/", siteName: s.title },
    twitter: { card: "summary_large_image", title: s.title, description: s.description, creator: "@reet_batra" },
  };
}

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return <div className="page">{children}</div>;
}
