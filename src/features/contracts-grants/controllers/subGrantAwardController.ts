import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";

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
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Sorry: " + (axiosError.response?.data as any)?.message);
      }
    },
    enabled: enabled,
    refetchOnWindowFocus: false,
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
        throw new Error("Sorry: " + (axiosError.response?.data as any)?.message);
      }
    },
    enabled: enabled && !!id,
    refetchOnWindowFocus: false,
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
        const response = await AxiosWithToken.get(BASE_URL, {
          params: { sub_grant: subGrantId },
        });
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Sorry: " + (axiosError.response?.data as any)?.message);
      }
    },
    enabled: enabled && !!subGrantId,
    refetchOnWindowFocus: false,
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
