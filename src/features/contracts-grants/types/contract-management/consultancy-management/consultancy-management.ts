import { IUser } from "definations/auth/user";
import { TLocationData } from "definations/modules/config/location";
import { z } from "zod";

export const ConsultancyManagementDetailSchema = z.object({
  title: z.string().min(1, "Please enter title"),
  locations: z.array(z.string()).nonempty(),
  grade_level: z.string(),
  commencement_date: z.string().min(1, "Please select commencement date"),
  end_date: z.string().min(1, "Please select end date"),
  consultants_number: z.string().min(1, "Please enter number of consultants"),
  // background: z.string().min(1, "Please enter background"),
});

export type TConsultantanagementDetailsFormData = z.infer<
  typeof ConsultancyManagementDetailSchema
>;

export const ScopeOfWorkSchema = z.object({
  description: z.string().min(1, "Please enter description"),
  background: z.string().min(1, "Please enter background"),
  objectives: z.string().min(1, "Please enter objectives"),
  // deliverables: z.array(
  //   z.object({
  //     deliverable: z.string().min(1, "Please enter deliverable name"),
  //     number_of_days: z.string().min(1, "Please enter number of days"),
  //   })
  // ),
  advertisement_document: z.union([
    z
      .any()
      .refine((files: FileList) => files?.length > 0, "Please select a file"),
    z.string().url(),
  ]),
  // fee_rate: z.string().min(1, "Please enter fee rate"),
  // payment_frequency: z.string().min(1, "Please select payment frequency"),
  // location: z.string().min(1, "Please select payment frequency"),
  // scope_of_work_document: z.union([
  //   z
  //     .any()
  //     .refine((files: FileList) => files?.length > 0, "Please select a file"),
  //   z.string().url(),
  // ]),
});

export type TScopeOfWorkFormData = z.infer<typeof ScopeOfWorkSchema>;

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
  fee_rate: number;
  payment_frequency: string;
}
export interface IConsultantPaginatedData {
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
  consultants_number: number;
  status: string;
  extra_info: string;
  background: string;
  evaluation_comments: string;
  created_by: string;
  updated_by: null;
}

export interface IConsultantSingleData {
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
  consultants_number: number;
  status: string;
  extra_info: string;
  background: string;
  evaluation_comments: string;
  created_by: string;
  updated_by: null;
}
