 
import { z } from "zod"; 

export const SupportSchema = z.object({
  issue_description: z.string().min(1, "Please enter issue"),
  email: z.string().min(1, "Please enter email"),
  subject: z.string().min(1, "Please enter subject"),  
  department: z.string().min(1, "Please enter department"),
  priority: z.string().min(1, "Please select priority level"),  
  phone_number: z.string().optional(),
  status: z.string().optional()
});

export type TSupportFormValues = z.infer<typeof SupportSchema>;

export interface TSupportPaginatedData {
  id: string;
  created_datetime: string;
  updated_datetime: string;
  subject: string;
  department: string;
  issue_description: string;
  email: string;
  phone_number: string;
  sender: string;
  priority: string;
  status: string;
  remark: string;
  remark_file: string;
  created_at: string;
  updated_at: string; 
}

export interface TSupportSingleData {
  id: string;
  created_datetime: string;
  updated_datetime: string;
  subject: string;
  department: string;
  issue_description: string;
  email: string;
  phone_number: string;
  sender: string,
  priority: string;
  status: string;
  remark: string;
  remark_file: string;
  created_at: string;
  updated_at: string; 
}
