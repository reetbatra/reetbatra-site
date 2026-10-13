import Link from "next/link";
import { PERSON } from "@/lib/content";

/** Header for the work and writing pages: corners like the cover, then the title. */
export default function SubHead({ title, lede }: { title: string; lede: string }) {
  return (
    <header className="sub">
      <div className="sub-corners">
        <Link href="/" className="who">
          {PERSON.name}
        </Link>
        <Link href="/" className="mute">
          ← back
        </Link>
      </div>
      <h1 className="sub-title">{title}</h1>
      <p className="sub-lede">{lede}</p>
    </header>
  );
}
