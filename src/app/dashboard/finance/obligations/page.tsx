"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Progress } from "@/components/ui/progress";
import {
  FileText,
  Download,
  Plus,
  Eye,
  CheckCircle,
  Clock,
  AlertCircle,
  DollarSign,
  FileSpreadsheet,
  Filter,
  Search,
  Upload,
  X,
  Ban,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";
import DataTable from "@/components/Table/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  useGetObligations,
  useGetObligationSummary,
  useGetMyPendingObligationApprovals,
  useSubmitObligation,
  useApproveObligation,
  useLiquidateObligation,
  useCancelObligation,
  useCreateObligation,
  useExportObligations,
  useGetObligationMetadata,
  getObligationStatusColor,
  formatObligationType,
  formatCurrencyAmount,
  calculateLiquidationPercentage,
} from "@/features/finance/controllers/obligationController";
import {
  Obligation,
  ObligationFilters,
  ObligationStatus,
  ObligationType,
  CreateObligationRequest,
} from "@/features/finance/types/obligation.types";

// Form validation schema
const obligationFormSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  obligation_type: z.enum(["purchase_order", "contract", "service_agreement", "grant_commitment", "other"], {
    required_error: "Please select an obligation type",
  }),
  amount: z.number().min(1, "Amount must be greater than 0"),
  currency: z.string().default("NGN"),
  budget_line_item: z.string().optional(),
  project: z.string().optional(),
  department: z.string().optional(),
  vendor_name: z.string().optional(),
  vendor_contact: z.string().optional(),
  vendor_email: z.string().email("Invalid email").optional().or(z.literal("")),
  obligation_date: z.string().min(1, "Obligation date is required"),
  expected_completion_date: z.string().optional(),
  purchase_order: z.string().optional(),
  reference_number: z.string().optional(),
  contract_number: z.string().optional(),
  notes: z.string().optional(),
  attachments: z.array(z.any()).optional(),
});

