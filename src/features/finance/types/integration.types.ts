// Integration and Monitoring Types
export interface IntegrationStats {
  id: string;
  date: string;
  total_transactions: number;
  successful_integrations: number;
  failed_integrations: number;
  total_amount: number;
  modules: ModuleIntegrationStats[];
  created_at: string;
}

export interface ModuleIntegrationStats {
  module_name: string;
  transaction_count: number;
  success_count: number;
  failure_count: number;
  total_amount: number;
  success_rate: number;
  last_integration: string;
}

export interface IntegrationActivity {
  id: string;
  module_name: string;
  transaction_type: string;
  source_id: string;
  status: IntegrationStatus;
  amount: number;
  journal_entry?: string;
  error_message?: string;
  processed_at: string;
  created_at: string;
}

export type IntegrationStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'SUCCESS'
  | 'FAILED'
  | 'RETRY';

export interface SyncStatus {
  module_name: string;
  last_sync: string;
  next_sync: string;
  is_active: boolean;
  sync_frequency: string;
  status: 'RUNNING' | 'STOPPED' | 'ERROR';
  error_message?: string;
}

export interface FinancialAnalysis {
  period_start: string;
  period_end: string;
  total_transactions: number;
  total_amount: number;
  average_transaction_amount: number;
  daily_volume: DailyVolumeData[];
  module_breakdown: ModuleBreakdownData[];
  error_trends: ErrorTrendData[];
  integration_health_score: number;
}

export interface DailyVolumeData {
  date: string;
  transaction_count: number;
  total_amount: number;
}

export interface ModuleBreakdownData {
  module_name: string;
  transaction_count: number;
  total_amount: number;
  percentage: number;
  trend: 'UP' | 'DOWN' | 'STABLE';
}

export interface ErrorTrendData {
  date: string;
  error_count: number;
  error_types: {
    [key: string]: number;
  };
}

// Dashboard Widget Types
export interface DashboardWidget {
  id: string;
  title: string;
  type: WidgetType;
  size: WidgetSize;
  data: any;
  refresh_interval?: number;
}

export type WidgetType =
  | 'STAT_CARD'
  | 'LINE_CHART'
  | 'BAR_CHART'
  | 'PIE_CHART'
  | 'TABLE'
  | 'ALERT_LIST';

export type WidgetSize = 'SMALL' | 'MEDIUM' | 'LARGE' | 'FULL_WIDTH';

export interface AlertData {
  id: string;
  type: 'ERROR' | 'WARNING' | 'INFO';
  title: string;
  message: string;
  module: string;
  timestamp: string;
  is_resolved: boolean;
}

// Filter types for analysis
export interface IntegrationFilters {
  date_from?: string;
  date_to?: string;
  module?: string;
  status?: IntegrationStatus;
  amount_min?: number;
  amount_max?: number;
  page?: number;
  page_size?: number;
}