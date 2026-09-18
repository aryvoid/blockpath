export function Credits() {
  return (
    <footer className="relative z-10 mx-auto mt-2 max-w-3xl px-4 pb-10 sm:px-6">
      <div className="rounded-2xl border border-border/80 bg-card/70 px-4 py-5 text-center shadow-xl backdrop-blur-md">
        <p className="text-sm text-fg">
          Made by{" "}
          <a
            href="https://github.com/aryvoid"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-accent hover:underline"
          >
            aryvoid
          </a>
        </p>
        <p className="mt-1.5 text-xs text-muted">
          Minecraft:{" "}
          <span className="font-mono text-fg">.aryvoidd</span>
          {" · "}
          <a
            href="https://namemc.com/search?q=aryvoidd"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent/90 hover:underline"
          >
            NameMC
          </a>
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
          <a
            href="https://www.buymeacoffee.com/aryvoid"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-[#FFDD00] px-4 py-2 text-sm font-bold text-[#0d0c0a] shadow-md transition hover:brightness-110"
          >
            <span aria-hidden>☕</span>
            Buy me a coffee
          </a>
          <a
            href="https://github.com/aryvoid/blockpath"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl border border-border bg-bg/50 px-3 py-2 text-xs text-muted transition hover:border-accent hover:text-accent"
          >
            GitHub
          </a>
        </div>
        <p className="mt-3 text-[10px] text-muted/70">
          Blockpath · fan tool · not affiliated with Mojang / Microsoft
        </p>
      </div>
    </footer>
  );
}
