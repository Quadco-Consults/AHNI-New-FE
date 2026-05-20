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
  const allItems = data?.items || data?.line_items || [];

  // Separate operational and product items
  const operationalItems = allItems.filter((item: any) => item?.item_type === 'OPERATIONAL');
  const productItems = allItems.filter((item: any) => item?.item_type !== 'OPERATIONAL');

  // Use all items for overall summary
  const items = allItems;

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

  // Calculate operational costs totals
  const operationalBudgetNGN = operationalItems.reduce((sum: number, item: any) => {
    const amount = parseFloat(item?.approved_budget_amount_ngn || 0);
    return sum + (isNaN(amount) ? 0 : amount);
  }, 0);

  const operationalBudgetUSD = operationalItems.reduce((sum: number, item: any) => {
    const amount = parseFloat(item?.approved_budget_amount_usd || 0);
    return sum + (isNaN(amount) ? 0 : amount);
  }, 0);

  // Calculate products totals
  const productBudgetNGN = productItems.reduce((sum: number, item: any) => {
    const amount = parseFloat(item?.approved_budget_amount_ngn || 0);
    return sum + (isNaN(amount) ? 0 : amount);
  }, 0);

  const productBudgetUSD = productItems.reduce((sum: number, item: any) => {
    const amount = parseFloat(item?.approved_budget_amount_usd || 0);
    return sum + (isNaN(amount) ? 0 : amount);
  }, 0);

  // Get implementer from first line item or parent
  const implementer = items[0]?.implementer || safeRender(data?.implementer) || "Unknown";
  const implementationLocation = items[0]?.implementation_location || "Multiple Locations";
  const description = items[0]?.description || "Procurement Activities";

  // Extract unique implementation locations from line items
  const locationBudgets: { [location: string]: { ngn: number; usd: number; operational_ngn: number; operational_usd: number; product_ngn: number; product_usd: number } } = {};

  items.forEach((item: any) => {
    const location = item?.implementation_location || "Unspecified Location";
    const ngnAmount = parseFloat(item?.approved_budget_amount_ngn || 0);
    const usdAmount = parseFloat(item?.approved_budget_amount_usd || 0);
    const isOperational = item?.item_type === 'OPERATIONAL';

    if (!locationBudgets[location]) {
      locationBudgets[location] = {
        ngn: 0,
        usd: 0,
        operational_ngn: 0,
        operational_usd: 0,
        product_ngn: 0,
        product_usd: 0
      };
    }

    const validNgn = isNaN(ngnAmount) ? 0 : ngnAmount;
    const validUsd = isNaN(usdAmount) ? 0 : usdAmount;

    locationBudgets[location].ngn += validNgn;
    locationBudgets[location].usd += validUsd;

    if (isOperational) {
      locationBudgets[location].operational_ngn += validNgn;
      locationBudgets[location].operational_usd += validUsd;
    } else {
      locationBudgets[location].product_ngn += validNgn;
      locationBudgets[location].product_usd += validUsd;
    }
  });

  // Get sorted list of unique locations
  const implementationLocations = Object.keys(locationBudgets).sort();

  // If no locations found, show a message
  if (implementationLocations.length === 0) {
    implementationLocations.push("No Location Data");
    locationBudgets["No Location Data"] = {
      ngn: totalBudgetNGN,
      usd: totalBudgetUSD,
      operational_ngn: operationalBudgetNGN,
      operational_usd: operationalBudgetUSD,
      product_ngn: productBudgetNGN,
      product_usd: productBudgetUSD
    };
  }

  // Create summary data with real location budgets - separated by category
  const summaryData: Array<{ category: string; [key: string]: string }> = [
    {
      category: "HEALTH & NON-HEALTH PRODUCTS (NGN)",
      ...Object.fromEntries(
        implementationLocations.map(location => [
          location,
          formatCurrency(locationBudgets[location].product_ngn)
        ])
      )
    },
    {
      category: "HEALTH & NON-HEALTH PRODUCTS (USD)",
      ...Object.fromEntries(
        implementationLocations.map(location => [
          location,
          formatCurrency(locationBudgets[location].product_usd, "$")
        ])
      )
    },
    {
      category: "OPERATIONAL COSTS (NGN)",
      ...Object.fromEntries(
        implementationLocations.map(location => [
          location,
          formatCurrency(locationBudgets[location].operational_ngn)
        ])
      )
    },
    {
      category: "OPERATIONAL COSTS (USD)",
      ...Object.fromEntries(
        implementationLocations.map(location => [
          location,
          formatCurrency(locationBudgets[location].operational_usd, "$")
        ])
      )
    },
    {
      category: "OVERALL TOTAL (NGN)",
      ...Object.fromEntries(
        implementationLocations.map(location => [
          location,
          formatCurrency(locationBudgets[location].ngn)
        ])
      )
    },
    {
      category: "OVERALL TOTAL (USD)",
      ...Object.fromEntries(
        implementationLocations.map(location => [
          location,
          formatCurrency(locationBudgets[location].usd, "$")
        ])
      )
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
      <div className="bg-gray-50 p-4 rounded-lg space-y-4">
        {/* Statistics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-3 rounded border">
            <p className="text-xs text-gray-600 mb-1">Total Line Items</p>
            <p className="text-2xl font-bold text-gray-900">{items.length}</p>
          </div>
          <div className="bg-white p-3 rounded border border-green-300">
            <p className="text-xs text-green-700 mb-1">Products</p>
            <p className="text-2xl font-bold text-green-900">{productItems.length}</p>
          </div>
          <div className="bg-white p-3 rounded border border-amber-300">
            <p className="text-xs text-amber-700 mb-1">Operational</p>
            <p className="text-2xl font-bold text-amber-900">{operationalItems.length}</p>
          </div>
          <div className="bg-white p-3 rounded border border-blue-300">
            <p className="text-xs text-blue-700 mb-1">Locations</p>
            <p className="text-2xl font-bold text-blue-900">{implementationLocations.length}</p>
          </div>
        </div>

        {/* Budget Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 border-t">
          <div>
            <p className="text-xs text-gray-600 mb-2 font-semibold">Products Budget</p>
            <div className="space-y-1">
              <p className="text-sm"><span className="text-blue-600 font-semibold">NGN:</span> {formatCurrency(productBudgetNGN)}</p>
              <p className="text-sm"><span className="text-cyan-600 font-semibold">USD:</span> {formatCurrency(productBudgetUSD, "$")}</p>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-2 font-semibold">Operational Budget</p>
            <div className="space-y-1">
              <p className="text-sm"><span className="text-blue-600 font-semibold">NGN:</span> {formatCurrency(operationalBudgetNGN)}</p>
              <p className="text-sm"><span className="text-cyan-600 font-semibold">USD:</span> {formatCurrency(operationalBudgetUSD, "$")}</p>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-2 font-semibold">Total Budget</p>
            <div className="space-y-1">
              <p className="text-sm"><span className="text-blue-600 font-bold">NGN:</span> {formatCurrency(totalBudgetNGN)}</p>
              <p className="text-sm"><span className="text-cyan-600 font-bold">USD:</span> {formatCurrency(totalBudgetUSD, "$")}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Budget Breakdown by Location */}
      <div className="space-y-4">
        {/* Section Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-3 text-center rounded">
          <span className="text-base font-bold text-white">Budget Breakdown by Implementation Location</span>
        </div>

        {/* Main Summary Table */}
        <div className="overflow-x-auto shadow-md rounded-lg border">
          <table className="w-full border-collapse border border-gray-300 text-xs">
            <thead>
              <tr className="bg-gradient-to-r from-gray-100 to-gray-200">
                {headers.map((header, index) => (
                  <th
                    key={index}
                    className="border border-gray-300 p-3 text-center font-bold text-gray-700"
                  >
                    {header || "Category"}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {summaryData.map((row, index) => {
                const isTotal = row.category.includes("OVERALL TOTAL");
                const isOperational = row.category.includes("OPERATIONAL");
                const isProduct = row.category.includes("HEALTH");

                return (
                  <tr
                    key={index}
                    className={
                      isTotal ? "bg-blue-50 font-bold" :
                      isOperational ? "bg-amber-50" :
                      isProduct ? "bg-green-50" :
                      "bg-white"
                    }
                  >
                    <td className={`border border-gray-300 p-2 font-semibold ${
                      isTotal ? "text-blue-700" :
                      isOperational ? "text-amber-700" :
                      isProduct ? "text-green-700" :
                      "text-gray-700"
                    }`}>
                      {row.category}
                    </td>
                    {implementationLocations.map((location, locIndex) => (
                      <td
                        key={locIndex}
                        className={`border border-gray-300 p-2 text-right ${
                          isTotal ? "font-bold" : ""
                        }`}
                      >
                        {row[location] || formatCurrency(0)}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Additional Statistics */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <p className="text-xs text-gray-600 mb-2 font-semibold">Procurement Categories</p>
            <div className="space-y-1 text-sm">
              <p><span className="font-medium">PPM Items:</span> {items.filter((i: any) => i?.ppm).length}</p>
              <p><span className="font-medium">Non-PPM Items:</span> {items.filter((i: any) => i?.non_ppm).length}</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <p className="text-xs text-gray-600 mb-2 font-semibold">Items with Suppliers</p>
            <div className="space-y-1 text-sm">
              <p><span className="font-medium">Selected:</span> {items.filter((i: any) => i?.selected_supplier && i?.selected_supplier !== 'N/A').length}</p>
              <p><span className="font-medium">Pending:</span> {items.filter((i: any) => !i?.selected_supplier || i?.selected_supplier === 'N/A').length}</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <p className="text-xs text-gray-600 mb-2 font-semibold">Timeline Status</p>
            <div className="space-y-1 text-sm">
              <p><span className="font-medium">With Start Date:</span> {items.filter((i: any) => i?.procurement_start_date).length}</p>
              <p><span className="font-medium">With Delivery Date:</span> {items.filter((i: any) => i?.expected_delivery_date).length}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcurementSummary;