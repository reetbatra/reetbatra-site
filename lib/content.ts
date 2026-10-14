// Every word and link on the site. Edit this file to change the site.
//
// Rules (see AGENTS.md):
// - Every number links to something a stranger can check. No percentage improvement claims.
// - No em dashes. AI first; Web3 work is history, never the headline.
// - The three pages never link to each other.

import type { GlyphName } from "./glyphs.ts";
import type { SiteId } from "./sites.ts";

export interface Receipt {
  label: string;
  /** Short state shown in bold: merged, live, repo, ... */
  state: string;
  href: string;
}

/** A sentence with links in it: plain strings and linked runs, in order. */
export type Rich = (string | { text: string; href: string })[];

/** One of the little pixel objects on the cover. `to` is a workshop card id or a section id. */
export interface CoverObject {
  glyph: GlyphName;
  label: string;
  to: string;
}

export interface Site {
  id: SiteId;
  /** <title> and the OG card. */
  title: string;
  description: string;
  /** Top left of the cover, under the name. */
  tagline: string;
  /** Top right of the cover. */
  role: string;
  /** Bottom left of the cover, two or three short lines. */
  motto: string;
  /** The paragraphs beside the engraved portrait. */
  intro: Rich[];
  /** Between "reet" and "batra" on the cover. */
  objects: CoverObject[];
  /** The "currently" card. */
  currently: { label: string; text: string; href?: string }[];
  /** Workshop card ids, in order. Each is a WORK item's `id`, a diff, or "drift". */
  workshop: string[];
  /** The line under "work" on /work. */
  workLede: string;
  /** The one ask on the page. Home has none on purpose. */
  ask?: { text: string; href: string };
  resume: boolean;
  game: boolean;
}

export const PERSON = {
  name: "reet batra",
  first: "reet",
  last: "batra",
  city: "bengaluru",
  photoCaption: "on stage",
  links: [
    { label: "github", href: "https://github.com/reetbatra" },
    { label: "x", href: "https://x.com/reet_batra" },
    { label: "linkedin", href: "https://www.linkedin.com/in/reet-batra/" },
    { label: "youtube", href: "https://www.youtube.com/@Reet-DevRel" },
    { label: "email", href: "mailto:reetbatra25@gmail.com" },
  ],
};

const PR = {
  cyberwave: { label: "cyberwave-os/docs-mintlify#105", state: "merged", href: "https://github.com/cyberwave-os/docs-mintlify/pull/105" },
  sarvamSkills: { label: "sarvamai/skills#17", state: "merged", href: "https://github.com/sarvamai/skills/pull/17" },
  sarvamSdk: { label: "sarvam-ai/ai-sdk#2", state: "merged", href: "https://github.com/sarvam-ai/ai-sdk/pull/2" },
  zcashFactCheck: { label: "zcashlabs/zcash-skills#4", state: "merged", href: "https://github.com/zcashlabs/zcash-skills/pull/4" },
} satisfies Record<string, Receipt>;

const ASKTOTA = "https://www.asktota.com";
const DEVREL_YEARS = "https://www.linkedin.com/in/reet-batra/";

