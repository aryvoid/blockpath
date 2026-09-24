import type { ReactNode } from "react";
import {
  Outlet,
  createRootRoute,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import appCss from "../styles.css?url";

const SITE_URL = "https://blockpath.vercel.app";
const TITLE =
  "Minecraft Distance Calculator — Coordinates, Heading & Travel Time | Blockpath";
const DESCRIPTION =
  "Calculate Minecraft distance between coordinates instantly. Get compass heading, walk/sprint/horse/ice boat/elytra travel time, Nether portal pairing, relative map, and save waypoints. Free online tool.";
const OG_IMAGE = `${SITE_URL}/og.png`;

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "Blockpath",
      url: SITE_URL,
      description: DESCRIPTION,
      applicationCategory: "UtilityApplication",
      operatingSystem: "Any",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      author: {
        "@type": "Person",
        name: "aryvoid",
        url: "https://github.com/aryvoid",
      },
      image: OG_IMAGE,
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "How do I calculate distance between two Minecraft coordinates?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Paste your current position and destination (X Y Z from F3) into Blockpath. It calculates horizontal distance, full 3D distance, chunk distance, and the exact compass heading you should face.",
          },
        },
        {
          "@type": "Question",
          name: "How do I travel faster in Minecraft?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Compare walk, sprint, horse, ice boat, and elytra travel times. For long trips use a Nether portal highway (1 Nether block ≈ 8 Overworld blocks) or ice boat roads and elytra with fireworks.",
          },
        },
        {
          "@type": "Question",
          name: "How do Nether coordinates work?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Divide Overworld X and Z by 8 to get the matching Nether portal spot. Blockpath shows both Nether and Overworld paired coordinates so you can link portals accurately.",
          },
        },
      ],
    },
  ],
};

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      {
        name: "keywords",
        content:
          "minecraft distance calculator, calculate minecraft distance, minecraft coordinates calculator, minecraft travel time, how to go fast in minecraft, nether coordinates, minecraft heading, minecraft waypoints, ice boat speed, elytra travel time, blockpath",
      },
      { name: "author", content: "aryvoid" },
      { name: "creator", content: "aryvoid" },
      { name: "theme-color", content: "#0c1210" },
      { name: "mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
      { name: "apple-mobile-web-app-title", content: "Blockpath" },
      { name: "robots", content: "index, follow" },
      { name: "googlebot", content: "index, follow" },
      {
        name: "google-site-verification",
        content: "RwqqJOYj66i824pR4M1AnHwinUUJOtHLIhH1sxB7G4I",
      },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Blockpath" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:url", content: SITE_URL },
      { property: "og:locale", content: "en_US" },
      { property: "og:image", content: OG_IMAGE },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "Blockpath — Minecraft tools" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
      { name: "twitter:image", content: OG_IMAGE },
    ],
    links: [
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
      { rel: "apple-touch-icon", href: "/og.png" },
      { rel: "manifest", href: "/manifest.webmanifest" },
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
