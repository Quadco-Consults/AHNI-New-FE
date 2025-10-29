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

// ===== PROJECT BUDGET =====

export interface ProjectBudget {
  id: string;
  project_id: string;
  title: string;
  budget: number;
  award_amount: number;
  currency: string;
  start_date: string;
  end_date: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface ProjectBudgetFormData {
  project_id: string;
  title: string;
  budget: number;
  award_amount: number;
  currency: string;
  start_date: string;
  end_date: string;
  status?: string;
}

export const useGetProjectBudgets = (filters?: {
  project_id?: string;
  status?: string;
  currency?: string;
  search?: string;
  page?: number;
  page_size?: number;
  ordering?: string;
}) => {
  return useQuery<FinanceApiResponse<PaginatedResponse<ProjectBudget>>>({
    queryKey: ["project-budgets", filters],
    queryFn: async () => {
      try {
        const params = new URLSearchParams();
        if (filters?.project_id) params.append('project_id', filters.project_id);
        if (filters?.status) params.append('status', filters.status);
        if (filters?.currency) params.append('currency', filters.currency);
        if (filters?.search) params.append('search', filters.search);
        if (filters?.page) params.append('page', filters.page.toString());
        if (filters?.page_size) params.append('page_size', filters.page_size.toString());
        if (filters?.ordering) params.append('ordering', filters.ordering);

        // Using the actual grants endpoint since project budgets are managed there
        const response = await AxiosWithToken.get(`/api/v1/grants/?${params.toString()}`);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Failed to fetch project budgets: " + (axiosError.response?.data as any)?.message);
      }
    },
    refetchOnWindowFocus: false,
  });
};

export const useGetSingleProjectBudget = (id: string, enabled: boolean = true) => {
  return useQuery<FinanceApiResponse<ProjectBudget>>({
    queryKey: ["project-budget", id],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`/api/v1/grants/${id}/`);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Failed to fetch project budget: " + (axiosError.response?.data as any)?.message);
      }
    },
    enabled: enabled && !!id,
    refetchOnWindowFocus: false,
  });
};

// ===== PROJECT OBLIGATIONS =====

export interface ProjectObligation {
  id: string;
  description: string;
  amount: string;
  grant: string;
  project: string;
  created_datetime: string;
  work_plan_activity?: string;
  work_plan_activity_details?: {
    id: string;
    activity_name: string;
    budget_amount: number;
  };
  status: string;
}

export interface ProjectObligationFormData {
  description: string;
  amount: string;
  grant: string;
  project: string;
  work_plan_activity?: string;
}

export const useGetProjectObligations = (filters?: {
  grant?: string;
  project?: string;
  work_plan_activity?: string;
  search?: string;
  page?: number;
  page_size?: number;
  ordering?: string;
}) => {
  return useQuery<FinanceApiResponse<PaginatedResponse<ProjectObligation>>>({
    queryKey: ["project-obligations", filters],
    queryFn: async () => {
      try {
        const params = new URLSearchParams();
        if (filters?.grant) params.append('grant', filters.grant);
        if (filters?.project) params.append('project', filters.project);
        if (filters?.work_plan_activity) params.append('work_plan_activity', filters.work_plan_activity);
        if (filters?.search) params.append('search', filters.search);
        if (filters?.page) params.append('page', filters.page.toString());
        if (filters?.page_size) params.append('page_size', filters.page_size.toString());
        if (filters?.ordering) params.append('ordering', filters.ordering);

        const response = await AxiosWithToken.get(`/api/v1/project-obligations/?${params.toString()}`);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Failed to fetch project obligations: " + (axiosError.response?.data as any)?.message);
      }
    },
    refetchOnWindowFocus: false,
  });
};

export const useCreateProjectObligation = () => {
  const queryClient = useQueryClient();
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    FinanceApiResponse<ProjectObligation>,
    Error,
    ProjectObligationFormData
  >({
    endpoint: "/api/v1/project-obligations/",
    queryKey: ["project-obligations"],
    isAuth: true,
    method: "POST",
  });

  const createObligation = async (data: ProjectObligationFormData) => {
    try {
      const result = await callApi(data);
      queryClient.invalidateQueries({ queryKey: ["project-obligations"] });
      queryClient.invalidateQueries({ queryKey: ["project-budgets"] });
      return result;
    } catch (error) {
      console.error("Project obligation creation error:", error);
      throw error;
    }
  };

  return { createObligation, data, isLoading, isSuccess, error };
};