export const SITES: Record<SiteId, Site> = {
  home: {
    id: "home",
    title: "reet batra",
    description: "Builder at heart. I take products from 0 to 1. Bengaluru.",
    tagline: "builder at heart.",
    role: "product, 0 to 1",
    motto: "product, 0 to 1. currently building AskTota.",
    intro: [
      ["builder at heart. I take products from 0 to 1: a problem that annoys me, a repo the same night, deployed a little ugly, and then a stranger uses it."],
      ["currently building ", { text: "AskTota", href: ASKTOTA }, ", real Vedic astrology written like your group chat. I run product, the app, brand and growth."],
    ],
    objects: [
      { glyph: "parrot", label: "AskTota", to: "asktota" },
      { glyph: "heart", label: "bestie, don't.", to: "bestie" },
      { glyph: "neq", label: "docsParity", to: "docsparity" },
      { glyph: "mic", label: "Blunt", to: "blunt" },
      { glyph: "dumbbell", label: "Muscle Mommy", to: "musclemommy" },
      { glyph: "bell", label: "Nudge", to: "nudge" },
    ],
    currently: [
      { label: "building", text: "AskTota", href: ASKTOTA },
      { label: "writing", text: "the agent that catches docs drift" },
      { label: "last fix", text: PR.zcashFactCheck.label, href: PR.zcashFactCheck.href },
    ],
    workshop: ["asktota", "bestie", "docsparity", "blunt", "musclemommy", "nudge"],
    workLede: "Things people can use today. Most of them started as a problem that annoyed me.",
    resume: false,
    game: false,
  },
  devrel: {
    id: "devrel",
    title: "reet batra · devrel",
    description: "Developer relations for AI SDKs. I find what breaks for developers and fix it upstream.",
    tagline: "developer relations.",
    role: "devrel, ai sdks",
    motto: "I find what breaks for developers, and fix it upstream.",
    intro: [
      ["I find what breaks for developers, and fix it upstream: a red error in the quickstart, a repro anyone can run, the fix merged, and docs that match the code."],
      [
        "before this, ",
        { text: "four years in developer relations", href: DEVREL_YEARS },
        ": 4,800+ developers taught in person across 11 events. now I build ",
        { text: "docsParity", href: "https://docsparity.vercel.app" },
        ", which catches docs drift before your users do.",
      ],
    ],
    objects: [
      { glyph: "bug", label: "the quickstart bug", to: "cyberwave" },
      { glyph: "book", label: "docs that match", to: "sarvamskills" },
      { glyph: "prompt", label: "the empty stream", to: "sarvamsdk" },
      { glyph: "neq", label: "spot the drift", to: "drift" },
      { glyph: "check", label: "merged upstream", to: "timeline" },
      { glyph: "cross", label: "lcdoctor", to: "lcdoctor" },
    ],
    currently: [
      { label: "last merged", text: PR.zcashFactCheck.label, href: PR.zcashFactCheck.href },
      { label: "building", text: "docsParity", href: "https://docsparity.vercel.app" },
      { label: "writing", text: "the agent that catches docs drift" },
    ],
    workshop: ["drift", "cyberwave", "sarvamskills", "sarvamsdk", "docsparity", "lcdoctor", "kyabola", "hookcatch"],
    workLede: "Fixes in other people's code, newest first. Every row opens the PR or issue.",
    ask: { text: "hiring for devrel? read the PRs first", href: "/work" },
    resume: true,
    game: true,
  },
  fde: {
    id: "fde",
    title: "reet batra · fde",
    description: "Forward deployed engineer for AI products. I build it, then stay until their team can run it.",
    tagline: "forward deployed engineer.",
    role: "fde, ai",
    motto: "I build it, then stay until their team can run it.",
    intro: [
      ["I build it, then stay until their team can run it: a demo that works on my laptop, until it meets real data, a check that catches the weird cases, and the fix in their repo."],
      [
        "lately: ",
        { text: "kya bola", href: "https://github.com/reetbatra/kya-bola" },
        ", where Indian speech recognition actually works, and a streaming fix in ",
        { text: PR.sarvamSdk.label, href: PR.sarvamSdk.href },
        ". before that, ",
        { text: "four years in developer relations", href: DEVREL_YEARS },
        ".",
      ],
    ],
    objects: [
      { glyph: "parrot", label: "AskTota", to: "asktota" },
      { glyph: "bubble", label: "kya bola", to: "kyabola" },
      { glyph: "neq", label: "docsParity", to: "docsparity" },
      { glyph: "prompt", label: "the empty stream", to: "sarvamsdk" },
      { glyph: "cross", label: "lcdoctor", to: "lcdoctor" },
      { glyph: "box", label: "shipped", to: "timeline" },
    ],
    currently: [
      { label: "building", text: "AskTota", href: ASKTOTA },
      { label: "last landed", text: PR.sarvamSdk.label, href: PR.sarvamSdk.href },
      { label: "benchmarking", text: "kya bola", href: "https://github.com/reetbatra/kya-bola" },
    ],
    workshop: ["asktota", "kyabola", "docsparity", "sarvamsdk", "lcdoctor", "drift", "blunt", "musclemommy", "hookcatch"],
    workLede: "What I built, and the fixes I landed in other teams' repos. Each row links to the repo, the live app or the PR.",
    ask: { text: "hiring an FDE? start with the work", href: "/work" },
    resume: true,
    game: true,
  },
};

