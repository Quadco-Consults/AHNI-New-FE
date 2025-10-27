import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import {
  Invoice,
  InvoiceFormData,
  InvoiceStats,
  InvoiceFilters,
  PaymentRecord,
  InvoiceEmailData,
  BulkInvoiceAction,
  RecurringInvoice,
  InvoiceTemplate
} from "../types/invoice.types";

// API endpoints
const INVOICES_ENDPOINT = "/invoices";

// Query keys
export const invoiceKeys = {
  all: ["invoices"] as const,
  lists: () => [...invoiceKeys.all, "list"] as const,
  list: (filters: any) => [...invoiceKeys.lists(), { filters }] as const,
  details: () => [...invoiceKeys.all, "detail"] as const,
  detail: (id: string) => [...invoiceKeys.details(), id] as const,
  stats: () => [...invoiceKeys.all, "stats"] as const,
  payments: (invoiceId: string) => [...invoiceKeys.all, "payments", invoiceId] as const,
  templates: () => [...invoiceKeys.all, "templates"] as const,
  recurring: () => [...invoiceKeys.all, "recurring"] as const,
};

// Types for API responses
interface InvoicesResponse {
  data: Invoice[];
  meta: {
    total: number;
    page: number;
    page_size: number;
    total_pages: number;
  };
}

interface InvoiceResponse {
  data: Invoice;
}

interface InvoiceStatsResponse {
  data: InvoiceStats;
}

interface PaymentRecordsResponse {
  data: PaymentRecord[];
}

interface InvoiceTemplatesResponse {
  data: InvoiceTemplate[];
}

interface RecurringInvoicesResponse {
  data: RecurringInvoice[];
}

// Fetch invoices with filters
export const useGetInvoices = (filters?: InvoiceFilters) => {
  return useQuery({
    queryKey: invoiceKeys.list(filters),
    queryFn: async (): Promise<InvoicesResponse> => {
      const params = new URLSearchParams();

      if (filters?.customer_id) params.append("customer_id", filters.customer_id);
      if (filters?.status?.length) params.append("status", filters.status.join(","));
      if (filters?.date_from) params.append("date_from", filters.date_from);
      if (filters?.date_to) params.append("date_to", filters.date_to);
      if (filters?.amount_min) params.append("amount_min", filters.amount_min.toString());
      if (filters?.amount_max) params.append("amount_max", filters.amount_max.toString());
      if (filters?.payment_terms) params.append("payment_terms", filters.payment_terms);
      if (filters?.search) params.append("search", filters.search);
      if (filters?.overdue_only) params.append("overdue_only", filters.overdue_only.toString());
      if (filters?.page) params.append("page", filters.page.toString());
      if (filters?.page_size) params.append("page_size", filters.page_size.toString());
      if (filters?.sort_by) params.append("sort_by", filters.sort_by);
      if (filters?.sort_order) params.append("sort_order", filters.sort_order);

      const response = await AxiosWithToken.get(`${INVOICES_ENDPOINT}?${params.toString()}`);
      return response.data;
    },
  });
};

