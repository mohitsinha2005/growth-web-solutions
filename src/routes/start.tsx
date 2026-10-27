import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, Rocket, Target, LineChart, Star } from "lucide-react";
import { services } from "@/components/services-data";

export const Route = createFileRoute("/start")({
  head: () => ({
    meta: [
      { title: "Grow Your Business Online — Brightlane Digital" },
      { name: "description", content: "Get a website, marketing and data plan built for growth. Free consultation and custom quote within 24 hours." },
      { property: "og:title", content: "Grow Your Business Online — Brightlane Digital" },
      { property: "og:description", content: "Free growth consultation and custom quote within 24 hours." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

const benefits = [
  { icon: Rocket, t: "Launch fast", d: "Your website or app live in as little as 2–4 weeks." },
  { icon: Target, t: "More customers", d: "SEO and ads focused on leads, calls and sales." },
  { icon: LineChart, t: "Decisions with data", d: "Dashboards that show exactly where growth comes from." },
];
const plans = [
  { name: "Starter", for: "New & small businesses", items: ["5-page business website", "Mobile-friendly design", "Basic SEO setup", "WhatsApp & contact form"] },
  { name: "Growth", for: "Businesses ready to scale", items: ["Website or online store", "SEO + Google/Meta ads", "Analytics dashboard", "Monthly growth report"], featured: true },
  { name: "Enterprise", for: "Custom software & AI", items: ["Custom software / app", "Data science & AI models", "Cloud & security setup", "Dedicated support team"] },
];
const testimonials = [
  ["Our online orders grew within three months of launching the new store.", "Retail client"],
  ["The analytics dashboard finally showed us which ads actually work.", "Services client"],
  ["Professional, fast and always available on WhatsApp.", "Startup founder"],
];

function Landing() {
  return (
    <>
      <section className="mx-auto max-w-6xl px-6 py-20 text-center md:py-28">
        <span className="rounded-full border border-border bg-card/60 px-4 py-1.5 text-xs text-accent">Free growth consultation · Reply in 24h</span>
        <h1 className="hero-3d mx-auto mt-6 max-w-4xl text-4xl font-bold leading-tight md:text-7xl">
          Turn your business into a <span className="text-gradient">growth machine</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
          Websites, apps, marketing, data science and AI — everything your business needs to grow online, from one trusted team.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Link to="/contact" className="btn-primary">Get my free plan <ArrowRight size={18} /></Link>
          <Link to="/services" className="btn-ghost">See all services</Link>
        </div>
        <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
          {["No hidden costs", "Clients in 25+ countries", "Ongoing support"].map((x) => (
            <span key={x} className="flex items-center gap-1.5"><CheckCircle2 size={16} className="text-accent" />{x}</span>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-6 pb-20 md:grid-cols-3">
        {benefits.map((b) => (
          <div key={b.t} className="card-lift p-8">
            <b.icon className="text-primary" size={32} />
            <h3 className="mt-4 text-xl font-semibold">{b.t}</h3>
            <p className="mt-2 text-muted-foreground">{b.d}</p>
          </div>
        ))}
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <h2 className="text-center text-3xl font-bold md:text-4xl">12 services. One growth partner.</h2>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          {services.map((s) => (
            <span key={s.title} className="chip-3d flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-2 text-sm">
              <s.icon size={16} className="text-accent" />{s.title}
            </span>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <h2 className="text-center text-3xl font-bold md:text-4xl">Choose how you want to grow</h2>
        <p className="mt-3 text-center text-muted-foreground">Every business is different — we send a custom quote for your exact needs.</p>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {plans.map((p) => (
            <div key={p.name} className={`card-lift p-8 ${p.featured ? "plan-featured" : ""}`}>
              {p.featured && <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">Most popular</span>}
              <h3 className="mt-3 text-2xl font-bold">{p.name}</h3>
              <p className="text-sm text-muted-foreground">{p.for}</p>
              <ul className="mt-6 space-y-3">
                {p.items.map((i) => <li key={i} className="flex gap-2 text-sm"><CheckCircle2 size={18} className="shrink-0 text-accent" />{i}</li>)}
              </ul>
              <Link to="/contact" className={`${p.featured ? "btn-primary" : "btn-ghost"} mt-8 w-full justify-center`}>Get a quote</Link>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map(([q, w]) => (
            <figure key={q} className="card-lift p-8">
              <div className="flex gap-1 text-accent">{[0, 1, 2, 3, 4].map((i) => <Star key={i} size={16} fill="currentColor" />)}</div>
              <blockquote className="mt-4">"{q}"</blockquote>
              <figcaption className="mt-4 text-sm text-muted-foreground">— {w}</figcaption>
            </figure>
          ))}
        </div>
      </section>
    </>
  );
}
