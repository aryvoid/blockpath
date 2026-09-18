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

export function Calculator() {
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

  return (
    <div className="relative z-10 mx-auto flex min-h-dvh max-w-3xl flex-col gap-6 px-4 py-8 sm:px-6">
      <header className="text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-fg sm:text-3xl">
          Blockpath
        </h1>
        <p className="mt-1 text-sm text-muted">
          Minecraft coordinate distance · heading · travel time · Nether pairing
        </p>
      </header>

      {/* Inputs */}
      <section className="grid gap-4 rounded-xl border border-border bg-card/80 p-4 backdrop-blur-sm sm:grid-cols-2">
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium uppercase tracking-wider text-muted">
            From (current)
          </span>
          <input
            value={fromRaw}
            onChange={(e) => setFromRaw(e.target.value)}
            placeholder="x y z  or  paste F3"
            className={cn(
              "rounded-lg border border-border bg-bg px-3 py-2.5 font-mono text-sm outline-none transition",
              "focus:border-accent focus:ring-1 focus:ring-accent",
              !from && fromRaw.trim() && "border-red-500/60",
            )}
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium uppercase tracking-wider text-muted">
            To (destination)
          </span>
          <input
            value={toRaw}
            onChange={(e) => setToRaw(e.target.value)}
            placeholder="x y z  or  paste F3"
            className={cn(
              "rounded-lg border border-border bg-bg px-3 py-2.5 font-mono text-sm outline-none transition",
              "focus:border-accent focus:ring-1 focus:ring-accent",
              !to && toRaw.trim() && "border-red-500/60",
            )}
          />
        </label>
      </section>

      {/* Results */}
      {stats ? (
        <section className="grid gap-4">
          {/* Distance cards */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat
              label="Horizontal"
              value={`${formatCoord(stats.horiz)}`}
              sub={`${formatCoord(stats.chunkH)} chunks`}
            />
            <Stat
              label="3D distance"
              value={`${formatCoord(stats.dist3)}`}
              sub={`${formatCoord(stats.chunk3)} chunks`}
            />
            <Stat
              label="Heading"
              value={`${formatCoord(stats.yaw, 0)}°`}
              sub={stats.dir}
            />
            <Stat
              label="Δ X / Y / Z"
              value={`${formatCoord(stats.d.x)} / ${formatCoord(stats.d.y)} / ${formatCoord(stats.d.z)}`}
              mono
            />
          </div>

          {/* Compass */}
          <div className="flex items-center justify-center gap-6 rounded-xl border border-border bg-card/80 p-4">
            <Compass yaw={stats.yaw} />
            <div className="text-sm text-muted">
              <div>
                Face{" "}
                <span className="font-semibold text-accent">{stats.dir}</span>
              </div>
              <div className="mt-0.5 font-mono text-fg">
                Yaw {formatCoord(stats.yaw, 1)}°
              </div>
            </div>
          </div>

          {/* Travel times */}
          <div className="rounded-xl border border-border bg-card/80 p-4">
            <h2 className="mb-3 text-xs font-medium uppercase tracking-wider text-muted">
              Travel time (approx)
            </h2>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {(
                [
                  ["Walk", SPEEDS.walk],
                  ["Sprint", SPEEDS.sprint],
                  ["Horse", SPEEDS.horse],
                  ["Ice boat", SPEEDS.iceBoat],
                  ["Elytra", SPEEDS.elytra],
                ] as const
              ).map(([label, speed]) => (
                <div
                  key={label}
                  className="flex items-baseline justify-between rounded-lg bg-bg/60 px-3 py-2"
                >
                  <span className="text-sm text-muted">{label}</span>
                  <span className="font-mono text-sm text-fg">
                    {formatDuration(travelSeconds(stats.horiz, speed))}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Nether pairing */}
          <div className="rounded-xl border border-border bg-card/80 p-4">
            <h2 className="mb-3 text-xs font-medium uppercase tracking-wider text-muted">
              Nether / Overworld pairing
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <PairBlock
                title="Nether coords of these points"
                a={stats.netherFrom}
                b={stats.netherTo}
                labelA="From → Nether"
                labelB="To → Nether"
              />
              <PairBlock
                title="If these are Nether, Overworld targets"
                a={stats.owFrom}
                b={stats.owTo}
                labelA="From → OW"
                labelB="To → OW"
              />
            </div>
          </div>
        </section>
      ) : (
        <p className="rounded-xl border border-border bg-card/60 px-4 py-6 text-center text-sm text-muted">
          Paste valid coordinates (e.g. <code className="text-accent">123 64 -456</code> or F3 line) in both fields.
        </p>
      )}

      {/* Waypoints */}
      <section className="rounded-xl border border-border bg-card/80 p-4">
        <h2 className="mb-3 text-xs font-medium uppercase tracking-wider text-muted">
          Saved waypoints
        </h2>
        <div className="mb-3 flex flex-wrap gap-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name for current destination"
            className="min-w-[10rem] flex-1 rounded-lg border border-border bg-bg px-3 py-2 text-sm outline-none focus:border-accent"
          />
          <button
            type="button"
            onClick={addWaypoint}
            disabled={!to}
            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-bg transition hover:bg-accent-dim disabled:opacity-40"
          >
            Save “To”
          </button>
        </div>
        <ul className="flex flex-col gap-1.5">
          {list.map((w) => (
            <li
              key={w.id}
              className="flex flex-wrap items-center gap-2 rounded-lg bg-bg/50 px-3 py-2 text-sm"
            >
              <span className="min-w-0 flex-1 truncate font-medium">{w.name}</span>
              <span className="font-mono text-xs text-muted">
                {w.x} {w.y} {w.z}
              </span>
              <button
                type="button"
                onClick={() => applyWaypoint(w, "from")}
                className="rounded px-2 py-0.5 text-xs text-accent hover:bg-accent/10"
              >
                From
              </button>
              <button
                type="button"
                onClick={() => applyWaypoint(w, "to")}
                className="rounded px-2 py-0.5 text-xs text-accent hover:bg-accent/10"
              >
                To
              </button>
              <button
                type="button"
                onClick={() => removeWaypoint(w.id)}
                className="rounded px-2 py-0.5 text-xs text-muted hover:bg-red-500/20 hover:text-red-400"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      </section>

      <footer className="pb-4 text-center text-xs text-muted">
        Blockpath · coordinates stay in your browser
      </footer>
    </div>
  );
}

function Stat({
  label,
  value,
  sub,
  mono,
}: {
  label: string;
  value: string;
  sub?: string;
  mono?: boolean;
}) {
  return (
    <div className="rounded-xl border border-border bg-card/80 px-3 py-3 text-center">
      <div className="text-[10px] font-medium uppercase tracking-wider text-muted">
        {label}
      </div>
      <div
        className={cn(
          "mt-1 text-lg font-semibold tabular-nums text-fg",
          mono && "font-mono text-sm sm:text-base",
        )}
      >
        {value}
      </div>
      {sub && <div className="mt-0.5 text-xs text-muted">{sub}</div>}
    </div>
  );
}

function Compass({ yaw }: { yaw: number }) {
  return (
    <div className="relative size-20 shrink-0">
      <div className="absolute inset-0 rounded-full border-2 border-border bg-bg/80" />
      <div className="absolute inset-1 rounded-full border border-border/50" />
      {["N", "E", "S", "W"].map((d, i) => (
        <span
          key={d}
          className="absolute text-[10px] font-bold text-muted"
          style={{
            top: i === 0 ? 2 : i === 2 ? "auto" : "50%",
            bottom: i === 2 ? 2 : undefined,
            left: i === 3 ? 4 : i === 1 ? "auto" : "50%",
            right: i === 1 ? 4 : undefined,
            transform:
              i === 0 || i === 2
                ? "translateX(-50%)"
                : "translateY(-50%)",
          }}
        >
          {d}
        </span>
      ))}
      <div
        className="absolute left-1/2 top-1/2 origin-bottom"
        style={{
          transform: `translate(-50%, -100%) rotate(${yaw + 180}deg)`,
          height: "36%",
          width: 3,
        }}
      >
        <div className="h-full w-full rounded-full bg-accent shadow-[0_0_6px_var(--color-accent)]" />
      </div>
      <div className="absolute left-1/2 top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-fg" />
    </div>
  );
}

function PairBlock({
  title,
  a,
  b,
  labelA,
  labelB,
}: {
  title: string;
  a: Vec3;
  b: Vec3;
  labelA: string;
  labelB: string;
}) {
  return (
    <div>
      <div className="mb-1.5 text-xs text-muted">{title}</div>
      <div className="space-y-1 font-mono text-sm">
        <div>
          <span className="text-muted">{labelA}: </span>
          <span className="text-fg">
            {a.x} {a.y} {a.z}
          </span>
        </div>
        <div>
          <span className="text-muted">{labelB}: </span>
          <span className="text-fg">
            {b.x} {b.y} {b.z}
          </span>
        </div>
      </div>
    </div>
  );
}
