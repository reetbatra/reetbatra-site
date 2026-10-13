import { GLYPH_COLORS, GLYPH_SIZE, glyphPath, type GlyphName } from "@/lib/glyphs";

/**
 * One of the pixel objects. In ink by default, so it flips with the lights; `color` paints it
 * in its own colours (the cover only).
 */
export default function Glyph({
  name,
  className,
  label,
  color = false,
}: {
  name: GlyphName;
  className?: string;
  label?: string;
  color?: boolean;
}) {
  const c = GLYPH_COLORS[name];
  const accent = glyphPath(name, "+");
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
      <path d={glyphPath(name)} fill={color ? c.fill : undefined} />
      {accent && <path d={accent} fill={color ? (c.accent ?? c.fill) : undefined} />}
    </svg>
  );
}
