import { ProcurementPlanResultsData } from "../../../types/procurementPlan";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit2, Save, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";

const OperationalCost = (data: ProcurementPlanResultsData) => {
  const { id: planId } = useParams();
  const queryClient = useQueryClient();
  const [editingRowId, setEditingRowId] = useState<string | null>(null);
  const [editedData, setEditedData] = useState<any>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isEditAllMode, setIsEditAllMode] = useState(false);
  const [bulkEditData, setBulkEditData] = useState<{[key: string]: any}>({});

  const handleEdit = (item: any) => {
    setEditingRowId(item.id);
    setEditedData({ ...item });
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
      const response = await AxiosWithToken.patch(
        `procurements/procurement-plans-new/line-items/${editingRowId}/`,
        editedData
      );

      queryClient.invalidateQueries({
        queryKey: ["procurement-plan", planId],
        refetchType: "all"
      });

      toast.success("Line item updated successfully!");
      setEditingRowId(null);
      setEditedData({});
    } catch (error: any) {
      console.error("Failed to update line item:", error);
      toast.error(error?.response?.data?.message || "Failed to update line item");
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
    const initialData: {[key: string]: any} = {};
    items.forEach((item: any) => {
      initialData[item.id] = { ...item };
    });
    setBulkEditData(initialData);
  };

  const handleSaveAll = async () => {
    try {
      setIsSaving(true);
      const updates = Object.entries(bulkEditData);
      const updatePromises = updates.map(([itemId, data]) => {
        return AxiosWithToken.patch(
          `procurements/procurement-plans-new/line-items/${itemId}/`,
          data
        );
      });

      await Promise.all(updatePromises);

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

  // Safely render any value
  const safeRender = (value: any): string => {
    if (value === null || value === undefined) return "N/A";
    if (typeof value === 'string') {
      if (value.toLowerCase() === 'nan' || value === '' || value.trim() === '') return "N/A";
      return value;
    }
    if (typeof value === 'number') {
      if (isNaN(value)) return "N/A";
      return value.toString();
    }
    if (typeof value === 'boolean') return value ? "Yes" : "No";
    if (typeof value === 'object') {
      if (value && 'job_category' in value && 'code' in value) {
        return value.name || value.description || `Category ${value.code}` || "Category";
      }
      if (value && value.name) return value.name;
      if (value && value.title) return value.title;
      if (value && value.description) return value.description;
      return "[Object]";
    }
    return String(value);
  };

  // Get all items
  const allItems = data?.data?.results || data?.items || data?.line_items || data?.procurement_items || [];

  // Filter for operational cost items based on item_type field
  const items = allItems.filter((item: any) => item?.item_type === 'OPERATIONAL');

  // Show operational items only
  const showItems = items;
  const isFiltered = items.length > 0;

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

  const totalItems = showItems.length;

  return (
    <div className="w-[95%] mx-auto space-y-6">
      <div className="flex justify-between items-center py-5">
        <h3 className="text-primary text-xl font-semibold">
          Operational Cost Details {!isFiltered && "(Showing All Items - No Operational Items Found)"}
        </h3>
        <div className="flex items-center gap-4">
          {totalItems > 0 && (
            <div className="text-sm font-medium text-gray-600 bg-blue-50 px-4 py-2 rounded-lg">
              Total Items: <span className="text-primary font-bold">{totalItems}</span>
              {isFiltered && <span className="text-xs text-green-600 ml-2">(Operational Only)</span>}
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
                <tr className="bg-amber-50">
                  <th
                    colSpan={31}
                    className="text-amber-700 px-4 py-2 border text-center text-sm font-bold"
                  >
                    OPERATIONAL COST
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
                    PROCUREMENT MILESTONES
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
                  <th colSpan={6}></th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody>
                {showItems.length > 0 ? (
                  showItems.map((item, index) => {
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
                            <div className="flex gap-1">
                              <Button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="bg-green-600 hover:bg-green-700"
                                size="sm"
                              >
                                <Save className="h-4 w-4" />
                              </Button>
                              <Button
                                onClick={handleCancel}
                                disabled={isSaving}
                                variant="outline"
                                size="sm"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <Button
                              onClick={() => handleEdit(item)}
                              disabled={isEditAllMode}
                              variant="ghost"
                              size="sm"
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                          )}
                        </td>
                        <td className="px-4 py-2 border text-sm">{index + 1}</td>
                        <td className="px-4 py-2 border text-sm">{renderEditableCell(item, 'implementer', isEditing)}</td>
                        <td className="px-4 py-2 border text-sm">{renderEditableCell(item, 'implementation_location', isEditing)}</td>
                        <td className="px-4 py-2 border text-sm">{renderEditableCell(item, 'workplan_activity_reference', isEditing)}</td>
                        <td className="px-4 py-2 border text-sm">{renderEditableCell(item, 'description', isEditing)}</td>
                        <td className="px-4 py-2 border text-sm">{renderEditableCell(item, 'budget_reference', isEditing)}</td>
                        <td className="px-4 py-2 border text-sm text-right">{renderEditableCell(item, 'approved_budget_amount_ngn', isEditing, 'number')}</td>
                        <td className="px-4 py-2 border text-sm text-right">{renderEditableCell(item, 'approved_budget_amount_usd', isEditing, 'number')}</td>
                        <td className="px-4 py-2 border text-sm">{renderEditableCell(item, 'ppm', isEditing)}</td>
                        <td className="px-4 py-2 border text-sm">{renderEditableCell(item, 'non_ppm', isEditing)}</td>
                        <td className="px-4 py-2 border text-sm">{renderEditableCell(item, 'targets', isEditing)}</td>
                        <td className="px-4 py-2 border text-sm">{renderEditableCell(item, 'uom', isEditing)}</td>
                        <td className="px-4 py-2 border text-sm text-center">{renderEditableCell(item, 'total_quantity', isEditing, 'number')}</td>
                        <td className="px-4 py-2 border text-sm">{renderEditableCell(item, 'responsible_pr_staff', isEditing)}</td>
                        <td className="px-4 py-2 border text-sm">{renderEditableCell(item, 'mode_of_procurement', isEditing)}</td>
                        <td className="px-4 py-2 border text-sm text-center">{renderEditableCell(item, 'procurement_committee_review', isEditing)}</td>
                        <td className="px-4 py-2 border text-sm">{renderEditableCell(item, 'solicitation_method', isEditing)}</td>
                        <td className="px-4 py-2 border text-sm">{renderEditableCell(item, 'procurement_start_date', isEditing, 'date')}</td>
                        <td className="px-4 py-2 border text-sm">{renderEditableCell(item, 'procurement_method', isEditing)}</td>
                        <td className="px-4 py-2 border text-sm">{renderEditableCell(item, 'rfq_start_date', isEditing, 'date')}</td>
                        <td className="px-4 py-2 border text-sm">{renderEditableCell(item, 'rfq_closing_date', isEditing, 'date')}</td>
                        <td className="px-4 py-2 border text-sm">{renderEditableCell(item, 'evaluation_date', isEditing, 'date')}</td>
                        <td className="px-4 py-2 border text-sm">{renderEditableCell(item, 'negotiation_date', isEditing, 'date')}</td>
                        <td className="px-4 py-2 border text-sm">{renderEditableCell(item, 'cba_report_finalized', isEditing, 'date')}</td>
                        <td className="px-4 py-2 border text-sm">{renderEditableCell(item, 'purchase_order_issued', isEditing, 'date')}</td>
                        <td className="px-4 py-2 border text-sm">{renderEditableCell(item, 'selected_supplier', isEditing)}</td>
                        <td className="px-4 py-2 border text-sm text-center">{renderEditableCell(item, 'delivery_leadtime', isEditing, 'number')}</td>
                        <td className="px-4 py-2 border text-sm">{renderEditableCell(item, 'expected_delivery_date', isEditing, 'date')}</td>
                        <td className="px-4 py-2 border text-sm">{renderEditableCell(item, 'delivery_location', isEditing)}</td>
                        <td className="px-4 py-2 border text-sm">{renderEditableCell(item, 'performance_monitoring_remarks', isEditing)}</td>
                        <td className="px-4 py-2 border text-sm text-center">{renderEditableCell(item, 'performance_score', isEditing, 'number')}</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={31} className="px-4 py-8 text-center text-gray-500">
                      No operational cost items found
                    </td>
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

export default OperationalCost;
