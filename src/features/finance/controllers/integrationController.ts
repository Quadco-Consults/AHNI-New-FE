import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import {
  IntegrationStats,
  IntegrationActivity,
  SyncStatus,
  FinancialAnalysis,
  DashboardWidget,
  AlertData,
  IntegrationFilters
} from "../types/integration.types";

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

// ===== INTEGRATION STATS =====

export const useGetIntegrationStats = (period: number = 30) => {
  return useQuery<FinanceApiResponse<IntegrationStats>>({
    queryKey: ["integration-stats", period],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`/api/finance/integration-stats/?days=${period}`);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Failed to fetch integration stats: " + (axiosError.response?.data as any)?.message);
      }
    },
    refetchInterval: 30000, // Refetch every 30 seconds
    refetchOnWindowFocus: true,
  });
};

// ===== INTEGRATION ACTIVITY =====

export const useGetIntegrationActivity = (filters?: IntegrationFilters) => {
  return useQuery<FinanceApiResponse<PaginatedResponse<IntegrationActivity>>>({
    queryKey: ["integration-activity", filters],
    queryFn: async () => {
      try {
        const params = new URLSearchParams();
        if (filters?.date_from) params.append('date_from', filters.date_from);
        if (filters?.date_to) params.append('date_to', filters.date_to);
        if (filters?.module) params.append('module', filters.module);
        if (filters?.status) params.append('status', filters.status);
        if (filters?.page) params.append('page', filters.page.toString());
        if (filters?.page_size) params.append('page_size', filters.page_size.toString());

        const response = await AxiosWithToken.get(`/api/finance/integration-activity/?${params.toString()}`);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Failed to fetch integration activity: " + (axiosError.response?.data as any)?.message);
      }
    },
    refetchOnWindowFocus: false,
  });
};

// ===== SYNC STATUS =====

export const useGetSyncStatus = () => {
  return useQuery<FinanceApiResponse<SyncStatus[]>>({
    queryKey: ["sync-status"],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get("/api/finance/sync-status/");
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Failed to fetch sync status: " + (axiosError.response?.data as any)?.message);
      }
    },
    refetchInterval: 10000, // Refetch every 10 seconds
    refetchOnWindowFocus: true,
  });
};

// ===== FINANCIAL ANALYSIS =====

export const useGetFinancialAnalysis = (days: number = 30) => {
  return useQuery<FinanceApiResponse<FinancialAnalysis>>({
    queryKey: ["financial-analysis", days],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`/api/finance/analysis/?days=${days}`);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Failed to fetch financial analysis: " + (axiosError.response?.data as any)?.message);
      }
    },
    refetchOnWindowFocus: false,
  });
};

// ===== DASHBOARD WIDGETS =====

export const useGetDashboardWidgets = () => {
  return useQuery<FinanceApiResponse<DashboardWidget[]>>({
    queryKey: ["dashboard-widgets"],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get("/api/finance/dashboard-widgets/");
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Failed to fetch dashboard widgets: " + (axiosError.response?.data as any)?.message);
      }
    },
    refetchInterval: 60000, // Refetch every minute
    refetchOnWindowFocus: true,
  });
};

// ===== ALERTS =====

export const useGetIntegrationAlerts = (resolved?: boolean) => {
  return useQuery<FinanceApiResponse<PaginatedResponse<AlertData>>>({
    queryKey: ["integration-alerts", resolved],
    queryFn: async () => {
      try {
        const params = new URLSearchParams();
        if (resolved !== undefined) params.append('resolved', resolved.toString());
        params.append('page_size', '50');

        const response = await AxiosWithToken.get(`/api/finance/integration-alerts/?${params.toString()}`);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Failed to fetch integration alerts: " + (axiosError.response?.data as any)?.message);
      }
    },
    refetchInterval: 30000, // Refetch every 30 seconds
    refetchOnWindowFocus: true,
  });
};

// ===== RECENT TRANSACTIONS =====

export const useGetRecentTransactions = (limit: number = 10) => {
  return useQuery<FinanceApiResponse<IntegrationActivity[]>>({
    queryKey: ["recent-transactions", limit],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`/api/finance/recent-transactions/?limit=${limit}`);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Failed to fetch recent transactions: " + (axiosError.response?.data as any)?.message);
      }
    },
    refetchInterval: 15000, // Refetch every 15 seconds
    refetchOnWindowFocus: true,
  });
};

// ===== MODULE STATS =====

export const useGetModuleStats = () => {
  return useQuery<FinanceApiResponse<any>>({
    queryKey: ["module-stats"],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get("/api/finance/module-stats/");
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Failed to fetch module stats: " + (axiosError.response?.data as any)?.message);
      }
    },
    refetchInterval: 60000, // Refetch every minute
    refetchOnWindowFocus: true,
  });
};