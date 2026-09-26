"use client";

import React from "react";
import { ExternalLink, ShoppingBag } from "lucide-react";
import { CuratedItem } from "@/types/lookbook";

interface LookbookCardProps {
  item?: CuratedItem | null;
}

const PLATFORM_STYLES: Record<
  string,
  { bg: string; text: string; border: string; label: string }
> = {
  Myntra: {
    bg: "bg-rose-950/40",
    text: "text-rose-400",
    border: "border-rose-500/30",
    label: "MYNTRA",
  },
  Ajio: {
    bg: "bg-blue-950/40",
    text: "text-sky-400",
    border: "border-sky-500/30",
    label: "AJIO",
  },
  Amazon: {
    bg: "bg-amber-950/40",
    text: "text-amber-400",
    border: "border-amber-500/30",
    label: "AMAZON",
  },
  Nykaa: {
    bg: "bg-pink-950/40",
    text: "text-pink-400",
    border: "border-pink-500/30",
    label: "NYKAA",
  },
  Snitch: {
    bg: "bg-neutral-800",
    text: "text-neutral-200",
    border: "border-neutral-700",
    label: "SNITCH",
  },
  Westside: {
    bg: "bg-emerald-950/40",
    text: "text-emerald-400",
    border: "border-emerald-500/30",
    label: "WESTSIDE",
  },
  FirstCry: {
    bg: "bg-orange-950/40",
    text: "text-orange-300",
    border: "border-orange-500/30",
    label: "FIRSTCRY",
  },
};

export const LookbookCard: React.FC<LookbookCardProps> = ({ item }) => {
  if (!item) return null;

  const platformStyle =
    PLATFORM_STYLES[item.primaryPlatform] || PLATFORM_STYLES.Myntra;

  const handleOutboundClick = () => {
    if (typeof window !== "undefined" && item.deepLinkUrl && item.fallbackWebUrl) {
      const start = Date.now();
      window.location.href = item.deepLinkUrl;

      // If user is still on page after 1.5s (app not installed), fall back to web
      setTimeout(() => {
        if (Date.now() - start < 2000) {
          window.open(item.fallbackWebUrl, "_blank", "noopener,noreferrer");
        }
      }, 1200);
    } else if (item.fallbackWebUrl) {
      window.open(item.fallbackWebUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="flex-shrink-0 w-[280px] sm:w-[300px] flex flex-col bg-neutral-800/90 rounded-2xl overflow-hidden border border-neutral-700/80 shadow-xl hover:border-neutral-600 transition-all snap-center select-none">
      {/* Merchant brand panel: avoids showing an unrelated fallback product image. */}
      <div className={`relative h-48 w-full overflow-hidden ${platformStyle.bg}`}>
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-transparent to-black/30" />
        <div className="relative flex h-full flex-col items-center justify-center gap-3 p-4 text-center">
          <div className={`flex h-16 w-16 items-center justify-center rounded-2xl border ${platformStyle.border} bg-black/20`}>
            <ShoppingBag className={`h-8 w-8 ${platformStyle.text}`} />
          </div>
          <span className={`text-2xl font-black tracking-tight ${platformStyle.text}`}>
            {item.primaryPlatform}
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/60">
            Product destination
          </span>
        </div>

        <div className="absolute top-2.5 left-2.5">
          <span className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded-md bg-neutral-900/80 text-neutral-300 backdrop-blur-md border border-neutral-700">
            {item.category.replace("_", " ")}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Platform Tag & Price */}
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${platformStyle.bg} ${platformStyle.text} ${platformStyle.border}`}
            >
              {platformStyle.label}
            </span>
            <span className="text-xs font-bold font-mono text-orange-400">
              ~₹{item.approxPriceINR.toLocaleString("en-IN")}
            </span>
          </div>

          {/* Item Name */}
          <h3 className="text-sm font-semibold text-white line-clamp-2 leading-snug mb-2">
            {item.itemName}
          </h3>

          {/* Stylist Note Box */}
          <div className="p-2.5 rounded-xl bg-neutral-900/80 border border-neutral-700/60 mb-3">
            <div className="flex items-start gap-1.5">
              <span className="text-xs mt-0.5">💡</span>
              <p className="text-xs text-neutral-300 italic leading-relaxed">
                &ldquo;{item.stylistNote}&rdquo;
              </p>
            </div>
          </div>
        </div>

        {/* 1-Tap Outbound CTA */}
        <div>
          <button
            onClick={handleOutboundClick}
            className="w-full flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-orange-500 hover:bg-orange-600 active:scale-[0.98] text-white text-xs font-bold transition-all shadow-md shadow-orange-500/20"
          >
            <span>Search on {item.primaryPlatform}</span>
            <ExternalLink className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
          <p className="text-[10px] text-center text-neutral-500 mt-1.5">
            Prices on merchant sites may vary based on live offers
          </p>
        </div>
      </div>
    </div>
  );
};
