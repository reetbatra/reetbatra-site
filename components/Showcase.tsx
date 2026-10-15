import Link from "next/link";
import { CHANNEL, type Card, type Post, type VIDEOS } from "@/lib/content";
import Workshop from "./Workshop";

const MONTHS = [
  "jan",
  "feb",
  "mar",
  "apr",
  "may",
  "jun",
  "jul",
  "aug",
  "sep",
  "oct",
  "nov",
  "dec",
];
const when = (date: string) =>
  `${Number(date.slice(8, 10))} ${MONTHS[Number(date.slice(5, 7)) - 1]} ${date.slice(0, 4)}`;

/**
 * The middle of the devrel and fde pages: the flagship projects, fixes landed in other teams'
 * repos (fde), the videos, the latest writing, and the drift game. On these pages the content
 * is the work, so it leads instead of a workshop grid.
 */
export default function Showcase({
  title,
  flagship,
  fixes,
  videos,
  videosTitle,
  posts,
  game,
  seeAll,
}: {
  title: string;
  flagship: Card[];
  fixes: Card[];
  videos: typeof VIDEOS;
  videosTitle: string;
  posts: Post[];
  game: boolean;
  seeAll: string;
}) {
  return (
    <>
      <Workshop
        title={title}
        cards={flagship}
        seeAll={{ label: seeAll, href: "/work" }}
        columns={flagship.length >= 3 ? 3 : 2}
      />

      {fixes.length > 0 && (
        <Workshop
          title="in their repo"
          cards={fixes}
          seeAll={{ label: "every PR", href: "/work" }}
          columns={3}
        />
      )}

      {videos.length > 0 && (
        <section className="sec wide" id="videos" aria-labelledby="videos-t">
          <header className="sec-head">
            <h2 id="videos-t">{videosTitle}</h2>
            <a href={CHANNEL} target="_blank" rel="noopener noreferrer">
              the channel ↗
            </a>
          </header>
          <ul className={`videos${videos.length === 2 ? " two" : ""}`}>
            {videos.map((v) => (
              <li key={v.id}>
                <a
                  href={`https://www.youtube.com/watch?v=${v.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="thumb">
                    {/* eslint-disable-next-line @next/next/no-img-element -- a local webp at its final size */}
                    <img
                      src={`/videos/${v.id}.webp`}
                      alt=""
                      width={960}
                      height={540}
                      loading="lazy"
                      decoding="async"
                    />
                    <span className="playmark" aria-hidden="true" />
                  </span>
                  <span className="v-title">{v.title}</span>
                  <span className="v-when">{when(v.date)}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="sec wide" id="writing" aria-labelledby="writing-t">
        <header className="sec-head">
          <h2 id="writing-t">writing</h2>
          <Link href="/writing">all posts →</Link>
        </header>
        <ul className="notes latest">
          {posts.map((p) => (
            <li key={p.title}>
              <Link href={p.href!}>
                <span className="n-text">
                  <b>{p.title}</b>
                  <span className="mute">{p.brief}</span>
                </span>
                <span className="n-date">{p.when}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {game && (
        <Workshop title="play" cards={[{ type: "drift" }]} columns={1} />
      )}
    </>
  );
}
