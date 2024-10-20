import { z } from "zod";
const { object, string } = z;

export const workforceQualificationSchema = object({
  name: string().min(1, "Field is required"),
  institution: string().min(1, "Field is required"),
  year: string().min(1, "Field is required"),
  document: string().min(1, "Field is required"),
});
export const workforcePensionSchema = object({
  name: string().min(1, "Field is required"),
  rsa_number: string().min(1, "Field is required"),
  pfc_account_name: string().min(1, "Field is required"),
  pfc_account_number: string().min(1, "Field is required"),
  date_provided: string().min(1, "Field is required"),
});

export const workforceSchema = object({
  name: string().min(1, "Field is required"),
  description: string().min(1, "Field is required"),
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
  date_of_leaving: z.string().min(1, "Field is required"),
  signature: string().min(1, "Field is required"),
  passport: string().min(1, "Field is required"),
  location: z.string().min(1, "Field is required"),
  department: z.string().min(1, "Field is required"),
  position: z.string().min(1, "Field is required"),
  grade: z.string().min(1, "Field is required"),
});

export type WorkforceFormValues = z.infer<typeof workforceSchema>;
export type WorkforcePensionFormValues = z.infer<typeof workforcePensionSchema>;
export type WorkforceQualificationFormValues = z.infer<
  typeof workforceQualificationSchema
>;
