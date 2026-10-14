import type { Metadata } from "next";
import Chrome from "@/components/Chrome";
import SubHead from "@/components/SubHead";
import WritingLog from "@/components/WritingLog";
import { PERSON, SITES } from "@/lib/content";
import { postsByYear } from "@/lib/posts";
import { siteParam } from "@/lib/site-param";

export const metadata: Metadata = { title: "writing", alternates: { canonical: "/writing" } };

export default async function Writing({ params }: { params: Promise<{ site: string }> }) {
  const s = SITES[await siteParam(params)];
  return (
    <div className="column">
      <main>
        <SubHead title="writing" lede="Notes from building things and teaching developers, from 2022 on. The two drafts are next." />
        <h2 className="contents-t">contents</h2>
        <WritingLog blocks={postsByYear(s.id)} />
        <p className="all-link">
          <a href="/rss.xml">rss feed</a>
        </p>
      </main>
      <Chrome name={PERSON.name} city={PERSON.city} game={false} resume={s.resume} />
    </div>
  );
}
