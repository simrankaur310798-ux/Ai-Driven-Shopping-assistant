"use client";

import React from "react";

interface QuickChipsProps {
  onSelect: (prompt: string) => void;
  disabled?: boolean;
}

const OCCASIONS = [
  {
    icon: "🌴",
    label: "Goa 3-Day Vibe",
    prompt: "3-day Goa trip with college friends. Need complete day-to-night outfits and beach essentials under ₹1,500 each.",
  },
  {
    icon: "🪔",
    label: "Jaipur Wedding Guest",
    prompt: "Attending best friend's 3-day wedding in Jaipur. Need trendy Indo-western looks for Haldi, Sangeet, and Reception.",
  },
  {
    icon: "☕",
    label: "Cafe & Co-working",
    prompt: "Aesthetic Bandra cafe and co-working casual looks with minimal oversized drip.",
  },
  {
    icon: "🎁",
    label: "Housewarming (<₹2.5k)",
    prompt: "Aesthetic housewarming gift for a millennial couple moving into a 2BHK in Bangalore, budget strictly under ₹2,500.",
  },
  {
    icon: "🛋️",
    label: "Cozy WFH Desk",
    prompt: "Cozy, minimalist aesthetic WFH desk setup essentials and ambient room decor under ₹3,000.",
  },
];

export const QuickChips: React.FC<QuickChipsProps> = ({ onSelect, disabled }) => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between px-4 mb-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
          Quick-Start Curations
        </span>
        <span className="text-[10px] text-neutral-500">1-tap</span>
      </div>
      <div className="flex gap-2 px-4 overflow-x-auto no-scrollbar pb-1 snap-x">
        {OCCASIONS.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => onSelect(chip.prompt)}
            disabled={disabled}
            className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-800/80 hover:bg-neutral-700 active:scale-95 border border-neutral-700/80 text-xs font-medium text-neutral-200 hover:text-white transition-all snap-start shadow-sm disabled:opacity-50 disabled:pointer-events-none"
          >
            <span className="text-sm">{chip.icon}</span>
            <span>{chip.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
