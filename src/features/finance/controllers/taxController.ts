import useApiManager from "@/constants/mainController";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import {
  TaxType,
  TaxAuthority,
  TaxWithholding,
  TaxRemittance,
  TaxTypeFormData,
  TaxAuthorityFormData,
  TaxTypeFilters,
  TaxAuthorityFilters,
  TaxWithholdingFilters,
  TaxRemittanceFilters,
  PrepareRemittanceRequest,
  UpdateRemittanceStatusRequest,
  CalculateTaxRequest,
  TaxCalculationResult,
  PendingWithholdingsQuery,
  PendingWithholdingsSummary,
  TaxSummaryQuery,
  TaxSummaryReport,
} from "../types/tax.types";

// API Response interface
interface FinanceApiResponse<TData = unknown> {
  status: string;
  message: string;
  data: TData;
}

interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// ===== TAX TYPES =====

export const useGetTaxTypes = (filters?: TaxTypeFilters) => {
  return useQuery<FinanceApiResponse<PaginatedResponse<TaxType>>>({
    queryKey: ["tax-types", filters],
    queryFn: async () => {
      try {
        const params = new URLSearchParams();
        if (filters?.category) params.append('category', filters.category);
        if (filters?.is_active !== undefined) params.append('is_active', filters.is_active.toString());
        if (filters?.search) params.append('search', filters.search);

        const response = await AxiosWithToken.get(`finance/tax-types/?${params.toString()}`);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Failed to fetch tax types: " + (axiosError.response?.data as any)?.message);
      }
    },
    refetchOnWindowFocus: false,
  });
};

export const useGetSingleTaxType = (id: string, enabled: boolean = true) => {
  return useQuery<FinanceApiResponse<TaxType>>({
    queryKey: ["tax-type", id],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`finance/tax-types/${id}/`);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Failed to fetch tax type: " + (axiosError.response?.data as any)?.message);
      }
    },
    enabled: enabled && !!id,
    refetchOnWindowFocus: false,
  });
};

export const useCreateTaxType = () => {
  const queryClient = useQueryClient();
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    FinanceApiResponse<TaxType>,
    Error,
    TaxTypeFormData
  >({
    endpoint: "finance/tax-types/",
    queryKey: ["tax-types"],
    isAuth: true,
    method: "POST",
  });

  const createTaxType = async (data: TaxTypeFormData) => {
    try {
      const result = await callApi(data);
      queryClient.invalidateQueries({ queryKey: ["tax-types"] });
      return result;
    } catch (error) {
      console.error("Tax type creation error:", error);
      throw error;
    }
  };

  return { createTaxType, data, isLoading, isSuccess, error };
};

export const useUpdateTaxType = (id: string) => {
  const queryClient = useQueryClient();
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    FinanceApiResponse<TaxType>,
    Error,
    Partial<TaxTypeFormData>
  >({
    endpoint: `finance/tax-types/${id}/`,
    queryKey: ["tax-type", id],
    isAuth: true,
    method: "PATCH",
  });

  const updateTaxType = async (updateData: Partial<TaxTypeFormData>) => {
    try {
      const result = await callApi(updateData);
      queryClient.invalidateQueries({ queryKey: ["tax-types"] });
      queryClient.invalidateQueries({ queryKey: ["tax-type", id] });
      return result;
    } catch (error) {
      console.error("Tax type update error:", error);
      throw error;
    }
  };

  return { updateTaxType, data, isLoading, isSuccess, error };
};

export const useDeleteTaxType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await AxiosWithToken.delete(`finance/tax-types/${id}/`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tax-types"] });
    },
  });
};

// ===== TAX AUTHORITIES =====

export const useGetTaxAuthorities = (filters?: TaxAuthorityFilters) => {
  return useQuery<FinanceApiResponse<PaginatedResponse<TaxAuthority>>>({
    queryKey: ["tax-authorities", filters],
    queryFn: async () => {
      try {
        const params = new URLSearchParams();
        if (filters?.is_active !== undefined) params.append('is_active', filters.is_active.toString());
        if (filters?.search) params.append('search', filters.search);

        const response = await AxiosWithToken.get(`finance/tax-authorities/?${params.toString()}`);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Failed to fetch tax authorities: " + (axiosError.response?.data as any)?.message);
      }
    },
    refetchOnWindowFocus: false,
  });
};

