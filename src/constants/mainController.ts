import {
  useMutation,
  useQueryClient,
  UseMutationResult,
} from "@tanstack/react-query";
import { toast } from "sonner";
import AxiosWithToken from "./api_management/MyHttpHelperWithToken";
import Axios from "./api_management/MyHttpHelper";
import { AxiosInstance, AxiosResponse, AxiosError } from "axios";

// Standard API response structure
interface ApiResponse<TData = unknown> {
  // or use a more specific default type
  status: boolean;
  message: string;
  data: TData;
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
        headers: axiosError.response?.headers
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
      
      throw new Error(
        axiosError.response?.data?.message || 
        axiosError.response?.data?.error ||
        `HTTP ${axiosError.response?.status}: ${axiosError.response?.statusText}` ||
        "An unexpected error occurred"
      ) as TError;
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
          if (key) queryClient.invalidateQueries({ queryKey: [key] });
        });
      }
    },
    onError: (error: TError) => {
      toast.error((error as Error).message);
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

export default useApiManager;
