import useApiManager from "@/constants/mainController";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";

// API Response interface
interface FinanceApiResponse<TData = unknown> {
  status: string;
  message: string;
  data: TData;
}

interface PaginatedResponse<T> {
  count: number;
  next?: string;
  previous?: string;
  results: T[];
}

// ===== BUDGET LINES =====

export interface BudgetLine {
  id: string;
  line_number: string;
  description: string;
  category: string;
  budgeted_amount: number;
  actual_amount: number;
  committed_amount: number;
  available_amount: number;
  percentage_used: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface BudgetLineFormData {
  line_number: string;
  description: string;
  category: string;
  budgeted_amount: number;
  is_active?: boolean;
}

export const useGetBudgetLines = (filters?: {
  category?: string;
  is_active?: boolean;
  search?: string;
  page?: number;
  page_size?: number;
  ordering?: string;
}) => {
  return useQuery<FinanceApiResponse<PaginatedResponse<BudgetLine>>>(({
    queryKey: ["budget-lines", filters],
    queryFn: async () => {
      try {
        const params = new URLSearchParams();
        if (filters?.category) params.append('category', filters.category);
        if (filters?.is_active !== undefined) params.append('is_active', filters.is_active.toString());
        if (filters?.search) params.append('search', filters.search);
        if (filters?.page) params.append('page', filters.page.toString());
        if (filters?.page_size) params.append('page_size', filters.page_size.toString());
        if (filters?.ordering) params.append('ordering', filters.ordering);

        const response = await AxiosWithToken.get(`/api/v1/finance/budget-lines/?${params.toString()}`);
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
        const response = await AxiosWithToken.get(`/api/v1/finance/budget-lines/${id}/`);
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
    endpoint: "/api/v1/finance/budget-lines/",
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

export const useUpdateBudgetLine = (id: string) => {
  const queryClient = useQueryClient();
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    FinanceApiResponse<BudgetLine>,
    Error,
    Partial<BudgetLineFormData>
  >({
    endpoint: `/api/v1/finance/budget-lines/${id}/`,
    queryKey: ["budget-lines"],
    isAuth: true,
    method: "PATCH",
  });

  const updateBudgetLine = async (data: Partial<BudgetLineFormData>) => {
    try {
      const result = await callApi(data);
      queryClient.invalidateQueries({ queryKey: ["budget-lines"] });
      queryClient.invalidateQueries({ queryKey: ["budget-line", id] });
      return result;
    } catch (error) {
      console.error("Budget line update error:", error);
      throw error;
    }
  };

  return { updateBudgetLine, data, isLoading, isSuccess, error };
};

export const useDeleteBudgetLine = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      try {
        const response = await AxiosWithToken.delete(`/api/v1/finance/budget-lines/${id}/`);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Failed to delete budget line: " + (axiosError.response?.data as any)?.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budget-lines"] });
    },
  });
};

// ===== FCO NUMBERS =====

export interface FCONumber {
  id: string;
  fco_number: string;
  description: string;
  project_name: string;
  total_budget: number;
  used_budget: number;
  available_budget: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface FCONumberFormData {
  fco_number: string;
  description: string;
  project_name: string;
  total_budget: number;
  is_active?: boolean;
}

export const useGetFCONumbers = (filters?: {
  is_active?: boolean;
  search?: string;
  page?: number;
  page_size?: number;
  ordering?: string;
}) => {
  return useQuery<FinanceApiResponse<PaginatedResponse<FCONumber>>>({
    queryKey: ["fco-numbers", filters],
    queryFn: async () => {
      try {
        const params = new URLSearchParams();
        if (filters?.is_active !== undefined) params.append('is_active', filters.is_active.toString());
        if (filters?.search) params.append('search', filters.search);
        if (filters?.page) params.append('page', filters.page.toString());
        if (filters?.page_size) params.append('page_size', filters.page_size.toString());
        if (filters?.ordering) params.append('ordering', filters.ordering);

        const response = await AxiosWithToken.get(`/api/v1/finance/fco-numbers/?${params.toString()}`);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Failed to fetch FCO numbers: " + (axiosError.response?.data as any)?.message);
      }
    },
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
    endpoint: "/api/v1/finance/fco-numbers/",
    queryKey: ["fco-numbers"],
    isAuth: true,
    method: "POST",
  });

  const createFCONumber = async (data: FCONumberFormData) => {
    try {
      const result = await callApi(data);
      queryClient.invalidateQueries({ queryKey: ["fco-numbers"] });
      return result;
    } catch (error) {
      console.error("FCO number creation error:", error);
      throw error;
    }
  };

  return { createFCONumber, data, isLoading, isSuccess, error };
};

// ===== COST CATEGORIES =====

export interface CostCategory {
  id: string;
  category_code: string;
  category_name: string;
  description: string;
  budget_allocation: number;
  actual_spent: number;
  percentage_used: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CostCategoryFormData {
  category_code: string;
  category_name: string;
  description: string;
  budget_allocation: number;
  is_active?: boolean;
}

export const useGetCostCategories = (filters?: {
  is_active?: boolean;
  search?: string;
  page?: number;
  page_size?: number;
  ordering?: string;
}) => {
  return useQuery<FinanceApiResponse<PaginatedResponse<CostCategory>>>({
    queryKey: ["cost-categories", filters],
    queryFn: async () => {
      try {
        const params = new URLSearchParams();
        if (filters?.is_active !== undefined) params.append('is_active', filters.is_active.toString());
        if (filters?.search) params.append('search', filters.search);
        if (filters?.page) params.append('page', filters.page.toString());
        if (filters?.page_size) params.append('page_size', filters.page_size.toString());
        if (filters?.ordering) params.append('ordering', filters.ordering);

        const response = await AxiosWithToken.get(`/api/v1/finance/cost-categories/?${params.toString()}`);
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
    endpoint: "/api/v1/finance/cost-categories/",
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

// ===== COST INPUTS =====

export interface CostInput {
  id: string;
  input_code: string;
  input_name: string;
  description: string;
  unit_cost: number;
  quantity: number;
  total_cost: number;
  cost_category: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CostInputFormData {
  input_code: string;
  input_name: string;
  description: string;
  unit_cost: number;
  quantity: number;
  cost_category: string;
  is_active?: boolean;
}

export const useGetCostInputs = (filters?: {
  cost_category?: string;
  is_active?: boolean;
  search?: string;
  page?: number;
  page_size?: number;
  ordering?: string;
}) => {
  return useQuery<FinanceApiResponse<PaginatedResponse<CostInput>>>({
    queryKey: ["cost-inputs", filters],
    queryFn: async () => {
      try {
        const params = new URLSearchParams();
        if (filters?.cost_category) params.append('cost_category', filters.cost_category);
        if (filters?.is_active !== undefined) params.append('is_active', filters.is_active.toString());
        if (filters?.search) params.append('search', filters.search);
        if (filters?.page) params.append('page', filters.page.toString());
        if (filters?.page_size) params.append('page_size', filters.page_size.toString());
        if (filters?.ordering) params.append('ordering', filters.ordering);

        const response = await AxiosWithToken.get(`/api/v1/finance/cost-inputs/?${params.toString()}`);
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
    endpoint: "/api/v1/finance/cost-inputs/",
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

// ===== COST GROUPINGS =====

export interface CostGrouping {
  id: string;
  grouping_code: string;
  grouping_name: string;
  description: string;
  total_allocation: number;
  actual_spent: number;
  percentage_used: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CostGroupingFormData {
  grouping_code: string;
  grouping_name: string;
  description: string;
  total_allocation: number;
  is_active?: boolean;
}

export const useGetCostGroupings = (filters?: {
  is_active?: boolean;
  search?: string;
  page?: number;
  page_size?: number;
  ordering?: string;
}) => {
  return useQuery<FinanceApiResponse<PaginatedResponse<CostGrouping>>>({
    queryKey: ["cost-groupings", filters],
    queryFn: async () => {
      try {
        const params = new URLSearchParams();
        if (filters?.is_active !== undefined) params.append('is_active', filters.is_active.toString());
        if (filters?.search) params.append('search', filters.search);
        if (filters?.page) params.append('page', filters.page.toString());
        if (filters?.page_size) params.append('page_size', filters.page_size.toString());
        if (filters?.ordering) params.append('ordering', filters.ordering);

        const response = await AxiosWithToken.get(`/api/v1/finance/cost-groupings/?${params.toString()}`);
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
    endpoint: "/api/v1/finance/cost-groupings/",
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

// ===== PROJECT CLASSES =====

export interface ProjectClass {
  id: string;
  class_code: string;
  class_name: string;
  description: string;
  budget_allocation: number;
  actual_spent: number;
  percentage_used: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProjectClassFormData {
  class_code: string;
  class_name: string;
  description: string;
  budget_allocation: number;
  is_active?: boolean;
}

export const useGetProjectClasses = (filters?: {
  is_active?: boolean;
  search?: string;
  page?: number;
  page_size?: number;
  ordering?: string;
}) => {
  return useQuery<FinanceApiResponse<PaginatedResponse<ProjectClass>>>({
    queryKey: ["project-classes", filters],
    queryFn: async () => {
      try {
        const params = new URLSearchParams();
        if (filters?.is_active !== undefined) params.append('is_active', filters.is_active.toString());
        if (filters?.search) params.append('search', filters.search);
        if (filters?.page) params.append('page', filters.page.toString());
        if (filters?.page_size) params.append('page_size', filters.page_size.toString());
        if (filters?.ordering) params.append('ordering', filters.ordering);

        const response = await AxiosWithToken.get(`/api/v1/finance/project-classes/?${params.toString()}`);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Failed to fetch project classes: " + (axiosError.response?.data as any)?.message);
      }
    },
    refetchOnWindowFocus: false,
  });
};

export const useCreateProjectClass = () => {
  const queryClient = useQueryClient();
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    FinanceApiResponse<ProjectClass>,
    Error,
    ProjectClassFormData
  >({
    endpoint: "/api/v1/finance/project-classes/",
    queryKey: ["project-classes"],
    isAuth: true,
    method: "POST",
  });

  const createProjectClass = async (data: ProjectClassFormData) => {
    try {
      const result = await callApi(data);
      queryClient.invalidateQueries({ queryKey: ["project-classes"] });
      return result;
    } catch (error) {
      console.error("Project class creation error:", error);
      throw error;
    }
  };

  return { createProjectClass, data, isLoading, isSuccess, error };
};