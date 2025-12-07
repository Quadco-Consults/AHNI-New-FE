import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import VendorVendorAxiosWithToken from "@/constants/api_management/VendorHttpHelper";
import { VendorAuthUtils } from "./vendorAuthController";

// Support ticket interfaces
export interface SupportTicket {
  id: string;
  ticket_number: string;
  subject: string;
  description: string;
  status: 'open' | 'in_progress' | 'waiting_response' | 'resolved' | 'closed';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  category: 'technical' | 'billing' | 'rfq_inquiry' | 'account' | 'portal_issue' | 'general';
  created_date: string;
  updated_date: string;
  assigned_to?: {
    name: string;
    email: string;
    role: string;
  };
  responses_count: number;
  last_response_date?: string;
  last_response_by?: 'vendor' | 'support';
  attachments?: Array<{
    id: string;
    name: string;
    size: number;
    type: string;
    url: string;
  }>;
  resolution_date?: string;
  vendor: {
    company_name: string;
    email: string;
  };
}

export interface NewTicket {
  subject: string;
  description: string;
  category: string;
  priority: string;
  attachments?: File[];
}

export interface TicketResponse {
  ticket_id: string;
  message: string;
  attachments?: File[];
}

// Knowledge base interfaces
export interface KnowledgeBaseArticle {
  id: string;
  title: string;
  content: string;
  summary: string;
  category: string;
  tags: string[];
  created_date: string;
  updated_date: string;
  author: {
    name: string;
    role: string;
  };
  views: number;
  helpful_votes: number;
  not_helpful_votes: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimated_read_time: number;
  attachments?: Array<{
    id: string;
    name: string;
    type: string;
    url: string;
  }>;
  related_articles: string[];
  is_featured: boolean;
  is_popular: boolean;
}

export interface KnowledgeBaseCategory {
  id: string;
  name: string;
  description: string;
  article_count: number;
}

// Contact form interface
export interface ContactForm {
  subject: string;
  message: string;
  department: string;
  priority: string;
  contact_method: string;
}

// Support endpoints
const VENDOR_SUPPORT_ENDPOINTS = {
  TICKETS: "/vendor/support/tickets/",
  CREATE_TICKET: "/vendor/support/tickets/create/",
  TICKET_RESPONSE: "/vendor/support/tickets/respond/",
  KNOWLEDGE_BASE: "/vendor/support/knowledge-base/",
  KB_CATEGORIES: "/vendor/support/knowledge-base/categories/",
  CONTACT_FORM: "/vendor/support/contact/",
  TICKET_ATTACHMENTS: "/vendor/support/tickets/attachments/",
};

