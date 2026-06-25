"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Card from "@/components/Card";
import DataTable from "@/components/Table/DataTable";
import { Button } from "@/components/ui/button";
import { Plus, FileText, DollarSign, Send, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  useGetTaxWithholdings,
  useGetTaxRemittances,
} from "../controllers/taxController";
import {
  TaxWithholdingFilters,
  TaxRemittanceFilters,
  TaxWithholding,
  TaxRemittance,
} from "../types/tax.types";
import PrepareRemittanceDialog from "../components/tax/PrepareRemittanceDialog";
import UpdateRemittanceStatusDialog from "../components/tax/UpdateRemittanceStatusDialog";
import TaxSummaryReportView from "../components/tax/TaxSummaryReportView";

export default function TaxRemittancePage() {
  const [activeTab, setActiveTab] = useState("withholdings");

  // Filter states
  const [withholdingFilters, setWithholdingFilters] = useState<TaxWithholdingFilters>({});
  const [remittanceFilters, setRemittanceFilters] = useState<TaxRemittanceFilters>({});

  // Dialog states
  const [prepareRemittanceOpen, setPrepareRemittanceOpen] = useState(false);
  const [updateStatusOpen, setUpdateStatusOpen] = useState(false);
  const [selectedRemittance, setSelectedRemittance] = useState<TaxRemittance | undefined>();

  // Data fetching
  const { data: withholdingsData, isLoading: withholdingsLoading } = useGetTaxWithholdings(
    activeTab === "withholdings" ? withholdingFilters : undefined
  );

  const { data: pendingWithholdingsData, isLoading: pendingLoading } = useGetTaxWithholdings(
    activeTab === "pending" ? { ...withholdingFilters, remittance_status: "PENDING" } : undefined
  );

  const { data: remittancesData, isLoading: remittancesLoading } = useGetTaxRemittances(
    activeTab === "remittances" ? remittanceFilters : undefined
  );

  // Action handlers
  const handlePrepareRemittance = () => {
    setPrepareRemittanceOpen(true);
  };

  const handleUpdateStatus = (remittance: TaxRemittance) => {
    setSelectedRemittance(remittance);
    setUpdateStatusOpen(true);
  };

  // Column definitions for Tax Withholdings
  const withholdingColumns = [
    {
      accessorKey: "withholding_date",
      header: "Date",
      cell: ({ row }: any) => (
        <span className="text-sm">
          {new Date(row.getValue("withholding_date")).toLocaleDateString()}
        </span>
      ),
    },
    {
      accessorKey: "tax_type_name",
      header: "Tax Type",
      cell: ({ row }: any) => (
        <Badge variant="outline">{row.getValue("tax_type_name")}</Badge>
      ),
    },
    {
      accessorKey: "tax_authority_name",
      header: "Tax Authority",
      cell: ({ row }: any) => (
        <span className="text-sm">{row.getValue("tax_authority_name")}</span>
      ),
    },
    {
      accessorKey: "payment_request_number",
      header: "Payment Request",
      cell: ({ row }: any) => (
        <span className="font-mono text-xs">
          {row.getValue("payment_request_number") || "—"}
        </span>
      ),
    },
    {
      accessorKey: "gross_amount",
      header: "Gross Amount",
      cell: ({ row }: any) => (
        <span className="font-medium">
          ₦{Number(row.getValue("gross_amount")).toLocaleString()}
        </span>
      ),
    },
    {
      accessorKey: "tax_rate",
      header: "Rate",
      cell: ({ row }: any) => (
        <span className="text-sm">
          {Number(row.getValue("tax_rate")).toFixed(2)}%
        </span>
      ),
    },
    {
      accessorKey: "tax_amount",
      header: "Tax Amount",
      cell: ({ row }: any) => (
        <span className="font-semibold text-orange-600">
          ₦{Number(row.getValue("tax_amount")).toLocaleString()}
        </span>
      ),
    },
    {
      accessorKey: "remittance_status",
      header: "Status",
      cell: ({ row }: any) => {
        const status = row.getValue("remittance_status");
        return (
          <Badge variant={status === "REMITTED" ? "default" : "secondary"}>
            {status === "REMITTED" ? "Remitted" : "Pending"}
          </Badge>
        );
      },
    },
  ];

  // Column definitions for Tax Remittances
  const remittanceColumns = [
    {
      accessorKey: "remittance_number",
      header: "Remittance #",
      cell: ({ row }: any) => (
        <Badge variant="outline" className="font-mono">
          {row.getValue("remittance_number")}
        </Badge>
      ),
    },
    {
      accessorKey: "tax_authority_name",
      header: "Tax Authority",
    },
    {
      accessorKey: "tax_type_name",
      header: "Tax Type",
    },
    {
      accessorKey: "period_from",
      header: "Period",
      cell: ({ row }: any) => (
        <span className="text-sm">
          {new Date(row.getValue("period_from")).toLocaleDateString()} -
          {new Date(row.original.period_to).toLocaleDateString()}
        </span>
      ),
    },
    {
      accessorKey: "withholding_count",
      header: "Items",
      cell: ({ row }: any) => (
        <Badge variant="secondary">{row.getValue("withholding_count")} items</Badge>
      ),
    },
    {
      accessorKey: "total_amount",
      header: "Total Amount",
      cell: ({ row }: any) => (
        <span className="font-semibold text-green-600">
          ₦{Number(row.getValue("total_amount")).toLocaleString()}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: any) => {
        const status = row.getValue("status");
        const variant =
          status === "PAID" ? "default" :
          status === "SUBMITTED" ? "secondary" :
          "outline";
        return <Badge variant={variant}>{status}</Badge>;
      },
    },
    {
      accessorKey: "created_by_name",
      header: "Created By",
      cell: ({ row }: any) => (
        <span className="text-sm text-gray-600">
          {row.getValue("created_by_name")}
        </span>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }: any) => {
        const remittance = row.original;
        const canUpdate = remittance.status !== "PAID";

        return (
          <div className="flex items-center space-x-2">
            {canUpdate && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleUpdateStatus(remittance)}
                className="h-8 text-blue-600 hover:text-blue-700"
              >
                <Send className="h-4 w-4 mr-1" />
                Update
              </Button>
            )}
            {remittance.status === "PAID" && (
              <Badge variant="default" className="gap-1">
                <CheckCircle2 className="h-3 w-3" />
                Completed
              </Badge>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tax Remittance</h1>
          <p className="text-muted-foreground mt-1">
            Manage tax withholdings and prepare remittances to tax authorities
          </p>
        </div>
        {activeTab === "pending" && (
          <Button onClick={handlePrepareRemittance} size="default">
            <Plus className="mr-2 h-4 w-4" />
            Prepare Remittance
          </Button>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-2xl grid-cols-4">
          <TabsTrigger value="withholdings" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            All Withholdings
          </TabsTrigger>
          <TabsTrigger value="pending" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Pending
          </TabsTrigger>
          <TabsTrigger value="remittances" className="flex items-center gap-2">
            <Send className="h-4 w-4" />
            Remittances
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Reports
          </TabsTrigger>
        </TabsList>

        <TabsContent value="withholdings" className="mt-6">
          <Card
            title="All Tax Withholdings"
            description="Complete history of all tax withholdings from payments"
          >
            <DataTable
              columns={withholdingColumns}
              data={withholdingsData?.data?.results || []}
              isLoading={withholdingsLoading}
              totalCount={withholdingsData?.data?.count || 0}
              pageSize={10}
              currentPage={1}
              onPageChange={(page) => {}}
            />
          </Card>
        </TabsContent>

        <TabsContent value="pending" className="mt-6">
          <Card
            title="Pending Tax Withholdings"
            description="Tax withholdings ready for remittance to authorities"
          >
            <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-800">
                <strong>Note:</strong> These withholdings have not yet been remitted.
                Click "Prepare Remittance" to batch them for payment to tax authorities.
              </p>
            </div>
            <DataTable
              columns={withholdingColumns}
              data={pendingWithholdingsData?.data?.results || []}
              isLoading={pendingLoading}
              totalCount={pendingWithholdingsData?.data?.count || 0}
              pageSize={10}
              currentPage={1}
              onPageChange={(page) => {}}
            />
          </Card>
        </TabsContent>

        <TabsContent value="remittances" className="mt-6">
          <Card
            title="Tax Remittances"
            description="Batched tax payments to authorities"
          >
            <DataTable
              columns={remittanceColumns}
              data={remittancesData?.data?.results || []}
              isLoading={remittancesLoading}
              totalCount={remittancesData?.data?.count || 0}
              pageSize={10}
              currentPage={1}
              onPageChange={(page) => {}}
            />
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="mt-6">
          <TaxSummaryReportView />
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <PrepareRemittanceDialog
        open={prepareRemittanceOpen}
        onOpenChange={setPrepareRemittanceOpen}
      />

      {selectedRemittance && (
        <UpdateRemittanceStatusDialog
          open={updateStatusOpen}
          onOpenChange={setUpdateStatusOpen}
          remittance={selectedRemittance}
        />
      )}
    </div>
  );
}
