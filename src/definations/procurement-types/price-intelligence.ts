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

export interface PriceIntelligenceDetail extends PriceIntelligenceList {
  history: {
    id: string;
    created_at: string;
    updated_at: string;
    price: number;
    source: string;
    date: string;
    item: string;
  }[];
}
