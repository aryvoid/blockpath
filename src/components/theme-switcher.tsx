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
    <div className="inline-flex flex-wrap justify-center gap-1 rounded-xl border border-border/60 bg-card/50 p-1">
      {THEMES.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={() => onPick(t.id)}
          className={cn(
            "rounded-lg px-3 py-1 text-[11px] font-semibold transition",
            id === t.id
              ? "bg-accent text-bg shadow-sm"
              : "text-muted hover:bg-bg/60 hover:text-fg",
          )}
          title={`${t.label} theme`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
