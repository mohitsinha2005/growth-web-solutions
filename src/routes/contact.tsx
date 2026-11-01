import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, MessageCircle, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CONTACT_EMAIL, openCustomerChat } from "@/lib/customer-contact";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Contact — Techstone" },
      { name: "description", content: "Get a free quote for your website, marketing or analytics project." },
      { property: "og:title", content: "Contact — Techstone" },
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
        <h1 className="hero-3d text-4xl font-bold md:text-6xl">Let's <span className="text-gradient">talk</span></h1>
        <p className="mt-4 text-lg text-muted-foreground">Share your goals and we'll send a free plan and quote within 24 hours.</p>
        <ul className="mt-8 space-y-4">
          <li><p className="text-sm text-muted-foreground">Email</p><a href={`mailto:${CONTACT_EMAIL}`} className="break-all font-semibold text-accent hover:underline">{CONTACT_EMAIL}</a></li>
          <li><p className="text-sm text-muted-foreground">Clients</p><p className="font-semibold">Worldwide, all time zones</p></li>
        </ul>
        <div className="mt-10 grid gap-4">
          <div className="card-lift p-6">
            <span className="icon-3d"><MessageCircle /></span>
            <h2 className="mt-4 text-xl font-semibold">Customer chat</h2>
            <p className="mt-2 text-sm text-muted-foreground">Discuss your project with Nova, our AI assistant.</p>
            <Button onClick={openCustomerChat} className="mt-5"><MessageCircle />Chat with Nova</Button>
          </div>
          <a href={`mailto:${CONTACT_EMAIL}`} className="flex items-center gap-3 border-b border-border py-4 font-semibold text-accent hover:text-foreground"><Mail className="h-5 w-5" />Email our team<ArrowUpRight className="ml-auto h-5 w-5" /></a>
        </div>
      </div>
      <div className="rounded-3xl border border-border bg-card p-8">
        {sent ? (
          <div className="py-16 text-center">
            <p className="text-4xl">✓</p>
            <h2 className="mt-4 text-2xl font-semibold">Continue in your email app</h2>
            <p className="mt-2 text-muted-foreground">Send the prepared message to contact our team.</p>
            <Button variant="outline" className="mt-6" onClick={() => setSent(false)}>Back to message</Button>
          </div>
        ) : (
          <form className="space-y-4" onSubmit={(e) => {
            e.preventDefault();
            const data = new FormData(e.currentTarget);
            const body = `Name: ${data.get("name")}\nEmail: ${data.get("email")}\nCompany & country: ${data.get("company")}\nService: ${data.get("service")}\n\n${data.get("message")}`;
            window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Techstone project enquiry")}&body=${encodeURIComponent(body)}`;
            setSent(true);
          }}>
            <input name="name" aria-label="Your name" required placeholder="Your name" className={field} />
            <input name="email" aria-label="Email" required type="email" placeholder="Email" className={field} />
            <input name="company" aria-label="Company and country" placeholder="Company & country" className={field} />
            <select name="service" aria-label="Service you need" className={field} defaultValue="">
              <option value="" disabled>Service you need</option>
              <option>Website Development</option>
              <option>Digital Marketing</option>
              <option>Data Analytics</option>
              <option>IT Support</option>
            </select>
            <textarea name="message" aria-label="Tell us about your project" required rows={4} placeholder="Tell us about your project" className={field} />
            <Button type="submit" className="w-full"><Mail />Prepare email</Button>
          </form>
        )}
      </div>
    </section>
  );
}
