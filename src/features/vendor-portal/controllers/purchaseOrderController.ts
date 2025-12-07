import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import VendorAxiosWithToken from "@/constants/api_management/VendorHttpHelper";
import {
  PurchaseOrder,
  GoodsReceivedNote,
  PONotification,
  GRNNotification,
  VendorOrderSummary,
  DeliveryPerformanceMetrics,
  POAcknowledgment,
  DeliveryUpdate,
  POStatus,
  GRNStatus
} from "../types/purchase-orders";

// Purchase Order and GRN endpoints - Updated to match backend implementation
const PO_GRN_ENDPOINTS = {
  // Purchase Orders
  VENDOR_POS: "/procurements/vendor/purchase-orders/",
  PO_DETAILS: "/procurements/vendor/purchase-orders/:poId/",
  ACKNOWLEDGE_PO: "/procurements/vendor/purchase-orders/:poId/acknowledge/",
  UPDATE_DELIVERY: "/procurements/vendor/purchase-orders/:poId/delivery-update/",

  // GRNs (Note: Backend uses different path for GRNs)
  VENDOR_GRNS: "/procurements/vendor/goods-received-notes/",
  GRN_DETAILS: "/procurements/vendor/goods-received-notes/:grnId/",
  RESPOND_TO_GRN: "/procurements/vendor/goods-received-notes/:grnId/respond/",

  // Notifications
  PO_NOTIFICATIONS: "/procurements/vendor/notifications/",
  GRN_NOTIFICATIONS: "/vendor/notifications/",
  MARK_NOTIFICATION_READ: "/vendor/notifications/:notificationId/read/",

  // Analytics - Use backend order summary endpoint
  ORDER_SUMMARY: "/procurements/vendor/order-summary/",
  DELIVERY_PERFORMANCE: "/procurements/vendor/dashboard/",

  // Documents
  UPLOAD_DELIVERY_PROOF: "/vendor/purchase-orders/:poId/delivery-proof/",
  DOWNLOAD_DOCUMENT: "/vendor/documents/:documentId/",
};

// Get vendor's purchase orders
export const useVendorPurchaseOrders = (status?: POStatus) => {
  return useQuery({
    queryKey: ['vendor-purchase-orders', status],
    queryFn: async (): Promise<PurchaseOrder[]> => {
      // Check for mock token in development mode
      if (process.env.NODE_ENV === 'development') {
        const token = localStorage.getItem('vendor_access_token');
        if (token?.startsWith('mock_access_token_')) {
          // Return mock purchase orders data
          const mockPOs: PurchaseOrder[] = [
            {
              id: 'po_1',
              po_number: 'PO-2024-001',
              status: 'IN_PROGRESS',
              total_amount: 45000,
              delivery_date: '2024-12-20T00:00:00Z',
              created_date: '2024-12-01T10:00:00Z',
              items: []
            },
            {
              id: 'po_2',
              po_number: 'PO-2024-002',
              status: 'DELIVERED',
              total_amount: 25000,
              delivery_date: '2024-12-15T00:00:00Z',
              created_date: '2024-11-25T10:00:00Z',
              items: []
            },
            {
              id: 'po_3',
              po_number: 'PO-2024-003',
              status: 'PENDING',
              total_amount: 75000,
              delivery_date: '2024-12-30T00:00:00Z',
              created_date: '2024-12-05T10:00:00Z',
              items: []
            }
          ];

          // Filter by status if provided
          if (status) {
            return mockPOs.filter(po => po.status === status);
          }
          return mockPOs;
        }
      }

      const params = status ? { status } : {};
      const response = await VendorAxiosWithToken.get(PO_GRN_ENDPOINTS.VENDOR_POS, { params });
      return response.data.data || response.data;
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

// Get specific PO details
export const usePurchaseOrderDetails = (poId: string) => {
  return useQuery({
    queryKey: ['purchase-order-details', poId],
    queryFn: async (): Promise<PurchaseOrder> => {
      const endpoint = PO_GRN_ENDPOINTS.PO_DETAILS.replace(':poId', poId);
      const response = await VendorAxiosWithToken.get(endpoint);
      return response.data.data || response.data;
    },
    enabled: !!poId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Acknowledge a purchase order
export const useAcknowledgePurchaseOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (acknowledgment: POAcknowledgment): Promise<PurchaseOrder> => {
      const endpoint = PO_GRN_ENDPOINTS.ACKNOWLEDGE_PO.replace(':poId', acknowledgment.po_id);
      const response = await VendorAxiosWithToken.post(endpoint, acknowledgment);
      return response.data.data || response.data;
    },
    onSuccess: (data, variables) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['vendor-purchase-orders'] });
      queryClient.invalidateQueries({ queryKey: ['purchase-order-details', variables.po_id] });
      queryClient.invalidateQueries({ queryKey: ['vendor-order-summary'] });
    },
    onError: (error: any) => {
      console.error('PO acknowledgment error:', error);
    }
  });
};

// Update delivery status
export const useUpdateDeliveryStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (update: DeliveryUpdate): Promise<PurchaseOrder> => {
      const endpoint = PO_GRN_ENDPOINTS.UPDATE_DELIVERY.replace(':poId', update.po_id);
      const response = await VendorAxiosWithToken.patch(endpoint, update);
      return response.data.data || response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['vendor-purchase-orders'] });
      queryClient.invalidateQueries({ queryKey: ['purchase-order-details', variables.po_id] });
      queryClient.invalidateQueries({ queryKey: ['vendor-order-summary'] });
    }
  });
};

