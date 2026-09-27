import { useEffect, useState } from "react";
import { THEMES, applyTheme, loadTheme, type ThemeId } from "@/lib/theme";
import { cn } from "@/lib/utils";

export function ThemeSwitcher() {
  const [id, setId] = useState<ThemeId>("overworld");

  useEffect(() => {
    const t = loadTheme();
    setId(t);
    applyTheme(t);
  }, []);

  const onPick = (next: ThemeId) => {
    setId(next);
    applyTheme(next);
  };

  return (
    <div className="glass-card inline-flex flex-wrap justify-center gap-1 rounded-2xl p-1.5">
      {THEMES.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={() => onPick(t.id)}
          className={cn(
            "rounded-xl px-3.5 py-1.5 text-[11px] font-semibold transition",
            id === t.id
              ? "accent-pill"
              : "elevated bg-bg/35 text-muted hover:bg-bg/55 hover:text-fg",
          )}
          title={`${t.label} theme`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
