import type { ReactNode } from "react";
import {
  Outlet,
  createRootRoute,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import appCss from "../styles.css?url";

const SITE_URL = "https://blockpath.vercel.app";
const TITLE = "Blockpath — Minecraft Coordinate Calculator";
const DESCRIPTION =
  "Free Minecraft coordinate distance calculator. Get horizontal & 3D distance, compass heading, travel time (walk, horse, ice boat, elytra), Nether pairing, relative map, and save waypoints.";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Blockpath",
  url: SITE_URL,
  description: DESCRIPTION,
  applicationCategory: "UtilityApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  author: {
    "@type": "Person",
    name: "aryvoid",
    url: "https://github.com/aryvoid",
  },
  keywords: "Minecraft, coordinates, distance calculator, Nether, waypoints",
};

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      {
        name: "keywords",
        content:
          "minecraft calculator, minecraft coordinates, minecraft distance, nether coordinates, minecraft heading, minecraft waypoints, coordinate calculator, blockpath",
      },
      { name: "author", content: "aryvoid" },
      { name: "creator", content: "aryvoid" },
      { name: "theme-color", content: "#0e120e" },
      { name: "robots", content: "index, follow" },
      { name: "googlebot", content: "index, follow" },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Blockpath" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:url", content: SITE_URL },
      { property: "og:locale", content: "en_US" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
    ],
    links: [
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
      { rel: "canonical", href: SITE_URL },
      { rel: "stylesheet", href: appCss },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(jsonLd),
      },
    ],
  }),
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="min-h-dvh bg-bg text-fg antialiased">
        {children}
        <Scripts />
      </body>
    </html>
  );
}
