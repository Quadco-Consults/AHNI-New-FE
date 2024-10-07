import { z } from "zod";

export const CangGAddGrantsSchema = z.object({
  award_type: z.string(),
  obligations: z.string(),
  award_amount: z.string(),
  monthly_spend: z.string(),
  // status: z.string(),
  reference_number: z.string().optional(),
  project: z.string(),
  department: z.string().uuid(),
  intervention_area: z.string().uuid(),
  grantor: z.string().uuid(),
  location: z.string().uuid(),
});

export const CangGAddExpenditureSchema = z.object({
  amount: z.string(),
  // month_year: z.string(),
});

export const TaskSchema = z.object({
  designation: z.string(),
  start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), // YYYY-MM-DD format
  end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), // YYYY-MM-DD format
  status: z.enum(["Pending", "Approved", "Rejected"]),
  remarks: z.string(),
});

export const ClosuOutPlanSchema = z.object({
  tasks: z.array(TaskSchema),
  key_task: z.string(),
  project: z.string().uuid(),
  department: z.string().uuid(),
  location: z.string().uuid(),
});

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
export const ConsunltancyApplicationDetails = z.object({
  // locations: z.string(),
  title: z.string(),
  grade_level: z.string(),
  duration: z.string(),
  commencement_date: z.string().regex(dateRegex, "Invalid date format (YYYY-MM-DD)"),
  effective_end_date: z.string().regex(dateRegex, "Invalid date format (YYYY-MM-DD)"),
  number_of_consultants: z.string(),
  extra_info: z.string(),
  background: z.string(),
  status: z.enum(["Pending", "Approved", "Rejected"]),
  // job_file: z.string(),
  evaluation_comments: z.string(),
  supervisor: z.string().uuid(),
});

export const ConsunltancyScopeDetails = z.object({
  description: z.string(),
  background: z.string(),
  objectives: z.string(),
  fee_rate: z.string(),
  payment_frequency: z.string(),
  // specific_deliverables: z.record(z.union([z.string(), z.number().nonnegative()])),
});

// subgrant schema

export const CangGAddSubGrantSchema = z.object({
  funding_source_id: z.string(),
  project_title: z.string(),
  project_number: z.string(),
  country: z.string(),
  award_type: z.string(),
  sub_award_type: z.string(),
  project_value_usd: z.string(),
  project_value_local_currency: z.string(),
  // start_date: z.string(),
  // end_date: z.string(),
  grant_administrator: z.string().uuid(),
  technical_staff: z.string().uuid(),
  business_unit: z.string().uuid(),
});

export const ManualSubGrantSchemaOrgDetails = z.object({
  // sub_grant_id: z.string(),
  organisation_name: z.string(),
  principal_one_name: z.string(),
  principal_one_designation: z.string(),
  principal_two_name: z.string(),
  principal_two_designation: z.string(),
  address: z.string(),
  telephone: z.string(),
  email: z.string().email(), // Validates email format
  fax: z.string().optional(), // Fax can be optional if needed
  website: z.string().url(), // Validates URL format
  duns_number: z.string(),
  // has_conflict_of_interest: z.boolean(), // Boolean validation
  organisation_type: z.string(),
});

// consultancy application
export const ConsultancyApplication = z.object({
  applicant_name: z.string(),
  applicant_email: z.string().email(),
  applicant_phone_number: z.string(),
  employment_type: z.string(),
});

export const ConsultancyMetrics = z.object({
  selected_applications: z.array(z.string()),
  evaluation_comments: z.string(),
});