/** The day the "currently" card was last true. Bump it when you change a card. */
export const CURRENTLY_UPDATED = "14 oct";

/**
 * Diffs for the workshop: the line the docs had, and the line the code wanted.
 * Each one is the real change in a merged PR.
 */
export const DIFFS: { id: string; title: string; before: string; after: string; note: string; pr: Receipt }[] = [
  { id: "cyberwave", title: "the quickstart crashed", before: 'camera = cw.twins("camera")', after: 'camera = cw.twin("camera")', note: "The first example failed on its first call.", pr: PR.cyberwave },
  { id: "sarvamskills", title: "a renamed parameter", before: 'target_language_code="hi-IN",', after: 'language_code="hi-IN",', note: "Renamed in 0.1.29 with no alias, so the old name threw.", pr: PR.sarvamSkills },
  { id: "sarvamsdk", title: "the empty stream", before: '{ type: "text-delta", id, delta }', after: '{ type: "text-start", id } + deltas', note: "Without text-start the AI SDK dropped every delta.", pr: PR.sarvamSdk },
];

/** Notes: what was on my mind, newest first. Each line is dated to the day the thing happened. */
export const MIND: { date: string; text: string; href?: string }[] = [
  { date: "14 oct", text: "your docs platform wrote your llms.txt. fix it in 30 minutes", href: "/writing/your-docs-platform-wrote-your-llms-txt" },
  { date: "10 oct", text: "a fact-check CI that only reads the lines a PR changed", href: "https://github.com/zcashlabs/zcash-skills/pull/4" },
  { date: "09 oct", text: "llms.txt is the new README, and most docs sites don't ship one", href: "https://github.com/openvm-org/openvm/issues/3166" },
  { date: "08 oct", text: "a stream where every token arrived and the reply was still empty", href: "https://github.com/sarvam-ai/ai-sdk/pull/2" },
  { date: "07 oct", text: "ten docs examples imported names the package doesn't export. fixed the same day", href: "https://github.com/mastra-ai/mastra/issues/26277" },
  { date: "25 sep", text: "for most developers the quickstart is the product", href: "https://github.com/cyberwave-os/docs-mintlify/pull/105" },
];

export type WorkKind = "product" | "pr" | "report" | "role";

export interface WorkItem {
  /** Anchor and workshop card id. Products only. */
  id?: string;
  /** The pixel object on its workshop card. */
  glyph?: GlyphName;
  kind: WorkKind;
  /** ISO date (yyyy-mm-dd or yyyy-mm). Used for sorting and the timeline. */
  date: string;
  /** What the date column shows. */
  when: string;
  title: string;
  what: string;
  href: string;
  status: "merged" | "fixed" | "live" | "repo" | "past";
  /** Pages that list this item. Defaults to all three. */
  on?: SiteId[];
  /** Leads its group regardless of date. */
  featured?: boolean;
}

