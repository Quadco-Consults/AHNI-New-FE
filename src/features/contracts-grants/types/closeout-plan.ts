import { TDepartmentData } from "definations/modules/config/department";
import { TLocationData } from "definations/modules/config/location";
import { IProjectSingleData } from "definations/project";
import { z } from "zod";

export const CloseOutPlanSchema = z.object({
    project: z.string().min(1, "Please select project"),
    department: z.string().min(1, "Please select department"),
    location: z.string().min(1, "Please select location"),
    tasks: z.array(
        z.object({
            key_task: z.string().min(1, "Please enter key task"),
            activities: z.array(
                z.object({
                    description: z.string().min(1, "Please enter description"),
                    designation: z.string().min(1, "Please enter designation"),
                    remarks: z.string().optional(),
                    start_date: z.string().min(1, "Please select start date"),
                    end_date: z.string().min(1, "Please select end date"),
                    status: z.string().optional(),
                })
            ).min(1, "At least one activity is required"),
        })
    ).min(1, "At least one task is required"),
});

export type TCloseOutPlanFormData = z.infer<typeof CloseOutPlanSchema>;

// Activity within a key task
export interface ICloseOutPlanActivity {
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

// Key Task with its activities
export interface ICloseOutPlanTask {
    id: string;
    key_task: string;
    activities: ICloseOutPlanActivity[];
    created_datetime: string;
    updated_datetime: string;
}

export interface ICloseOutPlanPaginatedData {
    id: string;
    project: string;
    department: string;
    location: string;
    created_datetime: string;
    updated_datetime: string;
    created_by: string;
    updated_by: string | null;
}

export interface ICloseOutPlanSingleData {
    id: string;
    project: IProjectSingleData;
    department: TDepartmentData;
    location: TLocationData;
    tasks: ICloseOutPlanTask[];
    created_datetime: string;
    updated_datetime: string;
    created_by: string;
    updated_by: string | null;
}
