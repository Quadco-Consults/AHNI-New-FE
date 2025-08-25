import { z } from "zod";

export const LotSchema = z.object({
    name: z.string().min(1, "Field Required"),
    packet_number: z.string().min(1, "Field Required"),
});

export type TLotFormValues = z.infer<typeof LotSchema>;

export interface TLotData {
    id: string;
    name: string;
    packet_number: number;
}
