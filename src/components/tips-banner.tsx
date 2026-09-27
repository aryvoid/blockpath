import { useEffect, useState } from "react";

const KEY = "blockpath-tips-dismissed";

const TIPS = [
  "Paste F3 coords or type x y z — both fields need valid numbers.",
  "Share link copies a URL with your From/To so friends open the same route.",
  "Nether pairing ÷8 on X/Z. Build portals near the linked coords to connect bases.",
  "Keys 1–4 switch tools. Enchants presets avoid conflicts for you.",
  "XP tab: L0→30 is classic enchanting setup; L0→39 is max anvil without Too Expensive.",
];

export function TipsBanner() {
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem(KEY) === "1") return;
    setOpen(true);
    setIdx(Math.floor(Math.random() * TIPS.length));
  }, []);

  if (!open) return null;

  return (
    <div className="glass-card flex items-start gap-3 rounded-2xl p-3.5">
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-accent">Tip</p>
        <p className="mt-0.5 text-sm leading-snug text-muted">{TIPS[idx]}</p>
        <button
          type="button"
          onClick={() => setIdx((i) => (i + 1) % TIPS.length)}
          className="mt-1.5 text-[11px] font-semibold text-accent hover:underline"
        >
          Next tip
        </button>
      </div>
      <button
        type="button"
        onClick={() => {
          setOpen(false);
          localStorage.setItem(KEY, "1");
        }}
        className="shrink-0 rounded-lg px-2 py-1 text-xs text-muted hover:text-fg"
        aria-label="Dismiss tips"
      >
        ✕
      </button>
    </div>
  );
}