// Get vendor's GRNs
export const useVendorGRNs = (status?: GRNStatus) => {
  return useQuery({
    queryKey: ['vendor-grns', status],
    queryFn: async (): Promise<GoodsReceivedNote[]> => {
      // Check for mock token in development mode
      if (process.env.NODE_ENV === 'development') {
        const token = localStorage.getItem('vendor_access_token');
        if (token?.startsWith('mock_access_token_')) {
          // Return mock GRN data
          const mockGRNs: GoodsReceivedNote[] = [
            {
              id: 'grn_1',
              grn_number: 'GRN-2024-001',
              po_number: 'PO-2024-001',
              status: 'RECEIVED',
              received_date: '2024-12-10T10:00:00Z',
              quality_rating: 4.5
            },
            {
              id: 'grn_2',
              grn_number: 'GRN-2024-002',
              po_number: 'PO-2024-002',
              status: 'INSPECTED',
              received_date: '2024-12-08T14:00:00Z',
              quality_rating: 4.8
            }
          ];

          // Filter by status if provided
          if (status) {
            return mockGRNs.filter(grn => grn.status === status);
          }
          return mockGRNs;
        }
      }

      const params = status ? { status } : {};
      const response = await VendorAxiosWithToken.get(PO_GRN_ENDPOINTS.VENDOR_GRNS, { params });
      return response.data.data || response.data;
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

// Get specific GRN details
export const useGRNDetails = (grnId: string) => {
  return useQuery({
    queryKey: ['grn-details', grnId],
    queryFn: async (): Promise<GoodsReceivedNote> => {
      const endpoint = PO_GRN_ENDPOINTS.GRN_DETAILS.replace(':grnId', grnId);
      const response = await VendorAxiosWithToken.get(endpoint);
      return response.data.data || response.data;
    },
    enabled: !!grnId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Respond to GRN (acknowledge receipt, dispute, etc.)
export const useRespondToGRN = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      grn_id: string;
      response_type: 'ACKNOWLEDGE' | 'DISPUTE' | 'PROVIDE_INFO';
      response_message: string;
      dispute_details?: {
        disputed_items: string[];
        dispute_reason: string;
        supporting_documents?: File[];
      };
    }): Promise<GoodsReceivedNote> => {
      const endpoint = PO_GRN_ENDPOINTS.RESPOND_TO_GRN.replace(':grnId', params.grn_id);

      const formData = new FormData();
      formData.append('response_type', params.response_type);
      formData.append('response_message', params.response_message);

      if (params.dispute_details) {
        formData.append('dispute_details', JSON.stringify({
          disputed_items: params.dispute_details.disputed_items,
          dispute_reason: params.dispute_details.dispute_reason
        }));

        if (params.dispute_details.supporting_documents) {
          params.dispute_details.supporting_documents.forEach((file, index) => {
            formData.append(`supporting_document_${index}`, file);
          });
        }
      }

      const response = await VendorAxiosWithToken.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.data || response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['vendor-grns'] });
      queryClient.invalidateQueries({ queryKey: ['grn-details', variables.grn_id] });
      queryClient.invalidateQueries({ queryKey: ['grn-notifications'] });
    }
  });
};

