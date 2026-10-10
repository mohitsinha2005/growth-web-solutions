import { createFileRoute } from "@tanstack/react-router";
import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";
import { z } from "zod";

const Body = z.object({
  messages: z
    .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().max(4000) }))
    .min(1)
    .max(40),
});

const SYSTEM = `You are Nova, the AI assistant for Brightlane Digital, an IT services company serving businesses in every country.
Services: website development, mobile apps (Android/iOS, Flutter), custom software (ERP, CRM, billing, school/hospital systems), data science & AI/ML (forecasting, segmentation, recommendations), data analytics & BI (Power BI, Tableau, SQL, Excel), AI chatbots & automation, digital marketing (SEO, Google & Meta ads, social media), UI/UX & branding, database solutions, cloud & DevOps (AWS, Azure, GCP), cyber security, and IT support & maintenance.
Be professional, warm and concise (under 120 words). Reply in the visitor's language. Recommend the right services for their goals.
Never invent prices; explain the team sends a custom free quote within 24 hours via the Contact page.`;

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const parsed = Body.safeParse(await request.json().catch(() => null));
        if (!parsed.success) return Response.json({ error: "Invalid request" }, { status: 400 });
        const key = process.env['LOVABLE_API_KEY'];
        if (!key) return Response.json({ error: "AI is not configured" }, { status: 500 });
        const provider = createOpenAI({
          baseURL: "https://ai.gateway.lovable.dev/v1",
          apiKey: key,
          headers: { "Lovable-API-Key": key, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
        });
        const result = streamText({
          model: provider.responses("openai/gpt-6-astra"),
          system: SYSTEM,
          messages: parsed.data.messages,
          abortSignal: request.signal,
          providerOptions: {
            openai: {
              forceReasoning: true,
              reasoningEffort: "low",
              reasoningSummary: "auto",
              store: false,
              include: ["reasoning.encrypted_content"],
            },
          },
        });
        return result.toTextStreamResponse();
      },
    },
  },
});
