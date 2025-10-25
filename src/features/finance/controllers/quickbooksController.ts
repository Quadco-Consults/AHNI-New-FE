import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import {
  QuickBooksAuth,
  EntityMapping,
  SyncLog,
  SyncConfiguration,
  QuickBooksCompany,
  QuickBooksAccount,
  EntityMappingFormData,
  SyncConfigurationFormData,
  SyncType,
} from "../types/quickbooks.types";

// API Response interface
interface QuickBooksApiResponse<TData = unknown> {
  status: string;
  message: string;
  data: TData;
}

interface PaginatedResponse<TData> {
  results: TData[];
  count: number;
  next: string | null;
  previous: string | null;
}

// ===== AUTHENTICATION =====

export const useGetQuickBooksAuth = () => {
  return useQuery<QuickBooksApiResponse<QuickBooksAuth | null>>({
    queryKey: ["quickbooks-auth"],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get("/api/finance/quickbooks/auth/");
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Failed to fetch QuickBooks auth: " + (axiosError.response?.data as any)?.message);
      }
    },
    refetchOnWindowFocus: false,
  });
};

export const useQuickBooksConnect = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      try {
        const response = await AxiosWithToken.post("/api/finance/quickbooks/auth/connect/");
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Failed to connect to QuickBooks: " + (axiosError.response?.data as any)?.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quickbooks-auth"] });
    },
  });
};

export const useQuickBooksDisconnect = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      try {
        const response = await AxiosWithToken.post("/api/finance/quickbooks/auth/disconnect/");
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Failed to disconnect from QuickBooks: " + (axiosError.response?.data as any)?.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quickbooks-auth"] });
      queryClient.invalidateQueries({ queryKey: ["quickbooks-company"] });
    },
  });
};

// ===== COMPANY INFO =====

export const useGetQuickBooksCompany = () => {
  return useQuery<QuickBooksApiResponse<QuickBooksCompany>>({
    queryKey: ["quickbooks-company"],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get("/api/finance/quickbooks/company/");
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Failed to fetch QuickBooks company: " + (axiosError.response?.data as any)?.message);
      }
    },
    refetchOnWindowFocus: false,
  });
};

// ===== SYNC OPERATIONS =====

export const useGetSyncLogs = (filters?: {
  sync_type?: SyncType;
  status?: string;
  entity_type?: string;
  page?: number;
  page_size?: number;
}) => {
  return useQuery<QuickBooksApiResponse<PaginatedResponse<SyncLog>>>({
    queryKey: ["sync-logs", filters],
    queryFn: async () => {
      try {
        const params = new URLSearchParams();
        if (filters?.sync_type) params.append('sync_type', filters.sync_type);
        if (filters?.status) params.append('status', filters.status);
        if (filters?.entity_type) params.append('entity_type', filters.entity_type);
        if (filters?.page) params.append('page', filters.page.toString());
        if (filters?.page_size) params.append('page_size', filters.page_size.toString());

        const response = await AxiosWithToken.get(`/api/finance/quickbooks/sync/logs/?${params.toString()}`);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Failed to fetch sync logs: " + (axiosError.response?.data as any)?.message);
      }
    },
    refetchOnWindowFocus: false,
  });
};

export const useTriggerSync = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { entity_type?: string; sync_type: SyncType }) => {
      try {
        const response = await AxiosWithToken.post("/api/finance/quickbooks/sync/trigger/", data);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Failed to trigger sync: " + (axiosError.response?.data as any)?.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sync-logs"] });
    },
  });
};

// ===== ENTITY MAPPINGS =====

export const useGetEntityMappings = (filters?: {
  erp_entity_type?: string;
  quickbooks_entity_type?: string;
  is_active?: boolean;
  page?: number;
  page_size?: number;
}) => {
  return useQuery<QuickBooksApiResponse<PaginatedResponse<EntityMapping>>>({
    queryKey: ["entity-mappings", filters],
    queryFn: async () => {
      try {
        const params = new URLSearchParams();
        if (filters?.erp_entity_type) params.append('erp_entity_type', filters.erp_entity_type);
        if (filters?.quickbooks_entity_type) params.append('quickbooks_entity_type', filters.quickbooks_entity_type);
        if (filters?.is_active !== undefined) params.append('is_active', filters.is_active.toString());
        if (filters?.page) params.append('page', filters.page.toString());
        if (filters?.page_size) params.append('page_size', filters.page_size.toString());

        const response = await AxiosWithToken.get(`/api/finance/quickbooks/mappings/?${params.toString()}`);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Failed to fetch entity mappings: " + (axiosError.response?.data as any)?.message);
      }
    },
    refetchOnWindowFocus: false,
  });
};

export const useCreateEntityMapping = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: EntityMappingFormData) => {
      try {
        const response = await AxiosWithToken.post("/api/finance/quickbooks/mappings/", data);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Failed to create entity mapping: " + (axiosError.response?.data as any)?.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["entity-mappings"] });
    },
  });
};

export const useUpdateEntityMapping = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<EntityMappingFormData> }) => {
      try {
        const response = await AxiosWithToken.patch(`/api/finance/quickbooks/mappings/${id}/`, data);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Failed to update entity mapping: " + (axiosError.response?.data as any)?.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["entity-mappings"] });
    },
  });
};

export const useDeleteEntityMapping = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      try {
        const response = await AxiosWithToken.delete(`/api/finance/quickbooks/mappings/${id}/`);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Failed to delete entity mapping: " + (axiosError.response?.data as any)?.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["entity-mappings"] });
    },
  });
};

// ===== SYNC CONFIGURATIONS =====

export const useGetSyncConfigurations = () => {
  return useQuery<QuickBooksApiResponse<SyncConfiguration[]>>({
    queryKey: ["sync-configurations"],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get("/api/finance/quickbooks/sync/configurations/");
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Failed to fetch sync configurations: " + (axiosError.response?.data as any)?.message);
      }
    },
    refetchOnWindowFocus: false,
  });
};

export const useUpdateSyncConfiguration = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<SyncConfigurationFormData> }) => {
      try {
        const response = await AxiosWithToken.patch(`/api/finance/quickbooks/sync/configurations/${id}/`, data);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Failed to update sync configuration: " + (axiosError.response?.data as any)?.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sync-configurations"] });
    },
  });
};

// ===== QUICKBOOKS ENTITIES =====

export const useGetQuickBooksAccounts = () => {
  return useQuery<QuickBooksApiResponse<QuickBooksAccount[]>>({
    queryKey: ["quickbooks-accounts"],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get("/api/finance/quickbooks/accounts/");
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Failed to fetch QuickBooks accounts: " + (axiosError.response?.data as any)?.message);
      }
    },
    refetchOnWindowFocus: false,
  });
};