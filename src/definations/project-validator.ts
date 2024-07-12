import { z } from "zod";

// Define individual schemas
export const BeneficiarySchema = z.object({
  created_at: z.string(),
  updated_at: z.string(),
  name: z.string(),
  description: z.string(),
});

export const FundingSourceSchema = z.object({
  created_at: z.string(),
  updated_at: z.string(),
  name: z.string(),
  description: z.string(),
});

export const PartnerSchema = z.object({
  created_at: z.string(),
  updated_at: z.string(),
  name: z.string(),
  address: z.string(),
  city: z.string(),
  state: z.string(),
  email: z.string(),
  phone: z.string(),
  website: z.string(),
  logo: z.string(),
});

export const ProjectObjectiveSchema = z.object({
  created_at: z.string(),
  updated_at: z.string(),
  name: z.string(),
  description: z.string(),
  project: z.string(),
  parent: z.string(),
});

export const ProjectPartnerSchema = z.object({
  created_at: z.string(),
  updated_at: z.string(),
  location: z.string(),
  project: z.string(),
  partner: z.string(),
});

export const ProjectDocumentSchema = z.object({
  project: z.string().min(1, "projectID is required"),
  // document: z
  //   .instanceof(FileList)
  //   .refine((files) => files.length > 0, "File is required"),
});

// Define the main schema
export const ProjectsSummarySchema = z.object({
  beneficiaries: z.array(z.any()),
  objectives: z.string(),
  title: z.string().min(1, "Title is required"),
  project_id: z.string().min(1, "ProjectID is required"),
  goal: z.string().min(1, "Goal is required"),
  expected_results: z.string().min(1, "This field is required"),
  budget: z.union([z.string(), z.number()]),
  project_manager: z.string().min(1, "Manager is required"),
  project_funding_source: z.array(z.string()),
});

export const PartnersFormSchema = z.object({
  items: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one partner.",
  }),
});

export const LocationSchema = z.object({
  name: z.string(),
  address: z.string(),
  city: z.string(),
  state: z.string(),
  email: z.string(),
  phone: z.string(),
});

export const DocumentTypesSchema = z.object({
  name: z.string(),
  description: z.string(),
});
