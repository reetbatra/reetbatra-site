import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { PERSON } from "@/lib/content";
import { GLYPH_COLORS, GLYPH_SIZE, glyphPath, type GlyphName } from "@/lib/glyphs";
import { getPost, monthYear, readingMinutes } from "@/lib/posts";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "A post by Reet Batra";

const MUTE = "#616161";
const ROW: GlyphName[] = ["book", "neq", "check"];

// The share card for a post: the title big, my name and the date small, three pixel objects.
export default async function PostImage({ params }: { params: Promise<{ site: string; slug: string }> }) {
  const { slug } = await params;
  const p = getPost(slug);
  if (!p) throw new Error(`og: no post "${slug}"`);
  const [icon, regular, medium, mono] = await Promise.all([
    readFile(join(process.cwd(), "app", "icon.png")),
    readFile(join(process.cwd(), "assets-src", "fonts", "Geist-Regular.ttf")),
    readFile(join(process.cwd(), "assets-src", "fonts", "Geist-Medium.ttf")),
    readFile(join(process.cwd(), "assets-src", "fonts", "GeistMono-Regular.ttf")),
  ]);
  const face = `data:image/png;base64,${icon.toString("base64")}`;
  const titleSize = p.title.length > 70 ? 58 : 72;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#fff", color: "#0a0a0a", padding: 64, fontFamily: "Geist" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", gap: 12 }}>
            {ROW.map((g) => (
              <svg key={g} width={44} height={44} viewBox={`0 0 ${GLYPH_SIZE} ${GLYPH_SIZE}`} shapeRendering="crispEdges">
                <path d={glyphPath(g)} fill={GLYPH_COLORS[g].fill} />
              </svg>
            ))}
          </div>
          <span style={{ fontFamily: "Mono", fontSize: 22, color: MUTE }}>
            {monthYear(p.date)} · {readingMinutes(p.body)} min read
          </span>
        </div>
        <div style={{ display: "flex", fontSize: titleSize, fontWeight: 500, letterSpacing: -2.5, lineHeight: 1.05, maxWidth: 1040 }}>{p.title}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 26 }}>
          <img src={face} width={52} height={52} alt="" style={{ borderRadius: 26 }} />
          <span>{PERSON.name}</span>
          <span style={{ color: MUTE }}>reetbatra.com/writing</span>
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
