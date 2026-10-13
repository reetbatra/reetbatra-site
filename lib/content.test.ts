import { test } from "node:test";
import assert from "node:assert/strict";
import { DRIFT_ROUNDS, MIND, PERSON, POSTS, postsFor, SITES, WORK, workFor } from "./content.ts";
import { SITE_IDS } from "./sites.ts";

const everyString = (value: unknown): string[] =>
  typeof value === "string"
    ? [value]
    : Array.isArray(value)
      ? value.flatMap(everyString)
      : value && typeof value === "object"
        ? Object.values(value).flatMap(everyString)
        : [];

const ALL = { SITES, MIND, WORK, POSTS, DRIFT_ROUNDS, PERSON };

test("no em dashes or en dashes anywhere in the copy", () => {
  const bad = everyString(ALL).filter((s) => /[—–]/.test(s));
  assert.deepEqual(bad, []);
});

test("no percentage claims (resume metric policy)", () => {
  const bad = everyString(ALL).filter((s) => /\d\s?%/.test(s));
  assert.deepEqual(bad, []);
});

test("every link is https, mailto, or a path inside the same page", () => {
  const hrefs = everyString(ALL).filter((s) => /^(https?:|mailto:|\/)/.test(s) && !s.includes(" "));
  assert.ok(hrefs.length > 30, "expected to find the links");
  for (const h of hrefs) assert.match(h, /^(https:\/\/|mailto:|\/[a-z]*$)/, h);
});

test("no page links to another of the three pages", () => {
  const own = /^https:\/\/(www\.|devrel\.|fde\.)?reetbatra\.com/;
  const bad = everyString(ALL).filter((s) => own.test(s));
  assert.deepEqual(bad, []);
});

test("Web3 never leads a page", () => {
  for (const id of SITE_IDS) {
    const s = SITES[id];
    const head = [s.title, s.description, s.tagline, s.motto].join(" ").toLowerCase();
    assert.doesNotMatch(head, /starknet|cairo|web3|zk|blockchain|crypto/, id);
    assert.notEqual(workFor(id)[0].kind, "role", `${id} work page leads with old roles`);
    assert.notEqual(postsFor(id)[0].topic, "protocols", `${id} writing leads with protocols`);
  }
});

test("home is products only, no hiring ask, no resume", () => {
  assert.equal(SITES.home.ask, undefined);
  assert.equal(SITES.home.resume, false);
  assert.equal(workFor("home")[0].title, "AskTota");
  assert.match(SITES.home.tagline, /builder at heart/);
  assert.equal(SITES.home.from + SITES.home.to, "01");
});

test("devrel leads with merged PRs, fde with what was built", () => {
  assert.equal(workFor("devrel")[0].status, "merged");
  assert.equal(workFor("fde")[0].kind, "product");
});

test("every drag stage after the first carries a receipt, and every page has five stops", () => {
  for (const id of SITE_IDS) {
    const stages = SITES[id].stages;
    assert.equal(stages.length, 5, id);
    stages.slice(1).forEach((st, i) => assert.ok(st.receipt, `${id} stage ${i + 1} has no receipt`));
  }
});

test("work items are newest first inside each group", () => {
  for (const id of SITE_IDS) {
    const items = workFor(id);
    for (let i = 1; i < items.length; i++) {
      const [a, b] = [items[i - 1], items[i]];
      if (a.kind === b.kind && !a.featured) assert.ok(a.date >= b.date, `${id}: ${a.title} before ${b.title}`);
    }
  }
});

test("each drift round has a valid answer and a merged PR behind it", () => {
  for (const r of DRIFT_ROUNDS) {
    assert.ok(r.answer >= 0 && r.answer < r.lines.length);
    assert.equal(r.pr.state, "merged");
    assert.match(r.pr.href, /^https:\/\/github\.com\/.+\/pull\/\d+$/);
  }
});

test("mind is newest first and short enough to read at a glance", () => {
  assert.ok(MIND.length >= 4);
  for (const m of MIND) assert.ok(m.text.length <= 90, m.text);
});

test("drafts have no link until they're published", () => {
  for (const p of POSTS) if (p.draft) assert.equal(p.href, undefined, p.title);
  for (const p of POSTS) if (!p.draft) assert.ok(p.href, p.title);
});
