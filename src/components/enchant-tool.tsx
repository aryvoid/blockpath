import { useMemo, useState } from "react";
import {
  ITEMS,
  ITEM_GROUPS,
  ENCHANT_PRESETS,
  enchantsFor,
  suggestOrder,
  estimateAnvilCost,
  type Enchant,
  type ItemId,
} from "@/lib/enchants";
import { cn } from "@/lib/utils";

const LABEL_BY_ID = Object.fromEntries(ITEMS.map((it) => [it.id, it.label])) as Record<
  ItemId,
  string
>;

export function EnchantTool() {
  const [item, setItem] = useState<ItemId>("sword");
  const [picked, setPicked] = useState<Set<string>>(new Set());

  const list = useMemo(() => enchantsFor(item), [item]);
  const selected = useMemo(() => list.filter((e) => picked.has(e.id)), [list, picked]);
  const conflictIds = useMemo(() => {
    const blocked = new Set<string>();
    for (const e of selected) e.conflicts?.forEach((c) => blocked.add(c));
    return blocked;
  }, [selected]);
  const steps = useMemo(() => suggestOrder(selected), [selected]);
  const cost = useMemo(() => estimateAnvilCost(selected), [selected]);
  const presetsForItem = useMemo(() => ENCHANT_PRESETS.filter((p) => p.item === item), [item]);

  const toggle = (e: Enchant) => {
    setPicked((prev) => {
      const next = new Set(prev);
      if (next.has(e.id)) {
        next.delete(e.id);
        return next;
      }
      e.conflicts?.forEach((c) => next.delete(c));
      for (const other of list) {
        if (other.conflicts?.includes(e.id)) next.delete(other.id);
      }
      next.add(e.id);
      return next;
    });
  };

  const onItem = (id: ItemId) => {
    setItem(id);
    setPicked(new Set());
  };

  const applyPreset = (enchantIds: string[]) => {
    const valid = new Set(list.map((e) => e.id));
    setPicked(new Set(enchantIds.filter((id) => valid.has(id))));
  };

  return (
    <div className="flex flex-col gap-5">
      <p className="text-sm leading-relaxed text-muted">
        Pick a tool / weapon / armor, see every valid enchantment, toggle what you
        want, and get a sensible anvil combine order (avoid "Too Expensive").
      </p>

      <div className="flex flex-col gap-3.5">
        {ITEM_GROUPS.map((group) => (
          <div key={group.title}>
            <h4 className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted/75">
              {group.title}
            </h4>
            <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-4">
              {group.ids.map((id) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => onItem(id)}
                  className={cn(
                    "flex h-9 items-center justify-center rounded-xl px-1.5 text-center text-[11px] font-medium leading-tight transition-all duration-150 sm:h-8 sm:text-xs",
                    item === id ? "accent-pill" : "elevated bg-bg/45 text-muted hover:bg-bg/65 hover:text-fg",
                  )}
                >
                  {LABEL_BY_ID[id]}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {presetsForItem.length > 0 && (
        <div>
          <h4 className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted/75">Presets</h4>
          <div className="flex flex-wrap gap-1.5">
            {presetsForItem.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => applyPreset(p.enchantIds)}
                className="elevated rounded-xl bg-bg/45 px-3 py-1.5 text-[11px] font-semibold text-muted transition hover:bg-bg/65 hover:text-fg"
              >
                {p.label}
              </button>
            ))}
            {picked.size > 0 && (
              <button type="button" onClick={() => setPicked(new Set())} className="rounded-xl px-3 py-1.5 text-[11px] font-semibold text-muted/80 hover:text-fg">
                Clear
              </button>
            )}
          </div>
        </div>
      )}

      <ul className="flex flex-col gap-2">
        {list.map((e) => {
          const on = picked.has(e.id);
          const blocked = !on && conflictIds.has(e.id);
          return (
            <li key={e.id}>
              <button
                type="button"
                disabled={blocked}
                onClick={() => toggle(e)}
                className={cn(
                  "flex w-full flex-col rounded-2xl border px-3.5 py-3 text-left transition-all duration-150",
                  on
                    ? "border-accent/50 bg-accent/12 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_0_0_1px_color-mix(in_srgb,var(--color-accent)_25%,transparent),0_4px_16px_color-mix(in_srgb,var(--color-accent)_12%,transparent)]"
                    : blocked
                      ? "cursor-not-allowed border-border/25 bg-bg/15 opacity-40"
                      : "elevated border-border/50 bg-bg/30 hover:border-border hover:bg-bg/45",
                )}
              >
                <span className="flex items-center justify-between gap-3">
                  <span className="text-sm font-semibold text-fg">
                    {e.name}{" "}
                    <span className="font-mono text-xs font-normal text-muted">I–{roman(e.max)}</span>
                  </span>
                  <span
                    className={cn(
                      "shrink-0 rounded-lg px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                      on ? "bg-accent/25 text-accent" : blocked ? "bg-bg/40 text-muted" : "bg-bg/50 text-muted",
                    )}
                  >
                    {on ? "On" : blocked ? "Conflict" : "Off"}
                  </span>
                </span>
                <span className="mt-1 text-xs leading-snug text-muted">{e.desc}</span>
              </button>
            </li>
          );
        })}
      </ul>

      {selected.length > 0 && (
        <div className="glass-card flex flex-col gap-4 rounded-2xl p-4">
          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted">Rough anvil cost</h3>
            <p className="mt-1.5 text-sm">
              <span className={cn("font-mono text-lg font-bold", cost.tooExpensive ? "text-warn" : "text-fg")}>
                ~{cost.levels} levels
              </span>
              {cost.tooExpensive && (
                <span className="ml-2 text-xs font-semibold text-warn">Too Expensive risk</span>
              )}
            </p>
            <p className="mt-1 text-xs text-muted">{cost.note}</p>
          </div>
          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted">Suggested anvil order</h3>
            <ol className="mt-2.5 list-decimal space-y-1.5 pl-4 text-sm">
              {steps.map((s, i) => (
                <li key={i} className="text-muted">
                  <span className="text-fg">{s}</span>
                </li>
              ))}
            </ol>
            <p className="mt-3 text-xs text-muted">
              Selected: {selected.map((e) => `${e.name} ${roman(e.max)}`).join(", ")}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function roman(n: number) {
  return ["", "I", "II", "III", "IV", "V"][n] ?? String(n);
}
