import type { Metadata } from "next";
import Chrome from "@/components/Chrome";
import SubHead from "@/components/SubHead";
import WorkList from "@/components/WorkList";
import { SITES, workFor } from "@/lib/content";
import { siteParam } from "@/lib/site-param";
import type { SiteId } from "@/lib/sites";

const LEDE: Record<SiteId, string> = {
  home: "Things people can use today. Most of them started as a problem that annoyed me.",
  devrel: "Fixes in other people's code, newest first. Every row opens the PR or issue.",
  fde: "What I built, and the fixes I landed in other teams' repos. Each row links to the repo, the live app or the PR.",
};

export const metadata: Metadata = { title: "work", alternates: { canonical: "/work" } };

export default async function Work({ params }: { params: Promise<{ site: string }> }) {
  const site = await siteParam(params);
  return (
    <>
      <main>
        <SubHead title="work" lede={LEDE[site]} />
        <WorkList items={workFor(site)} />
      </main>
      <Chrome game={SITES[site].game} main={false} resume={SITES[site].resume} />
    </>
  );
}
