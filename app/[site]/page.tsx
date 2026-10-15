import type { Metadata } from "next";
import Chrome from "@/components/Chrome";
import Cover from "@/components/Cover";
import { Currently, Intro, Notes, Timeline } from "@/components/Sections";
import Showcase from "@/components/Showcase";
import Workshop from "@/components/Workshop";
import { fixesFor, flagshipFor, MIND, PERSON, SITES, timelineFor, videosFor, workshopFor } from "@/lib/content";
import { postsFor } from "@/lib/posts";
import { siteParam } from "@/lib/site-param";

export const metadata: Metadata = { alternates: { canonical: "/" } };

export default async function Home({ params }: { params: Promise<{ site: string }> }) {
  const id = await siteParam(params);
  const s = SITES[id];
  // The blog leads the header links: it's the one that stays on this site.
  const links = [{ label: "blog", href: "/writing" }, ...PERSON.links.filter((l) => id !== "home" || l.label !== "youtube")];
  if (s.resume) links.push({ label: "resume", href: "/resume.pdf" });
  const seeAll = id === "devrel" ? "every PR" : "everything";
  const flagship = flagshipFor(id);
  // Newest first, and never a Web3 post at the top of the devrel page.
  const latest = postsFor(id)
    .filter((p) => !p.draft)
    .sort((a, b) => Number(a.topic === "protocols") - Number(b.topic === "protocols") || b.date.localeCompare(a.date))
    .slice(0, 3);

  return (
    <>
      <main>
        <Cover
          first={PERSON.first}
          last={PERSON.last}
          tagline={s.tagline}
          role={s.role}
          city={PERSON.city}
          objects={s.objects}
          links={links}
        />
        <div className="column">
          <Intro site={s} caption={PERSON.photoCaption} />
          <Currently rows={s.currently} objects={s.objects} />
        </div>
        {flagship && s.showcase ? (
          <Showcase
            title={s.showcase.title}
            flagship={flagship}
            fixes={fixesFor(id)}
            videos={videosFor(id)}
            videosTitle={s.showcase.videosTitle}
            posts={latest}
            game={s.game}
            seeAll={seeAll}
          />
        ) : (
          <Workshop cards={workshopFor(id)} seeAll={{ label: seeAll, href: "/work" }} />
        )}
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
