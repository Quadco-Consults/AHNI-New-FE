export interface PriceIntelligenceList {
  id: string;
  min_price: number;
  max_price: number;
  avg_price: number;
  created_at: string;
  updated_at: string;
  name: string;
  description: string;
  uom: string;
  category: string;
}

export interface PriceIntelligenceHistory {
  price: number;
  source: string;
  date: string;
}

export interface PriceIntelligenceDetail extends PriceIntelligenceList {
  history: PriceIntelligenceHistory[];
  source_prices: {
    [key: string]: { price: number; created_datetime: string }[];
  };
}

// Market Item Types
export interface MarketItemCreate {
  item: string; // UUID of the item
  unit_price: number;
  source?: string; // "Market Survey" | "Other" | etc
  date?: string; // ISO date string
}

export interface MarketItemResponse {
  id: string;
  item: string;
  item_detail?: {
    id: string;
    name: string;
    description: string;
    category?: string;
    uom?: string;
  };
  unit_price: number;
  source: string;
  date: string;
  created_datetime: string;
  updated_datetime: string;
}
