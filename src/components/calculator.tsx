import { useEffect, useMemo, useState } from "react";
import {
  parseCoords,
  delta,
  horizontalDistance,
  distance3d,
  headingDegrees,
  compassLabel,
  chunks,
  toNether,
  toOverworld,
  SPEEDS,
  travelSeconds,
  formatDuration,
  formatCoord,
  type Vec3,
} from "@/lib/coords";
import {
  loadWaypoints,
  saveWaypoints,
  SAMPLE_WAYPOINTS,
  type Waypoint,
} from "@/lib/waypoints";
import { cn } from "@/lib/utils";

function useLocalWaypoints() {
  const [list, setList] = useState<Waypoint[]>(SAMPLE_WAYPOINTS);
  useEffect(() => {
    setList(loadWaypoints());
  }, []);
  const persist = (next: Waypoint[]) => {
    setList(next);
    saveWaypoints(next);
  };
  return { list, persist };
}

export function Calculator({ embedded = false }: { embedded?: boolean } = {}) {
  const [fromRaw, setFromRaw] = useState("0 64 0");
  const [toRaw, setToRaw] = useState("2329 66 1745");
  const [name, setName] = useState("");
  const { list, persist } = useLocalWaypoints();

  const from = useMemo(() => parseCoords(fromRaw), [fromRaw]);
  const to = useMemo(() => parseCoords(toRaw), [toRaw]);

  const stats = useMemo(() => {
    if (!from || !to) return null;
    const d = delta(from, to);
    const horiz = horizontalDistance(from, to);
    const dist3 = distance3d(from, to);
    const yaw = headingDegrees(from, to);
    return {
      d,
      horiz,
      dist3,
      yaw,
      dir: compassLabel(yaw),
      chunkH: chunks(horiz),
      chunk3: chunks(dist3),
      netherFrom: toNether(from),
      netherTo: toNether(to),
      owFrom: toOverworld(from),
      owTo: toOverworld(to),
    };
  }, [from, to]);

  const applyWaypoint = (w: Waypoint, target: "from" | "to") => {
    const str = `${w.x} ${w.y} ${w.z}`;
    if (target === "from") setFromRaw(str);
    else setToRaw(str);
  };

  const addWaypoint = () => {
    if (!to) return;
    const id = crypto.randomUUID().slice(0, 8);
    const wp: Waypoint = {
      id,
      name: name.trim() || `Point ${list.length + 1}`,
      x: to.x,
      y: to.y,
      z: to.z,
    };
    persist([...list, wp]);
    setName("");
  };

  const removeWaypoint = (id: string) => {
    persist(list.filter((w) => w.id !== id));
  };

  const wrap = embedded
    ? "flex flex-col gap-4"
    : "relative z-10 mx-auto flex min-h-dvh max-w-3xl flex-col gap-5 px-4 py-8 sm:px-6";

  return (
    <div className={wrap}>
      {!embedded && (
        <header className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-fg drop-shadow-sm sm:text-4xl">
            Blockpath
          </h1>
          <p className="mt-1.5 text-sm text-muted">
            Minecraft coordinate distance · heading · travel time · Nether pairing
          </p>
        </header>
      )}

      <section className="grid gap-3 rounded-2xl border border-border/80 bg-card/70 p-4 shadow-xl backdrop-blur-md sm:grid-cols-2">
        <label className="flex flex-col gap-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted">
            From (current)
          </span>
          <input
            value={fromRaw}
            onChange={(e) => setFromRaw(e.target.value)}
            placeholder="x y z  or  paste F3"
            className={cn(
              "rounded-xl border border-border bg-bg/80 px-3.5 py-2.5 font-mono text-sm outline-none transition",
              "placeholder:text-muted/50 focus:border-accent focus:ring-2 focus:ring-accent/30",
              !from && fromRaw.trim() && "border-red-500/60",
            )}
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted">
            To (destination)
          </span>
          <input
            value={toRaw}
            onChange={(e) => setToRaw(e.target.value)}
            placeholder="x y z  or  paste F3"
            className={cn(
              "rounded-xl border border-border bg-bg/80 px-3.5 py-2.5 font-mono text-sm outline-none transition",
              "placeholder:text-muted/50 focus:border-accent focus:ring-2 focus:ring-accent/30",
              !to && toRaw.trim() && "border-red-500/60",
            )}
          />
        </label>
      </section>

      {stats ? (
        <section className="grid gap-4">
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            <Stat label="Horizontal" value={formatCoord(stats.horiz)} sub={`${formatCoord(stats.chunkH)} chunks`} />
            <Stat label="3D distance" value={formatCoord(stats.dist3)} sub={`${formatCoord(stats.chunk3)} chunks`} />
            <Stat label="Heading" value={`${formatCoord(stats.yaw, 0)}°`} sub={stats.dir} />
            <Stat label="Δ X / Y / Z" value={`${formatCoord(stats.d.x)} / ${formatCoord(stats.d.y)} / ${formatCoord(stats.d.z)}`} mono />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex items-center justify-center gap-5 rounded-2xl border border-border/80 bg-card/70 p-5 shadow-xl backdrop-blur-md">
              <Compass yaw={stats.yaw} />
              <div className="text-sm">
                <div className="text-muted">
                  Face <span className="font-bold text-accent">{stats.dir}</span>
                </div>
                <div className="mt-1 font-mono text-lg text-fg">{formatCoord(stats.yaw, 1)}°</div>
                <div className="mt-0.5 text-xs text-muted">Minecraft yaw</div>
              </div>
            </div>

            <div className="rounded-2xl border border-border/80 bg-card/70 p-4 shadow-xl backdrop-blur-md">
              <h2 className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted">
                Relative map (N ↑)
              </h2>
              <RelativeMap from={from!} to={to!} />
            </div>
          </div>

          <div className="rounded-2xl border border-border/80 bg-card/70 p-4 shadow-xl backdrop-blur-md">
            <h2 className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-muted">
              Travel time (approx · horizontal)
            </h2>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {([["Walk", SPEEDS.walk], ["Sprint", SPEEDS.sprint], ["Horse", SPEEDS.horse], ["Ice boat", SPEEDS.iceBoat], ["Elytra", SPEEDS.elytra]] as const).map(([label, speed]) => (
                <div key={label} className="flex items-baseline justify-between rounded-xl bg-bg/50 px-3 py-2.5">
                  <span className="text-sm text-muted">{label}</span>
                  <span className="font-mono text-sm font-medium text-fg">{formatDuration(travelSeconds(stats.horiz, speed))}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border/80 bg-card/70 p-4 shadow-xl backdrop-blur-md">
            <h2 className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-muted">
              Nether / Overworld pairing
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <PairBlock title="These coords → Nether" a={stats.netherFrom} b={stats.netherTo} labelA="From" labelB="To" />
              <PairBlock title="If Nether → Overworld targets" a={stats.owFrom} b={stats.owTo} labelA="From" labelB="To" />
            </div>
          </div>
        </section>
      ) : (
        <p className="rounded-2xl border border-border/80 bg-card/60 px-4 py-8 text-center text-sm text-muted backdrop-blur-md">
          Paste valid coordinates (e.g. <code className="rounded bg-bg/60 px-1.5 py-0.5 text-accent">123 64 -456</code> or F3 line) in both fields.
        </p>
      )}

      <section className="rounded-2xl border border-border/80 bg-card/70 p-4 shadow-xl backdrop-blur-md">
        <h2 className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-muted">Saved waypoints</h2>
        <div className="mb-3 flex flex-wrap gap-2">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name for current destination" className="min-w-[10rem] flex-1 rounded-xl border border-border bg-bg/80 px-3 py-2 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/30" />
          <button type="button" onClick={addWaypoint} disabled={!to} className="rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-bg transition hover:bg-accent-dim disabled:opacity-40">Save “To”</button>
        </div>
        <ul className="flex flex-col gap-1.5">
          {list.map((w) => (
            <li key={w.id} className="flex flex-wrap items-center gap-2 rounded-xl bg-bg/40 px-3 py-2 text-sm">
              <span className="min-w-0 flex-1 truncate font-medium">{w.name}</span>
              <span className="font-mono text-xs text-muted">{w.x} {w.y} {w.z}</span>
              <button type="button" onClick={() => applyWaypoint(w, "from")} className="rounded-lg px-2 py-0.5 text-xs font-medium text-accent hover:bg-accent/15">From</button>
              <button type="button" onClick={() => applyWaypoint(w, "to")} className="rounded-lg px-2 py-0.5 text-xs font-medium text-accent hover:bg-accent/15">To</button>
              <button type="button" onClick={() => removeWaypoint(w.id)} className="rounded-lg px-2 py-0.5 text-xs text-muted hover:bg-red-500/20 hover:text-red-400">✕</button>
            </li>
          ))}
        </ul>
      </section>

      {!embedded && (
        <p className="pb-1 text-center text-xs text-muted/70">Coordinates stay in your browser</p>
      )}
    </div>
  );
}

function Stat({ label, value, sub, mono }: { label: string; value: string; sub?: string; mono?: boolean }) {
  return (
    <div className="rounded-2xl border border-border/80 bg-card/70 px-3 py-3.5 text-center shadow-lg backdrop-blur-md">
      <div className="text-[10px] font-semibold uppercase tracking-wider text-muted">{label}</div>
      <div className={cn("mt-1 text-lg font-bold tabular-nums text-fg", mono && "font-mono text-sm sm:text-base")}>{value}</div>
      {sub && <div className="mt-0.5 text-xs text-muted">{sub}</div>}
    </div>
  );
}

function Compass({ yaw }: { yaw: number }) {
  return (
    <div className="relative size-[5.5rem] shrink-0">
      <div className="absolute inset-0 rounded-full border-2 border-border bg-bg/70 shadow-inner" />
      <div className="absolute inset-1.5 rounded-full border border-border/40" />
      {["N", "E", "S", "W"].map((d, i) => (
        <span key={d} className={cn("absolute text-[11px] font-bold", d === "N" ? "text-accent" : "text-muted")}
          style={{ top: i === 0 ? 3 : i === 2 ? "auto" : "50%", bottom: i === 2 ? 3 : undefined, left: i === 3 ? 5 : i === 1 ? "auto" : "50%", right: i === 1 ? 5 : undefined, transform: i === 0 || i === 2 ? "translateX(-50%)" : "translateY(-50%)" }}>
          {d}
        </span>
      ))}
      <div className="absolute left-1/2 top-1/2 origin-bottom" style={{ transform: `translate(-50%, -100%) rotate(${yaw + 180}deg)`, height: "38%", width: 3 }}>
        <div className="h-full w-full rounded-full bg-accent shadow-[0_0_8px_var(--color-accent)]" />
      </div>
      <div className="absolute left-1/2 top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-bg bg-fg" />
    </div>
  );
}

function RelativeMap({ from, to }: { from: Vec3; to: Vec3 }) {
  const d = delta(from, to);
  const max = Math.max(Math.abs(d.x), Math.abs(d.z), 1);
  const pad = 18;
  const size = 140;
  const cx = size / 2;
  const cy = size / 2;
  const scale = (size / 2 - pad) / max;
  const tx = cx + d.x * scale;
  const ty = cy + d.z * scale;

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="mx-auto size-[9rem] rounded-xl bg-bg/40">
      <line x1={cx} y1={0} x2={cx} y2={size} stroke="currentColor" className="text-border" strokeWidth="1" />
      <line x1={0} y1={cy} x2={size} y2={cy} stroke="currentColor" className="text-border" strokeWidth="1" />
      <text x={cx} y={10} textAnchor="middle" className="fill-accent text-[9px] font-bold">N</text>
      <line x1={cx} y1={cy} x2={tx} y2={ty} stroke="currentColor" className="text-accent/60" strokeWidth="2" strokeDasharray="4 3" />
      <circle cx={cx} cy={cy} r="5" className="fill-fg" />
      <text x={cx} y={cy - 9} textAnchor="middle" className="fill-muted text-[8px]">You</text>
      <circle cx={tx} cy={ty} r="5" className="fill-accent" />
      <text x={tx} y={ty - 9} textAnchor="middle" className="fill-accent text-[8px]">Dest</text>
    </svg>
  );
}

function PairBlock({ title, a, b, labelA, labelB }: { title: string; a: Vec3; b: Vec3; labelA: string; labelB: string }) {
  return (
    <div className="rounded-xl bg-bg/40 p-3">
      <div className="mb-1.5 text-xs text-muted">{title}</div>
      <div className="space-y-1 font-mono text-sm">
        <div><span className="text-muted">{labelA}: </span><span className="text-fg">{a.x} {a.y} {a.z}</span></div>
        <div><span className="text-muted">{labelB}: </span><span className="text-fg">{b.x} {b.y} {b.z}</span></div>
      </div>
    </div>
  );
}
