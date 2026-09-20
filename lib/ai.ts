import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";

export const AnalysisResultSchema = z.object({
  sentiment: z.enum(["POSITIVE", "NEGATIVE", "NEUTRAL"]),
  theme: z.string(),
  summary: z.string(),
});

export type AnalysisResult = z.infer<typeof AnalysisResultSchema>;

export async function analyzeFeedbackWithClaude(
  feedbackText: string
): Promise<AnalysisResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  // Agar API key nahi hai ya invalid placeholder hai to mock response generate karo
  if (!apiKey || apiKey.includes("your_key_here") || apiKey.trim() === "") {
    return getMockAnalysis(feedbackText);
  }

  try {
    const anthropic = new Anthropic({ apiKey });

    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1000,
      temperature: 0,
      messages: [
        {
          role: "user",
          content: `Analyze this feedback and reply ONLY with a valid JSON object without markdown tags:
{"sentiment": "POSITIVE" | "NEGATIVE" | "NEUTRAL", "theme": "UI/UX" | "Performance" | "Bug" | "General", "summary": "One sentence summary"}

Feedback: "${feedbackText}"`,
        },
      ],
    });

    const contentBlock = response.content[0];
    if (contentBlock.type !== "text") {
      throw new Error("Invalid response type");
    }

    const cleanJsonText = contentBlock.text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return AnalysisResultSchema.parse(JSON.parse(cleanJsonText));
  } catch (error) {
    console.warn("Claude API failed, falling back to mock output:", error);
    return getMockAnalysis(feedbackText);
  }
}

function getMockAnalysis(text: string): AnalysisResult {
  const lower = text.toLowerCase();
  
  let sentiment: "POSITIVE" | "NEGATIVE" | "NEUTRAL" = "NEUTRAL";
  if (lower.includes("failed") || lower.includes("issue") || lower.includes("bug") || lower.includes("error")) {
    sentiment = "NEGATIVE";
  } else if (lower.includes("great") || lower.includes("excellent") || lower.includes("good")) {
    sentiment = "POSITIVE";
  }

  let theme = "General";
  if (lower.includes("checkout") || lower.includes("payment")) theme = "Payment";
  else if (lower.includes("login") || lower.includes("app")) theme = "Authentication";
  else if (lower.includes("ui") || lower.includes("dashboard")) theme = "UI/UX";

  return {
    sentiment,
    theme,
    summary: `Processed feedback regarding ${theme.toLowerCase()}.`,
  };
}