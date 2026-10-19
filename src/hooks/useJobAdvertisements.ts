/**
 * Job Advertisement Hooks
 * React Query hooks for Job Advertisement management
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AxiosWithToken from "@/lib/axios";
import { toast } from "sonner";

// Types
export interface JobAdvertisement {
  id: string;
  advertisement_title: string;
  organization_name: string;
  organization_background: string;
  organization_location?: string;

  // Project context
  project_name?: string;
  project_duration?: string;
  project_location?: string;
  project_objectives?: string;
  project_scope?: string;
  donor_name?: string;

  // Position details
  title?: string;
  position?: {
    id: string;
    name: string;
  };
  grade?: {
    id: string;
    name: string;
  };
  level?: {
    id: string;
    name: string;
  };

  // Position classification
  contract_type: "FIXED_TERM" | "PERMANENT" | "TEMPORARY" | "CONSULTANCY";
  position_type?: "PROGRAMS" | "TECHNICAL" | "OPERATIONS" | "FINANCE" | "ADMIN";
  position_category?: string;
  project_tag?: string;

  locations: Array<{
    id: string;
    name: string;
  }>;

  job_type: "INTERNAL" | "EXTERNAL" | "BOTH";
  duration: string;
  commencement_date: string;
  number_of_positions: number;
  supervisor?: string;

  // Role description
  role_description?: string;
  background: string;

  // Requirements
  education_requirements?: string;
  professional_certifications?: string;
  experience_years_min: number;
  experience_years_max?: number;
  experience_requirements?: string;
  donor_experience?: string;
  technical_skills?: string;
  soft_skills?: string;
  location_context_requirement?: string;
  any_other_info?: string;

  // Application details
  application_deadline?: string;
  application_email?: string;
  application_method: string;
  application_instructions: string;
  application_format?: string;
  subject_line_format?: string;
  rolling_basis: boolean;
  interview_date?: string;
  salary_range?: string;

  // Status & publication
  status: "DRAFT" | "PUBLISHED" | "CLOSED" | "CANCELLED";
  is_published: boolean;
  published_date?: string;
  published_by?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  closing_date?: string;

  // Additional statements
  equal_opportunity_statement: string;
  disclaimer: string;
  shortlist_notification: string;
  contact_only_shortlisted: boolean;

  // Documents & resources
  advert_document?: string;

  interviewers: Array<{
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  }>;

  created_datetime: string;
  updated_datetime: string;
  created_by?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
}

/**
 * Fetch all job advertisements with optional filters
 */
export const useJobAdvertisements = (params?: {
  status?: string;
  is_published?: boolean;
  job_type?: string;
  position?: string;
  grade?: string;
  level?: string;
  project_tag?: string;
}) => {
  return useQuery<{ data: JobAdvertisement[] }>({
    queryKey: ["job-advertisements", params],
    queryFn: async () => {
      const response = await AxiosWithToken.get("/hr/jobs/advertisements/", {
        params,
      });
      if (response.data.results) {
        return { data: response.data.results };
      }
      return response.data;
    },
  });
};

/**
 * Fetch published job advertisements (for announcements)
 */
export const usePublishedJobAdvertisements = () => {
  return useQuery<{ data: JobAdvertisement[] }>({
    queryKey: ["published-job-advertisements"],
    queryFn: async () => {
      const response = await AxiosWithToken.get("/hr/jobs/advertisements/", {
        params: {
          is_published: true,
          status: "PUBLISHED",
        },
      });
      if (response.data.results) {
        return { data: response.data.results };
      }
      return response.data;
    },
  });
};

/**
 * Fetch internal job advertisements only (for staff announcements)
 */
export const useInternalJobAdvertisements = () => {
  return useQuery<{ data: JobAdvertisement[] }>({
    queryKey: ["internal-job-advertisements"],
    queryFn: async () => {
      const response = await AxiosWithToken.get("/hr/jobs/advertisements/", {
        params: {
          is_published: true,
          status: "PUBLISHED",
          job_type: "INTERNAL",
        },
      });
      if (response.data.results) {
        return { data: response.data.results };
      }
      return response.data;
    },
  });
};

/**
 * Fetch a single job advertisement by ID
 */
export const useJobAdvertisement = (id: string) => {
  return useQuery<{ data: JobAdvertisement }>({
    queryKey: ["job-advertisement", id],
    queryFn: async () => {
      const response = await AxiosWithToken.get(`/hr/jobs/advertisements/${id}/`);
      return response.data;
    },
    enabled: !!id,
  });
};

/**
 * Create a new job advertisement
 */
export const useCreateJobAdvertisement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<JobAdvertisement>) => {
      const response = await AxiosWithToken.post("/hr/jobs/advertisements/", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["job-advertisements"] });
      toast.success("Job advertisement created successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create job advertisement");
    },
  });
};

/**
 * Update a job advertisement
 */
export const useUpdateJobAdvertisement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<JobAdvertisement> }) => {
      const response = await AxiosWithToken.patch(`/hr/jobs/advertisements/${id}/`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["job-advertisements"] });
      queryClient.invalidateQueries({ queryKey: ["job-advertisement", variables.id] });
      toast.success("Job advertisement updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update job advertisement");
    },
  });
};

/**
 * Delete a job advertisement
 */
export const useDeleteJobAdvertisement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await AxiosWithToken.delete(`/hr/jobs/advertisements/${id}/`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["job-advertisements"] });
      toast.success("Job advertisement deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete job advertisement");
    },
  });
};

/**
 * Create job advertisement from approved staffing requisition
 */
export const useCreateJobAdvertisementFromRequisition = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (requisitionId: string) => {
      const response = await AxiosWithToken.post(`/hr/jobs/advertisements/from-requisition/${requisitionId}/`, {});
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["job-advertisements"] });
      queryClient.invalidateQueries({ queryKey: ["staffing-requisitions"] });
      toast.success("Draft job advertisement created from requisition. Please complete additional fields before publishing.");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create advertisement from requisition");
    },
  });
};
