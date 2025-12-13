/**
 * Currency conversion utilities for fund request validation
 * Handles cross-currency comparisons using exchange rates
 */

import { IExchangeRate } from "@/features/admin/types/config/exchange-rate";

export interface CurrencyConversionResult {
  convertedAmount: number;
  exchangeRate: number | null;
  fromCurrency: string;
  toCurrency: string;
  conversionDate?: string;
}

/**
 * Convert an amount from one currency to another using exchange rates
 */
export const convertCurrency = (
  amount: number,
  fromCurrency: string,
  toCurrency: string,
  exchangeRates: IExchangeRate[]
): CurrencyConversionResult => {
  // If same currency, no conversion needed
  if (fromCurrency === toCurrency) {
    return {
      convertedAmount: amount,
      exchangeRate: 1,
      fromCurrency,
      toCurrency,
    };
  }

  // Find the most recent active exchange rate
  const relevantRates = exchangeRates
    .filter((rate) =>
      rate.is_active &&
      (
        (rate.base_currency === fromCurrency && rate.target_currency === toCurrency) ||
        (rate.base_currency === toCurrency && rate.target_currency === fromCurrency)
      )
    )
    .sort((a, b) => new Date(b.effective_date).getTime() - new Date(a.effective_date).getTime());

  if (relevantRates.length === 0) {
    // No exchange rate found, return original amount with warning
    console.warn(`No exchange rate found for ${fromCurrency} to ${toCurrency}`);
    return {
      convertedAmount: amount,
      exchangeRate: null,
      fromCurrency,
      toCurrency,
    };
  }

  const rate = relevantRates[0];
  let convertedAmount: number;
  let exchangeRate: number;

  if (rate.base_currency === fromCurrency && rate.target_currency === toCurrency) {
    // Direct conversion: fromCurrency -> toCurrency
    exchangeRate = rate.exchange_rate;
    convertedAmount = amount * exchangeRate;
  } else {
    // Inverse conversion: toCurrency -> fromCurrency (need to invert rate)
    exchangeRate = 1 / rate.exchange_rate;
    convertedAmount = amount * exchangeRate;
  }

  return {
    convertedAmount,
    exchangeRate,
    fromCurrency,
    toCurrency,
    conversionDate: rate.effective_date,
  };
};

/**
 * Get the latest exchange rate between two currencies
 */
export const getLatestExchangeRate = (
  fromCurrency: string,
  toCurrency: string,
  exchangeRates: IExchangeRate[]
): number | null => {
  const conversion = convertCurrency(1, fromCurrency, toCurrency, exchangeRates);
  return conversion.exchangeRate;
};

/**
 * Format currency amount with proper symbol
 */
export const formatCurrencyAmount = (
  amount: number,
  currency: string,
  includeConversion?: { originalAmount: number; originalCurrency: string; exchangeRate: number }
): string => {
  const getCurrencySymbol = (curr: string) => {
    switch (curr.toUpperCase()) {
      case 'USD': return '$';
      case 'NGN': return '₦';
      case 'EUR': return '€';
      case 'GBP': return '£';
      default: return curr + ' ';
    }
  };

  const formatted = `${getCurrencySymbol(currency)}${amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;

  if (includeConversion) {
    const originalFormatted = `${getCurrencySymbol(includeConversion.originalCurrency)}${includeConversion.originalAmount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
    return `${formatted} (converted from ${originalFormatted} @ ${includeConversion.exchangeRate})`;
  }

  return formatted;
};

/**
 * Check if currency conversion is needed for comparison
 */
export const needsCurrencyConversion = (currency1: string, currency2: string): boolean => {
  return currency1.toUpperCase() !== currency2.toUpperCase();
};

/**
 * Validate fund request amounts across different currencies
 */
export const validateCrossCurrencyAmounts = (
  requestAmount: number,
  requestCurrency: string,
  availableAmount: number,
  availableCurrency: string,
  exchangeRates: IExchangeRate[]
): {
  isValid: boolean;
  message?: string;
  convertedRequestAmount?: number;
  exchangeRateUsed?: number;
} => {
  if (!needsCurrencyConversion(requestCurrency, availableCurrency)) {
    // Same currency, direct comparison
    return {
      isValid: requestAmount <= availableAmount,
      message: requestAmount > availableAmount
        ? `Request amount ${formatCurrencyAmount(requestAmount, requestCurrency)} exceeds available ${formatCurrencyAmount(availableAmount, availableCurrency)}`
        : undefined
    };
  }

  // Convert request amount to available currency for comparison
  const conversion = convertCurrency(requestAmount, requestCurrency, availableCurrency, exchangeRates);

  if (conversion.exchangeRate === null) {
    return {
      isValid: false,
      message: `Cannot validate cross-currency amounts: No exchange rate available for ${requestCurrency} to ${availableCurrency}`,
    };
  }

  const isValid = conversion.convertedAmount <= availableAmount;

  return {
    isValid,
    convertedRequestAmount: conversion.convertedAmount,
    exchangeRateUsed: conversion.exchangeRate,
    message: !isValid
      ? `Request amount ${formatCurrencyAmount(conversion.convertedAmount, availableCurrency, {
          originalAmount: requestAmount,
          originalCurrency: requestCurrency,
          exchangeRate: conversion.exchangeRate
        })} exceeds available ${formatCurrencyAmount(availableAmount, availableCurrency)}`
      : undefined
  };
};