---
title: "Your Docs Platform Wrote Your llms.txt. Fix It in 30 Minutes."
date: "2026-10-14"
brief: "If your docs run on Mintlify, GitBook, Fern, or Vercel, you have an llms.txt. You probably didn't write it. You probably haven't opened it."
topic: devrel
---

If your docs run on Mintlify, GitBook, Fern, or Vercel, you have an llms.txt. You probably didn't write it. You probably haven't opened it.

I hadn't either, until I started reading other people's.

The file is supposed to be a short note to AI agents about your product. What to read first. What to skip. In practice, most of them are your sidebar, flattened into a list, with whatever page descriptions someone remembered to fill in.

If anyone is reading them, it isn't search crawlers. Ahrefs found 97% of llms.txt files got zero requests in May. It's the coding agents your users point at your docs when they type "set up webhooks using the Acme docs" into Cursor or Claude Code.

So this isn't a post about whether llms.txt matters. It's a checklist. Open your file, set a timer for 30 minutes, and go through it in order.

## 0 to 5 min: does it even load

Go to `yourdocs.com/llms.txt`. Then `yourdocs.com/llms-full.txt`.

Three outcomes:

- **It loads.** Good. Note how long it is. Scroll to the bottom and see how long that took you.
- **404.** Fine, honestly. Nothing breaks. You're just starting from zero, and you get to skip the next ten minutes of cleanup.
- **500, timeout, or a redirect to your marketing homepage.** Fix this first. It's the only thing Chrome's Lighthouse llms.txt check actually flags, and an agent that hits an error just goes and scrapes your HTML instead.

If your docs live under a subpath, check there too. Since the spec's August update, `/docs/llms.txt` is valid and covers everything under `/docs/`. If you're behind a reverse proxy, this is where you find out it's dropping the route.

## 5 to 10 min: read the first 10 lines like you've never heard of yourself

The spec only requires one thing, an H1 with your project name. Everything after that is optional, but the order matters: a one-line blockquote summary, then any notes, then sections of links.

The first ten lines are the part an agent definitely reads. So read them as a stranger and ask:

- Does the blockquote say what the product actually *is*? On Mintlify it's pulled from the `description` in your `docs.json`, which is usually a tagline someone wrote for SEO. "The developer platform for modern teams" tells an agent nothing.
- Does it say which SDK or language to use?
- Is there anything that says *start here*?

Compare with Stripe. Their file opens with a "Start here" block before a single link. It tells the agent to check npm for the current SDK version rather than guess one from training data. Anyone who's done DevRel knows exactly which support thread that line came from.

**The fix:** rewrite the blockquote for someone who has never heard of you. Product, language, primary SDK, one sentence. Then add two or three lines of "read this first."

## 10 to 15 min: the link list

Generated files usually go wrong in the link list. Mintlify documents how theirs is built: pages follow your `docs.json` navigation order, each description is the page's frontmatter `description` cut at 300 characters, and a page with no description becomes a bare link.

So your llms.txt is exactly as good as your sidebar and your frontmatter. Scroll through and look for:

1. **Bare links.** Count them. Every one is a page the agent has to open blind. Fix it at the source by adding a `description` to that page's frontmatter, and the generated file improves with it.
2. **Deprecated stuff in the main list.** Old SDK versions, v1 endpoints, that migration guide from 2023. An agent sees them with the same weight as your quickstart.
3. **Order.** Your sidebar was designed for a human who can see the whole tree. If Changelog or Pricing sits above Quickstart, move it.
4. **Length.** If the file is thousands of lines, it's not a map anymore. Cloudflare's root llms.txt is just one line per product, each pointing to that product's own llms.txt. Mintlify does something similar automatically once an index passes 100,000 characters.

The spec has a section built for this exact problem and almost nobody uses it well: `## Optional`. Anything under it is stuff an agent can skip when context is tight. Changelogs, legacy guides, community links. Move them there.

Cloudflare also does a small thing worth stealing. Deprecated products stay listed, but the description says it right there: "Firewall Rules (deprecated)" and what replaced it.

## 15 to 20 min: write the don'ts

A generator can't write this section. It reads your docs, not your support inbox. I'd spend most of the 30 minutes here.

Open your support channel, your Discord, your GitHub issues. Look for the questions you answer every single week. The wrong API people keep using. The SDK version that's still in every old blog post. The framework you're *not* compatible with.

Those go in the file, in plain words, near the top.

Stripe has a whole section in their llms.txt addressed to LLM agents directly. It tells them to prefer the Checkout Sessions API, never recommend the Charges API, never call the deprecated Sources API, and use Accounts v2 for any new Connect platform. Reading it felt like reading a senior Stripe engineer's Slack DMs.

