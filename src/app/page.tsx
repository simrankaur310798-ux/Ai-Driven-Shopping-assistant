"use client";

import React, { useState } from "react";
import { Header } from "@/components/Header";
import { QuickChips } from "@/components/QuickChips";
import { PromptInput } from "@/components/PromptInput";
import { EventTabs } from "@/components/EventTabs";
import { CardCarousel } from "@/components/CardCarousel";
import { VibePills } from "@/components/VibePills";
import { ShareBar } from "@/components/ShareBar";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { LookbookResponse } from "@/types/lookbook";
import { Compass, AlertCircle, RefreshCw, Sparkles, UserRound } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

interface HistoryEntry {
  id: string;
  role: "user" | "assistant";
  text: string;
}

export default function Home() {
  const [lookbook, setLookbook] = useState<LookbookResponse | null>(null);
  const [activeTabId, setActiveTabId] = useState<string>("");
  const [lastPrompt, setLastPrompt] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<{ message: string; code?: string } | null>(
    null
  );
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  const fetchCuration = async (prompt: string, vibeContext?: string) => {
    setIsLoading(true);
    setError(null);
    setActiveTabId("");
    setHistory((entries) => [
      ...entries,
      { id: `${Date.now()}-user`, role: "user", text: prompt },
    ]);

    try {
      const res = await fetch(`${API_URL}/api/curate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          vibeContext: vibeContext || null,
          conversationHistory: history.slice(-12),
        }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw {
          message: json.error || "Failed to generate your lookbook.",
          code: json.code,
        };
      }

      if (json.type === "conversation") {
        setHistory((entries) => [
          ...entries,
          { id: `${Date.now()}-assistant`, role: "assistant", text: json.message || "" },
        ]);
        return;
      }

      setLookbook(json.data);
      setHistory((entries) => [
        ...entries,
        {
          id: `${Date.now()}-lookbook`,
          role: "assistant",
          text: `I put together “${json.data.lookbookTitle}” for you.`,
        },
      ]);
      setLastPrompt(prompt);
      if (json.data.tabs && json.data.tabs.length > 0) {
        setActiveTabId(json.data.tabs[0].tabId);
      }
    } catch (err: any) {
      console.error("Curation error:", err);
      setError({
        message:
          err.message || "Unable to reach backend styling service. Please check your backend connection.",
        code: err.code || "NETWORK_ERROR",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setLookbook(null);
    setActiveTabId("");
    setLastPrompt("");
    setError(null);
    setHistory([]);
  };

  const currentTab = lookbook?.tabs.find((t) => t.tabId === activeTabId) || lookbook?.tabs[0];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <Header hasLookbook={!!lookbook} onReset={handleReset} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col pb-28">
        {history.length > 0 && (
          <div className="mx-auto w-full max-w-2xl space-y-3 px-4 pt-5">
            {history.map((entry) => (
              <div key={entry.id} className={`flex gap-2.5 ${entry.role === "user" ? "justify-end" : "justify-start"}`}>
                {entry.role === "assistant" && (
                  <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-orange-500/15 text-orange-400">
                    <Sparkles className="h-3.5 w-3.5" />
                  </div>
                )}
                <div className={`max-w-[82%] ${entry.role === "user" ? "order-first" : ""}`}>
                  <div className={`mb-1 px-1 text-[10px] font-semibold uppercase tracking-[0.16em] ${entry.role === "user" ? "text-right text-orange-400" : "text-neutral-500"}`}>
                    {entry.role === "user" ? "You" : "SmartShop"}
                  </div>
                  <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    entry.role === "user"
                      ? "rounded-tr-md bg-orange-500 text-white shadow-lg shadow-orange-950/20"
                      : "rounded-tl-md border border-neutral-800 bg-neutral-900/80 text-neutral-300"
                  }`}>
                    {entry.text}
                  </div>
                </div>
                {entry.role === "user" && (
                  <div className="mt-6 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-neutral-800 text-neutral-400">
                    <UserRound className="h-3.5 w-3.5" />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        {/* Error Notification */}
        {error && (
          <div className="m-4 p-4 rounded-2xl bg-rose-950/40 border border-rose-500/40 text-rose-200">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-400 mt-0.5 flex-shrink-0" />
              <div className="space-y-1 text-xs flex-1">
                <p className="font-semibold text-rose-100">Backend Connection Notice</p>
                <p className="leading-relaxed opacity-90">{error.message}</p>
                {lastPrompt && (
                  <button
                    onClick={() => fetchCuration(lastPrompt)}
                    className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-900/60 hover:bg-rose-800/80 text-rose-200 text-[11px] font-medium transition-colors"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Retry Request</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Loading Skeleton */}
        {isLoading && <LoadingSkeleton />}

        {/* Active Lookbook View */}
        {!isLoading && lookbook && (
          <div className="flex flex-col pt-3 animate-fadeIn">
            {/* Title & Tagline Header */}
            <div className="px-4 mb-3">
              <div className="flex items-center gap-2 mb-1">
                {lookbook.cityOrSetting && (
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-300 border border-neutral-700">
                    📍 {lookbook.cityOrSetting}
                  </span>
                )}
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30">
                  {lookbook.occasionCategory}
                </span>
              </div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                {lookbook.lookbookTitle}
              </h2>
              <p className="text-xs text-neutral-400 mt-0.5 leading-relaxed">
                {lookbook.tagline}
              </p>
            </div>

            {/* Event Tabs Navigation */}
            {lookbook.tabs && lookbook.tabs.length > 0 && (
              <EventTabs
                tabs={lookbook.tabs}
                activeTabId={activeTabId || lookbook.tabs[0]?.tabId}
                onSelectTab={setActiveTabId}
              />
            )}

            {/* Swipable Carousel for Active Tab */}
            {currentTab && currentTab.items && (
              <CardCarousel items={currentTab.items} />
            )}

            {/* Dynamic Vibe Refinement Pills */}
            <VibePills
              pills={lookbook.suggestedRefinementPills}
              onSelectPill={(pill) => fetchCuration(lastPrompt, pill)}
              isLoading={isLoading}
            />

            {/* WhatsApp Share Loop */}
            <ShareBar lookbook={lookbook} />
          </div>
        )}

        {/* Initial Empty State / Discovery Hero */}
        {!isLoading && !lookbook && history.length === 0 && (
          <div className="flex-1 flex flex-col justify-center px-4 py-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500/20 via-orange-500/20 to-rose-500/20 border border-orange-500/30 text-orange-400 mb-4 shadow-xl">
                <Compass className="w-7 h-7" />
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Stop Opening 20 Tabs.
              </h2>
              <p className="text-xs text-neutral-400 mt-2 max-w-xs mx-auto leading-relaxed">
                Get high-agency curated lookbooks for Indian weddings, beach trips, and aesthetic gifting with direct links to Myntra, Ajio & Amazon.
              </p>
            </div>

            {/* Quick Chips Accelerator */}
            <div>
              <QuickChips
                onSelect={(selectedPrompt) => fetchCuration(selectedPrompt)}
                disabled={isLoading}
              />
            </div>
          </div>
        )}
      </div>

      {/* Sticky Bottom Prompt Input */}
      <PromptInput
        onSubmit={(promptText) => fetchCuration(promptText)}
        isLoading={isLoading}
      />
    </div>
  );
}
