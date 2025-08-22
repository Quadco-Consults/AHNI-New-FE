import { z } from "zod";

export const QuestionnaireSchema = z.object({
    name: z.string().min(1, "Field Required"),
    description: z.string().optional(),
});

export type TQuestionnaireFormValues = z.infer<typeof QuestionnaireSchema>;

export interface TQuestionnaireData {
    created_at: string;
    description: string;
    id: string;
    name: string;
    updated_at: string;
}
