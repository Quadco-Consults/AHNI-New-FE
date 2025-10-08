import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import { toast } from "sonner";
import {
  IAdhocStaffDatabase,
  TAdhocStaffUpdatePayload,
  IAdhocStaffFilterParams,
  ITerminateStaffPayload,
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

const BASE_URL = "programs/adhoc-database/";

// ===== QUERY HOOKS =====

/**
 * Get All Adhoc Staff (Paginated)
 * @description Fetches list of all adhoc staff in the database with filtering
 */
export const useGetAllAdhocStaff = ({
  page = 1,
  size = 20,
  search = "",
  project,
  health_facility,
  lga,
  cluster,
  status,
  contract_expiring_soon,
  gender,
  state_of_origin,
  enabled = true,
}: IAdhocStaffFilterParams) => {
  return useQuery<PaginatedResponse<IAdhocStaffDatabase>>({
    queryKey: [
      "adhocStaffDatabase",
      page,
      size,
      search,
      project,
      health_facility,
      lga,
      cluster,
      status,
      contract_expiring_soon,
      gender,
      state_of_origin,
    ],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(BASE_URL, {
          params: {
            page,
            size,
            ...(search && { search }),
            ...(project && { project }),
            ...(health_facility && { health_facility }),
            ...(lga && { lga }),
            ...(cluster && { cluster }),
            ...(status && { status }),
            ...(contract_expiring_soon !== undefined && { contract_expiring_soon }),
            ...(gender && { gender }),
            ...(state_of_origin && { state_of_origin }),
          },
        });
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error(
          "Failed to fetch adhoc staff: " +
            ((axiosError.response?.data as any)?.message || axiosError.message)
        );
      }
    },
    enabled: enabled,
    refetchOnWindowFocus: false,
  });
};

/**
 * Get Single Adhoc Staff
 * @description Fetches detailed information about a specific adhoc staff member
 */
export const useGetSingleAdhocStaff = (
  id: string,
  enabled: boolean = true
) => {
  return useQuery<ApiResponse<IAdhocStaffDatabase>>({
    queryKey: ["adhocStaff", id],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`${BASE_URL}${id}/`);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error(
          "Failed to fetch staff member: " +
            ((axiosError.response?.data as any)?.message || axiosError.message)
        );
      }
    },
    enabled: enabled && !!id,
    refetchOnWindowFocus: false,
  });
};

/**
 * Get Active Adhoc Staff
 * @description Fetches only currently active adhoc staff
 */
export const useGetActiveAdhocStaff = ({
  page = 1,
  size = 20,
  search = "",
  project,
  enabled = true,
}: {
  page?: number;
  size?: number;
  search?: string;
  project?: string;
  enabled?: boolean;
}) => {
  return useQuery<PaginatedResponse<IAdhocStaffDatabase>>({
    queryKey: ["activeAdhocStaff", page, size, search, project],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`${BASE_URL}active/`, {
          params: {
            page,
            size,
            ...(search && { search }),
            ...(project && { project }),
          },
        });
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error(
          "Failed to fetch active staff: " +
            ((axiosError.response?.data as any)?.message || axiosError.message)
        );
      }
    },
    enabled: enabled,
    refetchOnWindowFocus: false,
  });
};

/**
 * Get Staff with Expiring Contracts
 * @description Fetches staff whose contracts are expiring soon (within 30 days)
 */
export const useGetExpiringContracts = ({
  page = 1,
  size = 20,
  days = 30,
  enabled = true,
}: {
  page?: number;
  size?: number;
  days?: number;
  enabled?: boolean;
}) => {
  return useQuery<PaginatedResponse<IAdhocStaffDatabase>>({
    queryKey: ["expiringContracts", page, size, days],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`${BASE_URL}expiring-contracts/`, {
          params: { page, size, days },
        });
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error(
          "Failed to fetch expiring contracts: " +
            ((axiosError.response?.data as any)?.message || axiosError.message)
        );
      }
    },
    enabled: enabled,
    refetchOnWindowFocus: false,
  });
};

