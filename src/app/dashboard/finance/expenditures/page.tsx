"use client";

import { useState } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Receipt,
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
  RefreshCw,
  TrendingDown,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";
import DataTable from "@/components/Table/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  useGetExpenditures,
  useGetExpenditureSummary,
  useGetMyPendingExpenditureApprovals,
  useSubmitExpenditure,
  useApproveExpenditure,
  usePostExpenditure,
  useVoidExpenditure,
  useSyncToQuickBooks,
  useCreateExpenditure,
  useExportExpenditures,
  useGetExpenditureMetadata,
  getExpenditureStatusColor,
  getQuickBooksSyncStatusColor,
  formatExpenditureCategory,
  formatPaymentMethod,
  formatCurrencyAmount,
} from "@/features/finance/controllers/expenditureController";
import {
  Expenditure,
  ExpenditureFilters,
  ExpenditureStatus,
  ExpenditureCategory,
  PaymentMethod,
  PayeeType,
  CreateExpenditureRequest,
} from "@/features/finance/types/expenditure.types";

// Form validation schema
const expenditureFormSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  expenditure_category: z.enum([
    "office_supplies", "utilities", "travel", "accommodation", "meals",
    "transportation", "professional_services", "equipment", "software",
    "training", "marketing", "rent", "salaries", "benefits", "insurance",
    "taxes", "miscellaneous", "other"
  ], {
    required_error: "Please select a category",
  }),
  amount: z.number().min(0.01, "Amount must be greater than 0"),
  currency: z.string().default("NGN"),
  transaction_date: z.string().min(1, "Transaction date is required"),
  payment_method: z.enum(["cash", "check", "bank_transfer", "credit_card", "debit_card", "mobile_money", "other"], {
    required_error: "Please select a payment method",
  }),
  reference_number: z.string().optional(),
  receipt_number: z.string().optional(),
  payee_name: z.string().min(2, "Payee name must be at least 2 characters"),
  payee_type: z.enum(["vendor", "employee", "contractor", "government", "other"], {
    required_error: "Please select a payee type",
  }),
  project: z.string().optional(),
  department: z.string().optional(),
  chart_of_account_id: z.string().optional(),
  is_taxable: z.boolean().default(false),
  tax_rate: z.number().min(0).max(100).optional(),
  notes: z.string().optional(),
  attachments: z.array(z.any()).optional(),
});

