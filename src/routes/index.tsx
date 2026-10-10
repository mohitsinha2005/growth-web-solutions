import { createFileRoute, Link } from "@tanstack/react-router";
import hero from "@/assets/hero.jpg";
import { CTA, services } from "@/components/site";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Brightlane Digital — Websites, Marketing & Analytics" },
      { name: "description", content: "We build websites, run digital marketing and deliver data analytics that help businesses worldwide grow." },
      { property: "og:title", content: "Brightlane Digital — Websites, Marketing & Analytics" },
      { property: "og:description", content: "Websites, marketing and analytics for business growth, worldwide." },
    ],
  }),
  component: Index,
});

const stats = [["120+", "Projects delivered"], ["25+", "Countries served"], ["3x", "Average lead growth"], ["24h", "Response time"]];
const steps = [
  ["01", "Discover", "We learn your business, customers and goals."],
  ["02", "Plan", "A clear roadmap, timeline and fixed price."],
  ["03", "Build", "Design, development and campaigns, done right."],
  ["04", "Grow", "We measure results and keep improving."],
];

function Index() {
  return (
    <>
      <section className="bg-glow relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 md:grid-cols-2 md:py-28">
          <div>
            <span className="rounded-full border border-border px-3 py-1 text-xs text-accent">IT services for businesses worldwide</span>
            <h1 className="mt-6 text-4xl font-bold leading-tight md:text-6xl">
              We build, market & measure your <span className="text-gradient">business growth</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg text-muted-foreground">
              Professional websites, digital marketing and data analytics — one team, one plan, real results.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/contact" className="btn-primary">Get a free quote →</Link>
              <Link to="/services" className="btn-ghost">Our services</Link>
            </div>
          </div>
          <img src={hero} alt="Global network and growth chart" width={1600} height={1008} className="rounded-3xl border border-border" />
        </div>
      </section>

      <section className="border-y border-border bg-surface">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-6 py-10 md:grid-cols-4">
          {stats.map(([n, l]) => (
            <div key={l}><p className="font-display text-3xl font-bold text-primary">{n}</p><p className="text-sm text-muted-foreground">{l}</p></div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="text-3xl font-bold md:text-4xl">Everything you need to grow online</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {services.map((s) => (
            <div key={s.title} className="card-lift p-8">
              <span className="text-3xl">{s.icon}</span>
              <h3 className="mt-4 text-xl font-semibold">{s.title}</h3>
              <p className="mt-2 text-muted-foreground">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-10">
        <h2 className="text-3xl font-bold md:text-4xl">How we work</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-4">
          {steps.map(([n, t, d]) => (
            <div key={n} className="border-t-2 border-primary pt-4">
              <p className="font-display text-sm text-primary">{n}</p>
              <h3 className="mt-2 text-lg font-semibold">{t}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <CTA />
    </>
  );
}
