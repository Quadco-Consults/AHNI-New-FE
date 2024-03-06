import { z } from "zod";

export const EOIFormSchema = z.object({
  description: z.string().min(1, "Please select an email to display."),
  vendor_category: z.string().array(),
  tender_type: z.string(),
  document: z.string(),
  vendor: z.string(),
});

export const RFQFormSchema = z.object({
  background: z.string().min(1, "Please select an email to display."),
  reference: z.string(),
});
