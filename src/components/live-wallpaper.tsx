/**
 * Floating item stickers — Minecraft Wiki invicons (stable).
 * 3D-style depth via CSS perspective / rotate (resource-pack models
 * are in-game JSON, not web PNGs; this gives a clear 3D-card look).
 */
const ITEMS = [
  { file: "Invicon_Diamond_Sword.png", x: "5%", y: "12%", rot: -18, delay: "0s", size: 56 },
  { file: "Invicon_Ender_Pearl.png", x: "85%", y: "14%", rot: 14, delay: "0.6s", size: 52 },
  { file: "Invicon_Totem_of_Undying.png", x: "7%", y: "64%", rot: 10, delay: "1.2s", size: 58 },
  { file: "Invicon_Bucket_of_Axolotl.png", x: "81%", y: "60%", rot: -12, delay: "0.3s", size: 60 },
  { file: "Invicon_Diamond.png", x: "16%", y: "34%", rot: 20, delay: "0.9s", size: 44 },
  { file: "Invicon_Grass_Block.png", x: "72%", y: "38%", rot: -8, delay: "1.5s", size: 52 },
  { file: "Invicon_Nether_Star.png", x: "44%", y: "6%", rot: 16, delay: "0.4s", size: 48 },
  { file: "Invicon_Diamond_Pickaxe.png", x: "3%", y: "42%", rot: -22, delay: "1.8s", size: 54 },
  { file: "Invicon_Torch.png", x: "88%", y: "36%", rot: 8, delay: "1.1s", size: 42 },
  { file: "Invicon_Enchanted_Golden_Apple.png", x: "26%", y: "74%", rot: -10, delay: "2s", size: 50 },
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

      <div className="absolute inset-0 bg-gradient-to-b from-bg/20 via-bg/30 to-bg/65" />

      <ItemStickers />

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(12,14,11,0.4)_100%)]" />
    </div>
  );
}

function ItemStickers() {
  return (
    <div
      className="absolute inset-0 z-[1]"
      style={{ perspective: "900px" }}
    >
      <style>{`
        @keyframes float3d {
          0%, 100% {
            transform: translateY(0) rotateY(var(--ry)) rotateZ(var(--rz)) scale(1);
          }
          50% {
            transform: translateY(-18px) rotateY(calc(var(--ry) + 12deg)) rotateZ(var(--rz)) scale(1.08);
          }
        }
      `}</style>
      {ITEMS.map((it, i) => (
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
            // @ts-expect-error CSS vars
            "--ry": `${i % 2 === 0 ? 18 : -18}deg`,
            // @ts-expect-error CSS vars
            "--rz": `${it.rot}deg`,
            animation: `float3d 5.5s ease-in-out ${it.delay} infinite`,
            filter: "drop-shadow(4px 8px 12px rgba(0,0,0,0.65))",
            imageRendering: "pixelated",
            opacity: 0.95,
            transformStyle: "preserve-3d",
          }}
          loading="eager"
          decoding="async"
        />
      ))}
    </div>
  );
}
