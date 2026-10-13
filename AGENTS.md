# What this project is
One Next.js app behind three front doors: reetbatra.com (home), devrel.reetbatra.com and fde.reetbatra.com. It replaces three separate repos (`reetbatra-home`, `devrel-portfolio`, `fde-portfolio`). Black and white only, light and dark.

Reet decides who sees which page by which link she sends. **The three pages never link to each other, and there is no switcher.** `proxy.ts` reads the host and rewrites to `app/[site]/...`; typing `/devrel` on reetbatra.com 404s on purpose.

| Host | Page | Leads with |
| --- | --- | --- |
| reetbatra.com, www., anything else | `home` | "builder at heart", products. No hiring ask, no resume. |
| devrel.* or `*-devrel.vercel.app` | `devrel` | merged PRs as diffs, spot the drift. Resume. |
| fde.* or `*-fde.vercel.app` | `fde` | builds and fixes, spot the drift. Resume. |

# The design (v3, 2026-10-14)
A blend of portfolios Reet likes, copying none: a cover with small print in four corners and the name split by pixel objects (melike turgut), an engraved frontispiece portrait and a contents page with dotted leaders (danielwhite.uk), a narrow column with the year in the gutter (bobby.so), a "currently" card, notes rows and the time in Bengaluru in the footer (abhisekmishra.com), and a workshop grid of small live sketches (sanyam.sh/lab). It replaced the krinza.me-style drag hero, `tail -f mind` and `?` keys menu on purpose; don't bring those back. Geist + Geist Mono, Newsreader italic for captions only.

Locally: `npm run dev`, then open localhost:3000, devrel.localhost:3000 and fde.localhost:3000 (Chrome resolves `*.localhost` by itself).

# Where things are
- `lib/content.ts`: every word and link on the site, the cover objects, the workshop order, the diffs. Edit this to change copy.
- `lib/glyphs.ts`: the 12x12 pixel objects (hand drawn, tested). `lib/portrait.ts`: engraving, ASCII and sharpen math (pure, tested).
- `lib/security-headers.ts`: CSP, HSTS and friends, wired in `next.config.ts` (tested).
- `components/Cover.tsx` (first screen), `Plate.tsx` (engraved portrait, prints on scroll, ripples on hover, click opens the ASCII one), `Sections.tsx` (intro, currently, timeline, notes), `Workshop.tsx` + `Demos.tsx` (the live sketches), `Chrome.tsx` (footer, keys t/p/d, the parrot, the press-p portrait), `DriftGame.tsx`, `WorkList.tsx`, `WritingLog.tsx`.
- Sketch animations only run while a card is hovered, focused or (phones) on screen; at rest each shows its finished frame.
- The blog: `content/posts/*.md` (imported from Hashnode once by `npm run import:hashnode`, edited here now), read by `lib/posts.ts`, shown at `/writing/[slug]`. Images live in `public/writing/<slug>/` because the CSP only allows same-origin images. Every post's canonical URL is on www, whichever host it's read on. `/rss.xml` (full text), `/sitemap.xml` and `/llms.txt` are per host. Drafts stay in `DRAFTS` in `lib/content.ts`.
- "play this" (bottom right) and the footer parrot open `components/FlyGame.tsx`: tota flies through walls of bugs, tap/Enter/Space/up to flap, Esc closes. Physics in `lib/fly.ts` (pure, tested). Tota is a parrot: she flies, she doesn't run.
- `scripts/make-assets.mjs` builds the favicon, home-screen icon and `public/portrait.png` from `assets-src/`. Run `npm run assets` after changing a source photo. The portrait cutout came from macOS Vision via `assets-src/lift.swift`.

# Rules
- Every visible string is user-facing copy: no em dashes, humanizer rules apply, lowercase voice for labels.
- Every number links to something a stranger can check. No percentage improvement claims (resume metric policy). `lib/content.test.ts` enforces both.
- AI first. Web3 work is history and never leads a page; the tests check titles, the first work row and the first post.
- No colour anywhere except the pixel objects on the cover (and the share card that copies it): Reet asked for those in colour on 2026-10-14. Their colours live in `GLYPH_COLORS` and must hold 3:1 on both pages (tested). Status is fill (merged, fixed), outline (live, repo), dashes (draft) or grey (past).
- `MIND` (the notes list) lines are dated to the day the thing happened and link to it when there's a link.
- AskTota is never marketed as "AI-powered".
- Site-wide CSS resets live in `@layer base` in `app/globals.css`. Preflight strips link underlines, so base `a` puts them back; block links set `text-decoration: none` themselves.

# Commands
- `npm run dev` / `npm run build` / `npm run lint` / `npm run typecheck` / `npm test`
- After `npm run build`, `PORT=3456 npm start` serves production locally. Stop it with `pkill -f next-server` (the process is not named `next start`).

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes. APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices. Middleware is `proxy.ts` now.
<!-- END:nextjs-agent-rules -->
