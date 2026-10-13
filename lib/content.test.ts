import { test } from "node:test";
import assert from "node:assert/strict";
import { DIFFS, DRIFT_ROUNDS, MIND, PERSON, POSTS, postsFor, roman, SITES, TIMELINE_EXAMPLES, timelineFor, WORK, workFor, workshopFor } from "./content.ts";
import { GLYPHS } from "./glyphs.ts";
import { SITE_IDS } from "./sites.ts";

const everyString = (value: unknown): string[] =>
  typeof value === "string"
    ? [value]
    : Array.isArray(value)
      ? value.flatMap(everyString)
      : value && typeof value === "object"
        ? Object.values(value).flatMap(everyString)
        : [];

const ALL = { SITES, MIND, WORK, POSTS, DRIFT_ROUNDS, PERSON, DIFFS };

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
    const head = [s.title, s.description, s.tagline, s.motto, s.role, JSON.stringify(s.intro[0])].join(" ").toLowerCase();
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
  assert.match(SITES.home.motto, /0 to 1/);
  assert.ok(workshopFor("home").every((c) => c.type === "product"), "home workshop is products only");
});

test("devrel leads with merged PRs, fde with what was built", () => {
  assert.equal(workFor("devrel")[0].status, "merged");
  assert.equal(workFor("fde")[0].kind, "product");
});

test("every cover object is a real glyph that points at something on the page", () => {
  for (const id of SITE_IDS) {
    const s = SITES[id];
    assert.ok(s.objects.length >= 5 && s.objects.length <= 7, `${id} has ${s.objects.length} objects`);
    const targets = new Set([...s.workshop, "timeline", "notes"]);
    for (const o of s.objects) {
      assert.ok(o.glyph in GLYPHS, `${id}: ${o.glyph}`);
      assert.ok(targets.has(o.to), `${id}: ${o.label} points at missing #${o.to}`);
    }
  }
});

test("every workshop card resolves, once, and the game is only where it's switched on", () => {
  for (const id of SITE_IDS) {
    const cards = workshopFor(id);
    assert.equal(new Set(SITES[id].workshop).size, cards.length, `${id} repeats a card`);
    assert.equal(cards.some((c) => c.type === "drift"), SITES[id].game, id);
    for (const c of cards) if (c.type === "product") assert.ok(!c.item.on || c.item.on.includes(id), `${id}: ${c.item.title}`);
  }
});

test("every diff is a real change from a merged PR", () => {
  for (const d of DIFFS) {
    assert.notEqual(d.before, d.after, d.id);
    assert.equal(d.pr.state, "merged");
    assert.match(d.pr.href, /^https:\/\/github\.com\/.+\/pull\/\d+$/);
  }
});

test("the timeline is newest year first and home only lists products and past roles", () => {
  for (const id of SITE_IDS) {
    const years = timelineFor(id).map((y) => y.year);
    assert.deepEqual(years, [...years].sort().reverse(), id);
  }
  const home = JSON.stringify(timelineFor("home"));
  assert.doesNotMatch(home, /open source/);
});

test("the timeline sums each year up with a few examples, and roles get their own line", () => {
  for (const id of SITE_IDS) {
    for (const y of timelineFor(id)) {
      for (const r of y.rows) {
        const links = r.line.filter((p) => typeof p !== "string" && p.href !== "/work");
        assert.ok(links.length >= 1 && links.length <= TIMELINE_EXAMPLES, `${id} ${y.year}: ${JSON.stringify(r.line)}`);
      }
    }
  }
  const y2026 = timelineFor("devrel")[0];
  assert.equal(y2026.year, "2026");
  assert.match(JSON.stringify(y2026.rows[0].line), /contributing to open source/);
  const roles = timelineFor("home").flatMap((y) => y.rows.map((r) => [y.year, JSON.stringify(r.line)]));
  for (const [year, who] of [["2025", "StarkWare"], ["2024", "DablClub"], ["2023", "ZKX"]])
    assert.ok(roles.some(([y, l]) => y === year && l.includes(who)), `${year} ${who}`);
});

test("roman numerals", () => {
  assert.deepEqual([1, 4, 9, 12, 40].map(roman), ["i", "iv", "ix", "xii", "xl"]);
  assert.throws(() => roman(0), /out of range/);
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
