import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Brightlane Digital" },
      { name: "description", content: "Get a free quote for your website, marketing or analytics project." },
      { property: "og:title", content: "Contact — Brightlane Digital" },
      { property: "og:description", content: "Tell us about your project and get a free quote within 24 hours." },
    ],
  }),
  component: Contact,
});

const field = "w-full rounded-xl border border-input bg-secondary px-4 py-3 outline-none focus:border-primary";

function Contact() {
  const [sent, setSent] = useState(false);
  return (
    <section className="bg-glow mx-auto grid max-w-6xl gap-12 px-6 py-20 md:grid-cols-2">
      <div>
        <h1 className="text-4xl font-bold md:text-6xl">Let's <span className="text-gradient">talk</span></h1>
        <p className="mt-4 text-lg text-muted-foreground">Share your goals and we'll send a free plan and quote within 24 hours.</p>
        <ul className="mt-8 space-y-4">
          <li><p className="text-sm text-muted-foreground">Email</p><p className="font-semibold">hello@brightlane.digital</p></li>
          <li><p className="text-sm text-muted-foreground">Phone / WhatsApp</p><p className="font-semibold">+91 00000 00000</p></li>
          <li><p className="text-sm text-muted-foreground">Clients</p><p className="font-semibold">Worldwide, all time zones</p></li>
        </ul>
      </div>
      <div className="rounded-3xl border border-border bg-card p-8">
        {sent ? (
          <div className="py-16 text-center">
            <p className="text-4xl">✓</p>
            <h2 className="mt-4 text-2xl font-semibold">Thank you!</h2>
            <p className="mt-2 text-muted-foreground">We'll get back to you within 24 hours.</p>
          </div>
        ) : (
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
            <input required placeholder="Your name" className={field} />
            <input required type="email" placeholder="Email" className={field} />
            <input placeholder="Company & country" className={field} />
            <select className={field} defaultValue="">
              <option value="" disabled>Service you need</option>
              <option>Website Development</option>
              <option>Digital Marketing</option>
              <option>Data Analytics</option>
              <option>IT Support</option>
            </select>
            <textarea required rows={4} placeholder="Tell us about your project" className={field} />
            <button className="btn-primary w-full justify-center">Send message</button>
          </form>
        )}
      </div>
    </section>
  );
}
