import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import { toast } from "sonner";
import {
  IAdhocApplicant,
  TAdhocApplicantCreatePayload,
  IAdhocApplicantFilterParams,
  IShortlistApplicantPayload,
  IRejectApplicantPayload,
  IScheduleInterviewPayload,
  IRecordInterviewPayload,
  IHireApplicantPayload,
} from "../types/adhoc-management";

// API Response interfaces
interface ApiResponse<TData = unknown> {
  status: boolean;
  message: string;
  data: TData;
}

interface PaginatedResponse<T> {
  status: boolean;
  message: string;
  data: {
    paginator: {
      count: number;
      page: number;
      page_size: number;
      total_pages: number;
      next_page_number?: number | null;
      next?: string | null;
      previous?: string | null;
      previous_page_number?: number | null;
    };
    results: T[];
  };
}

const BASE_URL = "programs/adhoc/applicants/";

// ===== QUERY HOOKS =====

/**
 * Get All Adhoc Applicants (Paginated)
 * @description Fetches list of adhoc job applicants with filtering
 */
export const useGetAllAdhocApplicants = ({
  page = 1,
  size = 20,
  search = "",
  advertisement_id,
  status,
  gender,
  state_of_origin,
  date_from,
  date_to,
  enabled = true,
}: IAdhocApplicantFilterParams) => {
  return useQuery<PaginatedResponse<IAdhocApplicant>>({
    queryKey: [
      "adhocApplicants",
      page,
      size,
      search,
      advertisement_id,
      status,
      gender,
      state_of_origin,
      date_from,
      date_to,
    ],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(BASE_URL, {
          params: {
            page,
            size,
            ...(search && { search }),
            ...(advertisement_id && { advertisement_id }),
            ...(status && { status }),
            ...(gender && { gender }),
            ...(state_of_origin && { state_of_origin }),
            ...(date_from && { date_from }),
            ...(date_to && { date_to }),
          },
        });
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error(
          "Failed to fetch applicants: " +
            ((axiosError.response?.data as any)?.message || axiosError.message)
        );
      }
    },
    enabled: enabled,
    refetchOnWindowFocus: false,
  });
};

/**
 * Get Single Adhoc Applicant
 * @description Fetches detailed information about a specific applicant
 */
export const useGetSingleAdhocApplicant = (
  id: string,
  enabled: boolean = true
) => {
  return useQuery<ApiResponse<IAdhocApplicant>>({
    queryKey: ["adhocApplicant", id],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`${BASE_URL}${id}/`);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error(
          "Failed to fetch applicant: " +
            ((axiosError.response?.data as any)?.message || axiosError.message)
        );
      }
    },
    enabled: enabled && !!id,
    refetchOnWindowFocus: false,
  });
};

/**
 * Get Applicants by Advertisement
 * @description Fetches all applicants for a specific advertisement
 */
export const useGetApplicantsByAdvertisement = (
  advertisementId: string,
  {
    page = 1,
    size = 20,
    status,
    enabled = true,
  }: {
    page?: number;
    size?: number;
    status?: string;
    enabled?: boolean;
  } = {}
) => {
  return useQuery<PaginatedResponse<IAdhocApplicant>>({
    queryKey: ["adhocApplicantsByAd", advertisementId, page, size, status],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(BASE_URL, {
          params: {
            page,
            size,
            advertisement_id: advertisementId,
            ...(status && { status }),
          },
        });
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error(
          "Failed to fetch applicants: " +
            ((axiosError.response?.data as any)?.message || axiosError.message)
        );
      }
    },
    enabled: enabled && !!advertisementId,
    refetchOnWindowFocus: false,
  });
};

/**
 * Get Shortlisted Applicants
 * @description Fetches applicants who have been shortlisted
 */
export const useGetShortlistedApplicants = ({
  page = 1,
  size = 20,
  advertisement_id,
  enabled = true,
}: {
  page?: number;
  size?: number;
  advertisement_id?: string;
  enabled?: boolean;
}) => {
  return useQuery<PaginatedResponse<IAdhocApplicant>>({
    queryKey: ["shortlistedApplicants", page, size, advertisement_id],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`${BASE_URL}shortlisted/`, {
          params: {
            page,
            size,
            ...(advertisement_id && { advertisement_id }),
          },
        });
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error(
          "Failed to fetch shortlisted applicants: " +
            ((axiosError.response?.data as any)?.message || axiosError.message)
        );
      }
    },
    enabled: enabled,
    refetchOnWindowFocus: false,
  });
};

// ===== MUTATION HOOKS =====

/**
 * Create Adhoc Applicant
 * @description Creates a new adhoc job application
 */
export const useCreateAdhocApplicant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: TAdhocApplicantCreatePayload) => {
      const response = await AxiosWithToken.post(BASE_URL, data);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["adhocApplicants"] });
      queryClient.invalidateQueries({ queryKey: ["adhocApplicantsByAd"] });
      queryClient.invalidateQueries({ queryKey: ["adhocAdvertisementStats"] });
      toast.success(data.message || "Application submitted successfully!");
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        (error.response?.data as any)?.message || "Failed to submit application";
      toast.error(errorMessage);
    },
  });
};

/**
 * Update Adhoc Applicant
 * @description Updates an existing adhoc applicant's information
 */
