# What this project is
One Next.js app behind three front doors: reetbatra.com (home), devrel.reetbatra.com and fde.reetbatra.com. It replaces three separate repos (`reetbatra-home`, `devrel-portfolio`, `fde-portfolio`). Black and white only, light and dark.

Reet decides who sees which page by which link she sends. **The three pages never link to each other, and there is no switcher.** `proxy.ts` reads the host and rewrites to `app/[site]/...`; typing `/devrel` on reetbatra.com 404s on purpose.

| Host | Page | Leads with |
| --- | --- | --- |
| reetbatra.com, www., anything else | `home` | "builder at heart", 0 to 1 through products. No hiring ask, no resume. |
| devrel.* or `*-devrel.vercel.app` | `devrel` | err to ok through merged PRs. Resume, spot the drift. |
| fde.* or `*-fde.vercel.app` | `fde` | demo to prod through builds and fixes. Resume, spot the drift. |

Locally: `npm run dev`, then open localhost:3000, devrel.localhost:3000 and fde.localhost:3000 (Chrome resolves `*.localhost` by itself).

# Where things are
- `lib/content.ts`: every word and link on the site. Edit this to change copy.
- `lib/sites.ts`: host to page mapping. `lib/portrait.ts`: dither, ASCII and sharpen math (pure, tested).
- `components/Name.tsx`: the name and the portrait that develops on hover (tap on phones; a mouse click opens the big one).
- `components/Chrome.tsx`: footer, every keyboard shortcut, the lights, popovers, the press-p ASCII portrait.
- `components/Drag.tsx`, `Mind.tsx`, `DriftGame.tsx`, `WorkList.tsx`, `WritingLog.tsx`.
- `scripts/make-assets.mjs` builds the favicon, home-screen icon and `public/portrait.png` from `assets-src/`. Run `npm run assets` after changing a source photo. The portrait cutout came from macOS Vision via `assets-src/lift.swift`.

# Rules
- Every visible string is user-facing copy: no em dashes, humanizer rules apply, lowercase voice for labels.
- Every number links to something a stranger can check. No percentage improvement claims (resume metric policy). `lib/content.test.ts` enforces both.
- AI first. Web3 work is history and never leads a page; the tests check titles, the first work row and the first post.
- No colour anywhere. Status is fill (merged, fixed), outline (live, repo), dashes (draft) or grey (past).
- `MIND` lines are dated to the day the thing happened and link to it when there's a link.
- AskTota is never marketed as "AI-powered".
- Site-wide CSS resets live in `@layer base` in `app/globals.css`. Preflight strips link underlines, so base `a` puts them back; block links set `text-decoration: none` themselves.

# Commands
- `npm run dev` / `npm run build` / `npm run lint` / `npm run typecheck` / `npm test`
- After `npm run build`, `PORT=3456 npm start` serves production locally. Stop it with `pkill -f next-server` (the process is not named `next start`).

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes. APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices. Middleware is `proxy.ts` now.
<!-- END:nextjs-agent-rules -->
