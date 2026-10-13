import Link from "next/link";

export default function NotFound() {
  return (
    <main className="nf">
      <p className="nf-cmd">$ cat this-page</p>
      <h1>nothing here.</h1>
      <p>
        <Link href="/">← back</Link>
      </p>
    </main>
  );
}
