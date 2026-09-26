export type PlatformType =
  | "Myntra"
  | "Ajio"
  | "Amazon"
  | "Nykaa"
  | "Snitch"
  | "Westside"
  | "FirstCry";

export type ItemCategory =
  | "apparel"
  | "footwear"
  | "accessory"
  | "grooming_beauty"
  | "decor_gift";

export interface CuratedItem {
  itemId: string;
  itemName: string;
  category: ItemCategory;
  approxPriceINR: number;
  primaryPlatform: PlatformType;
  stylistNote: string;
  merchantSearchQuery: string;
  imageKeyword: string;
  deepLinkUrl?: string;
  fallbackWebUrl?: string;
  resolvedImageUrl?: string;
}

export interface SubEventTab {
  tabId: string;
  tabTitle: string;
  tabIcon: string;
  items: CuratedItem[];
}

export interface LookbookResponse {
  lookbookTitle: string;
  tagline: string;
  cityOrSetting: string;
  occasionCategory: "vacation" | "wedding" | "gifting" | "home_decor" | "casual_lifestyle";
  tabs: SubEventTab[];
  suggestedRefinementPills: string[];
}
