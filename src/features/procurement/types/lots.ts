export type LotsResultsData = {
  id: string;
  name: string;
  packet_number: number;
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
