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
    <div className="relative z-10 mx-auto flex min-h-dvh max-w-3xl flex-col gap-4 px-4 py-8 sm:px-6">
      <header className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-fg drop-shadow-sm sm:text-4xl">
          Blockpath
        </h1>
        <p className="mt-1.5 text-sm text-muted">
          Minecraft tools — distance · gradient names · enchant planner
        </p>
        <div className="mt-3">
          <ThemeSwitcher />
        </div>
      </header>

      <nav className="flex flex-wrap justify-center gap-1.5 rounded-2xl border border-border/80 bg-card/70 p-1.5 shadow-xl backdrop-blur-md">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={cn(
              "rounded-xl px-4 py-2 text-sm font-semibold transition",
              tab === t.id
                ? "bg-accent text-bg"
                : "text-muted hover:bg-bg/50 hover:text-fg",
            )}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {tab === "distance" && <Calculator embedded />}
      {tab === "gradient" && (
        <section className="rounded-2xl border border-border/80 bg-card/70 p-4 shadow-xl backdrop-blur-md">
          <GradientTool />
        </section>
      )}
      {tab === "enchants" && (
        <section className="rounded-2xl border border-border/80 bg-card/70 p-4 shadow-xl backdrop-blur-md">
          <EnchantTool />
        </section>
      )}
    </div>
  );
}
