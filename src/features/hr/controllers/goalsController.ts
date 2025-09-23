import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";

// API Response interface
interface ApiResponse<TData = unknown> {
  status: boolean;
  message: string;
  data: TData;
}

// Goal interface
export interface Goal {
  id: string;
  goal: string;
  competency: string;
  weight: string;
  employee_id: string;
  created_at: string;
  updated_at: string;
}

// Narrative interface for backend
export interface GoalNarrative {
  description: string;
  weight: number;
  completed: boolean;
}

// Goal creation payload to match backend schema
export interface CreateGoalPayload {
  employee: string;
  title: string;
  description: string;
  status?: string;
  start_date?: string;
  end_date?: string;
  narratives: GoalNarrative[];
}

const BASE_URL = "/hr/employee-goals/";

// ===== GOALS HOOKS =====

// Get Goals for Employee
export const useGetEmployeeGoals = (employeeId: string, enabled: boolean = true) => {
  return useQuery<ApiResponse<Goal[]>>({
    queryKey: ["employee-goals", employeeId],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`${BASE_URL}?employee=${employeeId}`);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Sorry: " + (axiosError.response?.data as any)?.message);
      }
    },
    enabled: enabled && !!employeeId,
    refetchOnWindowFocus: false,
  });
};

// Get All Goals
export const useGetGoals = ({
  search = "",
  page = 1,
  size = 20,
  enabled = true,
}: {
  search?: string;
  page?: number;
  size?: number;
  enabled?: boolean;
} = {}) => {
  return useQuery<ApiResponse<Goal[]>>({
    queryKey: ["goals", search, page, size],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(BASE_URL, {
          params: {
            page,
            size,
            ...(search && { search }),
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

// Get Single Goal
export const useGetGoal = (id: string, enabled: boolean = true) => {
  return useQuery<ApiResponse<Goal>>({
    queryKey: ["goal", id],
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

// Create Goal
export const useCreateGoal = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    Goal,
    Error,
    CreateGoalPayload
  >({
    endpoint: BASE_URL,
    queryKey: ["goals", "employee-goals"],
    isAuth: true,
    method: "POST",
  });

  const createGoal = async (details: CreateGoalPayload) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Goal create error:", error);
    }
  };

  return { createGoal, data, isLoading, isSuccess, error };
};

// Create Multiple Goals
export const useCreateMultipleGoals = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    Goal,
    Error,
    CreateGoalPayload
  >({
    endpoint: BASE_URL,
    queryKey: ["goals", "employee-goals"],
    isAuth: true,
    method: "POST",
  });

  const createMultipleGoals = async (goals: CreateGoalPayload[]) => {
    try {
      const results = [];
      for (const goal of goals) {
        const result = await callApi(goal);
        results.push(result);
      }
      return results;
    } catch (error) {
      console.error("Multiple goals create error:", error);
      throw error;
    }
  };

  return { createMultipleGoals, data, isLoading, isSuccess, error };
};

// Update Goal
export const useUpdateGoal = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    Goal,
    Error,
    Partial<CreateGoalPayload>
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["goals", "goal", "employee-goals"],
    isAuth: true,
    method: "PUT",
  });

  const updateGoal = async (details: Partial<CreateGoalPayload>) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Goal update error:", error);
    }
  };

  return { updateGoal, data, isLoading, isSuccess, error };
};

// Delete Goal
export const useDeleteGoal = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    void,
    Error,
    void
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["goals", "goal", "employee-goals"],
    isAuth: true,
    method: "DELETE",
  });

  const deleteGoal = async () => {
    try {
      await callApi();
    } catch (error) {
      console.error("Goal delete error:", error);
    }
  };

  return { deleteGoal, data, isLoading, isSuccess, error };
};