export default function RecordedExpensesPage() {
  const [activeTab, setActiveTab] = useState<"all" | "pending" | "mine">("all");
  const [filters, setFilters] = useState<ExpenditureFilters>({});
  const [selectedExpenditure, setSelectedExpenditure] = useState<Expenditure | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [selectedForSync, setSelectedForSync] = useState<string[]>([]);

  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [approvalDialogOpen, setApprovalDialogOpen] = useState(false);
  const [voidDialogOpen, setVoidDialogOpen] = useState(false);
  const [approvalAction, setApprovalAction] = useState<"approve" | "reject">("approve");
  const [approvalComments, setApprovalComments] = useState("");
  const [voidReason, setVoidReason] = useState("");

  // Data fetching
  const { data: expendituresData, isLoading: isLoadingExpenditures } = useGetExpenditures(filters);
  const { data: summaryData } = useGetExpenditureSummary(filters);
  const { data: pendingApprovalsData } = useGetMyPendingExpenditureApprovals(activeTab === "pending");
  const { data: metadataData } = useGetExpenditureMetadata();

  // Mutations
  const { submitForApproval, isLoading: isSubmitting } = useSubmitExpenditure(selectedExpenditure?.id || "");
  const { processApproval, isLoading: isApproving } = useApproveExpenditure(selectedExpenditure?.id || "");
  const { postExpenditure, isLoading: isPosting } = usePostExpenditure(selectedExpenditure?.id || "");
  const { voidExpenditure: voidExp, isLoading: isVoiding } = useVoidExpenditure(selectedExpenditure?.id || "");
  const { syncToQuickBooks, isLoading: isSyncing } = useSyncToQuickBooks();
  const { createExpenditure, isLoading: isCreating } = useCreateExpenditure();
  const { exportExpenditures } = useExportExpenditures();

  // Form
  const form = useForm<z.infer<typeof expenditureFormSchema>>({
    resolver: zodResolver(expenditureFormSchema),
    defaultValues: {
      title: "",
      description: "",
      expenditure_category: undefined,
      amount: 0,
      currency: "NGN",
      transaction_date: "",
      payment_method: undefined,
      reference_number: "",
      receipt_number: "",
      payee_name: "",
      payee_type: undefined,
      project: "",
      department: "",
      chart_of_account_id: "",
      is_taxable: false,
      tax_rate: undefined,
      notes: "",
      attachments: [],
    },
  });

  const expenditures = expendituresData?.data || [];
  const pendingApprovals = pendingApprovalsData?.data || [];
  const summary = summaryData?.data;
  const metadata = metadataData?.data;

  const displayedExpenditures = activeTab === "pending" ? pendingApprovals : expenditures;

  // Tax calculation
  const isTaxable = form.watch("is_taxable");
  const amount = form.watch("amount");
  const taxRate = form.watch("tax_rate");
  const taxAmount = isTaxable && amount && taxRate ? (amount * taxRate) / 100 : 0;

  // Handlers
  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value === "all" ? undefined : value }));
  };

  const handleClearFilters = () => {
    setFilters({});
  };

  const handleViewExpenditure = (expenditure: Expenditure) => {
    setSelectedExpenditure(expenditure);
    setViewDialogOpen(true);
  };

  const handleSubmitForApproval = async (expenditure: Expenditure) => {
    setSelectedExpenditure(expenditure);
    try {
      await submitForApproval();
      toast.success("Expenditure submitted for approval");
    } catch (error: any) {
      toast.error(error?.message || "Failed to submit expenditure");
    }
  };

  const handleOpenApprovalDialog = (expenditure: Expenditure, action: "approve" | "reject") => {
    setSelectedExpenditure(expenditure);
    setApprovalAction(action);
    setApprovalComments("");
    setApprovalDialogOpen(true);
  };

  const handleProcessApproval = async () => {
    try {
      await processApproval({ action: approvalAction, comments: approvalComments });
      toast.success(`Expenditure ${approvalAction === "approve" ? "approved" : "rejected"} successfully`);
      setApprovalDialogOpen(false);
      setApprovalComments("");
    } catch (error: any) {
      toast.error(error?.message || "Failed to process approval");
    }
  };

  const handlePostExpenditure = async (expenditure: Expenditure) => {
    setSelectedExpenditure(expenditure);
    try {
      await postExpenditure();
      toast.success("Expenditure posted to accounting books");
    } catch (error: any) {
      toast.error(error?.message || "Failed to post expenditure");
    }
  };

  const handleOpenVoidDialog = (expenditure: Expenditure) => {
    setSelectedExpenditure(expenditure);
    setVoidReason("");
    setVoidDialogOpen(true);
  };

  const handleVoidExpenditure = async () => {
    if (!voidReason || voidReason.trim().length < 10) {
      toast.error("Please provide a detailed void reason (minimum 10 characters)");
      return;
    }

    try {
      await voidExp({ void_reason: voidReason });
      toast.success("Expenditure voided successfully");
      setVoidDialogOpen(false);
      setVoidReason("");
    } catch (error: any) {
      toast.error(error?.message || "Failed to void expenditure");
    }
  };

  const handleSyncToQuickBooks = async () => {
    try {
      const result = await syncToQuickBooks({
        expenditure_ids: selectedForSync.length > 0 ? selectedForSync : undefined,
        sync_all: selectedForSync.length === 0
      });
      toast.success(`QuickBooks sync completed. Synced: ${result.data?.synced_count || 0}`);
      setSelectedForSync([]);
    } catch (error: any) {
      toast.error(error?.message || "QuickBooks sync failed");
    }
  };

  const handleExport = async (format: 'excel' | 'pdf' | 'csv') => {
    try {
      await exportExpenditures({ format, filters });
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

  const onSubmit = async (values: z.infer<typeof expenditureFormSchema>) => {
    try {
      const expenditureData: CreateExpenditureRequest = {
        ...values,
        reference_number: values.reference_number || undefined,
        receipt_number: values.receipt_number || undefined,
        project: values.project || undefined,
        department: values.department || undefined,
        chart_of_account_id: values.chart_of_account_id || undefined,
        tax_rate: values.is_taxable ? values.tax_rate : undefined,
        notes: values.notes || undefined,
        attachments: uploadedFiles.length > 0 ? uploadedFiles : undefined,
      };

      await createExpenditure(expenditureData);
      toast.success("Expenditure created successfully");
      setCreateDialogOpen(false);
      form.reset();
      setUploadedFiles([]);
    } catch (error: any) {
      toast.error(error?.message || "Failed to create expenditure");
    }
  };

  const handleOpenCreateDialog = () => {
    form.reset();
    setUploadedFiles([]);
    setCreateDialogOpen(true);
  };

  // Status badges
  const getStatusBadge = (status: ExpenditureStatus) => {
    const variant = getExpenditureStatusColor(status);
    const statusLabels: Record<ExpenditureStatus, string> = {
      draft: "Draft",
      pending_approval: "Pending Approval",
      approved: "Approved",
      posted: "Posted",
      rejected: "Rejected",
      voided: "Voided",
    };

    return (
      <Badge variant={variant} className="text-xs">
        {statusLabels[status]}
      </Badge>
    );
  };

  const getQBSyncBadge = (syncStatus: string) => {
    const variant = getQuickBooksSyncStatusColor(syncStatus);
    const labels: Record<string, string> = {
      not_synced: "Not Synced",
      pending_sync: "Pending",
      synced: "Synced",
      sync_failed: "Failed",
    };

    return (
      <Badge variant={variant} className="text-xs">
        {labels[syncStatus] || syncStatus}
      </Badge>
    );
  };

  // Table columns
  const columns: ColumnDef<Expenditure>[] = [
    {
      accessorKey: "expenditure_number",
      header: "Expense #",
      cell: ({ row }) => (
        <span className="font-mono text-sm">{row.original.expenditure_number}</span>
      ),
    },
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.original.title}</div>
          <div className="text-xs text-gray-500">
            {formatExpenditureCategory(row.original.expenditure_category)}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "payee_name",
      header: "Payee",
      cell: ({ row }) => <span className="text-sm">{row.original.payee_name}</span>,
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
      accessorKey: "transaction_date",
      header: "Date",
      cell: ({ row }) => <span className="text-sm">{row.original.transaction_date}</span>,
    },
    {
      accessorKey: "payment_method",
      header: "Payment",
      cell: ({ row }) => (
        <Badge variant="outline" className="text-xs">
          {formatPaymentMethod(row.original.payment_method)}
        </Badge>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => getStatusBadge(row.original.status),
    },
    {
      accessorKey: "quickbooks_sync_status",
      header: "QB Status",
      cell: ({ row }) => getQBSyncBadge(row.original.quickbooks_sync_status),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const expenditure = row.original;
        return (
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => handleViewExpenditure(expenditure)}
              title="View Details"
            >
              <Eye className="h-4 w-4" />
            </Button>

            {expenditure.status === "draft" && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-blue-600"
                onClick={() => handleSubmitForApproval(expenditure)}
                title="Submit for Approval"
              >
                <CheckCircle className="h-4 w-4" />
              </Button>
            )}

            {expenditure.status === "pending_approval" && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-green-600"
                  onClick={() => handleOpenApprovalDialog(expenditure, "approve")}
                  title="Approve"
                >
                  <CheckCircle className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-red-600"
                  onClick={() => handleOpenApprovalDialog(expenditure, "reject")}
                  title="Reject"
                >
                  <AlertCircle className="h-4 w-4" />
                </Button>
              </>
            )}

            {expenditure.status === "approved" && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-purple-600"
                onClick={() => handlePostExpenditure(expenditure)}
                title="Post to Books"
              >
                <Receipt className="h-4 w-4" />
              </Button>
            )}

            {expenditure.status === "posted" && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-red-600"
                onClick={() => handleOpenVoidDialog(expenditure)}
                title="Void"
              >
                <Ban className="h-4 w-4" />
              </Button>
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
            <h1 className="text-3xl font-bold tracking-tight">Recorded Expenses</h1>
            <Badge variant="outline" className="text-xs bg-orange-50 text-orange-700 border-orange-200">
              Syncs to QB as Expenses
            </Badge>
          </div>
          <p className="text-gray-600">
            Actual expenses recorded in accounting books (QuickBooks: Posted Expenses)
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={handleSyncToQuickBooks}
            disabled={isSyncing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
            Sync to QB
          </Button>
          <Button variant="outline" onClick={() => handleExport('excel')}>
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={handleOpenCreateDialog}>
            <Plus size={20} className="mr-2" />
            New Expense
          </Button>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {summary?.total_expenditures || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {formatCurrencyAmount(summary?.total_amount || 0)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {summary?.by_status.pending_approval || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {formatCurrencyAmount(summary?.pending_approval_amount || 0)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Posted</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {summary?.by_status.posted || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {formatCurrencyAmount(summary?.posted_amount || 0)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Synced to QB</CardTitle>
            <RefreshCw className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {summary?.quickbooks_synced_count || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {summary?.quickbooks_pending_sync_count || 0} pending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tax Collected</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {formatCurrencyAmount(summary?.total_tax_amount || 0)}
            </div>
            <p className="text-xs text-muted-foreground">Total tax</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <Search className="w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search expenses..."
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
              <SelectItem value="posted">Posted</SelectItem>
              <SelectItem value="voided">Voided</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.expenditure_category || "all"}
            onValueChange={(value) => handleFilterChange("expenditure_category", value)}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="office_supplies">Office Supplies</SelectItem>
              <SelectItem value="utilities">Utilities</SelectItem>
              <SelectItem value="travel">Travel</SelectItem>
              <SelectItem value="meals">Meals</SelectItem>
              <SelectItem value="transportation">Transportation</SelectItem>
              <SelectItem value="professional_services">Professional Services</SelectItem>
              <SelectItem value="equipment">Equipment</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>

          {(filters.search || filters.status || filters.expenditure_category) && (
            <Button variant="outline" onClick={handleClearFilters}>
              Clear Filters
            </Button>
          )}

          <div className="ml-auto flex items-center space-x-2 text-sm text-gray-600">
            <Filter className="w-4 h-4" />
            <span>{displayedExpenditures.length} expenses</span>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)}>
        <TabsList>
          <TabsTrigger value="all">
            All Expenses ({summary?.total_expenditures || 0})
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
                data={displayedExpenditures}
                isLoading={isLoadingExpenditures}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* View, Approval, Void, and Create dialogs will continue... */}
    </div>
  );
}
