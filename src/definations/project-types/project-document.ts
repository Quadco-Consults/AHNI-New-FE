export type ProjectDocumentResultsData = {
    id: string;
    created_at: string;
    uploaded_at: string;
    uploaded_datetime: string;
    title: string;
    document: string;
    project: string;
};

export interface ProjectDocumentData {
    count: number;
    next: string;
    number_of_pages: number;
    previous: string;
    results: ProjectDocumentResultsData[];
}

export interface ProjectDocumentResponse {
    message: string;
    data: ProjectDocumentResultsData;
}
