import { z } from "zod";
const { object, string } = z;

const isBrowser =
  typeof window !== "undefined" && typeof FileList !== "undefined";

export const workforceQualificationSchema = object({
  certificate_name: string().min(1, "Field is required"),
  institution_name: string().min(1, "Field is required"),
  date_of_qualification: string().min(1, "Field is required"),
  certificate_file: isBrowser ? z.instanceof(FileList) : z.any(),
  employee: string().min(1, "Field is required"),
});
export const workforcePensionSchema = object({
  pfa_name: string().min(1, "Field is required"),
  pfc_account_name: string().min(1, "Field is required"),
  rsa_number: string().min(1, "Field is required"),
  pfc_account_number: string().min(1, "Field is required"),
  has_existing_retirement_savings: z.boolean(),
  is_match_existing_pfa: z.boolean(), 
  pfa_registeration_date: string().min(1, "Field is required"),
  employee: string().min(1, "Field is required"),
});
export const workforceAdditionalInfoSchema = object({
  name: string().min(1, "Field is required"),
  relationship: string().min(1, "Field is required"),
  home_phone: string().min(1, "Field is required"),
  mobile_phone: string().min(1, "Field is required"),
  email_address: string().email().min(1, "Field is required"),
  address: string().min(1, "Field is required"),
  employee: string().min(1, "Field is required"),
});
export const workforceBankAccountSchema = object({
  bank_name: string().min(1, "Field is required"),
  branch_name: string().min(1, "Field is required"),
  account_name: string().min(1, "Field is required"),
  account_number: string().min(1, "Field is required"),
  sort_code: string().min(1, "Field is required"),
  employee: string().min(1, "Field is required"),
});

export const workforceSchema = object({
 
  legal_firstname: z.string().min(1, "Field is required"),
  legal_middlename: z.string().optional(),
  legal_lastname: z.string().min(1, "Field is required"),
  address: z.string().min(1, "Field is required"),
  designation: z.string().min(1, "Field is required"),
  phone_number: z.string().min(1, "Field is required"),
  other_number: z.string().optional(),
  date_of_birth: z.string().date("Field is required"), 
  date_of_hire: z.string().min(1, "Field is required"), 
  ss_number: z.string().min(1, "Field is required"),
  serial_id_code: z.string().min(1, "Field is required"),
  signature_file: isBrowser ? z.instanceof(FileList) : z.any(),
  passport_file: isBrowser ? z.instanceof(FileList) : z.any(), 
  marital_status:  z.enum(["single", "married", "divorced"]),
  own_computer: z.boolean(),
  require_email_access: z.boolean(),
  employment_type: z.enum(["INTERNAL", "EXTERNAL", "BOTH"]),
  group: z.string().min(1, "Field is required"), 
  location: z.string().min(1, "Field is required"), 
  application: z.string().min(1, "Field is required"), 
  department: z.string().min(1, "Field is required"), 
  project: z.string().min(1, "Field is required"),  
});

export const hrGradeSchema = object({
  name: z.string().min(1, "Field is required"),
});
export const hrBeneficiarySchema = object({
  is_primary: z.boolean(),
  name: string().min(1, "Field is required"),
  relationship: string().min(1, "Field is required"),
  percentage_of_benefit: string().min(1, "Field is required"),
  phone_number: string().min(1, "Field is required"),
  employee: string().min(1, "Field is required"),
});
export const hrContingentBeneficiarySchema = object({
  is_primary: z.boolean(),
  name: string().min(1, "Field is required"),
  relationship: string().min(1, "Field is required"),
  phone_number: string().min(1, "Field is required"),
  employee: string().min(1, "Field is required"),
});
export const hrSignatoriesBeneficiarySchema = object({ 
  witness_name: string().min(1, "Field is required"),
  witness_date: string().min(1, "Field is required"),
  witness_signature: isBrowser ? z.instanceof(FileList) : z.any(),
  employee: string().min(1, "Field is required"),
});

export const jobAdvertismentSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  grade_level: z.string().min(1, "Grade Level is required"),
  locations: z.string().min(1, "Locations is required"),
  interviewers: z.array(z.string().uuid()).min(1, "At least one interviewer is required"), 
  job_type: z.enum(["Internal", "External", "Both"]),
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
    .any().optional(),
  employment_type: z.enum(["INTERNAL", "EXTERNAL", "BOTH"]),
  advertisement: z.string().uuid("Invalid Advert ID"),
  interview_date: z.string().optional(),
  position_applied: z.string().min(2, "Position is required"),
  referees: z.array(
    z.object({
      name: z.string().min(3, "Name must be at least 3 characters"),
      email: z.string().email("Invalid email")
    })
  ).min(1, "At least one referee is required"),

  resume: z.any().optional(), // File will be converted to Base64
  status: z.enum(["applied", "interviewed", "hired", "rejected"]),
});
export const workforceNeedAnalysisSchema = z.object({  
  current_staff_count: z.string().min(1,"Current Staff Count is required"),
  wisn_required_staff_count: z.string().min(1,"WISN STAFF COUNT is required"), 
  shortage_excess_count: z.string().min(1,"Shortage or excess count is required"), 
  workforce_problem: z.string().min(1, "Workforce Problem is required"), 
  wisn_ratio: z.string().min(1, "WISN Ratio is required"), 
  workload_problem: z.string().min(1, "Workload Problem is required"), 
  position: z.string().min(1, "Position is required"), 
  location: z.string().min(1, "Location is required"),
});

export type HrContingentBeneficiaryFormValues = z.infer<
  typeof hrContingentBeneficiarySchema
>;
export type HrSignatoriesBeneficiaryFormValues = z.infer<
  typeof hrSignatoriesBeneficiarySchema
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
