// Every word and link on the site. Edit this file to change the site.
//
// Rules (see AGENTS.md):
// - Every number links to something a stranger can check. No percentage improvement claims.
// - No em dashes. AI first; Web3 work is history, never the headline.
// - The three pages never link to each other.

import type { SiteId } from "./sites.ts";

export interface Receipt {
  label: string;
  /** Short state shown in bold: merged, live, repo, ... */
  state: string;
  href: string;
}

export interface Stage {
  text: string;
  receipt?: Receipt;
}

export interface Site {
  id: SiteId;
  /** <title> and the OG card. */
  title: string;
  description: string;
  tagline: string;
  motto: string;
  /** "I take products from" [from] → [to] */
  lead: string;
  from: string;
  to: string;
  stages: Stage[];
  nav: { href: string; label: string; hint: string; external?: boolean }[];
  /** The one ask on the page. Home has none on purpose. */
  ask?: { text: string; href: string };
  resume: boolean;
  game: boolean;
}

export const PERSON = {
  name: "reet batra",
  photoCaption: "eth india, bangalore",
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

export const SITES: Record<SiteId, Site> = {
  home: {
    id: "home",
    title: "reet batra",
    description: "Builder at heart. I take products from 0 to 1. Bangalore.",
    tagline: "builder at heart.",
    motto: "product, 0 to 1. currently building AskTota.",
    lead: "I take products from",
    from: "0",
    to: "1",
    stages: [
      { text: "a problem that annoys me" },
      { text: "a repo the same night", receipt: { label: "github.com/reetbatra", state: "repos", href: "https://github.com/reetbatra?tab=repositories" } },
      { text: "deployed, a little ugly", receipt: { label: "docsparity.vercel.app", state: "live", href: "https://docsparity.vercel.app" } },
      { text: "a stranger uses it", receipt: { label: "AskTota", state: "on google play", href: "https://play.google.com/store/apps/details?id=app.asktota" } },
      { text: "a product people use", receipt: { label: "everything I've shipped", state: "→", href: "/work" } },
    ],
    nav: [
      { href: "/work", label: "work", hint: "products" },
      { href: "/writing", label: "writing", hint: "notes" },
    ],
    resume: false,
    game: false,
  },
  devrel: {
    id: "devrel",
    title: "reet batra · devrel",
    description: "Developer relations for AI SDKs. I find what breaks for developers and fix it upstream.",
    tagline: "developer relations · ai sdks · bangalore",
    motto: "I find what breaks for developers, and fix it upstream.",
    lead: "I take developers from",
    from: "err",
    to: "ok",
    stages: [
      { text: "a red error in the quickstart" },
      { text: "a repro anyone can run", receipt: { label: "reetbatra/cyberwave-quickstart-check", state: "repo", href: "https://github.com/reetbatra/cyberwave-quickstart-check" } },
      { text: "the fix, merged upstream", receipt: PR.cyberwave },
      { text: "docs that match the code", receipt: PR.sarvamSkills },
      { text: "the next dev never hits it", receipt: { ...PR.zcashFactCheck, label: "zcashlabs/zcash-skills#4 · fact-check CI" } },
    ],
    nav: [
      { href: "/work", label: "work", hint: "merged PRs" },
      { href: "/writing", label: "writing", hint: "notes" },
      { href: "https://www.youtube.com/@Reet-DevRel", label: "videos", hint: "youtube", external: true },
    ],
    ask: { text: "hiring for devrel? read the PRs first →", href: "/work" },
    resume: true,
    game: true,
  },
  fde: {
    id: "fde",
    title: "reet batra · fde",
    description: "Forward deployed engineer for AI products. I build it, then stay until their team can run it.",
    tagline: "forward deployed engineer · ai · bangalore",
    motto: "I build it, then stay until their team can run it.",
    lead: "I take AI from",
    from: "demo",
    to: "prod",
    stages: [
      { text: "a demo that works on my laptop" },
      { text: "it meets real data", receipt: { label: "reetbatra/kya-bola · ASR benchmark", state: "repo", href: "https://github.com/reetbatra/kya-bola" } },
      { text: "a check that catches the weird cases", receipt: { label: "docsParity", state: "live", href: "https://docsparity.vercel.app" } },
      { text: "the fix lands in their repo", receipt: PR.sarvamSdk },
      { text: "boring, in production", receipt: { ...PR.zcashFactCheck, label: "zcashlabs/zcash-skills#4 · runs on every PR" } },
    ],
    nav: [
      { href: "/work", label: "work", hint: "builds and fixes" },
      { href: "/writing", label: "writing", hint: "notes" },
    ],
    ask: { text: "hiring an FDE? start with the work →", href: "/work" },
    resume: true,
    game: true,
  },
};

/** $ tail -f mind. Newest first. Each line is dated to the day the thing happened. */
export const MIND: { date: string; text: string; href?: string }[] = [
  { date: "13 oct", text: "rebuilding this site in black and white" },
  { date: "10 oct", text: "a fact-check CI that only reads the lines a PR changed", href: "https://github.com/zcashlabs/zcash-skills/pull/4" },
  { date: "09 oct", text: "llms.txt is the new README, and most docs sites don't ship one", href: "https://github.com/openvm-org/openvm/issues/3166" },
  { date: "08 oct", text: "a stream where every token arrived and the reply was still empty", href: "https://github.com/sarvam-ai/ai-sdk/pull/2" },
  { date: "07 oct", text: "ten docs examples imported names the package doesn't export. fixed the same day", href: "https://github.com/mastra-ai/mastra/issues/26277" },
  { date: "25 sep", text: "for most developers the quickstart is the product", href: "https://github.com/cyberwave-os/docs-mintlify/pull/105" },
];

export type WorkKind = "product" | "pr" | "report" | "role";

export interface WorkItem {
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
  { kind: "product", date: "2026-09", when: "2026", title: "AskTota", what: "Real Vedic astrology, written like your group chat. I run product, the app, brand and growth, with one engineering partner.", href: "https://www.asktota.com", status: "live", featured: true },
  { kind: "product", date: "2026-05-31", when: "may 2026", title: "docsParity", what: "Finds where an SDK's docs and code have drifted apart, from the real exported API, and files each mismatch as an issue.", href: "https://docsparity.vercel.app", status: "live" },
  { kind: "product", date: "2026-07-12", when: "jul 2026", title: "Blunt", what: "A speech coach that tells you exactly what to fix, then makes you say it again.", href: "https://blunt.reetbatra.com", status: "live" },
  { kind: "product", date: "2026-08-31", when: "aug 2026", title: "Muscle Mommy", what: "A lifting PWA that decides your next set for you, and refuses a 2.5 to 5kg dumbbell jump.", href: "https://musclemommy.reetbatra.com", status: "live" },
  { kind: "product", date: "2026-06-27", when: "jun 2026", title: "Nudge", what: "A job tracker for people who struggle to act on opportunities. It sends one push a morning and that's all.", href: "https://nudge.reetbatra.com", status: "live" },
  { kind: "product", date: "2026-06-17", when: "jun 2026", title: "hook-catch", what: "Point a webhook at a URL, watch each request land, then replay it.", href: "https://hook-catch.vercel.app", status: "live" },
  { kind: "product", date: "2026-08", when: "2026", title: "bestie, don't.", what: "The friend who takes your phone after a breakup.", href: "https://bestie.reetbatra.com", status: "live", on: ["home"] },
  { kind: "product", date: "2026-10-01", when: "oct 2026", title: "lcdoctor", what: "Finds the LangChain imports that break when you upgrade, and where each one lives now.", href: "https://github.com/reetbatra/lcdoctor", status: "repo", on: ["devrel", "fde"] },
  { kind: "product", date: "2026-08-24", when: "aug 2026", title: "kya bola", what: "Where Indian speech recognition actually works, district by district, built on the Vaani corpus.", href: "https://github.com/reetbatra/kya-bola", status: "repo", on: ["devrel", "fde"] },

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
  { kind: "role", date: "2022-08", when: "2022 to 2025", title: "four years in developer relations", what: "StarkWare, DablClub, ZKX. 4,800+ developers taught in person across 11 events, 12+ tutorials in official docs, and a video series at 4K to 8K views an episode.", href: "https://www.linkedin.com/in/reet-batra/", status: "past" },
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

export const BLOG_HOME = "https://reet.hashnode.dev";

// Briefs are the first lines of each post, from the Hashnode RSS feed on 2026-10-13.
export const POSTS: Post[] = [
  { date: "2026-10-20", when: "soon", title: "I built an AI agent that catches docs drift before your users do", brief: "How docsParity reads the real API from the TypeScript compiler and only lets the model rank what it finds.", topic: "building", draft: true },
  { date: "2026-10-19", when: "soon", title: "The support agent that never answers the same question twice", brief: "An agent that saves each answer as a skill file and replies from the file next time, with no model call.", topic: "building", draft: true },
  { date: "2026-03-24", when: "mar 2026", title: "Building your first zero-knowledge dApp on the Midnight Network", href: `${BLOG_HOME}/building-your-first-zero-knowledge-dapp-on-the-midnight-network`, brief: "Every blockchain built before Midnight has the same problem: all data is public. Your wallet address is a fingerprint.", topic: "protocols" },
  { date: "2024-04-21", when: "apr 2024", title: "DevRel done right: how to avoid common mistakes", href: `${BLOG_HOME}/devrel-done-right-how-to-avoid-common-mistakes-and-become-a-developer-darling`, brief: "Today we're diving into developer relations. This one is close to my heart and might be a bit controversial.", topic: "devrel" },
  { date: "2024-04-02", when: "apr 2024", title: "Level up your git commit messages", href: `${BLOG_HOME}/level-up-your-git-commit-messages-from-cryptic-to-crystal-clear`, brief: "Ever stared at a commit message from your past self and thought, what was I thinking? One-liners like \"fix bug\" help no one.", topic: "devrel" },
  { date: "2024-03-15", when: "mar 2024", title: "How to build and publish your own npm package", href: `${BLOG_HOME}/a-beginners-guide-on-how-to-build-and-publish-your-own-npm-package`, brief: "I built and published a small npm package in under two hours. By the end of this you'll have published one too.", topic: "building" },
  { date: "2023-05-01", when: "may 2023", title: "The power of technical writing", href: `${BLOG_HOME}/the-power-of-technical-writing-communicating-complex-ideas-in-simple-terms`, brief: "Technical writing is where complex ideas and processes get explained in simple terms. The different kinds, and how to get good at them.", topic: "devrel" },
  { date: "2025-07-13", when: "jul 2025", title: "Solidity vs Cairo: a technical overview", href: `${BLOG_HOME}/solidity-vs-cairo-a-technical-overview`, brief: "Myth: you need Solidity before you can understand Cairo. Fact: Cairo stands on its own.", topic: "protocols" },
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

/**
 * Posts for one page: drafts first, then newest first, with protocol posts (Web3 history) last
 * so they never lead.
 */
export function postsFor(site: SiteId): Post[] {
  const rank = (p: Post) => {
    if (p.draft) return 0;
    return p.topic === "protocols" ? 2 : 1;
  };
  return POSTS.filter((p) => !p.on || p.on.includes(site)).sort(
    (a, b) => rank(a) - rank(b) || b.date.localeCompare(a.date),
  );
}
