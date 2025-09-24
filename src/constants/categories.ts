/**
 * Category Constants for Fuel Request System
 * Centralizes category IDs to avoid hardcoding throughout the application
 */

export const CATEGORY_IDS = {
  // Vehicle/Asset categories
  VEHICLE: "b0983944-f926-4141-8e28-093960d75246",

  // Vendor categories
  FUEL_SUPPLIERS: "e74bab4f-3059-430c-ae5d-143af5463275",
  GENERAL_ASSETS: "c76a93b5-b391-4ff8-81e1-758dc5c21a7f",
  CONSUMABLES: "fadb6228-23de-4b04-9eac-b75940cf622f",
  IT_HARDWARE: "801261e9-24e4-44a2-a295-cb8064761ced",
  LABORATORY_EQUIPMENT: "5e84b735-0e11-451d-9056-b7f51ec49cdc",
  SECURITY_EQUIPMENT: "c9aa609a-1b56-43e7-9097-8d7586224c53",
  TICKETING: "78791bc1-45e4-4ea0-9afb-1ec3db045f8a",
  ASSETS: "17ca9ee7-603a-43a9-91e8-979652a8231c",
} as const;

// Type-safe category access
export type CategoryId = typeof CATEGORY_IDS[keyof typeof CATEGORY_IDS];

// Helper functions
export const getCategoryId = (categoryName: keyof typeof CATEGORY_IDS): string => {
  return CATEGORY_IDS[categoryName];
};

// Pagination defaults for better performance
export const PAGINATION_DEFAULTS = {
  DROPDOWN_SIZE: 100, // Instead of 2M records
  TABLE_SIZE: 20,
  SEARCH_DELAY: 300, // ms for search debounce
} as const;