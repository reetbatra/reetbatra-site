"use client";

import { useSyncExternalStore } from "react";

const fmt = new Intl.DateTimeFormat("en-IN", { hour: "numeric", minute: "2-digit", hour12: true, timeZone: "Asia/Kolkata" });

function subscribe(onChange: () => void) {
  const id = setInterval(onChange, 15_000);
  return () => clearInterval(id);
}

/** The time where I am, "2:37 am". Renders nothing on the server so it never mismatches. */
export default function Clock({ prefix = "", suffix = "" }: { prefix?: string; suffix?: string }) {
  const now = useSyncExternalStore(
    subscribe,
    () => fmt.format(new Date()).toLowerCase().replace(/\s/g, " "),
    () => "",
  );
  if (!now) return null;
  return (
    <span className="clock">
      {prefix}
      <time>{now}</time>
      {suffix}
    </span>
  );
}
