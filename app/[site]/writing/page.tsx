import type { Metadata } from "next";
import Chrome from "@/components/Chrome";
import SubHead from "@/components/SubHead";
import WritingLog from "@/components/WritingLog";
import { BLOG_HOME, PERSON, postsFor, SITES } from "@/lib/content";
import { siteParam } from "@/lib/site-param";

export const metadata: Metadata = { title: "writing", alternates: { canonical: "/writing" } };

export default async function Writing({ params }: { params: Promise<{ site: string }> }) {
  const s = SITES[await siteParam(params)];
  return (
    <div className="column">
      <main>
        <SubHead title="writing" lede="Notes from building things and teaching developers. The two drafts are next." />
        <h2 className="contents-t">contents</h2>
        <WritingLog posts={postsFor(s.id)} />
        <p className="all-link">
          <a href={BLOG_HOME} target="_blank" rel="noopener noreferrer">
            every post on hashnode ↗
          </a>
        </p>
      </main>
      <Chrome name={PERSON.name} city={PERSON.city} game={false} resume={s.resume} />
    </div>
  );
}
