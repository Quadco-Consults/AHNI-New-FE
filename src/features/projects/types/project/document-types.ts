import { z } from "zod";

export const DocumentTypeSchema = z.object({
    name: z.string().min(1, "Field Required"),
    description: z.string(),
});

export type TDocumentTypeFormValues = z.infer<typeof DocumentTypeSchema>;

export interface TDocumentTypeData {
    id: string;
    name: string;
    description: string;
}
