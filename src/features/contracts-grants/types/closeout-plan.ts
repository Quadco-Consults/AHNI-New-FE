import { TDepartmentData, TLocationData } from "@/features/modules/types/config";
import { IProjectSingleData } from "@/features/projects/types/project";
import { z } from "zod";

export const CloseOutPlanSchema = z.object({
    project: z.string().min(1, "Please select project"),
    department: z.string().min(1, "Please enter main plan title"),
    location: z.string().min(1, "Please select location"),
    tasks: z.array(
        z.object({
            key_task: z.string().optional(), // Section heading is optional
            activities: z.array(
                z.object({
                    description: z.string().min(1, "Please enter description"),
                    designation: z.string().optional(), // Can be empty for section headers
                    remarks: z.string().optional(),
                    start_date: z.string().optional(), // Can be empty for section headers
                    end_date: z.string().optional(), // Can be empty for section headers
                    status: z.string().optional(),
                })
            ).min(1, "At least one activity is required"),
        })
    ).min(1, "At least one task is required"),
});

export type TCloseOutPlanFormData = z.infer<typeof CloseOutPlanSchema>;

// Task/Activity object (flat structure as returned by backend)
export interface ICloseOutPlanTask {
    id: string;
    description: string;
    designation: string;
    remarks: string;
    start_date: string;
    end_date: string;
    status: string;
    created_datetime: string;
    updated_datetime: string;
}

export interface ICloseOutPlanPaginatedData {
    id: string;
    project: string | IProjectSingleData; // Can be string ID or expanded project object
    department: string;
    location: string;
    key_task?: string; // Section heading for the plan
    status?: string;
    created_datetime: string;
    updated_datetime: string;
    created_by: string;
    updated_by: string | null;
}

export interface ICloseOutPlanSingleData {
    id: string;
    project: IProjectSingleData | string;
    department: TDepartmentData | string;
    location: TLocationData | string;
    key_task?: string; // Section heading for the entire plan
    tasks: ICloseOutPlanTask[]; // Flat array of tasks, each with description
    status?: string;
    created_datetime: string;
    updated_datetime: string;
    created_by: string;
    updated_by: string | null;
}
