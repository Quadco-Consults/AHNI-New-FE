import { useQuery, useMutation } from "@tanstack/react-query";
import AxiosWithoutToken from "@/constants/api_management/MyHttpHelper";
import { VendorCategory } from "../types/vendor-auth";

// Public opportunity interfaces
export interface PublicOpportunity {
  id: string;
  opportunity_number: string;
  name: string;
  description: string;
  type: 'EOI' | 'RFQ' | 'Adhoc Advert' | 'Consultant Advert' | 'Facilitator Advert' | 'Subgrant Advert';
  status: string;
  opening_date: string;
  closing_date: string;
  days_remaining: number;
  categories: VendorCategory[];
  document?: string;
  registered_vendors_count?: number;
  application_method?: 'portal' | 'email' | 'external';
  contact_email?: string;
}

// Legacy interface for EOI backward compatibility
export interface PublicEOI extends PublicOpportunity {
  eoi_number: string;
}

export interface EOIDetails extends PublicEOI {
  hours_remaining: number;
  requirements: string;
  application_process: string;
  contact_information: {
    email: string;
    phone: string;
  };
  documents: Array<{
    name: string;
    url: string;
  }>;
}

export interface VendorRegistrationData {
  eoi: string;
  company_name: string;
  email: string;
  company_registration_number: string;
  year_or_incorperation: string;
  type_of_business: string;
  categories: string[];
  incorporation_certificate: File;
  tax_clearance_certificate: File;
  company_profile: File;
}

export interface RegistrationResponse {
  status: string;
  message: string;
  data: {
    vendor_id: string;
    registration_number: string;
    status: string;
    submitted_categories: VendorCategory[];
    next_steps: string[];
  };
}

// Public EOI endpoints
const PUBLIC_EOI_ENDPOINTS = {
  LIST: "/public/available-eois/",
  DETAILS: (id: string) => `/public/available-eois/${id}/`,
  REGISTER: "/public/vendor-registration/",
};

