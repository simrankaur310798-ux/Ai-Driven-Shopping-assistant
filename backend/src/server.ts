import "dotenv/config";
import cors from "cors";
import express from "express";
import { generateMerchantLinks, normalizePlatform, resolveItemImage } from "./lib/deeplink.js";
import { generateAssistantResponse, type ConversationTurn } from "./lib/openai.js";
import type { LookbookResponse } from "./types/lookbook.js";

const app = express();
const port = Number(process.env.PORT || 4000);
const allowedOrigins = (process.env.FRONTEND_ORIGIN || "http://localhost:3000").split(",").map((origin) => origin.trim());

app.use(cors({ origin: allowedOrigins }));
app.use(express.json({ limit: "20kb" }));

app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.post("/api/curate", async (req, res) => {
  const prompt = typeof req.body?.prompt === "string" ? req.body.prompt.trim().slice(0, 300) : "";
  const vibeContext = typeof req.body?.vibeContext === "string" ? req.body.vibeContext.trim().slice(0, 200) : null;
  const conversationHistory: ConversationTurn[] = Array.isArray(req.body?.conversationHistory)
    ? req.body.conversationHistory
        .filter((turn: unknown): turn is ConversationTurn => {
          if (!turn || typeof turn !== "object") return false;
          const candidate = turn as Record<string, unknown>;
          return (candidate.role === "user" || candidate.role === "assistant") && typeof candidate.text === "string";
        })
        .slice(-12)
        .map((turn: ConversationTurn) => ({ role: turn.role, text: turn.text.slice(0, 500) }))
    : [];

  if (!prompt) return res.status(400).json({ success: false, code: "VALIDATION_ERROR", error: "Please enter an occasion, destination, or styling question." });

  try {
    const assistantResponse = await generateAssistantResponse(prompt, vibeContext, conversationHistory);
    if (assistantResponse.responseType === "conversation") {
      return res.json({ success: true, type: "conversation", message: assistantResponse.message });
    }

    const lookbook = assistantResponse;
    const tabs = await Promise.all(lookbook.tabs.map(async (tab, tabIndex) => ({
      ...tab,
      tabId: typeof tab.tabId === "string" && tab.tabId ? tab.tabId : `group-${tabIndex + 1}`,
      tabTitle: typeof tab.tabTitle === "string" && tab.tabTitle ? tab.tabTitle : "Recommended Picks",
      tabIcon: typeof tab.tabIcon === "string" ? tab.tabIcon : "✨",
      items: await Promise.all(tab.items.filter((item) => item && typeof item === "object" && typeof item.itemName === "string" && item.itemName.trim()).map(async (item, itemIndex) => {
        const primaryPlatform = normalizePlatform(item.primaryPlatform);
        const itemName = item.itemName.trim();
        const merchantSearchQuery = typeof item.merchantSearchQuery === "string" && item.merchantSearchQuery.trim()
          ? item.merchantSearchQuery.trim()
          : itemName;
        const links = generateMerchantLinks(primaryPlatform, merchantSearchQuery);
        return {
          ...item,
          itemId: typeof item.itemId === "string" && item.itemId ? item.itemId : `item-${tabIndex + 1}-${itemIndex + 1}`,
          itemName,
          primaryPlatform,
          category: ["apparel", "footwear", "accessory", "grooming_beauty", "decor_gift"].includes(item.category) ? item.category : "apparel",
          approxPriceINR: Number.isFinite(item.approxPriceINR) ? item.approxPriceINR : 0,
          stylistNote: typeof item.stylistNote === "string" ? item.stylistNote : "A practical pick for your request.",
          merchantSearchQuery,
          imageKeyword: typeof item.imageKeyword === "string" ? item.imageKeyword : itemName,
          deepLinkUrl: undefined,
          fallbackWebUrl: links.fallbackWebUrl,
          resolvedImageUrl: resolveItemImage(item.imageKeyword, item.category, item.itemId),
        };
      })),
    })));

    const enriched: LookbookResponse = { ...lookbook, tabs };
    return res.json({ success: true, data: enriched });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to process styling request.";
    console.error("/api/curate failed:", message);
    return res.status(502).json({ success: false, code: "CURATION_ERROR", error: message });
  }
});

app.listen(port, () => console.log(`SmartShop backend listening on http://localhost:${port}`));
