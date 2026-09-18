export function LiveWallpaper() {
  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      aria-hidden="true"
    >
      {/* Live Minecraft-style loop (Pixabay royalty-free) */}
      <video
        className="absolute inset-0 size-full object-cover motion-reduce:hidden"
        autoPlay
        muted
        loop
        playsInline
        poster=""
      >
        <source
          src="https://cdn.pixabay.com/video/2025/05/13/278750_large.mp4"
          type="video/mp4"
        />
      </video>

      {/* CSS fallback sky if video fails / reduced motion */}
      <div
        className="absolute inset-0 motion-reduce:opacity-100 opacity-0"
        style={{
          background:
            "linear-gradient(180deg, #5b9bd5 0%, #87ceeb 40%, #a8d5a2 65%, #6b9e3e 80%, #3e2723 100%)",
        }}
      />

      {/* Soft readabilty overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-bg/35 via-bg/50 to-bg/82" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_15%,rgba(12,14,11,0.55)_100%)]" />

      {/* Floating item stickers */}
      <ItemStickers />
    </div>
  );
}

function ItemStickers() {
  const items = [
    { emoji: "⛏️", x: "8%", y: "18%", rot: -12, delay: "0s", size: "2.4rem" },
    { emoji: "💎", x: "88%", y: "22%", rot: 15, delay: "0.8s", size: "2.2rem" },
    { emoji: "🧱", x: "12%", y: "72%", rot: 8, delay: "1.4s", size: "2rem" },
    { emoji: "🗡️", x: "85%", y: "68%", rot: -18, delay: "0.4s", size: "2.3rem" },
    { emoji: "🔥", x: "22%", y: "42%", rot: 5, delay: "1.1s", size: "1.8rem" },
    { emoji: "🌳", x: "78%", y: "48%", rot: -8, delay: "1.8s", size: "2.1rem" },
    { emoji: "⭐", x: "48%", y: "12%", rot: 20, delay: "0.6s", size: "1.6rem" },
    { emoji: "🪓", x: "6%", y: "48%", rot: -22, delay: "2s", size: "1.9rem" },
  ];

  return (
    <>
      <style>{`
        @keyframes floaty {
          0%, 100% { transform: translateY(0) rotate(var(--r)); }
          50% { transform: translateY(-12px) rotate(var(--r)); }
        }
      `}</style>
      {items.map((it, i) => (
        <span
          key={i}
          className="absolute select-none opacity-[0.55] drop-shadow-lg"
          style={{
            left: it.x,
            top: it.y,
            fontSize: it.size,
            // @ts-expect-error CSS var
            "--r": `${it.rot}deg`,
            animation: `floaty 5s ease-in-out ${it.delay} infinite`,
            filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.45))",
          }}
        >
          {it.emoji}
        </span>
      ))}
    </>
  );
}
