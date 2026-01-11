import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: any) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number | string, currency: string = "NGN"): string {
  // Convert to number if it's a string
  const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;

  // Check if it's a valid number
  if (isNaN(numAmount)) {
    return "Invalid Amount";
  }

  // Determine locale based on currency
  const locale = currency === "USD" ? "en-US" : "en-NG";

  // Format the number with commas and two decimal places
  const formattedAmount = numAmount.toLocaleString(locale, {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return formattedAmount;
}

export const truncateStringLength = (str: string, limit: number) => {
  if (str === null || str === undefined) return "";
  return str.length > limit ? str.substring(0, limit) + " ..." : str;
};
