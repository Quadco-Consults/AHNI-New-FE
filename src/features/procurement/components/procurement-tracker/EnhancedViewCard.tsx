import { ColumnDef } from "@tanstack/react-table";
import Card from "@/components/Card";
import DataTable from "@/components/Table/DataTable";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { TPaginatedResponse } from "definations/index";
import { ProcurementTrackerResults } from "../../types/procurementPlan";

interface EnhancedViewCardProps {
  data: TPaginatedResponse<ProcurementTrackerResults> | undefined;
}

const EnhancedViewCard = ({ data }: EnhancedViewCardProps) => {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const toggleRowExpansion = (id: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  const columns: ColumnDef<any>[] = [
    {
      header: "Details",
      accessorKey: "details",
      size: 80,
      cell: ({ row }) => {
        const rowId = row.original.id || row.index.toString();
        const isExpanded = expandedRows.has(rowId);

        return (
          <button
            onClick={() => toggleRowExpansion(rowId)}
            className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            {isExpanded ? (
              <ChevronDown size={16} />
            ) : (
              <ChevronRight size={16} />
            )}
            View
          </button>
        );
      },
    },
    {
      header: "PR Reference",
      accessorKey: "pr_reference",
      size: 150,
      cell: ({ row }) => {
        return <div className="font-medium text-sm">{row.original.pr_reference || row.original.pr_id || "N/A"}</div>;
      },
    },
    {
      header: "Item",
      accessorKey: "item_name",
      size: 200,
      cell: ({ row }) => {
        return (
          <div className="text-sm truncate" title={row.original.item_name}>
            {row.original.item_name || "N/A"}
          </div>
        );
      },
    },
    {
      header: "Type",
      accessorKey: "item_type",
      size: 100,
      cell: ({ row }) => {
        const type = row.original.item_type ||
                    (row.original.is_service ? "SERVICE" : "GOODS") ||
                    "Unknown";
        return <div className="text-sm">{type}</div>;
      },
    },
    {
      header: "Department",
      accessorKey: "department",
      size: 120,
      cell: ({ row }) => {
        return <div className="text-sm">{row.original.department || row.original.location || "N/A"}</div>;
      },
    },
    {
      header: "Status",
      accessorKey: "status",
      size: 120,
      cell: ({ row }) => {
        const hasRFQ = row.original.solicitation?.id;
        const hasPO = row.original.purchase_order?.id;
        const hasGRN = row.original.purchase_order?.date_of_grn;

        let status = "Initiated";
        if (hasGRN) status = "Received";
        else if (hasPO) status = "Ordered";
        else if (hasRFQ) status = "RFQ Stage";

        return (
          <Badge
            variant='default'
            className={cn(
              "text-xs",
              status === "Received" ? "bg-green-100 text-green-800" :
              status === "Ordered" ? "bg-blue-100 text-blue-800" :
              status === "RFQ Stage" ? "bg-yellow-100 text-yellow-800" :
              "bg-gray-100 text-gray-800"
            )}
          >
            {status}
          </Badge>
        );
      },
    },
    {
      header: "Officer",
      accessorKey: "procurement_officer",
      size: 150,
      cell: ({ row }) => {
        return <div className="text-sm">{row.original.procurement_officer || "Not assigned"}</div>;
      },
    },
  ];

  const ExpandedRowDetails = ({ rowData }: { rowData: any }) => (
    <div className="bg-gray-50 p-4 border-t">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
        <div>
          <h4 className="font-semibold text-gray-700 mb-2">Request Information</h4>
          <div className="space-y-1">
            <p><span className="font-medium">Requester:</span> {rowData.requester || "N/A"}</p>
            <p><span className="font-medium">Date Required:</span> {rowData.date_goods_required ? new Date(rowData.date_goods_required).toLocaleDateString() : "N/A"}</p>
            <p><span className="font-medium">Request Value:</span> NGN{Number(rowData.purchase_request_value || 0).toLocaleString()}</p>
            <p><span className="font-medium">Description:</span> {rowData.description || "N/A"}</p>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-gray-700 mb-2">Procurement Process</h4>
          <div className="space-y-1">
            <p><span className="font-medium">Process Type:</span> {rowData.solicitation?.tender_type || rowData.procurement_process || "Direct Purchase"}</p>
            <p><span className="font-medium">RFQ Reference:</span> {rowData.solicitation?.reference || "N/A"}</p>
            <p><span className="font-medium">PO Reference:</span> {rowData.purchase_order?.po_reference || "N/A"}</p>
            <p><span className="font-medium">Vendor:</span> {rowData.purchase_order?.vendor || rowData.purchase_order?.vendor_name || "N/A"}</p>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-gray-700 mb-2">Financial Information</h4>
          <div className="space-y-1">
            <p><span className="font-medium">PO Value:</span> NGN{Number(rowData.purchase_order?.total_price || 0).toLocaleString()}</p>
            <p><span className="font-medium">Payment Status:</span> {rowData.purchase_order?.payment_status || "Pending"}</p>
            <p><span className="font-medium">GRN Date:</span> {rowData.purchase_order?.date_of_grn ? new Date(rowData.purchase_order.date_of_grn).toLocaleDateString() : "N/A"}</p>
            <p><span className="font-medium">Delivery Status:</span> {rowData.purchase_order?.service_status || "N/A"}</p>
          </div>
        </div>
      </div>

      {rowData.remarks && (
        <div className="mt-4">
          <h4 className="font-semibold text-gray-700 mb-2">Remarks</h4>
          <p className="text-sm text-gray-600">{rowData.remarks}</p>
        </div>
      )}
    </div>
  );

  const renderExpandableRow = (row: any) => {
    const rowId = row.original.id || row.index.toString();
    const isExpanded = expandedRows.has(rowId);

    return (
      <div key={rowId}>
        <div className="border-b">
          {/* Regular row content would be rendered by DataTable */}
        </div>
        {isExpanded && <ExpandedRowDetails rowData={row.original} />}
      </div>
    );
  };

  return (
    <Card className='space-y-5'>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Enhanced Procurement Tracker View</h3>
        <p className="text-sm text-gray-600">Click "View" to expand detailed information for each procurement item</p>
      </div>

      <div className="space-y-0">
        {(data?.results || []).map((item, index) => {
          const rowId = item.id || index.toString();
          const isExpanded = expandedRows.has(rowId);

          return (
            <div key={rowId} className="border rounded-lg mb-2 overflow-hidden">
              {/* Row Header */}
              <div className="grid grid-cols-7 gap-4 p-3 bg-white hover:bg-gray-50 border-b">
                <div className="flex items-center">
                  <button
                    onClick={() => toggleRowExpansion(rowId)}
                    className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    {isExpanded ? (
                      <ChevronDown size={16} />
                    ) : (
                      <ChevronRight size={16} />
                    )}
                    View
                  </button>
                </div>

                <div className="text-sm font-medium">{item.pr_reference || item.pr_id || "N/A"}</div>

                <div className="text-sm truncate" title={item.item_name}>
                  {item.item_name || "N/A"}
                </div>

                <div className="text-sm">
                  {item.item_type || (item.is_service ? "SERVICE" : "GOODS") || "Unknown"}
                </div>

                <div className="text-sm">{item.department || item.location || "N/A"}</div>

                <div>
                  {(() => {
                    const hasRFQ = item.solicitation?.id;
                    const hasPO = item.purchase_order?.id;
                    const hasGRN = item.purchase_order?.date_of_grn;

                    let status = "Initiated";
                    if (hasGRN) status = "Received";
                    else if (hasPO) status = "Ordered";
                    else if (hasRFQ) status = "RFQ Stage";

                    return (
                      <Badge
                        variant='default'
                        className={cn(
                          "text-xs",
                          status === "Received" ? "bg-green-100 text-green-800" :
                          status === "Ordered" ? "bg-blue-100 text-blue-800" :
                          status === "RFQ Stage" ? "bg-yellow-100 text-yellow-800" :
                          "bg-gray-100 text-gray-800"
                        )}
                      >
                        {status}
                      </Badge>
                    );
                  })()}
                </div>

                <div className="text-sm">{item.procurement_officer || "Not assigned"}</div>
              </div>

              {/* Expanded Details */}
              {isExpanded && <ExpandedRowDetails rowData={item} />}
            </div>
          );
        })}
      </div>

      {(!data?.results || data.results.length === 0) && (
        <div className="text-center py-8 text-gray-500">
          No procurement data available
        </div>
      )}
    </Card>
  );
};

export default EnhancedViewCard;