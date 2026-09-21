"use client";

import React from "react";
import { Sparkles, RotateCcw } from "lucide-react";

interface HeaderProps {
  hasLookbook: boolean;
  onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({ hasLookbook, onReset }) => {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-neutral-900/90 backdrop-blur-md border-b border-neutral-800">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <h1 className="text-base font-bold tracking-tight text-white">SmartShop</h1>
            <span className="text-[10px] uppercase font-semibold tracking-wider px-1.5 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30">
              AI Stylist
            </span>
          </div>
          <p className="text-[11px] text-neutral-400">Curated fits & direct merchant links</p>
        </div>
      </div>

      {hasLookbook && (
        <button
          onClick={onReset}
          className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700/80 rounded-lg transition-colors border border-neutral-700"
          title="Start fresh search"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>New</span>
        </button>
      )}
    </header>
  );
};
