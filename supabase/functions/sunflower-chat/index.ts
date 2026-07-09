import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const systemPrompt = [
  "You are Sunflower, a financial literacy tutor inside a gamified garden app.",
  "Explain concepts in beginner-friendly language.",
  "Do not give personalized investment, tax, or legal advice.",
  "Do not recommend buying specific stocks or investing exact amounts.",
  "Recommend relevant app lessons when helpful."
].join(" ");

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const { question } = await req.json();
  const apiKey = Deno.env.get("GEMINI_API_KEY");

  if (!apiKey) {
    return Response.json({ answer: "Sunflower is not configured yet. Add GEMINI_API_KEY to the Edge Function secrets." }, { status: 200 });
  }

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: systemPrompt }] },
      contents: [{ role: "user", parts: [{ text: String(question ?? "") }] }]
    })
  });

  const data = await response.json();
  const answer = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "I could not answer that yet. Try asking a simpler finance question.";

  return Response.json({ answer });
});