// Get all available EOIs (public access)
export const usePublicEOIs = () => {
  return useQuery({
    queryKey: ['public-eois'],
    queryFn: async (): Promise<{
      count: number;
      message: string;
      results: PublicEOI[];
    }> => {
      // Development mode: return mock data to avoid API dependency
      if (process.env.NODE_ENV === 'development') {
        const mockEOIs: PublicEOI[] = [
          {
            id: 'eoi_1',
            eoi_number: 'EOI-2024-001',
            opportunity_number: 'EOI-2024-001',
            name: 'Healthcare Equipment Suppliers',
            description: 'Registration for healthcare equipment suppliers across Nigeria',
            type: 'EOI',
            status: 'OPEN',
            opening_date: '2024-11-01T00:00:00Z',
            closing_date: '2024-12-31T23:59:59Z',
            days_remaining: 24,
            categories: [
              { id: '1', name: 'Medical Equipment' },
              { id: '2', name: 'Healthcare Supplies' }
            ],
            document: '/docs/healthcare-eoi-requirements.pdf',
            registered_vendors_count: 45,
            application_method: 'portal',
          },
          {
            id: 'eoi_2',
            eoi_number: 'EOI-2024-002',
            opportunity_number: 'EOI-2024-002',
            name: 'IT Services and Solutions Providers',
            description: 'Expression of Interest for IT services and solutions providers',
            type: 'EOI',
            status: 'OPEN',
            opening_date: '2024-11-15T00:00:00Z',
            closing_date: '2025-01-15T23:59:59Z',
            days_remaining: 39,
            categories: [
              { id: '3', name: 'Information Technology' },
              { id: '4', name: 'Software Development' }
            ],
            document: '/docs/it-eoi-requirements.pdf',
            registered_vendors_count: 32,
            application_method: 'portal',
          }
        ];

        return {
          count: mockEOIs.length,
          message: 'Mock EOI data loaded successfully',
          results: mockEOIs
        };
      }

      const response = await AxiosWithoutToken.get(PUBLIC_EOI_ENDPOINTS.LIST);
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2, // Reduced retry count
    refetchOnWindowFocus: false, // Prevent unnecessary refetches
    refetchOnMount: false, // Prevent refetch on mount if data exists
  });
};

// Get specific EOI details (public access)
export const usePublicEOIDetails = (eoiId: string) => {
  return useQuery({
    queryKey: ['public-eoi-details', eoiId],
    queryFn: async (): Promise<EOIDetails> => {
      const response = await AxiosWithoutToken.get(PUBLIC_EOI_ENDPOINTS.DETAILS(eoiId));
      return response.data;
    },
    enabled: !!eoiId,
    staleTime: 1000 * 60 * 10, // 10 minutes
    retry: 3,
  });
};

// Submit vendor registration (public access)
export const useVendorRegistration = () => {
  return useMutation({
    mutationFn: async (registrationData: VendorRegistrationData): Promise<RegistrationResponse> => {
      const formData = new FormData();

      // Add all text fields
      formData.append('eoi', registrationData.eoi);
      formData.append('company_name', registrationData.company_name);
      formData.append('email', registrationData.email);
      formData.append('company_registration_number', registrationData.company_registration_number);
      formData.append('year_or_incorperation', registrationData.year_or_incorperation);
      formData.append('type_of_business', registrationData.type_of_business);
      formData.append('categories', JSON.stringify(registrationData.categories));

      // Add file attachments
      formData.append('incorporation_certificate', registrationData.incorporation_certificate);
      formData.append('tax_clearance_certificate', registrationData.tax_clearance_certificate);
      formData.append('company_profile', registrationData.company_profile);

      const response = await AxiosWithoutToken.post(PUBLIC_EOI_ENDPOINTS.REGISTER, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    },
  });
};

// Utility functions for EOI data
export const EOIUtils = {
  getDaysRemaining: (closingDate: string): number => {
    const days = Math.ceil((new Date(closingDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(0, days);
  },

  isClosingSoon: (closingDate: string): boolean => {
    return EOIUtils.getDaysRemaining(closingDate) <= 7;
  },

  isExpired: (closingDate: string): boolean => {
    return new Date(closingDate) < new Date();
  },

  getUrgencyLevel: (daysRemaining: number): 'urgent' | 'high' | 'medium' | 'low' => {
    if (daysRemaining <= 3) return 'urgent';
    if (daysRemaining <= 7) return 'high';
    if (daysRemaining <= 14) return 'medium';
    return 'low';
  },

  getUrgencyColor: (urgency: string): string => {
    switch (urgency) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-green-100 text-green-800';
    }
  },

  formatDate: (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  },

  getStatusBadgeVariant: (status: string): 'default' | 'secondary' | 'destructive' | 'outline' => {
    switch (status.toUpperCase()) {
      case 'OPEN': return 'default';
      case 'CLOSED': return 'destructive';
      case 'DRAFT': return 'secondary';
      default: return 'outline';
    }
  },

  getApplicationMethod: (opportunityType: string): {
    method: 'portal' | 'email' | 'external';
    email?: string;
    buttonText: string;
  } => {
    switch (opportunityType) {
      case 'EOI':
      case 'Expression of Interest':
        return {
          method: 'portal',
          buttonText: 'View Details'
        };
      case 'RFQ':
        return {
          method: 'portal',
          buttonText: 'Access Portal'
        };
      case 'Consultant Advert':
        return {
          method: 'email',
          email: 'consultants@ahnigeria.org',
          buttonText: 'Apply Now'
        };
      case 'Facilitator Advert':
        return {
          method: 'email',
          email: 'facilitators@ahnigeria.org',
          buttonText: 'Apply Now'
        };
      case 'Adhoc Advert':
        return {
          method: 'email',
          email: 'opportunities@ahnigeria.org',
          buttonText: 'Apply Now'
        };
      case 'Subgrant Advert':
        return {
          method: 'email',
          email: 'grants@ahnigeria.org',
          buttonText: 'Apply Now'
        };
      default:
        return {
          method: 'email',
          email: 'info@ahnigeria.org',
          buttonText: 'Apply Now'
        };
    }
  },

  getOpportunityTypeColor: (opportunityType: string): string => {
    switch (opportunityType) {
      case 'EOI':
      case 'Expression of Interest':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'RFQ':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Consultant Advert':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Facilitator Advert':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Adhoc Advert':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'Subgrant Advert':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  }
};