/**
 * Get Database Statistics
 * @description Fetches overall statistics for the adhoc staff database
 */
export const useGetDatabaseStatistics = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ["adhocDatabaseStats"],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`${BASE_URL}statistics/`);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error(
          "Failed to fetch statistics: " +
            ((axiosError.response?.data as any)?.message || axiosError.message)
        );
      }
    },
    enabled: enabled,
    refetchOnWindowFocus: false,
  });
};

/**
 * Get Staff by Project
 * @description Fetches all adhoc staff assigned to a specific project
 */
export const useGetStaffByProject = (
  projectId: string,
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
  return useQuery<PaginatedResponse<IAdhocStaffDatabase>>({
    queryKey: ["adhocStaffByProject", projectId, page, size, status],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`${BASE_URL}by-project/${projectId}/`, {
          params: {
            page,
            size,
            ...(status && { status }),
          },
        });
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error(
          "Failed to fetch staff by project: " +
            ((axiosError.response?.data as any)?.message || axiosError.message)
        );
      }
    },
    enabled: enabled && !!projectId,
    refetchOnWindowFocus: false,
  });
};

/**
 * Get Staff by Health Facility
 * @description Fetches all adhoc staff assigned to a specific health facility
 */
export const useGetStaffByFacility = (
  facilityName: string,
  {
    page = 1,
    size = 20,
    enabled = true,
  }: {
    page?: number;
    size?: number;
    enabled?: boolean;
  } = {}
) => {
  return useQuery<PaginatedResponse<IAdhocStaffDatabase>>({
    queryKey: ["adhocStaffByFacility", facilityName, page, size],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(BASE_URL, {
          params: {
            page,
            size,
            health_facility: facilityName,
          },
        });
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error(
          "Failed to fetch staff by facility: " +
            ((axiosError.response?.data as any)?.message || axiosError.message)
        );
      }
    },
    enabled: enabled && !!facilityName,
    refetchOnWindowFocus: false,
  });
};

// ===== MUTATION HOOKS =====

/**
 * Update Adhoc Staff
 * @description Updates an existing adhoc staff member's information
 */
export const useUpdateAdhocStaff = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: TAdhocStaffUpdatePayload) => {
      const response = await AxiosWithToken.patch(`${BASE_URL}${id}/`, data);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["adhocStaffDatabase"] });
      queryClient.invalidateQueries({ queryKey: ["adhocStaff", id] });
      queryClient.invalidateQueries({ queryKey: ["activeAdhocStaff"] });
      queryClient.invalidateQueries({ queryKey: ["adhocDatabaseStats"] });
      toast.success(data.message || "Staff information updated successfully!");
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        (error.response?.data as any)?.message || "Failed to update staff information";
      toast.error(errorMessage);
    },
  });
};

/**
 * Delete Adhoc Staff
 * @description Deletes an adhoc staff member from the database
 */
export const useDeleteAdhocStaff = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await AxiosWithToken.delete(`${BASE_URL}${id}/`);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["adhocStaffDatabase"] });
      queryClient.invalidateQueries({ queryKey: ["activeAdhocStaff"] });
      queryClient.invalidateQueries({ queryKey: ["adhocDatabaseStats"] });
      toast.success(data.message || "Staff member deleted successfully!");
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        (error.response?.data as any)?.message || "Failed to delete staff member";
      toast.error(errorMessage);
    },
  });
};

// ===== ACTION HOOKS =====

/**
 * Terminate Staff
 * @description Terminates an adhoc staff member's contract
 */
export const useTerminateStaff = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: ITerminateStaffPayload) => {
      const response = await AxiosWithToken.post(`${BASE_URL}${id}/terminate/`, payload);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["adhocStaffDatabase"] });
      queryClient.invalidateQueries({ queryKey: ["adhocStaff", id] });
      queryClient.invalidateQueries({ queryKey: ["activeAdhocStaff"] });
      queryClient.invalidateQueries({ queryKey: ["adhocDatabaseStats"] });
      toast.success(data.message || "Staff contract terminated successfully!");
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        (error.response?.data as any)?.message || "Failed to terminate staff";
      toast.error(errorMessage);
    },
  });
};

