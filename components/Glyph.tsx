import { GLYPH_SIZE, glyphPath, type GlyphName } from "@/lib/glyphs";

/** One of the pixel objects, drawn in the page's ink so it flips with the lights. */
export default function Glyph({ name, className, label }: { name: GlyphName; className?: string; label?: string }) {
  return (
    <svg
      className={className}
      viewBox={`0 0 ${GLYPH_SIZE} ${GLYPH_SIZE}`}
      shapeRendering="crispEdges"
      fill="currentColor"
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
    >
      <path d={glyphPath(name)} />
    </svg>
  );
}
