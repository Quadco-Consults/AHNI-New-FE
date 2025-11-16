import { z } from "zod";

// Re-export from the main program validator for backward compatibility
export {
  FundRequestSchema,
  FundRequestActivitySchema,
  FundRequestWithActivitiesSchema,
  type TFundRequestFormValues,
  type TFundRequestActivityFormValues,
  type TFundRequestWithActivitiesFormValues,
  type TFundRequestActivity,
} from "@/features/programs/types/program-validator";

// Additional types that might be needed for backend reconciliation
export interface TFundRequestBackendPayload {
  // Basic fund request details
  project: string;
  month: string;
  year: string;
  currency: "USD" | "NGN";
  available_balance: string;
  financial_year: string;
  type: "MAIN" | "SUPPLEMENTARY";
  location: string;
  uuid_code: string;

  // Approval workflow
  location_reviewer: string;
  location_authorizer: string;
  state_reviewer: string;
  state_authorizer: string;
  hq_reviewer: string;
  hq_authorizer: string;
  hq_approver: string;

  // Activities
  activities: TFundRequestActivityBackendPayload[];

  // Calculated fields
  total_disbursement_amount?: string;
  total_amount?: string; // Backend expects this field for the total amount
}

export interface TFundRequestActivityBackendPayload {
  activity_description: string;
  quantity: string | number;
  unit_cost: string | number;
  frequency: string | number;
  comment: string;
  category: string; // Cost category ID
  amount?: string | number; // Calculated field
}

// Response types from backend
export interface TFundRequestBackendResponse {
  id: string;
  uuid_code: string;
  project: {
    id: string;
    project_id: string;
    title: string;
    start_date: string;
    end_date: string;
    budget: number;
    status: string;
  };
  financial_year: {
    id: string;
    year: string;
    current: string;
  };
  location: {
    id: string;
    name: string;
    address: string;
    city: string;
    state: string;
    email: string;
    phone: string;
    unique_code?: string;
  };
  activities: TFundRequestActivityBackendResponse[];
  created_datetime: string;
  updated_datetime: string;
  year: string;
  month: string;
  currency: "USD" | "NGN";
  type: "MAIN" | "SUPPLEMENTARY";
  status: FundRequestStatus;
  total_amount: string | number;
  available_balance: string;
  created_by: string;
  updated_by?: string;
  reviewer?: string;

  // Approval workflow IDs
  location_reviewer?: string;
  location_authorizer?: string;
  state_reviewer?: string;
  state_authorizer?: string;
  hq_reviewer?: string;
  hq_authorizer?: string;
  hq_approver?: string;
}

export interface TFundRequestActivityBackendResponse {
  id: string;
  activity_description: string;
  unit_cost: string;
  quantity: number;
  frequency: number;
  comment: string;
  amount: string;
  category: {
    id: string;
    name: string;
    category_name?: string;
  };
  fund_request: string;
  created_datetime: string;
  updated_datetime: string;
}

// Fund Request Status Enum
export type FundRequestStatus =
  | "DRAFT"
  | "PENDING"
  | "REVIEWED"
  | "LOCATION_REVIEWED"
  | "LOCATION_AUTHORIZED"
  | "STATE_REVIEWED"
  | "STATE_AUTHORIZED"
  | "HQ_REVIEWED"
  | "HQ_AUTHORIZED"
  | "HQ_APPROVED"
  | "REJECTED";

export const FundRequestStatusLabels: Record<FundRequestStatus, string> = {
  DRAFT: "Draft",
  PENDING: "Pending Review",
  REVIEWED: "Reviewed",
  LOCATION_REVIEWED: "Location Reviewed",
  LOCATION_AUTHORIZED: "Location Authorized",
  STATE_REVIEWED: "State Reviewed",
  STATE_AUTHORIZED: "State Authorized",
  HQ_REVIEWED: "HQ Reviewed",
  HQ_AUTHORIZED: "HQ Authorized",
  HQ_APPROVED: "HQ Approved",
  REJECTED: "Rejected",
};

// Data transformation utilities
export const transformFormDataToBackendPayload = (
  formData: TFundRequestFormValues & { activities: any[] }
): TFundRequestBackendPayload => {
  // Calculate amounts for activities
  const activitiesWithAmount = formData.activities.map((activity) => {
    const unitCost = Number(activity.unit_cost || 0);
    const quantity = Number(activity.quantity || 0);
    const frequency = Number(activity.frequency || 0);
    const amount = unitCost * quantity * frequency;

    return {
      activity_description: activity.activity_description,
      quantity: activity.quantity,
      unit_cost: activity.unit_cost,
      frequency: activity.frequency,
      comment: activity.comment,
      category: activity.category,
      amount: amount.toString(),
    };
  });

  // Calculate total disbursement amount
  const totalDisbursementAmount = activitiesWithAmount.reduce((total, activity) => {
    return total + Number(activity.amount || 0);
  }, 0);

  return {
    project: formData.project,
    month: formData.month,
    year: formData.year,
    currency: formData.currency as "USD" | "NGN",
    available_balance: formData.available_balance,
    financial_year: formData.financial_year,
    type: formData.type as "MAIN" | "SUPPLEMENTARY",
    location: formData.location,
    uuid_code: formData.uuid_code,
    location_reviewer: formData.location_reviewer,
    location_authorizer: formData.location_authorizer,
    state_reviewer: formData.state_reviewer,
    state_authorizer: formData.state_authorizer,
    hq_reviewer: formData.hq_reviewer,
    hq_authorizer: formData.hq_authorizer,
    hq_approver: formData.hq_approver,
    activities: activitiesWithAmount,
    total_disbursement_amount: totalDisbursementAmount.toString(),
    total_amount: totalDisbursementAmount.toString(), // Include total_amount for backend compatibility
  };
};

export const transformBackendResponseToDisplayData = (
  backendData: TFundRequestBackendResponse
) => {
  return {
    ...backendData,
    // Transform nested objects for display
    project_title: backendData.project?.title,
    project_id: backendData.project?.project_id,
    financial_year_display: backendData.financial_year?.year,
    location_name: backendData.location?.name,
    location_display: backendData.location?.unique_code
      ? `${backendData.location.unique_code} - ${backendData.location.name}`
      : backendData.location?.name,
    status_display: FundRequestStatusLabels[backendData.status],
    // Transform activities for display
    activities: backendData.activities?.map((activity) => ({
      ...activity,
      category_name: activity.category?.name || activity.category?.category_name,
    })),
  };
};