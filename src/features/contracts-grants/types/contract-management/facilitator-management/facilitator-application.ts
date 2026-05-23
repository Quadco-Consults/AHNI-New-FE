import { z } from "zod";

export const FacilitatorApplicantSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone_number: z.string().min(10, "Phone number must be at least 10 digits"),
  qualifications: z.string().min(1, "Qualifications are required"),
  experience: z.string().min(1, "Experience is required"),
  facilitator_id: z.string().optional(),
  referee_one: z.object({
    name: z.string().min(1, "Field Required"),
    email: z.string().min(1, "Field Required").email("Enter a valid email address"),
    phone_number: z.string().min(1, "Field Required"),
    designation: z.string().min(1, "Field Required"),
    address: z.string().min(1, "Field Required"),
  }),
  referee_two: z.object({
    name: z.string().min(1, "Field Required"),
    email: z.string().min(1, "Field Required").email("Enter a valid email address"),
    phone_number: z.string().min(1, "Field Required"),
    designation: z.string().min(1, "Field Required"),
    address: z.string().min(1, "Field Required"),
  }),
});

export type TFacilitatorApplicantFormData = z.infer<typeof FacilitatorApplicantSchema>;

export interface IFacilitatorApplicantPaginatedData {
  id: string;
  created_datetime: string;
  updated_datetime: string;
  name: string;  // API returns single name field
  first_name?: string;  // Optional for form data
  last_name?: string;   // Optional for form data
  email: string;
  phone_number: string;
  qualifications?: string;
  experience?: string;
  status: "APPLIED" | "SELECTED" | "REJECTED" | "APPROVED";
  facilitator: string | any; // API might return object instead of string
  created_by: string | any; // API might return object instead of string
  updated_by: string | null | any; // API might return object instead of string
}

export interface IFacilitatorApplicantSingleData {
  id: string;
  created_datetime: string;
  updated_datetime: string;
  name: string;  // API returns single name field
  first_name?: string;  // Optional for form data
  last_name?: string;   // Optional for form data
  email: string;
  phone_number: string;
  qualifications?: string;
  experience?: string;
  status: "APPLIED" | "SELECTED" | "REJECTED" | "APPROVED";
  facilitator: string;
  created_by: string;
  updated_by: string | null;
}