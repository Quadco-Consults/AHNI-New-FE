import { z } from "zod";

export const LotSchema = z.object({
    packet_number: z.string(),
    name: z.string(),
});

export type TLotFormValues = z.infer<typeof LotSchema>;

export interface TLotData {
    id: string;
    name: string;
    packet_number: number;
}
