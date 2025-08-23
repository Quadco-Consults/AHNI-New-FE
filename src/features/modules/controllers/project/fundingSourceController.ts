import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { 
  FundingSourceData, 
  FundingSourceFormValues 
} from "../../types/project";
import { 
  FilterParams,
  TPaginatedResponse,
  TResponse
} from "../../types";

// GET Operations (Queries)
export const useGetAllFundingSourcesManager = ({ 
  page = 1, 
  size = 20, 
  search = "",
  enabled = true 
}: FilterParams & { enabled?: boolean } = {}) => {
  return useQuery<TPaginatedResponse<FundingSourceData>>({
    queryKey: ["fundingSources", page, size, search],
    queryFn: async () => {
      const response = await AxiosWithToken.get("/projects/funding-sources/", {
        params: { page, size, search }
      });
      return response.data;
    },
    enabled,
    refetchOnWindowFocus: false,
  });
};

// GET Single Funding Source
export const useGetSingleFundingSourceManager = (id: string, enabled = true) => {
  return useQuery<TResponse<FundingSourceData>>({
    queryKey: ["fundingSource", id],
    queryFn: async () => {
      const response = await AxiosWithToken.get(`/projects/funding-sources/${id}/`);
      return response.data;
    },
    enabled: enabled && !!id,
    refetchOnWindowFocus: false,
  });
};

// CREATE Operations (Mutations)
export const CreateFundingSourceManager = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    FundingSourceData,
    Error,
    FundingSourceFormValues
  >({
    endpoint: "/projects/funding-sources/",
    queryKey: ["fundingSources"],
    isAuth: true,
    method: "POST",
  });

  const createFundingSource = async (details: FundingSourceFormValues) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Funding source creation error:", error);
    }
  };

  return { createFundingSource, data, isLoading, isSuccess, error };
};

// UPDATE Operations (Mutations)
export const UpdateFundingSourceManager = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    FundingSourceData,
    Error,
    FundingSourceFormValues
  >({
    endpoint: "/projects/funding-sources/",
    queryKey: ["fundingSources"],
    isAuth: true,
    method: "PUT",
  });

  const updateFundingSource = async (id: string, details: FundingSourceFormValues) => {
    try {
      const response = await AxiosWithToken.put(`/projects/funding-sources/${id}/`, details);
      return response.data;
    } catch (error) {
      console.error("Funding source update error:", error);
      throw error;
    }
  };

  return { updateFundingSource, data, isLoading, isSuccess, error };
};

// DELETE Operations (Mutations)
export const DeleteFundingSourceManager = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    FundingSourceData,
    Error,
    Record<string, never>
  >({
    endpoint: "/projects/funding-sources/",
    queryKey: ["fundingSources"],
    isAuth: true,
    method: "DELETE",
  });

  const deleteFundingSource = async (id: string) => {
    try {
      const response = await AxiosWithToken.delete(`/projects/funding-sources/${id}`);
      return response.data;
    } catch (error) {
      console.error("Funding source delete error:", error);
      throw error;
    }
  };

  return { deleteFundingSource, data, isLoading, isSuccess, error };
};

// Backward compatibility exports - RTK Query style
// Note: Original service has typo "useUseGetAllFundingSourceQuery" - keeping backward compatibility
export const useUseGetAllFundingSourceQuery = useGetAllFundingSourcesManager;
export const useGetAllFundingSources = useGetAllFundingSourcesManager;
export const useGetSingleFundingSourceQuery = useGetSingleFundingSourceManager;

export const useAddFundingSourceMutation = () => {
  const { createFundingSource, data, isLoading, isSuccess, error } = CreateFundingSourceManager();
  return [createFundingSource, { data, isLoading, isSuccess, error }] as const;
};

export const useUpdateFundingSourceMutation = () => {
  const { updateFundingSource, data, isLoading, isSuccess, error } = UpdateFundingSourceManager();
  return [
    (params: { id: string; body: FundingSourceFormValues }) => updateFundingSource(params.id, params.body),
    { data, isLoading, isSuccess, error }
  ] as const;
};

export const useDeleteFundingSourceMutation = () => {
  const { deleteFundingSource, data, isLoading, isSuccess, error } = DeleteFundingSourceManager();
  return [deleteFundingSource, { data, isLoading, isSuccess, error }] as const;
};

// Additional backward compatibility exports
export const useUpdateFundingSource = useUpdateFundingSourceMutation;
export const useAddFundingSource = useAddFundingSourceMutation;