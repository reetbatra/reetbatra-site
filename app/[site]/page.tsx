import type { Metadata } from "next";
import Chrome from "@/components/Chrome";
import Cover from "@/components/Cover";
import { Currently, Intro, Notes, Timeline } from "@/components/Sections";
import Workshop from "@/components/Workshop";
import { MIND, PERSON, SITES, timelineFor, workshopFor } from "@/lib/content";
import { siteParam } from "@/lib/site-param";

export const metadata: Metadata = { alternates: { canonical: "/" } };

export default async function Home({ params }: { params: Promise<{ site: string }> }) {
  const id = await siteParam(params);
  const s = SITES[id];
  const links = [...PERSON.links.filter((l) => id !== "home" || l.label !== "youtube")];
  if (s.resume) links.push({ label: "resume", href: "/resume.pdf" });
  const seeAll = id === "devrel" ? "every PR" : "everything";

  return (
    <>
      <main>
        <Cover
          first={PERSON.first}
          last={PERSON.last}
          tagline={s.tagline}
          role={s.role}
          city={PERSON.city}
          motto={s.motto}
          objects={s.objects}
          links={links}
        />
        <div className="column">
          <Intro site={s} caption={PERSON.photoCaption} />
          <Currently rows={s.currently} objects={s.objects} />
        </div>
        <Workshop cards={workshopFor(id)} seeAll={seeAll} />
        <div className="column">
          <Timeline years={timelineFor(id)} seeAll={seeAll} />
          <Notes items={MIND} />
        </div>
      </main>
      <div className="column">
        <Chrome name={PERSON.name} city={PERSON.city} game={s.game} resume={s.resume} />
      </div>
    </>
  );
}
