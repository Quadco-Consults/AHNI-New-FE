import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { VendorAuthUtils } from "./vendorAuthController";

// Message interfaces
export interface MessageAttachment {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
}

export interface MessageSender {
  name: string;
  email: string;
  role: string;
}

export interface VendorMessage {
  id: string;
  subject: string;
  sender: MessageSender;
  recipients: string[];
  content: string;
  sent_date: string;
  read_date?: string;
  status: 'unread' | 'read' | 'archived' | 'starred';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  type: 'inquiry' | 'rfq_clarification' | 'system' | 'procurement_update' | 'contract';
  rfq_reference?: string;
  attachments?: MessageAttachment[];
  thread_count: number;
  is_reply: boolean;
}

export interface NewMessage {
  subject: string;
  content: string;
  recipients: string[];
  priority?: string;
  type?: string;
  rfq_reference?: string;
  attachments?: File[];
}

export interface MessageReply {
  message_id: string;
  content: string;
  attachments?: File[];
}

// Vendor messages endpoints
const VENDOR_MESSAGES_ENDPOINTS = {
  MESSAGES: "/vendor/messages/",
  SEND: "/vendor/messages/send/",
  REPLY: "/vendor/messages/reply/",
  MARK_READ: "/vendor/messages/mark-read/",
  ARCHIVE: "/vendor/messages/archive/",
  STAR: "/vendor/messages/star/",
  DELETE: "/vendor/messages/delete/",
};

// Get vendor messages hook
export const useVendorMessages = (params?: {
  status?: string;
  type?: string;
  search?: string;
}) => {
  return useQuery({
    queryKey: ['vendor-messages', params],
    queryFn: async (): Promise<{
      count: number;
      results: VendorMessage[];
      summary: {
        total: number;
        unread: number;
        starred: number;
        archived: number;
      };
    }> => {
      const token = VendorAuthUtils.getVendorToken();
      if (!token) {
        throw new Error('No vendor token found');
      }

      // Build query parameters
      const queryParams = new URLSearchParams();
      if (params?.status && params.status !== 'all') queryParams.append('status', params.status);
      if (params?.type && params.type !== 'all') queryParams.append('type', params.type);
      if (params?.search) queryParams.append('search', params.search);

      const url = `${VENDOR_MESSAGES_ENDPOINTS.MESSAGES}${queryParams.toString() ? `?${queryParams}` : ''}`;

      const response = await AxiosWithToken.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    },
    enabled: VendorAuthUtils.isVendorAuthenticated(),
    staleTime: 1000 * 60 * 2, // 2 minutes
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 401) {
        VendorAuthUtils.removeVendorToken();
        return false;
      }
      return failureCount < 3;
    },
  });
};