// Statuses checked against GitHub on 2026-10-13. Product dates are each repo's first commit.
export const WORK: WorkItem[] = [
  // products
  { id: "asktota", glyph: "parrot", kind: "product", date: "2026-09", when: "2026", title: "AskTota", what: "Real Vedic astrology, written like your group chat. I run product, the app, brand and growth, with one engineering partner.", href: "https://www.asktota.com", status: "live", featured: true },
  { id: "docsparity", glyph: "neq", kind: "product", date: "2026-05-31", when: "may 2026", title: "docsParity", what: "Finds where an SDK's docs and code have drifted apart, from the real exported API, and files each mismatch as an issue.", href: "https://docsparity.vercel.app", status: "live" },
  { id: "blunt", glyph: "mic", kind: "product", date: "2026-07-12", when: "jul 2026", title: "Blunt", what: "A speech coach that tells you exactly what to fix, then makes you say it again.", href: "https://blunt.reetbatra.com", status: "live" },
  { id: "musclemommy", glyph: "dumbbell", kind: "product", date: "2026-08-31", when: "aug 2026", title: "Muscle Mommy", what: "A lifting PWA that decides your next set for you, and refuses a 2.5 to 5kg dumbbell jump.", href: "https://musclemommy.reetbatra.com", status: "live" },
  { id: "nudge", glyph: "bell", kind: "product", date: "2026-06-27", when: "jun 2026", title: "Nudge", what: "A job tracker for people who struggle to act on opportunities. It sends one push a morning and that's all.", href: "https://nudge.reetbatra.com", status: "live" },
  { id: "hookcatch", glyph: "hook", kind: "product", date: "2026-06-17", when: "jun 2026", title: "hook-catch", what: "Point a webhook at a URL, watch each request land, then replay it.", href: "https://hook-catch.vercel.app", status: "live", on: ["devrel", "fde"] },
  { id: "bestie", glyph: "heart", kind: "product", date: "2026-08", when: "2026", title: "bestie, don't.", what: "The friend who takes your phone after a breakup.", href: "https://bestie.reetbatra.com", status: "live", on: ["home"] },
  { id: "lcdoctor", glyph: "cross", kind: "product", date: "2026-10-01", when: "oct 2026", title: "lcdoctor", what: "Finds the LangChain imports that break when you upgrade, and where each one lives now.", href: "https://github.com/reetbatra/lcdoctor", status: "repo", on: ["devrel", "fde"] },
  { id: "kyabola", glyph: "bubble", kind: "product", date: "2026-08-24", when: "aug 2026", title: "kya bola", what: "Where Indian speech recognition actually works, district by district, built on the Vaani corpus.", href: "https://github.com/reetbatra/kya-bola", status: "repo", on: ["devrel", "fde"] },

  // merged upstream
  { kind: "pr", date: "2026-10-10", when: "10 oct 2026", title: "zcashlabs/zcash-skills#4", what: "CI that fact-checks only the lines a PR changes.", href: "https://github.com/zcashlabs/zcash-skills/pull/4", status: "merged" },
  { kind: "pr", date: "2026-10-08", when: "8 oct 2026", title: "sarvam-ai/ai-sdk#2", what: "Streaming dropped every text delta, so the reply came back empty on ai@6.", href: "https://github.com/sarvam-ai/ai-sdk/pull/2", status: "merged" },
  { kind: "pr", date: "2026-10-08", when: "8 oct 2026", title: "zcashlabs/zcash-skills#2", what: "Runs the repo's own fact and manifest checks on every push and PR.", href: "https://github.com/zcashlabs/zcash-skills/pull/2", status: "merged" },
  { kind: "pr", date: "2026-10-07", when: "7 oct 2026", title: "zcashlabs/zcash-skills#1", what: "Agent skills still warned about a Docker bug that was already fixed.", href: "https://github.com/zcashlabs/zcash-skills/pull/1", status: "merged" },
  { kind: "pr", date: "2026-09-25", when: "25 sep 2026", title: "cyberwave-os/docs-mintlify#105", what: "The quickstart's first example crashed on its first call.", href: "https://github.com/cyberwave-os/docs-mintlify/pull/105", status: "merged" },
  { kind: "pr", date: "2026-08-25", when: "25 aug 2026", title: "sarvamai/skills#17", what: "A TTS parameter in the agent skill didn't match the API.", href: "https://github.com/sarvamai/skills/pull/17", status: "merged" },
  { kind: "report", date: "2026-10-07", when: "7 oct 2026", title: "mastra-ai/mastra#26277", what: "Ten docs examples imported names the packages don't export. Fixed by their team the same day.", href: "https://github.com/mastra-ai/mastra/issues/26277", status: "fixed", on: ["devrel", "fde"] },
  { kind: "report", date: "2026-10-08", when: "8 oct 2026", title: "mastra-ai/mastra#26376", what: "Ten more import paths that don't resolve, checked against the alpha builds. Fixed.", href: "https://github.com/mastra-ai/mastra/issues/26376", status: "fixed", on: ["devrel", "fde"] },
  { kind: "report", date: "2026-10-10", when: "10 oct 2026", title: "mastra-ai/mastra#26377", what: "@mastra/mesa shipped without TypeScript types. Fixed.", href: "https://github.com/mastra-ai/mastra/issues/26377", status: "fixed", on: ["devrel", "fde"] },
  { kind: "pr", date: "2025-04-18", when: "apr 2025", title: "starknet-io/starknet-docs#1572", what: "A Windows install guide for the official docs.", href: "https://github.com/starknet-io/starknet-docs/pull/1572", status: "merged", on: ["devrel"] },

  // before
  { kind: "role", date: "2025", when: "2025", title: "developer relations at StarkWare", what: "Across all three devrel roles: 4,800+ developers taught in person at 11 events, 12+ tutorials in official docs, and a video series at 4K to 8K views an episode.", href: "https://www.linkedin.com/in/reet-batra/", status: "past" },
  { kind: "role", date: "2024", when: "2024", title: "developer relations at DablClub", what: "Developer relations.", href: "https://www.linkedin.com/in/reet-batra/", status: "past" },
  { kind: "role", date: "2022", when: "2022 to 2023", title: "developer relations at ZKX", what: "Developer relations.", href: "https://www.linkedin.com/in/reet-batra/", status: "past" },
];

