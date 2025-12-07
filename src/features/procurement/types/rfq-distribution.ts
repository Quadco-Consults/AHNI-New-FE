export type RFQSolicitationType =
  | 'LIMITED_SOLICITATION'     // All prequalified vendors in category
  | 'CLOSED_SOLICITATION'     // Selected prequalified vendors only
  | 'SINGLE_SOURCING'         // One specific prequalified vendor
  | 'NATIONAL_OPEN_TENDER';   // Public EOI (not distributed directly)

export type VendorQualificationStatus =
  | 'PREQUALIFIED'            // Can receive RFQ adverts
  | 'PENDING'                 // Under review, cannot receive RFQs
  | 'DISQUALIFIED'            // Cannot receive RFQs
  | 'SUSPENDED';              // Temporarily cannot receive RFQs

export interface RFQDistributionCriteria {
  solicitation_type: RFQSolicitationType;
  categories: string[];
  selected_vendors?: string[];     // For closed solicitation & single sourcing
  min_qualification_score?: number;
  geographical_restrictions?: string[];
  exclude_vendors?: string[];      // Vendors to exclude from distribution
  require_certifications?: string[];
}

export interface VendorEligibility {
  vendor_id: string;
  company_name: string;
  email: string;
  qualification_status: VendorQualificationStatus;
  approved_categories: string[];
  qualification_score?: number;
  geographical_coverage: string[];
  certifications: string[];
  last_performance_rating?: number;
  is_eligible: boolean;
  eligibility_reasons: string[];
}

export interface RFQNotification {
  id: string;
  rfq_id: string;
  rfq_title: string;
  vendor_id: string;
  notification_type: 'EMAIL' | 'PORTAL' | 'BOTH';
  sent_date: string;
  read_date?: string;
  status: 'PENDING' | 'SENT' | 'DELIVERED' | 'READ' | 'FAILED';
  retry_count: number;
  error_message?: string;
}

export interface RFQDistributionResult {
  rfq_id: string;
  total_eligible_vendors: number;
  notifications_sent: number;
  failed_notifications: number;
  eligible_vendors: VendorEligibility[];
  notification_results: RFQNotification[];
  distribution_summary: {
    by_category: Record<string, number>;
    by_geographical_area: Record<string, number>;
    by_qualification_score: Record<string, number>;
  };
}

export interface RFQAdvertisement {
  rfq_id: string;
  title: string;
  description: string;
  categories: string[];
  estimated_value?: number;
  submission_deadline: string;
  opening_date: string;
  solicitation_type: RFQSolicitationType;
  technical_requirements_summary: string;
  contact_person: {
    name: string;
    email: string;
    phone?: string;
  };
  documents_available: boolean;
  pre_bid_meeting?: {
    date: string;
    location: string;
    is_mandatory: boolean;
  };
}

// Email template data structure
export interface RFQEmailTemplate {
  subject: string;
  greeting: string;
  rfq_summary: string;
  key_details: {
    deadline: string;
    estimated_value?: string;
    categories: string[];
  };
  call_to_action: {
    portal_link: string;
    button_text: string;
  };
  footer: string;
  unsubscribe_link?: string;
}