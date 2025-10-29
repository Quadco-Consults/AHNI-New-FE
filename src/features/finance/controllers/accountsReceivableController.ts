import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import {
  AccountsReceivable,
  ARSummary,
  ARFilters,
  ARPayment,
  PaymentFormData,
  CollectionActivity,
  CollectionActivityFormData,
  WriteOffData,
  CreditMemo,
  ARStatement,
  PaymentPlan,
  DunningLetter
} from "../types/accounts-receivable.types";

// API endpoints
const AR_ENDPOINT = "/accounts-receivable";

// Query keys
export const arKeys = {
  all: ["accounts-receivable"] as const,
  lists: () => [...arKeys.all, "list"] as const,
  list: (filters: any) => [...arKeys.lists(), { filters }] as const,
  details: () => [...arKeys.all, "detail"] as const,
  detail: (id: string) => [...arKeys.details(), id] as const,
  summary: () => [...arKeys.all, "summary"] as const,
  payments: (id: string) => [...arKeys.all, "payments", id] as const,
  collections: () => [...arKeys.all, "collections"] as const,
  statements: () => [...arKeys.all, "statements"] as const,
  aging: () => [...arKeys.all, "aging"] as const,
  creditMemos: () => [...arKeys.all, "credit-memos"] as const,
  paymentPlans: () => [...arKeys.all, "payment-plans"] as const,
  dunningLetters: () => [...arKeys.all, "dunning-letters"] as const,
};

// Types for API responses
interface ARResponse {
  data: AccountsReceivable[];
  meta: {
    total: number;
    page: number;
    page_size: number;
    total_pages: number;
  };
}

interface ARSummaryResponse {
  data: ARSummary;
}

interface ARPaymentResponse {
  data: ARPayment[];
}

interface CollectionActivitiesResponse {
  data: CollectionActivity[];
}

interface ARStatementsResponse {
  data: ARStatement[];
}

interface CreditMemoResponse {
  data: CreditMemo[];
}

interface PaymentPlansResponse {
  data: PaymentPlan[];
}

interface DunningLettersResponse {
  data: DunningLetter[];
}

// Fetch accounts receivable with filters
export const useGetAccountsReceivable = (filters?: ARFilters) => {
  return useQuery({
    queryKey: arKeys.list(filters),
    queryFn: async (): Promise<ARResponse> => {
      const params = new URLSearchParams();

      if (filters?.customer_id) params.append("customer_id", filters.customer_id);
      if (filters?.status?.length) params.append("status", filters.status.join(","));
      if (filters?.aging_bucket?.length) params.append("aging_bucket", filters.aging_bucket.join(","));
      if (filters?.collection_status?.length) params.append("collection_status", filters.collection_status.join(","));
      if (filters?.date_from) params.append("date_from", filters.date_from);
      if (filters?.date_to) params.append("date_to", filters.date_to);
      if (filters?.amount_min) params.append("amount_min", filters.amount_min.toString());
      if (filters?.amount_max) params.append("amount_max", filters.amount_max.toString());
      if (filters?.overdue_only) params.append("overdue_only", filters.overdue_only.toString());
      if (filters?.assigned_collector) params.append("assigned_collector", filters.assigned_collector);
      if (filters?.search) params.append("search", filters.search);
      if (filters?.page) params.append("page", filters.page.toString());
      if (filters?.page_size) params.append("page_size", filters.page_size.toString());
      if (filters?.sort_by) params.append("sort_by", filters.sort_by);
      if (filters?.sort_order) params.append("sort_order", filters.sort_order);

      const response = await AxiosWithToken.get(`${AR_ENDPOINT}?${params.toString()}`);
      return response.data;
    },
  });
};

