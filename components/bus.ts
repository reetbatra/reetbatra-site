"use client";

// Keys are handled in one place (Chrome) and the page parts listen for what they care about.
type Events = {
  "egg:open": undefined;
};

export function emit<K extends keyof Events>(name: K, detail?: Events[K]) {
  window.dispatchEvent(new CustomEvent(name, { detail }));
}

export function on<K extends keyof Events>(name: K, fn: (detail: Events[K]) => void) {
  const handler = (e: Event) => fn((e as CustomEvent<Events[K]>).detail);
  window.addEventListener(name, handler);
  return () => window.removeEventListener(name, handler);
}

export const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
