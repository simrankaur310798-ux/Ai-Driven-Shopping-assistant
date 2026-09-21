import { LookbookResponse } from "@/types/lookbook";

const SYSTEM_INSTRUCTION = `You are SmartShop, an Indian fashion and shopping stylist.
Create highly relevant product recommendations for the user's exact request. Treat direct product requests such as "cartoon tshirt for adults" as product searches, not as weddings or vacations unless the user asks for that.

Rules:
- Keep every item tightly related to the user's prompt and any refinement constraint.
- Use adult sizing and gender-neutral wording when the user says adults.
- Use specific, high-intent Indian shopping search terms in merchantSearchQuery.
- Choose only Myntra, Ajio, Amazon, Nykaa, Snitch, or Westside.
- Use realistic approximate Indian prices, but do not claim that stock or prices are live.
- Return only valid JSON matching the requested schema. Do not use markdown fences.`;

const RESPONSE_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: [
    "lookbookTitle",
    "tagline",
    "cityOrSetting",
    "occasionCategory",
    "tabs",
    "suggestedRefinementPills",
  ],
  properties: {
    lookbookTitle: { type: "string" },
    tagline: { type: "string" },
    cityOrSetting: { type: "string" },
    occasionCategory: {
      type: "string",
      enum: ["vacation", "wedding", "gifting", "home_decor", "casual_lifestyle"],
    },
    tabs: {
      type: "array",
      minItems: 1,
      maxItems: 4,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["tabId", "tabTitle", "tabIcon", "items"],
        properties: {
          tabId: { type: "string" },
          tabTitle: { type: "string" },
          tabIcon: { type: "string" },
          items: {
            type: "array",
            minItems: 3,
            maxItems: 5,
            items: {
              type: "object",
              additionalProperties: false,
              required: [
                "itemId",
                "itemName",
                "category",
                "approxPriceINR",
                "primaryPlatform",
                "stylistNote",
                "merchantSearchQuery",
                "imageKeyword",
              ],
              properties: {
                itemId: { type: "string" },
                itemName: { type: "string" },
                category: {
                  type: "string",
                  enum: ["apparel", "footwear", "accessory", "grooming_beauty", "decor_gift"],
                },
                approxPriceINR: { type: "integer" },
                primaryPlatform: {
                  type: "string",
                  enum: ["Myntra", "Ajio", "Amazon", "Nykaa", "Snitch", "Westside"],
                },
                stylistNote: { type: "string" },
                merchantSearchQuery: { type: "string" },
                imageKeyword: { type: "string" },
              },
            },
          },
        },
      },
    },
    suggestedRefinementPills: {
      type: "array",
      minItems: 3,
      maxItems: 4,
      items: { type: "string" },
    },
  },
} as const;

export async function generateLookbookWithOpenAI(
  prompt: string,
  vibeContext?: string | null,
  activeCategory?: string | null
): Promise<LookbookResponse> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey?.trim()) {
    throw new Error("MISSING_OPENAI_API_KEY: Add OPENAI_API_KEY to .env.local.");
  }

  const requestContext = [
    `User request: ${prompt}`,
    vibeContext ? `Refinement constraint: ${vibeContext}` : null,
    activeCategory ? `Target category: ${activeCategory}` : null,
    "Return 1-4 useful product groups. For a direct product query, make the first group the exact requested product and use related alternatives only in later groups.",
  ]
    .filter(Boolean)
    .join("\n");

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      temperature: 0.2,
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "smartshop_lookbook",
          strict: true,
          schema: RESPONSE_SCHEMA,
        },
      },
      messages: [
        { role: "system", content: SYSTEM_INSTRUCTION },
        { role: "user", content: requestContext },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI API error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("OpenAI returned an empty response.");
  }

  return JSON.parse(content) as LookbookResponse;
}