import { z } from "zod";

export const ProjectSchema = z.object({
  name: z.string().min(1, "Please enter project name"),
  description: z.string().min(1, "Please enter project description"),
  start_date: z.string().min(1, "Please select start date"),
  end_date: z.string().min(1, "Please select end date"),
  budget: z.string().min(1, "Please enter budget"),
  status: z.string().min(1, "Please select status"),
});

export type TProjectFormValues = z.infer<typeof ProjectSchema>;

export interface IProjectSingleData {
  id: string;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  budget: string;
  status: string;
  created_datetime: string;
  updated_datetime: string;
  created_by: string | null;
  updated_by: string | null;
}

export interface TProjectDocumentData {
  id: string;
  title: string;
  project: string;
  file: string;
  created_datetime: string;
  updated_datetime: string;
}