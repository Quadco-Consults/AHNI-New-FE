/**
 * Utility functions for cost calculations in procurement tracker
 */

export interface CostSavings {
  prValue: number;
  poValue: number;
  actualPayment: number;
  savingsAmount: number;
  savingsPercentage: number;
  paymentSavings: number;
  paymentSavingsPercentage: number;
}

/**
 * Calculate cost savings between PR value, PO value, and actual payment
 */
export const calculateCostSavings = (item: any): CostSavings => {
  // Get PR value - try multiple paths
  const prValue = item.purchase_request?.approved_budget ||
                  item.purchase_request?.budget_amount ||
                  item.purchase_request?.total_amount ||
                  item.purchase_request_value ||
                  item.approved_budget ||
                  item.budget_amount ||
                  0;

  // Get PO value - try multiple paths
  const poValue = item.purchase_order?.sub_total_amount ||
                  item.purchase_order?.total_amount ||
                  (item.purchase_order?.unit_cost * item.purchase_order?.quantity) ||
                  item.purchase_order?.unit_cost ||
                  item.sub_total_amount ||
                  item.total_amount ||
                  0;

  // Get actual payment amount - try multiple paths
  const actualPayment = item.actual_payment_amount ||
                       item.payment_amount ||
                       item.amount_paid ||
                       poValue;

  // Calculate savings between PR and PO
  const savingsAmount = prValue - poValue;
  const savingsPercentage = prValue > 0 ? (savingsAmount / prValue) * 100 : 0;

  // Calculate savings between PO and actual payment
  const paymentSavings = poValue - actualPayment;
  const paymentSavingsPercentage = poValue > 0 ? (paymentSavings / poValue) * 100 : 0;

  return {
    prValue,
    poValue,
    actualPayment,
    savingsAmount,
    savingsPercentage,
    paymentSavings,
    paymentSavingsPercentage
  };
};

/**
 * Format currency with proper formatting
 */
export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  if (isNaN(amount)) return 'N/A';

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return formatter.format(amount);
};

/**
 * Format percentage with proper formatting
 */
export const formatPercentage = (percentage: number): string => {
  if (isNaN(percentage)) return 'N/A';

  const sign = percentage >= 0 ? '+' : '';
  return `${sign}${percentage.toFixed(1)}%`;
};

/**
 * Get vendor evaluation status from vendor performance recommendations
 */
export const getVendorEvaluationStatus = (item: any, vendorEvaluations: any[] = []) => {
  const vendorName = item.purchase_order?.vendor || item.purchase_order?.vendor_name;

  if (!vendorName) return 'PENDING';

  // Find the vendor evaluation for this vendor
  const vendorEvaluation = vendorEvaluations.find(evaluation =>
    evaluation.vendor?.name === vendorName || evaluation.vendor === vendorName
  );

  if (vendorEvaluation) {
    // Return the evaluator recommendation
    const recommendation = vendorEvaluation.evaluator_recommendation;
    const status = vendorEvaluation.status;

    // If status is PENDING and recommendation is BARRED, show PENDING instead
    if (status === "PENDING" && recommendation === "BARRED") {
      return "PENDING";
    }

    return recommendation || 'PENDING';
  }

  // Fallback to performance score if no evaluation found
  const performanceScore = item.vendor_performance_score || item.purchase_order?.service_quality_rating;
  if (performanceScore) {
    if (performanceScore >= 4.5) return 'RETAIN';
    if (performanceScore >= 3.0) return 'ON_PROBATION';
    if (performanceScore < 3.0) return 'BARRED';
  }

  return 'PENDING';
};

/**
 * Get vendor status styling
 */
export const getVendorStatusStyling = (status: string) => {
  switch (status) {
    case 'RETAIN':
      return {
        className: 'bg-green-100 text-green-800',
        label: 'Retained'
      };
    case 'BARRED':
      return {
        className: 'bg-red-100 text-red-800',
        label: 'Barred'
      };
    case 'ON_PROBATION':
      return {
        className: 'bg-yellow-100 text-yellow-800',
        label: 'On Probation'
      };
    case 'PENDING':
      return {
        className: 'bg-blue-100 text-blue-800',
        label: 'Pending'
      };
    default:
      return {
        className: 'bg-gray-100 text-gray-800',
        label: 'Unknown'
      };
  }
};

/**
 * Get savings indicator styling
 */
export const getSavingsIndicator = (percentage: number) => {
  if (percentage > 0) {
    return {
      className: 'text-green-600 bg-green-50',
      icon: '↓',
      label: 'Saved'
    };
  } else if (percentage < 0) {
    return {
      className: 'text-red-600 bg-red-50',
      icon: '↑',
      label: 'Over Budget'
    };
  } else {
    return {
      className: 'text-gray-600 bg-gray-50',
      icon: '=',
      label: 'On Budget'
    };
  }
};