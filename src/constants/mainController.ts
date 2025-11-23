import {
  useMutation,
  useQueryClient,
  UseMutationResult,
  QueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import AxiosWithToken from "./api_management/MyHttpHelperWithToken";
import Axios from "./api_management/MyHttpHelper";
import { AxiosInstance, AxiosResponse, AxiosError } from "axios";
import { handleApiError, createErrorContext } from "@/utils/errorHandlers";

// Standard API response structure
interface ApiResponse<TData = unknown> {
  // or use a more specific default type
  status: boolean;
  message: string;
  data: TData;
  error?: string;
}

interface ApiManagerOptions<TData, TError> {
  endpoint: string;
  queryKey?: string | string[];
  method?: "POST" | "PUT" | "PATCH" | "DELETE";
  isAuth?: boolean;
  showSuccessToast?: boolean;
  contentType?: string | null;
  onSuccess?: (response: ApiResponse<TData>) => void;
  onError?: (error: TError) => void;
  // New options for enhanced error handling
  feature?: string;
  operation?: string;
  userDepartment?: string;
  suppressEnhancedErrorHandling?: boolean;
}

interface ApiManagerReturn<TData, TError, TVariables> {
  callApi: (details: TVariables) => Promise<ApiResponse<TData>>;
  data: TData | undefined;
  response: ApiResponse<TData> | undefined;
  isLoading: boolean;
  isSuccess: boolean;
  error: TError | null;
  isError: boolean;
  mutation: UseMutationResult<ApiResponse<TData>, TError, TVariables>;
}

const useApiManager = <TData = unknown, TError = Error, TVariables = unknown>({
  endpoint,
  queryKey,
  method = "POST",
  isAuth = false,
  showSuccessToast = true,
  contentType = "application/json",
  feature,
  operation,
  userDepartment,
  suppressEnhancedErrorHandling = false,
}: ApiManagerOptions<TData, TError>): ApiManagerReturn<
  TData,
  TError,
  TVariables
> => {
  const queryClient = useQueryClient();
  const axiosInstance: AxiosInstance = isAuth ? AxiosWithToken : Axios;

  const apiController = async (
    details: TVariables
  ): Promise<ApiResponse<TData>> => {
    try {
      let response: AxiosResponse<ApiResponse<TData>>;
      // For FormData uploads, we need to explicitly remove the Content-Type header
      // so axios can set the proper multipart/form-data boundary
      const config = contentType === null
        ? {
            headers: { "Content-Type": undefined },
            transformRequest: [(data: any) => data] // Prevent axios from transforming FormData
          }
        : contentType
        ? { headers: { "Content-Type": contentType } }
        : {};

      switch (method.toUpperCase()) {
        case "POST":
          response = await axiosInstance.post(endpoint, details, config);
          break;
        case "PUT":
          response = await axiosInstance.put(endpoint, details, config);
          break;
        case "PATCH":
          response = await axiosInstance.patch(endpoint, details, config);
          break;
        case "DELETE":
          response = await axiosInstance.delete(endpoint, {
            ...config,
            data: details,
          });
          break;

        default:
          throw new Error(`Unsupported HTTP method: ${method}`);
      }

      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      console.error("API Error Details:", {
        status: axiosError.response?.status,
        statusText: axiosError.response?.statusText,
        data: axiosError.response?.data,
        headers: axiosError.response?.headers,
        code: axiosError.code,
        message: axiosError.message,
        hasResponse: !!axiosError.response,
        hasRequest: !!axiosError.request,
        isNetworkError: !axiosError.response && axiosError.request
      });
      console.error("Full error response data:", JSON.stringify(axiosError.response?.data, null, 2));

      // Handle validation errors (field-specific errors)
      const data = axiosError.response?.data;
      if (data && typeof data === 'object' && !data.message && !data.error) {
        // Check if it's a field validation error object
        const fieldErrors = Object.entries(data).map(([field, errors]) => {
          if (Array.isArray(errors)) {
            return `${field}: ${errors.join(', ')}`;
          }
          return `${field}: ${errors}`;
        });
        if (fieldErrors.length > 0) {
          throw new Error(fieldErrors.join('\n')) as TError;
        }
      }

      // Determine error message based on error type
      let errorMessage: string;

      if (axiosError.response) {
        // Server responded with error status
        const status = axiosError.response.status;

        if (status === 503) {
          errorMessage = "Server is temporarily unavailable. It may be restarting. Please try again in a moment.";
        } else if (status === 404) {
          // Enhanced 404 handling for employee profiles and missing resources
          const responseMessage = axiosError.response.data?.message || axiosError.response.data?.error;
          if (responseMessage?.includes('Employee profile')) {
            errorMessage = "Your employee profile is not set up. Please contact HR to complete your profile setup.";
          } else if (responseMessage?.includes('not found') || responseMessage?.includes('does not exist')) {
            errorMessage = responseMessage;
          } else {
            errorMessage = "The requested resource was not found.";
          }
        } else {
          errorMessage = axiosError.response.data?.message ||
                        axiosError.response.data?.error ||
                        `HTTP ${status}: ${axiosError.response.statusText}`;
        }
      } else if (axiosError.request) {
        // Network error - request was made but no response received
        if (axiosError.code === 'NETWORK_ERROR' || axiosError.code === 'ERR_NETWORK') {
          errorMessage = "Unable to connect to the server. The server may be restarting. Please try again in a moment.";
        } else if (axiosError.code === 'ECONNABORTED' || axiosError.message?.includes('timeout')) {
          errorMessage = "Request timed out. Please check your connection and try again.";
        } else if (axiosError.code === 'ERR_NAME_NOT_RESOLVED') {
          errorMessage = "Server not found. Please check if the server is running.";
        } else {
          errorMessage = "Network error occurred. Please check your connection and try again.";
        }
      } else {
        // Something else happened
        errorMessage = axiosError.message || "An unexpected error occurred";
      }

      throw new Error(errorMessage) as TError;
    }
  };

  const mutation = useMutation<ApiResponse<TData>, TError, TVariables>({
    mutationFn: apiController,
    onSuccess: (response) => {
      if (showSuccessToast && response.message) {
        toast.success(response.message);
      }

      if (queryKey) {
        const updateQueryKeys = Array.isArray(queryKey) ? queryKey : [queryKey];
        updateQueryKeys.forEach((key) => {
          if (key) {
            // Invalidate all queries that start with this key
            // This ensures that paginated/filtered queries are also invalidated
            queryClient.invalidateQueries({
              queryKey: [key],
              exact: false // This will invalidate all queries that start with [key]
            });
          }
        });
      }
    },
    onError: (error: TError) => {
      // Use enhanced error handling if not suppressed
      if (!suppressEnhancedErrorHandling) {
        const errorContext = createErrorContext(
          operation || `${method} request`,
          userDepartment,
          feature
        );
        handleApiError(error, errorContext);
      } else {
        // Fallback to simple toast
        toast.error((error as Error).message);
      }

      console.error(`${method} error:`, error);
    },
  });

  const callApi = async (details: TVariables): Promise<ApiResponse<TData>> => {
    return await mutation.mutateAsync(details);
  };

  return {
    callApi,
    data: mutation.data?.data,
    response: mutation.data,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
    isError: mutation.isError,
    mutation,
  };
};

// Export a QueryClient instance for direct use (outside of React components)
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx client errors
        if (error?.response?.status >= 400 && error?.response?.status < 500) {
          return false;
        }
        return failureCount < 2;
      },
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: false,
      refetchOnReconnect: 'always',
      refetchOnMount: true,
      // Enable network mode for better offline experience
      networkMode: 'online',
      // Prevent unnecessary background refetches
      refetchInterval: false,
      refetchIntervalInBackground: false,
    },
    mutations: {
      retry: (failureCount, error: any) => {
        // Don't retry validation errors
        if (error?.response?.status === 422 || error?.response?.status === 400) {
          return false;
        }
        return failureCount < 1;
      },
      retryDelay: 1000,
      networkMode: 'online',
    },
  },
});

export default useApiManager;
