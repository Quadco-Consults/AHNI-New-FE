export function objectToFormData(data: any) {
  const fd = new FormData();
  for (const key in data) {
    fd.set(key, data[key]);
  }
  return fd;
}

export function formatNumberCurrency(
  value: number | string | null | undefined,
  currencyCode?: string
) {
  // Return a default value if value is null or undefined
  if (value === null || value === undefined) {
    return currencyCode === "NGN" ? "₦0.00" : "$0.00";
  }

  // Determine currency symbol based on currency code
  const currency = currencyCode === "NGN" ? "₦" : "$";

  // Convert budget to number if it's a string
  const amount = typeof value === "string" ? parseFloat(value) : value;

  // Handle NaN that could result from parsing invalid strings
  if (isNaN(amount)) {
    return currencyCode === "NGN" ? "₦0.00" : "$0.00";
  }

  // Format with commas using toLocaleString
  const formattedAmount = amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  // Return formatted string with currency symbol
  return `${currency}${formattedAmount}`;
}

export const getPageTitleFromPath = (pathname: string): string => {
  // Handle paths with query parameters
  const pathWithoutQuery = pathname.split("?")[0];

  // Split the path into segments and filter out empty segments
  const segments: string[] = pathWithoutQuery
    .split("/")
    .filter((segment) => segment);

  if (segments.length === 0) {
    return "Home"; // Default title for root
  }

  // Check if the last segment looks like an ID or a route parameter (like :id)
  const isIdOrParameter = (segment: string): boolean => {
    // Regex for UUIDs (with or without dashes) and other ID-like formats
    const idPattern: RegExp =
      /^[0-9a-f]{8}(-?[0-9a-f]{4}){3}-?[0-9a-f]{12}$|^[0-9a-f]{24}$|^\d+$/i;
    // Check if it's an ID or a route parameter (starts with :)
    return idPattern.test(segment) || segment.startsWith(":");
  };

  // If the query string has an id parameter, treat it as if the last segment is an ID
  const hasIdInQueryString = (): boolean => {
    const queryString = pathname.split("?")[1];
    if (!queryString) return false;

    // Check for id= in the query string
    return queryString.includes("id=");
  };

  const lastSegment: string = segments[segments.length - 1];

  // Check if the path has an ID in one of the recognized formats
  if (isIdOrParameter(lastSegment) || hasIdInQueryString()) {
    // If last segment is an ID or the URL has an ID parameter,
    // use the previous segment as the base for the title

    // Get the segment to base the title on
    let baseTitleSegment: string;

    if (lastSegment.startsWith(":") || hasIdInQueryString()) {
      // For route parameters or query string IDs, use the second-to-last segment
      baseTitleSegment = segments[segments.length - 2] || "";
    } else {
      // For direct IDs in the path, also use the second-to-last segment
      baseTitleSegment = segments[segments.length - 2] || "";
    }

    // Convert kebab-case or snake_case to Title Case
    const formattedTitle: string = baseTitleSegment
      .replace(/-|_/g, " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    return `${formattedTitle} Details`;
  } else {
    // If the last segment is not an ID, just format it as a title
    return lastSegment
      .replace(/-|_/g, " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }
};
