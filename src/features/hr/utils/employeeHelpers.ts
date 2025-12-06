import { useGetCurrentUser } from "@/features/auth/controllers/userController";
import { useGetEmployeeOnboardings } from "../controllers/employeeOnboardingController";

export interface EmployeeStatus {
  hasEmployeeRecord: boolean;
  employeeId: string | null;
  userId: string | null;
  message: string;
  actionRequired: "none" | "contact_hr" | "complete_onboarding";
}

/**
 * Hook to check if the current user has a proper employee record
 * This is useful for HR-related features that require employee linkage
 */
export const useEmployeeStatus = (): {
  employeeStatus: EmployeeStatus | null;
  isLoading: boolean;
  error: Error | null;
} => {
  // Get current user data
  const { data: currentUserResponse, isLoading: userLoading, error: userError } = useGetCurrentUser();
  const currentUser = currentUserResponse?.data;

  // Get employee onboarding records to check if user has employee record
  const { data: employeeResponse, isLoading: employeeLoading, error: employeeError } = useGetEmployeeOnboardings({
    enabled: !!currentUser?.id,
    size: 1000, // Get all to find user's employee record
  });

  const isLoading = userLoading || employeeLoading;
  const error = userError || employeeError;

  if (isLoading || !currentUser) {
    return { employeeStatus: null, isLoading, error };
  }

  // Find employee record for current user
  const employees = employeeResponse?.data?.results || [];
  const userEmployee = employees.find((emp: any) =>
    emp.user === currentUser.id ||
    emp.email === currentUser.email ||
    emp.applicant_email === currentUser.email
  );

  const status: EmployeeStatus = {
    hasEmployeeRecord: !!userEmployee,
    employeeId: userEmployee?.id || currentUser.employee_id || null,
    userId: currentUser.id,
    message: userEmployee
      ? "Employee record found"
      : "No employee record found for this user",
    actionRequired: userEmployee ? "none" : "contact_hr"
  };

  return { employeeStatus: status, isLoading: false, error };
};

/**
 * Check if user has proper employee access for HR features
 */
export const checkEmployeeAccess = (user: any): {
  hasAccess: boolean;
  reason: string;
  suggestion: string;
} => {
  if (!user) {
    return {
      hasAccess: false,
      reason: "User not authenticated",
      suggestion: "Please log in to access HR features"
    };
  }

  if (!user.employee_id && !user.id) {
    return {
      hasAccess: false,
      reason: "No employee record linked to user account",
      suggestion: "Contact HR to link your employee record"
    };
  }

  return {
    hasAccess: true,
    reason: "Employee access verified",
    suggestion: ""
  };
};

/**
 * Format employee not found error messages for better UX
 */
export const formatEmployeeError = (error: string): {
  title: string;
  message: string;
  actionText: string;
  actionRoute: string;
} => {
  const lowercaseError = error.toLowerCase();

  if (lowercaseError.includes("user has no employee") ||
      lowercaseError.includes("employee profile not found") ||
      lowercaseError.includes("employee") && lowercaseError.includes("not")) {
    return {
      title: "Employee Profile Required",
      message: "Your user account exists, but you need an employee profile to access HR features like leave management.",
      actionText: "Employee Onboarding",
      actionRoute: "/dashboard/hr/employee-onboarding"
    };
  }

  if (lowercaseError.includes("permission") || lowercaseError.includes("access")) {
    return {
      title: "Access Denied",
      message: "You don't have permission to access this HR feature.",
      actionText: "Contact Administrator",
      actionRoute: "/dashboard"
    };
  }

  if (lowercaseError.includes("not found") || lowercaseError.includes("404")) {
    return {
      title: "Resource Not Found",
      message: "The requested HR resource could not be found.",
      actionText: "Go Back",
      actionRoute: "/dashboard/hr"
    };
  }

  return {
    title: "HR System Error",
    message: error || "An unexpected error occurred while accessing HR features.",
    actionText: "Try Again",
    actionRoute: "/dashboard/hr"
  };
};