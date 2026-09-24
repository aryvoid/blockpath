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
    <div className="flex flex-wrap justify-center gap-1.5">
      {THEMES.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={() => onPick(t.id)}
          className={cn(
            "rounded-lg px-2.5 py-1 text-[11px] font-semibold transition",
            id === t.id
              ? "bg-accent text-bg"
              : "bg-bg/40 text-muted hover:bg-bg/70 hover:text-fg",
          )}
          title={`${t.label} theme`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