// Fetch single AR record
export const useGetARRecord = (id: string) => {
  return useQuery({
    queryKey: arKeys.detail(id),
    queryFn: async (): Promise<{ data: AccountsReceivable }> => {
      const response = await AxiosWithToken.get(`${AR_ENDPOINT}/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
};

// Fetch AR summary statistics
export const useGetARSummary = () => {
  return useQuery({
    queryKey: arKeys.summary(),
    queryFn: async (): Promise<ARSummaryResponse> => {
      const response = await AxiosWithToken.get(`${AR_ENDPOINT}/summary`);
      return response.data;
    },
  });
};

// Fetch payments for an AR record
export const useGetARPayments = (arId: string) => {
  return useQuery({
    queryKey: arKeys.payments(arId),
    queryFn: async (): Promise<ARPaymentResponse> => {
      const response = await AxiosWithToken.get(`${AR_ENDPOINT}/${arId}/payments`);
      return response.data;
    },
    enabled: !!arId,
  });
};

// Fetch collection activities
export const useGetCollectionActivities = (customerId?: string) => {
  return useQuery({
    queryKey: [...arKeys.collections(), customerId],
    queryFn: async (): Promise<CollectionActivitiesResponse> => {
      const params = customerId ? `?customer_id=${customerId}` : '';
      const response = await AxiosWithToken.get(`${AR_ENDPOINT}/collection-activities${params}`);
      return response.data;
    },
  });
};

// Fetch AR statements
export const useGetARStatements = (customerId?: string) => {
  return useQuery({
    queryKey: [...arKeys.statements(), customerId],
    queryFn: async (): Promise<ARStatementsResponse> => {
      const params = customerId ? `?customer_id=${customerId}` : '';
      const response = await AxiosWithToken.get(`${AR_ENDPOINT}/statements${params}`);
      return response.data;
    },
  });
};

// Fetch aging report
export const useGetAgingReport = () => {
  return useQuery({
    queryKey: arKeys.aging(),
    queryFn: async (): Promise<any> => {
      const response = await AxiosWithToken.get(`${AR_ENDPOINT}/aging-report`);
      return response.data;
    },
  });
};

// Fetch credit memos
export const useGetCreditMemos = (customerId?: string) => {
  return useQuery({
    queryKey: [...arKeys.creditMemos(), customerId],
    queryFn: async (): Promise<CreditMemoResponse> => {
      const params = customerId ? `?customer_id=${customerId}` : '';
      const response = await AxiosWithToken.get(`${AR_ENDPOINT}/credit-memos${params}`);
      return response.data;
    },
  });
};

// Fetch payment plans
export const useGetPaymentPlans = (customerId?: string) => {
  return useQuery({
    queryKey: [...arKeys.paymentPlans(), customerId],
    queryFn: async (): Promise<PaymentPlansResponse> => {
      const params = customerId ? `?customer_id=${customerId}` : '';
      const response = await AxiosWithToken.get(`${AR_ENDPOINT}/payment-plans${params}`);
      return response.data;
    },
  });
};

// Fetch dunning letters
export const useGetDunningLetters = (customerId?: string) => {
  return useQuery({
    queryKey: [...arKeys.dunningLetters(), customerId],
    queryFn: async (): Promise<DunningLettersResponse> => {
      const params = customerId ? `?customer_id=${customerId}` : '';
      const response = await AxiosWithToken.get(`${AR_ENDPOINT}/dunning-letters${params}`);
      return response.data;
    },
  });
};

// Record payment
export const useRecordPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: PaymentFormData): Promise<{ data: ARPayment }> => {
      const response = await AxiosWithToken.post(`${AR_ENDPOINT}/payments`, data);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch relevant queries
      queryClient.invalidateQueries({ queryKey: arKeys.lists() });
      queryClient.invalidateQueries({ queryKey: arKeys.summary() });
      queryClient.invalidateQueries({ queryKey: arKeys.aging() });
    },
  });
};

// Add collection activity
export const useAddCollectionActivity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CollectionActivityFormData): Promise<{ data: CollectionActivity }> => {
      const response = await AxiosWithToken.post(`${AR_ENDPOINT}/collection-activities`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: arKeys.collections() });
      queryClient.invalidateQueries({ queryKey: arKeys.lists() });
    },
  });
};

// Update collection status
export const useUpdateCollectionStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      arId,
      status,
      notes
    }: {
      arId: string;
      status: string;
      notes?: string;
    }): Promise<{ data: AccountsReceivable }> => {
      const response = await AxiosWithToken.patch(`${AR_ENDPOINT}/${arId}/collection-status`, {
        collection_status: status,
        collection_notes: notes,
      });
      return response.data;
    },
    onSuccess: (_, { arId }) => {
      queryClient.invalidateQueries({ queryKey: arKeys.lists() });
      queryClient.invalidateQueries({ queryKey: arKeys.detail(arId) });
      queryClient.invalidateQueries({ queryKey: arKeys.summary() });
    },
  });
};

// Write off AR
export const useWriteOffAR = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: WriteOffData): Promise<{ data: AccountsReceivable }> => {
      const response = await AxiosWithToken.post(`${AR_ENDPOINT}/${data.ar_id}/write-off`, data);
      return response.data;
    },
    onSuccess: (_, data) => {
      queryClient.invalidateQueries({ queryKey: arKeys.lists() });
      queryClient.invalidateQueries({ queryKey: arKeys.detail(data.ar_id) });
      queryClient.invalidateQueries({ queryKey: arKeys.summary() });
      queryClient.invalidateQueries({ queryKey: arKeys.aging() });
    },
  });
};

// Send reminder/dunning letter
export const useSendReminder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      arId,
      template,
      method,
      customMessage
    }: {
      arId: string;
      template: string;
      method: 'EMAIL' | 'MAIL' | 'FAX';
      customMessage?: string;
    }): Promise<{ data: DunningLetter }> => {
      const response = await AxiosWithToken.post(`${AR_ENDPOINT}/${arId}/send-reminder`, {
        template_type: template,
        delivery_method: method,
        custom_message: customMessage,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: arKeys.dunningLetters() });
      queryClient.invalidateQueries({ queryKey: arKeys.collections() });
    },
  });
};

// Create credit memo
export const useCreateCreditMemo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      customer_id: string;
      invoice_id?: string;
      credit_amount: number;
      reason: string;
      description: string;
      line_items: Array<{
        description: string;
        quantity: number;
        unit_price: number;
        line_total: number;
        reason?: string;
      }>;
    }): Promise<{ data: CreditMemo }> => {
      const response = await AxiosWithToken.post(`${AR_ENDPOINT}/credit-memos`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: arKeys.creditMemos() });
      queryClient.invalidateQueries({ queryKey: arKeys.lists() });
      queryClient.invalidateQueries({ queryKey: arKeys.summary() });
    },
  });
};

// Apply credit memo
export const useApplyCreditMemo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      creditMemoId,
      arId,
      amount
    }: {
      creditMemoId: string;
      arId: string;
      amount: number;
    }): Promise<{ data: CreditMemo }> => {
      const response = await AxiosWithToken.post(`${AR_ENDPOINT}/credit-memos/${creditMemoId}/apply`, {
        ar_id: arId,
        amount,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: arKeys.creditMemos() });
      queryClient.invalidateQueries({ queryKey: arKeys.lists() });
      queryClient.invalidateQueries({ queryKey: arKeys.summary() });
    },
  });
};

// Create payment plan
export const useCreatePaymentPlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      customer_id: string;
      ar_id: string;
      total_amount: number;
      down_payment?: number;
      installment_amount: number;
      number_of_installments: number;
      frequency: string;
      start_date: string;
      interest_rate?: number;
      late_fee_amount?: number;
      grace_period_days?: number;
    }): Promise<{ data: PaymentPlan }> => {
      const response = await AxiosWithToken.post(`${AR_ENDPOINT}/payment-plans`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: arKeys.paymentPlans() });
      queryClient.invalidateQueries({ queryKey: arKeys.lists() });
    },
  });
};

// Generate AR statement
export const useGenerateStatement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      customerId,
      statementDate,
      periodStart,
      periodEnd,
      emailToCustomer,
      includeDetails
    }: {
      customerId: string;
      statementDate: string;
      periodStart: string;
      periodEnd: string;
      emailToCustomer: boolean;
      includeDetails: boolean;
    }): Promise<{ data: ARStatement }> => {
      const response = await AxiosWithToken.post(`${AR_ENDPOINT}/statements`, {
        customer_id: customerId,
        statement_date: statementDate,
        statement_period_start: periodStart,
        statement_period_end: periodEnd,
        email_to_customer: emailToCustomer,
        include_details: includeDetails,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: arKeys.statements() });
    },
  });
};

// Bulk operations
export const useBulkAROperations = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      action,
      arIds,
      data
    }: {
      action: 'send_reminder' | 'update_status' | 'assign_collector' | 'write_off';
      arIds: string[];
      data?: any;
    }): Promise<{ success: number; errors: string[] }> => {
      const response = await AxiosWithToken.post(`${AR_ENDPOINT}/bulk-operations`, {
        action,
        ar_ids: arIds,
        data,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: arKeys.lists() });
      queryClient.invalidateQueries({ queryKey: arKeys.summary() });
    },
  });
};

// Export AR data
export const useExportARData = () => {
  return useMutation({
    mutationFn: async (params: {
      format: "csv" | "xlsx";
      filters?: ARFilters;
      includePayments?: boolean;
      includeActivities?: boolean;
    }): Promise<Blob> => {
      const queryParams = new URLSearchParams();
      queryParams.append("format", params.format);

      if (params.includePayments) queryParams.append("include_payments", "true");
      if (params.includeActivities) queryParams.append("include_activities", "true");

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

      const response = await AxiosWithToken.get(`${AR_ENDPOINT}/export?${queryParams.toString()}`, {
        responseType: "blob",
      });

      return response.data;
    },
  });
};

// Search AR records (for autocomplete)
export const useSearchARRecords = (query: string) => {
  return useQuery({
    queryKey: [...arKeys.all, "search", query],
    queryFn: async (): Promise<{ data: AccountsReceivable[] }> => {
      if (!query || query.length < 2) {
        return { data: [] };
      }

      const response = await AxiosWithToken.get(`${AR_ENDPOINT}/search`, {
        params: { q: query, limit: 10 },
      });
      return response.data;
    },
    enabled: query.length >= 2,
  });
};