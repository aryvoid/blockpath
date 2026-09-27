/** Lightweight URL query helpers (no router dependency). */

export type TabId = "distance" | "gradient" | "enchants";

const TAB_IDS: TabId[] = ["distance", "gradient", "enchants"];

export function readTab(): TabId {
  if (typeof window === "undefined") return "distance";
  const t = new URLSearchParams(window.location.search).get("tab");
  if (t && TAB_IDS.includes(t as TabId)) return t as TabId;
  return "distance";
}

export function writeTab(tab: TabId) {
  if (typeof window === "undefined") return;
  const url = new URL(window.location.href);
  if (tab === "distance") url.searchParams.delete("tab");
  else url.searchParams.set("tab", tab);
  window.history.replaceState({}, "", url.toString());
}

export function readCoordsFromUrl(): { from?: string; to?: string } {
  if (typeof window === "undefined") return {};
  const p = new URLSearchParams(window.location.search);
  return {
    from: p.get("from") ?? undefined,
    to: p.get("to") ?? undefined,
  };
}

export function writeCoordsToUrl(from: string, to: string) {
  if (typeof window === "undefined") return;
  const url = new URL(window.location.href);
  if (from.trim()) url.searchParams.set("from", from.trim());
  else url.searchParams.delete("from");
  if (to.trim()) url.searchParams.set("to", to.trim());
  else url.searchParams.delete("to");
  window.history.replaceState({}, "", url.toString());
}

export function buildShareUrl(from: string, to: string): string {
  const url = new URL(window.location.origin + window.location.pathname);
  url.searchParams.set("tab", "distance");
  if (from.trim()) url.searchParams.set("from", from.trim());
  if (to.trim()) url.searchParams.set("to", to.trim());
  return url.toString();
}

export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      return ok;
    } catch {
      return false;
    }
  }
}
