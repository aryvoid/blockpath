import { createFileRoute } from "@tanstack/react-router";
import { Calculator } from "@/components/calculator";
import { LiveWallpaper } from "@/components/live-wallpaper";
import { Credits } from "@/components/credits";
import { SeoFaq } from "@/components/seo-faq";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return (
    <main className="relative min-h-dvh bg-transparent">
      <LiveWallpaper />
      <Calculator />
      <SeoFaq />
      <Credits />
    </main>
  );
}
