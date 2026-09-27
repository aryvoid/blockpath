import { useMemo, useState } from "react";
import {
  totalXpForLevel,
  xpBetweenLevels,
  xpToNextLevel,
  levelFromXp,
  XP_SOURCES,
  formatXp,
} from "@/lib/xp";
import { cn } from "@/lib/utils";

export function XpTool() {
  const [fromLvl, setFromLvl] = useState(0);
  const [toLvl, setToLvl] = useState(30);
  const [rawXp, setRawXp] = useState("");

  const from = Math.max(0, Math.min(10000, Math.floor(Number(fromLvl) || 0)));
  const to = Math.max(0, Math.min(10000, Math.floor(Number(toLvl) || 0)));

  const needed = useMemo(() => xpBetweenLevels(from, to), [from, to]);
  const totalTo = useMemo(() => totalXpForLevel(to), [to]);
  const totalFrom = useMemo(() => totalXpForLevel(from), [from]);
  const nextBar = useMemo(() => xpToNextLevel(from), [from]);

  const parsedXp = useMemo(() => {
    const n = Number(rawXp);
    if (!Number.isFinite(n) || n < 0) return null;
    return Math.floor(n);
  }, [rawXp]);

  const levelOfXp = parsedXp != null ? levelFromXp(parsedXp) : null;

  return (
    <div className="flex flex-col gap-5">
      <p className="text-sm leading-relaxed text-muted">
        Java Edition XP math — how much experience you need between levels, and what
        common sources give.
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted">
            From level
          </span>
          <input
            type="number"
            min={0}
            max={10000}
            value={fromLvl}
            onChange={(e) => setFromLvl(Number(e.target.value))}
            className="rounded-xl border border-border bg-bg/80 px-3.5 py-2.5 font-mono text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted">
            To level
          </span>
          <input
            type="number"
            min={0}
            max={10000}
            value={toLvl}
            onChange={(e) => setToLvl(Number(e.target.value))}
            className="rounded-xl border border-border bg-bg/80 px-3.5 py-2.5 font-mono text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
          />
        </label>
      </div>

      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        <Metric label="XP needed" value={formatXp(needed)} />
        <Metric label="Total XP @ to" value={formatXp(totalTo)} />
        <Metric label="Total XP @ from" value={formatXp(totalFrom)} />
        <Metric label="Bar to next" value={formatXp(nextBar)} sub={`from L${from}`} />
      </div>

      <div className="flex flex-wrap gap-1.5">
        {[
          [0, 30],
          [0, 39],
          [30, 40],
          [0, 60],
        ].map(([a, b]) => (
          <button
            key={`${a}-${b}`}
            type="button"
            onClick={() => {
              setFromLvl(a);
              setToLvl(b);
            }}
            className="elevated rounded-xl bg-bg/45 px-3 py-1.5 text-[11px] font-semibold text-muted hover:bg-bg/65 hover:text-fg"
          >
            L{a} → L{b}
          </button>
        ))}
      </div>

      <div className="glass-card rounded-2xl p-4">
        <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted">
          XP → level
        </h3>
        <label className="mt-2 flex flex-col gap-1.5">
          <span className="text-xs text-muted">Paste total XP points</span>
          <input
            value={rawXp}
            onChange={(e) => setRawXp(e.target.value)}
            placeholder="e.g. 1395"
            className="rounded-xl border border-border bg-bg/80 px-3.5 py-2.5 font-mono text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
          />
        </label>
        {levelOfXp != null && (
          <p className="mt-2 text-sm text-fg">
            ≈ <span className="font-mono font-bold text-accent">Level {levelOfXp}</span>
            <span className="text-muted">
              {" "}
              ({formatXp(parsedXp!)} XP total)
            </span>
          </p>
        )}
      </div>

      <div>
        <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted">
          Common sources
        </h3>
        <ul className="flex flex-col gap-1.5">
          {XP_SOURCES.filter((s) => s.xp > 0).map((s) => {
            const count = needed > 0 ? Math.ceil(needed / s.xp) : 0;
            return (
              <li
                key={s.id}
                className="flex flex-wrap items-baseline justify-between gap-2 rounded-xl bg-bg/40 px-3 py-2 text-sm"
              >
                <span>
                  <span className="font-medium text-fg">{s.label}</span>
                  {s.note && (
                    <span className="ml-1.5 text-xs text-muted">({s.note})</span>
                  )}
                </span>
                <span className="font-mono text-xs text-muted">
                  {formatXp(s.xp)} XP
                  {needed > 0 && (
                    <span className="ml-2 text-fg">×{count}</span>
                  )}
                </span>
              </li>
            );
          })}
        </ul>
        <p className="mt-2 text-[11px] text-muted">
          Mob XP varies with equipment and difficulty. Values are approximate Java averages.
        </p>
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="stat-tile rounded-2xl px-3 py-3.5 text-center">
      <div className="text-[10px] font-semibold uppercase tracking-wider text-muted">
        {label}
      </div>
      <div className="mt-1 font-mono text-lg font-bold tabular-nums text-fg">{value}</div>
      {sub && <div className="mt-0.5 text-xs text-muted">{sub}</div>}
    </div>
  );
}
