import { z } from "zod";

export const ItemSchema = z.object({
    name: z.string(),
    description: z.string(),
    uom: z.string(),
    category: z.string(),
});

export type TItemFormValues = z.infer<typeof ItemSchema>;

export interface TItemData {
    created_at: string;
    description: string;
    id: string;
    name: string;
    updated_at: string;
    uom: string;
    category: string;
}
