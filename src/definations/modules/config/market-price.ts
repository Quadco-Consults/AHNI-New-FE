import { z } from "zod";

export const MarketPriceSchema = z.object({
  unit_price: z.string(),
  source: z.string(),
  date: z.string(),
  item: z.string(),
});

export type TMarketPriceFormValues = z.infer<typeof MarketPriceSchema>;

export interface TMarketPriceData {
  created_at: string;
  updated_at: string;
  unit_price: string;
  source: string;
  item_detail: {
    name: string;
  };
  date: string;
  item: string;
  id: string;
}
