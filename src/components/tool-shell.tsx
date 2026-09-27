import { useState } from "react";
import { Calculator } from "@/components/calculator";
import { GradientTool } from "@/components/gradient-tool";
import { EnchantTool } from "@/components/enchant-tool";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { cn } from "@/lib/utils";

type Tab = "distance" | "gradient" | "enchants";

const TABS: { id: Tab; label: string }[] = [
  { id: "distance", label: "Distance" },
  { id: "gradient", label: "Name gradient" },
  { id: "enchants", label: "Enchants" },
];

export function ToolShell() {
  const [tab, setTab] = useState<Tab>("distance");

  return (
    <div className="relative z-10 mx-auto flex min-h-dvh max-w-3xl flex-col gap-5 px-4 py-8 sm:px-6">
      <header className="text-center">
        <h1 className="title-glow text-3xl font-bold tracking-tight text-fg sm:text-4xl">
          Blockpath
        </h1>
        <p className="mt-1.5 text-sm text-muted">
          Minecraft tools — distance · gradient names · enchant planner
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
            onClick={() => setTab(t.id)}
            className={cn(
              "min-w-[5.5rem] flex-1 rounded-xl px-3 py-2.5 text-sm font-semibold transition sm:flex-none sm:px-5",
              tab === t.id
                ? "accent-pill"
                : "elevated bg-bg/40 text-muted hover:bg-bg/60 hover:text-fg",
            )}
          >
            {t.label}
          </button>
        ))}
      </nav>

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
    </div>
  );
}
