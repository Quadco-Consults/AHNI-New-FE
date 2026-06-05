import { z } from "zod";

export const ApprovalThresholdSchema = z.object({
  transaction_type: z.string().min(1, "Transaction type is required"),
  approval_level: z.string().min(1, "Approval level is required"),
  position: z.string().min(1, "Position is required"),
  min_amount: z.string().min(1, "Minimum amount is required"),
  max_amount: z.string().optional(),
  location: z.string().optional(),
  priority: z.number().optional(),
  is_active: z.boolean().default(true),
}).refine((data) => {
  // Validate that max_amount is greater than min_amount if both are provided
  if (data.max_amount && data.min_amount) {
    const minAmt = parseFloat(data.min_amount);
    const maxAmt = parseFloat(data.max_amount);
    return maxAmt > minAmt;
  }
  return true;
}, {
  message: "Maximum amount must be greater than minimum amount",
  path: ["max_amount"],
});

export type TApprovalThresholdFormValues = z.infer<typeof ApprovalThresholdSchema>;
