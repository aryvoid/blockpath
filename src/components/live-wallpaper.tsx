const ITEMS = [
  { file: "Invicon_Diamond_Sword.png", x: "5%", y: "12%", delay: "0s", size: 58, glow: "#5eead4" },
  { file: "Invicon_Ender_Pearl.png", x: "85%", y: "14%", delay: "0.7s", size: 54, glow: "#67e8f9" },
  { file: "Invicon_Totem_of_Undying.png", x: "7%", y: "64%", delay: "1.4s", size: 60, glow: "#fbbf24" },
  { file: "Invicon_Bucket_of_Axolotl.png", x: "81%", y: "60%", delay: "0.4s", size: 62, glow: "#f9a8d4" },
  { file: "Invicon_Diamond.png", x: "16%", y: "34%", delay: "1s", size: 46, glow: "#22d3ee" },
  { file: "Invicon_Grass_Block.png", x: "72%", y: "38%", delay: "1.6s", size: 54, glow: "#86efac" },
  { file: "Invicon_Nether_Star.png", x: "44%", y: "6%", delay: "0.5s", size: 50, glow: "#e0e7ff" },
  { file: "Invicon_Diamond_Pickaxe.png", x: "3%", y: "42%", delay: "1.9s", size: 56, glow: "#5eead4" },
  { file: "Invicon_Torch.png", x: "88%", y: "36%", delay: "1.2s", size: 44, glow: "#fdba74" },
  { file: "Invicon_Enchanted_Golden_Apple.png", x: "26%", y: "74%", delay: "2.1s", size: 52, glow: "#fde047" },
] as const;

const WIKI = "https://minecraft.wiki/images";

export function LiveWallpaper() {
  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      aria-hidden="true"
    >
      <video
        className="absolute inset-0 size-full object-cover motion-reduce:hidden"
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

      <div
        className="absolute inset-0 opacity-0 motion-reduce:opacity-100"
        style={{
          background:
            "linear-gradient(180deg, #1a2332 0%, #243044 40%, #1e2a22 70%, #121816 100%)",
        }}
      />

      {/* Cool dark grade — keeps UI readable, lets glows pop */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0c1210]/55 via-[#0c1210]/40 to-[#0c1210]/80" />

      <ItemStickers />

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(8,12,10,0.5)_100%)]" />
    </div>
  );
}

function ItemStickers() {
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
            opacity: 0.96,
            willChange: "transform, filter",
          }}
          loading="eager"
          decoding="async"
        />
      ))}
    </div>
  );
}
