import { z } from "zod";

export const ProjectDocumentSchema = z.object({
    title: z.string().min(1, "Please enter a title"),
    document_type: z.string().min(1, "Please select a document type"),
    file: z.string().min(1, "Please select a file"),
});

export type TProjectDocumentFormValues = z.infer<typeof ProjectDocumentSchema>;

export type TProjectDocumentData = {
    id: string;
    created_at: string;
    uploaded_at: string;
    uploaded_datetime: string;
    title: string;
    document: string;
    project: string;
};
