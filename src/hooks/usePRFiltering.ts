/**
 * Smart PR Filtering Hooks
 * Provides filtered Purchase Request lists for each procurement workflow
 */

import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/lib/axios";

// Types
export interface PRItem {
  id: string;
  name: string;
  quantity: number;
  unit_cost: string;
  amount: string;
}

export interface FilteredPR {
  id: string;
  ref_number: string;
  total_cost: string;
  items_count: number;
  items: PRItem[];
}

export interface RFQEligiblePR extends FilteredPR {}

export interface ServiceOrderEligiblePR extends FilteredPR {
  service_order_items_count: number;
}

export interface PaymentRequestEligiblePR extends FilteredPR {
  payment_category?: string;
  total_items?: number;
  categories?: {
    consultant: number;
    adhoc: number;
    facilitator: number;
    other: number;
  };
}

export interface PRClassification {
  pr_ref: string;
  status: string;
  total_cost: string;
  overall_method: string;
  documents_needed: string[];
  item_counts: {
    rfq: number;
    rfp: number;
    tender: number;
    service_order: number;
    payment_request: number;
  };
  payment_breakdown?: {
    consultant: number;
    adhoc: number;
    facilitator: number;
    other: number;
  };
}

export interface ProcurementDashboardStats {
  total_approved_prs: number;
  rfq_eligible: number;
  service_order_eligible: number;
  payment_request_eligible: number;
  payment_breakdown: {
    consultant: number;
    adhoc: number;
    facilitator: number;
    other: number;
  };
}

/**
 * Get PRs eligible for RFQ creation (physical goods only)
 */
export const useRFQEligiblePRs = (status: string = "Approved") => {
  return useQuery<{ count: number; prs: RFQEligiblePR[] }>({
    queryKey: ["rfq-eligible-prs", status],
    queryFn: async () => {
      const response = await AxiosWithToken.get(
        `/procurements/pr-filter/rfq-eligible/`,
        {
          params: { status },
        }
      );
      return response.data;
    },
  });
};

/**
 * Get PRs eligible for Service Order creation (recurring services only)
 */
export const useServiceOrderEligiblePRs = (status: string = "Approved") => {
  return useQuery<{ count: number; prs: ServiceOrderEligiblePR[] }>({
    queryKey: ["service-order-eligible-prs", status],
    queryFn: async () => {
      const response = await AxiosWithToken.get(
        `/procurements/pr-filter/service-order-eligible/`,
        {
          params: { status },
        }
      );
      return response.data;
    },
  });
};

/**
 * Get PRs eligible for Payment Request creation (personnel costs only)
 * @param category - Optional: CONSULTANT, ADHOC, FACILITATOR, OTHER
 */
export const usePaymentRequestEligiblePRs = (
  status: string = "Approved",
  category?: "CONSULTANT" | "ADHOC" | "FACILITATOR" | "OTHER"
) => {
  return useQuery<{
    count: number;
    category_filter: string | null;
    prs: PaymentRequestEligiblePR[];
  }>({
    queryKey: ["payment-request-eligible-prs", status, category],
    queryFn: async () => {
      const params: any = { status };
      if (category) {
        params.category = category;
      }

      const response = await AxiosWithToken.get(
        `/procurements/pr-filter/payment-request-eligible/`,
        { params }
      );
      return response.data;
    },
  });
};

/**
 * Get classification summary for a specific PR
 */
export const usePRClassification = (prId: string | null) => {
  return useQuery<PRClassification>({
    queryKey: ["pr-classification", prId],
    queryFn: async () => {
      if (!prId) throw new Error("PR ID is required");

      const response = await AxiosWithToken.get(
        `/procurements/pr-filter/pr-classification/${prId}/`
      );
      return response.data;
    },
    enabled: !!prId,
  });
};

/**
 * Get procurement dashboard statistics
 */
export const useProcurementDashboardStats = () => {
  return useQuery<ProcurementDashboardStats>({
    queryKey: ["procurement-dashboard-stats"],
    queryFn: async () => {
      const response = await AxiosWithToken.get(
        `/procurements/pr-filter/dashboard-stats/`
      );
      return response.data;
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });
};