export const useGetSingleTaxAuthority = (id: string, enabled: boolean = true) => {
  return useQuery<FinanceApiResponse<TaxAuthority>>({
    queryKey: ["tax-authority", id],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`finance/tax-authorities/${id}/`);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Failed to fetch tax authority: " + (axiosError.response?.data as any)?.message);
      }
    },
    enabled: enabled && !!id,
    refetchOnWindowFocus: false,
  });
};

export const useCreateTaxAuthority = () => {
  const queryClient = useQueryClient();
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    FinanceApiResponse<TaxAuthority>,
    Error,
    TaxAuthorityFormData
  >({
    endpoint: "finance/tax-authorities/",
    queryKey: ["tax-authorities"],
    isAuth: true,
    method: "POST",
  });

  const createTaxAuthority = async (data: TaxAuthorityFormData) => {
    try {
      const result = await callApi(data);
      queryClient.invalidateQueries({ queryKey: ["tax-authorities"] });
      return result;
    } catch (error) {
      console.error("Tax authority creation error:", error);
      throw error;
    }
  };

  return { createTaxAuthority, data, isLoading, isSuccess, error };
};

export const useUpdateTaxAuthority = (id: string) => {
  const queryClient = useQueryClient();
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    FinanceApiResponse<TaxAuthority>,
    Error,
    Partial<TaxAuthorityFormData>
  >({
    endpoint: `finance/tax-authorities/${id}/`,
    queryKey: ["tax-authority", id],
    isAuth: true,
    method: "PATCH",
  });

  const updateTaxAuthority = async (updateData: Partial<TaxAuthorityFormData>) => {
    try {
      const result = await callApi(updateData);
      queryClient.invalidateQueries({ queryKey: ["tax-authorities"] });
      queryClient.invalidateQueries({ queryKey: ["tax-authority", id] });
      return result;
    } catch (error) {
      console.error("Tax authority update error:", error);
      throw error;
    }
  };

  return { updateTaxAuthority, data, isLoading, isSuccess, error };
};

export const useDeleteTaxAuthority = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await AxiosWithToken.delete(`finance/tax-authorities/${id}/`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tax-authorities"] });
    },
  });
};

// ===== TAX WITHHOLDINGS =====

export const useGetTaxWithholdings = (filters?: TaxWithholdingFilters) => {
  return useQuery<FinanceApiResponse<PaginatedResponse<TaxWithholding>>>({
    queryKey: ["tax-withholdings", filters],
    queryFn: async () => {
      try {
        const params = new URLSearchParams();
        if (filters?.remittance_status) params.append('remittance_status', filters.remittance_status);
        if (filters?.tax_type_id) params.append('tax_type_id', filters.tax_type_id);
        if (filters?.tax_authority_id) params.append('tax_authority_id', filters.tax_authority_id);
        if (filters?.date_from) params.append('date_from', filters.date_from);
        if (filters?.date_to) params.append('date_to', filters.date_to);

        const response = await AxiosWithToken.get(`finance/tax-withholdings/?${params.toString()}`);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Failed to fetch tax withholdings: " + (axiosError.response?.data as any)?.message);
      }
    },
    refetchOnWindowFocus: false,
  });
};

export const useGetPendingWithholdings = (query?: PendingWithholdingsQuery) => {
  return useQuery<FinanceApiResponse<PendingWithholdingsSummary>>({
    queryKey: ["pending-withholdings", query],
    queryFn: async () => {
      try {
        const params = new URLSearchParams();
        if (query?.tax_authority_id) params.append('tax_authority_id', query.tax_authority_id);
        if (query?.tax_type_id) params.append('tax_type_id', query.tax_type_id);
        if (query?.period_from) params.append('period_from', query.period_from);
        if (query?.period_to) params.append('period_to', query.period_to);

        const response = await AxiosWithToken.get(`finance/tax-withholdings/pending/?${params.toString()}`);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Failed to fetch pending withholdings: " + (axiosError.response?.data as any)?.message);
      }
    },
    enabled: false, // Manual trigger
    refetchOnWindowFocus: false,
  });
};

