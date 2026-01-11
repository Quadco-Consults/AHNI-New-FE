/**
 * Custom hook for fund request validation with cross-currency support
 * Integrates exchange rate fetching and validation logic
 */

import { useGetAllExchangeRatesManager } from "@/features/modules/controllers/config/exchangeRateController";
import { validateFundRequestData } from "@/features/programs/utils/fundRequestDisplayUtils";
import { useMemo } from "react";

interface FundRequestValidationOptions {
  enabled?: boolean;
  projectDisbursementSummary?: {
    total_disbursements: number;
    remaining_budget: number;
    budget_currency?: string;
  };
  availableBalance?: {
    amount: number;
    currency: string;
  };
}

export const useFundRequestValidation = (options: FundRequestValidationOptions = {}) => {
  const { enabled = true, projectDisbursementSummary, availableBalance } = options;

  // Fetch exchange rates
  const { data: exchangeRatesResponse, isLoading: isLoadingRates, error: ratesError } =
    useGetAllExchangeRatesManager({
      page: 1,
      size: 1000, // Get all exchange rates
      search: "",
      enabled
    });

  const exchangeRates = useMemo(() => {
    return exchangeRatesResponse?.data?.results || [];
  }, [exchangeRatesResponse]);

  // Validation function
  const validateFundRequest = useMemo(() => {
    return (data: any) => {
      return validateFundRequestData(
        data,
        projectDisbursementSummary,
        availableBalance,
        exchangeRates
      );
    };
  }, [projectDisbursementSummary, availableBalance, exchangeRates]);

  return {
    validateFundRequest,
    exchangeRates,
    isLoadingRates,
    ratesError,
    hasExchangeRates: exchangeRates.length > 0
  };
};

/**
 * Hook specifically for cross-currency validation alerts
 * Shows warnings when currencies don't match
 */
export const useCurrencyValidationAlerts = (
  requestCurrency: string,
  availableCurrency: string,
  exchangeRates: any[]
) => {
  return useMemo(() => {
    const needsConversion = requestCurrency && availableCurrency &&
                           requestCurrency.toUpperCase() !== availableCurrency.toUpperCase();

    if (!needsConversion) return null;

    const hasExchangeRate = exchangeRates.some(rate =>
      (rate.base_currency === requestCurrency && rate.target_currency === availableCurrency) ||
      (rate.base_currency === availableCurrency && rate.target_currency === requestCurrency)
    );

    return {
      needsConversion,
      hasExchangeRate,
      warning: !hasExchangeRate
        ? `Warning: No exchange rate available for ${requestCurrency} to ${availableCurrency} conversion. Validation may not be accurate.`
        : `Note: Fund request in ${requestCurrency} will be converted to ${availableCurrency} for validation against available balance.`
    };
  }, [requestCurrency, availableCurrency, exchangeRates]);
};