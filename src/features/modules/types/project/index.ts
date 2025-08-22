// Beneficiary types
export interface BeneficiaryData {
  id: string;
  name: string;
  description?: string;
  beneficiary_type?: 'individual' | 'household' | 'community' | 'organization' | 'institution';
  category?: string;
  sub_category?: string;
  target_number?: number;
  current_number?: number;
  demographics?: {
    age_groups?: {
      [key: string]: number;
    };
    gender_distribution?: {
      male?: number;
      female?: number;
      other?: number;
    };
    location_distribution?: {
      [location: string]: number;
    };
  };
  eligibility_criteria?: string[];
  selection_method?: string;
  verification_requirements?: string[];
  benefits_provided?: string[];
  status?: 'registered' | 'verified' | 'active' | 'graduated' | 'inactive';
  registration_date?: string;
  created_at: string;
  updated_at: string;
}

export interface BeneficiaryFormValues {
  name: string;
  description?: string;
  beneficiary_type?: 'individual' | 'household' | 'community' | 'organization' | 'institution';
  category?: string;
  sub_category?: string;
  target_number?: number;
  current_number?: number;
  demographics?: {
    age_groups?: {
      [key: string]: number;
    };
    gender_distribution?: {
      male?: number;
      female?: number;
      other?: number;
    };
    location_distribution?: {
      [location: string]: number;
    };
  };
  eligibility_criteria?: string[];
  selection_method?: string;
  verification_requirements?: string[];
  benefits_provided?: string[];
  status?: 'registered' | 'verified' | 'active' | 'graduated' | 'inactive';
  registration_date?: string;
}

// Document Type types
export interface DocumentTypeData {
  id: string;
  name: string;
  description?: string;
  category?: 'project' | 'financial' | 'legal' | 'technical' | 'administrative' | 'compliance';
  document_format?: 'pdf' | 'word' | 'excel' | 'powerpoint' | 'image' | 'video' | 'audio' | 'other';
  template_available?: boolean;
  template_url?: string;
  is_mandatory?: boolean;
  retention_period_months?: number;
  access_level?: 'public' | 'internal' | 'restricted' | 'confidential';
  approval_required?: boolean;
  approval_workflow?: string[];
  version_control?: boolean;
  file_size_limit_mb?: number;
  allowed_extensions?: string[];
  metadata_fields?: DocumentMetadataField[];
  is_active?: boolean;
  created_at: string;
  updated_at: string;
}

export interface DocumentMetadataField {
  field_name: string;
  field_type: 'text' | 'number' | 'date' | 'boolean' | 'select' | 'multi_select';
  is_required: boolean;
  options?: string[];
  default_value?: string;
}

export interface DocumentTypeFormValues {
  name: string;
  description?: string;
  category?: 'project' | 'financial' | 'legal' | 'technical' | 'administrative' | 'compliance';
  document_format?: 'pdf' | 'word' | 'excel' | 'powerpoint' | 'image' | 'video' | 'audio' | 'other';
  template_available?: boolean;
  template_url?: string;
  is_mandatory?: boolean;
  retention_period_months?: number;
  access_level?: 'public' | 'internal' | 'restricted' | 'confidential';
  approval_required?: boolean;
  approval_workflow?: string[];
  version_control?: boolean;
  file_size_limit_mb?: number;
  allowed_extensions?: string[];
  metadata_fields?: DocumentMetadataFieldFormValues[];
  is_active?: boolean;
}

export interface DocumentMetadataFieldFormValues {
  field_name: string;
  field_type: 'text' | 'number' | 'date' | 'boolean' | 'select' | 'multi_select';
  is_required: boolean;
  options?: string[];
  default_value?: string;
}

