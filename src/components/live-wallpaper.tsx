import { useEffect, useState } from "react";
import { loadTheme, type ThemeId } from "@/lib/theme";

/** Fresh sticker set — different from previous swords/grass layout */
const ITEMS = [
  { file: "Invicon_Netherite_Sword.png", x: "6%", y: "14%", delay: "0s", size: 56, glow: "#a78bfa" },
  { file: "Invicon_Elytra.png", x: "84%", y: "10%", delay: "0.6s", size: 60, glow: "#94a3b8" },
  { file: "Invicon_Shulker_Shell.png", x: "10%", y: "68%", delay: "1.2s", size: 52, glow: "#c084fc" },
  { file: "Invicon_Amethyst_Shard.png", x: "82%", y: "62%", delay: "0.3s", size: 48, glow: "#e9d5ff" },
  { file: "Invicon_Heart_of_the_Sea.png", x: "18%", y: "38%", delay: "1.5s", size: 50, glow: "#38bdf8" },
  { file: "Invicon_Echo_Shard.png", x: "74%", y: "36%", delay: "0.9s", size: 46, glow: "#67e8f9" },
  { file: "Invicon_Dragon_Egg.png", x: "46%", y: "6%", delay: "0.4s", size: 54, glow: "#c084fc" },
  { file: "Invicon_Trident.png", x: "4%", y: "48%", delay: "1.8s", size: 58, glow: "#5eead4" },
  { file: "Invicon_Spyglass.png", x: "90%", y: "42%", delay: "1.1s", size: 44, glow: "#fcd34d" },
  { file: "Invicon_Sculk_Catalyst.png", x: "28%", y: "78%", delay: "2s", size: 52, glow: "#2dd4bf" },
] as const;

const WIKI = "https://minecraft.wiki/images";

type Shader = {
  sky: string;
  aurora: string;
  vignette: string;
  stars: "cool" | "warm" | "void" | "day";
};

const SHADERS: Record<ThemeId, Shader> = {
  overworld: {
    sky: "radial-gradient(ellipse 120% 80% at 50% -10%, #1a3a4a 0%, #0c1820 35%, #080e12 70%, #05080a 100%)",
    aurora:
      "linear-gradient(115deg, transparent 20%, rgba(56,189,248,0.08) 40%, rgba(52,211,153,0.12) 55%, transparent 75%)",
    vignette: "radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.55) 100%)",
    stars: "cool",
  },
  nether: {
    sky: "radial-gradient(ellipse 120% 90% at 50% 100%, #5c1808 0%, #2a0a06 40%, #120304 75%, #080102 100%)",
    aurora:
      "linear-gradient(160deg, rgba(249,115,22,0.15) 0%, transparent 40%, rgba(220,38,38,0.1) 70%, transparent 100%)",
    vignette: "radial-gradient(ellipse at center, transparent 30%, rgba(20,4,2,0.7) 100%)",
    stars: "warm",
  },
  end: {
    sky: "radial-gradient(ellipse 100% 80% at 50% 20%, #2a1850 0%, #120a28 45%, #060310 100%)",
    aurora:
      "linear-gradient(200deg, rgba(168,85,247,0.18) 0%, transparent 45%, rgba(99,102,241,0.1) 70%, transparent 100%)",
    vignette: "radial-gradient(ellipse at center, transparent 30%, rgba(5,2,15,0.75) 100%)",
    stars: "void",
  },
  light: {
    sky: "radial-gradient(ellipse 120% 80% at 50% -20%, #c8e0f0 0%, #b8d4c8 40%, #d8e8d8 75%, #eef4ec 100%)",
    aurora:
      "linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.35) 50%, transparent 70%)",
    vignette: "radial-gradient(ellipse at center, transparent 50%, rgba(255,255,255,0.2) 100%)",
    stars: "day",
  },
};

export function LiveWallpaper() {
  const [theme, setTheme] = useState<ThemeId>("overworld");

  useEffect(() => {
    setTheme(loadTheme());
    const onTheme = (e: Event) => {
      const id = (e as CustomEvent<ThemeId>).detail;
      if (id) setTheme(id);
    };
    window.addEventListener("blockpath-theme", onTheme);
    return () => window.removeEventListener("blockpath-theme", onTheme);
  }, []);

  const shader = SHADERS[theme];

  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      aria-hidden="true"
      data-biome={theme}
    >
      <div
        className="absolute inset-0 transition-[background] duration-700"
        style={{ background: shader.sky }}
      />

      <div
        className="absolute inset-0 opacity-90 transition-opacity duration-700 motion-reduce:opacity-40"
        style={{ background: shader.aurora }}
      />

      <DriftBlobs theme={theme} />
      <StarField mode={shader.stars} />

      <div className="absolute inset-0" style={{ background: shader.vignette }} />

      {theme === "nether" && <EmberParticles />}
      {theme === "end" && <VoidParticles />}

      <ItemStickers dim={theme === "light"} />
    </div>
  );
}