export type PostTopic = "building" | "devrel" | "protocols";

export interface Post {
  date: string;
  when: string;
  title: string;
  href?: string;
  brief: string;
  topic: PostTopic;
  draft?: boolean;
  /** Pages that list this post. Defaults to all three. */
  on?: SiteId[];
}

/** Where the posts used to live. Every post now lives on this site under /writing. */
export const BLOG_HOME = "https://reet.hashnode.dev";

/** Posts I'm writing. Published posts are Markdown files in content/posts (see lib/posts.ts). */
 export const DRAFTS: Post[] = [
  // { date: "2026-10-20", when: "soon", title: "I built an AI agent that catches docs drift before your users do", brief: "How docsParity reads the real API from the TypeScript compiler and only lets the model rank what it finds.", topic: "building", draft: true },
  // { date: "2026-10-19", when: "soon", title: "The support agent that never answers the same question twice", brief: "An agent that saves each answer as a skill file and replies from the file next time, with no model call.", topic: "building", draft: true },
 ];

/** Spot the drift: three real bugs, each fixed in a merged PR. */
export const DRIFT_ROUNDS: { question: string; lines: string[]; answer: number; why: string; pr: Receipt }[] = [
  {
    question: "A robotics quickstart. One line won't run against the current SDK. Which?",
    lines: ['arm = cw.twin("the-robot-studio/so101")', 'arm.joints.set("1", 30, degrees=True)', 'camera = cw.twins("camera")'],
    answer: 2,
    why: "The SDK exports cw.twin(). The docs said cw.twins(), so the very first example failed.",
    pr: PR.cyberwave,
  },
  {
    question: "sarvamai 0.1.29 or newer. Which line throws a TypeError before any request is sent?",
    lines: ["audio = client.text_to_speech.convert(", '    text="namaste duniya",', '    target_language_code="hi-IN",'],
    answer: 2,
    why: "It was renamed to language_code in 0.1.29. A hard rename with no alias, so the old name fails before the request.",
    pr: PR.sarvamSkills,
  },
  {
    question: "The stream prints fine, but result.text is empty. Which event did the provider never send?",
    lines: ['{ type: "text-start", id: "text-0" }', '{ type: "text-delta", id: "text-0", delta }', '{ type: "finish", finishReason, usage }'],
    answer: 0,
    why: "Without text-start, the AI SDK drops every delta that follows. The provider only sent deltas.",
    pr: PR.sarvamSdk,
  },
];

const KIND_ORDER: Record<SiteId, WorkKind[]> = {
  home: ["product", "pr", "report", "role"],
  devrel: ["pr", "report", "product", "role"],
  fde: ["product", "pr", "report", "role"],
};

/** Work items for one page: grouped by what that page leads with, newest first inside a group. */
export function workFor(site: SiteId): WorkItem[] {
  const order = KIND_ORDER[site];
  return WORK.filter((w) => !w.on || w.on.includes(site)).sort(
    (a, b) =>
      order.indexOf(a.kind) - order.indexOf(b.kind) ||
      Number(!!b.featured) - Number(!!a.featured) ||
      b.date.localeCompare(a.date),
  );
}


