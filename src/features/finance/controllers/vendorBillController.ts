/**
 * Vendor Bill Controller
 * React Query hooks for Accounts Payable - Vendor Bills, Payments, and Expense Reports
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/constants/api_management/MyHttpHelperWithToken";
import { toast } from "sonner";
import {
  VendorBill,
  VendorBillFilters,
  VendorBillListResponse,
  VendorBillDetailResponse,
  VendorPayment,
  VendorPaymentFilters,
  VendorPaymentListResponse,
  ExpenseReport,
  ExpenseReportFilters,
  ExpenseReportListResponse,
  VendorBillStats,
  CreateVendorBillInput,
  UpdateVendorBillInput,
  CreateVendorPaymentInput,
  UpdateVendorPaymentInput,
  CreateExpenseReportInput,
  UpdateExpenseReportInput,
  SubmitBillForApprovalInput,
  ApproveBillInput,
  RejectBillInput,
  VoidBillInput,
} from "../types/accounts-payable.types";

// ==================== API Base URLs ====================

const VENDOR_BILLS_URL = "/finance/vendor-bills";
const VENDOR_PAYMENTS_URL = "/finance/vendor-payments";
const EXPENSE_REPORTS_URL = "/finance/expense-reports";

// ==================== Query Keys ====================

export const vendorBillKeys = {
  all: ["vendor-bills"] as const,
  lists: () => [...vendorBillKeys.all, "list"] as const,
  list: (filters: VendorBillFilters) => [...vendorBillKeys.lists(), { filters }] as const,
  details: () => [...vendorBillKeys.all, "detail"] as const,
  detail: (id: string) => [...vendorBillKeys.details(), id] as const,
  stats: () => [...vendorBillKeys.all, "stats"] as const,
};

export const vendorPaymentKeys = {
  all: ["vendor-payments"] as const,
  lists: () => [...vendorPaymentKeys.all, "list"] as const,
  list: (filters: VendorPaymentFilters) => [...vendorPaymentKeys.lists(), { filters }] as const,
  details: () => [...vendorPaymentKeys.all, "detail"] as const,
  detail: (id: string) => [...vendorPaymentKeys.details(), id] as const,
};

export const expenseReportKeys = {
  all: ["expense-reports"] as const,
  lists: () => [...expenseReportKeys.all, "list"] as const,
  list: (filters: ExpenseReportFilters) => [...expenseReportKeys.lists(), { filters }] as const,
  details: () => [...expenseReportKeys.all, "detail"] as const,
  detail: (id: string) => [...expenseReportKeys.details(), id] as const,
};

// ==================== Vendor Bills Queries ====================

/**
 * Get list of vendor bills with optional filters
 */
export const useGetVendorBills = (filters: VendorBillFilters = {}) => {
  return useQuery<VendorBillListResponse>({
    queryKey: vendorBillKeys.list(filters),
    queryFn: async () => {
      const params = new URLSearchParams();

      if (filters.status && filters.status !== "all") params.append("status", filters.status);
      if (filters.vendor) params.append("vendor_id", filters.vendor);
      if (filters.project) params.append("project_id", filters.project);
      if (filters.purchase_order) params.append("purchase_order_id", filters.purchase_order);
      if (filters.date_from) params.append("date_from", filters.date_from);
      if (filters.date_to) params.append("date_to", filters.date_to);
      if (filters.due_date_from) params.append("due_date_from", filters.due_date_from);
      if (filters.due_date_to) params.append("due_date_to", filters.due_date_to);
      if (filters.overdue_only !== undefined) params.append("overdue_only", filters.overdue_only.toString());
      if (filters.has_recovery_invoice !== undefined) params.append("has_recovery_invoice", filters.has_recovery_invoice.toString());
      if (filters.search) params.append("search", filters.search);
      if (filters.page) params.append("page", filters.page.toString());
      if (filters.page_size) params.append("page_size", filters.page_size.toString());
      if (filters.sort_by) params.append("sort_by", filters.sort_by);
      if (filters.sort_order) params.append("sort_order", filters.sort_order);

      const response = await axiosInstance.get(`${VENDOR_BILLS_URL}/?${params.toString()}`);
      return response.data;
    },
  });
};

/**
 * Get single vendor bill details
 */
export const useGetVendorBill = (id: string) => {
  return useQuery<VendorBillDetailResponse>({
    queryKey: vendorBillKeys.detail(id),
    queryFn: async () => {
      const response = await axiosInstance.get(`${VENDOR_BILLS_URL}/${id}/`);
      return response.data;
    },
    enabled: !!id,
  });
};

/**
 * Get vendor bill statistics
 */
export const useGetVendorBillStats = () => {
  return useQuery<{ data: VendorBillStats }>({
    queryKey: vendorBillKeys.stats(),
    queryFn: async () => {
      const response = await axiosInstance.get(`${VENDOR_BILLS_URL}/stats/`);
      return response.data;
    },
  });
};

