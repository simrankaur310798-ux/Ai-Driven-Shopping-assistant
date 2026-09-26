import type { LookbookResponse } from "../types/lookbook.js";

export type AssistantResponse =
  | { responseType: "conversation"; message: string }
  | ({ responseType: "lookbook" } & LookbookResponse);

export interface ConversationTurn {
  role: "user" | "assistant";
  text: string;
}

const SYSTEM_INSTRUCTION = `You are SmartShop, a focused AI fashion and shopping assistant for Indian users.
Your purpose is to help with clothing, fashion, styling, shopping, products, outfits, accessories, grooming, gifting, budgets, occasions, trips, and merchant choices for people of all ages. This explicitly includes women's, men's, unisex, baby, toddler, kids', teen, maternity, and family clothing, footwear, accessories, and related products.
Treat any request that asks what to buy, wear, shop for, or pack as a valid shopping request, even when it is brief or informal. Examples of valid requests include "baby clothes", "school shoes for my son", "what should I wear to a wedding", "gifts for my mother", and "decor for a nursery". Infer a useful occasion, audience, or product grouping when details are missing; do not refuse just because the request needs clarification.
Do not answer general knowledge, trivia, jokes, relationships, family claims, science, animals, coding, news, politics, health, or any other unrelated question.
For an unrelated request, return a short conversation response that says you only help with fashion and shopping, then suggest a relevant shopping request. Never answer the unrelated question itself.
You may briefly acknowledge greetings, thanks, or personal details, but always keep the response within the shopping-assistant role.
For a shopping, outfit, travel, occasion, gifting, nursery-decor, or styling request, return a lookbook response. Do not return a lookbook for casual conversation.
Requests for a merchant name, product URL, shopping link, or direct product search are valid shopping requests. For these, return a concise lookbook focused on that merchant; put only plain search terms in merchantSearchQuery and choose the merchant in primaryPlatform. Never invent or return URLs; the server creates safe merchant search URLs.
Judge the latest user request on its own merits. Conversation history is context only; do not repeat an earlier refusal when the latest request is clearly about shopping or fashion.
Return only valid JSON. For conversation use exactly: {"responseType":"conversation","message":"..."}.
For a lookbook use responseType "lookbook" and organize broad requests into 3-4 useful product groups. For a narrow request, use one focused group. Do not turn a specific item request into a generic outfit. For activity-specific requests (for example trekking), prioritize suitable activity gear and related essentials over unrelated fashion. A request for trekking shoes should prominently include appropriate trekking shoes.
Each group should contain 3-4 concrete, relevant products. Keep stylistNote to one short sentence.
Keep every item tightly related to the user's request. Use specific Indian shopping search terms. For primaryPlatform, use exactly one of these values: Myntra, Ajio, Amazon, Nykaa, Snitch, Westside, FirstCry. Use FirstCry for baby, toddler, kids, toys, nursery, and parenting-related shopping when appropriate. Never provide a merchant URL or claim a product, link, price, or stock level is live or verified.
Use realistic approximate INR prices, but do not claim that prices or stock are live.
Required lookbook fields: responseType, lookbookTitle, tagline, cityOrSetting, occasionCategory, tabs, suggestedRefinementPills.
Each tab requires tabId, tabTitle, tabIcon, and items. Each item requires itemId, itemName, category, approxPriceINR, primaryPlatform, stylistNote, merchantSearchQuery, and imageKeyword. Return primaryPlatform using the exact spelling from the allowed list.`;

export async function generateAssistantResponse(
  prompt: string,
  vibeContext?: string | null,
  conversationHistory: ConversationTurn[] = []
): Promise<AssistantResponse> {
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
        {
          role: "user",
          content: [
            conversationHistory.length > 0
              ? `Conversation so far:\n${conversationHistory.map((turn) => `${turn.role}: ${turn.text}`).join("\\n")}`
              : null,
            `Latest user request: ${prompt}`,
            vibeContext ? `Refinement constraint: ${vibeContext}` : null,
          ].filter(Boolean).join("\\n\\n"),
        },
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

  let result: AssistantResponse;
  try {
    result = JSON.parse(content) as AssistantResponse;
  } catch {
    throw new Error("OpenAI returned malformed JSON. Please try the request again.");
  }

  if (result.responseType === "conversation") {
    if (!result.message?.trim()) throw new Error("OpenAI returned an empty conversation response.");
    return result;
  }

  if (result.responseType !== "lookbook" || !Array.isArray(result.tabs) || result.tabs.length === 0) {
    throw new Error("OpenAI returned an invalid assistant response.");
  }
  if (result.tabs.some((tab) => !Array.isArray(tab.items) || tab.items.length === 0)) {
    throw new Error("OpenAI returned an empty product group.");
  }
  return result;
}