// ===== TAX REMITTANCES =====

export const useGetTaxRemittances = (filters?: TaxRemittanceFilters) => {
  return useQuery<FinanceApiResponse<PaginatedResponse<TaxRemittance>>>({
    queryKey: ["tax-remittances", filters],
    queryFn: async () => {
      try {
        const params = new URLSearchParams();
        if (filters?.status) params.append('status', filters.status);
        if (filters?.tax_authority_id) params.append('tax_authority_id', filters.tax_authority_id);
        if (filters?.tax_type_id) params.append('tax_type_id', filters.tax_type_id);

        const response = await AxiosWithToken.get(`finance/tax-remittances/?${params.toString()}`);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Failed to fetch tax remittances: " + (axiosError.response?.data as any)?.message);
      }
    },
    refetchOnWindowFocus: false,
  });
};

export const useGetSingleTaxRemittance = (id: string, enabled: boolean = true) => {
  return useQuery<FinanceApiResponse<TaxRemittance>>({
    queryKey: ["tax-remittance", id],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`finance/tax-remittances/${id}/`);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Failed to fetch tax remittance: " + (axiosError.response?.data as any)?.message);
      }
    },
    enabled: enabled && !!id,
    refetchOnWindowFocus: false,
  });
};

export const usePrepareRemittance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: PrepareRemittanceRequest) => {
      const response = await AxiosWithToken.post('finance/tax-remittances/prepare/', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tax-remittances"] });
      queryClient.invalidateQueries({ queryKey: ["tax-withholdings"] });
      queryClient.invalidateQueries({ queryKey: ["pending-withholdings"] });
    },
  });
};

export const useUpdateRemittanceStatus = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateRemittanceStatusRequest) => {
      const formData = new FormData();
      formData.append('status', data.status);
      if (data.remittance_date) formData.append('remittance_date', data.remittance_date);
      if (data.payment_reference) formData.append('payment_reference', data.payment_reference);
      if (data.receipt_file) formData.append('receipt_file', data.receipt_file);

      const response = await AxiosWithToken.post(
        `finance/tax-remittances/${id}/update-status/`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tax-remittances"] });
      queryClient.invalidateQueries({ queryKey: ["tax-remittance", id] });
    },
  });
};

// ===== TAX CALCULATIONS =====

export const useCalculateTax = () => {
  return useMutation({
    mutationFn: async (data: CalculateTaxRequest) => {
      const response = await AxiosWithToken.post<FinanceApiResponse<TaxCalculationResult>>(
        'finance/tax-calculations/calculate/',
        data
      );
      return response.data;
    },
  });
};

// ===== TAX REPORTS =====

export const useGetTaxSummaryReport = (query?: TaxSummaryQuery) => {
  return useQuery<FinanceApiResponse<TaxSummaryReport>>({
    queryKey: ["tax-summary-report", query],
    queryFn: async () => {
      try {
        const params = new URLSearchParams();
        if (query?.period_from) params.append('period_from', query.period_from);
        if (query?.period_to) params.append('period_to', query.period_to);
        if (query?.tax_category) params.append('tax_category', query.tax_category);

        const response = await AxiosWithToken.get(`finance/tax-remittances/summary-report/?${params.toString()}`);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Failed to fetch tax summary report: " + (axiosError.response?.data as any)?.message);
      }
    },
    enabled: !!query?.period_from && !!query?.period_to,
    refetchOnWindowFocus: false,
  });
};

// ===== UTILITY HOOKS =====

export const useGetApplicableTaxTypes = (budgetLineId?: string) => {
  return useQuery<FinanceApiResponse<TaxType[]>>({
    queryKey: ["applicable-tax-types", budgetLineId],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(
          `finance/tax-types/applicable/?budget_line_id=${budgetLineId}`
        );
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Failed to fetch applicable tax types: " + (axiosError.response?.data as any)?.message);
      }
    },
    enabled: !!budgetLineId,
    refetchOnWindowFocus: false,
  });
};
