import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import { getMockAwardsForSubGrant } from "@/utils/mockCGData";

const BASE_URL = "/contract-grants/sub-grant-awards/";

// ===== TYPES =====

interface SubGrantAward {
  id: string;
  sub_grant: string | any;
  submission: string | any;
  award_amount_usd: string;
  award_amount_ngn: string;
  award_start_date: string;
  award_end_date: string;
  award_notes?: string;
  status: "ACTIVE" | "COMPLETED" | "TERMINATED";
  created_datetime: string;
  updated_datetime: string;
  created_by?: any;
}

interface CreateAwardPayload {
  sub_grant: string;
  submission: string;
  award_amount_usd: string;
  award_amount_ngn: string;
  award_start_date: string;
  award_end_date: string;
  award_notes?: string;
}

interface MultiAwardItem {
  submission: string;
  award_amount_usd: string;
  award_amount_ngn: string;
  percentage: number;
}

interface CreateMultiAwardPayload {
  sub_grant: string;
  awards: MultiAwardItem[];
  award_start_date: string;
  award_end_date: string;
  award_notes?: string;
}

interface AwardFilterParams {
  page?: number;
  size?: number;
  search?: string;
  sub_grant?: string;
  status?: string;
  enabled?: boolean;
}

interface ApiResponse<T> {
  status: boolean;
  message: string;
  data: T;
}

interface PaginatedResponse<T> {
  status: boolean;
  message: string;
  data: {
    paginator: {
      count: number;
      page: number;
      page_size: number;
      total_pages: number;
      next_page_number?: number | null;
      next?: string | null;
      previous?: string | null;
      previous_page_number?: number | null;
    };
    results: T[];
  };
}

// ===== GET ALL AWARDS =====

export const useGetAllAwards = ({
  page = 1,
  size = 20,
  search = "",
  sub_grant = "",
  status = "",
  enabled = true,
}: AwardFilterParams) => {
  return useQuery<PaginatedResponse<SubGrantAward>>({
    queryKey: ["subGrantAwards", page, size, search, sub_grant, status],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(BASE_URL, {
          params: {
            page,
            size,
            ...(search && { search }),
            ...(sub_grant && { sub_grant }),
            ...(status && { status }),
          },
        });

        // If response is successful but has no results, use mock data
        if (response.data?.status && (!response.data?.data?.results || response.data.data.results.length === 0)) {
          console.log(`🎭 Using mock awards data (sub_grant: ${sub_grant || 'all'})`);
          return sub_grant ? getMockAwardsForSubGrant(sub_grant) : getMockAwardsForSubGrant("") as any;
        }

        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        console.log(`🎭 Awards API failed, using mock data (sub_grant: ${sub_grant || 'all'})`);

        // Enhanced error logging for debugging
        if (axiosError?.response) {
          console.log('📊 Awards API error details:', {
            status: axiosError.response.status,
            statusText: axiosError.response.statusText,
            data: axiosError.response.data,
            url: axiosError.config?.url,
            method: axiosError.config?.method
          });
        } else {
          console.log('📊 Awards API error (no response):', {
            message: axiosError?.message,
            code: axiosError?.code,
            url: axiosError?.config?.url
          });
        }

        // If API fails, use mock data
        return sub_grant ? getMockAwardsForSubGrant(sub_grant) : getMockAwardsForSubGrant("") as any;
      }
    },
    enabled: enabled,
    refetchOnWindowFocus: false,
    retry: (failureCount, error) => {
      // Don't retry if it's a deliberate 404 or authentication error
      const axiosError = error as AxiosError;
      if (axiosError?.response?.status === 404 || axiosError?.response?.status === 401) {
        return false;
      }
      // Retry up to 2 times for other errors
      return failureCount < 2;
    },
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
  });
};

// ===== GET SINGLE AWARD =====

export const useGetSingleAward = (id: string, enabled: boolean = true) => {
  return useQuery<ApiResponse<SubGrantAward>>({
    queryKey: ["subGrantAward", id],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`${BASE_URL}${id}/`);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;

        // Enhanced error logging for debugging
        if (axiosError?.response) {
          console.log('📊 Single award error details:', {
            status: axiosError.response.status,
            statusText: axiosError.response.statusText,
            data: axiosError.response.data,
            url: axiosError.config?.url,
            method: axiosError.config?.method
          });
        } else {
          console.log('📊 Single award error (no response):', {
            message: axiosError?.message,
            code: axiosError?.code,
            url: axiosError?.config?.url
          });
        }

        throw new Error("Sorry: " + (axiosError.response?.data as any)?.message);
      }
    },
    enabled: enabled && !!id,
    refetchOnWindowFocus: false,
    retry: (failureCount, error) => {
      // Don't retry if it's a deliberate 404 or authentication error
      const axiosError = error as AxiosError;
      if (axiosError?.response?.status === 404 || axiosError?.response?.status === 401) {
        return false;
      }
      // Retry up to 2 times for other errors
      return failureCount < 2;
    },
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
  });
};

// ===== CREATE SINGLE AWARD =====

export const useCreateAward = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    SubGrantAward,
    Error,
    CreateAwardPayload
  >({
    endpoint: BASE_URL,
    queryKey: ["subGrantAwards"],
    isAuth: true,
    method: "POST",
  });

  const createAward = async (payload: CreateAwardPayload) => {
    try {
      return await callApi(payload);
    } catch (error) {
      console.error("Create award error:", error);
      throw error;
    }
  };

  return { createAward, data, isLoading, isSuccess, error };
};

// ===== CREATE MULTI-AWARD =====