// ==================== Vendor Bills Mutations ====================

/**
 * Create a new vendor bill
 * NOTE: This endpoint may not be implemented in backend yet - using expense recovery endpoint
 */
export const useCreateVendorBill = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateVendorBillInput) => {
      const formData = new FormData();

      // Append basic fields
      formData.append("vendor", data.vendor);
      formData.append("bill_date", data.bill_date);
      formData.append("due_date", data.due_date);

      if (data.purchase_order) formData.append("purchase_order", data.purchase_order);
      if (data.project) formData.append("project", data.project);
      if (data.vendor_invoice_number) formData.append("vendor_invoice_number", data.vendor_invoice_number);
      if (data.description) formData.append("description", data.description);
      if (data.payment_terms) formData.append("payment_terms", data.payment_terms);
      if (data.notes) formData.append("notes", data.notes);
      if (data.tax_rate) formData.append("tax_rate", data.tax_rate);

      // Append files
      if (data.vendor_invoice_document) formData.append("vendor_invoice_document", data.vendor_invoice_document);
      if (data.receipt_document) formData.append("receipt_document", data.receipt_document);

      // Append lines as JSON
      formData.append("lines", JSON.stringify(data.lines));

      const response = await axiosInstance.post(`${VENDOR_BILLS_URL}/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vendorBillKeys.lists() });
      queryClient.invalidateQueries({ queryKey: vendorBillKeys.stats() });
      toast.success("Vendor bill created successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create vendor bill");
    },
  });
};

/**
 * Update a vendor bill
 */
export const useUpdateVendorBill = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateVendorBillInput) => {
      const { id, ...updateData } = data;
      const formData = new FormData();

      Object.entries(updateData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (key === "lines") {
            formData.append(key, JSON.stringify(value));
          } else if (value instanceof File) {
            formData.append(key, value);
          } else {
            formData.append(key, value.toString());
          }
        }
      });

      const response = await axiosInstance.patch(`${VENDOR_BILLS_URL}/${id}/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: vendorBillKeys.lists() });
      queryClient.invalidateQueries({ queryKey: vendorBillKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: vendorBillKeys.stats() });
      toast.success("Vendor bill updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update vendor bill");
    },
  });
};

/**
 * Delete a vendor bill
 */
export const useDeleteVendorBill = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await axiosInstance.delete(`${VENDOR_BILLS_URL}/${id}/`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vendorBillKeys.lists() });
      queryClient.invalidateQueries({ queryKey: vendorBillKeys.stats() });
      toast.success("Vendor bill deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete vendor bill");
    },
  });
};

/**
 * Submit vendor bill for approval
 */
export const useSubmitVendorBill = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: SubmitBillForApprovalInput) => {
      const response = await axiosInstance.post(`${VENDOR_BILLS_URL}/${data.id}/submit/`);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: vendorBillKeys.lists() });
      queryClient.invalidateQueries({ queryKey: vendorBillKeys.detail(variables.id) });
      toast.success("Bill submitted for approval");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to submit bill");
    },
  });
};

/**
 * Approve vendor bill
 */
export const useApproveVendorBill = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ApproveBillInput) => {
      const response = await axiosInstance.post(`${VENDOR_BILLS_URL}/${data.id}/approve/`, {
        approval_notes: data.approval_notes,
      });
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: vendorBillKeys.lists() });
      queryClient.invalidateQueries({ queryKey: vendorBillKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: vendorBillKeys.stats() });
      toast.success("Bill approved successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to approve bill");
    },
  });
};

/**
 * Reject vendor bill
 */
export const useRejectVendorBill = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: RejectBillInput) => {
      const response = await axiosInstance.post(`${VENDOR_BILLS_URL}/${data.id}/reject/`, {
        rejection_notes: data.rejection_notes,
      });
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: vendorBillKeys.lists() });
      queryClient.invalidateQueries({ queryKey: vendorBillKeys.detail(variables.id) });
      toast.success("Bill rejected");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to reject bill");
    },
  });
};

/**
 * Void vendor bill
 */
export const useVoidVendorBill = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: VoidBillInput) => {
      const response = await axiosInstance.post(`${VENDOR_BILLS_URL}/${data.id}/void/`, {
        void_reason: data.void_reason,
      });
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: vendorBillKeys.lists() });
      queryClient.invalidateQueries({ queryKey: vendorBillKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: vendorBillKeys.stats() });
      toast.success("Bill voided successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to void bill");
    },
  });
};

// ==================== Vendor Payments Queries ====================

/**
 * Get list of vendor payments with optional filters
 */
