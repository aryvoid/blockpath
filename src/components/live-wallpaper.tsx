export function LiveWallpaper() {
  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      aria-hidden="true"
    >
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 20% 30%, rgba(143,186,107,0.12), transparent 50%),
            radial-gradient(ellipse 60% 40% at 80% 70%, rgba(106,143,79,0.08), transparent 45%),
            linear-gradient(180deg, #0c0e0b 0%, #11140f 40%, #0a0c09 100%)
          `,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-bg/20 via-bg/45 to-bg/78" />
    </div>
  );
}
