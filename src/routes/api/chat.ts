import { createFileRoute } from "@tanstack/react-router";
import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { z } from "zod";

const Body = z.object({
  messages: z
    .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().max(4000) }))
    .min(1)
    .max(40),
});

const SYSTEM = `You are Nova, the AI assistant for Bitfarm, an IT services company serving businesses in every country.
Services: website development, mobile apps (Android/iOS, Flutter), custom software (ERP, CRM, billing, school/hospital systems), data science & AI/ML (forecasting, segmentation, recommendations), data analytics & BI (Power BI, Tableau, SQL, Excel), AI chatbots & automation, digital marketing (SEO, Google & Meta ads, social media), UI/UX & branding, database solutions, cloud & DevOps (AWS, Azure, GCP), cyber security, and IT support & maintenance.
Customer contact email: bitfarm.help@gmail.com. You are AI support, not a human agent. Never claim that a message has been sent; customers can email the team directly.
Be professional, warm and concise (under 120 words). Always reply only in English, even if the visitor writes in another language or asks you to switch languages. Understand their request and answer it in clear English; do not mirror non-English conversation history.
Answer the visitor's latest question directly. Do not add unrelated content, repeated greetings, unsolicited service lists or sales pitches. Recommend services only when relevant to their stated goal. If their request is unclear, ask one short clarifying question rather than guessing.
Never invent prices; explain the team sends a custom free quote within 24 hours via the Contact page.`;

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const parsed = Body.safeParse(await request.json().catch(() => null));
        if (!parsed.success) return Response.json({ error: "Invalid request" }, { status: 400 });
        // Netlify AI Gateway injects OPENAI_API_KEY and OPENAI_BASE_URL at runtime.
        const result = streamText({
          model: openai.responses("gpt-5.4-mini"),
          system: SYSTEM,
          messages: parsed.data.messages,
          abortSignal: request.signal,
          providerOptions: { openai: { store: false } },
          onError: ({ error }) => console.error("Chat stream failed", error),
        });
        return result.toTextStreamResponse();
      },
    },
  },
});
