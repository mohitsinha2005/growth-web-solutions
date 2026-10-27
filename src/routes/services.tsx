import { createFileRoute } from "@tanstack/react-router";
import { CTA, services } from "@/components/site";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — Brightlane Digital" },
      { name: "description", content: "Website development, digital marketing, data analytics and IT support for businesses in every country." },
      { property: "og:title", content: "Services — Brightlane Digital" },
      { property: "og:description", content: "Websites, marketing, analytics and IT support under one roof." },
    ],
  }),
  component: Services,
});

function Services() {
  return (
    <>
      <section className="bg-glow mx-auto max-w-6xl px-6 py-20">
        <h1 className="hero-3d text-4xl font-bold md:text-6xl">Our <span className="text-gradient">services</span></h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">12 services from one team — software, apps, data science, AI, marketing and support for every stage of your growth.</p>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <div key={s.title} className="card-lift p-8">
              <span className="icon-3d"><s.icon size={26} /></span>
              <h2 className="mt-4 text-2xl font-semibold">{s.title}</h2>
              <p className="mt-2 text-muted-foreground">{s.text}</p>
              <ul className="mt-5 space-y-2">
                {s.points.map((p) => <li key={p} className="flex gap-2 text-sm"><span className="text-primary">✓</span>{p}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </section>
      <CTA />
    </>
  );
}