Even the spec's own example does this. The FastHTML file says, near the top, that it's not compatible with FastAPI syntax. One line, and an agent stops writing code that will never run.

Yours doesn't need to be long. Something like:

```markdown
# Acme

> Acme is a serverless Postgres database. Use the TypeScript SDK (@acme/client v4).

Before writing code:
- Read Quickstart, then Core concepts. Skip the rest until you need it.
- v3 SDK and /v1 REST endpoints are deprecated. Don't generate code for them.
- Not compatible with Prisma migrations. Use `acme migrate`.
- Install with `npm i @acme/client@latest`. Don't pin a version from memory.
```

If you're on Mintlify, dropping your own `llms.txt` in the project root replaces the generated one. On other platforms, check whether they let you do the same. Mintlify also has a `markdown.instructions` setting in `docs.json` that adds an agent instructions block to the generated file, if you'd rather keep the auto list and just put your notes on top.

## 20 to 25 min: hand it to an agent and watch

This one comes straight from the spec. Its advice for testing an llms.txt is to give an agent only that file and ask it questions.

So do it. Open Claude Code or Cursor in an empty folder and paste something like:

> Using only https://yourdocs.com/llms.txt as your starting point, build a minimal app that does [the thing your quickstart does]. Tell me which pages you read and why.

Then watch.

- Did it open your quickstart first, or wander into the API reference?
- Did it pick the right SDK and the current version?
- Did it use anything you just marked deprecated?
- Where did it get stuck?

Every wrong turn is a line missing from your file. Go back, add it, run it again. Keep going until it stops making the same mistake.

Try two or three real tasks, not just the quickstart. Whatever your users ask about most. Auth and webhooks are almost always on that list.

## 25 to 30 min: check your logs, then give it an owner

Last five minutes. Two things.

**Look at who's actually requesting the file.** Grep your server or CDN logs for `/llms.txt`, `/llms-full.txt`, and `.md` page requests.

Don't be surprised if it's quiet. One study tracked about 900 sites for seven months and logged 1,227 llms.txt requests total. Most came from a single data aggregator. A third were humans in Chrome checking if the file existed. Zero came from GPTBot, ClaudeBot, or PerplexityBot.

That sounds damning, but those studies only see crawlers that announce themselves. An agent fetching your docs on behalf of a user mid-task often looks like generic traffic. Your own logs are the only place you'll see your real number, so write down this month's baseline and check it again after your changes.

**Then decide who owns this file.** A stale map is worse than no map. The one reader you have is an agent already halfway into building on your product, and a dead link or a renamed endpoint sends it the wrong way.

If you override the generated file, it now has to change every time your docs do. Put it in the same PR checklist as your changelog. If that's not realistic for your team, stick with the generated file and do all your fixing at the source: frontmatter descriptions, nav order, deprecation labels.

## The checklist, if you skipped to the end

- [ ] `/llms.txt` loads, or 404s cleanly. No 500s, no redirects.
- [ ] The blockquote says what the product is, for a stranger.
- [ ] There's a "read this first" near the top.
- [ ] No bare links. Every page has a frontmatter description.
- [ ] Deprecated pages are labelled or moved to `## Optional`.
- [ ] Quickstart comes before Changelog.
- [ ] Big docs are split, one llms.txt per product.
- [ ] There's a list of don'ts, pulled from real support questions.
- [ ] An agent given only the file can finish your quickstart.
- [ ] You have a log baseline and a named owner.

On most teams nobody owns this file. It got switched on when someone set up the docs platform, and nobody has opened it since. If you write docs or do DevRel, open yours this week and go down the list above.

## Sources

- [The /llms.txt file, v2](https://llmstxt.org/), Jeremy Howard (proposed Sep 2024, updated Aug 2026)
- [Mintlify docs: llms.txt](https://www.mintlify.com/docs/ai/llmstxt)
- [Stripe's llms.txt](https://docs.stripe.com/llms.txt)
- [Cloudflare's llms.txt](https://developers.cloudflare.com/llms.txt)
- [llms.txt adoption rises 8.8x but 97% of files get zero AI requests](https://ppc.land/llms-txt-adoption-rises-8-8x-but-97-of-files-get-zero-ai-requests/), PPC Land, Jul 2026 (Ahrefs and Originality.ai data)
- [llms.txt in Practice: Adoption Data, Evidence, and Setup](https://www.digitalapplied.com/blog/llms-txt-in-practice-adoption-evidence-2026), Digital Applied, Aug 2026 (900-domain log study)
