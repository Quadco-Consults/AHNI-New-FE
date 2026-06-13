import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import { TProjectFormValues, IProjectSingleData } from "../types/project/index";
import { TPaginatedResponse, TRequest, TResponse } from "definitions/index";

const BASE_URL = "/projects/";

// ===== PROJECT HOOKS =====

// Get All Projects
export const useGetAllProjects = ({
  page = 1,
  size = 20,
  search = "",
  has_fund_requests,
  enabled = true,
}: TRequest & { has_fund_requests?: boolean; enabled?: boolean }) => {
  return useQuery<TPaginatedResponse<IProjectSingleData>>({
    queryKey: ["projects", page, size, search, has_fund_requests],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(BASE_URL, {
          params: { page, size, search, has_fund_requests },
        });
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error(
          "Sorry: " + (axiosError.response?.data as any)?.message
        );
      }
    },
    enabled: enabled,
    refetchOnWindowFocus: false,
  });
};

// Get Single Project
export const useGetSingleProject = (id: string, enabled: boolean = true) => {
  return useQuery<TResponse<IProjectSingleData>>({
    queryKey: ["project", id],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`${BASE_URL}${id}/`);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error(
          "Sorry: " + (axiosError.response?.data as any)?.message
        );
      }
    },
    enabled: enabled && !!id,
    refetchOnWindowFocus: false,
  });
};

// Create Project
export const useAddProject = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    TResponse<IProjectSingleData>,
    Error,
    TProjectFormValues
  >({
    endpoint: BASE_URL,
    queryKey: "projects",
    isAuth: true,
    method: "POST",
  });

  const addProject = async (details: TProjectFormValues) => {
    try {
      const response = await callApi(details);
      return response;
    } catch (error) {
      console.error("Project create error:", error);
      throw error;
    }
  };

  return { addProject, data, isLoading, isSuccess, error };
};

// Update Project
export const useUpdateProject = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    TResponse<IProjectSingleData>,
    Error,
    any
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["projects", "project"],
    isAuth: true,
    method: "PUT",
  });

  const updateProject = async (details: any) => {
    try {
      const response = await callApi(details);
      return response;
    } catch (error) {
      console.error("Project update error:", error);
      throw error;
    }
  };

  return { updateProject, data, isLoading, isSuccess, error };
};

// Patch Project (Status Update)
export const usePatchProject = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    TResponse<IProjectSingleData>,
    Error,
    { status: string }
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["projects", "project"],
    isAuth: true,
    method: "PATCH",
  });

  const patchProject = async (details: { status: string }) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Project patch error:", error);
    }
  };

  return { patchProject, data, isLoading, isSuccess, error };
};

// Delete Project
export const useDeleteProject = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    TResponse<IProjectSingleData>,
    Error,
    Record<string, never>
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["projects"],
    isAuth: true,
    method: "DELETE",
  });

  const deleteProject = async () => {
    try {
      await callApi({} as Record<string, never>);
    } catch (error) {
      console.error("Project delete error:", error);
    }
  };

  return { deleteProject, data, isLoading, isSuccess, error };
};

// Missing named export - Partners function (placeholder)
export const useGetAllPartners = ({
  page = 1,
  size = 20,
  search = "",
  enabled = true,
} = {}) => {
  // This function might need to be implemented based on the actual API endpoint for partners
  // For now, returning an empty query as a placeholder
  return useQuery({
    queryKey: ["partners", page, size, search],
    queryFn: async () => {
      // Placeholder implementation - may need actual API endpoint
      const response = await AxiosWithToken.get("/projects/partners/", {
        params: { page, size, search },
      });
      return response.data;
    },
    enabled,
    refetchOnWindowFocus: false,
  });
};

// ===== PROJECT ACTIVITY REPORT HOOKS =====

// Get Project Activity Report Data
export const useGetProjectActivityReport = (id: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["project-activity-report", id],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`${BASE_URL}${id}/activity_report/`);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error(
          "Sorry: " + (axiosError.response?.data as any)?.message
        );
      }
    },
    enabled: enabled && !!id,
    refetchOnWindowFocus: false,
  });
};

