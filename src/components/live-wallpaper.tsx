import { useEffect, useState } from "react";
import { loadTheme, type ThemeId } from "@/lib/theme";

const ITEMS = [
  { file: "Invicon_Diamond_Sword.png", x: "4%", y: "10%", delay: "0s", size: 58, glow: "#5eead4" },
  { file: "Invicon_Ender_Pearl.png", x: "88%", y: "12%", delay: "0.7s", size: 54, glow: "#67e8f9" },
  { file: "Invicon_Totem_of_Undying.png", x: "5%", y: "62%", delay: "1.4s", size: 60, glow: "#fbbf24" },
  { file: "Invicon_Bucket_of_Axolotl.png", x: "86%", y: "58%", delay: "0.4s", size: 62, glow: "#f9a8d4" },
  { file: "Invicon_Diamond.png", x: "14%", y: "32%", delay: "1s", size: 46, glow: "#22d3ee" },
  { file: "Invicon_Grass_Block.png", x: "78%", y: "30%", delay: "1.6s", size: 54, glow: "#86efac" },
  { file: "Invicon_Nether_Star.gif", x: "48%", y: "4%", delay: "0.5s", size: 52, glow: "#e0e7ff" },
  { file: "Invicon_Diamond_Pickaxe.png", x: "2%", y: "40%", delay: "1.9s", size: 56, glow: "#5eead4" },
  { file: "Invicon_Torch.png", x: "92%", y: "34%", delay: "1.2s", size: 44, glow: "#fdba74" },
  { file: "Invicon_Enchanted_Golden_Apple.gif", x: "22%", y: "72%", delay: "2.1s", size: 52, glow: "#fde047" },
] as const;

const WIKI = "https://minecraft.wiki/images";

/** Biome shader grades on the shared landscape video */
const SHADERS: Record<
  ThemeId,
  {
    videoFilter: string;
    overlay: string;
    fog: string;
    particles?: "embers" | "void" | "none";
  }
> = {
  overworld: {
    videoFilter: "saturate(1.05) brightness(0.85) contrast(1.05)",
    overlay:
      "linear-gradient(180deg, rgba(12,18,16,0.45) 0%, rgba(12,18,16,0.25) 45%, rgba(12,18,16,0.75) 100%)",
    fog: "radial-gradient(ellipse at center, transparent 40%, rgba(8,12,10,0.5) 100%)",
    particles: "none",
  },
  nether: {
    videoFilter: "sepia(0.55) hue-rotate(-25deg) saturate(1.8) brightness(0.55) contrast(1.15)",
    overlay:
      "linear-gradient(180deg, rgba(80,10,5,0.55) 0%, rgba(120,25,10,0.35) 40%, rgba(20,4,2,0.85) 100%)",
    fog: "radial-gradient(ellipse at 50% 80%, rgba(255,80,20,0.25) 0%, transparent 50%), radial-gradient(ellipse at center, transparent 30%, rgba(20,4,2,0.7) 100%)",
    particles: "embers",
  },
  end: {
    videoFilter: "hue-rotate(220deg) saturate(0.85) brightness(0.45) contrast(1.2)",
    overlay:
      "linear-gradient(180deg, rgba(20,8,40,0.65) 0%, rgba(40,15,70,0.4) 45%, rgba(8,4,18,0.9) 100%)",
    fog: "radial-gradient(ellipse at center, rgba(180,120,255,0.12) 0%, transparent 45%), radial-gradient(ellipse at center, transparent 35%, rgba(5,2,15,0.75) 100%)",
    particles: "void",
  },
  light: {
    videoFilter: "saturate(1.15) brightness(1.15) contrast(0.98)",
    overlay:
      "linear-gradient(180deg, rgba(200,220,230,0.25) 0%, rgba(180,210,180,0.15) 50%, rgba(230,240,230,0.45) 100%)",
    fog: "radial-gradient(ellipse at center, transparent 50%, rgba(255,255,255,0.15) 100%)",
    particles: "none",
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
      <video
        key={theme}
        className="absolute inset-0 size-full object-cover motion-reduce:hidden transition-[filter] duration-700"
        style={{ filter: shader.videoFilter }}
        autoPlay
        muted
        loop
        playsInline
      >
        <source
          src="https://cdn.pixabay.com/video/2025/05/13/278750_large.mp4"
          type="video/mp4"
        />
      </video>

      {/* Fallback solid when video hidden (reduced motion) */}
      <div
        className="absolute inset-0 opacity-0 motion-reduce:opacity-100"
        style={{
          background:
            theme === "nether"
              ? "linear-gradient(180deg, #4a1008 0%, #2a0804 50%, #120302 100%)"
              : theme === "end"
                ? "linear-gradient(180deg, #1a0a30 0%, #0c0618 50%, #050210 100%)"
                : theme === "light"
                  ? "linear-gradient(180deg, #a8c8e0 0%, #c5dcb0 55%, #e8f0e0 100%)"
                  : "linear-gradient(180deg, #1a2332 0%, #243044 40%, #1e2a22 70%, #121816 100%)",
        }}
      />

      {/* Color grade overlay */}
      <div
        className="absolute inset-0 transition-opacity duration-700"
        style={{ background: shader.overlay }}
      />

      {/* Fog / vignette */}
      <div className="absolute inset-0" style={{ background: shader.fog }} />

      {shader.particles === "embers" && <EmberParticles />}
      {shader.particles === "void" && <VoidParticles />}

      <ItemStickers dim={theme === "light"} />
    </div>
  );
}

function EmberParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <style>{`
        @keyframes emberRise {
          0% { transform: translateY(0) scale(1); opacity: 0; }
          15% { opacity: 0.9; }
          100% { transform: translateY(-100vh) scale(0.4); opacity: 0; }
        }
      `}</style>
      {Array.from({ length: 18 }).map((_, i) => (
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
    <div className="absolute inset-0 overflow-hidden">
      <style>{`
        @keyframes voidDrift {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.85; transform: scale(1.4); }
        }
      `}</style>
      {Array.from({ length: 24 }).map((_, i) => (
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
            transform: translate3d(0, 0, 0) rotateY(-16deg) rotateZ(-6deg) scale(1);
            filter: drop-shadow(0 0 6px var(--glow)) drop-shadow(0 8px 14px rgba(0,0,0,0.55));
          }
          25% {
            transform: translate3d(4px, -10px, 0) rotateY(8deg) rotateZ(4deg) scale(1.06);
            filter: drop-shadow(0 0 14px var(--glow)) drop-shadow(0 10px 16px rgba(0,0,0,0.5));
          }
          50% {
            transform: translate3d(0, -18px, 0) rotateY(18deg) rotateZ(6deg) scale(1.1);
            filter: drop-shadow(0 0 18px var(--glow)) drop-shadow(0 12px 18px rgba(0,0,0,0.45));
          }
          75% {
            transform: translate3d(-4px, -10px, 0) rotateY(4deg) rotateZ(-4deg) scale(1.06);
            filter: drop-shadow(0 0 12px var(--glow)) drop-shadow(0 10px 16px rgba(0,0,0,0.5));
          }
          100% {
            transform: translate3d(0, 0, 0) rotateY(-16deg) rotateZ(-6deg) scale(1);
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
            animation: `bobGlow 6s ease-in-out ${it.delay} infinite`,
            imageRendering: "pixelated",
            opacity: dim ? 0.55 : 0.96,
            willChange: "transform, filter",
          }}
          loading="eager"
          decoding="async"
        />
      ))}
    </div>
  );
}
