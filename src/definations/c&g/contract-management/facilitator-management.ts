import { IUser } from "definations/auth/user";
import { TLocationData } from "definations/modules/config/location";
import { z } from "zod";

export const FacilitatorManagementDetailSchema = z.object({
    title: z.string().min(1, "Please enter title"),
    grade_level: z.string().min(1, "Please enter grade level"),
    locations: z.array(z.string()).nonempty(),
    duration: z.string().min(1, "Please enter duration"),
    commencement_date: z.string().min(1, "Please select commencement date"),
    end_date: z.string().min(1, "Please select end date"),
    facilitaor_number: z.string().min(1, "Please enter number of consultants"),
    extra_info: z.string().min(1, "Please enter extra info"),
    background: z.string().min(1, "Please enter background"),
    evaluation_comments: z.string().min(1, "Please enter evaluation comment"),
    advertisement_document: z
        .any()
        .refine((files: FileList) => files?.length > 0, "Please select a file"),
    supervisor: z.string().min(1, "Please select supervisor"),
});

export type TFacilitatorManagementDetailsFormData = z.infer<
    typeof FacilitatorManagementDetailSchema
>;

export const FacilitatorScopeOfWorkSchema = z.object({
    description: z.string().min(1, "Please enter description"),
    background: z.string().min(1, "Please enter background"),
    objectives: z.string().min(1, "Please enter objectives"),
    deliverables: z.array(
        z.object({
            deliverable: z.string().min(1, "Please enter deliverable name"),
            number_of_days: z.string().min(1, "Please enter number of days"),
        })
    ),
    advertisement_document: z
        .any()
        .refine((files: FileList) => files?.length > 0, "Please select a file"),

    scope_of_work_document: z
        .any()
        .refine((files: FileList) => files?.length > 0, "Please select a file"),
});

export type TFacilitatorScopeOfWorkFormData = z.infer<
    typeof FacilitatorScopeOfWorkSchema
>;

export interface IScopeOfWorkData {
    id: string;
    deliverables: {
        deliverable: string;
        number_of_days: number;
    }[];
    advertisement_document: string;
    scope_of_work_document: string;
    created_datetime: string;
    updated_datetime: string;
    description: string;
    background: string;
    location: string;
    objectives: string;
}

export interface IFacilitatorPaginatedData {
    id: string;
    scope_of_work: IScopeOfWorkData;
    advertisement_document: string;
    supervisor: string;
    locations: TLocationData[];
    created_datetime: string;
    updated_datetime: string;
    title: string;
    grade_level: string;
    duration: number;
    commencement_date: string;
    end_date: string;
    facilitaor_number: number;
    status: string;
    extra_info: string;
    background: string;
    evaluation_comments: string;
    created_by: string;
    updated_by: null;
}

export interface IFacilitatorSingleData {
    id: string;
    scope_of_work: IScopeOfWorkData;
    advertisement_document: string;
    supervisor: IUser;
    locations: TLocationData[];
    created_datetime: string;
    title: string;
    grade_level: string;
    duration: number;
    commencement_date: string;
    end_date: string;
    facilitaor_number: number;
    status: string;
    extra_info: string;
    background: string;
    evaluation_comments: string;
    created_by: string;
    updated_by: null;
}
