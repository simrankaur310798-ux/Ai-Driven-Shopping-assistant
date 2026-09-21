import type { LookbookResponse } from "../types/lookbook.js";

const SYSTEM_INSTRUCTION = `You are SmartShop, an Indian fashion and shopping stylist.
Return only valid JSON. Decompose broad requests into 3-4 useful product groups. For Goa trip clothes, use groups such as Beach Day, Sundowner, Night Out, and Packing Essentials.
Each group must contain 4 concrete products, mixing clothing with footwear, accessories, and grooming where relevant. Keep stylistNote to one short sentence.
Keep every item tightly related to the user's request. Use specific Indian shopping search terms. Choose only Myntra, Ajio, Amazon, Nykaa, Snitch, or Westside.
Use realistic approximate INR prices, but do not claim that prices or stock are live.
Required top-level fields: lookbookTitle, tagline, cityOrSetting, occasionCategory, tabs, suggestedRefinementPills.
Each tab requires tabId, tabTitle, tabIcon, and items. Each item requires itemId, itemName, category, approxPriceINR, primaryPlatform, stylistNote, merchantSearchQuery, and imageKeyword.`;

export async function generateLookbook(prompt: string, vibeContext?: string | null): Promise<LookbookResponse> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey?.trim()) throw new Error("MISSING_OPENAI_API_KEY: Add OPENAI_API_KEY to backend/.env.");

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    signal: AbortSignal.timeout(90000),
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      temperature: 0.2,
      max_tokens: 6000,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM_INSTRUCTION },
        { role: "user", content: [`User request: ${prompt}`, vibeContext ? `Refinement constraint: ${vibeContext}` : null].filter(Boolean).join("\\n") },
      ],
    }),
  });

  if (!response.ok) throw new Error(`OpenAI API error (${response.status}): ${await response.text()}`);
  const data = await response.json() as {
    choices?: Array<{
      finish_reason?: string;
      message?: { content?: string };
    }>;
  };
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error("OpenAI returned an empty response.");

  if (data.choices?.[0]?.finish_reason === "length") {
    throw new Error("OpenAI response was truncated. Please try again with a shorter request.");
  }

  let lookbook: LookbookResponse;
  try {
    lookbook = JSON.parse(content) as LookbookResponse;
  } catch {
    throw new Error("OpenAI returned malformed JSON. Please try the request again.");
  }
  if (!Array.isArray(lookbook.tabs) || lookbook.tabs.length === 0) throw new Error("OpenAI returned no product groups.");
  if (lookbook.tabs.some((tab) => !Array.isArray(tab.items) || tab.items.length === 0)) throw new Error("OpenAI returned an empty product group.");
  return lookbook;
}