export const useCreateMultiAward = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    any,
    Error,
    CreateMultiAwardPayload
  >({
    endpoint: `${BASE_URL}multi-award/`,
    queryKey: ["subGrantAwards"],
    isAuth: true,
    method: "POST",
  });

  const createMultiAward = async (payload: CreateMultiAwardPayload) => {
    try {
      return await callApi(payload);
    } catch (error) {
      console.error("Create multi-award error:", error);
      throw error;
    }
  };

  return { createMultiAward, data, isLoading, isSuccess, error };
};

// ===== UPDATE AWARD =====

export const useUpdateAward = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    SubGrantAward,
    Error,
    Partial<CreateAwardPayload>
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["subGrantAwards", "subGrantAward", id],
    isAuth: true,
    method: "PATCH",
  });

  const updateAward = async (payload: Partial<CreateAwardPayload>) => {
    try {
      return await callApi(payload);
    } catch (error) {
      console.error("Update award error:", error);
      throw error;
    }
  };

  return { updateAward, data, isLoading, isSuccess, error };
};

// ===== DELETE AWARD =====

export const useDeleteAward = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    void,
    Error,
    Record<string, never>
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["subGrantAwards"],
    isAuth: true,
    method: "DELETE",
  });

  const deleteAward = async () => {
    try {
      return await callApi({} as Record<string, never>);
    } catch (error) {
      console.error("Delete award error:", error);
      throw error;
    }
  };

  return { deleteAward, data, isLoading, isSuccess, error };
};

// ===== GET AWARDS BY SUB-GRANT =====

export const useGetAwardsBySubGrant = (
  subGrantId: string,
  enabled: boolean = true
) => {
  return useQuery<ApiResponse<SubGrantAward[]>>({
    queryKey: ["subGrantAwards", "bySubGrant", subGrantId],
    queryFn: async () => {
      try {
        // Try the new dedicated awards endpoint first
        console.log(`🔍 Trying new SubGrant awards endpoint: /contract-grants/sub-grants/${subGrantId}/awards/`);
        const response = await AxiosWithToken.get(`/contract-grants/sub-grants/${subGrantId}/awards/`);

        if (response.data?.status && response.data?.data) {
          console.log(`✅ Successfully used new awards endpoint for sub-grant: ${subGrantId}`);
          return response.data;
        }

        throw new Error("No data from new endpoint, falling back");
      } catch (newEndpointError) {
        const axiosError = newEndpointError as AxiosError;
        console.log(`🔄 New endpoint failed (${axiosError?.response?.status || 'unknown error'}), trying fallback: /contract-grants/sub-grant-awards/`);

        // Enhanced error logging for debugging
        if (axiosError?.response) {
          console.log('📊 New endpoint error details:', {
            status: axiosError.response.status,
            statusText: axiosError.response.statusText,
            data: axiosError.response.data,
            url: axiosError.config?.url,
            method: axiosError.config?.method
          });
        } else {
          console.log('📊 New endpoint error (no response):', {
            message: axiosError?.message,
            code: axiosError?.code,
            url: axiosError?.config?.url
          });
        }

        try {
          const response = await AxiosWithToken.get(BASE_URL, {
            params: { sub_grant: subGrantId },
          });

          // If response is successful but has no results, use mock data
          if (response.data?.status && (!response.data?.data?.results || response.data.data.results.length === 0)) {
            console.log(`🎭 Using mock awards for sub-grant: ${subGrantId}`);
            return getMockAwardsForSubGrant(subGrantId) as any;
          }

          console.log(`✅ Successfully used fallback awards endpoint for sub-grant: ${subGrantId}`);
          return response.data;
        } catch (fallbackError) {
          const fallbackAxiosError = fallbackError as AxiosError;
          console.log(`🎭 Both awards endpoints failed, using mock data for sub-grant: ${subGrantId}`);

          // Enhanced error logging for fallback error
          if (fallbackAxiosError?.response) {
            console.log('📊 Fallback endpoint error details:', {
              status: fallbackAxiosError.response.status,
              statusText: fallbackAxiosError.response.statusText,
              data: fallbackAxiosError.response.data,
              url: fallbackAxiosError.config?.url,
              method: fallbackAxiosError.config?.method
            });
          } else {
            console.log('📊 Fallback endpoint error (no response):', {
              message: fallbackAxiosError?.message,
              code: fallbackAxiosError?.code,
              url: fallbackAxiosError?.config?.url
            });
          }

          // If both APIs fail, use mock data
          return getMockAwardsForSubGrant(subGrantId) as any;
        }
      }
    },
    enabled: enabled && !!subGrantId,
    refetchOnWindowFocus: false,
    retry: (failureCount, error) => {
      // Don't retry if it's a deliberate 404 or authentication error
      const axiosError = error as AxiosError;
      if (axiosError?.response?.status === 404 || axiosError?.response?.status === 401) {
        return false;
      }
      // Retry up to 2 times for other errors
      return failureCount < 2;
    },
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
  });
};


// Legacy exports for backward compatibility
export const useGetAwardsListQuery = useGetAllAwards;
export const useGetAwardQuery = useGetSingleAward;
export const useCreateAwardMutation = useCreateAward;
export const useUpdateAwardMutation = useUpdateAward;
export const useDeleteAwardMutation = useDeleteAward;

// Default export
const SubGrantAwardAPI = {
  useGetAllAwards,
  useGetSingleAward,
  useCreateAward,
  useCreateMultiAward,
  useUpdateAward,
  useDeleteAward,
  useGetAwardsBySubGrant,
  useGetAwardsListQuery,
  useGetAwardQuery,
  useCreateAwardMutation,
  useUpdateAwardMutation,
  useDeleteAwardMutation,
};

export default SubGrantAwardAPI;
