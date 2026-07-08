/**
 * Accounts Receivable Controller
 * React Query hooks for AR operations, customer management, invoicing, and collections
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/constants/api_management/MyHttpHelperWithToken";
import { toast } from "sonner";
import type {
  AccountsReceivable,
  ARFilters,
  ARListResponse,
  ARDetailResponse,
  ARSummaryResponse,
  CustomerPayment,
  PaymentListResponse,
  PaymentDetailResponse,
  CollectionActivity,
  CollectionActivityListResponse,
  DunningLetter,
  DunningLetterListResponse,
  CreditMemo,
  CreditMemoListResponse,
  PaymentPlan,
  PaymentPlanListResponse,
  RecordPaymentInput,
  UpdateCollectionStatusInput,
  WriteOffInput,
  SendReminderInput,
  CreateCollectionActivityInput,
  CreateCreditMemoInput,
  CreatePaymentPlanInput,
  PaymentFilters,
} from "../types/accounts-receivable.types";

// ==================== API URLs ====================

const ACCOUNTS_RECEIVABLE_URL = "/finance/accounts-receivable";
const CUSTOMER_PAYMENTS_URL = "/finance/customer-payments";
const COLLECTION_ACTIVITIES_URL = "/finance/collection-activities";
const DUNNING_LETTERS_URL = "/finance/dunning-letters";
const CREDIT_MEMOS_URL = "/finance/credit-memos";
const PAYMENT_PLANS_URL = "/finance/payment-plans";

// ==================== Query Keys ====================

export const accountsReceivableKeys = {
  all: ["accounts-receivable"] as const,
  lists: () => [...accountsReceivableKeys.all, "list"] as const,
  list: (filters: ARFilters) =>
    [...accountsReceivableKeys.lists(), filters] as const,
  details: () => [...accountsReceivableKeys.all, "detail"] as const,
  detail: (id: string) => [...accountsReceivableKeys.details(), id] as const,
  summary: () => [...accountsReceivableKeys.all, "summary"] as const,
};

export const customerPaymentKeys = {
  all: ["customer-payments"] as const,
  lists: () => [...customerPaymentKeys.all, "list"] as const,
  list: (filters: PaymentFilters) =>
    [...customerPaymentKeys.lists(), filters] as const,
  details: () => [...customerPaymentKeys.all, "detail"] as const,
  detail: (id: string) => [...customerPaymentKeys.details(), id] as const,
};

export const collectionActivityKeys = {
  all: ["collection-activities"] as const,
  lists: () => [...collectionActivityKeys.all, "list"] as const,
  list: (arId?: string) => [...collectionActivityKeys.lists(), arId] as const,
};

export const dunningLetterKeys = {
  all: ["dunning-letters"] as const,
  lists: () => [...dunningLetterKeys.all, "list"] as const,
  list: (arId?: string) => [...dunningLetterKeys.lists(), arId] as const,
};

export const creditMemoKeys = {
  all: ["credit-memos"] as const,
  lists: () => [...creditMemoKeys.all, "list"] as const,
  list: (customerId?: string) => [...creditMemoKeys.lists(), customerId] as const,
};

export const paymentPlanKeys = {
  all: ["payment-plans"] as const,
  lists: () => [...paymentPlanKeys.all, "list"] as const,
  list: (arId?: string) => [...paymentPlanKeys.lists(), arId] as const,
};

// ==================== Accounts Receivable Hooks ====================

/**
 * Get list of accounts receivable with filters
 */
export const useGetAccountsReceivable = (filters: ARFilters = {}) => {
  return useQuery<ARListResponse>({
    queryKey: accountsReceivableKeys.list(filters),
    queryFn: async () => {
      const params = new URLSearchParams();

      if (filters.customer_id) params.append("customer_id", filters.customer_id);
      if (filters.status && filters.status !== "all")
        params.append("status", filters.status);
      if (filters.aging_bucket && filters.aging_bucket !== "all")
        params.append("aging_bucket", filters.aging_bucket);
      if (filters.collection_status && filters.collection_status !== "all")
        params.append("collection_status", filters.collection_status);
      if (filters.date_from) params.append("date_from", filters.date_from);
      if (filters.date_to) params.append("date_to", filters.date_to);
      if (filters.amount_min) params.append("amount_min", filters.amount_min);
      if (filters.amount_max) params.append("amount_max", filters.amount_max);
      if (filters.overdue_only) params.append("overdue_only", "true");
      if (filters.assigned_collector)
        params.append("assigned_collector", filters.assigned_collector);
      if (filters.search) params.append("search", filters.search);
      if (filters.sort_by) params.append("sort_by", filters.sort_by);
      if (filters.sort_order) params.append("sort_order", filters.sort_order);
      if (filters.page) params.append("page", filters.page.toString());
      if (filters.page_size)
        params.append("page_size", filters.page_size.toString());

      const response = await axiosInstance.get(
        `${ACCOUNTS_RECEIVABLE_URL}/?${params}`
      );
      return response.data;
    },
  });
};

