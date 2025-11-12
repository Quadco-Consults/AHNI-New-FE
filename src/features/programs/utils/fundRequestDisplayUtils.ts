/**
 * Utility functions for displaying fund request data
 * Handles data transformation and formatting for UI components
 */

import {
  TFundRequestBackendResponse,
  TFundRequestActivityBackendResponse,
  FundRequestStatusLabels,
  transformBackendResponseToDisplayData,
} from "definations/program-validator";

/**
 * Format currency amount with proper locale formatting
 */
export const formatCurrency = (
  amount: string | number,
  currency: "USD" | "NGN" = "NGN"
): string => {
  const numericAmount = typeof amount === "string" ? parseFloat(amount) : amount;

  if (isNaN(numericAmount)) return "0";

  const currencySymbol = currency === "USD" ? "$" : "₦";

  return `${currencySymbol}${numericAmount.toLocaleString()}`;
};

/**
 * Format date for display
 */
export const formatDate = (dateString: string): string => {
  try {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateString;
  }
};

/**
 * Get user display name from user object
 */
export const getUserDisplayName = (user: any): string => {
  if (!user?.data) return "Not assigned";

  const { first_name, last_name } = user.data;
  if (first_name && last_name) {
    return `${first_name} ${last_name}`;
  }
  return first_name || last_name || "Not assigned";
};

/**
 * Calculate total amount for activities
 */
export const calculateActivitiesTotal = (activities: any[]): number => {
  if (!activities || !Array.isArray(activities)) return 0;

  return activities.reduce((total, activity) => {
    let amount = 0;

    // Handle different activity data structures
    if (activity.amount) {
      amount = typeof activity.amount === "string"
        ? parseFloat(activity.amount)
        : activity.amount;
    } else {
      // Calculate from unit_cost * quantity * frequency
      const unitCost = typeof activity.unit_cost === "string"
        ? parseFloat(activity.unit_cost)
        : (activity.unit_cost || 0);
      const quantity = typeof activity.quantity === "string"
        ? parseInt(activity.quantity)
        : (activity.quantity || 0);
      const frequency = typeof activity.frequency === "string"
        ? parseInt(activity.frequency)
        : (activity.frequency || 0);

      amount = unitCost * quantity * frequency;
    }

    return total + (isNaN(amount) ? 0 : amount);
  }, 0);
};

/**
 * Get category name from activity category
 */
export const getCategoryName = (category: any, fallbackCategories: any[] = []): string => {
  // If category is an object with name
  if (typeof category === "object" && category !== null) {
    return category.name || category.category_name || "Unknown Category";
  }

  // If category is a string (ID), look it up in fallbackCategories
  if (typeof category === "string" && fallbackCategories.length > 0) {
    const found = fallbackCategories.find((cat) => cat.id === category);
    return found?.name || found?.category_name || category;
  }

  return category || "Unknown Category";
};

/**
 * Get fund request status display information
 */
export const getStatusDisplay = (status: string) => {
  const statusConfig = {
    DRAFT: { color: "bg-gray-100 text-gray-800", label: "Draft" },
    PENDING: { color: "bg-yellow-100 text-yellow-800", label: "Pending" },
    REVIEWED: { color: "bg-blue-100 text-blue-800", label: "Reviewed" },
    LOCATION_REVIEWED: { color: "bg-indigo-100 text-indigo-800", label: "Location Reviewed" },
    LOCATION_AUTHORIZED: { color: "bg-purple-100 text-purple-800", label: "Location Authorized" },
    STATE_REVIEWED: { color: "bg-cyan-100 text-cyan-800", label: "State Reviewed" },
    STATE_AUTHORIZED: { color: "bg-teal-100 text-teal-800", label: "State Authorized" },
    HQ_REVIEWED: { color: "bg-lime-100 text-lime-800", label: "HQ Reviewed" },
    HQ_AUTHORIZED: { color: "bg-emerald-100 text-emerald-800", label: "HQ Authorized" },
    HQ_APPROVED: { color: "bg-green-100 text-green-800", label: "HQ Approved" },
    REJECTED: { color: "bg-red-100 text-red-800", label: "Rejected" },
  };

  return statusConfig[status as keyof typeof statusConfig] || {
    color: "bg-gray-100 text-gray-800",
    label: status || "Unknown",
  };
};

/**
 * Get fund request type display
 */
export const getTypeDisplay = (type: string) => {
  const typeConfig = {
    MAIN: { color: "bg-blue-100 text-blue-800", label: "Main" },
    SUPPLEMENTARY: { color: "bg-orange-100 text-orange-800", label: "Supplementary" },
  };

  return typeConfig[type as keyof typeof typeConfig] || {
    color: "bg-gray-100 text-gray-800",
    label: type || "Unknown",
  };
};

/**
 * Transform fund request for table display
 */
