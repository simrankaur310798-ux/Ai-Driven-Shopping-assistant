import { PlatformType } from "@/types/lookbook";

export interface DeepLinkResult {
  deepLinkUrl: string;
  fallbackWebUrl: string;
}

/**
 * Optimizes creative stylist phrases into high-conversion merchant search queries.
 */
export function sanitizeSearchQuery(rawQuery: string): string {
  return rawQuery
    .replace(/[^\w\s-]/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Formats deep link URL schemes and web fallbacks for target Indian merchant platforms.
 */
export function generateMerchantLinks(
  platform: PlatformType,
  query: string
): DeepLinkResult {
  const cleanQuery = sanitizeSearchQuery(query);
  const encoded = encodeURIComponent(cleanQuery);
  const slugQuery = cleanQuery.toLowerCase().replace(/\s+/g, "-");

  switch (platform) {
    case "Myntra":
      return {
        deepLinkUrl: `myntra://search?q=${encoded}`,
        fallbackWebUrl: `https://www.myntra.com/${encodeURIComponent(slugQuery)}?f=Gender%3Amen%2Cwomen`,
      };

    case "Ajio":
      return {
        deepLinkUrl: `ajio://search/${encoded}`,
        fallbackWebUrl: `https://www.ajio.com/search/?text=${encoded}`,
      };

    case "Amazon":
      return {
        deepLinkUrl: `amazon://s?k=${encoded}`,
        fallbackWebUrl: `https://www.amazon.in/s?k=${encoded}`,
      };

    case "Nykaa":
      return {
        deepLinkUrl: `nykaa://search/${encoded}`,
        fallbackWebUrl: `https://www.nykaa.com/search/result/?q=${encoded}`,
      };

    case "Snitch":
      return {
        deepLinkUrl: `https://www.snitch.co.in/search?q=${encoded}`,
        fallbackWebUrl: `https://www.snitch.co.in/search?q=${encoded}`,
      };

    case "Westside":
      return {
        deepLinkUrl: `https://www.westside.com/search?q=${encoded}`,
        fallbackWebUrl: `https://www.westside.com/search?q=${encoded}`,
      };

    default:
      return {
        deepLinkUrl: `https://www.google.com/search?q=${encoded}+shopping+india`,
        fallbackWebUrl: `https://www.google.com/search?q=${encoded}+shopping+india`,
      };
  }
}

// Curated high-res Unsplash editorial photography mapped by specific garment types
const GARMENT_IMAGES: Record<string, string[]> = {
  dress: [
    "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800&q=80", // breezy summer dress
    "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=800&q=80", // white sundress
    "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80", // resort slip dress
  ],
  shirt: [
    "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=800&q=80", // linen camp collar shirt
    "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80", // beige resort shirt
    "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80", // cuban collar shirt
  ],
  shorts_pants: [
    "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&w=800&q=80", // linen shorts
    "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80", // casual trousers
    "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?auto=format&fit=crop&w=800&q=80", // relaxed fit pants
  ],
  wedding_ethnic: [
    "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80", // Indian ethnic outfit
    "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80", // festive lehenga/saree
    "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80", // yellow Haldi kurta / festive
  ],
  sunglasses: [
    "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80", // retro sunglasses
    "https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=800&q=80", // stylish shades
  ],
  footwear: [
    "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80", // stylish sandals / shoes
    "https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=80", // casual sneakers
    "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=800&q=80", // relaxed footwear
  ],
  gifting: [
    "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80", // ceramic vase
    "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80", // artisanal coffee press
    "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=80", // scented candles
  ],
  decor: [
    "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=800&q=80", // desk aesthetic
    "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=800&q=80", // potted plant
  ],
};

/**
 * Resolves a dynamic aesthetic fashion visual based on item keyword and category.
 */
export function resolveItemImage(
  imageKeyword: string,
  category: string,
  itemId: string
): string {
  const kw = (imageKeyword + " " + category).toLowerCase();
  let pool = GARMENT_IMAGES.shirt;

  if (kw.includes("dress") || kw.includes("skirt") || kw.includes("sundress") || kw.includes("gown") || kw.includes("frock") || kw.includes("one piece")) {
    pool = GARMENT_IMAGES.dress;
  } else if (kw.includes("kurta") || kw.includes("lehenga") || kw.includes("saree") || kw.includes("sherwani") || kw.includes("ethnic") || kw.includes("haldi") || kw.includes("sangeet") || kw.includes("anarkali") || kw.includes("chikankari")) {
    pool = GARMENT_IMAGES.wedding_ethnic;
  } else if (kw.includes("sunglass") || kw.includes("shades") || kw.includes("eyewear") || kw.includes("jewel") || kw.includes("earring") || kw.includes("necklace") || kw.includes("tote") || kw.includes("bag")) {
    pool = GARMENT_IMAGES.sunglasses;
  } else if (kw.includes("shoe") || kw.includes("slide") || kw.includes("sandal") || kw.includes("sneaker") || kw.includes("jutti") || kw.includes("footwear") || kw.includes("loafer") || kw.includes("flip")) {
    pool = GARMENT_IMAGES.footwear;
  } else if (kw.includes("short") || kw.includes("pant") || kw.includes("trouser") || kw.includes("jean") || kw.includes("bottom") || kw.includes("chino")) {
    pool = GARMENT_IMAGES.shorts_pants;
  } else if (kw.includes("candle") || kw.includes("coffee") || kw.includes("gift") || kw.includes("perfume") || kw.includes("scent") || kw.includes("mug")) {
    pool = GARMENT_IMAGES.gifting;
  } else if (kw.includes("desk") || kw.includes("lamp") || kw.includes("plant") || kw.includes("decor") || kw.includes("room") || kw.includes("light")) {
    pool = GARMENT_IMAGES.decor;
  }

  // Hash string for deterministic selection
  let hash = 0;
  const str = itemId + imageKeyword;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % pool.length;
  return pool[index];
}
