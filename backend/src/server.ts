import "dotenv/config";
import cors from "cors";
import express from "express";
import { generateMerchantLinks, resolveItemImage } from "./lib/deeplink.js";
import { generateLookbook } from "./lib/openai.js";
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

  if (!prompt) return res.status(400).json({ success: false, code: "VALIDATION_ERROR", error: "Please enter an occasion, destination, or styling question." });

  try {
    const lookbook = await generateLookbook(prompt, vibeContext);
    const tabs = await Promise.all(lookbook.tabs.map(async (tab) => ({
      ...tab,
      items: await Promise.all(tab.items.filter((item) => item && typeof item === "object").map(async (item) => {
        const links = generateMerchantLinks(item.primaryPlatform, item.merchantSearchQuery || item.itemName);
        return {
          ...item,
          deepLinkUrl: links.deepLinkUrl,
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
