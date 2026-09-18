const ITEMS = [
  { id: "diamond_sword", x: "7%", y: "16%", rot: -14, delay: "0s", size: 44 },
  { id: "ender_pearl", x: "88%", y: "18%", rot: 12, delay: "0.7s", size: 42 },
  { id: "totem_of_undying", x: "10%", y: "68%", rot: 8, delay: "1.3s", size: 46 },
  { id: "axolotl_bucket", x: "84%", y: "64%", rot: -10, delay: "0.4s", size: 48 },
  { id: "diamond", x: "20%", y: "38%", rot: 18, delay: "1s", size: 36 },
  { id: "grass_block", x: "76%", y: "42%", rot: -6, delay: "1.6s", size: 40 },
  { id: "nether_star", x: "48%", y: "10%", rot: 22, delay: "0.5s", size: 38 },
  { id: "diamond_pickaxe", x: "5%", y: "46%", rot: -20, delay: "1.9s", size: 42 },
  { id: "torch", x: "92%", y: "40%", rot: 6, delay: "1.2s", size: 34 },
  { id: "axolotl_spawn_egg", x: "30%", y: "78%", rot: -8, delay: "2.1s", size: 40 },
] as const;

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

      <div className="absolute inset-0 bg-gradient-to-b from-bg/35 via-bg/50 to-bg/82" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_15%,rgba(12,14,11,0.55)_100%)]" />

      <ItemStickers />
    </div>
  );
}

function ItemStickers() {
  return (
    <>
      <style>{`
        @keyframes floaty {
          0%, 100% { transform: translateY(0) rotate(var(--r)); }
          50% { transform: translateY(-14px) rotate(var(--r)); }
        }
      `}</style>
      {ITEMS.map((it) => (
        <img
          key={it.id}
          src={`https://mc-icons.com/full/${it.id}.png`}
          alt=""
          width={it.size}
          height={it.size}
          className="absolute select-none object-contain opacity-80"
          style={{
            left: it.x,
            top: it.y,
            width: it.size,
            height: it.size,
            // @ts-expect-error CSS custom property
            "--r": `${it.rot}deg`,
            animation: `floaty 5.5s ease-in-out ${it.delay} infinite`,
            filter: "drop-shadow(0 3px 8px rgba(0,0,0,0.55))",
            imageRendering: "pixelated",
          }}
          loading="lazy"
          decoding="async"
        />
      ))}
    </>
  );
}
