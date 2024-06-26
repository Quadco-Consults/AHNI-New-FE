import { z } from "zod";

// Define individual schemas
export const BeneficiarySchema = z.object({
  //   id: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
  name: z.string(),
  description: z.string(),
});

export const FundingSourceSchema = z.object({
  //   id: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
  name: z.string(),
  description: z.string(),
});

export const PartnerSchema = z.object({
  //  id: string;
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
  //   id: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
  name: z.string(),
  description: z.string(),
  project: z.string(),
  parent: z.string(),
});

export const ProjectPartnerSchema = z.object({
  //   id: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
  location: z.string(),
  project: z.string(),
  partner: z.string(),
});

export const ProjectDocumentSchema = z.object({
  //   id: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
  title: z.string(),
  document: z.string(),
  project: z.string(),
});

const objectives = z.object({
  title: z.string(),
  sub_objectives: z.object({ title: z.string() }),
});

const locationPartners = z.object({
  location_id: z.string(),
  partner_ids: z.array(z.string()),
});

// Define the main schema
export const ProjectsSummarySchema = z.object({
  //   id: z.string(),
  beneficiaries: z.array(z.string()),
  objectives: z.string(),
  // project_partners: z.array(ProjectPartnerSchema),
  // documents: z.array(ProjectDocumentSchema),
  // created_at: z.string(),
  // updated_at: z.string(),
  // project_id: z.string(),
  title: z.string(),
  goal: z.string(),
  expected_results: z.string(),
  budget: z.number(),
  // status: z.string(),
  project_manager: z.string(),
  funding_source: z.array(z.string()),
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
