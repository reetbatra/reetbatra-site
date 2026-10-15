---
title: "Tokenmaxxing Claude Code: I Set a Goal at 2:30 am and Woke Up to a New Portfolio"
date: "2026-10-15"
brief: "Your plan's weekly limit resets whether you used it or not. Here's the setup that let Claude Code do a night of real work while I slept, and the parts it still needed me for."
topic: building
---

Your Claude Code limit resets every week whether you used it or not. Whatever you didn't spend is gone.

Tokenmaxxing, a word I kept hearing from YouTubers this month, is about using as much of that limit as you can. Most of the videos were about getting more tokens. I wanted to write about getting real work out of the ones I already pay for, including while I'm asleep.

Here's what that looked like for me, and the setup that made it possible.

## The night

A little after 2:30 am I typed one paragraph into Claude Code. I listed six portfolio sites I like and told it my current site looked copied from someone else's, and that I wanted a mix of all of them. Then I added the line that mattered: "If you have a question, don't wait for me. Work it out, and finish the portfolio end to end."

Then I went to sleep.

[The redesign commit](https://github.com/reetbatra/reetbatra-site/commit/6bbdf1b) landed at 4:40 am. By the time I was properly awake it had:

- visited all six sites in a real browser, screenshotted them, and noticed one domain didn't exist anymore (it told me instead of guessing)
- written down which idea it was taking from each site, so the result wouldn't be a copy of any one
- hand drawn fourteen pixel icons as data, with tests that check each one is a clean 12×12 grid
- rebuilt the home page, the work page and the writing page across all three of my domains
- run the build, the tests and a code review, fixed what the review found, and deployed

Halfway through I sent it a second request: a friend's work laptop was blocking my site as "not secure." It didn't drop the redesign. It finished the build check, then found the actual cause (the domain was only a few months old, so corporate filters had never categorized it), shipped proper security headers, and wrote me a list of the steps only I could do.

The prompt was one paragraph. What made the night work was the setup around it, which is the rest of this post.

## 1. Answer its questions before it asks them

If the agent stops at 3 am to ask "should I commit this?", nothing else happens until I wake up. So the file that matters most in my setup is `CLAUDE.md`, which Claude Code reads at the start of every session.

Mine answers the questions it would otherwise wake me up for:

```markdown
- When I ask you to build, fix, or change something: commit and deploy it.
  Don't ask "want me to commit?". That question is already answered.
- Run the code review on every diff before committing. Fix what it finds.
- Never tell me something works unless you've actually run it.
- No em dashes, ever. Run user-facing copy through the humanizer.
```

Every line there exists because I got asked the same thing more than once. Write down the answer and you never get asked again.

Go through your last week of sessions. Every time it stopped to check with you, ask yourself whether you'd ever have said no. If you wouldn't, that's a line for your `CLAUDE.md`.

## 2. Give it a goal, not a task

Claude Code's `/goal` command takes a condition and keeps the session going until that condition is true, instead of stopping when the agent decides it's done. Mine was basically "the portfolio is redesigned, built end to end, and live on all three domains." It kept going until that was true, even when some step along the way would normally have been a natural place to pause.

The trick is writing a condition you can check. "Make the site better" never finishes. "Live on all three domains, tests passing" does.

## 3. Turn your repeated asks into skills

I didn't start with skills. I noticed I kept typing the same paragraphs: review this diff before you commit, take out the AI-sounding phrases, use this browser tool and not that one.

Each of those is now a skill, a small instruction file the agent loads when the task matches. My code review skill runs on every diff. My humanizer skill runs on every piece of copy. Neither needs me to remember it.

The easiest way to find yours is to ask the agent at the end of a long week: "What do I keep asking you to do? Turn the top three into skills." You'll recognise every one.

## 4. Spend the tokens on checking, not writing

Most of the useful work that night was checking code, not writing it.

The agent caught its own bugs because it was told to look:

- A screenshot showed a chat bubble squashed into a 40px column. It traced it to two components sharing a class name and renamed one.
- A test for the little game in the corner of my site failed because the autopilot kept flying into the top of every gap. It worked out that the physics were fine and the test pilot was aiming too high.
- The code review flagged that a link filter would wave through `//evil.com` as if it were a page on my site. It fixed it and added a test.

Code is cheap to generate now, so I'd rather spend tokens on tests, a real browser, screenshots at phone width and a review pass. The more of that happens before I look, the less time I spend reviewing.

## 5. Hand it the problem, not your solution

When my friend's laptop blocked my site, my instinct was "add some security headers." If I'd typed that, I'd have got security headers and the site would still be blocked.

I described the problem instead, and the agent checked the domain's registration date, Google Safe Browsing and the live response headers. The real cause was that corporate filters block domains that are new and have never been categorized. Headers help, but the actual fix was submitting the site to the filter vendors, which it told me to do.

If I'd given it my guess, it would have done my guess.

## 6. Keep talking while it works

You don't have to wait for it to finish. Through the morning I kept sending small messages while it was mid-task: colour the pixel icons, take one project off the home page, pull all my posts over from Hashnode. It finished what it was doing, then picked each one up in order.

This worked because each request was one small, clear change.

## 7. Parallel is for independent work

You'll see people running ten agents at once, each in its own git worktree, each opening a pull request. That works when the tasks don't touch each other: a bug here, a docs fix there.

A redesign isn't that. Every page shares the same styles, fonts and components. Split that across five agents and you'll spend your morning merging five slightly different ideas of what the site looks like. I used one long session for the redesign and save parallel agents for piles of small, separate fixes.

## What it still needed me for

It still needed me for a few things, and the morning showed which ones:

- **Taste.** I asked for a game like Chrome's offline dinosaur, and it started planning a runner. My mascot is a tota, a parrot. Totas fly, they don't run on the road. One message and it built a flying game instead.
- **Facts only I know.** It put one of my old jobs in the wrong year, because that's the year I'd given it. I corrected it in one line.
- **Anything with my name on it in public.** It wrote the posts and the covers, but it didn't post to X or Hashnode. That's my account and my call.
- **Deleting things.** I took two unfinished drafts off my blog myself. It noticed and updated its tests around my change instead of putting them back.

So the agent did the volume, and I handled taste, facts and anything public. I'm happy with that split.

## Where tokens get wasted

- Watching it work. If it's going to take twenty minutes, go do something else.
- Vague goals that can never be checked off.
- No tests, so every change needs your eyes.
- Asking "what do you think?" instead of "what's wrong with this?" It tends to agree with you. Ask for the flaws.
- Leaving your limit unspent the day before it resets.

One thing I'm deliberately leaving out: stacking accounts and routing traffic through proxies so the provider can't tell. Some of what's going around is against the terms, and I'd rather not lose my account over a weekly limit.

## The checklist

- [ ] `CLAUDE.md` answers the questions it keeps asking you.
- [ ] Commit, test and deploy rules are written down, so it never waits on you.
- [ ] Big work goes in as a `/goal` with a condition you can check.
- [ ] Your three most repeated instructions are now skills.
- [ ] Every change gets tests, a real browser check and a review before you see it.
- [ ] You describe problems, not your guess at the fix.
- [ ] Parallel agents only for work that doesn't overlap.
- [ ] Taste, facts about you and anything public stay with you.
- [ ] You check your limit the day before it resets.

Start with the first line. Next time it stops to ask you something, write the answer into `CLAUDE.md` before you reply.