// Get specific message details hook
export const useVendorMessageDetails = (messageId: string) => {
  return useQuery({
    queryKey: ['vendor-message-details', messageId],
    queryFn: async (): Promise<VendorMessage> => {
      const token = VendorAuthUtils.getVendorToken();
      if (!token) {
        throw new Error('No vendor token found');
      }

      const response = await AxiosWithToken.get(`${VENDOR_MESSAGES_ENDPOINTS.MESSAGES}${messageId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    },
    enabled: !!messageId && VendorAuthUtils.isVendorAuthenticated(),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 401) {
        VendorAuthUtils.removeVendorToken();
        return false;
      }
      return failureCount < 3;
    },
  });
};

// Send new message hook
export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (messageData: NewMessage) => {
      const token = VendorAuthUtils.getVendorToken();
      if (!token) {
        throw new Error('No vendor token found');
      }

      // Create FormData for file uploads
      const formData = new FormData();
      formData.append('subject', messageData.subject);
      formData.append('content', messageData.content);
      formData.append('recipients', JSON.stringify(messageData.recipients));

      if (messageData.priority) {
        formData.append('priority', messageData.priority);
      }
      if (messageData.type) {
        formData.append('type', messageData.type);
      }
      if (messageData.rfq_reference) {
        formData.append('rfq_reference', messageData.rfq_reference);
      }

      // Add attachments
      if (messageData.attachments) {
        messageData.attachments.forEach((file, index) => {
          formData.append(`attachment_${index}`, file);
        });
      }

      const response = await AxiosWithToken.post(VENDOR_MESSAGES_ENDPOINTS.SEND, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch messages
      queryClient.invalidateQueries({ queryKey: ['vendor-messages'] });
    },
    onError: (error: any) => {
      if (error?.response?.status === 401) {
        VendorAuthUtils.removeVendorToken();
      }
    },
  });
};

// Reply to message hook
export const useReplyToMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (replyData: MessageReply) => {
      const token = VendorAuthUtils.getVendorToken();
      if (!token) {
        throw new Error('No vendor token found');
      }

      // Create FormData for file uploads
      const formData = new FormData();
      formData.append('message_id', replyData.message_id);
      formData.append('content', replyData.content);

      // Add attachments
      if (replyData.attachments) {
        replyData.attachments.forEach((file, index) => {
          formData.append(`attachment_${index}`, file);
        });
      }

      const response = await AxiosWithToken.post(VENDOR_MESSAGES_ENDPOINTS.REPLY, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch messages
      queryClient.invalidateQueries({ queryKey: ['vendor-messages'] });
      queryClient.invalidateQueries({ queryKey: ['vendor-message-details'] });
    },
    onError: (error: any) => {
      if (error?.response?.status === 401) {
        VendorAuthUtils.removeVendorToken();
      }
    },
  });
};

// Mark message as read hook
export const useMarkMessageRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (messageId: string) => {
      const token = VendorAuthUtils.getVendorToken();
      if (!token) {
        throw new Error('No vendor token found');
      }

      const response = await AxiosWithToken.patch(
        `${VENDOR_MESSAGES_ENDPOINTS.MARK_READ}${messageId}/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch messages
      queryClient.invalidateQueries({ queryKey: ['vendor-messages'] });
      queryClient.invalidateQueries({ queryKey: ['vendor-message-details'] });
    },
    onError: (error: any) => {
      if (error?.response?.status === 401) {
        VendorAuthUtils.removeVendorToken();
      }
    },
  });
};

// Archive message hook
export const useArchiveMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (messageId: string) => {
      const token = VendorAuthUtils.getVendorToken();
      if (!token) {
        throw new Error('No vendor token found');
      }

      const response = await AxiosWithToken.patch(
        `${VENDOR_MESSAGES_ENDPOINTS.ARCHIVE}${messageId}/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch messages
      queryClient.invalidateQueries({ queryKey: ['vendor-messages'] });
    },
    onError: (error: any) => {
      if (error?.response?.status === 401) {
        VendorAuthUtils.removeVendorToken();
      }
    },
  });
};

// Star message hook
export const useStarMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (messageId: string) => {
      const token = VendorAuthUtils.getVendorToken();
      if (!token) {
        throw new Error('No vendor token found');
      }

      const response = await AxiosWithToken.patch(
        `${VENDOR_MESSAGES_ENDPOINTS.STAR}${messageId}/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch messages
      queryClient.invalidateQueries({ queryKey: ['vendor-messages'] });
    },
    onError: (error: any) => {
      if (error?.response?.status === 401) {
        VendorAuthUtils.removeVendorToken();
      }
    },
  });
};

// Delete message hook
export const useDeleteMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (messageId: string) => {
      const token = VendorAuthUtils.getVendorToken();
      if (!token) {
        throw new Error('No vendor token found');
      }

      const response = await AxiosWithToken.delete(`${VENDOR_MESSAGES_ENDPOINTS.DELETE}${messageId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch messages
      queryClient.invalidateQueries({ queryKey: ['vendor-messages'] });
    },
    onError: (error: any) => {
      if (error?.response?.status === 401) {
        VendorAuthUtils.removeVendorToken();
      }
    },
  });
};

// Message utilities
export const MessageUtils = {
  formatFileSize: (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },

  getMessageTypeDisplayName: (type: string): string => {
    const typeNames = {
      'inquiry': 'General Inquiry',
      'rfq_clarification': 'RFQ Clarification',
      'system': 'System Notification',
      'procurement_update': 'Procurement Update',
      'contract': 'Contract Communication'
    };
    return typeNames[type as keyof typeof typeNames] || type;
  },

  getPriorityColor: (priority: string): string => {
    const colors = {
      'low': 'text-gray-600',
      'normal': 'text-blue-600',
      'high': 'text-orange-600',
      'urgent': 'text-red-600'
    };
    return colors[priority as keyof typeof colors] || 'text-gray-600';
  },

  isMessageUnread: (message: VendorMessage): boolean => {
    return message.status === 'unread';
  },

  isMessageStarred: (message: VendorMessage): boolean => {
    return message.status === 'starred';
  },

  hasAttachments: (message: VendorMessage): boolean => {
    return !!(message.attachments && message.attachments.length > 0);
  }
};