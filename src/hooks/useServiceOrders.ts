/**
 * Service Order Hooks
 * React Query hooks for Service Order management
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AxiosWithToken from "@/lib/axios";

// Types
export interface ServiceOrderItem {
  id: string;
  item: string;
  item_name: string;
  item_code: string;
  description: string;
  quantity: number;
  unit_of_measure: string;
  unit_price: string;
  total_price: string;
  notes?: string;
}

export interface ServiceOrder {
  id: string;
  service_order_number: string;
  purchase_request: string;
  purchase_request_ref: string;
  vendor: string;
  vendor_name: string;
  department: string;
  department_name: string;
  service_type: string;
  service_type_display: string;
  service_description: string;
  order_date: string;
  service_start_date?: string;
  service_end_date?: string;
  payment_frequency: string;
  payment_frequency_display: string;
  payment_terms?: string;
  gross_total: string;
  total_wht: string;
  total_vat: string;
  net_payable: string;
  funding_source?: string;
  funding_source_name?: string;
  fco_number?: string;
  fco_number_code?: string;
  status: string;
  status_display: string;
  assignee?: string;
  assignee_name?: string;
  notes?: string;
  vendor_contact_person?: string;
  vendor_contact_phone?: string;
  is_recurring: boolean;
  parent_service_order?: string;
  items: ServiceOrderItem[];
  created_datetime: string;
  updated_datetime: string;
}

export interface ServiceOrderCreateData {
  purchase_request?: string;
  vendor: string;
  department?: string;
  service_type: string;
  service_description: string;
  service_start_date?: string;
  service_end_date?: string;
  payment_frequency: string;
  payment_terms?: string;
  funding_source?: string;
  fco_number?: string;
  assignee?: string;
  notes?: string;
  vendor_contact_person?: string;
  vendor_contact_phone?: string;
  is_recurring?: boolean;
  parent_service_order?: string;
  items: Array<{
    item: string;
    description: string;
    quantity: number;
    unit_of_measure?: string;
    unit_price: string;
    notes?: string;
  }>;
}

/**
 * Fetch all service orders with optional filters
 */
export const useServiceOrders = (params?: {
  status?: string;
  vendor?: string;
  department?: string;
  service_type?: string;
  is_recurring?: boolean;
  purchase_request?: string;
}) => {
  return useQuery<{ data: ServiceOrder[] }>({
    queryKey: ["service-orders", params],
    queryFn: async () => {
      const response = await AxiosWithToken.get("/procurements/service-order/", {
        params,
      });
      return response.data;
    },
  });
};

/**
 * Fetch a single service order by ID
 */
export const useServiceOrder = (id: string) => {
  return useQuery<{ data: ServiceOrder }>({
    queryKey: ["service-order", id],
    queryFn: async () => {
      const response = await AxiosWithToken.get(`/procurements/service-order/${id}/`);
      return response.data;
    },
    enabled: !!id,
  });
};

/**
 * Create a new service order
 */
export const useCreateServiceOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ServiceOrderCreateData) => {
      const response = await AxiosWithToken.post("/procurements/service-order/", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["service-orders"] });
    },
  });
};

/**
 * Update a service order
 */
export const useUpdateServiceOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<ServiceOrderCreateData> }) => {
      const response = await AxiosWithToken.patch(`/procurements/service-order/${id}/`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["service-orders"] });
      queryClient.invalidateQueries({ queryKey: ["service-order", variables.id] });
    },
  });
};

/**
 * Delete a service order
 */
export const useDeleteServiceOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await AxiosWithToken.delete(`/procurements/service-order/${id}/`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["service-orders"] });
    },
  });
};

/**
 * Approve a service order
 */
export const useApproveServiceOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await AxiosWithToken.post(`/procurements/service-order/${id}/approve/`);
      return response.data;
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["service-orders"] });
      queryClient.invalidateQueries({ queryKey: ["service-order", id] });
    },
  });
};

/**
 * Start a service order (mark as in progress)
 */
export const useStartServiceOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await AxiosWithToken.post(`/procurements/service-order/${id}/start/`);
      return response.data;
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["service-orders"] });
      queryClient.invalidateQueries({ queryKey: ["service-order", id] });
    },
  });
};

/**
 * Complete a service order
 */
export const useCompleteServiceOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await AxiosWithToken.post(`/procurements/service-order/${id}/complete/`);
      return response.data;
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["service-orders"] });
      queryClient.invalidateQueries({ queryKey: ["service-order", id] });
    },
  });
};

/**
 * Cancel a service order
 */
export const useCancelServiceOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await AxiosWithToken.post(`/procurements/service-order/${id}/cancel/`);
      return response.data;
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["service-orders"] });
      queryClient.invalidateQueries({ queryKey: ["service-order", id] });
    },
  });
};
