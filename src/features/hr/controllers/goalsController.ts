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

// Narrative interface (matches backend)
export interface GoalNarrative {
  id?: string;
  description: string;
  weight: number;  // Decimal (e.g., 25.00)
  completed: boolean;
  created_datetime?: string;
  updated_datetime?: string;
}

// Goal interface (matches backend response)
export interface Goal {
  id?: string;
  title: string;
  description?: string;
  employee?: string;
  employee_name?: string;
  status?: "not_started" | "in_progress" | "completed" | "on_hold" | "cancelled";
  start_date?: string;
  end_date?: string;
  total_weight?: string;  // Backend returns as string (e.g., "40.00")
  approved?: boolean;
  narratives: GoalNarrative[];
  created_datetime?: string;
  updated_datetime?: string;
  created_at?: string;
  updated_at?: string;

  // Computed property for display
  weight?: number;  // Calculated from total_weight or sum of narratives
}

// Goal creation payload (matches backend expectation)
export interface CreateGoalPayload {
  employee: string;
  title: string;
  description?: string;
  status?: "not_started" | "in_progress" | "completed" | "on_hold" | "cancelled";
  start_date?: string;
  end_date?: string;
  narratives: Omit<GoalNarrative, 'id' | 'created_datetime' | 'updated_datetime'>[];
}

const BASE_URL = "hr/performance/goals/";
const CREATE_GOALS_URL = "hr/performance/goals/";

// Validation helper function
export const validateGoalPayload = (payload: CreateGoalPayload): string[] => {
  const errors: string[] = [];

  // Check narratives
  if (!payload.narratives || payload.narratives.length === 0) {
    errors.push("At least one narrative is required");
  }

  // Check narrative weights sum to 100
  const totalWeight = payload.narratives.reduce((sum, n) => sum + n.weight, 0);
  if (Math.abs(totalWeight - 100) > 0.01) {  // Allow small floating point differences
    errors.push(`Narrative weights must sum to 100, got ${totalWeight.toFixed(2)}`);
  }

  // Check individual weights
  payload.narratives.forEach((narrative, index) => {
    if (narrative.weight < 0 || narrative.weight > 100) {
      errors.push(`Narrative ${index + 1} weight must be between 0-100`);
    }
  });

  // Check dates
  if (payload.start_date && payload.end_date &&
      new Date(payload.start_date) > new Date(payload.end_date)) {
    errors.push("End date must be after start date");
  }

  // Check required fields
  if (!payload.employee) {
    errors.push("Employee ID is required");
  }
  if (!payload.title?.trim()) {
    errors.push("Goal title is required");
  }

  return errors;
};

// ===== GOALS HOOKS =====

// Paginated Response interface
interface PaginatedResponse<T> {
  pagination: {
    count: number;
    next: string | null;
    previous: string | null;
  };
  results: T[];
}

// Get Goals for Employee
export const useGetEmployeeGoals = (employeeId: string, enabled: boolean = true) => {
  return useQuery<ApiResponse<PaginatedResponse<Goal>>>({
    queryKey: ["employee-goals", employeeId],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`${BASE_URL}?employee=${employeeId}`);
        // Debug: console.log("Raw API Response:", response.data);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        console.error("Employee Goals API Error:", {
          status: axiosError.response?.status,
          data: axiosError.response?.data,
          message: (axiosError.response?.data as any)?.message
        });
        throw new Error("Sorry: " + (axiosError.response?.data as any)?.message);
      }
    },
    enabled: enabled && !!employeeId,
    refetchOnWindowFocus: false,
    retry: false, // Don't retry on 500 errors
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
  return useQuery<ApiResponse<PaginatedResponse<Goal>>>({
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
    endpoint: CREATE_GOALS_URL,
    queryKey: ["goals", "employee-goals"],
    isAuth: true,
    method: "POST",
  });

  const createGoal = async (details: CreateGoalPayload) => {
    try {
      // Validate payload before making API call
      const validationErrors = validateGoalPayload(details);
      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join(". "));
      }

      await callApi(details);
    } catch (error) {
      console.error("Goal create error:", error);
      throw error; // Re-throw to allow calling component to handle
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
    endpoint: CREATE_GOALS_URL,
    queryKey: ["goals", "employee-goals"],
    isAuth: true,
    method: "POST",
  });

  const createMultipleGoals = async (goals: CreateGoalPayload[]) => {
    try {
      // Validate all goals before making API calls
      for (const goal of goals) {
        const validationErrors = validateGoalPayload(goal);
        if (validationErrors.length > 0) {
          throw new Error(`Goal "${goal.title}": ${validationErrors.join(". ")}`);
        }
      }

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