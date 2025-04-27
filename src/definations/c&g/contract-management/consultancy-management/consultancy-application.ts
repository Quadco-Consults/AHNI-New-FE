import { z } from "zod";

export const ConsultancyStaffSchema = z.object({
  consultancy: z.string().optional(),
  referees: z.array(
    z.object({
      name: z.string().min(1, "Field Required"),
      email: z.string().min(1, "Field Required"),
      phone_number: z.string().min(1, "Field Required"),
    })
  ),
  name: z.string().min(1, "Field Required"),
  contractor_name: z.string().min(1, "Field Required"),
  email: z.string().min(1, "Field Required"),
  phone_number: z.string().min(1, "Field Required"),
  contract_number: z.string().min(1, "Field Required"),
  position_under_contract: z.string().min(1, "Field Required"),
  proposed_salary: z.string().min(1, "Field Required"),
  place_of_birth: z.string().min(1, "Field Required"),
  citizenship: z.string().min(1, "Field Required"),
  start_duration_date: z.string().min(1, "Field Required"),
  end_duration_date: z.string().min(1, "Field Required"),
  education: z.array(
    z.object({
      name: z.string().min(1, "Field Required"),
      location: z.string().min(1, "Field Required"),
      major: z.string().min(1, "Field Required"),
      degree: z.string().min(1, "Field Required"),
      date: z.string().min(1, "Field Required"),
    })
  ),
  language_proficiency: z.array(
    z.object({
      language: z.string().min(1, "Field Required"),
      proficiency_speaking: z.string().min(1, "Field Required"),
      proficiency_reading: z.string().min(1, "Field Required"),
    })
  ),
  employment_history: z.array(
    z.object({
      position_title: z.string().min(1, "Field Required"),
      employer_name: z.string().min(1, "Field Required"),
      employer_telephone: z.string().min(1, "Field Required"),
      from: z.string().min(1, "Field Required"),
      to: z.string().min(1, "Field Required"),
    })
  ),
  special_consultant_services: z.array(
    z.object({
      services_performed: z.string().min(1, "Field Required"),
      employer_name: z.string().min(1, "Field Required"),
      employer_telephone: z.string().min(1, "Field Required"),
      from: z.string().min(1, "Field Required"),
      to: z.string().min(1, "Field Required"),
    })
  ),
});

export type TConsultancyStaffFormData = z.infer<
  typeof ConsultancyStaffSchema
>;

export interface IConsultancyStaffPaginatedData {}

export interface IConsultancyStaffSingleData {}
