import { z } from "zod";

export const ConsultancyManagementDetailSchema = z.object({
    title: z.string().min(1, "Please enter title"),
    grade_level: z.string().min(1, "Please enter grade level"),
    locations: z.array(z.string()).nonempty(),
    duration: z.string().min(1, "Please enter duration"),
    commencement_date: z.string().min(1, "Please select commencement date"),
    end_date: z.string().min(1, "Please select end date"),
    consultants_number: z.string().min(1, "Please enter number of consultants"),
    extra_info: z.string().min(1, "Please enter extra info"),
    background: z.string().min(1, "Please enter background"),
    evaluation_comments: z.string().min(1, "Please enter evaluation comment"),
    advertisement_document: z
        .string()
        .min(1, "Please enter advertisement document"),
    supervisor: z.string().min(1, "Please select supervisor"),
});

export type TConsultancyManagementDetailsFormData = z.infer<
    typeof ConsultancyManagementDetailSchema
>;

/* "scope_of_work": {
    "deliverables": [
      {
        "deliverable": "string",
        "number_of_days": 0
      }
    ],
    "description": "string",
    "background": "string",
    "objectives": "string",
    "fee_rate": 2147483647,
    "payment_frequency": 2147483647,
    "advertisement_document": "string"
  }, */
