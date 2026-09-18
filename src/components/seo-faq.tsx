const FAQS = [
  {
    q: "How do I calculate distance between two Minecraft coordinates?",
    a: "Paste your current position and destination (X Y Z from F3) into Blockpath. It calculates horizontal distance, full 3D distance, chunk distance, and the exact compass heading you should face.",
  },
  {
    q: "How do I travel faster in Minecraft?",
    a: "Compare walk, sprint, horse, ice boat, and elytra travel times on Blockpath. For long trips, use a Nether portal highway (1 Nether block ≈ 8 Overworld blocks) or ice boat roads and elytra with fireworks.",
  },
  {
    q: "How do Nether coordinates work?",
    a: "Divide Overworld X and Z by 8 to get the matching Nether portal spot (Y stays similar). Blockpath shows both Nether and Overworld paired coordinates so you can link portals accurately.",
  },
  {
    q: "What is the fastest way to cross long distances in Minecraft?",
    a: "Elytra with fireworks is usually fastest in the Overworld. On the ground, blue ice boat highways are extremely fast. For the longest routes, travel in the Nether at 8× scale, then exit near your destination.",
  },
  {
    q: "How do I find the direction to walk in Minecraft?",
    a: "Blockpath shows Minecraft yaw degrees and a compass direction (N, NE, E, etc.) plus a north-up relative map from your position to the destination so you know which way to face.",
  },
] as const;

export function SeoFaq() {
  return (
    <section className="relative z-10 mx-auto max-w-3xl px-4 pb-2 sm:px-6">
      <div className="rounded-2xl border border-border/80 bg-card/70 p-4 shadow-xl backdrop-blur-md sm:p-5">
        <h2 className="text-lg font-bold text-fg">
          Minecraft distance & travel help
        </h2>
        <p className="mt-1 text-sm text-muted">
          Free online Minecraft coordinate distance calculator — heading, travel
          time, Nether portal math, and waypoints.
        </p>
        <div className="mt-4 space-y-3">
          {FAQS.map((item) => (
            <details
              key={item.q}
              className="group rounded-xl border border-border/60 bg-bg/40 px-3 py-2.5 open:bg-bg/55"
            >
              <summary className="cursor-pointer list-none text-sm font-medium text-fg marker:content-none [&::-webkit-details-marker]:hidden">
                <span className="flex items-start justify-between gap-2">
                  <span>{item.q}</span>
                  <span className="shrink-0 text-muted transition group-open:rotate-45">
                    +
                  </span>
                </span>
              </summary>
              <p className="mt-2 text-sm leading-relaxed text-muted">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
