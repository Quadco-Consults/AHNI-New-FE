import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import { JobApplication } from "../types/job-application";

// API Response interface
interface ApiResponse<TData = unknown> {
  status: boolean;
  message: string;
  data: TData;
}

// Filter parameters interface
interface JobApplicationFilterParams {
  status?: string;
  search?: string;
  id?: string;
  page?: number;
  size?: number;
  enabled?: boolean;
}

const BASE_URL = "hr/jobs/applications/";

// ===== JOB APPLICATION HOOKS =====

// Get Job Applications
export const useGetJobApplications = ({
  status = "",
  search = "",
  id = "",
  page = 1,
  size = 20,
  enabled = true,
}: JobApplicationFilterParams = {}) => {
  return useQuery<ApiResponse<JobApplication[]>>({
    queryKey: ["job-applications", status, search, id, page, size],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(BASE_URL, {
          params: {
            page,
            size,
            ...(id && { advertisement: id }),
            ...(status && { status }),
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

// Get Single Job Application
export const useGetJobApplication = (id: string, enabled: boolean = true) => {
  return useQuery<ApiResponse<JobApplication>>({
    queryKey: ["job-application", id],
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

// Create Job Application
export const useCreateJobApplication = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    JobApplication,
    Error,
    Partial<JobApplication>
  >({
    endpoint: BASE_URL,
    queryKey: ["job-applications"],
    isAuth: true,
    method: "POST",
  });

  const createJobApplication = async (details: Partial<JobApplication>) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Job application create error:", error);
    }
  };

  return { createJobApplication, data, isLoading, isSuccess, error };
};

// Update Job Application
export const useUpdateJobApplication = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    JobApplication,
    Error,
    Partial<JobApplication>
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["job-applications", "job-application"],
    isAuth: true,
    method: "PUT",
  });

  const updateJobApplication = async (details: Partial<JobApplication>) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Job application update error:", error);
    }
  };

  return { updateJobApplication, data, isLoading, isSuccess, error };
};

// Patch Job Application
export const usePatchJobApplication = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    JobApplication,
    Error,
    Partial<JobApplication>
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["job-applications", "job-application"],
    isAuth: true,
    method: "PATCH",
  });

  const patchJobApplication = async (details: Partial<JobApplication>) => {
    try {
      const result = await callApi(details);
      return result;
    } catch (error) {
      console.error("Job application patch error:", error);
      throw error; // Re-throw so calling code can handle the error
    }
  };

  return { patchJobApplication, data, isLoading, isSuccess, error };
};

// Patch Job Application Shortlisted
export const usePatchJobApplicationShortlisted = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    JobApplication,
    Error,
    Partial<JobApplication>
  >({
    endpoint: `hr/jobs/applications/${id}/shortlist/`,
    queryKey: ["job-applications", "job-application"],
    isAuth: true,
    method: "PATCH",
  });

  const patchJobApplicationShortlisted = async (details: Partial<JobApplication>) => {
    try {
      const result = await callApi(details);
      return result;
    } catch (error) {
      console.error("Job application shortlist error:", error);
      throw error; // Re-throw the error so caller knows it failed
    }
  };

  return { patchJobApplicationShortlisted, data, isLoading, isSuccess, error };
};

// Patch Job Application Accepted
export const usePatchJobApplicationAccepted = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    JobApplication,
    Error,
    Partial<JobApplication>
  >({
    endpoint: `hr/jobs/applications/${id}/accept/`,
    queryKey: ["job-applications", "job-application"],
    isAuth: true,
    method: "PATCH",
  });

  const patchJobApplicationAccepted = async (details: Partial<JobApplication>) => {
    try {
      const result = await callApi(details);
      return result;
    } catch (error) {
      console.error("Job application accept error:", error);
      throw error; // Re-throw the error so caller knows it failed
    }
  };

  return { patchJobApplicationAccepted, data, isLoading, isSuccess, error };
};

// Patch Job Application Preferred
export const usePatchJobApplicationPreferred = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    JobApplication,
    Error,
    Partial<JobApplication>
  >({
    endpoint: `hr/jobs/applications/${id}/preferred/`,
    queryKey: ["job-applications", "job-application"],
    isAuth: true,
    method: "PATCH",
  });

  const patchJobApplicationPreferred = async (details: Partial<JobApplication>) => {
    try {
      const result = await callApi(details);
      return result;
    } catch (error) {
      console.error("Job application preferred error:", error);
      throw error; // Re-throw the error so caller knows it failed
    }
  };

  return { patchJobApplicationPreferred, data, isLoading, isSuccess, error };
};

// Update Job Application Status to Interviewed - following the same pattern as other status endpoints
export const usePatchJobApplicationInterviewed = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    JobApplication,
    Error,
    Partial<JobApplication>
  >({
    endpoint: `${BASE_URL}${id}/interview/`,
    queryKey: ["job-applications", "job-application"],
    isAuth: true,
    method: "PATCH",
  });

  const patchJobApplicationInterviewed = async (details: Partial<JobApplication>) => {
    try {
      const result = await callApi(details);
      return result;
    } catch (error) {
      console.error("Job application interview error:", error);
      throw error; // Re-throw the error so caller knows it failed
    }
  };

  return { patchJobApplicationInterviewed, data, isLoading, isSuccess, error };
};

// Legacy function for backward compatibility
export const useUpdateJobApplicationToInterviewed = (id: string) => {
  const { patchJobApplicationInterviewed, data, isLoading, isSuccess, error } =
    usePatchJobApplicationInterviewed(id);

  const updateJobApplicationToInterviewed = async () => {
    console.log("🎯 Attempting to mark application as interviewed:", `${BASE_URL}${id}/interview/`);

    try {
      // Try with empty payload first (like other status endpoints)
      const result = await patchJobApplicationInterviewed({});
      console.log("✅ Interview status update successful:", result);
      return result;
    } catch (error) {
      console.error("❌ Interview status update failed:", error);
      throw error;
    }
  };

  return { updateJobApplicationToInterviewed, data, isLoading, isSuccess, error };
};


// Legacy exports for backward compatibility
export const useCreateJobApplicationMutation = useCreateJobApplication;
export const useGetJobApplicationQuery = useGetJobApplication;
export const useGetJobApplicationsQuery = useGetJobApplications;
export const useUpdateJobApplicationMutation = useUpdateJobApplication;
export const usePatchJobApplicationMutation = usePatchJobApplication;
export const usePatchJobApplicationShortlistedMutation = usePatchJobApplicationShortlisted;
export const usePatchJobApplicationAcceptedMutation = usePatchJobApplicationAccepted;
export const usePatchJobApplicationPreferredMutation = usePatchJobApplicationPreferred;
export const usePatchJobApplicationInterviewedMutation = useUpdateJobApplicationToInterviewed;