export default function ObligationsPage() {
  const [activeTab, setActiveTab] = useState<"all" | "pending" | "mine">("all");
  const [filters, setFilters] = useState<ObligationFilters>({});
  const [selectedObligation, setSelectedObligation] = useState<Obligation | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [approvalDialogOpen, setApprovalDialogOpen] = useState(false);
  const [liquidateDialogOpen, setLiquidateDialogOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [approvalAction, setApprovalAction] = useState<"approve" | "reject">("approve");
  const [approvalComments, setApprovalComments] = useState("");
  const [liquidationAmount, setLiquidationAmount] = useState<number>(0);
  const [liquidationDate, setLiquidationDate] = useState("");
  const [liquidationNotes, setLiquidationNotes] = useState("");
  const [cancellationReason, setCancellationReason] = useState("");

  // Data fetching
  const { data: obligationsData, isLoading: isLoadingObligations } = useGetObligations(filters);
  const { data: summaryData } = useGetObligationSummary(filters);
  const { data: pendingApprovalsData } = useGetMyPendingObligationApprovals(activeTab === "pending");
  const { data: metadataData } = useGetObligationMetadata();

  // Mutations
  const { submitForApproval, isLoading: isSubmitting } = useSubmitObligation(selectedObligation?.id || "");
  const { processApproval, isLoading: isApproving } = useApproveObligation(selectedObligation?.id || "");
  const { liquidate, isLoading: isLiquidating } = useLiquidateObligation(selectedObligation?.id || "");
  const { cancelObligation: cancelOblig, isLoading: isCancelling } = useCancelObligation(selectedObligation?.id || "");
  const { createObligation, isLoading: isCreating } = useCreateObligation();
  const { exportObligations } = useExportObligations();

  // Form
  const form = useForm<z.infer<typeof obligationFormSchema>>({
    resolver: zodResolver(obligationFormSchema),
    defaultValues: {
      title: "",
      description: "",
      obligation_type: undefined,
      amount: 0,
      currency: "NGN",
      budget_line_item: "",
      project: "",
      department: "",
      vendor_name: "",
      vendor_contact: "",
      vendor_email: "",
      obligation_date: "",
      expected_completion_date: "",
      purchase_order: "",
      reference_number: "",
      contract_number: "",
      notes: "",
      attachments: [],
    },
  });

  const obligations = Array.isArray(obligationsData?.data)
    ? obligationsData.data
    : [];
  const pendingApprovals = Array.isArray(pendingApprovalsData?.data)
    ? pendingApprovalsData.data
    : [];
  const summary = summaryData?.data;
  const metadata = metadataData?.data;

  // Filter obligations based on active tab
  const displayedObligations = activeTab === "pending" ? pendingApprovals : obligations;

  // Handlers
  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value === "all" ? undefined : value }));
  };

  const handleClearFilters = () => {
    setFilters({});
  };

  const handleViewObligation = (obligation: Obligation) => {
    setSelectedObligation(obligation);
    setViewDialogOpen(true);
  };

  const handleSubmitForApproval = async (obligation: Obligation) => {
    setSelectedObligation(obligation);
    try {
      await submitForApproval();
      toast.success("Obligation submitted for approval");
    } catch (error: any) {
      toast.error(error?.message || "Failed to submit obligation");
    }
  };

  const handleOpenApprovalDialog = (obligation: Obligation, action: "approve" | "reject") => {
    setSelectedObligation(obligation);
    setApprovalAction(action);
    setApprovalComments("");
    setApprovalDialogOpen(true);
  };

  const handleProcessApproval = async () => {
    try {
      await processApproval({ action: approvalAction, comments: approvalComments });
      toast.success(`Obligation ${approvalAction === "approve" ? "approved" : "rejected"} successfully`);
      setApprovalDialogOpen(false);
      setApprovalComments("");
    } catch (error: any) {
      toast.error(error?.message || "Failed to process approval");
    }
  };

  const handleOpenLiquidateDialog = (obligation: Obligation) => {
    setSelectedObligation(obligation);
    setLiquidationAmount(0);
    setLiquidationDate("");
    setLiquidationNotes("");
    setLiquidateDialogOpen(true);
  };

  const handleLiquidate = async () => {
    if (!liquidationAmount || liquidationAmount <= 0) {
      toast.error("Please enter a valid liquidation amount");
      return;
    }
    if (!liquidationDate) {
      toast.error("Please select a liquidation date");
      return;
    }

    try {
      await liquidate({
        amount: liquidationAmount,
        liquidation_date: liquidationDate,
        notes: liquidationNotes,
      });
      toast.success("Obligation liquidated successfully");
      setLiquidateDialogOpen(false);
    } catch (error: any) {
      toast.error(error?.message || "Failed to liquidate obligation");
    }
  };

  const handleOpenCancelDialog = (obligation: Obligation) => {
    setSelectedObligation(obligation);
    setCancellationReason("");
    setCancelDialogOpen(true);
  };

  const handleCancelObligation = async () => {
    if (!cancellationReason || cancellationReason.trim().length < 10) {
      toast.error("Please provide a detailed cancellation reason (minimum 10 characters)");
      return;
    }

    try {
      await cancelOblig({ cancellation_reason: cancellationReason });
      toast.success("Obligation cancelled successfully");
      setCancelDialogOpen(false);
      setCancellationReason("");
    } catch (error: any) {
      toast.error(error?.message || "Failed to cancel obligation");
    }
  };

  const handleExport = async (format: 'excel' | 'pdf' | 'csv') => {
    try {
      await exportObligations({ format, filters });
      toast.success(`Export to ${format.toUpperCase()} completed`);
    } catch (error: any) {
      toast.error(error?.message || "Failed to export");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files);
      setUploadedFiles(prev => [...prev, ...newFiles]);
      form.setValue("attachments", [...uploadedFiles, ...newFiles]);
    }
  };

  const handleRemoveFile = (index: number) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(newFiles);
    form.setValue("attachments", newFiles);
  };

  const onSubmit = async (values: z.infer<typeof obligationFormSchema>) => {
    try {
      const obligationData: CreateObligationRequest = {
        ...values,
        vendor_email: values.vendor_email || undefined,
        vendor_contact: values.vendor_contact || undefined,
        vendor_name: values.vendor_name || undefined,
        budget_line_item: values.budget_line_item || undefined,
        project: values.project || undefined,
        department: values.department || undefined,
        expected_completion_date: values.expected_completion_date || undefined,
        purchase_order: values.purchase_order || undefined,
        reference_number: values.reference_number || undefined,
        contract_number: values.contract_number || undefined,
        notes: values.notes || undefined,
        attachments: uploadedFiles.length > 0 ? uploadedFiles : undefined,
      };

      await createObligation(obligationData);
      toast.success("Obligation created successfully");
      setCreateDialogOpen(false);
      form.reset();
      setUploadedFiles([]);
    } catch (error: any) {
      toast.error(error?.message || "Failed to create obligation");
    }
  };

  const handleOpenCreateDialog = () => {
    form.reset();
    setUploadedFiles([]);
    setCreateDialogOpen(true);
  };

  // Status badge helper
  const getStatusBadge = (status: ObligationStatus) => {
    const variant = getObligationStatusColor(status);
    const statusLabels: Record<ObligationStatus, string> = {
      draft: "Draft",
      pending_approval: "Pending Approval",
      approved: "Approved",
      active: "Active",
      partially_liquidated: "Partially Liquidated",
      fully_liquidated: "Fully Liquidated",
      cancelled: "Cancelled",
      rejected: "Rejected",
    };

    return (
      <Badge variant={variant} className="text-xs">
        {statusLabels[status]}
      </Badge>
    );
  };

  // Table columns
  const columns: ColumnDef<Obligation>[] = [
    {
      accessorKey: "obligation_number",
      header: "Obligation #",
      cell: ({ row }) => (
        <span className="font-mono text-sm">{row.original.obligation_number}</span>
      ),
    },
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.original.title}</div>
          <div className="text-xs text-gray-500">{formatObligationType(row.original.obligation_type)}</div>
        </div>
      ),
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => (
        <span className="font-semibold">
          {formatCurrencyAmount(row.original.amount, row.original.currency)}
        </span>
      ),
    },
    {
      accessorKey: "liquidated_amount",
      header: "Liquidated",
      cell: ({ row }) => {
        const percent = calculateLiquidationPercentage(
          row.original.liquidated_amount,
          row.original.amount
        );
        return (
          <div className="space-y-1">
            <div className="text-sm font-mono">
              {formatCurrencyAmount(row.original.liquidated_amount, row.original.currency)}
            </div>
            <Progress value={percent} className="h-1.5" />
            <div className="text-xs text-gray-500">{percent}%</div>
          </div>
        );
      },
    },
    {
      accessorKey: "remaining_balance",
      header: "Balance",
      cell: ({ row }) => (
        <span className="font-mono text-orange-600">
          {formatCurrencyAmount(row.original.remaining_balance, row.original.currency)}
        </span>
      ),
    },
    {
      accessorKey: "vendor_name",
      header: "Vendor",
      cell: ({ row }) => (
        <span className="text-sm">{row.original.vendor_name || "—"}</span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => getStatusBadge(row.original.status),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const obligation = row.original;
        return (
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => handleViewObligation(obligation)}
              title="View Details"
            >
              <Eye className="h-4 w-4" />
            </Button>

            {obligation.status === "draft" && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-blue-600"
                onClick={() => handleSubmitForApproval(obligation)}
                title="Submit for Approval"
              >
                <CheckCircle className="h-4 w-4" />
              </Button>
            )}

            {obligation.status === "pending_approval" && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-green-600"
                  onClick={() => handleOpenApprovalDialog(obligation, "approve")}
                  title="Approve"
                >
                  <CheckCircle className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-red-600"
                  onClick={() => handleOpenApprovalDialog(obligation, "reject")}
                  title="Reject"
                >
                  <AlertCircle className="h-4 w-4" />
                </Button>
              </>
            )}

            {(obligation.status === "active" || obligation.status === "partially_liquidated") && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-purple-600"
                  onClick={() => handleOpenLiquidateDialog(obligation)}
                  title="Liquidate"
                >
                  <DollarSign className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-red-600"
                  onClick={() => handleOpenCancelDialog(obligation)}
                  title="Cancel"
                >
                  <Ban className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-3xl font-bold tracking-tight">Obligations</h1>
            <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-700 border-yellow-200">
              ERP Tracking Only
            </Badge>
          </div>
          <p className="text-gray-600">
            Budget commitments and approved purchase orders (Internal tracking - not synced to QuickBooks)
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={() => handleExport('excel')}>
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={handleOpenCreateDialog}>
            <Plus size={20} className="mr-2" />
            New Obligation
          </Button>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Obligations</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {summary?.total_obligations || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {formatCurrencyAmount(summary?.total_amount || 0)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {summary?.by_status?.active || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {formatCurrencyAmount(summary?.active_obligations_amount || 0)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Committed</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {formatCurrencyAmount(summary?.total_committed || 0)}
            </div>
            <p className="text-xs text-muted-foreground">Total committed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unliquidated</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {formatCurrencyAmount(summary?.total_remaining || 0)}
            </div>
            <p className="text-xs text-muted-foreground">Remaining balance</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fully Liquidated</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {summary?.by_status?.fully_liquidated || 0}
            </div>
            <p className="text-xs text-muted-foreground">Completed</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <Search className="w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search obligations..."
              value={filters.search || ""}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              className="w-64"
            />
          </div>

          <Select
            value={filters.status || "all"}
            onValueChange={(value) => handleFilterChange("status", value)}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="pending_approval">Pending Approval</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="partially_liquidated">Partially Liquidated</SelectItem>
              <SelectItem value="fully_liquidated">Fully Liquidated</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.obligation_type || "all"}
            onValueChange={(value) => handleFilterChange("obligation_type", value)}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="purchase_order">Purchase Order</SelectItem>
              <SelectItem value="contract">Contract</SelectItem>
              <SelectItem value="service_agreement">Service Agreement</SelectItem>
              <SelectItem value="grant_commitment">Grant Commitment</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>

          {(filters.search || filters.status || filters.obligation_type) && (
            <Button variant="outline" onClick={handleClearFilters}>
              Clear Filters
            </Button>
          )}

          <div className="ml-auto flex items-center space-x-2 text-sm text-gray-600">
            <Filter className="w-4 h-4" />
            <span>{displayedObligations.length} obligations</span>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)}>
        <TabsList>
          <TabsTrigger value="all">
            All Obligations ({summary?.total_obligations || 0})
          </TabsTrigger>
          <TabsTrigger value="pending">
            Pending My Approval ({pendingApprovals.length})
          </TabsTrigger>
          <TabsTrigger value="mine">
            My Requests
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <DataTable
                columns={columns}
                data={displayedObligations}
                isLoading={isLoadingObligations}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* View Obligation Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Obligation Details</DialogTitle>
            <DialogDescription>
              {selectedObligation?.obligation_number}
            </DialogDescription>
          </DialogHeader>

          {selectedObligation && (
            <div className="space-y-6">
              {/* Header Information */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Obligation Number</Label>
                  <p className="text-sm mt-1">{selectedObligation.obligation_number}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Status</Label>
                  <div className="mt-1">{getStatusBadge(selectedObligation.status)}</div>
                </div>
              </div>

              {/* Basic Information */}
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold mb-3">Basic Information</h3>
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Title</Label>
                    <p className="text-sm mt-1">{selectedObligation.title}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Description</Label>
                    <p className="text-sm mt-1">{selectedObligation.description}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Type</Label>
                    <p className="text-sm mt-1">{formatObligationType(selectedObligation.obligation_type)}</p>
                  </div>
                </div>
              </div>

              {/* Financial Details */}
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold mb-3">Financial Details</h3>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Total Amount:</span>
                    <span className="text-sm font-bold">
                      {formatCurrencyAmount(selectedObligation.amount, selectedObligation.currency)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Liquidated:</span>
                    <span className="text-sm text-green-600">
                      {formatCurrencyAmount(selectedObligation.liquidated_amount, selectedObligation.currency)}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t">
                    <span className="text-sm font-bold">Remaining Balance:</span>
                    <span className="text-sm font-bold text-orange-600">
                      {formatCurrencyAmount(selectedObligation.remaining_balance, selectedObligation.currency)}
                    </span>
                  </div>
                  <div className="mt-2">
                    <Progress
                      value={calculateLiquidationPercentage(
                        selectedObligation.liquidated_amount,
                        selectedObligation.amount
                      )}
                      className="h-2"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {calculateLiquidationPercentage(
                        selectedObligation.liquidated_amount,
                        selectedObligation.amount
                      )}% Liquidated
                    </p>
                  </div>
                </div>
              </div>

              {/* Vendor Information */}
              {selectedObligation.vendor_name && (
                <div className="border-t pt-4">
                  <h3 className="text-lg font-semibold mb-3">Vendor Information</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Vendor Name</Label>
                      <p className="text-sm mt-1">{selectedObligation.vendor_name}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Contact</Label>
                      <p className="text-sm mt-1">{selectedObligation.vendor_contact || "—"}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Email</Label>
                      <p className="text-sm mt-1">{selectedObligation.vendor_email || "—"}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Project Information */}
              {selectedObligation.project && (
                <div className="border-t pt-4">
                  <h3 className="text-lg font-semibold mb-3">Project Allocation</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Project</Label>
                      <p className="text-sm mt-1">{selectedObligation.project.title}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Department</Label>
                      <p className="text-sm mt-1">{selectedObligation.department || "—"}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Notes */}
              {selectedObligation.notes && (
                <div className="border-t pt-4">
                  <Label className="text-sm font-medium text-gray-600">Notes</Label>
                  <p className="text-sm mt-1 text-gray-700">{selectedObligation.notes}</p>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Approval Dialog */}
      <Dialog open={approvalDialogOpen} onOpenChange={setApprovalDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {approvalAction === "approve" ? "Approve" : "Reject"} Obligation
            </DialogTitle>
            <DialogDescription>
              {selectedObligation?.obligation_number} - {selectedObligation?.title}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="approval-comments">Comments</Label>
              <Textarea
                id="approval-comments"
                placeholder={`Enter ${approvalAction} comments...`}
                value={approvalComments}
                onChange={(e) => setApprovalComments(e.target.value)}
                rows={4}
              />
            </div>

            {selectedObligation && (
              <div className="bg-gray-50 p-3 rounded text-sm">
                <div className="flex justify-between mb-1">
                  <span>Amount:</span>
                  <span className="font-semibold">
                    {formatCurrencyAmount(selectedObligation.amount, selectedObligation.currency)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Type:</span>
                  <span>{formatObligationType(selectedObligation.obligation_type)}</span>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setApprovalDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleProcessApproval}
              disabled={isApproving}
              variant={approvalAction === "approve" ? "default" : "destructive"}
            >
              {isApproving ? "Processing..." : approvalAction === "approve" ? "Approve" : "Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Liquidate Obligation Dialog */}
      <Dialog open={liquidateDialogOpen} onOpenChange={setLiquidateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Liquidate Obligation</DialogTitle>
            <DialogDescription>
              Record payment against {selectedObligation?.obligation_number}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="liquidation-amount">Liquidation Amount *</Label>
              <Input
                id="liquidation-amount"
                type="number"
                placeholder="0.00"
                value={liquidationAmount || ""}
                onChange={(e) => setLiquidationAmount(parseFloat(e.target.value) || 0)}
                min="0"
                max={selectedObligation?.remaining_balance || 0}
                step="0.01"
              />
              <p className="text-xs text-gray-500 mt-1">
                Maximum: {formatCurrencyAmount(selectedObligation?.remaining_balance || 0, selectedObligation?.currency || "NGN")}
              </p>
            </div>

            <div>
              <Label htmlFor="liquidation-date">Liquidation Date *</Label>
              <Input
                id="liquidation-date"
                type="date"
                value={liquidationDate}
                onChange={(e) => setLiquidationDate(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="liquidation-notes">Notes (Optional)</Label>
              <Textarea
                id="liquidation-notes"
                placeholder="Enter liquidation notes..."
                value={liquidationNotes}
                onChange={(e) => setLiquidationNotes(e.target.value)}
                rows={3}
              />
            </div>

            {selectedObligation && (
              <div className="bg-blue-50 p-4 rounded">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Total Obligation:</span>
                    <span className="font-semibold">
                      {formatCurrencyAmount(selectedObligation.amount, selectedObligation.currency)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Already Liquidated:</span>
                    <span className="text-green-600">
                      {formatCurrencyAmount(selectedObligation.liquidated_amount, selectedObligation.currency)}
                    </span>
                  </div>
                  <div className="flex justify-between font-semibold pt-2 border-t border-blue-200">
                    <span>Remaining:</span>
                    <span className="text-orange-600">
                      {formatCurrencyAmount(selectedObligation.remaining_balance, selectedObligation.currency)}
                    </span>
                  </div>
                  {liquidationAmount > 0 && (
                    <div className="flex justify-between pt-2 border-t border-blue-200 text-purple-700 font-bold">
                      <span>New Remaining:</span>
                      <span>
                        {formatCurrencyAmount(
                          selectedObligation.remaining_balance - liquidationAmount,
                          selectedObligation.currency
                        )}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setLiquidateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleLiquidate} disabled={isLiquidating}>
              {isLiquidating ? "Processing..." : "Liquidate"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Obligation Dialog */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Obligation</DialogTitle>
            <DialogDescription>
              This action will cancel {selectedObligation?.obligation_number}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="bg-yellow-50 p-3 rounded border border-yellow-200">
              <p className="text-sm text-yellow-800">
                <strong>Warning:</strong> Cancelling this obligation will release the committed budget and mark it as cancelled.
                This action may require re-approval if you need to reactivate it.
              </p>
            </div>

            <div>
              <Label htmlFor="cancellation-reason">Cancellation Reason *</Label>
              <Textarea
                id="cancellation-reason"
                placeholder="Provide a detailed reason for cancellation (minimum 10 characters)..."
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
                rows={4}
              />
              <p className="text-xs text-gray-500 mt-1">
                {cancellationReason.length}/10 characters minimum
              </p>
            </div>

            {selectedObligation && (
              <div className="bg-gray-50 p-3 rounded text-sm">
                <div className="flex justify-between mb-1">
                  <span>Obligation Amount:</span>
                  <span className="font-semibold">
                    {formatCurrencyAmount(selectedObligation.amount, selectedObligation.currency)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Unliquidated Balance:</span>
                  <span className="text-orange-600 font-semibold">
                    {formatCurrencyAmount(selectedObligation.remaining_balance, selectedObligation.currency)}
                  </span>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelDialogOpen(false)}>
              Go Back
            </Button>
            <Button
              onClick={handleCancelObligation}
              disabled={isCancelling}
              variant="destructive"
            >
              {isCancelling ? "Cancelling..." : "Cancel Obligation"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Obligation Dialog - Full Form */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Obligation</DialogTitle>
            <DialogDescription>
              Record a new budget commitment or purchase order
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Basic Information Section */}
              <div className="border rounded-lg p-4 space-y-4">
                <h3 className="text-lg font-semibold">Basic Information</h3>

                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter obligation title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe the obligation..."
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>Minimum 10 characters</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="obligation_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Obligation Type *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="purchase_order">Purchase Order</SelectItem>
                            <SelectItem value="contract">Contract</SelectItem>
                            <SelectItem value="service_agreement">Service Agreement</SelectItem>
                            <SelectItem value="grant_commitment">Grant Commitment</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="obligation_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Obligation Date *</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Financial Details Section */}
              <div className="border rounded-lg p-4 space-y-4">
                <h3 className="text-lg font-semibold">Financial Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Amount *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0.00"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="currency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Currency</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select currency" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="NGN">NGN - Nigerian Naira</SelectItem>
                            <SelectItem value="USD">USD - US Dollar</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Budget Allocation Section */}
              <div className="border rounded-lg p-4 space-y-4">
                <h3 className="text-lg font-semibold">Budget Allocation</h3>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="project"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select project" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="none">No Project</SelectItem>
                            {metadata?.projects?.map((project) => (
                              <SelectItem key={project.id} value={project.id}>
                                {project.title}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="budget_line_item"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Budget Line Item</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select budget line" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="none">No Budget Line</SelectItem>
                            {metadata?.budget_line_items?.map((item) => (
                              <SelectItem key={item.id} value={item.id}>
                                {item.code} - {item.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter department" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Vendor Information Section */}
              <div className="border rounded-lg p-4 space-y-4">
                <h3 className="text-lg font-semibold">Vendor/Supplier Information</h3>
                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="vendor_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vendor Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Vendor name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="vendor_contact"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Number</FormLabel>
                        <FormControl>
                          <Input placeholder="+234 XXX XXX XXXX" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="vendor_email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="vendor@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Additional Information Section */}
              <div className="border rounded-lg p-4 space-y-4">
                <h3 className="text-lg font-semibold">Additional Information</h3>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="expected_completion_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Expected Completion Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="reference_number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Reference Number</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter reference number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="contract_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contract Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter contract number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Add any additional notes..."
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* File Upload */}
                <div>
                  <Label>Attachments</Label>
                  <div className="mt-2">
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById("obligation-file-upload")?.click()}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Files
                      </Button>
                      <Input
                        id="obligation-file-upload"
                        type="file"
                        multiple
                        className="hidden"
                        onChange={handleFileUpload}
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.xlsx,.xls"
                      />
                      <span className="text-xs text-gray-500">
                        PDF, Word, Excel, or Image files
                      </span>
                    </div>

                    {uploadedFiles.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {uploadedFiles.map((file, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm"
                          >
                            <span className="truncate">{file.name}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveFile(index)}
                              className="h-6 w-6 p-0"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setCreateDialogOpen(false);
                    form.reset();
                    setUploadedFiles([]);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isCreating}>
                  {isCreating ? "Creating..." : "Create Obligation"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
