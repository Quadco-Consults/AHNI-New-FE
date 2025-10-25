// QuickBooks Integration Types
export interface QuickBooksAuth {
  id: string;
  company_id: string;
  company_name: string;
  access_token: string;
  refresh_token: string;
  token_expires_at: string;
  realm_id: string;
  is_active: boolean;
  last_sync: string;
  created_at: string;
  updated_at: string;
}

export interface EntityMapping {
  id: string;
  erp_entity_type: ERPEntityType;
  erp_entity_id: string;
  quickbooks_entity_type: QuickBooksEntityType;
  quickbooks_entity_id: string;
  mapping_data: any;
  is_active: boolean;
  last_synced: string;
  created_at: string;
  updated_at: string;
}

export type ERPEntityType =
  | 'CHART_OF_ACCOUNT'
  | 'CUSTOMER'
  | 'VENDOR'
  | 'ITEM'
  | 'EMPLOYEE'
  | 'DEPARTMENT'
  | 'PROJECT';

export type QuickBooksEntityType =
  | 'Account'
  | 'Customer'
  | 'Vendor'
  | 'Item'
  | 'Employee'
  | 'Class'
  | 'Department';

export interface SyncLog {
  id: string;
  sync_type: SyncType;
  entity_type: string;
  status: SyncLogStatus;
  records_processed: number;
  records_successful: number;
  records_failed: number;
  error_details?: SyncError[];
  started_at: string;
  completed_at?: string;
  duration_seconds?: number;
}

export type SyncType =
  | 'FULL_SYNC'
  | 'INCREMENTAL_SYNC'
  | 'MANUAL_SYNC'
  | 'REAL_TIME_SYNC';

export type SyncLogStatus =
  | 'PENDING'
  | 'RUNNING'
  | 'COMPLETED'
  | 'FAILED'
  | 'PARTIAL';

export interface SyncError {
  entity_id: string;
  error_code: string;
  error_message: string;
  error_details?: any;
}

export interface QuickBooksCompany {
  CompanyName: string;
  CompanyAddr: QuickBooksAddress;
  LegalAddr: QuickBooksAddress;
  CustomerCommunicationAddr: QuickBooksAddress;
  Country: string;
  QBVersion: string;
  SupportedLanguages: string;
  CompanyStartDate: string;
  FiscalYearStartMonth: string;
  domain: string;
  sparse: boolean;
  Id: string;
  SyncToken: string;
  MetaData: QuickBooksMetaData;
}

export interface QuickBooksAddress {
  Id: string;
  Line1?: string;
  Line2?: string;
  City?: string;
  Country?: string;
  CountrySubDivisionCode?: string;
  PostalCode?: string;
}

export interface QuickBooksMetaData {
  CreateTime: string;
  LastUpdatedTime: string;
}

export interface QuickBooksAccount {
  Id: string;
  Name: string;
  SubAccount: boolean;
  ParentRef?: QuickBooksReference;
  FullyQualifiedName: string;
  Active: boolean;
  Classification: string;
  AccountType: string;
  AccountSubType: string;
  CurrentBalance: number;
  CurrentBalanceWithSubAccounts: number;
  CurrencyRef: QuickBooksReference;
  domain: string;
  sparse: boolean;
  SyncToken: string;
  MetaData: QuickBooksMetaData;
}

export interface QuickBooksReference {
  value: string;
  name?: string;
}

export interface SyncConfiguration {
  id: string;
  entity_type: string;
  is_enabled: boolean;
  sync_frequency: SyncFrequency;
  auto_sync: boolean;
  field_mappings: FieldMapping[];
  last_sync: string;
  next_sync: string;
}

export type SyncFrequency =
  | 'REAL_TIME'
  | 'HOURLY'
  | 'DAILY'
  | 'WEEKLY'
  | 'MANUAL';

export interface FieldMapping {
  erp_field: string;
  quickbooks_field: string;
  transformation?: string;
  is_required: boolean;
  default_value?: any;
}

// Form data types
export interface EntityMappingFormData {
  erp_entity_type: ERPEntityType;
  erp_entity_id: string;
  quickbooks_entity_type: QuickBooksEntityType;
  quickbooks_entity_id: string;
  mapping_data?: any;
  is_active: boolean;
}

export interface SyncConfigurationFormData {
  entity_type: string;
  is_enabled: boolean;
  sync_frequency: SyncFrequency;
  auto_sync: boolean;
  field_mappings: FieldMapping[];
}