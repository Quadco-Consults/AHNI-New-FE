export type VendorsDocumentResultsData = {
  uploaded_datetime: any;
  files: any;
  id: string;
  created_at: string;
  updated_at: string;
  document_type: string;
  document: string;
  vendor: string;
};

export interface VendorsDocumentData {
  count: number;
  next: string;
  number_of_pages: number;
  previous: string;
  results: VendorsDocumentResultsData[];
}

export interface VendorsDocumentResponse {
  message: string;
  data: VendorsDocumentResultsData;
}
