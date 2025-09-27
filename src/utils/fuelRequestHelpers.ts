/**
 * Fuel Request Utility Functions
 * Standardizes data handling across the fuel request system
 */

// Standardize API response data extraction
export const standardizeApiResponse = (response: any) => {
  // Handle different response structures consistently
  if (response?.data?.results) return response.data.results;
  if (response?.results) return response.results;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response)) return response;
  return [];
};

// Standardize pagination data extraction
export const extractPaginationData = (response: any) => {
  const pagination = response?.data?.paginator || response?.data?.pagination || response?.pagination;

  return {
    count: pagination?.count || 0,
    page: pagination?.page || 1,
    pageSize: pagination?.page_size || pagination?.pageSize || 10,
    totalPages: pagination?.total_pages || pagination?.totalPages || 1,
    hasNext: !!pagination?.next || !!pagination?.next_page_number,
    hasPrevious: !!pagination?.previous || !!pagination?.previous_page_number,
  };
};

// Format currency consistently
export const formatCurrency = (amount: string | number): string => {
  const numValue = typeof amount === 'string' ? parseFloat(amount) : amount;
  return `₦${(numValue || 0).toLocaleString()}`;
};

// Format fuel quantity consistently
export const formatFuelQuantity = (quantity: number): string => {
  return `${(quantity || 0).toLocaleString()} L`;
};

// Format odometer reading consistently
export const formatOdometer = (reading: number): string => {
  return `${(reading || 0).toLocaleString()} km`;
};

// Get status badge CSS classes
export const getStatusBadgeClass = (status: string): string => {
  const statusClasses = {
    PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
    APPROVED: "bg-green-100 text-green-800 border-green-200",
    REJECTED: "bg-red-100 text-red-800 border-red-200",
    DRAFT: "bg-gray-100 text-gray-800 border-gray-200",
  };
  return statusClasses[status as keyof typeof statusClasses] || "bg-gray-100 text-gray-800 border-gray-200";
};

// Calculate fuel efficiency metrics
export interface FuelMetrics {
  totalFuel: number;
  totalCost: number;
  totalDistance: number;
  averageConsumption: number;
  averageCostPerKm: number;
  averageFuelPrice: number;
  recordCount: number;
}

export const calculateFuelMetrics = (records: any[]): FuelMetrics => {
  const validRecords = records.filter(record => record.quantity && record.amount);

  const totalFuel = validRecords.reduce((sum, record) => sum + (record.quantity || 0), 0);
  const totalCost = validRecords.reduce((sum, record) => sum + parseFloat(record.amount || '0'), 0);
  const totalDistance = validRecords.reduce((sum, record) => sum + (record.distance_covered || 0), 0);

  return {
    totalFuel,
    totalCost,
    totalDistance,
    averageConsumption: totalDistance > 0 ? (totalFuel / totalDistance) * 100 : 0,
    averageCostPerKm: totalDistance > 0 ? totalCost / totalDistance : 0,
    averageFuelPrice: totalFuel > 0 ? totalCost / totalFuel : 0,
    recordCount: validRecords.length,
  };
};

// Validate fuel request form data
export const validateFuelRequestData = (data: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!data.asset) errors.push("Asset is required");
  if (!data.assigned_driver) errors.push("Driver is required");
  if (!data.vendor) errors.push("Vendor is required");
  if (!data.location) errors.push("Location is required");
  if (!data.date) errors.push("Date is required");
  if (!data.quantity || data.quantity <= 0) errors.push("Quantity must be greater than 0");
  if (!data.price_per_litre || data.price_per_litre <= 0) errors.push("Price per litre must be greater than 0");
  if (!data.odometer || data.odometer < 0) errors.push("Odometer reading is required");

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Generate fuel request summary text
export const generateFuelRequestSummary = (request: any): string => {
  const vehicle = request.asset?.name || request.asset || "Unknown Vehicle";
  const driver = request.assigned_driver?.first_name
    ? `${request.assigned_driver.first_name} ${request.assigned_driver.last_name}`
    : request.assigned_driver || "Unknown Driver";
  const quantity = formatFuelQuantity(request.quantity);
  const amount = formatCurrency(request.amount);

  return `${vehicle} - ${driver}: ${quantity} for ${amount}`;
};

// Filter options helper for dropdowns
export const createFilterOptions = (items: any[], labelKey: string, valueKey: string = 'id') => {
  return items.map(item => ({
    label: item[labelKey] || item.name || item.title,
    value: item[valueKey],
    item: item, // Keep original item for reference
  }));
};

// Debounce helper for search inputs
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): T => {
  let timeout: NodeJS.Timeout;

  return ((...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(null, args), wait);
  }) as T;
};

// Error message standardization
export const standardizeErrorMessage = (error: any): string => {
  if (typeof error === 'string') return error;
  if (error?.message) return error.message;
  if (error?.response?.data?.message) return error.response.data.message;
  if (error?.data?.message) return error.data.message;
  return "An unexpected error occurred. Please try again.";
};

// Date formatting helpers
export const formatFuelRequestDate = (date: string | Date): string => {
  try {
    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(new Date(date));
  } catch {
    return 'Invalid Date';
  }
};

export const formatFuelRequestDateTime = (date: string | Date): string => {
  try {
    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  } catch {
    return 'Invalid Date';
  }
};