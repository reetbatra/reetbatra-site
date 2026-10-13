import Link from "next/link";
import { PERSON } from "@/lib/content";

/** Header for the work and writing pages: the name goes home, nothing else. */
export default function SubHead({ title, lede }: { title: string; lede: string }) {
  return (
    <header>
      <div className="sub-head">
        <Link href="/" className="name small">
          {PERSON.name}
          <span className="caret" aria-hidden="true" />
        </Link>
        <Link href="/" className="back">
          ← back
        </Link>
      </div>
      <h1 className="sub-title">{title}</h1>
      <p className="sub-lede">{lede}</p>
    </header>
  );
}
