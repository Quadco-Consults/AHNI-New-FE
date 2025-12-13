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

  // Approval workflow (removed state_reviewer and state_authorizer - not in backend model)
  location_reviewer: string;
  location_authorizer: string;
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
  quantity: string; // Backend expects string
  unit_cost: string; // Backend expects string
  frequency: string; // Backend expects string
  comment: string;
  category: string; // Cost category ID (UUID)
  amount: string; // Calculated field as string
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
  formData: TFundRequestFormValues & { activities: any[] },
  costCategories?: Array<{ id: string; name: string }>
): TFundRequestBackendPayload => {
  // Validate essential form data
  if (!formData) {
    throw new Error("Fund request form data is required");
  }

  if (!formData.activities || formData.activities.length === 0) {
    throw new Error("At least one activity is required to submit a fund request");
  }

  // Validate required fields (removed state_reviewer and state_authorizer as they don't exist in backend)
  const requiredFields = [
    'project', 'month', 'year', 'currency', 'available_balance',
    'financial_year', 'type', 'location', 'uuid_code'
  ];

  for (const field of requiredFields) {
    if (!formData[field as keyof typeof formData]) {
      throw new Error(`Required field "${field}" is missing`);
    }
  }

  // Build category mapping for name-to-UUID conversion
  const categoryMap = new Map<string, string>();
  if (costCategories) {
    console.log("Building category map from:", costCategories);
    costCategories.forEach(cat => {
      categoryMap.set(cat.name.toLowerCase(), cat.id);
      categoryMap.set(cat.name, cat.id);
    });
    console.log("Category map built:", Object.fromEntries(categoryMap));
  } else {
    console.warn("No cost categories provided for transformation");
  }

  // Calculate amounts for activities
  const activitiesWithAmount = formData.activities.map((activity: any, index: number) => {
    // Validate required activity fields
    if (!activity.activity_description || activity.activity_description.trim() === '') {
      throw new Error(`Activity ${index + 1} is missing a description`);
    }
    if (!activity.category || activity.category.trim() === '') {
      throw new Error(`Activity ${index + 1} "${activity.activity_description}" is missing a cost category`);
    }

    // Ensure numeric conversion with validation
    const unitCost = typeof activity.unit_cost === 'number' ? activity.unit_cost : parseFloat(activity.unit_cost) || 0;
    const quantity = typeof activity.quantity === 'number' ? activity.quantity : parseInt(activity.quantity) || 0;
    const frequency = typeof activity.frequency === 'number' ? activity.frequency : parseInt(activity.frequency) || 0;

    // Validate that all values are positive numbers with descriptive errors
    if (unitCost < 0) {
      throw new Error(`Invalid unit cost: ${unitCost}. Unit cost cannot be negative for activity "${activity.activity_description}"`);
    }
    if (quantity <= 0) {
      throw new Error(`Invalid quantity: ${quantity}. Quantity must be greater than 0 for activity "${activity.activity_description}"`);
    }
    if (frequency <= 0) {
      throw new Error(`Invalid frequency: ${frequency}. Frequency must be greater than 0 for activity "${activity.activity_description}"`);
    }

    const amount = unitCost * quantity * frequency;

    // Convert category name to UUID if needed
    let categoryValue = activity.category;
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    console.log(`Processing activity category: "${categoryValue}"`);

    // If it's not a UUID, try to convert it to one
    if (!uuidRegex.test(categoryValue)) {
      console.log(`"${categoryValue}" is not a UUID, attempting conversion...`);
      const categoryId = categoryMap.get(categoryValue) || categoryMap.get(categoryValue.toLowerCase());
      if (categoryId) {
        console.log(`Successfully converted "${categoryValue}" to UUID: ${categoryId}`);
        categoryValue = categoryId;
      } else {
        console.warn(`Could not find category ID for: "${categoryValue}". Available categories:`, Array.from(categoryMap.keys()));
        // Throw error to prevent invalid submission
        throw new Error(`Invalid category "${categoryValue}". Category must exist in the system before submission.`);
      }
    } else {
      console.log(`"${categoryValue}" is already a valid UUID`);
    }

    return {
      activity_description: activity.activity_description,
      quantity: quantity.toString(), // Ensure string format for backend
      unit_cost: unitCost.toString(), // Ensure string format for backend
      frequency: frequency.toString(), // Ensure string format for backend
      comment: activity.comment,
      category: categoryValue,
      amount: amount.toString(),
    };
  });

  // Calculate total disbursement amount using the calculated numeric amount
  const totalDisbursementAmount = activitiesWithAmount.reduce((total: number, activity: any) => {
    const activityAmount = parseFloat(activity.amount) || 0;
    return total + activityAmount;
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
    // Removed state_reviewer and state_authorizer - they don't exist in backend model
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