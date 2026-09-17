export function LiveWallpaper() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <img src="/wallpaper.jpg" alt="" className="absolute inset-0 size-full object-cover" />
      <video className="absolute inset-0 size-full object-cover motion-reduce:hidden" autoPlay muted loop playsInline poster="/wallpaper.jpg">
        <source src="/wallpaper.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-b from-bg/20 via-bg/45 to-bg/78" />
    </div>
  );
}
