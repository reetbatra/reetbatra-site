import { test } from "node:test";
import assert from "node:assert/strict";
import { isSiteId, siteFromHost } from "./sites.ts";

test("production hosts map to their page", () => {
  assert.equal(siteFromHost("reetbatra.com"), "home");
  assert.equal(siteFromHost("www.reetbatra.com"), "home");
  assert.equal(siteFromHost("devrel.reetbatra.com"), "devrel");
  assert.equal(siteFromHost("fde.reetbatra.com"), "fde");
});

test("local and preview hosts map the same way", () => {
  assert.equal(siteFromHost("localhost:3000"), "home");
  assert.equal(siteFromHost("devrel.localhost:3000"), "devrel");
  assert.equal(siteFromHost("fde.localhost:3000"), "fde");
  assert.equal(siteFromHost("reetbatra-site.vercel.app"), "home");
  assert.equal(siteFromHost("reetbatra-site-devrel.vercel.app"), "devrel");
  assert.equal(siteFromHost("reetbatra-site-fde.vercel.app"), "fde");
});

test("host matching ignores case, port and whitespace", () => {
  assert.equal(siteFromHost(" DevRel.ReetBatra.com:443 "), "devrel");
  assert.equal(siteFromHost("FDE.localhost"), "fde");
});

test("a host that only contains the word somewhere else is not that page", () => {
  // Only the first label counts, so a deep path or a lookalike domain can't switch pages.
  assert.equal(siteFromHost("reetbatra.com.devrel.evil.com"), "home");
  assert.equal(siteFromHost("devrelx.reetbatra.com"), "home");
  assert.equal(siteFromHost("fdep.reetbatra.com"), "home");
  assert.equal(siteFromHost("reetbatra-site-git-fde-branch.vercel.app"), "home");
});

test("a missing host falls back to home", () => {
  assert.equal(siteFromHost(null), "home");
  assert.equal(siteFromHost(undefined), "home");
  assert.equal(siteFromHost(""), "home");
});

test("isSiteId only accepts the three pages", () => {
  assert.ok(isSiteId("home"));
  assert.ok(isSiteId("devrel"));
  assert.ok(isSiteId("fde"));
  assert.ok(!isSiteId("work"));
  assert.ok(!isSiteId("Home"));
});
