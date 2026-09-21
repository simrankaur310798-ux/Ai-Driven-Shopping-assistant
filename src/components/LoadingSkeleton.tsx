"use client";

import React, { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";

const LOADING_MESSAGES = [
  "Deconstructing your occasion into curated looks...",
  "Selecting breathable fabrics & trending silhouettes...",
  "Matching accessories, footwear & stylist notes...",
  "Generating clean merchant deep links for Myntra & Ajio...",
];

export const LoadingSkeleton: React.FC = () => {
  const [msgIdx, setMsgIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIdx((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full flex flex-col py-4 animate-pulse">
      {/* Title skeleton */}
      <div className="px-4 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-orange-400 animate-spin" />
          <span className="text-xs font-semibold text-orange-400">
            {LOADING_MESSAGES[msgIdx]}
          </span>
        </div>
        <div className="h-6 w-3/4 bg-neutral-800 rounded-lg mb-2" />
        <div className="h-4 w-1/2 bg-neutral-800/60 rounded-md" />
      </div>

      {/* Tabs skeleton */}
      <div className="flex gap-2 px-4 mb-4 overflow-hidden">
        <div className="h-8 w-28 bg-neutral-800 rounded-xl flex-shrink-0" />
        <div className="h-8 w-32 bg-neutral-800/70 rounded-xl flex-shrink-0" />
        <div className="h-8 w-24 bg-neutral-800/50 rounded-xl flex-shrink-0" />
      </div>

      {/* Card carousel skeleton */}
      <div className="flex gap-3 px-4 overflow-hidden pb-4">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="flex-shrink-0 w-[280px] bg-neutral-800/70 rounded-2xl overflow-hidden border border-neutral-700/60"
          >
            <div className="h-48 w-full bg-neutral-800 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-neutral-700/20 to-transparent animate-shimmer" />
            </div>
            <div className="p-4 space-y-3">
              <div className="flex justify-between items-center">
                <div className="h-4 w-16 bg-neutral-700 rounded-full" />
                <div className="h-4 w-12 bg-neutral-700 rounded-md" />
              </div>
              <div className="h-5 w-4/5 bg-neutral-700 rounded-md" />
              <div className="h-14 w-full bg-neutral-900/80 rounded-xl" />
              <div className="h-9 w-full bg-neutral-700/70 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
