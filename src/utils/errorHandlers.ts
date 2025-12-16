import { toast } from 'sonner';

/**
 * Enhanced error handling utilities for better user experience
 */

export interface ErrorContext {
  operation?: string;
  userDepartment?: string;
  feature?: string;
}

/**
 * Logout state management to suppress authentication toasts during logout
 */
class LogoutStateManager {
  private isLoggingOut = false;

  public setLoggingOut(state: boolean) {
    this.isLoggingOut = state;
    if (state) {
      console.log('🚪 Logout state: ACTIVE - Suppressing auth toasts');
    } else {
      console.log('🚪 Logout state: INACTIVE - Auth toasts enabled');
    }
  }

  public isInLogoutProcess(): boolean {
    return this.isLoggingOut;
  }
}

export const logoutStateManager = new LogoutStateManager();

/**
 * Handle employee profile related errors with user-friendly messages
 */
export const handleEmployeeProfileError = (error: any, context?: ErrorContext) => {
  const errorMessage = error?.message || error?.toString() || 'Unknown error';

  if (errorMessage.includes('Employee profile')) {
    toast.error('Your employee profile is not set up. Please contact HR to complete your profile setup.', {
      description: 'This is required to access department-specific features.',
      duration: 8000,
      action: {
        label: 'Contact HR',
        onClick: () => {
          // You could implement a direct contact mechanism here
          window.location.href = 'mailto:hr@ahni.org?subject=Employee Profile Setup Required';
        },
      },
    });
    return true;
  }

  return false;
};

/**
 * Handle department-specific permission errors
 */
export const handleDepartmentPermissionError = (error: any, context?: ErrorContext) => {
  const errorMessage = error?.message || error?.toString() || 'Unknown error';

  if (errorMessage.includes('permission') || errorMessage.includes('not authorized')) {
    const departmentMessage = context?.userDepartment
      ? `This feature may not be available for the ${context.userDepartment} department.`
      : 'This feature may not be available for your department.';

    toast.error('Access Denied', {
      description: `${departmentMessage} Contact your supervisor if you believe this is an error.`,
      duration: 6000,
    });
    return true;
  }

  return false;
};

/**
 * Handle 404 errors with context-aware messages
 */
export const handle404Error = (error: any, context?: ErrorContext) => {
  const errorMessage = error?.message || error?.toString() || 'Unknown error';

  if (error?.response?.status === 404 || errorMessage.includes('not found')) {
    let message = 'Resource not found';
    let description = 'The requested resource could not be found.';

    if (context?.feature) {
      description = `The requested ${context.feature} could not be found. It may have been removed or you may not have access to it.`;
    }

    if (context?.operation) {
      description += ` Operation: ${context.operation}`;
    }

    toast.error(message, {
      description,
      duration: 5000,
    });
    return true;
  }

  return false;
};

/**
 * Handle API errors with enhanced context and department-aware messaging
 */
export const handleApiError = (error: any, context?: ErrorContext) => {
  // Try specific error handlers first
  if (handleEmployeeProfileError(error, context)) return;
  if (handleDepartmentPermissionError(error, context)) return;
  if (handle404Error(error, context)) return;

  // Handle other common errors
  const errorMessage = error?.message || error?.toString() || 'Unknown error';
  const status = error?.response?.status;

  switch (status) {
    case 400:
      toast.error('Invalid Request', {
        description: errorMessage,
        duration: 5000,
      });
      break;

    case 401:
      // Suppress authentication toasts during logout process
      if (!logoutStateManager.isInLogoutProcess()) {
        toast.error('Authentication Required', {
          description: 'Please log in to continue.',
          duration: 5000,
        });
      } else {
        console.log('🚪 401 error during logout - toast suppressed');
      }
      // Redirect to login will be handled by axios interceptor
      break;

    case 403:
      handleDepartmentPermissionError(error, context);
      break;

    case 500:
      toast.error('Server Error', {
        description: 'An internal server error occurred. Please try again later.',
        duration: 6000,
      });
      break;

    case 503:
      toast.error('Service Unavailable', {
        description: 'The server is temporarily unavailable. Please try again in a moment.',
        duration: 6000,
      });
      break;

    default:
      toast.error('Error', {
        description: errorMessage,
        duration: 5000,
      });
  }
};

/**
 * Create error context for better error handling
 */
export const createErrorContext = (
  operation?: string,
  userDepartment?: string,
  feature?: string
): ErrorContext => ({
  operation,
  userDepartment,
  feature,
});

/**
 * Handle form submission errors with field-specific feedback
 */
export const handleFormError = (error: any, context?: ErrorContext) => {
  const errorData = error?.response?.data;

  // Check if it's a validation error with field-specific messages
  if (errorData && typeof errorData === 'object' && !errorData.message && !errorData.error) {
    const fieldErrors = Object.entries(errorData).map(([field, errors]) => {
      if (Array.isArray(errors)) {
        return `${field}: ${errors.join(', ')}`;
      }
      return `${field}: ${errors}`;
    });

    if (fieldErrors.length > 0) {
      toast.error('Validation Error', {
        description: fieldErrors.join('\n'),
        duration: 8000,
      });
      return true;
    }
  }

  // Fall back to general error handling
  handleApiError(error, context);
  return false;
};