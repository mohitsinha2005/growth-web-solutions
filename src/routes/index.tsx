import { createFileRoute, Link } from "@tanstack/react-router";
import { CTA, services } from "@/components/site";
import { Showreel } from "@/components/Showreel";
import { COMPANY_FACTS, RESPONSE_PROMISE } from "@/lib/company-facts";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import growthBackground from "@/assets/bg-growth.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Bitfarm — Websites, Marketing & Analytics" },
      { name: "description", content: "We build websites, run digital marketing and deliver data analytics that help businesses worldwide grow." },
      { property: "og:title", content: "Bitfarm — Websites, Marketing & Analytics" },
      { property: "og:description", content: "Websites, marketing and analytics for business growth, worldwide." },
    ],
  }),
  component: Index,
});

const stats = [[`${COMPANY_FACTS.projectsDelivered}+`, "Projects delivered"], [`${COMPANY_FACTS.countriesServed}`, "Countries served"], ["3x", "Average lead growth"], [`${COMPANY_FACTS.maximumResponseHours}h max`, "Response time"]];
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
  ["How much will my project cost?", `Every project is different. Share your goals for a free custom quote. ${RESPONSE_PROMISE}`],
  ["Do you offer support after launch?", "Yes. We provide maintenance, updates, marketing and analytics support plans."],
  ["Can I talk to your AI assistant?", "Yes. Click “Ask AI” and talk with Nova by voice or text, anytime."],
];

function Index() {
  return (
    <>
      <section className="home-hero relative isolate overflow-hidden" style={{ "--hero-image": `url(${growthBackground})` } as React.CSSProperties}>
        <div className="mx-auto max-w-6xl px-6 py-14 md:py-16">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-accent">Technology · Marketing · Data</p>
            <h1 className="hero-3d mt-5 text-5xl font-bold leading-tight md:text-7xl">Bitfarm</h1>
            <p className="mt-3 font-display text-2xl font-semibold md:text-3xl">Digital growth, built right.</p>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground md:text-lg">
              Professional websites, digital marketing and data analytics — one team, one plan, real results.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild className="h-12 px-6"><Link to="/contact">Get a free quote <ArrowRight /></Link></Button>
              <Button asChild variant="outline" className="h-12 px-6"><Link to="/services">Our services</Link></Button>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-surface/70">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-6 py-7 md:grid-cols-4">
          {stats.map(([n, l]) => (
            <div key={l}><p className="font-display text-2xl font-bold text-foreground">{n}</p><p className="mt-1 text-xs text-muted-foreground md:text-sm">{l}</p></div>
          ))}
        </div>
      </section>

      <Showreel />

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
        <Button asChild variant="outline" className="mt-8 h-11"><Link to="/services">View all 12 services <ArrowRight /></Link></Button>
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
            <span key={i} className="chip-3d border-b border-border px-1 py-3 text-sm">{i}</span>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-20">
        <h2 className="text-3xl font-bold md:text-4xl">Frequently asked questions</h2>
        <div className="mt-8 divide-y divide-border border-y border-border">
          {faqs.map(([q, a]) => (
            <details key={q} className="faq py-5">
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
