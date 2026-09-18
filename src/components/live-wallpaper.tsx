export function LiveWallpaper() {
  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      aria-hidden="true"
    >
      {/* Sky */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, #5b9bd5 0%, #87ceeb 35%, #b8d4e8 55%, #c9e4a8 70%, #7cb342 78%, #558b2f 88%, #3e2723 100%)",
        }}
      />

      {/* Soft clouds */}
      <div className="absolute inset-x-0 top-[8%] h-[18%] opacity-90">
        <div
          className="absolute left-[5%] top-2 h-8 w-28 rounded-full bg-white/85"
          style={{ boxShadow: "22px 6px 0 4px rgba(255,255,255,0.85), 48px 2px 0 0 rgba(255,255,255,0.8)" }}
        />
        <div
          className="absolute left-[38%] top-0 h-10 w-36 rounded-full bg-white/80"
          style={{ boxShadow: "28px 8px 0 6px rgba(255,255,255,0.8), 58px 4px 0 2px rgba(255,255,255,0.75)" }}
        />
        <div
          className="absolute right-[12%] top-4 h-7 w-24 rounded-full bg-white/80"
          style={{ boxShadow: "18px 5px 0 3px rgba(255,255,255,0.8)" }}
        />
      </div>

      {/* Blocky terrain silhouette (SVG) */}
      <svg
        className="absolute bottom-0 left-0 w-full"
        viewBox="0 0 400 160"
        preserveAspectRatio="none"
        style={{ height: "42%" }}
      >
        {/* Far hills */}
        <path
          fill="#5d8a3e"
          d="M0 160 V95 H20 V85 H40 V95 H60 V75 H80 V90 H100 V70 H120 V88 H140 V65 H160 V80 H180 V60 H200 V82 H220 V55 H240 V78 H260 V68 H280 V85 H300 V72 H320 V90 H340 V78 H360 V92 H380 V85 H400 V160 Z"
        />
        {/* Mid terrain */}
        <path
          fill="#6b9e3e"
          d="M0 160 V110 H15 V100 H35 V110 H55 V95 H75 V108 H95 V92 H115 V105 H135 V88 H155 V100 H175 V85 H195 V98 H215 V90 H235 V102 H255 V88 H275 V105 H295 V95 H315 V108 H335 V100 H355 V110 H375 V102 H400 V160 Z"
        />
        {/* Grass top blocks strip */}
        <path
          fill="#7cb342"
          d="M0 160 V125 H25 V118 H50 V125 H75 V115 H100 V122 H125 V112 H150 V120 H175 V114 H200 V122 H225 V110 H250 V118 H275 V112 H300 V120 H325 V115 H350 V122 H375 V118 H400 V160 Z"
        />
        {/* Dirt */}
        <path
          fill="#8d6e63"
          d="M0 160 V138 H400 V160 Z"
        />
        {/* Stone base */}
        <path
          fill="#616161"
          d="M0 160 V148 H400 V160 Z"
        />
        {/* Block grid lines for voxel feel */}
        <g stroke="rgba(0,0,0,0.12)" strokeWidth="0.6" fill="none">
          {Array.from({ length: 20 }).map((_, i) => (
            <line key={`v${i}`} x1={i * 20} y1={110} x2={i * 20} y2={160} />
          ))}
          <line x1={0} y1={125} x2={400} y2={125} />
          <line x1={0} y1={138} x2={400} y2={138} />
          <line x1={0} y1={148} x2={400} y2={148} />
        </g>
      </svg>

      {/* Vignette so UI stays readable */}
      <div className="absolute inset-0 bg-gradient-to-b from-bg/25 via-bg/40 to-bg/80" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(12,14,11,0.55)_100%)]" />
    </div>
  );
}
