import React from "react";
import { ProcurementPlanResultsData } from "../../../types/procurementPlan";

const ProcurementSummary = (data: ProcurementPlanResultsData) => {
  // Safety check: ensure data is not null/undefined
  if (!data || typeof data !== 'object') {
    return (
      <div className="w-full p-8 text-center">
        <p className="text-gray-500">No procurement plan data available</p>
      </div>
    );
  }

  // Extract key information from the procurement plan data
  const formatCurrency = (amount: number, currency: string = "₦") => {
    return `${currency}${amount?.toLocaleString() || "0.00"}`;
  };

  // Safely render any value - convert objects to readable strings
  const safeRender = (value: any): string => {
    if (value === null || value === undefined) return "N/A";
    if (typeof value === 'string') return value;
    if (typeof value === 'number') return value.toString();
    if (typeof value === 'boolean') return value ? "Yes" : "No";
    if (typeof value === 'object') {
      // Handle specific object types that might be rendered
      // Handle category objects with {id, name, description, code, serial_number, job_category}
      if (value && 'job_category' in value && 'code' in value && 'serial_number' in value) {
        return value.name || value.description || `Category ${value.code}` || "Category";
      }
      // Handle asset type objects
      if (value && ('asset_type' in value || 'asset_code' in value)) {
        return value.name || value.description || 'Asset';
      }
      // If it's an object, try to extract meaningful data
      if (value.name) return value.name;
      if (value.title) return value.title;
      if (value.description) return value.description;
      // Return a safe string representation instead of JSON.stringify
      return "[Object]";
    }
    return String(value);
  };

  // Extract line items
  const items = data?.items || data?.line_items || [];

  // Safely extract data from parent plan
  const projectName = typeof data?.project === 'object' && data?.project?.title
    ? data.project.title
    : safeRender(data?.project);

  const financialYear = typeof data?.financial_year === 'object' && data?.financial_year?.year
    ? data.financial_year.year
    : safeRender(data?.financial_year);

  // Calculate totals from line items
  const totalBudgetNGN = items.reduce((sum: number, item: any) => {
    const amount = parseFloat(item?.approved_budget_amount_ngn || 0);
    return sum + (isNaN(amount) ? 0 : amount);
  }, 0);

  const totalBudgetUSD = items.reduce((sum: number, item: any) => {
    const amount = parseFloat(item?.approved_budget_amount_usd || 0);
    return sum + (isNaN(amount) ? 0 : amount);
  }, 0);

  // Get implementer from first line item or parent
  const implementer = items[0]?.implementer || safeRender(data?.implementer) || "Unknown";
  const implementationLocation = items[0]?.implementation_location || "Multiple Locations";
  const description = items[0]?.description || "Procurement Activities";

  // Define the implementation locations as office columns
  const implementationLocations = [
    "ACE1 PROJECT HEAD OFFICE",
    "ACE1 ADAMAWA STATE OFFICE",
    "ACE1 BORNO STATE OFFICE",
    "ACE1 YOBE STATE OFFICE",
    "ACE1 TARABA STATE OFFICE",
  ];

  // Create summary data based on the implementation location
  const createLocationData = (amount: number, currency: string = "₦") => {
    const locationData: { [key: string]: string } = {};

    // Distribute equally across all locations for now
    // TODO: Update this based on actual location data from line items
    implementationLocations.forEach((location) => {
      locationData[location] = formatCurrency(amount / implementationLocations.length, currency);
    });

    return locationData;
  };

  const summaryData: Array<{ category: string; [key: string]: string }> = [
    {
      category: "OVERALL TOTAL (NGN)",
      ...createLocationData(totalBudgetNGN)
    },
    {
      category: "OVERALL TOTAL (USD)",
      ...createLocationData(totalBudgetUSD, "$")
    }
  ];

  const headers = ["", ...implementationLocations];

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-lg font-bold">
          SUMMARY OF PROCUREMENT PLAN - {projectName}
        </h2>
        <h3 className="text-md font-semibold">
          {financialYear}
        </h3>
      </div>

      {/* Procurement Plan Details */}
      <div className="bg-gray-50 p-4 rounded-lg space-y-2">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><strong>Implementer:</strong> {implementer}</div>
          <div><strong>Location:</strong> {implementationLocation}</div>
          <div><strong>Budget Line:</strong> {items[0]?.budget_line || "N/A"}</div>
          <div><strong>Total Budget (NGN):</strong> {formatCurrency(totalBudgetNGN)}</div>
          <div><strong>Total Budget (USD):</strong> {formatCurrency(totalBudgetUSD, "$")}</div>
          <div><strong>Total Line Items:</strong> {items.length}</div>
        </div>
        <div className="text-sm">
          <strong>Description:</strong> {description}
        </div>
      </div>

      {/* Health and Non-Health Products Sections */}
      <div className="space-y-4">
        {/* Health and Non-Health Products Header */}
        <div className="bg-gray-100 p-2 text-center">
          <span className="text-sm font-medium">Health and Non-Health Products</span>
        </div>

        {/* Main Summary Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-black text-xs">
            <thead>
              <tr className="bg-gray-50">
                {headers.map((header, index) => (
                  <th
                    key={index}
                    className="border border-black p-2 text-center font-medium"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {summaryData.map((row, index) => (
                <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="border border-black p-2 font-medium">
                    {row.category}
                  </td>
                  {implementationLocations.map((location, locIndex) => (
                    <td key={locIndex} className="border border-black p-2 text-right">
                      {row[location] || formatCurrency(0)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Procurement Details Section */}
        <div className="bg-gray-100 p-2 text-center mt-4">
          <span className="text-sm font-medium">Procurement Plan Details</span>
        </div>

        {/* Procurement Information Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-black text-xs">
            <tbody>
              <tr>
                <td className="border border-black p-2 font-medium bg-gray-50">Workplan Activity Reference</td>
                <td className="border border-black p-2">{items[0]?.workplan_activity_reference || "N/A"}</td>
              </tr>
              <tr>
                <td className="border border-black p-2 font-medium bg-gray-50">PR Staff</td>
                <td className="border border-black p-2">{items[0]?.responsible_pr_staff || "N/A"}</td>
              </tr>
              <tr>
                <td className="border border-black p-2 font-medium bg-gray-50">Mode of Procurement</td>
                <td className="border border-black p-2">{items[0]?.mode_of_procurement || "N/A"}</td>
              </tr>
              <tr>
                <td className="border border-black p-2 font-medium bg-gray-50">Procurement Method</td>
                <td className="border border-black p-2">{items[0]?.procurement_method || "N/A"}</td>
              </tr>
              <tr>
                <td className="border border-black p-2 font-medium bg-gray-50">Procurement Process</td>
                <td className="border border-black p-2">{items[0]?.procurement_process || "N/A"}</td>
              </tr>
              <tr>
                <td className="border border-black p-2 font-medium bg-gray-50">Start Date</td>
                <td className="border border-black p-2">{items[0]?.procurement_start_date || "N/A"}</td>
              </tr>
              <tr>
                <td className="border border-black p-2 font-medium bg-gray-50">Expected Delivery Date</td>
                <td className="border border-black p-2">{items[0]?.expected_delivery_date || "N/A"}</td>
              </tr>
              <tr>
                <td className="border border-black p-2 font-medium bg-gray-50">Selected Supplier</td>
                <td className="border border-black p-2">{items[0]?.selected_supplier || "N/A"}</td>
              </tr>
              <tr>
                <td className="border border-black p-2 font-medium bg-gray-50">PPM Status</td>
                <td className="border border-black p-2">{items[0]?.ppm || "N/A"}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProcurementSummary;