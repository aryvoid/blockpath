import { useMemo, useState } from "react";

function lerp(a: number, b: number, t: number) {
  return Math.round(a + (b - a) * t);
}

function hexToRgb(hex: string) {
  const h = hex.replace("#", "").padEnd(6, "0").slice(0, 6);
  return {
    r: parseInt(h.slice(0, 2), 16) || 0,
    g: parseInt(h.slice(2, 4), 16) || 0,
    b: parseInt(h.slice(4, 6), 16) || 0,
  };
}

function rgbToHex(r: number, g: number, b: number) {
  return [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("");
}

export function GradientTool() {
  const [text, setText] = useState("CuteSMP");
  const [c1, setC1] = useState("#ff6bcb");
  const [c2, setC2] = useState("#6bcbff");
  const [c3, setC3] = useState("#");
  const [bold, setBold] = useState(false);
  const [copied, setCopied] = useState("");

  const colors = useMemo(() => {
    const list = [c1, c2];
    if (/^#[0-9a-fA-F]{6}$/.test(c3)) list.push(c3);
    return list;
  }, [c1, c2, c3]);

  const miniMessage = useMemo(() => {
    const stops = colors.map((c) => c.toLowerCase()).join(":");
    const inner = bold ? `<bold>${text}</bold>` : text;
    return `<gradient:${stops}>${inner}</gradient>`;
  }, [text, colors, bold]);

  const perCharEssentials = useMemo(() => {
    const chars = [...text];
    if (chars.length === 0) return "";
    const rgbs = colors.map(hexToRgb);
    return chars
      .map((ch, i) => {
        const t = chars.length === 1 ? 0 : i / (chars.length - 1);
        // multi-stop linear
        const seg = t * (rgbs.length - 1);
        const i0 = Math.floor(seg);
        const i1 = Math.min(i0 + 1, rgbs.length - 1);
        const lt = seg - i0;
        const r = lerp(rgbs[i0].r, rgbs[i1].r, lt);
        const g = lerp(rgbs[i0].g, rgbs[i1].g, lt);
        const b = lerp(rgbs[i0].b, rgbs[i1].b, lt);
        const hex = rgbToHex(r, g, b);
        return `&#${hex}${bold ? "&l" : ""}${ch}`;
      })
      .join("");
  }, [text, colors, bold]);

  const previewStyle = useMemo(() => {
    const stops = colors.join(", ");
    return {
      backgroundImage: `linear-gradient(90deg, ${stops})`,
      WebkitBackgroundClip: "text",
      backgroundClip: "text",
      color: "transparent",
      fontWeight: bold ? 700 : 500,
    } as const;
  }, [colors, bold]);

  const copy = async (label: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(label);
      setTimeout(() => setCopied(""), 1500);
    } catch {
      setCopied("fail");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted">
        CuteSMP / modern SMPs often block normal § codes — use a{" "}
        <span className="text-accent">gradient tag</span> (MiniMessage). Paste the
        code into nick / tag plugins that support it.
      </p>

      <label className="flex flex-col gap-1.5">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-muted">Name / text</span>
        <input
          value={text}
          onChange={(e) => setText(e.target.value.slice(0, 32))}
          className="rounded-xl border border-border bg-bg/80 px-3.5 py-2.5 font-mono text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
          placeholder="Your name"
        />
      </label>

      <div className="grid grid-cols-3 gap-3">
        {([
          ["Color 1", c1, setC1],
          ["Color 2", c2, setC2],
          ["Color 3 (opt)", c3 === "#" ? "#ffffff" : c3, (v: string) => setC3(v)],
        ] as const).map(([label, val, set]) => (
          <label key={label} className="flex flex-col gap-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted">{label}</span>
            <input
              type="color"
              value={val.startsWith("#") ? val : `#${val}`}
              onChange={(e) => set(e.target.value)}
              className="h-10 w-full cursor-pointer rounded-xl border border-border bg-bg/80"
            />
          </label>
        ))}
      </div>

      <label className="flex items-center gap-2 text-sm text-muted">
        <input type="checkbox" checked={bold} onChange={(e) => setBold(e.target.checked)} className="accent-[var(--color-accent)]" />
        Bold
      </label>

      <div className="rounded-2xl border border-border/80 bg-bg/50 px-4 py-6 text-center">
        <div className="text-[11px] uppercase tracking-wider text-muted">Preview</div>
        <div className="mt-2 text-3xl tracking-wide" style={previewStyle}>
          {text || "Preview"}
        </div>
      </div>

      <OutputRow
        title="MiniMessage gradient (CuteSMP / Paper)"
        value={miniMessage}
        copied={copied === "mm"}
        onCopy={() => copy("mm", miniMessage)}
      />
      <OutputRow
        title="Per-character &#hex (Essentials-style)"
        value={perCharEssentials}
        copied={copied === "hex"}
        onCopy={() => copy("hex", perCharEssentials)}
      />
    </div>
  );
}

function OutputRow({
  title,
  value,
  copied,
  onCopy,
}: {
  title: string;
  value: string;
  copied: boolean;
  onCopy: () => void;
}) {
  return (
    <div className="rounded-xl border border-border/60 bg-bg/40 p-3">
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-muted">{title}</span>
        <button
          type="button"
          onClick={onCopy}
          className="rounded-lg bg-accent px-2.5 py-1 text-xs font-semibold text-bg hover:bg-accent-dim"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <code className="block break-all font-mono text-xs text-fg">{value || "—"}</code>
    </div>
  );
}
