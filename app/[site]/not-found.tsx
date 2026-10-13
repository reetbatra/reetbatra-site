import Link from "next/link";
import Glyph from "@/components/Glyph";

export default function NotFound() {
  return (
    <main className="nf">
      <Glyph name="bug" className="nf-g" />
      <h1>nothing here.</h1>
      <p className="mute">
        <em>this page was torn out of the book.</em>
      </p>
      <p>
        <Link href="/">← back to the start</Link>
      </p>
    </main>
  );
}
