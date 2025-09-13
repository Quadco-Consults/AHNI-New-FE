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