// ===== PROJECT MODIFICATIONS =====

export interface ProjectModification {
  id: string;
  modification_number: string;
  modification_type: string;
  reason: string;
  amount_usd: string;
  amount_ngn: string;
  effective_date: string;
  approval_date: string;
  approved_by: string;
  grant_id: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface ProjectModificationFormData {
  modification_number: string;
  modification_type: string;
  reason: string;
  amount_usd: string;
  amount_ngn: string;
  effective_date: string;
  approval_date?: string;
  approved_by?: string;
  grant_id: string;
}

export const useGetProjectModifications = (filters?: {
  grant_id?: string;
  modification_type?: string;
  status?: string;
  search?: string;
  page?: number;
  page_size?: number;
  ordering?: string;
}) => {
  return useQuery<FinanceApiResponse<PaginatedResponse<ProjectModification>>>({
    queryKey: ["project-modifications", filters],
    queryFn: async () => {
      try {
        const params = new URLSearchParams();
        if (filters?.grant_id) params.append('grant_id', filters.grant_id);
        if (filters?.modification_type) params.append('modification_type', filters.modification_type);
        if (filters?.status) params.append('status', filters.status);
        if (filters?.search) params.append('search', filters.search);
        if (filters?.page) params.append('page', filters.page.toString());
        if (filters?.page_size) params.append('page_size', filters.page_size.toString());
        if (filters?.ordering) params.append('ordering', filters.ordering);

        const response = await AxiosWithToken.get(`/api/v1/grant-modifications/?${params.toString()}`);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Failed to fetch project modifications: " + (axiosError.response?.data as any)?.message);
      }
    },
    refetchOnWindowFocus: false,
  });
};

export const useCreateProjectModification = () => {
  const queryClient = useQueryClient();
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    FinanceApiResponse<ProjectModification>,
    Error,
    ProjectModificationFormData
  >({
    endpoint: "/api/v1/grant-modifications/",
    queryKey: ["project-modifications"],
    isAuth: true,
    method: "POST",
  });

  const createModification = async (data: ProjectModificationFormData) => {
    try {
      const result = await callApi(data);
      queryClient.invalidateQueries({ queryKey: ["project-modifications"] });
      queryClient.invalidateQueries({ queryKey: ["project-budgets"] });
      return result;
    } catch (error) {
      console.error("Project modification creation error:", error);
      throw error;
    }
  };

  return { createModification, data, isLoading, isSuccess, error };
};

// ===== PROJECT EXPENDITURES =====

export interface ProjectExpenditure {
  id: string;
  description: string;
  amount: string;
  date: string;
  grant: string;
  project: string;
  work_plan_activity?: string;
  work_plan_activity_details?: {
    id: string;
    activity_name: string;
    budget_amount: number;
  };
  status: string;
  created_at: string;
  updated_at: string;
}

export interface ProjectExpenditureFormData {
  description: string;
  amount: string;
  date: string;
  grant: string;
  project: string;
  work_plan_activity?: string;
}

export const useGetProjectExpenditures = (filters?: {
  grant?: string;
  project?: string;
  work_plan_activity?: string;
  date_from?: string;
  date_to?: string;
  search?: string;
  page?: number;
  page_size?: number;
  ordering?: string;
}) => {
  return useQuery<FinanceApiResponse<PaginatedResponse<ProjectExpenditure>>>({
    queryKey: ["project-expenditures", filters],
    queryFn: async () => {
      try {
        const params = new URLSearchParams();
        if (filters?.grant) params.append('grant', filters.grant);
        if (filters?.project) params.append('project', filters.project);
        if (filters?.work_plan_activity) params.append('work_plan_activity', filters.work_plan_activity);
        if (filters?.date_from) params.append('date_from', filters.date_from);
        if (filters?.date_to) params.append('date_to', filters.date_to);
        if (filters?.search) params.append('search', filters.search);
        if (filters?.page) params.append('page', filters.page.toString());
        if (filters?.page_size) params.append('page_size', filters.page_size.toString());
        if (filters?.ordering) params.append('ordering', filters.ordering);

        const response = await AxiosWithToken.get(`/api/v1/project-expenditures/?${params.toString()}`);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Failed to fetch project expenditures: " + (axiosError.response?.data as any)?.message);
      }
    },
    refetchOnWindowFocus: false,
  });
};

export const useCreateProjectExpenditure = () => {
  const queryClient = useQueryClient();
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    FinanceApiResponse<ProjectExpenditure>,
    Error,
    ProjectExpenditureFormData
  >({
    endpoint: "/api/v1/project-expenditures/",
    queryKey: ["project-expenditures"],
    isAuth: true,
    method: "POST",
  });

  const createExpenditure = async (data: ProjectExpenditureFormData) => {
    try {
      const result = await callApi(data);
      queryClient.invalidateQueries({ queryKey: ["project-expenditures"] });
      queryClient.invalidateQueries({ queryKey: ["project-obligations"] });
      queryClient.invalidateQueries({ queryKey: ["project-budgets"] });
      return result;
    } catch (error) {
      console.error("Project expenditure creation error:", error);
      throw error;
    }
  };

  return { createExpenditure, data, isLoading, isSuccess, error };
};

// ===== COMBINED PROJECT FINANCE ANALYTICS =====

export interface ProjectFinanceAnalytics {
  total_budget: number;
  total_obligations: number;
  total_modifications: number;
  total_expenditures: number;
  available_budget: number;
  budget_utilization_percentage: number;
  obligations_vs_budget_percentage: number;
  expenditures_vs_obligations_percentage: number;
}

export const useGetProjectFinanceAnalytics = (projectId?: string, grantId?: string) => {
  return useQuery<FinanceApiResponse<ProjectFinanceAnalytics>>({
    queryKey: ["project-finance-analytics", projectId, grantId],
    queryFn: async () => {
      try {
        const params = new URLSearchParams();
        if (projectId) params.append('project_id', projectId);
        if (grantId) params.append('grant_id', grantId);

        const response = await AxiosWithToken.get(`/api/v1/project-finance-analytics/?${params.toString()}`);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Failed to fetch project finance analytics: " + (axiosError.response?.data as any)?.message);
      }
    },
    refetchOnWindowFocus: false,
    enabled: !!(projectId || grantId),
  });
};

// ===== PROJECT WORKFLOW UPDATES =====

export const useUpdateProjectBudgetStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      try {
        const response = await AxiosWithToken.patch(`/api/v1/grants/${id}/`, { status });
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Failed to update project budget status: " + (axiosError.response?.data as any)?.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-budgets"] });
      queryClient.invalidateQueries({ queryKey: ["project-finance-analytics"] });
    },
  });
};

