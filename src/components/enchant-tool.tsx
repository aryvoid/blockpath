import { useMemo, useState } from "react";
import {
  ITEMS,
  ITEM_GROUPS,
  enchantsFor,
  suggestOrder,
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
    <div className="flex flex-col gap-5">
      <p className="text-sm leading-relaxed text-muted">
        Pick a tool / weapon / armor, see every valid enchantment, toggle what you
        want, and get a sensible anvil combine order (avoid &quot;Too Expensive&quot;).
      </p>

      {/* Grouped item picker */}
      <div className="flex flex-col gap-3">
        {ITEM_GROUPS.map((group) => (
          <div key={group.title}>
            <h4 className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted/80">
              {group.title}
            </h4>
            <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-4">
              {group.ids.map((id) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => onItem(id)}
                  className={cn(
                    "flex h-9 items-center justify-center rounded-lg px-1.5 text-center text-[11px] font-medium leading-tight transition sm:h-8 sm:text-xs",
                    item === id
                      ? "bg-accent text-bg shadow-sm"
                      : "bg-bg/50 text-muted hover:bg-bg hover:text-fg",
                  )}
                >
                  {LABEL_BY_ID[id]}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Enchant list */}
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
                  "flex w-full flex-col rounded-xl border px-3.5 py-3 text-left transition",
                  on
                    ? "border-accent/70 bg-accent/15 shadow-[0_0_0_1px_rgba(143,219,122,0.15)]"
                    : blocked
                      ? "cursor-not-allowed border-border/30 bg-bg/15 opacity-45"
                      : "border-border/50 bg-bg/35 hover:border-border hover:bg-bg/50",
                )}
              >
                <span className="flex items-center justify-between gap-3">
                  <span className="text-sm font-semibold text-fg">
                    {e.name}{" "}
                    <span className="font-mono text-xs font-normal text-muted">
                      I–{roman(e.max)}
                    </span>
                  </span>
                  <span
                    className={cn(
                      "shrink-0 rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                      on
                        ? "bg-accent/25 text-accent"
                        : blocked
                          ? "bg-bg/40 text-muted"
                          : "bg-bg/60 text-muted",
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
        <div className="rounded-2xl border border-border/80 bg-bg/50 p-4">
          <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted">
            Suggested anvil order
          </h3>
          <ol className="mt-2.5 list-decimal space-y-1.5 pl-4 text-sm">
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
