import { createFileRoute } from "@tanstack/react-router";
import { LiveWallpaper } from "@/components/live-wallpaper";
import { Credits } from "@/components/credits";
import { SeoFaq } from "@/components/seo-faq";
import { ToolShell } from "@/components/tool-shell";
import { PwaRegister } from "@/components/pwa-register";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return (
    <main className="relative min-h-dvh bg-transparent">
      <PwaRegister />
      <LiveWallpaper />
      <ToolShell />
      <SeoFaq />
      <Credits />
    </main>
  );
}