export const useUpdateAdhocApplicant = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<TAdhocApplicantCreatePayload>) => {
      const response = await AxiosWithToken.patch(`${BASE_URL}${id}/`, data);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["adhocApplicants"] });
      queryClient.invalidateQueries({ queryKey: ["adhocApplicant", id] });
      queryClient.invalidateQueries({ queryKey: ["adhocApplicantsByAd"] });
      toast.success(data.message || "Applicant updated successfully!");
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        (error.response?.data as any)?.message || "Failed to update applicant";
      toast.error(errorMessage);
    },
  });
};

/**
 * Delete Adhoc Applicant
 * @description Deletes an adhoc applicant
 */
export const useDeleteAdhocApplicant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await AxiosWithToken.delete(`${BASE_URL}${id}/`);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["adhocApplicants"] });
      queryClient.invalidateQueries({ queryKey: ["adhocApplicantsByAd"] });
      queryClient.invalidateQueries({ queryKey: ["adhocAdvertisementStats"] });
      toast.success(data.message || "Applicant deleted successfully!");
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        (error.response?.data as any)?.message || "Failed to delete applicant";
      toast.error(errorMessage);
    },
  });
};

// ===== ACTION HOOKS =====

/**
 * Shortlist Applicants
 * @description Moves applicants to shortlisted status (bulk action)
 */
export const useShortlistApplicants = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: IShortlistApplicantPayload) => {
      const response = await AxiosWithToken.post(`${BASE_URL}shortlist/`, payload);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["adhocApplicants"] });
      queryClient.invalidateQueries({ queryKey: ["adhocApplicantsByAd"] });
      queryClient.invalidateQueries({ queryKey: ["shortlistedApplicants"] });
      queryClient.invalidateQueries({ queryKey: ["adhocAdvertisementStats"] });
      toast.success(data.message || "Applicants shortlisted successfully!");
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        (error.response?.data as any)?.message || "Failed to shortlist applicants";
      toast.error(errorMessage);
    },
  });
};

/**
 * Reject Applicants
 * @description Rejects applicants with reason (bulk action)
 */
export const useRejectApplicants = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: IRejectApplicantPayload) => {
      const response = await AxiosWithToken.post(`${BASE_URL}reject/`, payload);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["adhocApplicants"] });
      queryClient.invalidateQueries({ queryKey: ["adhocApplicantsByAd"] });
      queryClient.invalidateQueries({ queryKey: ["shortlistedApplicants"] });
      queryClient.invalidateQueries({ queryKey: ["adhocAdvertisementStats"] });
      toast.success(data.message || "Applicants rejected successfully!");
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        (error.response?.data as any)?.message || "Failed to reject applicants";
      toast.error(errorMessage);
    },
  });
};

/**
 * Schedule Interview
 * @description Schedules an interview for an applicant
 */
export const useScheduleInterview = (applicantId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: IScheduleInterviewPayload) => {
      const response = await AxiosWithToken.post(
        `${BASE_URL}${applicantId}/schedule-interview/`,
        payload
      );
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["adhocApplicants"] });
      queryClient.invalidateQueries({ queryKey: ["adhocApplicant", applicantId] });
      queryClient.invalidateQueries({ queryKey: ["shortlistedApplicants"] });
      toast.success(data.message || "Interview scheduled successfully!");
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        (error.response?.data as any)?.message || "Failed to schedule interview";
      toast.error(errorMessage);
    },
  });
};

/**
 * Record Interview
 * @description Records interview results for an applicant
 */
export const useRecordInterview = (applicantId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: IRecordInterviewPayload) => {
      const response = await AxiosWithToken.post(
        `${BASE_URL}${applicantId}/record-interview/`,
        payload
      );
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["adhocApplicants"] });
      queryClient.invalidateQueries({ queryKey: ["adhocApplicant", applicantId] });
      queryClient.invalidateQueries({ queryKey: ["shortlistedApplicants"] });
      toast.success(data.message || "Interview recorded successfully!");
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        (error.response?.data as any)?.message || "Failed to record interview";
      toast.error(errorMessage);
    },
  });
};

/**
 * Hire Applicant
 * @description Hires an applicant and adds them to the adhoc staff database
 */
export const useHireApplicant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: IHireApplicantPayload) => {
      const response = await AxiosWithToken.post(`${BASE_URL}hire/`, payload);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["adhocApplicants"] });
      queryClient.invalidateQueries({ queryKey: ["adhocApplicant"] });
      queryClient.invalidateQueries({ queryKey: ["adhocStaffDatabase"] });
      queryClient.invalidateQueries({ queryKey: ["adhocAdvertisementStats"] });
      toast.success(data.message || "Applicant hired successfully!");
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        (error.response?.data as any)?.message || "Failed to hire applicant";
      toast.error(errorMessage);
    },
  });
};

/**
 * Upload Applicant Document
 * @description Uploads a document for an applicant
 */
export const useUploadApplicantDocument = (applicantId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await AxiosWithToken.post(
        `${BASE_URL}${applicantId}/upload-document/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["adhocApplicant", applicantId] });
      toast.success(data.message || "Document uploaded successfully!");
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        (error.response?.data as any)?.message || "Failed to upload document";
      toast.error(errorMessage);
    },
  });
};

/**
 * Delete Applicant Document
 * @description Deletes a document from an applicant's profile
 */
export const useDeleteApplicantDocument = (applicantId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (documentId: string) => {
      const response = await AxiosWithToken.delete(
        `${BASE_URL}${applicantId}/documents/${documentId}/`
      );
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["adhocApplicant", applicantId] });
      toast.success(data.message || "Document deleted successfully!");
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        (error.response?.data as any)?.message || "Failed to delete document";
      toast.error(errorMessage);
    },
  });
};
