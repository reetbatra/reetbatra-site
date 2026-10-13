import type { Metadata } from "next";
import Chrome from "@/components/Chrome";
import SubHead from "@/components/SubHead";
import WritingLog from "@/components/WritingLog";
import { BLOG_HOME, postsFor, SITES } from "@/lib/content";
import { siteParam } from "@/lib/site-param";

export const metadata: Metadata = { title: "writing", alternates: { canonical: "/writing" } };

export default async function Writing({ params }: { params: Promise<{ site: string }> }) {
  const site = await siteParam(params);
  return (
    <>
      <main>
        <SubHead title="writing" lede="Notes from building things and teaching developers. The two drafts are next." />
        <WritingLog posts={postsFor(site)} />
        <a className="all-link" href={BLOG_HOME} target="_blank" rel="noopener noreferrer">
          every post on hashnode ↗
        </a>
      </main>
      <Chrome game={SITES[site].game} main={false} resume={SITES[site].resume} />
    </>
  );
}
