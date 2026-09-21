"use client";

import React from "react";
import { SubEventTab } from "@/types/lookbook";

interface EventTabsProps {
  tabs: SubEventTab[];
  activeTabId: string;
  onSelectTab: (tabId: string) => void;
}

export const EventTabs: React.FC<EventTabsProps> = ({
  tabs,
  activeTabId,
  onSelectTab,
}) => {
  return (
    <div className="w-full px-4 mb-3">
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 snap-x">
        {tabs.map((tab) => {
          const isActive = tab.tabId === activeTabId;
          return (
            <button
              key={tab.tabId}
              onClick={() => onSelectTab(tab.tabId)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all snap-start select-none ${
                isActive
                  ? "bg-orange-500 text-white shadow-md shadow-orange-500/25 border border-orange-400"
                  : "bg-neutral-800/80 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-700/70 border border-neutral-700/60"
              }`}
            >
              <span className="text-sm">{tab.tabIcon || "✨"}</span>
              <span>{tab.tabTitle}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  isActive
                    ? "bg-orange-600 text-white"
                    : "bg-neutral-700 text-neutral-400"
                }`}
              >
                {tab.items?.length || 0}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
