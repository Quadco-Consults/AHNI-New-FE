import useApiManager from "@/constants/mainController";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import {
  FCONumber,
  CostCategory,
  CostGrouping,
  CostInput,
  BudgetLine,
  FCONumberFormData,
  CostCategoryFormData,
  CostGroupingFormData,
  CostInputFormData,
  BudgetLineFormData,
  ApiResponse,
  PaginatedResponse,
  ClassificationFilters
} from "../types/classification.types";

// API Response interface
interface FinanceApiResponse<TData = unknown> {
  status: string;
  message: string;
  data: TData;
}

// ===== FCO NUMBERS =====

export const useGetFCONumbers = (filters?: ClassificationFilters) => {
  return useQuery<FinanceApiResponse<PaginatedResponse<FCONumber>>>({
    queryKey: ["fco-numbers", filters],
    queryFn: async () => {
      try {
        const params = new URLSearchParams();
        if (filters?.search) params.append('search', filters.search);
        if (filters?.is_active !== undefined) params.append('is_active', filters.is_active.toString());
        if (filters?.page) params.append('page', filters.page.toString());
        if (filters?.page_size) params.append('page_size', filters.page_size.toString());

        const response = await AxiosWithToken.get(`finance/fco-numbers/?${params.toString()}`);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Failed to fetch FCO numbers: " + (axiosError.response?.data as any)?.message);
      }
    },
    refetchOnWindowFocus: false,
  });
};

export const useGetSingleFCONumber = (id: string, enabled: boolean = true) => {
  return useQuery<FinanceApiResponse<FCONumber>>({
    queryKey: ["fco-number", id],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`finance/fco-numbers/${id}/`);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Failed to fetch FCO number: " + (axiosError.response?.data as any)?.message);
      }
    },
    enabled: enabled && !!id,
    refetchOnWindowFocus: false,
  });
};

export const useCreateFCONumber = () => {
  const queryClient = useQueryClient();
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    FinanceApiResponse<FCONumber>,
    Error,
    FCONumberFormData
  >({
    endpoint: "finance/fco-numbers/",
    queryKey: ["fco-numbers"],
    isAuth: true,
    method: "POST",
  });

  const createFCONumber = async (data: FCONumberFormData) => {
    try {
      const result = await callApi(data);
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["fco-numbers"] });
      return result;
    } catch (error) {
      console.error("FCO number creation error:", error);
      throw error;
    }
  };

  return { createFCONumber, data, isLoading, isSuccess, error };
};

export const useUpdateFCONumber = (id: string) => {
  const queryClient = useQueryClient();
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    FinanceApiResponse<FCONumber>,
    Error,
    Partial<FCONumberFormData>
  >({
    endpoint: `finance/fco-numbers/${id}/`,
    queryKey: ["fco-numbers"],
    isAuth: true,
    method: "PATCH",
  });

  const updateFCONumber = async (data: Partial<FCONumberFormData>) => {
    try {
      const result = await callApi(data);
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["fco-numbers"] });
      queryClient.invalidateQueries({ queryKey: ["fco-number", id] });
      return result;
    } catch (error) {
      console.error("FCO number update error:", error);
      throw error;
    }
  };

  return { updateFCONumber, data, isLoading, isSuccess, error };
};

export const useDeleteFCONumber = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      try {
        const response = await AxiosWithToken.delete(`finance/fco-numbers/${id}/`);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Failed to delete FCO number: " + (axiosError.response?.data as any)?.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fco-numbers"] });
    },
  });
};

// ===== COST CATEGORIES =====

export const useGetCostCategories = (filters?: ClassificationFilters) => {
  return useQuery<FinanceApiResponse<PaginatedResponse<CostCategory>>>({
    queryKey: ["cost-categories", filters],
    queryFn: async () => {
      try {
        const params = new URLSearchParams();
        if (filters?.search) params.append('search', filters.search);
        if (filters?.is_active !== undefined) params.append('is_active', filters.is_active.toString());
        if (filters?.fco_number) params.append('fco_number', filters.fco_number);
        if (filters?.page) params.append('page', filters.page.toString());
        if (filters?.page_size) params.append('page_size', filters.page_size.toString());

        const response = await AxiosWithToken.get(`finance/cost-categories/?${params.toString()}`);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Failed to fetch cost categories: " + (axiosError.response?.data as any)?.message);
      }
    },
    refetchOnWindowFocus: false,
  });
};

export const useCreateCostCategory = () => {
  const queryClient = useQueryClient();
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    FinanceApiResponse<CostCategory>,
    Error,
    CostCategoryFormData
  >({
    endpoint: "finance/cost-categories/",
    queryKey: ["cost-categories"],
    isAuth: true,
    method: "POST",
  });

  const createCostCategory = async (data: CostCategoryFormData) => {
    try {
      const result = await callApi(data);
      queryClient.invalidateQueries({ queryKey: ["cost-categories"] });
      return result;
    } catch (error) {
      console.error("Cost category creation error:", error);
      throw error;
    }
  };

  return { createCostCategory, data, isLoading, isSuccess, error };
};

// ===== COST GROUPINGS =====

