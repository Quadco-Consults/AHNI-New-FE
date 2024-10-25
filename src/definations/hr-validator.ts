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

export type HrContingentBeneficiaryFormValues = z.infer<
  typeof hrContingentBeneficiarySchema
>;
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