type Activity = "building" | "oss" | "role";

const ACTIVITY_OF: Record<WorkKind, Activity> = { product: "building", pr: "oss", report: "oss", role: "role" };

const ACTIVITY_LABEL: Record<Exclude<Activity, "role">, string> = {
  building: "shipping and building",
  oss: "contributing to open source",
};

/** What each page's "so far" shows, in order inside a year. Home is products only. */
const TIMELINE_ORDER: Record<SiteId, Activity[]> = {
  home: ["building", "role"],
  devrel: ["oss", "building", "role"],
  fde: ["building", "oss", "role"],
};

/** Examples per line before it says "and N more". */
export const TIMELINE_EXAMPLES = 3;

/**
 * The year-by-year list on the front page. Each year gets one line per kind of work with a few
 * examples ("shipping and building: AskTota, Blunt, Nudge and 4 more"), and each role its own line.
 */
export function timelineFor(site: SiteId): { year: string; rows: { key: string; line: Rich }[] }[] {
  const order = TIMELINE_ORDER[site];
  const items = WORK.filter((w) => order.includes(ACTIVITY_OF[w.kind]) && (!w.on || w.on.includes(site))).sort(
    (a, b) =>
      Number(!!b.featured) - Number(!!a.featured) ||
      Number(a.kind === "report") - Number(b.kind === "report") || // merged PRs make better examples
      b.date.localeCompare(a.date),
  );
  const years = [...new Set(items.map((w) => w.date.slice(0, 4)))].sort().reverse();
  return years.map((year) => {
    const inYear = items.filter((w) => w.date.startsWith(year));
    const rows: { key: string; line: Rich }[] = [];
    for (const act of order) {
      const these = inYear.filter((w) => ACTIVITY_OF[w.kind] === act);
      if (!these.length) continue;
      if (act === "role") {
        for (const w of these) rows.push({ key: `${year} ${w.title}`, line: [{ text: w.title, href: w.href }] });
        continue;
      }
      const shown = these.slice(0, TIMELINE_EXAMPLES);
      const line: Rich = [`${ACTIVITY_LABEL[act]}: `];
      shown.forEach((w, i) => {
        if (i > 0) line.push(i === shown.length - 1 && these.length <= TIMELINE_EXAMPLES ? " and " : ", ");
        line.push({ text: w.title, href: w.href });
      });
      const more = these.length - shown.length;
      if (more > 0) line.push(" and ", { text: `${more} more`, href: "/work" });
      rows.push({ key: `${year} ${act}`, line });
    }
    return { year, rows };
  });
}

/** A workshop card: a product, a fix shown as a diff, or the drift game. */
export type Card =
  | { type: "product"; item: WorkItem & { id: string; glyph: GlyphName } }
  | { type: "diff"; diff: (typeof DIFFS)[number] }
  | { type: "drift" };

export function workshopFor(site: SiteId): Card[] {
  return SITES[site].workshop.map((id): Card => {
    if (id === "drift") return { type: "drift" };
    const diff = DIFFS.find((d) => d.id === id);
    if (diff) return { type: "diff", diff };
    const item = WORK.find((w) => w.id === id);
    if (!item || !item.glyph || !item.id) throw new Error(`workshop: no card "${id}" for ${site}`);
    return { type: "product", item: item as WorkItem & { id: string; glyph: GlyphName } };
  });
}

/** Lowercase roman numerals for the contents page: 1 → i, 4 → iv, 12 → xii. */
export function roman(n: number): string {
  if (!Number.isInteger(n) || n < 1 || n > 3999) throw new Error(`roman: ${n} is out of range`);
  const table: [number, string][] = [
    [1000, "m"], [900, "cm"], [500, "d"], [400, "cd"], [100, "c"], [90, "xc"],
    [50, "l"], [40, "xl"], [10, "x"], [9, "ix"], [5, "v"], [4, "iv"], [1, "i"],
  ];
  let out = "";
  for (const [v, s] of table) {
    while (n >= v) {
      out += s;
      n -= v;
    }
  }
  return out;
}
