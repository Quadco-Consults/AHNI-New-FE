import { z } from "zod";

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
    title: z.string().min(1, "Please enter document title"),
    document_type: z.string().min(1, "Please select document type"),
    file: z.string().min(1, "Please select a file"),
});

export type TProjectDocument = z.infer<typeof ProjectDocumentSchema>;

// Define the main schema
export const ProjectsSummarySchema = z.object({
    title: z.string().min(1, "Title is required"),
    project_id: z.string().min(1, "ProjectID is required"),
    goal: z.string().min(1, "Goal is required"),
    narrative: z.string().min(1, "Narrrative is required"),
    budget_performance: z.string().min(1, "Budget performance is required"),
    budget: z.union([z.string(), z.number()]),
    project_managers: z.array(z.string()),
    funding_sources: z.array(z.string()),
    // objectives: z.string(),
    currency: z.string().min(1, "Field Required"),
    beneficiaries: z.array(z.any()),
    expected_results: z.string().min(1, "This field is required"),
    achievement_against_target: z.string().min(1, "This field is required"),
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
