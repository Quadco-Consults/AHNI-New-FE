import { useQuery } from "@tanstack/react-query";
import ConsultantAxiosWithToken from "@/constants/api_management/ConsultantHttpHelper";
import { ConsultantAuthUtils } from "./consultantAuthController";

// Consultant dashboard endpoints
const CONSULTANT_DASHBOARD_ENDPOINTS = {
  DASHBOARD: "/contract-grants/consultant-portal/dashboard/",
  QUICK_STATS: "/contract-grants/consultant-portal/dashboard/quick-stats/",
};

export interface ConsultantDashboardData {
  consultant_info: {
    id: string;
    full_name: string;
    email: string;
    phone_number: string;
  };
  contract: {
    status: 'INCOMPLETE' | 'NOT_STARTED' | 'ACTIVE' | 'EXPIRING_SOON' | 'COMPLETED';
    start_date: string | null;
    end_date: string | null;
    days_remaining: number;
    days_worked: number;
    total_days: number;
    completion_percentage: number;
    monthly_pay: number | null;
  };
  payment_statistics: {
    total_payment_requests: number;
    pending_requests: number;
    reviewed_requests: number;
    authorized_requests: number;
    approved_requests: number;
    total_amount_requested: number;
    total_amount_approved: number;
    recent_requests_30_days: number;
    approval_rate: number;
  };
  recent_payments: Array<{
    id: string;
    payment_reason: string;
    payment_date: string;
    total_amount: number;
    status: string;
    created_at: string | null;
  }>;
  available_actions: {
    can_submit_payment_request: boolean;
    can_submit_timesheet: boolean;
    can_update_profile: boolean;
  };
  alerts: Array<{
    type: 'WARNING' | 'ERROR' | 'INFO';
    title: string;
    message: string;
    action: string;
  }>;
}

export interface ConsultantQuickStats {
  pending_payment_requests: number;
  approved_payment_requests: number;
  contract_days_remaining: number | null;
  last_payment_date: string | null;
}

// Consultant Dashboard Hook
export const useConsultantDashboard = () => {
  return useQuery({
    queryKey: ['consultant-dashboard'],
    queryFn: async (): Promise<ConsultantDashboardData> => {
      const response = await ConsultantAxiosWithToken.get(CONSULTANT_DASHBOARD_ENDPOINTS.DASHBOARD);
      return response.data.data || response.data;
    },
    enabled: ConsultantAuthUtils.isConsultantAuthenticated(),
    staleTime: 1000 * 60 * 2, // 2 minutes
    retry: 2,
  });
};

// Consultant Quick Stats Hook
export const useConsultantQuickStats = () => {
  return useQuery({
    queryKey: ['consultant-quick-stats'],
    queryFn: async (): Promise<ConsultantQuickStats> => {
      const response = await ConsultantAxiosWithToken.get(CONSULTANT_DASHBOARD_ENDPOINTS.QUICK_STATS);
      return response.data.data || response.data;
    },
    enabled: ConsultantAuthUtils.isConsultantAuthenticated(),
    refetchInterval: 1000 * 60, // Refresh every minute
    staleTime: 1000 * 30, // 30 seconds
    retry: 2,
  });
};