// Get PO notifications
export const usePONotifications = () => {
  return useQuery({
    queryKey: ['po-notifications'],
    queryFn: async (): Promise<PONotification[]> => {
      const response = await VendorAxiosWithToken.get(PO_GRN_ENDPOINTS.PO_NOTIFICATIONS);
      return response.data.data || response.data;
    },
    staleTime: 1000 * 60 * 1, // 1 minute
  });
};

// Get GRN notifications
export const useGRNNotifications = () => {
  return useQuery({
    queryKey: ['grn-notifications'],
    queryFn: async (): Promise<GRNNotification[]> => {
      const response = await VendorAxiosWithToken.get(PO_GRN_ENDPOINTS.GRN_NOTIFICATIONS);
      return response.data.data || response.data;
    },
    staleTime: 1000 * 60 * 1, // 1 minute
  });
};

// Mark notification as read
export const useMarkNotificationRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notificationId: string): Promise<void> => {
      const endpoint = PO_GRN_ENDPOINTS.MARK_NOTIFICATION_READ.replace(':notificationId', notificationId);
      await VendorAxiosWithToken.patch(endpoint);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['po-notifications'] });
      queryClient.invalidateQueries({ queryKey: ['grn-notifications'] });
    }
  });
};

// Get vendor order summary
export const useVendorOrderSummary = () => {
  return useQuery({
    queryKey: ['vendor-order-summary'],
    queryFn: async (): Promise<VendorOrderSummary> => {
      // Check for mock token in development mode
      if (process.env.NODE_ENV === 'development') {
        const token = localStorage.getItem('vendor_access_token');
        if (token?.startsWith('mock_access_token_')) {
          // Return mock order summary data
          const mockSummary: VendorOrderSummary = {
            active_pos: 5,
            total_value: 145000,
            pending_deliveries: 2,
            overdue_deliveries: 1,
            completed_deliveries: 12,
            average_delivery_rating: 4.2,
            total_orders: 15,
            on_time_delivery_rate: 85
          };
          return mockSummary;
        }
      }

      const response = await VendorAxiosWithToken.get(PO_GRN_ENDPOINTS.ORDER_SUMMARY);
      return response.data.data || response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Get delivery performance metrics
export const useDeliveryPerformanceMetrics = () => {
  return useQuery({
    queryKey: ['delivery-performance-metrics'],
    queryFn: async (): Promise<DeliveryPerformanceMetrics> => {
      const response = await VendorAxiosWithToken.get(PO_GRN_ENDPOINTS.DELIVERY_PERFORMANCE);
      return response.data.data || response.data;
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

// Upload delivery proof documents
export const useUploadDeliveryProof = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      po_id: string;
      files: File[];
      delivery_notes?: string;
      delivery_date: string;
    }): Promise<{ success: boolean; uploaded_documents: string[] }> => {
      const endpoint = PO_GRN_ENDPOINTS.UPLOAD_DELIVERY_PROOF.replace(':poId', params.po_id);

      const formData = new FormData();
      formData.append('delivery_date', params.delivery_date);
      if (params.delivery_notes) {
        formData.append('delivery_notes', params.delivery_notes);
      }

      params.files.forEach((file, index) => {
        formData.append(`delivery_proof_${index}`, file);
      });

      const response = await VendorAxiosWithToken.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.data || response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['purchase-order-details', variables.po_id] });
      queryClient.invalidateQueries({ queryKey: ['vendor-purchase-orders'] });
    }
  });
};

// Utility functions for PO and GRN management
export const POGRNUtils = {
  // Get PO status badge variant
  getPOStatusBadgeVariant: (status: POStatus) => {
    switch (status) {
      case 'ISSUED':
        return 'default';
      case 'ACKNOWLEDGED':
        return 'default';
      case 'IN_PROGRESS':
        return 'secondary';
      case 'PARTIALLY_DELIVERED':
        return 'secondary';
      case 'DELIVERED':
        return 'default';
      case 'COMPLETED':
        return 'outline';
      case 'CANCELLED':
        return 'destructive';
      case 'DISPUTED':
        return 'destructive';
      default:
        return 'secondary';
    }
  },

  // Get GRN status badge variant
  getGRNStatusBadgeVariant: (status: GRNStatus) => {
    switch (status) {
      case 'RECEIVED':
        return 'default';
      case 'INSPECTED':
        return 'default';
      case 'ACCEPTED':
        return 'default';
      case 'REJECTED':
        return 'destructive';
      case 'RETURNED':
        return 'destructive';
      case 'PARTIALLY_RECEIVED':
        return 'secondary';
      default:
        return 'secondary';
    }
  },

  // Format currency
  formatCurrency: (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
    }).format(amount);
  },

  // Calculate PO completion percentage
  calculateCompletionPercentage: (po: PurchaseOrder) => {
    const totalQuantity = po.line_items.reduce((sum, item) => sum + item.quantity_ordered, 0);
    const deliveredQuantity = po.line_items.reduce((sum, item) => sum + item.quantity_delivered, 0);
    return totalQuantity > 0 ? Math.round((deliveredQuantity / totalQuantity) * 100) : 0;
  },

  // Check if PO is overdue
  isPOOverdue: (po: PurchaseOrder) => {
    const now = new Date();
    const deliveryDate = new Date(po.delivery_date);
    return deliveryDate < now && !['DELIVERED', 'COMPLETED', 'CANCELLED'].includes(po.status);
  },

  // Get days until delivery
  getDaysUntilDelivery: (deliveryDate: string) => {
    const now = new Date();
    const delivery = new Date(deliveryDate);
    const diffTime = delivery.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  },

  // Calculate GRN acceptance rate
  calculateGRNAcceptanceRate: (grn: GoodsReceivedNote) => {
    const totalReceived = grn.received_items.reduce((sum, item) => sum + item.quantity_received, 0);
    const totalAccepted = grn.received_items.reduce((sum, item) => sum + item.quantity_accepted, 0);
    return totalReceived > 0 ? Math.round((totalAccepted / totalReceived) * 100) : 0;
  },

  // Get PO status display name
  getPOStatusDisplayName: (status: POStatus) => {
    switch (status) {
      case 'PARTIALLY_DELIVERED':
        return 'Partially Delivered';
      case 'IN_PROGRESS':
        return 'In Progress';
      default:
        return status.charAt(0) + status.slice(1).toLowerCase().replace('_', ' ');
    }
  },

  // Get GRN status display name
  getGRNStatusDisplayName: (status: GRNStatus) => {
    switch (status) {
      case 'PARTIALLY_RECEIVED':
        return 'Partially Received';
      default:
        return status.charAt(0) + status.slice(1).toLowerCase().replace('_', ' ');
    }
  }
};