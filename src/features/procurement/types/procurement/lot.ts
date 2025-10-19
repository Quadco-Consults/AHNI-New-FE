import { z } from "zod";

export const LotSchema = z.object({
    name: z.string().min(1, "Lot name is required"),
    packet_number: z.union([
        z.string().min(1, "Packet number is required"),
        z.number().positive("Packet number must be positive")
    ]),
    parent: z.string().optional().nullable(), // Parent lot UUID (null/empty for top-level lots)
});

export type TLotFormValues = z.infer<typeof LotSchema>;

export interface TLotData {
    id: string;
    name: string;
    packet_number: number;
    parent?: string | null; // Parent lot UUID
    parent_name?: string | null; // Parent lot name (read-only from backend)
    sub_lots?: TLotData[]; // Nested sub-lots (read-only from backend)
}
