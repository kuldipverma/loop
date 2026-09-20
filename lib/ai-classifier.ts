import { z } from "zod";

// Zod Schema to validate AI output
export const ClassificationSchema = z.object({
  sentiment: z.enum(["POS", "NEG", "NEU"]),
  sentimentScore: z.number().min(-1).max(1),
  themes: z.array(z.string()),
  featureArea: z.string(),
  rationale: z.string(),
});

export type ClassificationResult = z.infer<typeof ClassificationSchema>;

export async function classifyFeedbackText(title: string, description?: string): Promise<ClassificationResult> {
  const content = `Title: ${title}\nDescription: ${description || "N/A"}`;

  // Call OpenAI / Gemini / Claude API
  // Using Structured Output / JSON mode prompt
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `You are an AI feedback classifier. Return ONLY a JSON object matching this schema:
{
  "sentiment": "POS" | "NEG" | "NEU",
  "sentimentScore": number between -1.0 and 1.0,
  "themes": ["string"],
  "featureArea": "string",
  "rationale": "string"
}`,
        },
        {
          role: "user",
          content: `Classify this user feedback:\n${content}`,
        },
      ],
    }),
  });

  const data = await response.json();
  const rawJson = JSON.parse(data.choices[0].message.content);

  // Validate with Zod before returning
  return ClassificationSchema.parse(rawJson);
}