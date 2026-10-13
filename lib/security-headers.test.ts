import { test } from "node:test";
import assert from "node:assert/strict";
import { contentSecurityPolicy, securityHeaders } from "./security-headers.ts";

const get = (dev: boolean, key: string) => securityHeaders(dev).find((h) => h.key === key)?.value ?? "";

test("production CSP blocks framing, plugins, eval and every third party origin", () => {
  const csp = contentSecurityPolicy(false);
  assert.match(csp, /frame-ancestors 'none'/);
  assert.match(csp, /object-src 'none'/);
  assert.match(csp, /base-uri 'self'/);
  assert.match(csp, /upgrade-insecure-requests/);
  assert.doesNotMatch(csp, /unsafe-eval/);
  assert.doesNotMatch(csp, /https?:|\*/, "no outside origins or wildcards");
});

test("dev CSP allows what the dev server needs, and only in dev", () => {
  assert.match(contentSecurityPolicy(true), /'unsafe-eval'/);
  assert.match(contentSecurityPolicy(true), /connect-src 'self' ws:/);
});

test("HSTS covers subdomains for two years, and the basics are all there", () => {
  assert.equal(get(false, "Strict-Transport-Security"), "max-age=63072000; includeSubDomains; preload");
  assert.equal(get(false, "X-Content-Type-Options"), "nosniff");
  assert.equal(get(false, "X-Frame-Options"), "DENY");
  assert.equal(get(false, "Referrer-Policy"), "strict-origin-when-cross-origin");
  assert.match(get(false, "Permissions-Policy"), /camera=\(\)/);
});
