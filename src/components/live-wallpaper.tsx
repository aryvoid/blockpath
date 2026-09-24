/** Official-style inventory icons via Minecraft Wiki (stable CDN). */
const ITEMS = [
  { file: "Invicon_Diamond_Sword.png", x: "6%", y: "14%", rot: -14, delay: "0s", size: 52 },
  { file: "Invicon_Ender_Pearl.png", x: "86%", y: "16%", rot: 12, delay: "0.7s", size: 48 },
  { file: "Invicon_Totem_of_Undying.png", x: "8%", y: "66%", rot: 8, delay: "1.3s", size: 54 },
  { file: "Invicon_Axolotl_Bucket.png", x: "82%", y: "62%", rot: -10, delay: "0.4s", size: 56 },
  { file: "Invicon_Diamond.png", x: "18%", y: "36%", rot: 18, delay: "1s", size: 42 },
  { file: "Invicon_Grass_Block.png", x: "74%", y: "40%", rot: -6, delay: "1.6s", size: 48 },
  { file: "Invicon_Nether_Star.png", x: "46%", y: "8%", rot: 22, delay: "0.5s", size: 44 },
  { file: "Invicon_Diamond_Pickaxe.png", x: "4%", y: "44%", rot: -20, delay: "1.9s", size: 50 },
  { file: "Invicon_Torch.png", x: "90%", y: "38%", rot: 6, delay: "1.2s", size: 40 },
  { file: "Invicon_Enchanted_Golden_Apple.png", x: "28%", y: "76%", rot: -8, delay: "2.1s", size: 46 },
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
            "linear-gradient(180deg, #5b9bd5 0%, #87ceeb 40%, #a8d5a2 65%, #6b9e3e 80%, #3e2723 100%)",
        }}
      />

      {/* Lighter dim so stickers stay visible */}
      <div className="absolute inset-0 bg-gradient-to-b from-bg/25 via-bg/35 to-bg/70" />

      <ItemStickers />

      {/* Soft center vignette on top (UI readability) */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(12,14,11,0.45)_100%)]" />
    </div>
  );
}

function ItemStickers() {
  return (
    <div className="absolute inset-0 z-[1]">
      <style>{`
        @keyframes floaty {
          0%, 100% { transform: translateY(0) rotate(var(--r)) scale(1); }
          50% { transform: translateY(-16px) rotate(var(--r)) scale(1.06); }
        }
      `}</style>
      {ITEMS.map((it) => (
        <img
          key={it.file}
          src={`${WIKI}/${it.file}`}
          alt=""
          width={it.size}
          height={it.size}
          className="absolute select-none object-contain"
          style={{
            left: it.x,
            top: it.y,
            width: it.size,
            height: it.size,
            // @ts-expect-error CSS custom property
            "--r": `${it.rot}deg`,
            animation: `floaty 5.5s ease-in-out ${it.delay} infinite`,
            filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.75))",
            imageRendering: "pixelated",
            opacity: 0.92,
          }}
          loading="eager"
          decoding="async"
        />
      ))}
    </div>
  );
}
