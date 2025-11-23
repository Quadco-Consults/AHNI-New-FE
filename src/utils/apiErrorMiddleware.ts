import { AxiosError, AxiosResponse } from 'axios';
import { toast } from 'sonner';
import { handleApiError, createErrorContext, ErrorContext } from './errorHandlers';

/**
 * Enhanced API error middleware for consistent error handling across all API calls
 */

export interface ApiErrorMiddlewareOptions {
  operation?: string;
  feature?: string;
  userDepartment?: string;
  suppressToast?: boolean;
  customErrorHandler?: (error: any, context: ErrorContext) => boolean;
}

/**
 * Universal error handler for API responses
 * Use this in all API controllers for consistent error handling
 */
export const handleApiResponse = async <T>(
  apiCall: () => Promise<AxiosResponse<T>>,
  options: ApiErrorMiddlewareOptions = {}
): Promise<T> => {
  try {
    const response = await apiCall();
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;

    // Create error context
    const errorContext = createErrorContext(
      options.operation,
      options.userDepartment,
      options.feature
    );

    // Log error for debugging
    console.error(`API Error [${options.feature || 'Unknown'}]:`, {
      status: axiosError.response?.status,
      message: axiosError.message,
      data: axiosError.response?.data,
      context: errorContext,
    });

    // Try custom error handler first
    if (options.customErrorHandler) {
      const handled = options.customErrorHandler(axiosError, errorContext);
      if (handled) {
        throw axiosError; // Re-throw for React Query or component handling
      }
    }

    // Use our enhanced error handling unless suppressed
    if (!options.suppressToast) {
      handleApiError(axiosError, errorContext);
    }

    // Always re-throw for proper error propagation
    throw axiosError;
  }
};

/**
 * Specialized error handler for form submissions
 */
export const handleFormSubmissionError = (
  error: any,
  options: ApiErrorMiddlewareOptions = {}
) => {
  const errorContext = createErrorContext(
    options.operation || 'form submission',
    options.userDepartment,
    options.feature
  );

  // Handle form-specific errors
  if (error?.response?.status === 422) {
    // Validation errors
    const validationData = error.response.data;
    if (validationData && typeof validationData === 'object') {
      const fieldErrors = Object.entries(validationData).map(([field, errors]) => {
        if (Array.isArray(errors)) {
          return `${field}: ${errors.join(', ')}`;
        }
        return `${field}: ${errors}`;
      });

      if (fieldErrors.length > 0) {
        toast.error('Form Validation Error', {
          description: fieldErrors.join('\n'),
          duration: 8000,
        });
        return;
      }
    }
  }

  // Fall back to general error handling
  handleApiError(error, errorContext);
};

/**
 * Error handler for department-specific features
 */
export const handleDepartmentApiError = (
  error: any,
  department: string,
  feature: string,
  operation?: string
) => {
  const errorContext = createErrorContext(operation, department, feature);

  // Check for employee profile errors
  const errorMessage = error?.message || error?.response?.data?.message || '';

  if (errorMessage.includes('Employee profile')) {
    toast.error('Employee Profile Required', {
      description: `Your employee profile is not set up for the ${department} department. Please contact HR to complete your profile setup.`,
      duration: 10000,
      action: {
        label: 'Contact HR',
        onClick: () => {
          window.location.href = `mailto:hr@ahni.org?subject=Employee Profile Setup - ${department} Department`;
        },
      },
    });
    return;
  }

  if (error?.response?.status === 403) {
    toast.error('Department Access Denied', {
      description: `This ${feature} feature is not available for the ${department} department. Contact your supervisor if you believe this is an error.`,
      duration: 6000,
    });
    return;
  }

  // Fall back to general error handling
  handleApiError(error, errorContext);
};

/**
 * Error handler for dropdown/reference data failures
 */
export const handleDropdownApiError = (
  error: any,
  dropdownType: string,
  fallbackData: any[] = []
) => {
  const errorMessage = error?.message || error?.response?.data?.message || '';

  console.warn(`Dropdown API Error [${dropdownType}]:`, error);

  // Don't show intrusive toasts for dropdown failures
  // Just log and provide fallback
  if (error?.response?.status === 404) {
    console.info(`${dropdownType} dropdown data not available, using fallback`);
  } else {
    toast.error(`Failed to load ${dropdownType} options`, {
      description: 'Using cached data if available',
      duration: 3000,
    });
  }

  return fallbackData;
};

/**
 * Create a department-aware API wrapper
 */
export const createDepartmentApiWrapper = (
  userDepartment: string,
  feature: string
) => {
  return {
    handleError: (error: any, operation?: string) =>
      handleDepartmentApiError(error, userDepartment, feature, operation),

    handleResponse: <T>(apiCall: () => Promise<AxiosResponse<T>>, operation?: string) =>
      handleApiResponse(apiCall, {
        operation,
        feature,
        userDepartment,
      }),

    handleFormError: (error: any, operation?: string) =>
      handleFormSubmissionError(error, {
        operation: operation || 'form submission',
        feature,
        userDepartment,
      }),
  };
};