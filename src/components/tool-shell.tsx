import { useEffect, useState } from "react";
import { Calculator } from "@/components/calculator";
import { GradientTool } from "@/components/gradient-tool";
import { EnchantTool } from "@/components/enchant-tool";
import { XpTool } from "@/components/xp-tool";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { cn } from "@/lib/utils";
import { readTab, writeTab, type TabId } from "@/lib/url-state";

const TABS: { id: TabId; label: string; key: string }[] = [
  { id: "distance", label: "Distance", key: "1" },
  { id: "gradient", label: "Name gradient", key: "2" },
  { id: "enchants", label: "Enchants", key: "3" },
  { id: "xp", label: "XP", key: "4" },
];

export function ToolShell() {
  const [tab, setTab] = useState<TabId>("distance");

  useEffect(() => {
    setTab(readTab());
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const hit = TABS.find((t) => t.key === e.key);
      if (hit) {
        e.preventDefault();
        setTab(hit.id);
        writeTab(hit.id);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const onTab = (id: TabId) => {
    setTab(id);
    writeTab(id);
  };

  return (
    <div className="relative z-10 mx-auto flex min-h-dvh max-w-3xl flex-col gap-5 px-4 py-8 sm:px-6">
      <header className="text-center">
        <h1 className="title-glow text-3xl font-bold tracking-tight text-fg sm:text-4xl">
          Blockpath
        </h1>
        <p className="mt-1.5 text-sm text-muted">
          Minecraft tools — distance · gradients · enchants · XP
        </p>
        <div className="mt-4">
          <ThemeSwitcher />
        </div>
      </header>

      <nav className="glass-card flex flex-wrap justify-center gap-1 rounded-2xl p-1.5">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => onTab(t.id)}
            title={`${t.label} (${t.key})`}
            className={cn(
              "min-w-[4.5rem] flex-1 rounded-xl px-2.5 py-2.5 text-sm font-semibold transition-all duration-200 sm:flex-none sm:px-4",
              tab === t.id
                ? "accent-pill"
                : "elevated bg-bg/40 text-muted hover:bg-bg/60 hover:text-fg",
            )}
          >
            {t.label}
          </button>
        ))}
      </nav>

      <div key={tab} className="animate-in fade-in duration-200">
        {tab === "distance" && <Calculator embedded />}
        {tab === "gradient" && (
          <section className="glass-card rounded-2xl p-4 sm:p-5">
            <GradientTool />
          </section>
        )}
        {tab === "enchants" && (
          <section className="glass-card rounded-2xl p-4 sm:p-5">
            <EnchantTool />
          </section>
        )}
        {tab === "xp" && (
          <section className="glass-card rounded-2xl p-4 sm:p-5">
            <XpTool />
          </section>
        )}
      </div>

      <p className="pb-2 text-center text-[10px] text-muted/60">
        Keys 1–4 switch tools · coords stay in your browser
      </p>
    </div>
  );
}
