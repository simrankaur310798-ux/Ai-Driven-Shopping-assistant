import { PlatformType } from "../types/lookbook.js";

const PLATFORMS: PlatformType[] = ["Myntra", "Ajio", "Amazon", "Nykaa", "Snitch", "Westside", "FirstCry"];

export function normalizePlatform(value: unknown): PlatformType {
  if (typeof value === "string") {
    const match = PLATFORMS.find((platform) => platform.toLowerCase() === value.trim().toLowerCase());
    if (match) return match;
  }
  return "Amazon";
}

export function sanitizeSearchQuery(query: string): string {
  return query.replace(/[^\w\s-]/gi, " ").replace(/\s+/g, " ").trim();
}

export function generateMerchantLinks(platformInput: unknown, queryInput: unknown): { fallbackWebUrl: string } {
  const platform = normalizePlatform(platformInput);
  const cleanQuery = sanitizeSearchQuery(typeof queryInput === "string" ? queryInput : "") || "popular products";
  const encoded = encodeURIComponent(cleanQuery);

  switch (platform) {
    case "Myntra":
      return { fallbackWebUrl: `https://www.myntra.com/search?q=${encoded}` };
    case "Ajio":
      return { fallbackWebUrl: `https://www.ajio.com/search/?text=${encoded}` };
    case "Amazon":
      return { fallbackWebUrl: `https://www.amazon.in/s?k=${encoded}` };
    case "Nykaa":
      return { fallbackWebUrl: `https://www.nykaa.com/search/result/?q=${encoded}` };
    case "Snitch":
      return { fallbackWebUrl: `https://www.snitch.co.in/search?q=${encoded}` };
    case "Westside":
      return { fallbackWebUrl: `https://www.westside.com/search?q=${encoded}` };
    case "FirstCry":
      return { fallbackWebUrl: `https://www.firstcry.com/search?q=${encoded}` };
    default:
      return { fallbackWebUrl: `https://www.amazon.in/s?k=${encoded}` };
  }
}

const IMAGE_POOLS: Record<string, string[]> = {
  dress: [
    "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=800&q=80",
  ],
  shirt: [
    "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80",
  ],
  shorts: [
    "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80",
  ],
  swimwear: [
    "https://images.unsplash.com/photo-1559825481-12a05cc00344?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1530053969600-ca ed426bbfb8?auto=format&fit=crop&w=800&q=80".replace(" ", ""),
  ],
  footwear: [
    "https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80",
  ],
  accessory: [
    "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1521369857889-7c7c1c5f7f5f?auto=format&fit=crop&w=800&q=80",
  ],
  grooming: [
    "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80",
  ],
  gifting: [
    "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80",
  ],
};

export function resolveItemImage(keyword: string, category: string, itemId = ""): string {
  const value = `${keyword} ${category}`.toLowerCase();
  const pool = value.includes("swim") || value.includes("trunk") || value.includes("bikini") || value.includes("board short")
    ? IMAGE_POOLS.swimwear
    : value.includes("short") || value.includes("pant") || value.includes("trouser") || value.includes("bottom")
      ? IMAGE_POOLS.shorts
      : value.includes("shoe") || value.includes("slide") || value.includes("sandal") || value.includes("sneaker") || value.includes("loafer")
    ? IMAGE_POOLS.footwear
    : value.includes("hat") || value.includes("cap") || value.includes("glass") || value.includes("bag") || value.includes("access") || value.includes("jewel")
      ? IMAGE_POOLS.accessory
      : value.includes("sunscreen") || value.includes("groom") || value.includes("spf") || value.includes("perfume")
        ? IMAGE_POOLS.grooming
      : value.includes("dress") || value.includes("skirt")
        ? IMAGE_POOLS.dress
        : value.includes("gift") || value.includes("candle")
          ? IMAGE_POOLS.gifting
          : IMAGE_POOLS.shirt;
  let hash = 0;
  for (const character of `${keyword}${category}${itemId}`) hash = (hash * 31 + character.charCodeAt(0)) | 0;
  return pool[Math.abs(hash) % pool.length];
}
