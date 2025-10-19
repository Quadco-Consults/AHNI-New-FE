export type LotsResultsData = {
  id: string;
  name: string;
  packet_number: number;
  parent?: string | null; // UUID of parent lot (null for top-level lots)
  parent_name?: string | null; // Name of parent lot
  sub_lots?: LotsResultsData[]; // Nested sub-lots
};

export interface LotsData {
  count: number;
  next: string;
  number_of_pages: number;
  previous: string;
  results: LotsResultsData[];
}

export interface LotsResponse {
  message: string;
  data: LotsResultsData;
}
