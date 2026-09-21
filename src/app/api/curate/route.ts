import { NextRequest, NextResponse } from "next/server";
import { generateMerchantLinks, resolveItemImage } from "@/lib/deeplink";
import { generateLookbookWithOpenAI } from "@/lib/openai";
import { LookbookResponse, CurateRequestBody } from "@/types/lookbook";

export async function POST(req: NextRequest) {
  try {
    const body: CurateRequestBody = await req.json();

    if (!body || !body.prompt || body.prompt.trim().length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Please enter an occasion, destination, or styling question.",
          code: "VALIDATION_ERROR",
        },
        { status: 400 }
      );
    }

    const trimmedPrompt = body.prompt.trim().slice(0, 300);
    let lookbook: LookbookResponse;

    try {
      lookbook = await generateLookbookWithOpenAI(
        trimmedPrompt,
        body.vibeContext,
        body.activeCategory
      );
    } catch (openAIError: any) {
      return NextResponse.json(
        {
          success: false,
          error: openAIError.message || "Failed to generate recommendations with OpenAI.",
          code: "OPENAI_ERROR",
        },
        { status: 502 }
      );
    }

    // Add local merchant links and visual fallbacks to the AI-generated items.
    const enrichedTabs = (lookbook.tabs || []).map((tab) => {
      const enrichedItems = (tab.items || []).map((item) => {
        const links = generateMerchantLinks(
          item.primaryPlatform,
          item.merchantSearchQuery || item.itemName
        );
        const resolvedImage =
          item.resolvedImageUrl ||
          resolveItemImage(
            item.imageKeyword || item.itemName,
            item.category,
            item.itemId
          );

        return {
          ...item,
          deepLinkUrl: item.deepLinkUrl || links.deepLinkUrl,
          fallbackWebUrl: item.fallbackWebUrl || links.fallbackWebUrl,
          resolvedImageUrl: resolvedImage,
        };
      });

      return {
        ...tab,
        items: enrichedItems,
      };
    });

    const enrichedLookbook: LookbookResponse = {
      ...lookbook,
      tabs: enrichedTabs,
    };

    return NextResponse.json({
      success: true,
      data: enrichedLookbook,
    });
  } catch (error: any) {
    console.error("Error in /api/curate:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to process styling request.",
        code: "SERVER_ERROR",
      },
      { status: 500 }
    );
  }
}
