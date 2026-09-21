"use client";

import React, { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CuratedItem } from "@/types/lookbook";
import { LookbookCard } from "./LookbookCard";

interface CardCarouselProps {
  items: CuratedItem[];
}

export const CardCarousel: React.FC<CardCarouselProps> = ({ items }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const validItems = items.filter((item): item is CuratedItem => Boolean(item));

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, clientWidth } = scrollContainerRef.current;
    const index = Math.round(scrollLeft / 290);
    setActiveIndex(Math.min(Math.max(0, index), validItems.length - 1));
  };

  const scrollToIndex = (index: number) => {
    if (!scrollContainerRef.current) return;
    const targetLeft = index * 290;
    scrollContainerRef.current.scrollTo({
      left: targetLeft,
      behavior: "smooth",
    });
  };

  return (
    <div className="w-full relative py-2">
      {/* Scrollable Container with touch snap physics */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex gap-3 px-4 overflow-x-auto no-scrollbar snap-x snap-mandatory scroll-smooth pb-3"
      >
        {validItems.map((item) => (
          <LookbookCard key={item.itemId} item={item} />
        ))}
      </div>

      {/* Footer controls: indicator dots and card count */}
      {validItems.length > 1 && (
        <div className="flex items-center justify-between px-6 mt-1">
          <div className="flex gap-1.5 items-center">
            {validItems.map((_, i) => (
              <button
                key={i}
                onClick={() => scrollToIndex(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === activeIndex ? "w-5 bg-orange-500" : "w-1.5 bg-neutral-700"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-neutral-400">
              {activeIndex + 1} / {validItems.length}
            </span>
            <div className="hidden sm:flex items-center gap-1">
              <button
                onClick={() => scrollToIndex(Math.max(0, activeIndex - 1))}
                disabled={activeIndex === 0}
                className="p-1 rounded-md bg-neutral-800 hover:bg-neutral-700 text-neutral-300 disabled:opacity-30"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => scrollToIndex(Math.min(validItems.length - 1, activeIndex + 1))}
                disabled={activeIndex === validItems.length - 1}
                className="p-1 rounded-md bg-neutral-800 hover:bg-neutral-700 text-neutral-300 disabled:opacity-30"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
