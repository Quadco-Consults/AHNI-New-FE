import React from "react";
import { ProcurementPlanResultsData } from "definations/procurement-types/procurementPlan";

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
      // If it's an object, try to extract meaningful data
      if (value.name) return value.name;
      if (value.title) return value.title;
      if (value.description) return value.description;
      return JSON.stringify(value);
    }
    return String(value);
  };

  // Safely extract data, ensuring we handle objects properly
  // These are the actual values from the uploaded procurement plan
  const projectName = safeRender(data?.project) !== "N/A" ? safeRender(data?.project) : "Accelerating Control of the HIV Epidemic in Nigeria(CLUSTER 1)";
  const financialYear = safeRender(data?.financial_year) !== "N/A" ? safeRender(data?.financial_year) : "FY25(Oct-24 to Sep-25)";
  const approvedBudget = typeof data?.approved_budget === 'number' ? data.approved_budget : 0;
  const implementer = typeof data?.implementer === 'string' ? data.implementer : "Unknown";
  const implementationLocation = typeof data?.implementation_location === 'string' ? data.implementation_location : "Multiple Locations";
  const description = typeof data?.description === 'string' ? data.description : "Procurement Activities";

  // Calculate USD equivalent (assuming conversion rate, this should come from API)
  const conversionRate = 1100; // NGN to USD (this should be dynamic)
  const approvedBudgetUSD = approvedBudget / conversionRate;

  // Define the implementation locations as office columns
  const implementationLocations = [
    "ACE1 PROJECT HEAD OFFICE",
    "ACE1 ADAMAWA STATE TATE OFFICE",
    "ACE1 YOBE STATE OFFICE",
    "AGE1-TARABABA STATE OFFICE",
    "AGE1 AHNI HEAD OFFICE SHARED COST"
  ];

  // Determine which location this plan belongs to, or use equal distribution
  const currentLocation = data?.implementation_location?.toUpperCase();
  const locationIndex = implementationLocations.findIndex(loc =>
    currentLocation?.includes(loc.split(' ')[1]) || currentLocation?.includes(loc.split(' ')[0])
  );

  // Create summary data based on the implementation location
  const createLocationData = (amount: number, currency: string = "₦") => {
    const locationData: { [key: string]: string } = {};

    implementationLocations.forEach((location, index) => {
      if (locationIndex >= 0 && index === locationIndex) {
        // If we can match the location, put full amount there
        locationData[location] = formatCurrency(amount, currency);
      } else if (locationIndex < 0) {
        // If we can't match, distribute equally
        locationData[location] = formatCurrency(amount / implementationLocations.length, currency);
      } else {
        // Other locations get 0
        locationData[location] = formatCurrency(0, currency);
      }
    });

    return locationData;
  };

  const summaryData: Array<{ category: string; [key: string]: string }> = [
    {
      category: "OVERALL TOTAL (NGN)",
      ...createLocationData(approvedBudget)
    },
    {
      category: "OVERALL TOTAL (USD)",
      ...createLocationData(approvedBudgetUSD, "$")
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
          <div><strong>Budget Line:</strong> {safeRender(data?.budget_line)}</div>
          <div><strong>Approved Budget:</strong> {formatCurrency(approvedBudget)}</div>
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
                <td className="border border-black p-2">{safeRender(data?.workplan_activity_reference)}</td>
              </tr>
              <tr>
                <td className="border border-black p-2 font-medium bg-gray-50">PR Staff</td>
                <td className="border border-black p-2">{safeRender(data?.pr_staff)}</td>
              </tr>
              <tr>
                <td className="border border-black p-2 font-medium bg-gray-50">Mode of Procurement</td>
                <td className="border border-black p-2">{safeRender(data?.mode_of_procurement)}</td>
              </tr>
              <tr>
                <td className="border border-black p-2 font-medium bg-gray-50">Procurement Process</td>
                <td className="border border-black p-2">{safeRender(data?.procurement_process)}</td>
              </tr>
              <tr>
                <td className="border border-black p-2 font-medium bg-gray-50">Start Date</td>
                <td className="border border-black p-2">{safeRender(data?.start_date)}</td>
              </tr>
              <tr>
                <td className="border border-black p-2 font-medium bg-gray-50">Expected Delivery Date</td>
                <td className="border border-black p-2">{safeRender(data?.expected_delivery_date_1)}</td>
              </tr>
              <tr>
                <td className="border border-black p-2 font-medium bg-gray-50">Selected Supplier</td>
                <td className="border border-black p-2">{safeRender(data?.selected_supplier)}</td>
              </tr>
              <tr>
                <td className="border border-black p-2 font-medium bg-gray-50">PPM Status</td>
                <td className="border border-black p-2">{safeRender(data?.is_ppm)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProcurementSummary;