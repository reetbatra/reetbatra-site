"use client";

import { useSyncExternalStore } from "react";
import type { Ink } from "@/lib/portrait";

const DARK = "(prefers-color-scheme: dark)";

/** The theme actually showing: a saved choice if there is one, otherwise the system's. */
export function currentTheme(): Ink {
  const set = document.documentElement.getAttribute("data-theme");
  if (set === "light" || set === "dark") return set;
  return window.matchMedia(DARK).matches ? "dark" : "light";
}

export function setTheme(t: Ink) {
  document.documentElement.setAttribute("data-theme", t);
  try {
    localStorage.setItem("theme", t);
  } catch {
    // Private mode or blocked storage: the choice lasts for this page view only, which is fine.
  }
}

function subscribe(onChange: () => void) {
  const mq = window.matchMedia(DARK);
  mq.addEventListener("change", onChange);
  const mo = new MutationObserver(onChange);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => {
    mq.removeEventListener("change", onChange);
    mo.disconnect();
  };
}

export function useTheme(): Ink {
  return useSyncExternalStore(subscribe, currentTheme, () => "light");
}
