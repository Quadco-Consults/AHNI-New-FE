import { z } from "zod";

export const facilityContactSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  position: z.string(),
  phone_number: z.string(),
  email: z.string().email(),
});

export const facilitiesSchema = z.object({
  name: z.string(),
  local_govt: z.string(),
  state: z.string(),
  // facility_contacts: z.array(facilityContactSchema),
});

export const supervisionCategorySchema = z.object({
  code: z.string(),
  name: z.string(),
  description: z.string(),
  serial_number: z.string(),
  job_category: z.enum(["Goods", "Service", "Work", "Others"]),
});

export const riskCategorySchema = z.object({
  description: z.string(),
  name: z.string(),
});

export type TFacilities = z.infer<typeof facilitiesSchema>;
export type TSupervisionCategory = z.infer<typeof supervisionCategorySchema>;
export type TRiskCategory = z.infer<typeof riskCategorySchema>;

export interface Facilities {
  id: string;
  name: string;
  position: string;
  phone_number: string;
  email: string;
  facility: string;
}

export interface SupervisionCategory {
  id: string;
  code: string;
  created_at: string;
  updated_at: string;
  name: string;
  description: string;
  serial_number: number;
  job_category: string;
}

export interface RiskCategory {
  created_at: string;
  description: string;
  id: string;
  name: string;
  updated_at: string;
}