function DriftBlobs({ theme }: { theme: ThemeId }) {
  const colors =
    theme === "nether"
      ? ["rgba(249,115,22,0.12)", "rgba(220,38,38,0.1)"]
      : theme === "end"
        ? ["rgba(168,85,247,0.14)", "rgba(99,102,241,0.1)"]
        : theme === "light"
          ? ["rgba(255,255,255,0.25)", "rgba(186,230,253,0.2)"]
          : ["rgba(34,211,238,0.1)", "rgba(52,211,153,0.08)"];

  return (
    <div className="absolute inset-0 overflow-hidden motion-reduce:hidden">
      <style>{`
        @keyframes blobDrift {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(4%, -3%) scale(1.08); }
          66% { transform: translate(-3%, 2%) scale(0.95); }
        }
      `}</style>
      <div
        className="absolute rounded-full blur-3xl"
        style={{
          width: "55vmax",
          height: "55vmax",
          left: "-10%",
          top: "10%",
          background: colors[0],
          animation: "blobDrift 22s ease-in-out infinite",
        }}
      />
      <div
        className="absolute rounded-full blur-3xl"
        style={{
          width: "45vmax",
          height: "45vmax",
          right: "-5%",
          bottom: "5%",
          background: colors[1],
          animation: "blobDrift 28s ease-in-out infinite reverse",
        }}
      />
    </div>
  );
}

function StarField({ mode }: { mode: Shader["stars"] }) {
  if (mode === "day") {
    return (
      <div className="absolute inset-0 overflow-hidden opacity-40 motion-reduce:opacity-20">
        {Array.from({ length: 12 }).map((_, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-white/60"
            style={{
              left: `${(i * 41) % 100}%`,
              top: `${(i * 29) % 55}%`,
              width: 2 + (i % 2),
              height: 2 + (i % 2),
            }}
          />
        ))}
      </div>
    );
  }

  const color =
    mode === "warm" ? "#fdba74" : mode === "void" ? "#e9d5ff" : "#e0f2fe";
  const count = mode === "void" ? 36 : 48;

  return (
    <div className="absolute inset-0 overflow-hidden motion-reduce:opacity-50">
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.15; transform: scale(0.8); }
          50% { opacity: 0.95; transform: scale(1.15); }
        }
      `}</style>
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${(i * 47 + 13) % 100}%`,
            top: `${(i * 31 + 7) % 100}%`,
            width: 1 + (i % 3),
            height: 1 + (i % 3),
            background: color,
            boxShadow: `0 0 ${3 + (i % 4)}px ${color}`,
            animation: `twinkle ${2.5 + (i % 5) * 0.6}s ease-in-out ${i * 0.15}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

function EmberParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden motion-reduce:hidden">
      <style>{`
        @keyframes emberRise {
          0% { transform: translateY(0) scale(1); opacity: 0; }
          15% { opacity: 0.9; }
          100% { transform: translateY(-100vh) scale(0.4); opacity: 0; }
        }
      `}</style>
      {Array.from({ length: 16 }).map((_, i) => (
        <span
          key={i}
          className="absolute bottom-0 rounded-full"
          style={{
            left: `${4 + ((i * 17) % 92)}%`,
            width: 3 + (i % 4),
            height: 3 + (i % 4),
            background: i % 3 === 0 ? "#fbbf24" : "#f97316",
            boxShadow: "0 0 8px #f97316",
            animation: `emberRise ${5 + (i % 5)}s linear ${i * 0.35}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

function VoidParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden motion-reduce:hidden">
      <style>{`
        @keyframes voidDrift {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.85; transform: scale(1.4); }
        }
      `}</style>
      {Array.from({ length: 22 }).map((_, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-purple-200"
          style={{
            left: `${(i * 37) % 100}%`,
            top: `${(i * 53) % 100}%`,
            width: 2 + (i % 3),
            height: 2 + (i % 3),
            boxShadow: "0 0 6px #c084fc",
            animation: `voidDrift ${3 + (i % 4)}s ease-in-out ${i * 0.2}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

function ItemStickers({ dim }: { dim?: boolean }) {
  return (
    <div className="absolute inset-0 z-[1]" style={{ perspective: "1000px" }}>
      <style>{`
        @keyframes bobGlow {
          0% {
            transform: translate3d(0, 0, 0) rotateY(-12deg) rotateZ(-4deg) scale(1);
            filter: drop-shadow(0 0 6px var(--glow)) drop-shadow(0 8px 14px rgba(0,0,0,0.55));
          }
          25% {
            transform: translate3d(3px, -8px, 0) rotateY(6deg) rotateZ(3deg) scale(1.05);
            filter: drop-shadow(0 0 14px var(--glow)) drop-shadow(0 10px 16px rgba(0,0,0,0.5));
          }
          50% {
            transform: translate3d(0, -14px, 0) rotateY(14deg) rotateZ(5deg) scale(1.08);
            filter: drop-shadow(0 0 18px var(--glow)) drop-shadow(0 12px 18px rgba(0,0,0,0.45));
          }
          75% {
            transform: translate3d(-3px, -8px, 0) rotateY(2deg) rotateZ(-3deg) scale(1.05);
            filter: drop-shadow(0 0 12px var(--glow)) drop-shadow(0 10px 16px rgba(0,0,0,0.5));
          }
          100% {
            transform: translate3d(0, 0, 0) rotateY(-12deg) rotateZ(-4deg) scale(1);
            filter: drop-shadow(0 0 6px var(--glow)) drop-shadow(0 8px 14px rgba(0,0,0,0.55));
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .sticker-float { animation: none !important; }
        }
      `}</style>
      {ITEMS.map((it) => (
        <img
          key={it.file}
          src={`${WIKI}/${it.file}`}
          alt=""
          width={it.size}
          height={it.size}
          className="sticker-float absolute select-none object-contain"
          style={{
            left: it.x,
            top: it.y,
            width: it.size,
            height: it.size,
            // @ts-expect-error CSS var
            "--glow": it.glow,
            animation: `bobGlow 7s ease-in-out ${it.delay} infinite`,
            imageRendering: "pixelated",
            opacity: dim ? 0.5 : 0.92,
            willChange: "transform, filter",
          }}
          loading="eager"
          decoding="async"
        />
      ))}
    </div>
  );
}
