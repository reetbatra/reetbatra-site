import { NextResponse, type NextRequest } from "next/server";
import { siteFromHost } from "./lib/sites.ts";

// Every page lives under app/[site]/. The visitor never sees that segment: the host picks it.
// devrel.reetbatra.com/work is served from /devrel/work, reetbatra.com/work from /home/work.
// Typing /devrel on reetbatra.com becomes /home/devrel, which doesn't exist, so one page can't
// be reached from another's domain.
export function proxy(request: NextRequest) {
  const site = siteFromHost(request.headers.get("host"));
  const url = request.nextUrl.clone();
  url.pathname = `/${site}${url.pathname === "/" ? "" : url.pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  // Skip Next internals, metadata files (the OG image route already carries its segment) and anything with an extension (portrait.png, resume.pdf).
  matcher: ["/((?!_next/|icon|apple-icon|favicon|robots|.*opengraph-image|.*\\..*).*)"],
};
