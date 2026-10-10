import { Link } from "@tanstack/react-router";
import { useState } from "react";

export const BRAND = "Brightlane Digital";

const nav = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground">B</span>
          {BRAND}
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          {nav.map((n) => (
            <Link key={n.to} to={n.to} className="text-sm text-muted-foreground hover:text-foreground"
              activeProps={{ className: "text-sm text-primary" }} activeOptions={{ exact: true }}>
              {n.label}
            </Link>
          ))}
          <Link to="/contact" className="btn-primary !py-2 text-sm">Get a free quote</Link>
        </nav>
        <button className="md:hidden text-2xl" onClick={() => setOpen(!open)} aria-label="Menu">☰</button>
      </div>
      {open && (
        <nav className="flex flex-col gap-4 border-t border-border px-6 py-4 md:hidden">
          {nav.map((n) => (
            <Link key={n.to} to={n.to} onClick={() => setOpen(false)}>{n.label}</Link>
          ))}
        </nav>
      )}
    </header>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="font-display text-xl font-bold">{BRAND}</p>
          <p className="mt-3 max-w-sm text-sm text-muted-foreground">
            Websites, digital marketing and data analytics for growing businesses in every country.
          </p>
        </div>
        <div>
          <p className="font-semibold">Company</p>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            {nav.map((n) => <li key={n.to}><Link to={n.to} className="hover:text-foreground">{n.label}</Link></li>)}
          </ul>
        </div>
        <div>
          <p className="font-semibold">Contact</p>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>hello@brightlane.digital</li>
            <li>+91 00000 00000</li>
            <li>Serving clients worldwide</li>
          </ul>
        </div>
      </div>
      <p className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} {BRAND}. All rights reserved.
      </p>
    </footer>
  );
}

export function CTA() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="bg-glow rounded-3xl border border-border bg-card p-10 text-center md:p-16">
        <h2 className="text-3xl font-bold md:text-5xl">Ready to grow your business?</h2>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
          Tell us about your goals. We'll reply within 24 hours with a clear plan and price.
        </p>
        <Link to="/contact" className="btn-primary mt-8">Start your project →</Link>
      </div>
    </section>
  );
}

export const services = [
  { icon: "🌐", title: "Website Development", text: "Fast, modern, mobile-friendly websites and online stores built to turn visitors into customers.", points: ["Business & corporate sites", "E-commerce stores", "Landing pages", "Web apps & dashboards"] },
  { icon: "📈", title: "Digital Marketing", text: "Get found and get chosen with SEO, social media and paid ads that bring real leads.", points: ["SEO & local SEO", "Google & Meta ads", "Social media management", "Content & email marketing"] },
  { icon: "📊", title: "Data Analytics", text: "Understand your customers and sales with clear reports and dashboards you can act on.", points: ["Analytics setup & tracking", "Sales & marketing dashboards", "Customer insights", "Monthly growth reports"] },
  { icon: "🛠️", title: "IT Support & Maintenance", text: "We keep your website secure, updated and running smoothly so you can focus on business.", points: ["Hosting & domains", "Security & backups", "Speed optimization", "Ongoing updates"] },
];
