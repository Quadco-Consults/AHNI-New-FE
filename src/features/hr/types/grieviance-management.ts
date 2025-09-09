import { z } from "zod";
const isBrowser =
  typeof window !== "undefined" && typeof FileList !== "undefined";
type upload = {
  id: string;
  complaint: string;
  name: string;
  uploaded_file_urls: string[];
  created_datetime: string;
  updated_datetime: string;
};
export const GrievianceManagementSchema = z.object({
    
    title: z.string().min(1, "Please enter title"),
    description: z.string().min(1, "Please enter description"), 
    document_name: z.string().optional(), 
    date: z.string().optional(),
    document: isBrowser ? z.instanceof(FileList).optional() : z.any().optional(),
});
export const FindingsGrievianceManagementSchema = z.object({
    
  findings: z.string().min(1, "Please enter findings"), 
});
export const ResolutionGrievianceManagementSchema = z.object({
    
  resolution: z.string().min(1, "Please enter resolution"), 
});
export const FeedbackGrievianceManagementSchema = z.object({
    
  feedback: z.string().min(1, "Please enter feedback"), 
});
export const DocumentGrievianceManagementSchema = z.object({
    
  name: z.string().min(1,"Please enter document name"), 
  document: isBrowser ? z.instanceof(FileList) : z.any(),
  complaint: z.string().min(1, "Please enter id"), 
});
export type TGrievianceManagementFormData = z.infer<typeof GrievianceManagementSchema>;
export interface GrievianceManagement {
  id: string;
  whistle_blower: string;
  title: string;
  description: string;
  feedback: string;
  findings: string;
  date: string;
  is_resolved: boolean;
  uploads: upload[];
}
export interface GrievianceManagementDocument {
  id: string;
  name: string; 
  document: string;
  complaint: string
}
