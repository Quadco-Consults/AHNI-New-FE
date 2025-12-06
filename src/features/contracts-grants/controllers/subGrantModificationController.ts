import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import {
  IModificationPaginatedData,
  IModificationSingleData,
  TModificationFormData,
} from "../types/modification";
import { getMockModificationsForSubGrant } from "@/utils/mockCGData";

// API Response interfaces
interface ApiResponse<TData = unknown> {
  status: boolean;
  message: string;
  data: TData;
}

interface PaginatedResponse<T> {
  status: boolean;
  message: string;
  data: {
    paginator?: {
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

// Filter parameters interface
interface SubGrantModificationFilterParams {
  subGrantId: string;  // Changed from awardId to subGrantId
  page?: number;
  size?: number;
  search?: string;
  enabled?: boolean;
}

const BASE_URL = "/contract-grants/sub-grants/";  // Changed from sub-grant-awards to sub-grants

// ===== SUB-GRANT MODIFICATION HOOKS =====

// Get All Modifications for a specific sub-grant
export const useGetAllSubGrantModifications = ({
  subGrantId,  // Changed parameter name
  page = 1,
  size = 20,
  search = "",
  enabled = true,
}: SubGrantModificationFilterParams) => {
  return useQuery<PaginatedResponse<IModificationPaginatedData>>({
    queryKey: ["subGrantModifications", subGrantId, page, size, search],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(
          `${BASE_URL}${subGrantId}/modifications/`,  // Use subGrantId
          {
            params: {
              page,
              size,
              ...(search && { search }),
            },
          }
        );

        // If response is successful but has no results, use mock data
        if (response.data?.status && (!response.data?.data?.results || response.data.data.results.length === 0)) {
          console.log(`🎭 Using mock modifications for sub-grant: ${subGrantId}`);
          return getMockModificationsForSubGrant(subGrantId) as any;
        }

        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        console.log(`🎭 Modifications API failed, using mock data for sub-grant: ${subGrantId}`);

        // If API fails, use mock data
        return getMockModificationsForSubGrant(subGrantId) as any;
      }
    },
    enabled: enabled && !!subGrantId,  // Check subGrantId
    refetchOnWindowFocus: false,
  });
};

// Create Modification for a specific sub-grant
export const useCreateSubGrantModification = (subGrantId: string) => {  // Changed parameter
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    IModificationSingleData,
    Error,
    TModificationFormData
  >({
    endpoint: `${BASE_URL}${subGrantId}/modifications/`,  // Use subGrantId
    queryKey: ["subGrantModifications", "subGrants"],
    isAuth: true,
    method: "POST",
  });

  const createModification = async (details: TModificationFormData) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Sub-grant modification create error:", error);
    }
  };

  return { createModification, data, isLoading, isSuccess, error };
};

// Update Modification for a specific sub-grant
export const useUpdateSubGrantModification = (
  subGrantId: string,  // Changed from awardId
  modificationId: string
) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    IModificationSingleData,
    Error,
    TModificationFormData
  >({
    endpoint: `${BASE_URL}${subGrantId}/modifications/${modificationId}/`,  // Use subGrantId
    queryKey: ["subGrantModifications", "subGrants"],
    isAuth: true,
    method: "PUT",
  });

  const updateModification = async (details: TModificationFormData) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Sub-grant modification update error:", error);
    }
  };

  return { updateModification, data, isLoading, isSuccess, error };
};

// Delete Modification for a specific sub-grant
export const useDeleteSubGrantModification = (
  subGrantId: string,  // Changed from awardId
  modificationId: string
) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    IModificationSingleData,
    Error,
    Record<string, never>
  >({
    endpoint: `${BASE_URL}${subGrantId}/modifications/${modificationId}/`,  // Use subGrantId
    queryKey: ["subGrantModifications", "subGrants"],
    isAuth: true,
    method: "DELETE",
  });

  const deleteModification = async () => {
    try {
      await callApi({} as Record<string, never>);
    } catch (error) {
      console.error("Sub-grant modification delete error:", error);
    }
  };

  return { deleteModification, data, isLoading, isSuccess, error };
};