/**
 * Suspend Staff
 * @description Suspends an adhoc staff member temporarily
 */
export const useSuspendStaff = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { suspension_reason: string; suspension_duration?: number }) => {
      const response = await AxiosWithToken.post(`${BASE_URL}${id}/suspend/`, payload);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["adhocStaffDatabase"] });
      queryClient.invalidateQueries({ queryKey: ["adhocStaff", id] });
      queryClient.invalidateQueries({ queryKey: ["activeAdhocStaff"] });
      queryClient.invalidateQueries({ queryKey: ["adhocDatabaseStats"] });
      toast.success(data.message || "Staff suspended successfully!");
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        (error.response?.data as any)?.message || "Failed to suspend staff";
      toast.error(errorMessage);
    },
  });
};

/**
 * Reactivate Staff
 * @description Reactivates a suspended adhoc staff member
 */
export const useReactivateStaff = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notes?: string) => {
      const response = await AxiosWithToken.post(`${BASE_URL}${id}/reactivate/`, {
        notes,
      });
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["adhocStaffDatabase"] });
      queryClient.invalidateQueries({ queryKey: ["adhocStaff", id] });
      queryClient.invalidateQueries({ queryKey: ["activeAdhocStaff"] });
      queryClient.invalidateQueries({ queryKey: ["adhocDatabaseStats"] });
      toast.success(data.message || "Staff reactivated successfully!");
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        (error.response?.data as any)?.message || "Failed to reactivate staff";
      toast.error(errorMessage);
    },
  });
};

/**
 * Renew Contract
 * @description Renews an adhoc staff member's contract
 */
export const useRenewContract = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      new_end_date: string;
      new_salary?: string;
      renewal_notes?: string;
    }) => {
      const response = await AxiosWithToken.post(`${BASE_URL}${id}/renew-contract/`, payload);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["adhocStaffDatabase"] });
      queryClient.invalidateQueries({ queryKey: ["adhocStaff", id] });
      queryClient.invalidateQueries({ queryKey: ["expiringContracts"] });
      queryClient.invalidateQueries({ queryKey: ["adhocDatabaseStats"] });
      toast.success(data.message || "Contract renewed successfully!");
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        (error.response?.data as any)?.message || "Failed to renew contract";
      toast.error(errorMessage);
    },
  });
};

/**
 * Get Staff Payment History
 * @description Fetches payment history for a specific staff member
 */
export const useGetStaffPaymentHistory = (
  staffId: string,
  {
    page = 1,
    size = 20,
    enabled = true,
  }: {
    page?: number;
    size?: number;
    enabled?: boolean;
  } = {}
) => {
  return useQuery({
    queryKey: ["staffPaymentHistory", staffId, page, size],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`${BASE_URL}${staffId}/payment-history/`, {
          params: { page, size },
        });
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error(
          "Failed to fetch payment history: " +
            ((axiosError.response?.data as any)?.message || axiosError.message)
        );
      }
    },
    enabled: enabled && !!staffId,
    refetchOnWindowFocus: false,
  });
};

/**
 * Export Database to Excel
 * @description Exports the adhoc staff database to an Excel file
 */
export const useExportDatabase = () => {
  return useMutation({
    mutationFn: async (filters?: IAdhocStaffFilterParams) => {
      const response = await AxiosWithToken.get(`${BASE_URL}export/`, {
        params: filters,
        responseType: "blob",
      });
      return response.data;
    },
    onSuccess: (data) => {
      // Create download link
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `adhoc-staff-database-${new Date().toISOString().split("T")[0]}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Database exported successfully!");
    },
    onError: (error: AxiosError) => {
      const errorMessage = "Failed to export database";
      toast.error(errorMessage);
    },
  });
};
