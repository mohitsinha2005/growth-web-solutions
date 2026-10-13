import { createFileRoute, Link } from "@tanstack/react-router";
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
const industries = ["Retail & E-commerce", "Healthcare", "Education", "Real Estate", "Finance", "Restaurants", "Manufacturing", "Startups", "Travel"];
const faqs = [
  ["Do you work with clients outside my country?", "Yes. We work remotely with businesses in every country and adjust meetings to your time zone."],
  ["How long does a website take?", "Most business websites are ready in 2–4 weeks, depending on pages and features."],
  ["How much will my project cost?", "Every project is different. Share your goals and we send a free custom quote within 24 hours."],
  ["Do you offer support after launch?", "Yes. We provide maintenance, updates, marketing and analytics support plans."],
  ["Can I talk to your AI assistant?", "Yes. Click “Ask AI” and talk with Nova by voice or text, anytime."],
];

function Index() {
  return (
    <>
      <section className="bg-glow relative isolate overflow-hidden">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 md:py-36">
          <div className="max-w-2xl">
            <span className="rounded-full border border-border px-3 py-1 text-xs text-accent">IT services for businesses worldwide</span>
            <h1 className="hero-3d mt-6 text-4xl font-bold leading-tight md:text-6xl">
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
        </div>
      </section>

      <section className="border-y border-border bg-surface/70 backdrop-blur">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-6 py-10 md:grid-cols-4">
          {stats.map(([n, l]) => (
            <div key={l}><p className="font-display text-3xl font-bold text-primary">{n}</p><p className="text-sm text-muted-foreground">{l}</p></div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="text-3xl font-bold md:text-4xl">Everything you need to grow online</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.slice(0, 6).map((s) => (
            <div key={s.title} className="card-lift p-8">
              <span className="icon-3d"><s.icon size={26} /></span>
              <h3 className="mt-4 text-xl font-semibold">{s.title}</h3>
              <p className="mt-2 text-muted-foreground">{s.text}</p>
            </div>
          ))}
        </div>
        <Link to="/services" className="btn-ghost mt-8">View all 12 services →</Link>
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

      <section className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="text-3xl font-bold md:text-4xl">Industries we serve</h2>
        <div className="mt-8 flex flex-wrap gap-3">
          {industries.map((i) => (
            <span key={i} className="chip-3d rounded-full border border-border bg-card/70 px-4 py-2 text-sm">{i}</span>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-20">
        <h2 className="text-3xl font-bold md:text-4xl">Frequently asked questions</h2>
        <div className="mt-8 space-y-3">
          {faqs.map(([q, a]) => (
            <details key={q} className="faq card-lift p-5">
              <summary className="font-semibold">{q}</summary>
              <p className="mt-3 text-muted-foreground">{a}</p>
            </details>
          ))}
        </div>
      </section>

      <CTA />
    </>
  );
}