// Funding Source types
export interface FundingSourceData {
  id: string;
  name: string;
  description?: string;
  funding_type?: 'grant' | 'loan' | 'donation' | 'government' | 'private' | 'multilateral' | 'bilateral';
  source_category?: 'donor' | 'government' | 'foundation' | 'corporate' | 'individual' | 'crowdfunding';
  contact_information?: {
    contact_person?: string;
    email?: string;
    phone?: string;
    address?: string;
    website?: string;
  };
  funding_requirements?: {
    application_deadline?: string;
    reporting_frequency?: string;
    eligible_sectors?: string[];
    geographic_focus?: string[];
    minimum_amount?: number;
    maximum_amount?: number;
    currency?: string;
  };
  compliance_requirements?: {
    audit_required?: boolean;
    financial_reporting?: string[];
    technical_reporting?: string[];
    procurement_guidelines?: string;
    branding_requirements?: string;
  };
  terms_conditions?: {
    funding_duration?: string;
    renewable?: boolean;
    matching_requirement?: number;
    overhead_rate?: number;
    prepayment_allowed?: boolean;
  };
  status?: 'active' | 'inactive' | 'suspended' | 'under_review';
  relationship_manager?: string;
  last_interaction_date?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface FundingSourceFormValues {
  name: string;
  description?: string;
  funding_type?: 'grant' | 'loan' | 'donation' | 'government' | 'private' | 'multilateral' | 'bilateral';
  source_category?: 'donor' | 'government' | 'foundation' | 'corporate' | 'individual' | 'crowdfunding';
  contact_information?: {
    contact_person?: string;
    email?: string;
    phone?: string;
    address?: string;
    website?: string;
  };
  funding_requirements?: {
    application_deadline?: string;
    reporting_frequency?: string;
    eligible_sectors?: string[];
    geographic_focus?: string[];
    minimum_amount?: number;
    maximum_amount?: number;
    currency?: string;
  };
  compliance_requirements?: {
    audit_required?: boolean;
    financial_reporting?: string[];
    technical_reporting?: string[];
    procurement_guidelines?: string;
    branding_requirements?: string;
  };
  terms_conditions?: {
    funding_duration?: string;
    renewable?: boolean;
    matching_requirement?: number;
    overhead_rate?: number;
    prepayment_allowed?: boolean;
  };
  status?: 'active' | 'inactive' | 'suspended' | 'under_review';
  relationship_manager?: string;
  last_interaction_date?: string;
  notes?: string;
}

// Partner types
export interface PartnerData {
  id: string;
  name: string;
  description?: string;
  partner_type?: 'implementing' | 'funding' | 'technical' | 'government' | 'private_sector' | 'ngo' | 'academic' | 'community';
  organization_type?: 'ngo' | 'government' | 'private' | 'academic' | 'international' | 'community_based' | 'faith_based';
  registration_details?: {
    registration_number?: string;
    registration_country?: string;
    tax_id?: string;
    legal_status?: string;
    incorporation_date?: string;
  };
  contact_information?: {
    primary_contact?: string;
    title?: string;
    email?: string;
    phone?: string;
    mobile?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    postal_code?: string;
    website?: string;
  };
  organizational_capacity?: {
    staff_count?: number;
    annual_budget?: number;
    years_of_experience?: number;
    geographic_coverage?: string[];
    sector_expertise?: string[];
    languages?: string[];
    certifications?: string[];
  };
  financial_information?: {
    banking_details?: {
      bank_name?: string;
      account_number?: string;
      swift_code?: string;
      branch_address?: string;
    };
    financial_management_system?: string;
    audit_firm?: string;
    last_audit_date?: string;
  };
  partnership_history?: {
    previous_collaborations?: string[];
    performance_rating?: number;
    contract_compliance?: 'excellent' | 'good' | 'fair' | 'poor';
    last_partnership_date?: string;
  };
  status?: 'active' | 'inactive' | 'under_review' | 'suspended' | 'blacklisted';
  approval_status?: 'pending' | 'approved' | 'rejected' | 'conditionally_approved';
  risk_rating?: 'low' | 'medium' | 'high' | 'critical';
  due_diligence_date?: string;
  next_review_date?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface PartnerFormValues {
  name: string;
  description?: string;
  partner_type?: 'implementing' | 'funding' | 'technical' | 'government' | 'private_sector' | 'ngo' | 'academic' | 'community';
  organization_type?: 'ngo' | 'government' | 'private' | 'academic' | 'international' | 'community_based' | 'faith_based';
  registration_details?: {
    registration_number?: string;
    registration_country?: string;
    tax_id?: string;
    legal_status?: string;
    incorporation_date?: string;
  };
  contact_information?: {
    primary_contact?: string;
    title?: string;
    email?: string;
    phone?: string;
    mobile?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    postal_code?: string;
    website?: string;
  };
  organizational_capacity?: {
    staff_count?: number;
    annual_budget?: number;
    years_of_experience?: number;
    geographic_coverage?: string[];
    sector_expertise?: string[];
    languages?: string[];
    certifications?: string[];
  };
  financial_information?: {
    banking_details?: {
      bank_name?: string;
      account_number?: string;
      swift_code?: string;
      branch_address?: string;
    };
    financial_management_system?: string;
    audit_firm?: string;
    last_audit_date?: string;
  };
  partnership_history?: {
    previous_collaborations?: string[];
    performance_rating?: number;
    contract_compliance?: 'excellent' | 'good' | 'fair' | 'poor';
    last_partnership_date?: string;
  };
  status?: 'active' | 'inactive' | 'under_review' | 'suspended' | 'blacklisted';
  approval_status?: 'pending' | 'approved' | 'rejected' | 'conditionally_approved';
  risk_rating?: 'low' | 'medium' | 'high' | 'critical';
  due_diligence_date?: string;
  next_review_date?: string;
  notes?: string;
}

// Legacy type exports for backward compatibility
export type TBeneficiaryData = BeneficiaryData;
export type TBeneficiaryFormValues = BeneficiaryFormValues;
export type TDocumentTypeData = DocumentTypeData;
export type TDocumentTypeFormValues = DocumentTypeFormValues;
export type TFundingSourceData = FundingSourceData;
export type TFundingSourceFormValues = FundingSourceFormValues;
export type TPartnerData = PartnerData;
export type TPartnerFormValues = PartnerFormValues;