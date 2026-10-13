import type { Metadata } from "next";
import Chrome from "@/components/Chrome";
import SubHead from "@/components/SubHead";
import WorkList from "@/components/WorkList";
import { PERSON, SITES, workFor } from "@/lib/content";
import { siteParam } from "@/lib/site-param";

export const metadata: Metadata = { title: "work", alternates: { canonical: "/work" } };

export default async function Work({ params }: { params: Promise<{ site: string }> }) {
  const s = SITES[await siteParam(params)];
  return (
    <div className="column">
      <main>
        <SubHead title="work" lede={s.workLede} />
        <WorkList items={workFor(s.id)} />
      </main>
      <Chrome name={PERSON.name} city={PERSON.city} game={false} resume={s.resume} />
    </div>
  );
}