export const transformFundRequestForTable = (fundRequest: any) => {
  return {
    ...fundRequest,
    project_title: fundRequest.project?.title || "N/A",
    project_id: fundRequest.project?.project_id || "N/A",
    location_display: fundRequest.location?.unique_code
      ? `${fundRequest.location.unique_code} - ${fundRequest.location.name}`
      : fundRequest.location?.name || "N/A",
    financial_year_display: fundRequest.financial_year?.year || "N/A",
    status_display: getStatusDisplay(fundRequest.status),
    type_display: getTypeDisplay(fundRequest.type),
    total_amount_formatted: formatCurrency(fundRequest.total_amount, fundRequest.currency),
    created_date_formatted: formatDate(fundRequest.created_datetime),
  };
};

/**
 * Validate fund request data before submission
 * This function checks both form validation and project disbursement limits
 */
export const validateFundRequestData = (
  data: any,
  projectDisbursementSummary?: {
    total_disbursements: number;
    remaining_budget: number;
  }
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Required fields validation
  if (!data.project) errors.push("Project is required");
  if (!data.month) errors.push("Month is required");
  if (!data.year) errors.push("Year is required");
  if (!data.currency) errors.push("Currency is required");
  if (!data.available_balance) errors.push("Available balance is required");
  if (!data.financial_year) errors.push("Financial year is required");
  if (!data.type) errors.push("Type is required");
  if (!data.location) errors.push("Location is required");
  if (!data.uuid_code) errors.push("Unique identifier is required");

  // Approval workflow validation
  if (!data.location_reviewer) errors.push("Location reviewer is required");
  if (!data.location_authorizer) errors.push("Location authorizer is required");
  if (!data.state_reviewer) errors.push("State reviewer is required");
  if (!data.state_authorizer) errors.push("State authorizer is required");
  if (!data.hq_reviewer) errors.push("HQ reviewer is required");
  if (!data.hq_authorizer) errors.push("HQ authorizer is required");
  if (!data.hq_approver) errors.push("HQ approver is required");

  // Activities validation
  if (!data.activities || !Array.isArray(data.activities) || data.activities.length === 0) {
    errors.push("At least one activity is required");
  } else {
    data.activities.forEach((activity: any, index: number) => {
      if (!activity.activity_description) {
        errors.push(`Activity ${index + 1}: Description is required`);
      }
      if (!activity.quantity || isNaN(Number(activity.quantity))) {
        errors.push(`Activity ${index + 1}: Valid quantity is required`);
      }
      if (!activity.unit_cost || isNaN(Number(activity.unit_cost))) {
        errors.push(`Activity ${index + 1}: Valid unit cost is required`);
      }
      if (!activity.frequency || isNaN(Number(activity.frequency))) {
        errors.push(`Activity ${index + 1}: Valid frequency is required`);
      }
      if (!activity.category) {
        errors.push(`Activity ${index + 1}: Category is required`);
      }
    });
  }

  // Business logic validation - Check project disbursements
  const newDisbursementAmount = calculateActivitiesTotal(data.activities);

  if (projectDisbursementSummary) {
    // Check against existing disbursements + new request
    const totalAfterNewRequest = projectDisbursementSummary.total_disbursements + newDisbursementAmount;
    const projectBudget = projectDisbursementSummary.total_disbursements + projectDisbursementSummary.remaining_budget;

    if (totalAfterNewRequest > projectBudget) {
      errors.push(
        `This fund request would exceed the project budget. ` +
        `Current disbursements: ${formatCurrency(projectDisbursementSummary.total_disbursements, data.currency)}, ` +
        `New request: ${formatCurrency(newDisbursementAmount, data.currency)}, ` +
        `Total would be: ${formatCurrency(totalAfterNewRequest, data.currency)}, ` +
        `but project budget is: ${formatCurrency(projectBudget, data.currency)}`
      );
    }

    // Also check if new request exceeds remaining budget
    if (newDisbursementAmount > projectDisbursementSummary.remaining_budget) {
      errors.push(
        `Fund request amount (${formatCurrency(newDisbursementAmount, data.currency)}) ` +
        `exceeds remaining project budget (${formatCurrency(projectDisbursementSummary.remaining_budget, data.currency)})`
      );
    }
  } else {
    // Fallback to simple available balance check if disbursement summary not available
    const availableBalance = parseFloat(data.available_balance);
    if (!isNaN(newDisbursementAmount) && !isNaN(availableBalance) && newDisbursementAmount > availableBalance) {
      errors.push(
        `Total disbursement amount (${formatCurrency(newDisbursementAmount, data.currency)}) exceeds available balance (${formatCurrency(availableBalance, data.currency)})`
      );
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Export utilities for easier usage
 */
export const FundRequestDisplayUtils = {
  formatCurrency,
  formatDate,
  getUserDisplayName,
  calculateActivitiesTotal,
  getCategoryName,
  getStatusDisplay,
  getTypeDisplay,
  transformFundRequestForTable,
  validateFundRequestData,
};