/**
 * Get single AR record by ID
 */
export const useGetAccountsReceivableById = (id: string) => {
  return useQuery<ARDetailResponse>({
    queryKey: accountsReceivableKeys.detail(id),
    queryFn: async () => {
      const response = await axiosInstance.get(
        `${ACCOUNTS_RECEIVABLE_URL}/${id}/`
      );
      return response.data;
    },
    enabled: !!id,
  });
};

/**
 * Get AR summary statistics
 */
export const useGetARSummary = (filters: ARFilters = {}) => {
  return useQuery<ARSummaryResponse>({
    queryKey: accountsReceivableKeys.summary(),
    queryFn: async () => {
      const params = new URLSearchParams();

      if (filters.customer_id) params.append("customer_id", filters.customer_id);
      if (filters.status && filters.status !== "all")
        params.append("status", filters.status);
      if (filters.date_from) params.append("date_from", filters.date_from);
      if (filters.date_to) params.append("date_to", filters.date_to);

      const response = await axiosInstance.get(
        `${ACCOUNTS_RECEIVABLE_URL}/summary/?${params}`
      );
      return response.data;
    },
  });
};

/**
 * Record payment against AR
 */
export const useRecordPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      arId,
      data,
    }: {
      arId: string;
      data: RecordPaymentInput;
    }) => {
      const response = await axiosInstance.post(
        `${ACCOUNTS_RECEIVABLE_URL}/${arId}/record_payment/`,
        data
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: accountsReceivableKeys.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: accountsReceivableKeys.summary(),
      });
      queryClient.invalidateQueries({
        queryKey: customerPaymentKeys.lists(),
      });
      toast.success("Payment recorded successfully");
    },
    onError: () => {
      toast.error("Failed to record payment");
    },
  });
};

/**
 * Update collection status
 */
export const useUpdateCollectionStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      arId,
      data,
    }: {
      arId: string;
      data: UpdateCollectionStatusInput;
    }) => {
      const response = await axiosInstance.patch(
        `${ACCOUNTS_RECEIVABLE_URL}/${arId}/update_collection_status/`,
        data
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: accountsReceivableKeys.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: accountsReceivableKeys.detail(variables.arId),
      });
      toast.success("Collection status updated successfully");
    },
    onError: () => {
      toast.error("Failed to update collection status");
    },
  });
};

/**
 * Write off AR
 */
export const useWriteOffAR = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ arId, data }: { arId: string; data: WriteOffInput }) => {
      const response = await axiosInstance.post(
        `${ACCOUNTS_RECEIVABLE_URL}/${arId}/write_off/`,
        data
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: accountsReceivableKeys.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: accountsReceivableKeys.summary(),
      });
      toast.success("AR written off successfully");
    },
    onError: () => {
      toast.error("Failed to write off AR");
    },
  });
};

/**
 * Send payment reminder
 */
export const useSendReminder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      arId,
      data,
    }: {
      arId: string;
      data: SendReminderInput;
    }) => {
      const response = await axiosInstance.post(
        `${ACCOUNTS_RECEIVABLE_URL}/${arId}/send_reminder/`,
        data
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: accountsReceivableKeys.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: dunningLetterKeys.lists(),
      });
      toast.success("Payment reminder sent successfully");
    },
    onError: () => {
      toast.error("Failed to send payment reminder");
    },
  });
};

// ==================== Customer Payment Hooks ====================

/**
 * Get list of customer payments
 */
export const useGetCustomerPayments = (filters: PaymentFilters = {}) => {
  return useQuery<PaymentListResponse>({
    queryKey: customerPaymentKeys.list(filters),
    queryFn: async () => {
      const params = new URLSearchParams();

      if (filters.customer_id)
        params.append("customer_id", filters.customer_id);
      if (filters.invoice_id) params.append("invoice_id", filters.invoice_id);
      if (filters.payment_method && filters.payment_method !== "all")
        params.append("payment_method", filters.payment_method);
      if (filters.date_from) params.append("date_from", filters.date_from);
      if (filters.date_to) params.append("date_to", filters.date_to);
      if (filters.page) params.append("page", filters.page.toString());
      if (filters.page_size)
        params.append("page_size", filters.page_size.toString());

      const response = await axiosInstance.get(
        `${CUSTOMER_PAYMENTS_URL}/?${params}`
      );
      return response.data;
    },
  });
};

