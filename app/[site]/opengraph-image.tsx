import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { PERSON, SITES } from "@/lib/content";
import { siteParam } from "@/lib/site-param";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "reet batra";

// The share card: white paper, black ink, the face, the drag at its finished end.
export default async function OpengraphImage({ params }: { params: Promise<{ site: string }> }) {
  const s = SITES[await siteParam(params)];
  const file = (p: string) => readFile(join(process.cwd(), p));
  const [icon, regular, semibold] = await Promise.all([
    file("app/icon.png"),
    file("assets-src/fonts/IBMPlexMono-Regular.ttf"),
    file("assets-src/fonts/IBMPlexMono-SemiBold.ttf"),
  ]);
  const face = `data:image/png;base64,${icon.toString("base64")}`;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#fff", color: "#0a0a0a", padding: 72, fontFamily: "Plex" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          <img src={face} width={112} height={112} alt="" style={{ borderRadius: 56 }} />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 72, fontWeight: 600, letterSpacing: -3, lineHeight: 1 }}>{PERSON.name}</div>
            <div style={{ fontSize: 30, color: "#616161", marginTop: 12 }}>{s.tagline}</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
          <div style={{ fontSize: 120, color: "#c8c8c8", letterSpacing: -6, fontFamily: "Plex", fontWeight: 400 }}>{s.from}</div>
          <div style={{ flex: 1, height: 4, background: "#0a0a0a", display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
            <div style={{ width: 28, height: 28, background: "#0a0a0a" }} />
          </div>
          <div style={{ fontSize: 120, letterSpacing: -6, fontFamily: "Plex", fontWeight: 400 }}>{s.to}</div>
        </div>
        <div style={{ fontSize: 30 }}>{s.motto}</div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Plex", data: regular, weight: 400, style: "normal" },
        { name: "Plex", data: semibold, weight: 600, style: "normal" },
      ],
    },
  );
}
