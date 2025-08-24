import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { 
  FinancialYearData, 
  FinancialYearFormValues 
} from "../../types/config";
import { 
  FilterParams,
  TPaginatedResponse,
  TResponse
} from "../../types";

// GET Operations (Queries)
export const useGetAllFinancialYearsManager = ({ 
  page = 1, 
  size = 20, 
  search = "",
  enabled = true 
}: FilterParams & { enabled?: boolean } = {}) => {
  return useQuery<TPaginatedResponse<FinancialYearData>>({
    queryKey: ["financial-years", page, size, search],
    queryFn: async () => {
      const response = await AxiosWithToken.get("/config/financial-year/", {
        params: { page, size, search }
      });
      return response.data;
    },
    enabled,
    refetchOnWindowFocus: false,
  });
};

// GET Single Financial Year
export const useGetSingleFinancialYearManager = (id: string, enabled: boolean = true) => {
  return useQuery<TResponse<FinancialYearData>>({
    queryKey: ["financial-year", id],
    queryFn: async () => {
      const response = await AxiosWithToken.get(`/config/financial-year/${id}/`);
      return response.data;
    },
    enabled: enabled && !!id,
    refetchOnWindowFocus: false,
  });
};

// CREATE Operations (Mutations)
export const CreateFinancialYearManager = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    FinancialYearData,
    Error,
    FinancialYearFormValues
  >({
    endpoint: "/config/financial-year/",
    queryKey: ["financial-years"],
    isAuth: true,
    method: "POST",
  });

  const createFinancialYear = async (details: FinancialYearFormValues) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Financial year creation error:", error);
    }
  };

  return { createFinancialYear, data, isLoading, isSuccess, error };
};

// UPDATE Operations (Mutations)
export const UpdateFinancialYearManager = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    FinancialYearData,
    Error,
    FinancialYearFormValues
  >({
    endpoint: "/config/financial-year/",
    queryKey: ["financial-years", "financial-year"],
    isAuth: true,
    method: "PATCH",
  });

  const updateFinancialYear = async (id: string, details: FinancialYearFormValues) => {
    try {
      const response = await AxiosWithToken.patch(`/config/financial-year/${id}/`, details);
      return response.data;
    } catch (error) {
      console.error("Financial year update error:", error);
      throw error;
    }
  };

  return { updateFinancialYear, data, isLoading, isSuccess, error };
};

// DELETE Operations (Mutations)
export const DeleteFinancialYearManager = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    FinancialYearData,
    Error,
    Record<string, never>
  >({
    endpoint: "/config/financial-year/",
    queryKey: ["financial-years"],
    isAuth: true,
    method: "DELETE",
  });

  const deleteFinancialYear = async (id: string) => {
    try {
      const response = await AxiosWithToken.delete(`/config/financial-year/${id}`);
      return response.data;
    } catch (error) {
      console.error("Financial year delete error:", error);
      throw error;
    }
  };

  return { deleteFinancialYear, data, isLoading, isSuccess, error };
};

// Backward compatibility exports - RTK Query style
export const useGetAllFinancialYearsQuery = useGetAllFinancialYearsManager;
export const useGetSingleFinancialYearQuery = useGetSingleFinancialYearManager;

export const useAddFinancialYearMutation = () => {
  const { createFinancialYear, data, isLoading, isSuccess, error } = CreateFinancialYearManager();
  return [createFinancialYear, { data, isLoading, isSuccess, error }] as const;
};

export const useUpdateFinancialYearMutation = () => {
  const { updateFinancialYear, data, isLoading, isSuccess, error } = UpdateFinancialYearManager();
  return [
    (params: { id: string; body: FinancialYearFormValues }) => updateFinancialYear(params.id, params.body),
    { data, isLoading, isSuccess, error }
  ] as const;
};

export const useDeleteFinancialYearMutation = () => {
  const { deleteFinancialYear, data, isLoading, isSuccess, error } = DeleteFinancialYearManager();
  return [deleteFinancialYear, { data, isLoading, isSuccess, error }] as const;
};

// Missing named export
export const useGetAllFinancialYears = useGetAllFinancialYearsManager;