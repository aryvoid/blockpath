export type ThemeId = "overworld" | "nether" | "end" | "light";

export const THEMES: {
  id: ThemeId;
  label: string;
  vars: Record<string, string>;
  themeColor: string;
}[] = [
  {
    id: "overworld",
    label: "Overworld",
    themeColor: "#0c1210",
    vars: {
      "--color-bg": "#0c1210",
      "--color-fg": "#f0f4f0",
      "--color-muted": "#9aab9c",
      "--color-card": "#141c18",
      "--color-border": "#2a3830",
      "--color-accent": "#8fdb7a",
      "--color-accent-dim": "#6fb85c",
      "--color-warn": "#e8c36a",
    },
  },
  {
    id: "nether",
    label: "Nether",
    themeColor: "#1a0a0a",
    vars: {
      "--color-bg": "#1a0a0a",
      "--color-fg": "#fde8e0",
      "--color-muted": "#c4a090",
      "--color-card": "#2a1210",
      "--color-border": "#5c2a22",
      "--color-accent": "#f97316",
      "--color-accent-dim": "#ea580c",
      "--color-warn": "#fbbf24",
    },
  },
  {
    id: "end",
    label: "End",
    themeColor: "#0f0a18",
    vars: {
      "--color-bg": "#0f0a18",
      "--color-fg": "#f3e8ff",
      "--color-muted": "#a78bba",
      "--color-card": "#1a1228",
      "--color-border": "#3b2a55",
      "--color-accent": "#c084fc",
      "--color-accent-dim": "#a855f7",
      "--color-warn": "#e9d5ff",
    },
  },
  {
    id: "light",
    label: "Light",
    themeColor: "#e8f0e8",
    vars: {
      "--color-bg": "#e8f0e8",
      "--color-fg": "#14201a",
      "--color-muted": "#5a6b5e",
      "--color-card": "#f4faf4",
      "--color-border": "#c5d4c8",
      "--color-accent": "#3d8b4f",
      "--color-accent-dim": "#2f6f3e",
      "--color-warn": "#b45309",
    },
  },
];

const KEY = "blockpath-theme";

export function loadTheme(): ThemeId {
  if (typeof window === "undefined") return "overworld";
  const v = localStorage.getItem(KEY) as ThemeId | null;
  if (v && THEMES.some((t) => t.id === v)) return v;
  return "overworld";
}

export function applyTheme(id: ThemeId) {
  const theme = THEMES.find((t) => t.id === id) ?? THEMES[0];
  const root = document.documentElement;
  root.dataset.theme = theme.id;
  root.style.colorScheme = id === "light" ? "light" : "dark";
  for (const [k, v] of Object.entries(theme.vars)) {
    root.style.setProperty(k, v);
  }
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", theme.themeColor);
  localStorage.setItem(KEY, id);
  window.dispatchEvent(new CustomEvent("blockpath-theme", { detail: id }));
}
