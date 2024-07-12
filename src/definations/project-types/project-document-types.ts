export type ProjectDocumentTypesResultsData = {
  id: string;
  name: string;
  description: string;
};

export interface ProjectDocumentTypesData {
  count: number;
  next: string;
  number_of_pages: number;
  previous: string;
  results: ProjectDocumentTypesResultsData[];
}

export interface ProjectDocumentTypesResponse {
  message: string;
  data: ProjectDocumentTypesResultsData;
}
