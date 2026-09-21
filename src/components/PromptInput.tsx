"use client";

import React, { useState, useEffect, useRef } from "react";
import { ArrowUp, Loader2 } from "lucide-react";

interface PromptInputProps {
  onSubmit: (prompt: string) => void;
  isLoading: boolean;
}

const PLACEHOLDERS = [
  "E.g., 3-day Goa trip with college friends under ₹1,500 each...",
  "E.g., Best friend's Haldi & Sangeet outfit under ₹4,000...",
  "E.g., Housewarming gift for coffee lovers moving into 2BHK...",
  "E.g., Sunday Bandra cafe aesthetic co-ord set in Mumbai...",
  "E.g., Manali mountain winter trip capsule wardrobe...",
];

export const PromptInput: React.FC<PromptInputProps> = ({
  onSubmit,
  isLoading,
}) => {
  const [prompt, setPrompt] = useState("");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Cycle placeholders smoothly every 3.5 seconds when input is empty
  useEffect(() => {
    if (prompt.length > 0) return;
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % PLACEHOLDERS.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [prompt]);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value.slice(0, 250));
    // Auto-adjust height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        120
      )}px`;
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!prompt.trim() || isLoading) return;
    onSubmit(prompt.trim());
    setPrompt("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="sticky bottom-0 z-20 w-full bg-gradient-to-t from-neutral-950 via-neutral-900/95 to-neutral-900/0 pt-4 pb-4 px-4 border-t border-neutral-800/80 backdrop-blur-md">
      <form
        onSubmit={handleSubmit}
        className="relative flex items-end gap-2 bg-neutral-800/90 rounded-2xl p-2 border border-neutral-700 shadow-xl focus-within:border-orange-500/70 focus-within:ring-1 focus-within:ring-orange-500/50 transition-all"
      >
        <textarea
          ref={textareaRef}
          value={prompt}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          rows={1}
          placeholder={PLACEHOLDERS[placeholderIndex]}
          disabled={isLoading}
          className="w-full resize-none bg-transparent text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none max-h-28 py-1.5 px-2 overflow-y-auto"
        />

        <div className="flex items-center gap-2 flex-shrink-0 pb-0.5">
          {prompt.length > 180 && (
            <span className="text-[10px] text-neutral-400 font-mono">
              {prompt.length}/250
            </span>
          )}

          <button
            type="submit"
            disabled={!prompt.trim() || isLoading}
            className="w-8 h-8 rounded-xl bg-orange-500 hover:bg-orange-600 active:scale-95 text-white flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-orange-500/20"
            aria-label="Send styling prompt"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-white" />
            ) : (
              <ArrowUp className="w-4 h-4 text-white stroke-[2.5]" />
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
