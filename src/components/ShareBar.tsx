"use client";

import React, { useState } from "react";
import { Share2, Check, MessageCircle } from "lucide-react";
import { LookbookResponse } from "@/types/lookbook";

interface ShareBarProps {
  lookbook: LookbookResponse;
}

export const ShareBar: React.FC<ShareBarProps> = ({ lookbook }) => {
  const [copied, setCopied] = useState(false);

  const getShareText = () => {
    const highlights = lookbook.tabs
      .slice(0, 3)
      .map((tab) => `• ${tab.tabTitle}: ${tab.items.slice(0, 2).map((i) => i.itemName).join(", ")}`)
      .join("\n");

    return `🛍️ Curated Lookbook: ${lookbook.lookbookTitle}\n"${lookbook.tagline}"\n\n${highlights}\n\nCheck out the curated fits & direct merchant links!`;
  };

  const handleShare = async () => {
    const shareText = getShareText();
    const url = typeof window !== "undefined" ? window.location.href : "";

    if (navigator.share) {
      try {
        await navigator.share({
          title: lookbook.lookbookTitle,
          text: shareText,
          url,
        });
        return;
      } catch (err) {
        // User cancelled or share failed, proceed to WhatsApp direct
      }
    }

    // Direct WhatsApp Web / App intent fallback
    const encodedText = encodeURIComponent(`${shareText}\n${url}`);
    window.open(`https://api.whatsapp.com/send?text=${encodedText}`, "_blank");
  };

  const handleCopy = () => {
    const text = `${getShareText()}\n${typeof window !== "undefined" ? window.location.href : ""}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full px-4 my-4">
      <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-neutral-900 to-emerald-950/20 border border-emerald-500/30 flex items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
            <MessageCircle className="w-5 h-5 fill-emerald-400/20" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">Share Capsule on WhatsApp</h4>
            <p className="text-[11px] text-neutral-400">Get outfit approvals from friends</p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={handleCopy}
            className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors border border-neutral-700"
            title="Copy text"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
          </button>
          <button
            onClick={handleShare}
            className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/20"
          >
            Share
          </button>
        </div>
      </div>
    </div>
  );
};
