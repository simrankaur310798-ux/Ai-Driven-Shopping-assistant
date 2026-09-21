"use client";

import React from "react";
import { Zap } from "lucide-react";

interface VibePillsProps {
  pills: string[];
  onSelectPill: (pill: string) => void;
  isLoading: boolean;
}

export const VibePills: React.FC<VibePillsProps> = ({
  pills,
  onSelectPill,
  isLoading,
}) => {
  if (!pills || pills.length === 0) return null;

  return (
    <div className="w-full px-4 my-3">
      <div className="flex items-center gap-1.5 mb-2 text-xs font-semibold text-neutral-400">
        <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
        <span>Quick Vibe Refinements</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {pills.map((pill, idx) => (
          <button
            key={idx}
            onClick={() => onSelectPill(pill)}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-800/80 hover:bg-neutral-700 active:scale-95 border border-neutral-700/80 hover:border-orange-500/50 text-xs text-neutral-300 hover:text-white transition-all disabled:opacity-50 disabled:pointer-events-none shadow-sm"
          >
            <span>+</span>
            <span>{pill}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
