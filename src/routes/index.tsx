import { createFileRoute } from "@tanstack/react-router";
import { Calculator } from "@/components/calculator";
import { LiveWallpaper } from "@/components/live-wallpaper";
import { Credits } from "@/components/credits";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return (
    <main className="relative min-h-dvh bg-transparent">
      <LiveWallpaper />
      <Calculator />
      <Credits />
    </main>
  );
}
