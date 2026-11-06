import { createFileRoute } from "@tanstack/react-router";
import { createOpenAI, openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { z } from "zod";
import { COMPANY_FACTS, RESPONSE_PROMISE } from "@/lib/company-facts";

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
Company track record: ${COMPANY_FACTS.projectsDelivered}+ projects delivered, ${COMPANY_FACTS.countriesServed} countries served. ${RESPONSE_PROMISE}
Never invent prices; invite visitors to request a custom free quote via the Contact page. The four-hour maximum is the team's response time, not a project completion deadline.`;

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const parsed = Body.safeParse(await request.json().catch(() => null));
        if (!parsed.success) return Response.json({ error: "Invalid request" }, { status: 400 });
        // Prefer Lovable AI Gateway; fall back to a host-injected OpenAI key (e.g. Netlify) on external copies.
        const lovableKey = process.env["LOVABLE_API_KEY"];
        const hasOpenAI = Boolean(process.env["OPENAI_API_KEY"]);
        if (!lovableKey && !hasOpenAI) {
          return Response.json({ error: "The AI assistant is not configured on this website yet." }, { status: 503 });
        }
        let model;
        let providerOptions: Record<string, Record<string, unknown>>;
        if (lovableKey) {
          const lovable = createOpenAI({
            baseURL: "https://ai.gateway.lovable.dev/v1",
            apiKey: lovableKey,
            headers: { "Lovable-API-Key": lovableKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
          });
          model = lovable.responses("openai/gpt-6-astra");
          providerOptions = {
            openai: { forceReasoning: true, reasoningEffort: "low", store: false, include: ["reasoning.encrypted_content"] },
          };
        } else {
          model = openai.responses("gpt-5.4-mini");
          providerOptions = { openai: { store: false } };
        }
        let failure: string | null = null;
        const result = streamText({
          model,
          system: SYSTEM,
          messages: parsed.data.messages,
          abortSignal: request.signal,
          maxRetries: 0,
          providerOptions: providerOptions as never,
          onError: ({ error }) => {
            console.error("Chat stream failed", error);
            const status = (error as { statusCode?: number })?.statusCode;
            failure =
              status === 402 || status === 403
                ? "Nova has reached its AI usage limit. Please email bitfarm.help@gmail.com and our team will help you."
                : status === 429
                  ? "Nova is busy right now. Please try again in a moment."
                  : "Nova couldn't answer just now. Please try again.";
          },
        });
        // Surface a clear message instead of an empty reply when the AI call fails.
        const encoder = new TextEncoder();
        const stream = new ReadableStream<Uint8Array>({
          async start(controller) {
            let sent = false;
            try {
              for await (const chunk of result.textStream) {
                if (chunk) {
                  sent = true;
                  controller.enqueue(encoder.encode(chunk));
                }
              }
            } catch (error) {
              console.error("Chat stream error", error);
            }
            if (!sent) controller.enqueue(encoder.encode(failure ?? "Nova couldn't answer just now. Please try again."));
            controller.close();
          },
        });
        return new Response(stream, {
          headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-cache, no-transform" },
        });
      },
    },
  },
});
