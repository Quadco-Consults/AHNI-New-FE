import { TDepartmentData } from "definations/modules/config/department";
import { TLocationData } from "definations/modules/config/location";
import { IProjectSingleData } from "definations/project";
import { z } from "zod";

export const CloseOutPlanSchema = z.object({
    project: z.string().min(1, "Please select project"),
    department: z.string().min(1, "Please select department"),
    location: z.string().min(1, "Please select location"),
    // key_task: z.string().min(1, "Please enter key task"),
    // tasks: z.array(
    //     z.object({
    //         designation: z.string().min(1, "Please enter designation"),
    //         remarks: z.string().min(1, "Please enter remarks"),
    //         start_date: z.string().min(1, "Please select start date"),
    //         end_date: z.string().min(1, "Please select end date"),
    //     })
    // ),

    tasks: z.array(
        z.object({
            key_task: z.string().min(1, "Please enter key task"),
            activities: z.array(
                z.object({
                    description: z.string().min(1, "Please enter description"),
                    designation: z.string().min(1, "Please enter designation"),
                    remarks: z.string().min(1, "Please enter remarks"),
                    start_date: z.string().min(1, "Please select start date"),
                    end_date: z.string().min(1, "Please select end date"),
                })
            ),
        })
    ),
});

export type TCloseOutPlanFormData = z.infer<typeof CloseOutPlanSchema>;

export interface ICloseOutPlanTask {
    id: string;
    created_datetime: string;
    updated_datetime: string;
    designation: string;
    remarks: string;
    start_date: string;
    end_date: string;
}

export interface ICloseOutPlanPaginatedData {
    id: string;
    project: string;
    department: string;
    location: string;
    created_datetime: string;
    updated_datetime: string;
    status: string;
    key_task: string;
    created_by: string;
    updated_by: null;
}

export interface ICloseOutPlanSingleData {
    id: string;
    project: IProjectSingleData;
    department: TDepartmentData;
    location: TLocationData;
    tasks: ICloseOutPlanTask[];
    key_task: string;
    created_datetime: string;
    updated_datetime: string;
    status: string;
    created_by: string;
    updated_by: null;
}