export const useGetVendorPayments = (filters: VendorPaymentFilters = {}) => {
  return useQuery<VendorPaymentListResponse>({
    queryKey: vendorPaymentKeys.list(filters),
    queryFn: async () => {
      const params = new URLSearchParams();

      if (filters.vendor) params.append("vendor_id", filters.vendor);
      if (filters.bill) params.append("bill_id", filters.bill);
      if (filters.payment_method) params.append("payment_method", filters.payment_method);
      if (filters.date_from) params.append("date_from", filters.date_from);
      if (filters.date_to) params.append("date_to", filters.date_to);
      if (filters.search) params.append("search", filters.search);
      if (filters.page) params.append("page", filters.page.toString());
      if (filters.page_size) params.append("page_size", filters.page_size.toString());

      const response = await axiosInstance.get(`${VENDOR_PAYMENTS_URL}/?${params.toString()}`);
      return response.data;
    },
  });
};

/**
 * Get single vendor payment details
 */
export const useGetVendorPayment = (id: string) => {
  return useQuery<{ data: VendorPayment }>({
    queryKey: vendorPaymentKeys.detail(id),
    queryFn: async () => {
      const response = await axiosInstance.get(`${VENDOR_PAYMENTS_URL}/${id}/`);
      return response.data;
    },
    enabled: !!id,
  });
};

// ==================== Vendor Payments Mutations ====================

/**
 * Create a vendor payment
 */
export const useCreateVendorPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateVendorPaymentInput) => {
      const response = await axiosInstance.post(`${VENDOR_PAYMENTS_URL}/`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vendorPaymentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: vendorBillKeys.lists() });
      queryClient.invalidateQueries({ queryKey: vendorBillKeys.stats() });
      toast.success("Payment recorded successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to record payment");
    },
  });
};

/**
 * Update a vendor payment
 */
export const useUpdateVendorPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateVendorPaymentInput) => {
      const { id, ...updateData } = data;
      const response = await axiosInstance.patch(`${VENDOR_PAYMENTS_URL}/${id}/`, updateData);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: vendorPaymentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: vendorPaymentKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: vendorBillKeys.lists() });
      toast.success("Payment updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update payment");
    },
  });
};

/**
 * Delete a vendor payment
 */
export const useDeleteVendorPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await axiosInstance.delete(`${VENDOR_PAYMENTS_URL}/${id}/`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vendorPaymentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: vendorBillKeys.lists() });
      queryClient.invalidateQueries({ queryKey: vendorBillKeys.stats() });
      toast.success("Payment deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete payment");
    },
  });
};

// ==================== Expense Reports Queries ====================

/**
 * Get list of expense reports with optional filters
 */
export const useGetExpenseReports = (filters: ExpenseReportFilters = {}) => {
  return useQuery<ExpenseReportListResponse>({
    queryKey: expenseReportKeys.list(filters),
    queryFn: async () => {
      const params = new URLSearchParams();

      if (filters.employee) params.append("employee_id", filters.employee);
      if (filters.project) params.append("project_id", filters.project);
      if (filters.status && filters.status !== "all") params.append("status", filters.status);
      if (filters.date_from) params.append("date_from", filters.date_from);
      if (filters.date_to) params.append("date_to", filters.date_to);
      if (filters.search) params.append("search", filters.search);
      if (filters.page) params.append("page", filters.page.toString());
      if (filters.page_size) params.append("page_size", filters.page_size.toString());

      const response = await axiosInstance.get(`${EXPENSE_REPORTS_URL}/?${params.toString()}`);
      return response.data;
    },
  });
};

/**
 * Get single expense report details
 */
export const useGetExpenseReport = (id: string) => {
  return useQuery<{ data: ExpenseReport }>({
    queryKey: expenseReportKeys.detail(id),
    queryFn: async () => {
      const response = await axiosInstance.get(`${EXPENSE_REPORTS_URL}/${id}/`);
      return response.data;
    },
    enabled: !!id,
  });
};

// ==================== Expense Reports Mutations ====================

/**
 * Create an expense report
 */
export const useCreateExpenseReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateExpenseReportInput) => {
      const response = await axiosInstance.post(`${EXPENSE_REPORTS_URL}/`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: expenseReportKeys.lists() });
      toast.success("Expense report created successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create expense report");
    },
  });
};

/**
 * Update an expense report
 */
export const useUpdateExpenseReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateExpenseReportInput) => {
      const { id, ...updateData } = data;
      const response = await axiosInstance.patch(`${EXPENSE_REPORTS_URL}/${id}/`, updateData);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: expenseReportKeys.lists() });
      queryClient.invalidateQueries({ queryKey: expenseReportKeys.detail(variables.id) });
      toast.success("Expense report updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update expense report");
    },
  });
};

/**
 * Delete an expense report
 */
export const useDeleteExpenseReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await axiosInstance.delete(`${EXPENSE_REPORTS_URL}/${id}/`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: expenseReportKeys.lists() });
      toast.success("Expense report deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete expense report");
    },
  });
};