// Generate Project Report
export const useGenerateProjectReport = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    any,
    Error,
    { type: 'pdf' | 'excel' | 'csv'; start_date?: string; end_date?: string }
  >({
    endpoint: `${BASE_URL}${id}/generate_report/`,
    queryKey: ["project-report", id],
    isAuth: true,
    method: "POST",
  });

  const generateReport = async (reportData: {
    type: 'pdf' | 'excel' | 'csv';
    start_date?: string;
    end_date?: string
  }) => {
    try {
      // For PDF/Excel/CSV downloads, we need to handle the response differently
      const response = await AxiosWithToken.post(
        `${BASE_URL}${id}/generate_report/`,
        reportData,
        {
          responseType: reportData.type === 'pdf' ? 'blob' : 'blob',
        }
      );

      // Create download link
      const blob = new Blob([response.data], {
        type: reportData.type === 'pdf'
          ? 'application/pdf'
          : reportData.type === 'excel'
          ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          : 'text/csv'
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `project_report.${reportData.type === 'excel' ? 'xlsx' : reportData.type}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      return response;
    } catch (error) {
      console.error("Report generation error:", error);
      throw error;
    }
  };

  return { generateReport, isLoading, isSuccess, error, data };
};


// ===== PROJECT FINANCIAL DATA HOOKS =====

// Get Project Disbursements
export const useGetProjectDisbursements = (id: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["project-disbursements", id],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`${BASE_URL}${id}/disbursements/`);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error(
          "Sorry: " + (axiosError.response?.data as any)?.message
        );
      }
    },
    enabled: enabled && !!id,
    refetchOnWindowFocus: false,
  });
};

// Get Project Expenditures
export const useGetProjectExpenditures = (id: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["project-expenditures", id],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`${BASE_URL}${id}/expenditures/`);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error(
          "Sorry: " + (axiosError.response?.data as any)?.message
        );
      }
    },
    enabled: enabled && !!id,
    refetchOnWindowFocus: false,
  });
};

// Get Project Fund Requests (using programs endpoint)
export const useGetProjectFundRequests = (id: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["project-fund-requests", id],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`/programs/fund-requests/?project=${id}`);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error(
          "Sorry: " + (axiosError.response?.data as any)?.message
        );
      }
    },
    enabled: enabled && !!id,
    refetchOnWindowFocus: false,
  });
};

// ===== ACHIEVEMENT HOOKS =====

// Create or Update Achievement
export const useSaveAchievement = () => {
  const saveAchievement = async (achievementData: {
    id?: string;
    project_target: string;
    quarter?: 'Q1' | 'Q2' | 'Q3' | 'Q4';
    value: number;
    comments?: string;
    achievement_date: string;
  }) => {
    try {
      // If achievement has an ID, we need to update it
      if (achievementData.id && !achievementData.id.includes('_')) {
        // Real ID from backend - update existing achievement
        const response = await AxiosWithToken.put(
          `projects/achievements/${achievementData.id}/`,
          {
            quarter: achievementData.quarter,
            value: achievementData.value,
            achievement_date: achievementData.achievement_date,
          }
        );
        return response.data;
      } else {
        // New achievement - create it via project target's add_achievement action
        const { id, project_target, ...dataToSend } = achievementData;
        const response = await AxiosWithToken.post(
          `projects/project-targets/${project_target}/add_achievement/`,
          dataToSend
        );
        return response.data;
      }
    } catch (error) {
      console.error("Achievement save error:", error);
      throw error;
    }
  };

  return { saveAchievement };
};

// Update Project Target Comments
export const useUpdateProjectTarget = (targetId: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    any,
    Error,
    { comments: string }
  >({
    endpoint: `/projects/project-targets/${targetId}/`,
    queryKey: ["project-targets", targetId],
    isAuth: true,
    method: "PATCH",
  });

  const updateTargetComments = async (comments: string) => {
    try {
      const response = await callApi({ comments });
      return response;
    } catch (error) {
      console.error("Target update error:", error);
      throw error;
    }
  };

  return { updateTargetComments, data, isLoading, isSuccess, error };
};

// Maintain legacy exports for backward compatibility
export const useGetAllProjectsQuery = useGetAllProjects;
export const useGetSingleProjectQuery = useGetSingleProject;
export const useAddProjectMutation = useAddProject;
export const useUpdateProjectMutation = useUpdateProject;
export const usePatchProjectMutation = usePatchProject;
export const useDeleteProjectMutation = useDeleteProject;
