import { z } from "zod";
const { object, string } = z;

const isBrowser =
  typeof window !== "undefined" && typeof FileList !== "undefined";

export const workforceQualificationSchema = object({
  name: string().min(1, "Field is required"),
  institution: string().min(1, "Field is required"),
  year: string().min(1, "Field is required"),
  document: isBrowser ? z.instanceof(FileList) : z.any(),
});
export const workforcePensionSchema = object({
  name: string().min(1, "Field is required"),
  rsa_number: string().min(1, "Field is required"),
  pfc_account_name: string().min(1, "Field is required"),
  pfc_account_number: string().min(1, "Field is required"),
  date_provided: string().min(1, "Field is required"),
});
export const workforceAdditionalInfoSchema = object({
  date_of_birth: string().min(1, "Field is required"),
  address: string().min(1, "Field is required"),
  marital_status: string().min(1, "Field is required"),
  religion: string().min(1, "Field is required"),
  emergency_contact_one: object({
    name: string().min(1, "Field is required"),
    relationship: string().min(1, "Field is required"),
    phone_number_1: string().min(1, "Field is required"),
    phone_number_2: string().min(1, "Field is required"),
    email: string().email().min(1, "Field is required"),
    address: string().min(1, "Field is required"),
  }),
  emergency_contact_two: object({
    name: string().min(1, "Field is required"),
    relationship: string().min(1, "Field is required"),
    phone_number_1: string().min(1, "Field is required"),
    phone_number_2: string().min(1, "Field is required"),
    email: string().email().min(1, "Field is required"),
    address: string().min(1, "Field is required"),
  }),
});
export const workforceBankAccountSchema = object({
  bank_name: string().min(1, "Field is required"),
  branch_name: string().min(1, "Field is required"),
  account_name: string().min(1, "Field is required"),
  account_number: string().min(1, "Field is required"),
  sort_code: string().min(1, "Field is required"),
  date_provided: string().min(1, "Field is required"),
});

export const workforceSchema = object({
  user: object({
    first_name: string().min(1, "Field is required"),
    last_name: string().min(1, "Field is required"),
    email: string().email().min(1, "Field is required"),
    phone_number: string().min(1, "Field is required"),
    gender: string().min(1, "Field is required"),
    designation: string().min(1, "Field is required"),
  }),
  employee_number: string().min(1, "Field is required"),
  employment_type: string().min(1, "Field is required"),
  employment_status: string().min(1, "Field is required"),
  date_of_hire: z.string().min(1, "Field is required"),
  // date_of_leaving: z.string().min(1, "Field is required"),
  signature: isBrowser ? z.instanceof(FileList) : z.any(),
  passport: isBrowser ? z.instanceof(FileList) : z.any(),
  location: z.string().min(1, "Field is required"),
  department: z.string().min(1, "Field is required"),
  position: z.string().min(1, "Field is required"),
  grade: z.string().min(1, "Field is required"),
});

export const hrGradeSchema = object({
  name: z.string().min(1, "Field is required"),
});
export const hrBeneficiarySchema = object({
  beneficiary_type: string().min(1, "Field is required"),
  name: string().min(1, "Field is required"),
  relationship: string().min(1, "Field is required"),
  percentage: string().min(1, "Field is required"),
  phone_number: string().min(1, "Field is required"),
  employee: string().min(1, "Field is required"),
});
export const hrContingentBeneficiarySchema = object({
  beneficiary_type: string().min(1, "Field is required"),
  name: string().min(1, "Field is required"),
  relationship: string().min(1, "Field is required"),
  phone_number: string().min(1, "Field is required"),
  employee: string().min(1, "Field is required"),
});

export const jobAdvertismentSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  grade_level: z.string().min(1, "Grade Level is required"),
  locations: z.string().min(1, "Locations is required"),
  job_type: z.enum(["INTERNAL", "EXTERNAL", "BOTH"]),
  duration: z.string().min(1, "Duration is required"),
  commencement_date: z.string().min(1, "Commencement Date is required"),
  number_of_positions: z.preprocess(
    (val) => Number(val),
    z.number().positive("Must be a positive number")
  ),
  supervisor: z.string().min(1, "Supervisor is required"),
  any_other_info: z.string().optional(),
  background: z.string().min(1, "Background is required"),
  advert_document: z.any().optional(),
});

export const jobApplicationSchema = z.object({
  applicant_name: z.string().min(3, "Name must be at least 3 characters"),
  applicant_email: z.string().email("Invalid email"),
  application_notes: z.string().optional(),
  cover_letter: z
    .string()
    .min(10, "Cover letter must be at least 10 characters"),
  employment_type: z.enum(["internal", "external", "both"]),
  job: z.string().uuid("Invalid Job ID"),
  position_applied: z.string().min(2, "Position is required"),
  referee_1_name: z.string().optional(),
  referee_1_email: z.string().email().optional(),
  referee_2_name: z.string().optional(),
  referee_2_email: z.string().email().optional(),
  referee_3_name: z.string().optional(),
  referee_3_email: z.string().email().optional(),
  // interview_date: z.string().optional(),
  // interviewer: z.string().optional(),
  // interview_feedback: z.string().optional(),
  // decision_date: z.string().optional(),
  // decision_made_by: z.string().optional(),
  resume: z.any().optional(), // File will be converted to Base64
  status: z.enum(["applied", "interviewed", "hired", "rejected"]),
});

export type HrContingentBeneficiaryFormValues = z.infer<
  typeof hrContingentBeneficiarySchema
>;

export type HrJobAdvertismentFormValues = z.infer<typeof jobAdvertismentSchema>;
export type HrBeneficiaryFormValues = z.infer<typeof hrBeneficiarySchema>;
export type HrGradeFormValues = z.infer<typeof hrGradeSchema>;
export type WorkforceFormValues = z.infer<typeof workforceSchema>;
export type WorkforcePensionFormValues = z.infer<typeof workforcePensionSchema>;
export type WorkforceAdditionalInfoFormValues = z.infer<
  typeof workforceAdditionalInfoSchema
>;
export type WorkforceBankAccountFormValues = z.infer<
  typeof workforceBankAccountSchema
>;
export type WorkforceQualificationFormValues = z.infer<
  typeof workforceQualificationSchema
>;
