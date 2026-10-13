import type { WorkItem } from "@/lib/content";
import Glyph from "./Glyph";

/** Everything, by year: the year in the gutter, then each thing with what it was. */
export default function WorkList({ items }: { items: WorkItem[] }) {
  const sorted = [...items].sort((a, b) => b.date.localeCompare(a.date));
  const years: { year: string; rows: WorkItem[] }[] = [];
  for (const w of sorted) {
    const y = w.date.slice(0, 4);
    const last = years.at(-1);
    if (last && last.year === y) last.rows.push(w);
    else years.push({ year: y, rows: [w] });
  }

  return (
    <ol className="years big">
      {years.map((y) => (
        <li key={y.year}>
          <span className="year">{y.year}</span>
          <ul>
            {y.rows.map((w) => (
              <li key={w.href} id={w.id}>
                <a href={w.href} target="_blank" rel="noopener noreferrer" className="w-row">
                  <span className="w-title">
                    {w.glyph && <Glyph name={w.glyph} className="mini" />}
                    {w.title}
                  </span>
                  <span className={`chip ${w.status}`}>{w.status}</span>
                  <span className="w-what">{w.what}</span>
                  <span className="w-when">{w.when}</span>
                </a>
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ol>
  );
}