export const useGetCostGroupings = (filters?: ClassificationFilters) => {
  return useQuery<FinanceApiResponse<PaginatedResponse<CostGrouping>>>({
    queryKey: ["cost-groupings", filters],
    queryFn: async () => {
      try {
        const params = new URLSearchParams();
        if (filters?.search) params.append('search', filters.search);
        if (filters?.is_active !== undefined) params.append('is_active', filters.is_active.toString());
        if (filters?.cost_category) params.append('cost_category', filters.cost_category);
        if (filters?.page) params.append('page', filters.page.toString());
        if (filters?.page_size) params.append('page_size', filters.page_size.toString());

        const response = await AxiosWithToken.get(`finance/cost-groupings/?${params.toString()}`);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Failed to fetch cost groupings: " + (axiosError.response?.data as any)?.message);
      }
    },
    refetchOnWindowFocus: false,
  });
};

export const useCreateCostGrouping = () => {
  const queryClient = useQueryClient();
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    FinanceApiResponse<CostGrouping>,
    Error,
    CostGroupingFormData
  >({
    endpoint: "finance/cost-groupings/",
    queryKey: ["cost-groupings"],
    isAuth: true,
    method: "POST",
  });

  const createCostGrouping = async (data: CostGroupingFormData) => {
    try {
      const result = await callApi(data);
      queryClient.invalidateQueries({ queryKey: ["cost-groupings"] });
      return result;
    } catch (error) {
      console.error("Cost grouping creation error:", error);
      throw error;
    }
  };

  return { createCostGrouping, data, isLoading, isSuccess, error };
};

// ===== COST INPUTS =====

export const useGetCostInputs = (filters?: ClassificationFilters) => {
  return useQuery<FinanceApiResponse<PaginatedResponse<CostInput>>>({
    queryKey: ["cost-inputs", filters],
    queryFn: async () => {
      try {
        const params = new URLSearchParams();
        if (filters?.search) params.append('search', filters.search);
        if (filters?.is_active !== undefined) params.append('is_active', filters.is_active.toString());
        if (filters?.cost_grouping) params.append('cost_grouping', filters.cost_grouping);
        if (filters?.page) params.append('page', filters.page.toString());
        if (filters?.page_size) params.append('page_size', filters.page_size.toString());

        const response = await AxiosWithToken.get(`finance/cost-inputs/?${params.toString()}`);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Failed to fetch cost inputs: " + (axiosError.response?.data as any)?.message);
      }
    },
    refetchOnWindowFocus: false,
  });
};

export const useCreateCostInput = () => {
  const queryClient = useQueryClient();
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    FinanceApiResponse<CostInput>,
    Error,
    CostInputFormData
  >({
    endpoint: "finance/cost-inputs/",
    queryKey: ["cost-inputs"],
    isAuth: true,
    method: "POST",
  });

  const createCostInput = async (data: CostInputFormData) => {
    try {
      const result = await callApi(data);
      queryClient.invalidateQueries({ queryKey: ["cost-inputs"] });
      return result;
    } catch (error) {
      console.error("Cost input creation error:", error);
      throw error;
    }
  };

  return { createCostInput, data, isLoading, isSuccess, error };
};

// ===== BUDGET LINES =====

export const useGetBudgetLines = (filters?: ClassificationFilters) => {
  return useQuery<FinanceApiResponse<PaginatedResponse<BudgetLine>>>({
    queryKey: ["budget-lines", filters],
    queryFn: async () => {
      try {
        const params = new URLSearchParams();
        if (filters?.search) params.append('search', filters.search);
        if (filters?.is_active !== undefined) params.append('is_active', filters.is_active.toString());
        if (filters?.page) params.append('page', filters.page.toString());
        if (filters?.page_size) params.append('page_size', filters.page_size.toString());

        const response = await AxiosWithToken.get(`finance/budget-lines/?${params.toString()}`);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Failed to fetch budget lines: " + (axiosError.response?.data as any)?.message);
      }
    },
    refetchOnWindowFocus: false,
  });
};

export const useGetSingleBudgetLine = (id: string, enabled: boolean = true) => {
  return useQuery<FinanceApiResponse<BudgetLine>>({
    queryKey: ["budget-line", id],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`finance/budget-lines/${id}/`);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Failed to fetch budget line: " + (axiosError.response?.data as any)?.message);
      }
    },
    enabled: enabled && !!id,
    refetchOnWindowFocus: false,
  });
};

export const useCreateBudgetLine = () => {
  const queryClient = useQueryClient();
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    FinanceApiResponse<BudgetLine>,
    Error,
    BudgetLineFormData
  >({
    endpoint: "finance/budget-lines/",
    queryKey: ["budget-lines"],
    isAuth: true,
    method: "POST",
  });

  const createBudgetLine = async (data: BudgetLineFormData) => {
    try {
      const result = await callApi(data);
      queryClient.invalidateQueries({ queryKey: ["budget-lines"] });
      return result;
    } catch (error) {
      console.error("Budget line creation error:", error);
      throw error;
    }
  };

  return { createBudgetLine, data, isLoading, isSuccess, error };
};