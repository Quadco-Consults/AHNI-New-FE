import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { Customer, CustomerFormData, CustomerStats } from "../types/customer.types";

// API endpoints
const CUSTOMERS_ENDPOINT = "/customers";

// Query keys
export const customerKeys = {
  all: ["customers"] as const,
  lists: () => [...customerKeys.all, "list"] as const,
  list: (filters: any) => [...customerKeys.lists(), { filters }] as const,
  details: () => [...customerKeys.all, "detail"] as const,
  detail: (id: string) => [...customerKeys.details(), id] as const,
  stats: () => [...customerKeys.all, "stats"] as const,
};

// Types for API responses
interface CustomersResponse {
  data: Customer[];
  meta: {
    total: number;
    page: number;
    page_size: number;
    total_pages: number;
  };
}

interface CustomerResponse {
  data: Customer;
}

interface CustomerStatsResponse {
  data: CustomerStats;
}

// Fetch customers with filters
export const useGetCustomers = (filters?: {
  customer_type?: string;
  is_active?: boolean;
  search?: string;
  page?: number;
  page_size?: number;
}) => {
  return useQuery({
    queryKey: customerKeys.list(filters),
    queryFn: async (): Promise<CustomersResponse> => {
      const params = new URLSearchParams();

      if (filters?.customer_type) params.append("customer_type", filters.customer_type);
      if (filters?.is_active !== undefined) params.append("is_active", filters.is_active.toString());
      if (filters?.search) params.append("search", filters.search);
      if (filters?.page) params.append("page", filters.page.toString());
      if (filters?.page_size) params.append("page_size", filters.page_size.toString());

      const response = await AxiosWithToken.get(`${CUSTOMERS_ENDPOINT}?${params.toString()}`);
      return response.data;
    },
  });
};

// Fetch single customer
export const useGetCustomer = (id: string) => {
  return useQuery({
    queryKey: customerKeys.detail(id),
    queryFn: async (): Promise<CustomerResponse> => {
      const response = await AxiosWithToken.get(`${CUSTOMERS_ENDPOINT}/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
};

// Fetch customer statistics
export const useGetCustomerStats = () => {
  return useQuery({
    queryKey: customerKeys.stats(),
    queryFn: async (): Promise<CustomerStatsResponse> => {
      const response = await AxiosWithToken.get(`${CUSTOMERS_ENDPOINT}/stats`);
      return response.data;
    },
  });
};

// Create customer
export const useCreateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CustomerFormData): Promise<CustomerResponse> => {
      // Transform the data to match backend expectations
      const transformedData = {
        ...data,
        // Generate customer number on backend if not provided
        customer_number: data.customer_number || undefined,
        // Ensure shipping address is handled correctly
        shipping_address: data.same_as_billing ? data.billing_address : data.shipping_address,
      };

      const response = await AxiosWithToken.post(CUSTOMERS_ENDPOINT, transformedData);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch customers list
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
      queryClient.invalidateQueries({ queryKey: customerKeys.stats() });
    },
  });
};

// Update customer
export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: CustomerFormData }): Promise<CustomerResponse> => {
      // Transform the data to match backend expectations
      const transformedData = {
        ...data,
        // Ensure shipping address is handled correctly
        shipping_address: data.same_as_billing ? data.billing_address : data.shipping_address,
      };

      const response = await AxiosWithToken.put(`${CUSTOMERS_ENDPOINT}/${id}`, transformedData);
      return response.data;
    },
    onSuccess: (_, { id }) => {
      // Invalidate and refetch customers list and specific customer
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
      queryClient.invalidateQueries({ queryKey: customerKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: customerKeys.stats() });
    },
  });
};

// Delete customer
export const useDeleteCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      await AxiosWithToken.delete(`${CUSTOMERS_ENDPOINT}/${id}`);
    },
    onSuccess: () => {
      // Invalidate and refetch customers list
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
      queryClient.invalidateQueries({ queryKey: customerKeys.stats() });
    },
  });
};

// Bulk operations
export const useBulkDeleteCustomers = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ids: string[]): Promise<void> => {
      await AxiosWithToken.post(`${CUSTOMERS_ENDPOINT}/bulk-delete`, { ids });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
      queryClient.invalidateQueries({ queryKey: customerKeys.stats() });
    },
  });
};

// Toggle customer status
export const useToggleCustomerStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }): Promise<CustomerResponse> => {
      const response = await AxiosWithToken.patch(`${CUSTOMERS_ENDPOINT}/${id}/status`, { is_active });
      return response.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
      queryClient.invalidateQueries({ queryKey: customerKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: customerKeys.stats() });
    },
  });
};

// Export customer data
export const useExportCustomers = () => {
  return useMutation({
    mutationFn: async (params: {
      format: "csv" | "xlsx";
      filters?: {
        customer_type?: string;
        is_active?: boolean;
        search?: string;
      };
    }): Promise<Blob> => {
      const queryParams = new URLSearchParams();
      queryParams.append("format", params.format);

      if (params.filters?.customer_type) {
        queryParams.append("customer_type", params.filters.customer_type);
      }
      if (params.filters?.is_active !== undefined) {
        queryParams.append("is_active", params.filters.is_active.toString());
      }
      if (params.filters?.search) {
        queryParams.append("search", params.filters.search);
      }

      const response = await AxiosWithToken.get(`${CUSTOMERS_ENDPOINT}/export?${queryParams.toString()}`, {
        responseType: "blob",
      });

      return response.data;
    },
  });
};

// Import customers
export const useImportCustomers = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File): Promise<{ imported: number; errors: string[] }> => {
      const formData = new FormData();
      formData.append("file", file);

      const response = await AxiosWithToken.post(`${CUSTOMERS_ENDPOINT}/import`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
      queryClient.invalidateQueries({ queryKey: customerKeys.stats() });
    },
  });
};

// Search customers (for autocomplete)
export const useSearchCustomers = (query: string) => {
  return useQuery({
    queryKey: [...customerKeys.all, "search", query],
    queryFn: async (): Promise<{ data: Customer[] }> => {
      if (!query || query.length < 2) {
        return { data: [] };
      }

      const response = await AxiosWithToken.get(`${CUSTOMERS_ENDPOINT}/search`, {
        params: { q: query, limit: 10 },
      });
      return response.data;
    },
    enabled: query.length >= 2,
  });
};