// Fetch single invoice
export const useGetInvoice = (id: string) => {
  return useQuery({
    queryKey: invoiceKeys.detail(id),
    queryFn: async (): Promise<InvoiceResponse> => {
      const response = await AxiosWithToken.get(`${INVOICES_ENDPOINT}/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
};

// Fetch invoice statistics
export const useGetInvoiceStats = () => {
  return useQuery({
    queryKey: invoiceKeys.stats(),
    queryFn: async (): Promise<InvoiceStatsResponse> => {
      const response = await AxiosWithToken.get(`${INVOICES_ENDPOINT}/stats`);
      return response.data;
    },
  });
};

// Fetch payment records for an invoice
export const useGetInvoicePayments = (invoiceId: string) => {
  return useQuery({
    queryKey: invoiceKeys.payments(invoiceId),
    queryFn: async (): Promise<PaymentRecordsResponse> => {
      const response = await AxiosWithToken.get(`${INVOICES_ENDPOINT}/${invoiceId}/payments`);
      return response.data;
    },
    enabled: !!invoiceId,
  });
};

// Fetch invoice templates
export const useGetInvoiceTemplates = () => {
  return useQuery({
    queryKey: invoiceKeys.templates(),
    queryFn: async (): Promise<InvoiceTemplatesResponse> => {
      const response = await AxiosWithToken.get(`${INVOICES_ENDPOINT}/templates`);
      return response.data;
    },
  });
};

// Fetch recurring invoices
export const useGetRecurringInvoices = () => {
  return useQuery({
    queryKey: invoiceKeys.recurring(),
    queryFn: async (): Promise<RecurringInvoicesResponse> => {
      const response = await AxiosWithToken.get(`${INVOICES_ENDPOINT}/recurring`);
      return response.data;
    },
  });
};

// Create invoice
export const useCreateInvoice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: InvoiceFormData): Promise<InvoiceResponse> => {
      // Transform the data to match backend expectations
      const transformedData = {
        ...data,
        line_items: data.line_items.map(item => ({
          ...item,
          line_total: item.quantity * item.unit_price - (item.discount_amount || 0),
        })),
        // Calculate totals
        subtotal: data.line_items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0),
        total_amount: data.line_items.reduce((sum, item) => sum + (item.quantity * item.unit_price - (item.discount_amount || 0) + (item.tax_amount || 0)), 0),
      };

      const response = await AxiosWithToken.post(INVOICES_ENDPOINT, transformedData);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch invoices list
      queryClient.invalidateQueries({ queryKey: invoiceKeys.lists() });
      queryClient.invalidateQueries({ queryKey: invoiceKeys.stats() });
    },
  });
};

// Update invoice
export const useUpdateInvoice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: InvoiceFormData }): Promise<InvoiceResponse> => {
      // Transform the data to match backend expectations
      const transformedData = {
        ...data,
        line_items: data.line_items.map(item => ({
          ...item,
          line_total: item.quantity * item.unit_price - (item.discount_amount || 0),
        })),
        // Calculate totals
        subtotal: data.line_items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0),
        total_amount: data.line_items.reduce((sum, item) => sum + (item.quantity * item.unit_price - (item.discount_amount || 0) + (item.tax_amount || 0)), 0),
      };

      const response = await AxiosWithToken.put(`${INVOICES_ENDPOINT}/${id}`, transformedData);
      return response.data;
    },
    onSuccess: (_, { id }) => {
      // Invalidate and refetch invoices list and specific invoice
      queryClient.invalidateQueries({ queryKey: invoiceKeys.lists() });
      queryClient.invalidateQueries({ queryKey: invoiceKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: invoiceKeys.stats() });
    },
  });
};

// Delete invoice
export const useDeleteInvoice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      await AxiosWithToken.delete(`${INVOICES_ENDPOINT}/${id}`);
    },
    onSuccess: () => {
      // Invalidate and refetch invoices list
      queryClient.invalidateQueries({ queryKey: invoiceKeys.lists() });
      queryClient.invalidateQueries({ queryKey: invoiceKeys.stats() });
    },
  });
};

// Send invoice
export const useSendInvoice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, emailData }: { id: string; emailData?: InvoiceEmailData }): Promise<InvoiceResponse> => {
      const response = await AxiosWithToken.post(`${INVOICES_ENDPOINT}/${id}/send`, emailData || {});
      return response.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: invoiceKeys.lists() });
      queryClient.invalidateQueries({ queryKey: invoiceKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: invoiceKeys.stats() });
    },
  });
};

// Mark invoice as paid
export const useMarkInvoicePaid = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      paymentData
    }: {
      id: string;
      paymentData: {
        payment_date: string;
        amount: number;
        payment_method: string;
        reference_number?: string;
        notes?: string;
      };
    }): Promise<InvoiceResponse> => {
      const response = await AxiosWithToken.post(`${INVOICES_ENDPOINT}/${id}/mark-paid`, paymentData);
      return response.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: invoiceKeys.lists() });
      queryClient.invalidateQueries({ queryKey: invoiceKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: invoiceKeys.payments(id) });
      queryClient.invalidateQueries({ queryKey: invoiceKeys.stats() });
    },
  });
};

// Void invoice
export const useVoidInvoice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason?: string }): Promise<InvoiceResponse> => {
      const response = await AxiosWithToken.post(`${INVOICES_ENDPOINT}/${id}/void`, { reason });
      return response.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: invoiceKeys.lists() });
      queryClient.invalidateQueries({ queryKey: invoiceKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: invoiceKeys.stats() });
    },
  });
};

// Duplicate invoice
export const useDuplicateInvoice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<InvoiceResponse> => {
      const response = await AxiosWithToken.post(`${INVOICES_ENDPOINT}/${id}/duplicate`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: invoiceKeys.lists() });
      queryClient.invalidateQueries({ queryKey: invoiceKeys.stats() });
    },
  });
};

// Download invoice PDF
export const useDownloadInvoicePDF = () => {
  return useMutation({
    mutationFn: async (id: string): Promise<Blob> => {
      const response = await AxiosWithToken.get(`${INVOICES_ENDPOINT}/${id}/pdf`, {
        responseType: "blob",
      });
      return response.data;
    },
  });
};

// Bulk operations
export const useBulkInvoiceActions = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (action: BulkInvoiceAction): Promise<{ success: number; errors: string[] }> => {
      const response = await AxiosWithToken.post(`${INVOICES_ENDPOINT}/bulk-actions`, action);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: invoiceKeys.lists() });
      queryClient.invalidateQueries({ queryKey: invoiceKeys.stats() });
    },
  });
};

// Add payment to invoice
export const useAddInvoicePayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      invoiceId,
      paymentData
    }: {
      invoiceId: string;
      paymentData: {
        payment_date: string;
        amount: number;
        payment_method: string;
        reference_number?: string;
        notes?: string;
      };
    }): Promise<{ data: PaymentRecord }> => {
      const response = await AxiosWithToken.post(`${INVOICES_ENDPOINT}/${invoiceId}/payments`, paymentData);
      return response.data;
    },
    onSuccess: (_, { invoiceId }) => {
      queryClient.invalidateQueries({ queryKey: invoiceKeys.lists() });
      queryClient.invalidateQueries({ queryKey: invoiceKeys.detail(invoiceId) });
      queryClient.invalidateQueries({ queryKey: invoiceKeys.payments(invoiceId) });
      queryClient.invalidateQueries({ queryKey: invoiceKeys.stats() });
    },
  });
};

// Export invoices
export const useExportInvoices = () => {
  return useMutation({
    mutationFn: async (params: {
      format: "csv" | "xlsx" | "pdf";
      filters?: InvoiceFilters;
    }): Promise<Blob> => {
      const queryParams = new URLSearchParams();
      queryParams.append("format", params.format);

      if (params.filters?.customer_id) {
        queryParams.append("customer_id", params.filters.customer_id);
      }
      if (params.filters?.status?.length) {
        queryParams.append("status", params.filters.status.join(","));
      }
      if (params.filters?.date_from) {
        queryParams.append("date_from", params.filters.date_from);
      }
      if (params.filters?.date_to) {
        queryParams.append("date_to", params.filters.date_to);
      }

      const response = await AxiosWithToken.get(`${INVOICES_ENDPOINT}/export?${queryParams.toString()}`, {
        responseType: "blob",
      });

      return response.data;
    },
  });
};

// Create recurring invoice
export const useCreateRecurringInvoice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      template_invoice_id: string;
      customer_id: string;
      frequency: string;
      start_date: string;
      end_date?: string;
    }): Promise<{ data: RecurringInvoice }> => {
      const response = await AxiosWithToken.post(`${INVOICES_ENDPOINT}/recurring`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: invoiceKeys.recurring() });
    },
  });
};

// Update invoice template
export const useUpdateInvoiceTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<InvoiceTemplate> }): Promise<{ data: InvoiceTemplate }> => {
      const response = await AxiosWithToken.put(`${INVOICES_ENDPOINT}/templates/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: invoiceKeys.templates() });
    },
  });
};

// Search invoices (for autocomplete)
export const useSearchInvoices = (query: string) => {
  return useQuery({
    queryKey: [...invoiceKeys.all, "search", query],
    queryFn: async (): Promise<{ data: Invoice[] }> => {
      if (!query || query.length < 2) {
        return { data: [] };
      }

      const response = await AxiosWithToken.get(`${INVOICES_ENDPOINT}/search`, {
        params: { q: query, limit: 10 },
      });
      return response.data;
    },
    enabled: query.length >= 2,
  });
};