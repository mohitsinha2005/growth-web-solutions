import { createFileRoute } from "@tanstack/react-router";
import { CTA } from "@/components/site";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — Brightlane Digital" },
      { name: "description", content: "A young, global IT startup helping businesses grow with websites, marketing and data." },
      { property: "og:title", content: "About Us — Brightlane Digital" },
      { property: "og:description", content: "Meet the team helping businesses grow worldwide." },
    ],
  }),
  component: About,
});

const values = [
  ["Results first", "We measure success by your growth, not by hours worked."],
  ["Honest pricing", "Clear quotes with no hidden costs."],
  ["Global mindset", "We work across time zones with clients in every country."],
  ["Long-term partner", "We stay with you after launch to keep improving."],
];

function About() {
  return (
    <>
      <section className="bg-glow mx-auto max-w-6xl px-6 py-20">
        <h1 className="text-4xl font-bold md:text-6xl">Built to help <span className="text-gradient">businesses grow</span></h1>
        <p className="mt-6 max-w-3xl text-lg text-muted-foreground">
          We're a new-generation IT startup with one mission: give every business — small or large, anywhere in the world —
          the technology, marketing and data it needs to compete and win online.
        </p>
        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {values.map(([t, d]) => (
            <div key={t} className="card-lift p-8">
              <h2 className="text-xl font-semibold text-primary">{t}</h2>
              <p className="mt-2 text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </section>
      <CTA />
    </>
  );
}