export const useApproveProjectObligation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      try {
        const response = await AxiosWithToken.patch(`/api/v1/project-obligations/${id}/`, {
          status: 'APPROVED'
        });
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Failed to approve project obligation: " + (axiosError.response?.data as any)?.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-obligations"] });
      queryClient.invalidateQueries({ queryKey: ["project-finance-analytics"] });
    },
  });
};

export const useApproveProjectModification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, approval_data }: {
      id: string;
      approval_data: { approved_by: string; approval_date: string; status: string }
    }) => {
      try {
        const response = await AxiosWithToken.patch(`/api/v1/grant-modifications/${id}/`, approval_data);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Failed to approve project modification: " + (axiosError.response?.data as any)?.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-modifications"] });
      queryClient.invalidateQueries({ queryKey: ["project-budgets"] });
      queryClient.invalidateQueries({ queryKey: ["project-finance-analytics"] });
    },
  });
};

export const useDeleteProjectObligation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      try {
        const response = await AxiosWithToken.delete(`/api/v1/project-obligations/${id}/`);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Failed to delete project obligation: " + (axiosError.response?.data as any)?.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-obligations"] });
      queryClient.invalidateQueries({ queryKey: ["project-finance-analytics"] });
    },
  });
};

export const useDeleteProjectExpenditure = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      try {
        const response = await AxiosWithToken.delete(`/api/v1/project-expenditures/${id}/`);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Failed to delete project expenditure: " + (axiosError.response?.data as any)?.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-expenditures"] });
      queryClient.invalidateQueries({ queryKey: ["project-obligations"] });
      queryClient.invalidateQueries({ queryKey: ["project-finance-analytics"] });
    },
  });
};