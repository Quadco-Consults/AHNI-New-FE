import React from "react";
import { ProcurementPlanResultsData } from "../../../types/procurementPlan";

interface ExcelDataTableProps {
  data: ProcurementPlanResultsData;
}

const ExcelDataTable: React.FC<ExcelDataTableProps> = ({ data }) => {
  // Safely render any value - convert objects to readable strings
  const safeRender = (value: any): string => {
    if (value === null || value === undefined) return "N/A";
    if (typeof value === 'string') return value;
    if (typeof value === 'number') return value.toString();
    if (typeof value === 'boolean') return value ? "Yes" : "No";
    if (typeof value === 'object') {
      // Handle specific object types
      if (value && value.name) return value.name;
      if (value && value.title) return value.title;
      if (value && value.description) return value.description;
      if (value && value.year) return value.year;
      return JSON.stringify(value);
    }
    return String(value);
  };

  // Format column header (convert snake_case to Title Case)
  const formatColumnHeader = (key: string): string => {
    return key
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Check if we have multiple items (rows from Excel)
  const items = data?.items || data?.line_items || data?.procurement_items || [];
  const hasMultipleRows = Array.isArray(items) && items.length > 0;

  console.log("Excel Data Table - Has multiple rows:", hasMultipleRows);
  console.log("Excel Data Table - Items:", items);

  if (!data) {
    return (
      <div className="w-full mx-auto space-y-6 p-6">
        <div className="text-center text-gray-500">
          <p className="text-lg font-semibold mb-2">No Excel data found</p>
          <p className="text-sm">This procurement plan doesn't have any data to display.</p>
        </div>
      </div>
    );
  }

  // If we have multiple rows, display them in a horizontal table
  if (hasMultipleRows) {
    // Get all unique columns from all items
    const getAllColumns = () => {
      const columnsSet = new Set<string>();
      const excludeFields = ['id', 'created_datetime', 'updated_datetime', 'created_at', 'updated_at'];

      items.forEach((item: any) => {
        Object.keys(item).forEach(key => {
          if (!excludeFields.includes(key)) {
            columnsSet.add(key);
          }
        });
      });

      return Array.from(columnsSet);
    };

    const columns = getAllColumns();

    return (
      <div className="w-full mx-auto space-y-6">
        <div className="flex justify-between items-center py-5 px-4">
          <h3 className="text-primary text-xl font-semibold">
            Excel Data View - All Rows
          </h3>
          <div className="text-sm font-medium text-gray-600 bg-blue-50 px-4 py-2 rounded-lg">
            Total Rows: <span className="text-primary font-bold">{items.length}</span>
          </div>
        </div>

        <div className="w-full overflow-x-auto pb-6">
          <div className="min-w-full inline-block align-middle">
            <div className="overflow-hidden border border-gray-300 rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider border-r border-gray-300 sticky left-0 bg-gray-100 z-10">
                      S/N
                    </th>
                    {columns.map((column, index) => (
                      <th
                        key={index}
                        className="px-4 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider border-r border-gray-300 whitespace-nowrap"
                      >
                        {formatColumnHeader(column)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {items.map((item: any, rowIndex: number) => (
                    <tr key={item?.id || rowIndex} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900 font-medium border-r border-gray-200 sticky left-0 bg-white z-10">
                        {rowIndex + 1}
                      </td>
                      {columns.map((column, colIndex) => (
                        <td
                          key={colIndex}
                          className="px-4 py-3 text-sm text-gray-700 border-r border-gray-200 whitespace-nowrap"
                        >
                          {safeRender(item[column])}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="px-4 py-3 bg-blue-50 border border-blue-300 rounded-lg">
          <p className="text-sm text-blue-800">
            <span className="font-semibold">ℹ️ Note:</span> This view displays all {items.length} rows from your uploaded Excel file.
            Each row represents a procurement plan item with all its associated data.
          </p>
        </div>
      </div>
    );
  }

  // Otherwise, display single row in vertical format
  const getDataFields = () => {
    const excludeFields = ['id', 'created_datetime', 'updated_datetime', 'created_at', 'updated_at', 'items', 'line_items', 'procurement_items'];
    return Object.keys(data).filter(key => !excludeFields.includes(key));
  };

  const fields = getDataFields();

  if (fields.length === 0) {
    return (
      <div className="w-full mx-auto space-y-6 p-6">
        <div className="text-center text-gray-500">
          <p className="text-lg font-semibold mb-2">No Excel data found</p>
          <p className="text-sm">This procurement plan doesn't have any data to display.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto space-y-6">
      <div className="flex justify-between items-center py-5 px-4">
        <h3 className="text-primary text-xl font-semibold">
          Excel Data View - Procurement Plan Details
        </h3>
        <div className="text-sm font-medium text-gray-600 bg-blue-50 px-4 py-2 rounded-lg">
          Total Fields: <span className="text-primary font-bold">{fields.length}</span>
        </div>
      </div>

      <div className="w-full overflow-x-auto pb-6">
        <div className="min-w-full inline-block align-middle">
          <div className="overflow-hidden border border-gray-300 rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider border-r border-gray-300 w-1/3">
                    Field Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider border-r border-gray-300">
                    Value
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {fields.map((field, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 border-r border-gray-200">
                      {formatColumnHeader(field)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 border-r border-gray-200">
                      {safeRender(data[field as keyof ProcurementPlanResultsData])}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="px-4 py-3 bg-blue-50 border border-blue-300 rounded-lg">
        <p className="text-sm text-blue-800">
          <span className="font-semibold">ℹ️ Note:</span> This view displays all the data from this procurement plan record.
          Each row in your uploaded Excel file creates a separate procurement plan that can be viewed individually.
        </p>
      </div>
    </div>
  );
};

export default ExcelDataTable;
