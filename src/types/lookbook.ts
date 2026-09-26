export type OccasionCategory =
  | "vacation"
  | "wedding"
  | "gifting"
  | "home_decor"
  | "casual_lifestyle";

export type ItemCategory =
  | "apparel"
  | "footwear"
  | "accessory"
  | "grooming_beauty"
  | "decor_gift";

export type PlatformType =
  | "Myntra"
  | "Ajio"
  | "Amazon"
  | "Nykaa"
  | "Snitch"
  | "Westside"
  | "FirstCry";

export interface CuratedItem {
  itemId: string;
  itemName: string;
  category: ItemCategory;
  approxPriceINR: number;
  primaryPlatform: PlatformType;
  stylistNote: string;
  merchantSearchQuery: string;
  imageKeyword: string;
  // Computed fields:
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
  occasionCategory: OccasionCategory;
  tabs: SubEventTab[];
  suggestedRefinementPills: string[];
}

export interface CurateRequestBody {
  prompt: string;
  vibeContext?: string | null;
  activeCategory?: OccasionCategory | null;
}
