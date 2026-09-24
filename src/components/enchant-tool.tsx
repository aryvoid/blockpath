import { useMemo, useState } from "react";
import {
  ITEMS,
  enchantsFor,
  suggestOrder,
  type Enchant,
  type ItemId,
} from "@/lib/enchants";
import { cn } from "@/lib/utils";

export function EnchantTool() {
  const [item, setItem] = useState<ItemId>("sword");
  const [picked, setPicked] = useState<Set<string>>(new Set());

  const list = useMemo(() => enchantsFor(item), [item]);

  const selected = useMemo(
    () => list.filter((e) => picked.has(e.id)),
    [list, picked],
  );

  const conflictIds = useMemo(() => {
    const blocked = new Set<string>();
    for (const e of selected) {
      e.conflicts?.forEach((c) => blocked.add(c));
    }
    return blocked;
  }, [selected]);

  const steps = useMemo(() => suggestOrder(selected), [selected]);

  const toggle = (e: Enchant) => {
    setPicked((prev) => {
      const next = new Set(prev);
      if (next.has(e.id)) {
        next.delete(e.id);
        return next;
      }
      // remove conflicts
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

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted">
        Pick a tool / weapon / armor, see every valid enchantment, toggle what you
        want, and get a sensible anvil combine order (avoid "Too Expensive").
      </p>

      <div className="flex flex-wrap gap-1.5">
        {ITEMS.map((it) => (
          <button
            key={it.id}
            type="button"
            onClick={() => onItem(it.id)}
            className={cn(
              "rounded-lg px-2.5 py-1 text-xs font-medium transition",
              item === it.id
                ? "bg-accent text-bg"
                : "bg-bg/50 text-muted hover:bg-bg hover:text-fg",
            )}
          >
            {it.label}
          </button>
        ))}
      </div>

      <ul className="flex flex-col gap-1.5">
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
                  "flex w-full flex-col rounded-xl border px-3 py-2.5 text-left transition",
                  on
                    ? "border-accent/60 bg-accent/15"
                    : blocked
                      ? "cursor-not-allowed border-border/40 bg-bg/20 opacity-40"
                      : "border-border/60 bg-bg/40 hover:border-border",
                )}
              >
                <span className="flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold text-fg">
                    {e.name}{" "}
                    <span className="font-mono text-xs text-muted">I–{roman(e.max)}</span>
                  </span>
                  <span className="text-xs text-muted">{on ? "Selected" : blocked ? "Conflict" : "Tap"}</span>
                </span>
                <span className="mt-0.5 text-xs text-muted">{e.desc}</span>
              </button>
            </li>
          );
        })}
      </ul>

      {selected.length > 0 && (
        <div className="rounded-2xl border border-border/80 bg-bg/50 p-4">
          <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted">
            Suggested anvil order
          </h3>
          <ol className="mt-2 list-decimal space-y-1.5 pl-4 text-sm text-fg">
            {steps.map((s, i) => (
              <li key={i} className="text-muted">
                <span className="text-fg">{s}</span>
              </li>
            ))}
          </ol>
          <p className="mt-3 text-xs text-muted">
            Selected:{" "}
            {selected.map((e) => `${e.name} ${roman(e.max)}`).join(", ")}
          </p>
        </div>
      )}
    </div>
  );
}

function roman(n: number) {
  return ["", "I", "II", "III", "IV", "V"][n] ?? String(n);
}
