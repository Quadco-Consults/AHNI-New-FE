import { z } from "zod";

export type VendorPrequalificationData = {
  vendor: {
    id: string;
    company_name: string;
    submitted_categories: {
      id: string;
      code: string;
      created_at: string;
      updated_at: string;
      name: string;
      description: string;
      serial_number: number;
      job_category: string;
    }[];
  };
  financial_year_id: string;
  categories: {
    name: string;
    criteria: {
      id: string;
      name: string;
      score: boolean;
      remark: string;
    }[];
  }[];
};

export interface VendorPrequalificationResponse {
  message: string;
  data: VendorPrequalificationData;
}

export const VendorPrequalificationSchema = z.object({
  vendor: z.string(),
  // financial_year: z.string(),
  // prequalifications: z.array(
  //   z.object({
  //     score: z.boolean(),
  //     remark: z.string(),
  //     criteria: z.string(),
  //   })
  // ),
  approved_categories: z.array(z.string()),
});
