import { IUser } from "features/auth/types/user";
import { TPrequalificationCategoryData } from "definations/modules/procurement/prequalification-category";
import { TSolicitationEvaluationCriteriaData } from "definations/modules/procurement/solicitation-evaluation-criteria";
import { TFacilityData } from "definations/modules/program/facility";
import { z } from "zod";

export const SSPCompositionSchema = z.object({
    month: z.string().min(1, "This field is required"),
    year: z.string().min(1, "This field is required"),
    visit_date: z.string().min(1, "This field is required"),
    facility: z.string().min(1, "This field is required"),
    team_members: z.array(z.string().min(1, "This field is required")),
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

export type TSupervisionPlanObjective = (TSolicitationEvaluationCriteriaData & {
    evaluation_category: TPrequalificationCategoryData;
})[];

export interface IObjective {
    id: string;
    created_datetime: string;
    updated_datetime: string;
    name: string;
    description: string;
    evaluation_category: {
        id: string;
        created_datetime: string;
        updated_datetime: string;
        name: string;
        description: string;
    };
}

export interface TSupervisionPlanSingleData {
    id: string;
    facility: TFacilityData;
    team_members: IUser[];
    objectives: IObjective[];
    month: string;
    year: string;
    visit_date: string;
    status: string;
}
