import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { allPosts, getPost, monthYear, renderPost, parsePost, postsByYear, postsFor, readingMinutes, renderMarkdown, slugify } from "./posts.ts";

test("parsePost reads the front matter and the body", () => {
  const p = parsePost("x", '---\ntitle: "A: b"\ndate: "2024-04-02"\nbrief: "Hi."\ntopic: devrel\n---\n\nBody here.\n');
  assert.equal(p.title, "A: b");
  assert.equal(p.topic, "devrel");
  assert.equal(p.body, "Body here.");
});

test("parsePost refuses broken posts instead of guessing", () => {
  assert.throws(() => parsePost("x", "no front matter"), /no front matter/);
  assert.throws(() => parsePost("x", '---\ntitle: "t"\ndate: "2024-04-02"\nbrief: "b"\n---\n'), /missing topic/);
  assert.throws(() => parsePost("x", '---\ntitle: "t"\ndate: "april"\nbrief: "b"\ntopic: devrel\n---\n'), /bad date/);
  assert.throws(() => parsePost("x", '---\ntitle: "t"\ndate: "2024-04-02"\nbrief: "b"\ntopic: gossip\n---\n'), /unknown topic/);
});

test("every Hashnode post is here, complete, with its images on this site", () => {
  const posts = allPosts();
  assert.ok(posts.length >= 21, `only ${posts.length} posts`);
  for (const p of posts) {
    assert.ok(p.body.length > 1500, `${p.slug} looks truncated`);
    if (p.original) assert.match(p.original, /^https:\/\/reet\.hashnode\.dev\//, p.slug);
    assert.doesNotMatch(p.body, /cdn\.hashnode\.com/, `${p.slug} still loads images from Hashnode`);
    for (const [, src] of p.body.matchAll(/!\[[^\]]*\]\(([^)]+)\)/g)) assert.ok(existsSync(`public${src}`), `${p.slug}: ${src} is missing`);
  }
  assert.ok(getPost("level-up-your-git-commit-messages-from-cryptic-to-crystal-clear"));
  assert.equal(getPost("your-docs-platform-wrote-your-llms-txt")?.original, undefined, "first published here");
});

test("the writing page: drafts (if any) first, then by date in year blocks, Web3 never leads", () => {
  for (const id of ["home", "devrel", "fde"] as const) {
    const list = postsFor(id);
    const drafts = list.filter((p) => p.draft).length;
    assert.ok(list.slice(0, drafts).every((p) => p.draft), "drafts come first");
    const firstPublished = list.find((p) => !p.draft);
    assert.notEqual(firstPublished?.topic, "protocols");
    for (const p of list) if (!p.draft) assert.match(p.href ?? "", /^\/writing\/[a-z0-9-]+$/);
    const dates = list.filter((p) => !p.draft).map((p) => p.date);
    assert.deepEqual(dates, [...dates].sort().reverse(), `${id} is not newest first`);
    const labels = postsByYear(id).map((b) => b.label);
    const years = labels.filter((l) => l !== "soon");
    if (drafts) assert.equal(labels[0], "soon");
    assert.deepEqual(years, [...years].sort().reverse());
    assert.equal(new Set(labels).size, labels.length, "one block per year");
  }
});

test("rendered posts can't carry markup or script, and links behave", () => {
  const html = renderMarkdown(
    '# Title\n\n<script>alert(1)</script>\n\n[x](javascript:alert(1)) [y](https://example.com) [z](/writing/a)\n\n![pic](https://evil.example/p.png)\n\n![ok](/writing/a/01.webp)',
  );
  assert.doesNotMatch(html, /<script/);
  assert.doesNotMatch(html, /javascript:/);
  assert.doesNotMatch(renderMarkdown("[a](//evil.example/x)"), /evil/, "protocol-relative links are refused");
  assert.match(html, /href="https:\/\/example.com" target="_blank" rel="noopener noreferrer"/);
  assert.match(html, /href="\/writing\/a">z/);
  assert.doesNotMatch(html, /evil\.example/);
  assert.match(html, /<img src="\/writing\/a\/01.webp" alt="ok" loading="lazy"/);
  assert.match(html, /<h2 id="title">/, "post headings start at h2");
});

test("repeated headings get unique ids", () => {
  const html = renderMarkdown("## Setup\n\n## Setup");
  assert.match(html, /id="setup"/);
  assert.match(html, /id="setup-1"/);
});

test("small helpers", () => {
  assert.equal(monthYear("2024-04-02"), "apr 2024");
  assert.equal(slugify("What is <b>DevRel</b>?"), "what-is-devrel");
  assert.equal(slugify("you&#39;ve never &amp; don&#x27;ts"), "youve-never-donts", "entities don't leak into ids");
  assert.equal(readingMinutes("word ".repeat(660)), 3);
  assert.equal(readingMinutes("hi"), 1);
});

test("the table of contents lists the post's top level headings, with the ids the page uses", () => {
  const { html, toc } = renderPost("## One\n\ntext\n\n### Sub\n\n## Two & *more*\n\n## One");
  assert.deepEqual(toc, [
    { id: "one", text: "One" },
    { id: "two-more", text: "Two & more" },
    { id: "one-1", text: "One" },
  ]);
  for (const t of toc) assert.match(html, new RegExp(`id="${t.id}"`));
  assert.deepEqual(renderPost("### Only\n\n### Threes").toc.map((t) => t.text), ["Only", "Threes"], "h3-only posts still get one");
  assert.deepEqual(renderPost("no headings").toc, []);
});

test("every post that has sections gets a table of contents", () => {
  const p = getPost("your-docs-platform-wrote-your-llms-txt");
  assert.ok(p);
  const toc = renderPost(p.body).toc.map((t) => t.text);
  assert.equal(toc[0], "0 to 5 min: does it even load");
  assert.ok(toc.includes("Sources"));
});