/**
 * Get single customer payment by ID
 */
export const useGetCustomerPaymentById = (id: string) => {
  return useQuery<PaymentDetailResponse>({
    queryKey: customerPaymentKeys.detail(id),
    queryFn: async () => {
      const response = await axiosInstance.get(
        `${CUSTOMER_PAYMENTS_URL}/${id}/`
      );
      return response.data;
    },
    enabled: !!id,
  });
};

// ==================== Collection Activity Hooks ====================

/**
 * Get collection activities
 */
export const useGetCollectionActivities = (arId?: string) => {
  return useQuery<CollectionActivityListResponse>({
    queryKey: collectionActivityKeys.list(arId),
    queryFn: async () => {
      const params = new URLSearchParams();
      if (arId) params.append("ar_id", arId);

      const response = await axiosInstance.get(
        `${COLLECTION_ACTIVITIES_URL}/?${params}`
      );
      return response.data;
    },
  });
};

/**
 * Create collection activity
 */
export const useCreateCollectionActivity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateCollectionActivityInput) => {
      const response = await axiosInstance.post(
        `${COLLECTION_ACTIVITIES_URL}/`,
        data
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: collectionActivityKeys.lists(),
      });
      toast.success("Collection activity recorded successfully");
    },
    onError: () => {
      toast.error("Failed to record collection activity");
    },
  });
};

// ==================== Dunning Letter Hooks ====================

/**
 * Get dunning letters
 */
export const useGetDunningLetters = (arId?: string) => {
  return useQuery<DunningLetterListResponse>({
    queryKey: dunningLetterKeys.list(arId),
    queryFn: async () => {
      const params = new URLSearchParams();
      if (arId) params.append("ar_id", arId);

      const response = await axiosInstance.get(
        `${DUNNING_LETTERS_URL}/?${params}`
      );
      return response.data;
    },
  });
};

// ==================== Credit Memo Hooks ====================

/**
 * Get credit memos
 */
export const useGetCreditMemos = (customerId?: string) => {
  return useQuery<CreditMemoListResponse>({
    queryKey: creditMemoKeys.list(customerId),
    queryFn: async () => {
      const params = new URLSearchParams();
      if (customerId) params.append("customer_id", customerId);

      const response = await axiosInstance.get(
        `${CREDIT_MEMOS_URL}/?${params}`
      );
      return response.data;
    },
  });
};

/**
 * Create credit memo
 */
export const useCreateCreditMemo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateCreditMemoInput) => {
      const response = await axiosInstance.post(`${CREDIT_MEMOS_URL}/`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: creditMemoKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: accountsReceivableKeys.lists(),
      });
      toast.success("Credit memo created successfully");
    },
    onError: () => {
      toast.error("Failed to create credit memo");
    },
  });
};

// ==================== Payment Plan Hooks ====================

/**
 * Get payment plans
 */
export const useGetPaymentPlans = (arId?: string) => {
  return useQuery<PaymentPlanListResponse>({
    queryKey: paymentPlanKeys.list(arId),
    queryFn: async () => {
      const params = new URLSearchParams();
      if (arId) params.append("ar_id", arId);

      const response = await axiosInstance.get(`${PAYMENT_PLANS_URL}/?${params}`);
      return response.data;
    },
  });
};

/**
 * Create payment plan
 */
export const useCreatePaymentPlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreatePaymentPlanInput) => {
      const response = await axiosInstance.post(`${PAYMENT_PLANS_URL}/`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: paymentPlanKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: accountsReceivableKeys.lists(),
      });
      toast.success("Payment plan created successfully");
    },
    onError: () => {
      toast.error("Failed to create payment plan");
    },
  });
};

/**
 * Update payment plan
 */
export const useUpdatePaymentPlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<CreatePaymentPlanInput>;
    }) => {
      const response = await axiosInstance.patch(
        `${PAYMENT_PLANS_URL}/${id}/`,
        data
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: paymentPlanKeys.lists() });
      toast.success("Payment plan updated successfully");
    },
    onError: () => {
      toast.error("Failed to update payment plan");
    },
  });
};

/**
 * Delete payment plan
 */
export const useDeletePaymentPlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await axiosInstance.delete(`${PAYMENT_PLANS_URL}/${id}/`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: paymentPlanKeys.lists() });
      toast.success("Payment plan deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete payment plan");
    },
  });
};
