import { ProcurementPlanResultsData } from "../../../types/procurementPlan";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit2, Save, X } from "lucide-react";
import { Input } from "@/components/ui/input";
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
  const [isEditAllMode, setIsEditAllMode] = useState(false);
  const [bulkEditData, setBulkEditData] = useState<{[key: string]: any}>({});

  const handleEdit = (item: any) => {
    setEditingRowId(item.id);
    setEditedData({ ...item }); // Create a copy for editing
  };

  const handleCellChange = (field: string, value: any, itemId?: string) => {
    if (isEditAllMode && itemId) {
      setBulkEditData((prev: any) => ({
        ...prev,
        [itemId]: {
          ...prev[itemId],
          [field]: value,
        },
      }));
    } else {
      setEditedData((prev: any) => ({
        ...prev,
        [field]: value,
      }));
    }
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

  const handleEditAll = () => {
    setIsEditAllMode(true);
    // Initialize bulk edit data with current values
    const initialData: {[key: string]: any} = {};
    items.forEach((item: any) => {
      initialData[item.id] = { ...item };
    });
    setBulkEditData(initialData);
  };

  const handleSaveAll = async () => {
    try {
      setIsSaving(true);

      // Update each modified item
      const updates = Object.entries(bulkEditData);
      const updatePromises = updates.map(([itemId, data]) => {
        return AxiosWithToken.patch(
          `procurements/procurement-plans-new/line-items/${itemId}/`,
          data
        );
      });

      await Promise.all(updatePromises);

      // Invalidate queries to refresh the data
      queryClient.invalidateQueries({
        queryKey: ["procurement-plan", planId],
        refetchType: "all"
      });

      toast.success(`${updates.length} line items updated successfully!`);
      setIsEditAllMode(false);
      setBulkEditData({});
    } catch (error: any) {
      console.error("Failed to update line items:", error);
      toast.error("Failed to update some line items. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelAll = () => {
    setIsEditAllMode(false);
    setBulkEditData({});
  };

  // Safely render any value - convert objects to readable strings
  const safeRender = (value: any): string => {
    if (value === null || value === undefined) return "N/A";
    if (typeof value === 'string') {
      // Handle "nan" strings from Excel uploads and empty values
      if (value.toLowerCase() === 'nan' || value === '' || value.trim() === '') return "N/A";
      return value;
    }
    if (typeof value === 'number') {
      // Handle NaN numbers
      if (isNaN(value)) return "N/A";
      return value.toString();
    }
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
  // Extract items from actual API response structure based on debugging data
  const allItems = data?.data?.results || data?.items || data?.line_items || data?.procurement_items || [];

  // Filter for health and non-health products only (excluding operational costs)
  const items = allItems.filter((item: any) => item?.item_type !== 'OPERATIONAL');

  // Field mappings have been optimized based on actual database field analysis

  // Helper function to render editable cell
  const renderEditableCell = (item: any, field: string, isEditing: boolean, type: string = "text") => {
    let currentData = item;

    if (isEditAllMode) {
      currentData = bulkEditData[item.id] || item;
    } else if (isEditing) {
      currentData = editedData;
    }

    if (isEditAllMode || isEditing) {
      return (
        <Input
          type={type}
          value={currentData?.[field] || ""}
          onChange={(e) => handleCellChange(field, e.target.value, item.id)}
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
        <div className="flex items-center gap-4">
          {totalItems > 0 && (
            <div className="text-sm font-medium text-gray-600 bg-blue-50 px-4 py-2 rounded-lg">
              Total Items: <span className="text-primary font-bold">{totalItems}</span>
            </div>
          )}

          {/* Bulk Edit Controls */}
          {isEditAllMode ? (
            <div className="flex items-center gap-2">
              <Button
                onClick={handleSaveAll}
                disabled={isSaving}
                className="bg-green-600 hover:bg-green-700 text-white"
                size="sm"
              >
                <Save className="h-4 w-4 mr-1" />
                {isSaving ? "Saving..." : "Save All"}
              </Button>
              <Button
                onClick={handleCancelAll}
                disabled={isSaving}
                variant="outline"
                size="sm"
              >
                <X className="h-4 w-4 mr-1" />
                Cancel
              </Button>
            </div>
          ) : (
            <Button
              onClick={handleEditAll}
              disabled={!!editingRowId}
              className="bg-blue-600 hover:bg-blue-700 text-white"
              size="sm"
            >
              <Edit2 className="h-4 w-4 mr-1" />
              Edit All
            </Button>
          )}
        </div>
      </div>

      <div className="flex items-start gap-8 overflow-x-auto pb-6">
        <div className="flex flex-row gap-6 min-w-[400px] flex-shrink-0">
          {/* Details Table */}
          <div className="overflow-x-auto">
            <table className="table-auto min-w-max border border-gray-300 text-left border-collapse">
              <thead>
                {/* Row 1: Procurement Plan Title */}
                <tr className="bg-gray-100">
                  <th
                    colSpan={31}
                    className="px-4 py-2 border text-center text-base font-semibold"
                  >
                    PROCUREMENT PLAN - <span>{typeof data?.project === 'object' ? data?.project?.title : safeRender(data?.project) || "Project Details"}</span>
                  </th>
                </tr>

                {/* Row 2: Financial Year */}
                <tr className="bg-gray-50">
                  <th
                    colSpan={31}
                    className="text-red-500 px-4 py-2 border text-center text-sm font-semibold whitespace-nowrap"
                  >
                    {data?.financial_year?.year || "FY25"}
                    {data?.financial_year?.start_date && data?.financial_year?.end_date && (
                      <span>
                        {' '}({new Date(data.financial_year.start_date).toLocaleDateString('en-GB', { month: 'short', year: '2-digit' })} to {new Date(data.financial_year.end_date).toLocaleDateString('en-GB', { month: 'short', year: '2-digit' })})
                      </span>
                    )}
                  </th>
                </tr>

                {/* Row 3: Category */}
                <tr className="bg-blue-50">
                  <th
                    colSpan={31}
                    className="text-blue-700 px-4 py-2 border text-center text-sm font-bold"
                  >
                    HEALTH AND NON-HEALTH PRODUCTS
                  </th>
                </tr>

                {/* Row 4: Main Headers */}
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
                    className="px-4 py-2 border text-center font-semibold text-yellow-darker"
                  >
                    BUDGET REFERENCE NUMBER
                  </th>
                  <th
                    colSpan={2}
                    className="px-4 py-2 border text-center font-semibold bg-gray-200"
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
                  <th className="px-2 py-3 border text-xs font-semibold whitespace-normal text-center max-w-[100px]">
                    <div>PROCUREMENT</div>
                    <div>COMMITTEE</div>
                    <div>REVIEW</div>
                    <div className="text-[10px] text-gray-600 mt-1">(Yes/No)</div>
                  </th>
                  <th className="px-2 py-3 border text-xs font-semibold whitespace-normal text-center max-w-[100px]">
                    <div>SOLICITATION</div>
                    <div>METHOD</div>
                    <div className="text-[10px] text-gray-600 mt-1">(EOI, RFP, RFQ)</div>
                  </th>
                  <th className="px-2 py-3 border text-xs font-semibold whitespace-normal text-center max-w-[100px]">
                    <div>PROCUREMENT</div>
                    <div>START DATE</div>
                    <div className="text-[10px] text-gray-600 mt-1">(PR Submission)</div>
                  </th>
                  <th
                    colSpan={7}
                    className="px-4 py-2 border text-sm font-semibold text-center text-yellow-darker"
                  >
                    PROCURMENT MILESTONES
                  </th>
                  <th className="px-2 py-3 border text-xs font-semibold whitespace-normal text-center max-w-[80px]">
                    <div>SELECTED</div>
                    <div>SUPPLIER</div>
                  </th>
                  <th className="px-2 py-3 border text-xs font-semibold whitespace-normal text-center max-w-[80px]">
                    <div>DELIVERY</div>
                    <div>LEADTIME</div>
                    <div className="text-[10px] text-gray-600 mt-1">(Days)</div>
                  </th>

                  <th className="px-2 py-3 border text-xs font-semibold whitespace-normal text-center max-w-[90px]">
                    <div>EXPECTED</div>
                    <div>DELIVERY</div>
                    <div>DATE</div>
                  </th>
                  <th className="px-2 py-3 border text-xs font-semibold whitespace-normal text-center max-w-[120px]">
                    <div>DELIVERY</div>
                    <div>LOCATION</div>
                    <div className="text-[10px] text-gray-600 mt-1">(PHO, Offices, etc.)</div>
                  </th>
                  <th className="px-2 py-3 border text-xs font-semibold text-center whitespace-normal max-w-[100px]">
                    <div>PERFORMANCE</div>
                    <div>MONITORING</div>
                    <div>REMARKS</div>
                  </th>
                  <th className="px-2 py-3 border text-xs font-semibold text-center whitespace-normal max-w-[90px]">
                    <div>PERFORMANCE</div>
                    <div>SCORE</div>
                  </th>
                </tr>

                {/* Row 5: Sub-Headers */}
                <tr className="bg-gray-50">
                  <th colSpan={6}></th>
                  <th></th>
                  <th className="px-4 py-2 border text-sm font-semibold bg-blue-300 min-w-[120px] text-center">
                    <span className="text-lg font-bold">₦</span>
                  </th>
                  <th className="px-4 py-2 border text-sm font-semibold bg-cyan-300 min-w-[120px] text-center">
                    <span className="text-lg font-bold">$</span>
                  </th>
                  <th className="px-4 py-2 border text-sm font-semibold">PPM Status</th>
                  <th className="px-4 py-2 border text-sm font-semibold">Non-PPM Status</th>
                  <th colSpan={7}></th>
                  <th className="px-2 py-2 border text-xs font-semibold bg-[#c4bd97] whitespace-normal text-center max-w-[100px]">
                    <div>PROCUREMENT</div>
                    <div>METHOD</div>
                    <div className="text-[10px] text-gray-500 mt-1">(ICB, NCB, etc.)</div>
                  </th>
                  <th className="px-2 py-2 border text-xs font-semibold bg-[#c4bd97] whitespace-normal text-center max-w-[80px]">
                    <div>RFQ</div>
                    <div>START DATE</div>
                  </th>
                  <th className="px-2 py-2 border text-xs font-semibold bg-[#c4bd97] whitespace-normal text-center max-w-[80px]">
                    <div>RFQ</div>
                    <div>CLOSING DATE</div>
                  </th>
                  <th className="px-2 py-2 border text-xs font-semibold bg-[#c4bd97] whitespace-normal text-center max-w-[80px]">
                    <div>EVALUATION</div>
                    <div>DATE</div>
                  </th>
                  <th className="px-2 py-2 border text-xs font-semibold bg-[#c4bd97] whitespace-normal text-center max-w-[80px]">
                    <div>NEGOTIATION</div>
                    <div>DATE</div>
                  </th>
                  <th className="px-2 py-2 border text-xs font-semibold bg-[#c4bd97] whitespace-normal text-center max-w-[90px]">
                    <div>CBA REPORT</div>
                    <div>FINALIZED</div>
                  </th>
                  <th className="px-2 py-2 border text-xs font-semibold bg-[#c4bd97] whitespace-normal text-center max-w-[90px]">
                    <div>PURCHASE ORDER</div>
                    <div>ISSUED</div>
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
                    <tr key={item?.id || index} className={
                      isEditAllMode ? "bg-green-50" :
                      isEditing ? "bg-blue-50" : ""
                    }>
                      <td className="px-4 py-2 border text-sm text-center">
                        {isEditAllMode ? (
                          <div className="text-blue-600 font-medium text-xs">
                            Editing
                          </div>
                        ) : isEditing ? (
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
                            disabled={isEditAllMode}
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
                        {safeRender(item?.implementer) || safeRender(item?.implementer_owner) || safeRender(item?.responsible_pr_staff) || safeRender(item?.funding_source) || "N/A"}
                      </td>
                      <td className="px-4 py-2 border text-sm text-gray-500">
                        {safeRender(item?.implementation_location) || safeRender(item?.location)}
                      </td>
                      <td className="px-4 py-2 border text-sm text-gray-500">
                        {safeRender(item?.workplan_activity_reference) || safeRender(item?.activity_reference) || safeRender(item?.activity)}
                      </td>
                      <td className="px-4 py-2 border text-sm text-gray-500">
                        {safeRender(item?.description) || safeRender(item?.description_of_goods_works_services)}
                      </td>
                      <td className="px-4 py-2 border text-sm text-gray-500">
                        {safeRender(item?.budget_ref_num) || safeRender(item?.budget_line_reference_number) || safeRender(item?.procurement_category) || safeRender(item?.budget_line) || "N/A"}
                      </td>
                      <td className="px-4 py-2 border text-sm text-gray-500 min-w-[120px] text-right">
                        {(isEditAllMode || isEditing) ? (
                          <Input
                            type="number"
                            value={
                              isEditAllMode
                                ? (bulkEditData[item.id]?.approved_budget_amount_ngn || item?.approved_budget_amount_ngn || "")
                                : (editedData?.approved_budget_amount_ngn || "")
                            }
                            onChange={(e) => handleCellChange("approved_budget_amount_ngn", e.target.value, item.id)}
                            className="h-8 text-sm w-full"
                          />
                        ) : (
                          <span className="font-mono">₦{item?.approved_budget_amount_ngn ? parseFloat(item?.approved_budget_amount_ngn).toLocaleString() : "N/A"}</span>
                        )}
                      </td>
                      <td className="px-4 py-2 border text-sm text-gray-500 min-w-[120px] text-right">
                        {(isEditAllMode || isEditing) ? (
                          <Input
                            type="number"
                            value={
                              isEditAllMode
                                ? (bulkEditData[item.id]?.approved_budget_amount_usd || item?.approved_budget_amount_usd || "")
                                : (editedData?.approved_budget_amount_usd || "")
                            }
                            onChange={(e) => handleCellChange("approved_budget_amount_usd", e.target.value, item.id)}
                            className="h-8 text-sm w-full"
                          />
                        ) : (
                          <span className="font-mono">${item?.approved_budget_amount_usd ? parseFloat(item?.approved_budget_amount_usd).toLocaleString() : "N/A"}</span>
                        )}
                      </td>
                      <td className="px-4 py-2 border text-sm text-gray-500">{item?.ppm_status || item?.ppm ? "YES" : "NO"}</td>
                      <td className="px-4 py-2 border text-sm text-gray-500">{item?.non_ppm_status || (!item?.ppm ? "YES" : "NO")}</td>
                      <td className="px-4 py-2 border text-sm text-gray-500">{safeRender(item?.financial_year_targets) || safeRender(item?.fy25_targets) || (item?.completion_percentage !== null ? item?.completion_percentage + "%" : "0%")}</td>
                      <td className="px-4 py-2 border text-sm text-gray-500">{safeRender(item?.uom) || safeRender(item?.unit_of_measure) || "N/A"}</td>
                      <td className="px-4 py-2 border text-sm text-gray-500">{safeRender(item?.total_quantity) || safeRender(item?.quantity) || (item?.unit_cost ? parseFloat(item?.unit_cost).toLocaleString() + " @ ₦" + parseFloat(item?.unit_cost).toLocaleString() : "N/A")}</td>
                      <td className="px-4 py-2 border text-sm text-gray-500">{safeRender(item?.responsible_pr_staff) || safeRender(item?.procurement_officer)}</td>
                      <td className="px-4 py-2 border text-sm text-gray-500">{safeRender(item?.mode_of_procurement) || safeRender(item?.procurement_method)}</td>
                      <td className="px-4 py-2 border text-sm text-gray-500">{safeRender(item?.procurement_committee_review) || safeRender(item?.committee_review) || (item?.pre_qualification_required ? "Yes" : "No")}</td>
                      <td className="px-4 py-2 border text-sm text-gray-500">{safeRender(item?.solicitation_method) || safeRender(item?.procurement_process) || safeRender(item?.procurement_method)}</td>
                      <td className="px-4 py-2 border text-sm text-gray-500">{safeRender(item?.procurement_start_date_pr_submission) || safeRender(item?.procurement_start_date) || safeRender(item?.advertisement_date) || safeRender(item?.bid_document_finalization_date)}</td>
                      <td className="px-4 py-2 border text-sm text-gray-500">{safeRender(item?.procurement_method_icb_ncb_etc) || safeRender(item?.procurement_method) || safeRender(item?.mode_of_procurement)}</td>
                      <td className="px-4 py-2 border text-sm text-gray-500">{safeRender(item?.rfq_start_date) || safeRender(item?.bid_submission_deadline) || safeRender(item?.advertisement_date)}</td>
                      <td className="px-4 py-2 border text-sm text-gray-500">{safeRender(item?.rfq_closing_date) || safeRender(item?.bid_opening_date) || safeRender(item?.bid_submission_deadline)}</td>
                      <td className="px-4 py-2 border text-sm text-gray-500">{safeRender(item?.evaluation_date) || safeRender(item?.technical_evaluation_date) || safeRender(item?.financial_evaluation_date)}</td>
                      <td className="px-4 py-2 border text-sm text-gray-500">{safeRender(item?.negotiation_date)}</td>
                      <td className="px-4 py-2 border text-sm text-gray-500">{safeRender(item?.cba_report_finalized) || safeRender(item?.cba_report_date) || safeRender(item?.financial_evaluation_date)}</td>
                      <td className="px-4 py-2 border text-sm text-gray-500">{safeRender(item?.purchase_order_issued) || safeRender(item?.po_issue_date) || safeRender(item?.contract_signing_date)}</td>
                      <td className="px-4 py-2 border text-sm text-gray-500">{safeRender(item?.selected_supplier) || safeRender(item?.supplier_name)}</td>
                      <td className="px-4 py-2 border text-sm text-gray-500">{safeRender(item?.delivery_leadtime_days) || safeRender(item?.delivery_leadtime)}</td>
                      <td className="px-4 py-2 border text-sm text-gray-500">{safeRender(item?.expected_delivery_date) || safeRender(item?.delivery_date) || safeRender(item?.contract_signing_date) || "TBD"}</td>
                      <td className="px-4 py-2 border text-sm text-gray-500">{safeRender(item?.delivery_location_pho_offices_etc) || safeRender(item?.delivery_to) || safeRender(item?.delivery_location_details) || "N/A"}</td>
                      <td className="px-4 py-2 border text-sm text-gray-500">{safeRender(item?.performance_monitoring_remarks) || safeRender(item?.monitoring_remarks) || safeRender(item?.internal_notes) || safeRender(item?.key_performance_indicators)}</td>
                      <td className="px-4 py-2 border text-sm text-gray-500">{safeRender(item?.performance_score) || safeRender(item?.performance_socre) || (item?.completion_percentage !== null ? item?.completion_percentage + "%" : "N/A")}</td>
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
