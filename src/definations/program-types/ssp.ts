import { z } from "zod";

export const SSPCompositionSchema = z.object({
    month: z.string().min(1, "This field is required"),
    year: z.string().min(1, "This field is required"),
    visit_date: z.string().min(1, "This field is required"),
    facility: z.string().min(1, "This field is required"),
    team_members: z.array(z.string().min(1, "This field is required")),
    // ob: z.string().min(1, "This field is required"),
});

export type TSSPCompositionFormValues = z.infer<typeof SSPCompositionSchema>;

export interface TSupervisionPlanPaginatedData {
    id: string;
    facility: string;
    team_members: string[];
    created_datetime: string;
    updated_datetime: string;
    month: string;
    year: string;
    visit_date: string;
    status: string;
    objectives: string[];
}

export interface TSupervisionPlanSingleData {
    id: string;
    facility: {
        id: string;
        created_datetime: string;
        updated_datetime: string;
        name: string;
        contact_person: string;
        postion: string;
        state: string;
        email: string;
        phone: string;
        lga: string;
    };
    team_members: {
        id: string;
        email: string;
        first_name: string;
        last_name: string;
    }[];
    objectives: {
        id: string;
        name: string;
        description: string;
        evaluation_category: string | null;
    }[];
    month: string;
    year: string;
    visit_date: string;
    status: string;
}
