import { z } from "zod";

// Zod schema for form validation
export const ActivityHeadingSchema = z.object({
  name: z.string().min(1, "Heading name is required").max(200, "Name must be less than 200 characters"),
  description: z.string().optional(),
});

export type TActivityHeadingFormData = z.infer<typeof ActivityHeadingSchema>;

// Activity Heading interface for API responses
export interface IActivityHeading {
  id: string;
  name: string;
  description?: string;
  created_datetime: string;
  updated_datetime: string;
  created_by?: string;
  updated_by?: string | null;
}

// For paginated list responses
export interface IActivityHeadingPaginatedData extends IActivityHeading {}

// For single item responses
export interface IActivityHeadingSingleData extends IActivityHeading {}
