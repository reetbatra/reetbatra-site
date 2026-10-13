import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { PERSON, SITES } from "@/lib/content";
import { GLYPH_SIZE, glyphPath } from "@/lib/glyphs";
import { siteParam } from "@/lib/site-param";
import { PRODUCTION_ORIGIN } from "@/lib/sites";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "reet batra";

const MUTE = "#616161";

// The share card is the cover, small: four corners and the name split by the pixel objects.
export default async function OpengraphImage({ params }: { params: Promise<{ site: string }> }) {
  const s = SITES[await siteParam(params)];
  // Literal paths, so the build traces just these four files and not the whole project.
  const [icon, regular, medium, mono] = await Promise.all([
    readFile(join(process.cwd(), "app", "icon.png")),
    readFile(join(process.cwd(), "assets-src", "fonts", "Geist-Regular.ttf")),
    readFile(join(process.cwd(), "assets-src", "fonts", "Geist-Medium.ttf")),
    readFile(join(process.cwd(), "assets-src", "fonts", "GeistMono-Regular.ttf")),
  ]);
  const face = `data:image/png;base64,${icon.toString("base64")}`;
  const objects = s.objects.slice(0, 5);
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#fff", color: "#0a0a0a", padding: 56, fontFamily: "Geist", fontSize: 26 }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <img src={face} width={64} height={64} alt="" style={{ borderRadius: 32 }} />
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span>{PERSON.name}</span>
              <span style={{ color: MUTE }}>{s.tagline}</span>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
            <span>{s.role}</span>
            <span style={{ color: MUTE }}>{PERSON.city}</span>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 168, fontWeight: 500, letterSpacing: -9, lineHeight: 1 }}>
          <span>{PERSON.first}</span>
          <div style={{ display: "flex", gap: 14 }}>
            {objects.map((o) => (
              <svg key={o.to} width={64} height={64} viewBox={`0 0 ${GLYPH_SIZE} ${GLYPH_SIZE}`} shapeRendering="crispEdges">
                <path d={glyphPath(o.glyph)} fill="#0a0a0a" />
              </svg>
            ))}
          </div>
          <span>{PERSON.last}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <span style={{ maxWidth: 560 }}>{s.motto}</span>
          <span style={{ fontFamily: "Mono", fontSize: 22, color: MUTE }}>{new URL(PRODUCTION_ORIGIN[s.id]).host}</span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Geist", data: regular, weight: 400, style: "normal" },
        { name: "Geist", data: medium, weight: 500, style: "normal" },
        { name: "Mono", data: mono, weight: 400, style: "normal" },
      ],
    },
  );
}
