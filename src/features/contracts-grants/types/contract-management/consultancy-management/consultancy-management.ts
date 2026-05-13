import { IUser } from "definations/auth/user";
import { TLocationData } from "definations/modules/config/location";
import { z } from "zod";

export const ConsultancyManagementDetailSchema = z.object({
  title: z.string().min(1, "Please enter title"),
  contract_request: z.string().optional(), // Contract request ID
  job_description: z.string().optional(), // Job description - renamed from "description" to avoid conflict
  locations: z.array(z.string()).nonempty(),
  grade_level: z.string().optional(), // Optional grade level
  commencement_date: z.string().min(1, "Please select commencement date"),
  end_date: z.string().min(1, "Please select end date"),
  consultants_number: z.union([
    z.string().min(1, "Please enter number of consultants"),
    z.number()
  ]).transform((val) => String(val)),
  facilitator_number: z.union([
    z.string().min(1, "Please enter number of facilitators"),
    z.number()
  ]).transform((val) => String(val)).optional(), // For facilitator management
  supervisor: z.string().optional(), // Optional supervisor field for facilitators
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
    z.any(), // FileList - optional, no validation required
    z.string(),
  ]).optional(),
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
  type?: "CONSULTANT" | "ADHOC" | "FACILITATOR";
  locations: string[]; // API returns array of strings, not location objects
  total_working_days_calculated?: number;
  days_worked_calculated?: number;
  days_remaining_calculated?: number;
  contract_status_calculated?: string;
  advertisement_document: string;
  supervisor?: string | { id: string; name: string; description?: string };
  created_datetime: string;
  updated_datetime: string;
  title: string;
  grade_level: string | { id: string; name: string; description?: string };
  duration: number;
  commencement_date: string;
  end_date: string;
  consultants_number: number;
  status: string;
  extra_info?: string;
  background: string; // API returns background as string, not scope_of_work object
  evaluation_comments?: string;
  created_by: string;
  updated_by?: string | null;
  applicants?: string[]; // List of applicant IDs
}

export interface IConsultantSingleData {
  id: string;
  type?: "CONSULTANT" | "ADHOC" | "FACILITATOR";
  scope_of_work?: IScopeOfWorkData; // Make optional since API may not always include this
  advertisement_document: string;
  supervisor: IUser | string; // Can be User object or string
  locations: string[] | TLocationData[]; // Can be either format
  created_datetime: string;
  title: string;
  grade_level: string | { id: string; name: string; description?: string };
  duration: number;
  commencement_date: string;
  end_date: string;
  consultants_number: number;
  status: string;
  extra_info?: string;
  background: string; // Always present as string
  evaluation_comments?: string;
  created_by: string;
  updated_by?: string | null;
  updated_datetime?: string;
  total_working_days_calculated?: number;
  days_worked_calculated?: number;
  days_remaining_calculated?: number;
  contract_status_calculated?: string;
  applicants?: string[];
  requisition?: {
    id: string;
    requisition_number: string;
    position_title: string;
    status: string;
    priority: string;
    created_datetime: string;
    proposed_salary?: string;
    currency?: string;
    start_date?: string;
    end_date?: string;
  };
}