// Get support tickets hook
export const useSupportTickets = (params?: {
  status?: string;
  category?: string;
  search?: string;
}) => {
  return useQuery({
    queryKey: ['support-tickets', params],
    queryFn: async (): Promise<{
      count: number;
      results: SupportTicket[];
      summary: {
        open: number;
        in_progress: number;
        waiting_response: number;
        resolved: number;
        closed: number;
      };
    }> => {
      const token = VendorAuthUtils.getVendorToken();
      if (!token) {
        throw new Error('No vendor token found');
      }

      // Build query parameters
      const queryParams = new URLSearchParams();
      if (params?.status && params.status !== 'all') queryParams.append('status', params.status);
      if (params?.category && params.category !== 'all') queryParams.append('category', params.category);
      if (params?.search) queryParams.append('search', params.search);

      const url = `${VENDOR_SUPPORT_ENDPOINTS.TICKETS}${queryParams.toString() ? `?${queryParams}` : ''}`;

      const response = await VendorAxiosWithToken.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    },
    enabled: VendorAuthUtils.isVendorAuthenticated(),
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

// Get specific ticket details hook
export const useSupportTicketDetails = (ticketId: string) => {
  return useQuery({
    queryKey: ['support-ticket-details', ticketId],
    queryFn: async (): Promise<SupportTicket & {
      responses: Array<{
        id: string;
        message: string;
        created_date: string;
        author: {
          name: string;
          role: string;
          type: 'vendor' | 'support';
        };
        attachments?: Array<{
          id: string;
          name: string;
          size: number;
          type: string;
          url: string;
        }>;
      }>;
    }> => {
      const token = VendorAuthUtils.getVendorToken();
      if (!token) {
        throw new Error('No vendor token found');
      }

      const response = await VendorAxiosWithToken.get(`${VENDOR_SUPPORT_ENDPOINTS.TICKETS}${ticketId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    },
    enabled: !!ticketId && VendorAuthUtils.isVendorAuthenticated(),
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

// Create support ticket hook
export const useCreateSupportTicket = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ticketData: NewTicket) => {
      const token = VendorAuthUtils.getVendorToken();
      if (!token) {
        throw new Error('No vendor token found');
      }

      // Create FormData for file uploads
      const formData = new FormData();
      formData.append('subject', ticketData.subject);
      formData.append('description', ticketData.description);
      formData.append('category', ticketData.category);
      formData.append('priority', ticketData.priority);

      // Add attachments
      if (ticketData.attachments) {
        ticketData.attachments.forEach((file, index) => {
          formData.append(`attachment_${index}`, file);
        });
      }

      const response = await VendorAxiosWithToken.post(VENDOR_SUPPORT_ENDPOINTS.CREATE_TICKET, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch tickets
      queryClient.invalidateQueries({ queryKey: ['support-tickets'] });
    },
    onError: (error: any) => {
      if (error?.response?.status === 401) {
        VendorAuthUtils.removeVendorToken();
      }
    },
  });
};

// Respond to ticket hook
export const useRespondToTicket = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (responseData: TicketResponse) => {
      const token = VendorAuthUtils.getVendorToken();
      if (!token) {
        throw new Error('No vendor token found');
      }

      // Create FormData for file uploads
      const formData = new FormData();
      formData.append('ticket_id', responseData.ticket_id);
      formData.append('message', responseData.message);

      // Add attachments
      if (responseData.attachments) {
        responseData.attachments.forEach((file, index) => {
          formData.append(`attachment_${index}`, file);
        });
      }

      const response = await VendorAxiosWithToken.post(VENDOR_SUPPORT_ENDPOINTS.TICKET_RESPONSE, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    },
    onSuccess: (data, variables) => {
      // Invalidate and refetch ticket details
      queryClient.invalidateQueries({ queryKey: ['support-ticket-details', variables.ticket_id] });
      queryClient.invalidateQueries({ queryKey: ['support-tickets'] });
    },
    onError: (error: any) => {
      if (error?.response?.status === 401) {
        VendorAuthUtils.removeVendorToken();
      }
    },
  });
};

// Get knowledge base articles hook
export const useKnowledgeBaseArticles = (params?: {
  category?: string;
  difficulty?: string;
  search?: string;
  featured?: boolean;
  popular?: boolean;
}) => {
  return useQuery({
    queryKey: ['knowledge-base-articles', params],
    queryFn: async (): Promise<{
      count: number;
      results: KnowledgeBaseArticle[];
      featured: KnowledgeBaseArticle[];
      popular: KnowledgeBaseArticle[];
    }> => {
      // Build query parameters
      const queryParams = new URLSearchParams();
      if (params?.category && params.category !== 'all') queryParams.append('category', params.category);
      if (params?.difficulty && params.difficulty !== 'all') queryParams.append('difficulty', params.difficulty);
      if (params?.search) queryParams.append('search', params.search);
      if (params?.featured) queryParams.append('featured', 'true');
      if (params?.popular) queryParams.append('popular', 'true');

      const url = `${VENDOR_SUPPORT_ENDPOINTS.KNOWLEDGE_BASE}${queryParams.toString() ? `?${queryParams}` : ''}`;

      const response = await VendorAxiosWithToken.get(url);

      return response.data;
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
    retry: (failureCount, error: any) => {
      return failureCount < 3;
    },
  });
};

// Get knowledge base categories hook
export const useKnowledgeBaseCategories = () => {
  return useQuery({
    queryKey: ['knowledge-base-categories'],
    queryFn: async (): Promise<KnowledgeBaseCategory[]> => {
      const response = await VendorAxiosWithToken.get(VENDOR_SUPPORT_ENDPOINTS.KB_CATEGORIES);
      return response.data;
    },
    staleTime: 1000 * 60 * 30, // 30 minutes
    retry: (failureCount, error: any) => {
      return failureCount < 3;
    },
  });
};

// Get specific knowledge base article hook
export const useKnowledgeBaseArticle = (articleId: string) => {
  return useQuery({
    queryKey: ['knowledge-base-article', articleId],
    queryFn: async (): Promise<KnowledgeBaseArticle> => {
      const response = await VendorAxiosWithToken.get(`${VENDOR_SUPPORT_ENDPOINTS.KNOWLEDGE_BASE}${articleId}/`);
      return response.data;
    },
    enabled: !!articleId,
    staleTime: 1000 * 60 * 15, // 15 minutes
    retry: (failureCount, error: any) => {
      return failureCount < 3;
    },
  });
};

// Submit contact form hook
export const useSubmitContactForm = () => {
  return useMutation({
    mutationFn: async (contactData: ContactForm) => {
      const response = await VendorAxiosWithToken.post(VENDOR_SUPPORT_ENDPOINTS.CONTACT_FORM, contactData);
      return response.data;
    },
    onError: (error: any) => {
      console.error('Contact form submission error:', error);
    },
  });
};

// Vote on knowledge base article hook
export const useVoteOnArticle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ articleId, vote }: { articleId: string; vote: 'helpful' | 'not_helpful' }) => {
      const response = await VendorAxiosWithToken.post(`${VENDOR_SUPPORT_ENDPOINTS.KNOWLEDGE_BASE}${articleId}/vote/`, {
        vote
      });
      return response.data;
    },
    onSuccess: (data, variables) => {
      // Invalidate and refetch article details
      queryClient.invalidateQueries({ queryKey: ['knowledge-base-article', variables.articleId] });
      queryClient.invalidateQueries({ queryKey: ['knowledge-base-articles'] });
    },
  });
};

// Support utilities
export const SupportUtils = {
  getStatusColor: (status: string): string => {
    const colors = {
      'open': 'blue',
      'in_progress': 'orange',
      'waiting_response': 'red',
      'resolved': 'green',
      'closed': 'gray'
    };
    return colors[status as keyof typeof colors] || 'gray';
  },

  getPriorityColor: (priority: string): string => {
    const colors = {
      'low': 'gray',
      'normal': 'blue',
      'high': 'orange',
      'urgent': 'red'
    };
    return colors[priority as keyof typeof colors] || 'gray';
  },

  getCategoryDisplayName: (category: string): string => {
    const names = {
      'technical': 'Technical Issue',
      'billing': 'Billing & Payments',
      'rfq_inquiry': 'RFQ Inquiry',
      'account': 'Account Access',
      'portal_issue': 'Portal Issue',
      'general': 'General Support'
    };
    return names[category as keyof typeof names] || category;
  },

  formatFileSize: (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },

  getEstimatedResponseTime: (priority: string): string => {
    const times = {
      'urgent': 'Within 2 hours',
      'high': 'Within 4 hours',
      'normal': 'Within 24 hours',
      'low': 'Within 48 hours'
    };
    return times[priority as keyof typeof times] || 'Within 24 hours';
  }
};