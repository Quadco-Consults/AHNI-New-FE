import { ProcurementPlanResultsData } from "../../../types/procurementPlan";
import { useState } from "react";
import { Button } from "components/ui/button";
import { Edit2, Save, X } from "lucide-react";
import { Input } from "components/ui/input";
import { toast } from "sonner";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";

const ProcurementPlan = (data: ProcurementPlanResultsData) => {
  const { id: planId } = useParams();
  const queryClient = useQueryClient();
  const [editingRowId, setEditingRowId] = useState<string | null>(null);
  const [editedData, setEditedData] = useState<any>({});
  const [isSaving, setIsSaving] = useState(false);

  const handleEdit = (item: any) => {
    setEditingRowId(item.id);
    setEditedData({ ...item }); // Create a copy for editing
  };

  const handleCellChange = (field: string, value: any) => {
    setEditedData((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    if (!editingRowId) return;

    try {
      setIsSaving(true);

      // Update the line item using PATCH endpoint
      // This sends only the changed fields to the backend
      const response = await AxiosWithToken.patch(
        `procurements/procurement-plans-new/line-items/${editingRowId}/`,
        editedData
      );

      // Invalidate queries to refresh the data
      // This will fetch the updated plan with recalculated totals
      queryClient.invalidateQueries({
        queryKey: ["procurement-plan", planId],
        refetchType: "all"
      });

      toast.success("Line item updated successfully!");
      setEditingRowId(null);
      setEditedData({});
    } catch (error: any) {
      console.error("Failed to update line item:", error);

      // Handle different error types
      if (error?.response?.status === 404) {
        toast.error("Line item not found. It may have been deleted.");
      } else if (error?.response?.status === 400) {
        // Validation errors
        const errorData = error?.response?.data;
        if (errorData && typeof errorData === 'object') {
          const errorMessages = Object.entries(errorData)
            .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
            .join('\n');
          toast.error(`Validation error:\n${errorMessages}`);
        } else {
          toast.error("Invalid data. Please check your inputs.");
        }
      } else {
        toast.error(error?.response?.data?.message || error?.message || "Failed to update line item");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditingRowId(null);
    setEditedData({});
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
      if (value && value.name) return value.name;
      if (value && value.title) return value.title;
      if (value && value.description) return value.description;
      return "[Object]";
    }
    return String(value);
  };

  // Get items from data
  const items = data?.items || data?.line_items || data?.procurement_items || [];

  // Debug: Log the first item to see its structure
  if (items.length > 0) {
    console.log("=== FIRST LINE ITEM STRUCTURE ===");
    console.log("Available fields:", Object.keys(items[0]));
    console.log("Sample item:", items[0]);
    console.log("=================================");
  }

  // Helper function to render editable cell
  const renderEditableCell = (item: any, field: string, isEditing: boolean, type: string = "text") => {
    const currentData = isEditing ? editedData : item;

    if (isEditing) {
      return (
        <Input
          type={type}
          value={currentData?.[field] || ""}
          onChange={(e) => handleCellChange(field, e.target.value)}
          className="h-8 text-sm w-full"
        />
      );
    }

    return safeRender(item?.[field]);
  };

  const totalItems = items.length;

  return (
    <div className="w-[95%] mx-auto space-y-6">
      <div className="flex justify-between items-center py-5">
        <h3 className="text-primary text-xl font-semibold">
          Procurement Plan Details
        </h3>
        {totalItems > 0 && (
          <div className="text-sm font-medium text-gray-600 bg-blue-50 px-4 py-2 rounded-lg">
            Total Items: <span className="text-primary font-bold">{totalItems}</span>
          </div>
        )}
      </div>

      <div className="flex items-start gap-8 overflow-x-auto pb-6">
        <div className="flex flex-row gap-6 min-w-[400px] flex-shrink-0">
          {/* Details Table */}
          <div className="overflow-x-auto">
            <table className="table-auto min-w-max border border-gray-300 text-left border-collapse">
              <thead>
                {/* Row 1: Procurement Milestones */}
                <tr className="bg-gray-100">
                  <th
                    colSpan={31}
                    className="px-4 py-2 border text-center text-base font-semibold"
                  >
                    Procurement Plan- <span>{typeof data?.project === 'object' ? data?.project?.title : safeRender(data?.project) || "Project Details"}</span>
                  </th>
                </tr>

                {/* Row 2: Date Info */}
                <tr className="bg-gray-50">
                  <th
                    colSpan={31}
                    className="text-red-500 px-4 py-2 border text-center text-sm font-semibold whitespace-nowrap"
                  >
                    FY25 (<span>{typeof data?.financial_year === 'object' ? data?.financial_year?.year : safeRender(data?.financial_year) || "Current Year"}</span>)
                  </th>
                </tr>

                {/* Row 3: Main Headers */}
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 border text-sm font-semibold">Actions</th>
                  <th className="px-4 py-2 border text-sm font-semibold">SN</th>
                  <th className="px-4 py-2 border text-sm font-semibold">
                    IMPLEMENTER (OWNER)
                  </th>
                  <th className="px-4 py-2 border text-sm font-semibold">
                    Implementation Location
                  </th>
                  <th className="px-4 py-2 border text-sm font-semibold bg-red-300">
                    Workplan Activity Reference
                  </th>
                  <th className="px-4 py-2 border text-sm font-semibold">
                    Description Of Procurement Activities
                  </th>
                  <th
                    colSpan={1}
                    className="px-4 py-2 border text-center font-semibold text-[#DEA004]"
                  >
                    BUDGET REFERENCE NUMBER
                  </th>
                  <th
                    colSpan={2}
                    className="px-4 py-2 border text-center font-semibold "
                  >
                    APPROVED BUDGET AMOUNT
                  </th>
                  <th className="px-4 py-2 border text-sm font-semibold">
                    PPM
                  </th>
                  <th className="px-4 py-2 border text-sm font-semibold">
                    NON-PPM
                  </th>
                  <th className="px-4 py-2 border text-sm font-semibold">
                    FY25 TARGETS
                  </th>
                  <th className="px-4 py-2 border text-sm font-semibold">
                    UOM
                  </th>
                  <th className="px-4 py-2 border text-sm font-semibold">
                    QUANTITY
                  </th>
                  <th className="px-4 py-2 border text-sm font-semibold">
                    RESPONSIBLE PR STAFF
                  </th>
                  <th className="px-4 py-2 border text-sm font-semibold">
                    MODE OF PROCUREMENT
                  </th>
                  <th className="px-4 py-2 border text-sm font-semibold">
                    PROCURMENT COMMITTEE REVIEW (Yes - existing, new; No)
                  </th>
                  <th className="px-4 py-2 border text-sm font-semibold">
                    APPLICABLE SOLICITATION METHOD (EOI, RFP, RFQ, as per
                    organizational Procurement Policy)
                  </th>
                  <th className="px-4 py-2 border text-sm font-semibold">
                    PROCUREMENT START DATE(This is date PR is due or to be
                    submitted to Procurement unit)
                  </th>
                  <th
                    colSpan={7}
                    className="px-4 py-2 border text-sm font-semibold text-center text-[#DEA004]"
                  >
                    PROCURMENT MILESTONES
                  </th>
                  <th className="px-4 py-2 border text-sm font-semibold">
                    SELECTED SUPPLIER
                  </th>
                  <th className="px-4 py-2 border text-sm font-semibold">
                    DELIVERY LEADTIME
                  </th>

                  <th className="px-4 py-2 border text-sm font-semibold">
                    EXPECTED DELIVERY DUE DATE
                  </th>
                  <th className="px-4 py-2 border text-sm font-semibold">
                    DELIVERY TO PHO, Borno Office, Adamawa Office, Yobe Office,
                    Taraba Office, Clusters and Health Facilities
                  </th>
                  <th className="px-4 py-2 border text-sm font-semibold text-center">
                    PROCUREMENT PERFORMANCE/MONITORING REMARKS
                  </th>
                  <th className="px-4 py-2 border text-sm font-semibold text-center">
                    PROCUREMENT PERFORMANCE SCORE
                  </th>
                </tr>

                {/* Row 4: Sub-Headers */}
                <tr className="bg-gray-50">
                  <th colSpan={8}></th>
                  <th className="px-4 py-2 border text-sm font-semibold bg-blue-300">
                    {"₦"}
                  </th>
                  <th className="px-4 py-2 border text-sm font-semibold bg-cyan-300">
                    {"$"}
                  </th>
                  <th className="px-4 py-2 border text-sm font-semibold">PPM Status</th>
                  <th className="px-4 py-2 border text-sm font-semibold">Non-PPM Status</th>
                  <th colSpan={7}></th>
                  <th className="px-4 py-2 border text-sm font-semibold bg-[#c4bd97]">
                    Procurement Method (ICB, ILCB, NCB, NLCB, National Shopping,
                    Local Shopping, Micro Purchase, Single Source, Sole Source)
                  </th>
                  <th className="px-4 py-2 border text-sm font-semibold bg-[#c4bd97]">
                    Start Date of RFQ
                  </th>
                  <th className="px-4 py-2 border text-sm font-semibold bg-[#c4bd97]">
                    Closing Date of RFQ
                  </th>
                  <th className="px-4 py-2 border text-sm font-semibold bg-[#c4bd97]">
                    Evaluation
                  </th>
                  <th className="px-4 py-2 border text-sm font-semibold bg-[#c4bd97]">
                    Negotiation (if Applicable)
                  </th>
                  <th className="px-4 py-2 border text-sm font-semibold bg-[#c4bd97]">
                    Date CBA and Report is Finalised
                  </th>
                  <th className="px-4 py-2 border text-sm font-semibold bg-[#c4bd97]">
                    Date Purchase Order/PC is issued
                  </th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody>
                {/* Check if items exist, otherwise show single row with main data */}
                {(data?.items || data?.line_items || data?.procurement_items)?.length ? (
                  // If items array exists, map through it
                  (data?.items || data?.line_items || data?.procurement_items)?.map((item, index) => {
                    const isEditing = editingRowId === item?.id;
                    const currentData = isEditing ? editedData : item;

                    return (
                    <tr key={item?.id || index} className={isEditing ? "bg-blue-50" : ""}>
                      <td className="px-4 py-2 border text-sm text-center">
                        {isEditing ? (
                          <div className="flex gap-1 justify-center">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={handleSave}
                              disabled={isSaving}
                              className="h-8 w-8 p-0 text-green-600 hover:text-green-700 disabled:opacity-50"
                            >
                              <Save className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={handleCancel}
                              disabled={isSaving}
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 disabled:opacity-50"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEdit(item)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                        )}
                      </td>
                      <td className="px-4 py-2 border text-sm text-gray-500">
                        {index + 1}
                      </td>
                      <td className="px-4 py-2 border text-sm text-gray-500">
                        {renderEditableCell(item, "implementer", isEditing)}
                      </td>
                      <td className="px-4 py-2 border text-sm text-gray-500">
                        {renderEditableCell(item, "implementation_location", isEditing)}
                      </td>
                      <td className="px-4 py-2 border text-sm text-gray-500">
                        {renderEditableCell(item, "workplan_activity_reference", isEditing)}
                      </td>
                      <td className="px-4 py-2 border text-sm text-gray-500">
                        {renderEditableCell(item, "description", isEditing)}
                      </td>
                      <td className="px-4 py-2 border text-sm text-gray-500">
                        {renderEditableCell(item, "budget_ref_num", isEditing)}
                      </td>
                      <td className="px-4 py-2 border text-sm text-gray-500">
                        {isEditing ? (
                          <Input
                            type="number"
                            value={editedData?.approved_budget_amount_ngn || ""}
                            onChange={(e) => handleCellChange("approved_budget_amount_ngn", e.target.value)}
                            className="h-8 text-sm w-full"
                          />
                        ) : (
                          `₦${item?.approved_budget_amount_ngn ? parseFloat(item.approved_budget_amount_ngn).toLocaleString() : "N/A"}`
                        )}
                      </td>
                      <td className="px-4 py-2 border text-sm text-gray-500">
                        {isEditing ? (
                          <Input
                            type="number"
                            value={editedData?.approved_budget_amount_usd || ""}
                            onChange={(e) => handleCellChange("approved_budget_amount_usd", e.target.value)}
                            className="h-8 text-sm w-full"
                          />
                        ) : (
                          `$${item?.approved_budget_amount_usd ? parseFloat(item.approved_budget_amount_usd).toLocaleString() : "N/A"}`
                        )}
                      </td>
                      <td className="px-4 py-2 border text-sm text-gray-500">{item?.ppm ? "PPM" : "N/A"}</td>
                      <td className="px-4 py-2 border text-sm text-gray-500">{item?.non_ppm || !item?.ppm ? "NON-PPM" : "N/A"}</td>
                      <td className="px-4 py-2 border text-sm text-gray-500">{renderEditableCell(item, "financial_year_targets", isEditing, "number")}</td>
                      <td className="px-4 py-2 border text-sm text-gray-500">{renderEditableCell(item, "uom", isEditing)}</td>
                      <td className="px-4 py-2 border text-sm text-gray-500">{renderEditableCell(item, "total_quantity", isEditing, "number")}</td>
                      <td className="px-4 py-2 border text-sm text-gray-500">{renderEditableCell(item, "responsible_pr_staff", isEditing)}</td>
                      <td className="px-4 py-2 border text-sm text-gray-500">{renderEditableCell(item, "mode_of_procurement", isEditing)}</td>
                      <td className="px-4 py-2 border text-sm text-gray-500">{renderEditableCell(item, "procurement_committee_review", isEditing)}</td>
                      <td className="px-4 py-2 border text-sm text-gray-500">{renderEditableCell(item, "procurement_method", isEditing)}</td>
                      <td className="px-4 py-2 border text-sm text-gray-500">{renderEditableCell(item, "rfq_start_date", isEditing, "date")}</td>
                      <td className="px-4 py-2 border text-sm text-gray-500">{renderEditableCell(item, "rfq_closing_date", isEditing, "date")}</td>
                      <td className="px-4 py-2 border text-sm text-gray-500">{renderEditableCell(item, "evaluation_date", isEditing, "date")}</td>
                      <td className="px-4 py-2 border text-sm text-gray-500">{renderEditableCell(item, "negotiation_date", isEditing, "date")}</td>
                      <td className="px-4 py-2 border text-sm text-gray-500">{renderEditableCell(item, "cba_report_date", isEditing, "date")}</td>
                      <td className="px-4 py-2 border text-sm text-gray-500">{renderEditableCell(item, "po_issue_date", isEditing, "date")}</td>
                      <td className="px-4 py-2 border text-sm text-gray-500">{renderEditableCell(item, "selected_supplier", isEditing)}</td>
                      <td className="px-4 py-2 border text-sm text-gray-500">{renderEditableCell(item, "delivery_leadtime", isEditing)}</td>
                      <td className="px-4 py-2 border text-sm text-gray-500">{renderEditableCell(item, "expected_delivery_date", isEditing, "date")}</td>
                      <td className="px-4 py-2 border text-sm text-gray-500">{renderEditableCell(item, "delivery_to", isEditing)}</td>
                      <td className="px-4 py-2 border text-sm text-gray-500">{renderEditableCell(item, "performance_monitoring_remarks", isEditing)}</td>
                      <td className="px-4 py-2 border text-sm text-gray-500">{renderEditableCell(item, "performance_socre", isEditing)}</td>
                    </tr>
                  );
                  })
                ) : (
                  // Fallback: Show message if no items found
                  <tr>
                    <td colSpan={31} className="px-4 py-6 border text-center">
                      <div className="text-gray-500">
                        <p className="text-lg font-semibold mb-2">No line items found</p>
                        <p className="text-sm">This procurement plan doesn't have any associated line items yet.</p>
                        <p className="text-sm mt-1">Please upload an Excel file with procurement data to see items here.</p>
                      </div>
                    </td>
                  </tr>
                )}
                {/* Keep the original single row fallback below for reference, but commented out */}
                {/*
                  <tr>
                    <td className="px-4 py-2 border text-sm text-gray-500">1</td>
                    <td className="px-4 py-2 border text-sm text-gray-500">
                      {safeRender(data?.implementer)}
                    </td>
                    <td className="px-4 py-2 border text-sm text-gray-500">
                      {safeRender(data?.implementation_location)}
                    </td>
                    <td className="px-4 py-2 border text-sm text-gray-500">
                      {safeRender(data?.workplan_activity_reference)}
                    </td>
                    <td className="px-4 py-2 border text-sm text-gray-500">
                      {safeRender(data?.description)}
                    </td>
                    <td className="px-4 py-2 border text-sm text-gray-500">
                      {safeRender(data?.budget_line)}
                    </td>
                    <td className="px-4 py-2 border text-sm text-gray-500">
                      {data?.approved_budget ? `$${data.approved_budget.toLocaleString()}` : "N/A"}
                    </td>
                    <td className="px-4 py-2 border text-sm text-gray-500">
                      {data?.approved_budget ? `$${data.approved_budget.toLocaleString()}` : "N/A"}
                    </td>
                    <td className="px-4 py-2 border text-sm text-gray-500">
                      {data?.is_ppm ? "PPM" : "N/A"}
                    </td>
                    <td className="px-4 py-2 border text-sm text-gray-500">
                      {data?.is_ppm ? "N/A" : "NON-PPM"}
                    </td>
                    <td className="px-4 py-2 border text-sm text-gray-500">N/A</td>
                    <td className="px-4 py-2 border text-sm text-gray-500">N/A</td>
                    <td className="px-4 py-2 border text-sm text-gray-500">N/A</td>
                    <td className="px-4 py-2 border text-sm text-gray-500">
                      {safeRender(data?.pr_staff)}
                    </td>
                    <td className="px-4 py-2 border text-sm text-gray-500">
                      {safeRender(data?.mode_of_procurement)}
                    </td>
                    <td className="px-4 py-2 border text-sm text-gray-500">
                      {safeRender(data?.procurement_committee_review)}
                    </td>
                    <td className="px-4 py-2 border text-sm text-gray-500">
                      {safeRender(data?.procurement_process)}
                    </td>
                    <td className="px-4 py-2 border text-sm text-gray-500">
                      {safeRender(data?.start_date)}
                    </td>
                    <td className="px-4 py-2 border text-sm text-gray-500">N/A</td>
                    <td className="px-4 py-2 border text-sm text-gray-500">N/A</td>
                    <td className="px-4 py-2 border text-sm text-gray-500">N/A</td>
                    <td className="px-4 py-2 border text-sm text-gray-500">N/A</td>
                    <td className="px-4 py-2 border text-sm text-gray-500">N/A</td>
                    <td className="px-4 py-2 border text-sm text-gray-500">N/A</td>
                    <td className="px-4 py-2 border text-sm text-gray-500">N/A</td>
                    <td className="px-4 py-2 border text-sm text-gray-500">
                      {safeRender(data?.selected_supplier)}
                    </td>
                    <td className="px-4 py-2 border text-sm text-gray-500">N/A</td>
                    <td className="px-4 py-2 border text-sm text-gray-500">
                      {safeRender(data?.expected_delivery_date_1)}
                    </td>
                    <td className="px-4 py-2 border text-sm text-gray-500">
                      {safeRender(data?.ware_houses)}
                    </td>
                    <td className="px-4 py-2 border text-sm text-gray-500">
                      {safeRender(data?.donor_remarks)}
                    </td>
                    <td className="px-4 py-2 border text-sm text-gray-500">
                      {safeRender(data?.implenter_remarks)}
                    </td>
                  </tr>
                */}

                {/* Totals Row */}
                {items.length > 0 && (
                  <tr className="bg-blue-100 font-bold border-t-4 border-blue-500">
                    <td className="px-4 py-3 border text-sm text-center">-</td>
                    <td className="px-4 py-3 border text-sm text-center" colSpan={6}>TOTAL</td>
                    <td className="px-4 py-3 border text-sm text-right">
                      ₦{items.reduce((sum: number, item: any) => {
                        const amount = parseFloat(item?.approved_budget_amount_ngn || 0);
                        return sum + (isNaN(amount) ? 0 : amount);
                      }, 0).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="px-4 py-3 border text-sm text-right">
                      ${items.reduce((sum: number, item: any) => {
                        const amount = parseFloat(item?.approved_budget_amount_usd || 0);
                        return sum + (isNaN(amount) ? 0 : amount);
                      }, 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="px-4 py-3 border text-sm text-center" colSpan={4}>-</td>
                    <td className="px-4 py-3 border text-sm text-right">
                      {items.reduce((sum: number, item: any) => {
                        const amount = parseFloat(item?.total_quantity || 0);
                        return sum + (isNaN(amount) ? 0 : amount);
                      }, 0).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 border text-sm text-center" colSpan={17}>-</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcurementPlan;
