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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Award,
  Download,
  Plus,
  Edit2,
  Eye,
  CheckCircle,
  Clock,
  AlertCircle,
  DollarSign,
  FileSpreadsheet,
  Printer,
  Users,
  Filter,
  Search,
  Upload,
  X,
} from "lucide-react";
import { toast } from "sonner";
import DataTable from "@/components/Table/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  useGetHonourCertificates,
  useGetHonourCertificateSummary,
  useGetMyPendingCertificateApprovals,
  useSubmitHonourCertificate,
  useApproveHonourCertificate,
  useMarkHonourCertificateAsPaid,
  useDownloadHonourCertificate,
  useExportHonourCertificates,
  useCreateHonourCertificate,
  useGetHonourCertificateMetadata,
  getCertificateStatusColor,
  formatServiceType,
  formatCurrencyAmount,
} from "@/features/finance/controllers/honourCertificateController";
import {
  HonourCertificate,
  HonourCertificateFilters,
  CertificateStatus,
  ServiceType,
  CreateHonourCertificateRequest,
} from "@/features/finance/types/honour-certificate.types";

// Form validation schema
const certificateFormSchema = z.object({
  recipient_name: z.string().min(2, "Recipient name must be at least 2 characters"),
  recipient_email: z.string().email("Invalid email address").optional().or(z.literal("")),
  recipient_phone: z.string().optional(),
  recipient_address: z.string().optional(),
  service_type: z.enum(["facilitation", "training", "consultation", "volunteer_allowance"], {
    required_error: "Please select a service type",
  }),
  service_description: z.string().min(10, "Service description must be at least 10 characters"),
  service_date_from: z.string().min(1, "Start date is required"),
  service_date_to: z.string().min(1, "End date is required"),
  amount_figures: z.number().min(1, "Amount must be greater than 0"),
  amount_words: z.string().optional(),
  currency: z.string().default("NGN"),
  is_taxable: z.boolean().default(false),
  tax_rate: z.number().min(0).max(100).optional(),
  project: z.string().optional(),
  department: z.string().optional(),
  location: z.string().optional(),
  notes: z.string().optional(),
  attachments: z.array(z.any()).optional(),
});

export default function HonourCertificatesPage() {
  const [activeTab, setActiveTab] = useState<"all" | "pending" | "mine">("all");
  const [filters, setFilters] = useState<HonourCertificateFilters>({});
  const [selectedCertificate, setSelectedCertificate] = useState<HonourCertificate | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [approvalDialogOpen, setApprovalDialogOpen] = useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [approvalAction, setApprovalAction] = useState<"approve" | "reject">("approve");
  const [approvalComments, setApprovalComments] = useState("");
  const [paymentNotes, setPaymentNotes] = useState("");
  const [receiptNumber, setReceiptNumber] = useState("");

  // Data fetching
  const { data: certificatesData, isLoading: isLoadingCertificates } = useGetHonourCertificates(filters);
  const { data: summaryData } = useGetHonourCertificateSummary(filters);
  const { data: pendingApprovalsData } = useGetMyPendingCertificateApprovals(activeTab === "pending");
  const { data: metadataData } = useGetHonourCertificateMetadata();

  // Mutations
  const { submitForApproval, isLoading: isSubmitting } = useSubmitHonourCertificate(selectedCertificate?.id || "");
  const { processApproval, isLoading: isApproving } = useApproveHonourCertificate(selectedCertificate?.id || "");
  const { markAsPaid, isLoading: isMarkingPaid } = useMarkHonourCertificateAsPaid(selectedCertificate?.id || "");
  const { downloadCertificate } = useDownloadHonourCertificate();
  const { exportCertificates } = useExportHonourCertificates();
  const { createCertificate, isLoading: isCreating } = useCreateHonourCertificate();

  // Form
  const form = useForm<z.infer<typeof certificateFormSchema>>({
    resolver: zodResolver(certificateFormSchema),
    defaultValues: {
      recipient_name: "",
      recipient_email: "",
      recipient_phone: "",
      recipient_address: "",
      service_type: undefined,
      service_description: "",
      service_date_from: "",
      service_date_to: "",
      amount_figures: 0,
      amount_words: "",
      currency: "NGN",
      is_taxable: false,
      tax_rate: undefined,
      project: "",
      department: "",
      location: "",
      notes: "",
      attachments: [],
    },
  });

  const certificates = certificatesData?.data || [];
  const pendingApprovals = pendingApprovalsData?.data || [];
  const summary = summaryData?.data;
  const metadata = metadataData?.data;

  // Filter certificates based on active tab
  const displayedCertificates = activeTab === "pending" ? pendingApprovals : certificates;

  // Auto-calculate tax amount and net amount
  const isTaxable = form.watch("is_taxable");
  const amount = form.watch("amount_figures");
  const taxRate = form.watch("tax_rate");

  useEffect(() => {
    if (isTaxable && amount && taxRate) {
      const taxAmount = (amount * taxRate) / 100;
      const netAmount = amount - taxAmount;

      // Update form values (not using setValue to avoid triggering validation)
      form.setValue("amount_words", numberToWords(netAmount));
    } else {
      form.setValue("amount_words", numberToWords(amount));
    }
  }, [isTaxable, amount, taxRate, form]);

  // Handlers
  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value === "all" ? undefined : value }));
  };

  const handleClearFilters = () => {
    setFilters({});
  };

  const handleViewCertificate = (certificate: HonourCertificate) => {
    setSelectedCertificate(certificate);
    setViewDialogOpen(true);
  };

  const handleSubmitForApproval = async (certificate: HonourCertificate) => {
    setSelectedCertificate(certificate);
    try {
      await submitForApproval();
      toast.success("Certificate submitted for approval");
    } catch (error: any) {
      toast.error(error?.message || "Failed to submit certificate");
    }
  };

  const handleOpenApprovalDialog = (certificate: HonourCertificate, action: "approve" | "reject") => {
    setSelectedCertificate(certificate);
    setApprovalAction(action);
    setApprovalComments("");
    setApprovalDialogOpen(true);
  };

  const handleProcessApproval = async () => {
    try {
      await processApproval({ action: approvalAction, approval_comments: approvalComments });
      toast.success(`Certificate ${approvalAction === "approve" ? "approved" : "rejected"} successfully`);
      setApprovalDialogOpen(false);
      setApprovalComments("");
    } catch (error: any) {
      toast.error(error?.message || "Failed to process approval");
    }
  };

  const handleOpenPaymentDialog = (certificate: HonourCertificate) => {
    setSelectedCertificate(certificate);
    setPaymentNotes("");
    setReceiptNumber("");
    setPaymentDialogOpen(true);
  };

  const handleMarkAsPaid = async () => {
    try {
      await markAsPaid({ payment_notes: paymentNotes, receipt_number: receiptNumber });
      toast.success("Certificate marked as paid successfully");
      setPaymentDialogOpen(false);
      setPaymentNotes("");
      setReceiptNumber("");
    } catch (error: any) {
      toast.error(error?.message || "Failed to mark certificate as paid");
    }
  };

  const handleDownloadCertificate = async (id: string) => {
    try {
      await downloadCertificate(id);
      toast.success("Certificate downloaded successfully");
    } catch (error: any) {
      toast.error(error?.message || "Failed to download certificate");
    }
  };

  const handleExport = async (format: 'excel' | 'pdf' | 'csv') => {
    try {
      await exportCertificates({ format, filters });
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

  const onSubmit = async (values: z.infer<typeof certificateFormSchema>) => {
    try {
      const certificateData: CreateHonourCertificateRequest = {
        ...values,
        recipient_email: values.recipient_email || undefined,
        recipient_phone: values.recipient_phone || undefined,
        recipient_address: values.recipient_address || undefined,
        amount_words: values.amount_words || undefined,
        tax_rate: values.is_taxable ? values.tax_rate : undefined,
        project: values.project || undefined,
        department: values.department || undefined,
        location: values.location || undefined,
        notes: values.notes || undefined,
        attachments: uploadedFiles.length > 0 ? uploadedFiles : undefined,
      };

      await createCertificate(certificateData);
      toast.success("Honour certificate created successfully");
      setCreateDialogOpen(false);
      form.reset();
      setUploadedFiles([]);
    } catch (error: any) {
      toast.error(error?.message || "Failed to create certificate");
    }
  };

  const handleOpenCreateDialog = () => {
    form.reset();
    setUploadedFiles([]);
    setCreateDialogOpen(true);
  };

  // Helper function to convert number to words (simplified)
  const numberToWords = (num: number): string => {
    if (!num || num === 0) return "Zero Naira";
    // This is a simplified version - you may want to use a library like 'number-to-words'
    return `${num.toLocaleString("en-US")} Naira Only`;
  };

  // Status badge helper
  const getStatusBadge = (status: CertificateStatus) => {
    const variant = getCertificateStatusColor(status);
    const statusLabels: Record<CertificateStatus, string> = {
      draft: "Draft",
      pending_approval: "Pending Approval",
      approved: "Approved",
      paid: "Paid",
      rejected: "Rejected",
      cancelled: "Cancelled",
    };

    return (
      <Badge variant={variant} className="text-xs">
        {statusLabels[status]}
      </Badge>
    );
  };

  // Table columns
  const columns: ColumnDef<HonourCertificate>[] = [
    {
      accessorKey: "certificate_number",
      header: "Certificate #",
      cell: ({ row }) => (
        <span className="font-mono text-sm">{row.original.certificate_number}</span>
      ),
    },
    {
      accessorKey: "recipient_name",
      header: "Recipient",
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.original.recipient_name}</div>
          <div className="text-xs text-gray-500">{row.original.recipient_email}</div>
        </div>
      ),
    },
    {
      accessorKey: "service_type",
      header: "Service Type",
      cell: ({ row }) => (
        <Badge variant="outline" className="text-xs">
          {formatServiceType(row.original.service_type)}
        </Badge>
      ),
    },
    {
      accessorKey: "amount_figures",
      header: "Amount",
      cell: ({ row }) => (
        <div>
          <div className="font-semibold">
            {formatCurrencyAmount(row.original.amount_figures, row.original.currency)}
          </div>
          {row.original.is_taxable && (
            <div className="text-xs text-gray-500">
              Tax: {formatCurrencyAmount(row.original.tax_amount, row.original.currency)}
            </div>
          )}
        </div>
      ),
    },
    {
      accessorKey: "net_amount",
      header: "Net Amount",
      cell: ({ row }) => (
        <span className="font-mono text-green-600">
          {formatCurrencyAmount(row.original.net_amount, row.original.currency)}
        </span>
      ),
    },
    {
      accessorKey: "project",
      header: "Project",
      cell: ({ row }) => (
        <span className="text-sm">{row.original.project?.title || "—"}</span>
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
        const certificate = row.original;
        return (
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => handleViewCertificate(certificate)}
              title="View Details"
            >
              <Eye className="h-4 w-4" />
            </Button>

            {certificate.status === "draft" && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-blue-600"
                onClick={() => handleSubmitForApproval(certificate)}
                title="Submit for Approval"
              >
                <CheckCircle className="h-4 w-4" />
              </Button>
            )}

            {certificate.status === "pending_approval" && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-green-600"
                  onClick={() => handleOpenApprovalDialog(certificate, "approve")}
                  title="Approve"
                >
                  <CheckCircle className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-red-600"
                  onClick={() => handleOpenApprovalDialog(certificate, "reject")}
                  title="Reject"
                >
                  <AlertCircle className="h-4 w-4" />
                </Button>
              </>
            )}

            {certificate.status === "approved" && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-purple-600"
                onClick={() => handleOpenPaymentDialog(certificate)}
                title="Mark as Paid"
              >
                <DollarSign className="h-4 w-4" />
              </Button>
            )}

            {(certificate.status === "paid" || certificate.status === "approved") && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => handleDownloadCertificate(certificate.id)}
                title="Download Certificate"
              >
                <Download className="h-4 w-4" />
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
            <h1 className="text-3xl font-bold tracking-tight">Honour Certificates</h1>
            <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
              Syncs to QB as Vendor Expenses
            </Badge>
          </div>
          <p className="text-gray-600">
            Facilitator and consultant payment certificates (QuickBooks: Vendor Bills/Expenses with Tax)
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={() => handleExport('excel')}>
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={handleOpenCreateDialog}>
            <Plus size={20} className="mr-2" />
            New Certificate
          </Button>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Certificates</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {summary?.total_certificates || 0}
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
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {summary?.by_status.approved || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {formatCurrencyAmount(summary?.approved_amount || 0)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paid</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {summary?.by_status.paid || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {formatCurrencyAmount(summary?.total_net_paid || 0)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tax Withheld</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {formatCurrencyAmount(summary?.total_tax_withheld || 0)}
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
              placeholder="Search certificates..."
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
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.service_type || "all"}
            onValueChange={(value) => handleFilterChange("service_type", value)}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Service Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="facilitation">Facilitation</SelectItem>
              <SelectItem value="training">Training</SelectItem>
              <SelectItem value="consultation">Consultation</SelectItem>
              <SelectItem value="volunteer_allowance">Volunteer Allowance</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center space-x-2">
            <Input
              type="date"
              placeholder="From Date"
              value={filters.date_from || ""}
              onChange={(e) => handleFilterChange("date_from", e.target.value)}
              className="w-40"
            />
            <span className="text-gray-400">to</span>
            <Input
              type="date"
              placeholder="To Date"
              value={filters.date_to || ""}
              onChange={(e) => handleFilterChange("date_to", e.target.value)}
              className="w-40"
            />
          </div>

          {(filters.search || filters.status || filters.service_type || filters.date_from || filters.date_to) && (
            <Button variant="outline" onClick={handleClearFilters}>
              Clear Filters
            </Button>
          )}

          <div className="ml-auto flex items-center space-x-2 text-sm text-gray-600">
            <Filter className="w-4 h-4" />
            <span>{displayedCertificates.length} certificates</span>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)}>
        <TabsList>
          <TabsTrigger value="all">
            All Certificates ({summary?.total_certificates || 0})
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
                data={displayedCertificates}
                isLoading={isLoadingCertificates}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* View Certificate Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Honour Certificate Details</DialogTitle>
            <DialogDescription>
              {selectedCertificate?.certificate_number}
            </DialogDescription>
          </DialogHeader>

          {selectedCertificate && (
            <div className="space-y-6">
              {/* Header Information */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Certificate Number</Label>
                  <p className="text-sm mt-1">{selectedCertificate.certificate_number}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Status</Label>
                  <div className="mt-1">{getStatusBadge(selectedCertificate.status)}</div>
                </div>
              </div>

              {/* Recipient Information */}
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold mb-3">Recipient Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Name</Label>
                    <p className="text-sm mt-1">{selectedCertificate.recipient_name}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Email</Label>
                    <p className="text-sm mt-1">{selectedCertificate.recipient_email || "—"}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Phone</Label>
                    <p className="text-sm mt-1">{selectedCertificate.recipient_phone || "—"}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Address</Label>
                    <p className="text-sm mt-1">{selectedCertificate.recipient_address || "—"}</p>
                  </div>
                </div>
              </div>

              {/* Service Details */}
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold mb-3">Service Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Service Type</Label>
                    <p className="text-sm mt-1">{formatServiceType(selectedCertificate.service_type)}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Service Period</Label>
                    <p className="text-sm mt-1">
                      {selectedCertificate.service_date_from} to {selectedCertificate.service_date_to}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <Label className="text-sm font-medium text-gray-600">Description</Label>
                    <p className="text-sm mt-1">{selectedCertificate.service_description}</p>
                  </div>
                </div>
              </div>

              {/* Financial Details */}
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold mb-3">Financial Details</h3>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Gross Amount:</span>
                    <span className="text-sm font-bold">
                      {formatCurrencyAmount(selectedCertificate.amount_figures, selectedCertificate.currency)}
                    </span>
                  </div>
                  {selectedCertificate.is_taxable && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Tax ({selectedCertificate.tax_rate}%):</span>
                        <span className="text-sm text-red-600">
                          - {formatCurrencyAmount(selectedCertificate.tax_amount, selectedCertificate.currency)}
                        </span>
                      </div>
                      <div className="flex justify-between pt-2 border-t">
                        <span className="text-sm font-bold">Net Amount:</span>
                        <span className="text-sm font-bold text-green-600">
                          {formatCurrencyAmount(selectedCertificate.net_amount, selectedCertificate.currency)}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Project Information */}
              {selectedCertificate.project && (
                <div className="border-t pt-4">
                  <h3 className="text-lg font-semibold mb-3">Project Information</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Project</Label>
                      <p className="text-sm mt-1">{selectedCertificate.project.title}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Department</Label>
                      <p className="text-sm mt-1">{selectedCertificate.department || "—"}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Location</Label>
                      <p className="text-sm mt-1">{selectedCertificate.location || "—"}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Notes */}
              {selectedCertificate.notes && (
                <div className="border-t pt-4">
                  <Label className="text-sm font-medium text-gray-600">Notes</Label>
                  <p className="text-sm mt-1 text-gray-700">{selectedCertificate.notes}</p>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            {selectedCertificate?.status === "paid" && (
              <Button onClick={() => handleDownloadCertificate(selectedCertificate.id)}>
                <Printer className="h-4 w-4 mr-2" />
                Download Certificate
              </Button>
            )}
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
              {approvalAction === "approve" ? "Approve" : "Reject"} Honour Certificate
            </DialogTitle>
            <DialogDescription>
              {selectedCertificate?.certificate_number} - {selectedCertificate?.recipient_name}
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

            {selectedCertificate && (
              <div className="bg-gray-50 p-3 rounded text-sm">
                <div className="flex justify-between mb-1">
                  <span>Amount:</span>
                  <span className="font-semibold">
                    {formatCurrencyAmount(selectedCertificate.amount_figures, selectedCertificate.currency)}
                  </span>
                </div>
                {selectedCertificate.is_taxable && (
                  <>
                    <div className="flex justify-between mb-1">
                      <span>Tax:</span>
                      <span className="text-red-600">
                        {formatCurrencyAmount(selectedCertificate.tax_amount, selectedCertificate.currency)}
                      </span>
                    </div>
                    <div className="flex justify-between font-semibold pt-1 border-t">
                      <span>Net Amount:</span>
                      <span className="text-green-600">
                        {formatCurrencyAmount(selectedCertificate.net_amount, selectedCertificate.currency)}
                      </span>
                    </div>
                  </>
                )}
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

      {/* Mark as Paid Dialog */}
      <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mark Certificate as Paid</DialogTitle>
            <DialogDescription>
              {selectedCertificate?.certificate_number} - {selectedCertificate?.recipient_name}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="receipt-number">Receipt Number (Optional)</Label>
              <Input
                id="receipt-number"
                placeholder="Enter receipt/payment reference number"
                value={receiptNumber}
                onChange={(e) => setReceiptNumber(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="payment-notes">Payment Notes (Optional)</Label>
              <Textarea
                id="payment-notes"
                placeholder="Enter payment notes or comments..."
                value={paymentNotes}
                onChange={(e) => setPaymentNotes(e.target.value)}
                rows={3}
              />
            </div>

            {selectedCertificate && (
              <div className="bg-green-50 p-4 rounded">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Net Amount to Pay:</span>
                  <span className="text-xl font-bold text-green-700">
                    {formatCurrencyAmount(selectedCertificate.net_amount, selectedCertificate.currency)}
                  </span>
                </div>
                {selectedCertificate.is_taxable && (
                  <p className="text-xs text-gray-600 mt-2">
                    Tax withheld: {formatCurrencyAmount(selectedCertificate.tax_amount, selectedCertificate.currency)}
                  </p>
                )}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setPaymentDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleMarkAsPaid} disabled={isMarkingPaid}>
              {isMarkingPaid ? "Processing..." : "Mark as Paid"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create/Edit Certificate Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Honour Certificate</DialogTitle>
            <DialogDescription>
              Create a new honour certificate for facilitator or consultant payments
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Recipient Information Section */}
              <div className="border rounded-lg p-4 space-y-4">
                <h3 className="text-lg font-semibold">Recipient Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="recipient_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Recipient Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter recipient name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="recipient_email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="recipient@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="recipient_phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="+234 XXX XXX XXXX" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="recipient_address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Service Details Section */}
              <div className="border rounded-lg p-4 space-y-4">
                <h3 className="text-lg font-semibold">Service Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="service_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Service Type *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select service type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="facilitation">Facilitation</SelectItem>
                            <SelectItem value="training">Training</SelectItem>
                            <SelectItem value="consultation">Consultation</SelectItem>
                            <SelectItem value="volunteer_allowance">Volunteer Allowance</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-2">
                    <FormField
                      control={form.control}
                      name="service_date_from"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>From Date *</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="service_date_to"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>To Date *</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="service_description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Service Description *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe the service provided..."
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>Minimum 10 characters</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Financial Details Section */}
              <div className="border rounded-lg p-4 space-y-4">
                <h3 className="text-lg font-semibold">Financial Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="amount_figures"
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
                        <FormDescription>Gross amount before tax</FormDescription>
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

                <div className="flex items-start space-x-4 p-3 bg-gray-50 rounded">
                  <FormField
                    control={form.control}
                    name="is_taxable"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Taxable</FormLabel>
                          <FormDescription>
                            Check if withholding tax applies
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />

                  {isTaxable && (
                    <FormField
                      control={form.control}
                      name="tax_rate"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Tax Rate (%)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="0.00"
                              min="0"
                              max="100"
                              step="0.01"
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>

                {/* Tax Calculation Summary */}
                {isTaxable && amount > 0 && taxRate && taxRate > 0 && (
                  <div className="bg-blue-50 p-4 rounded space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">Gross Amount:</span>
                      <span className="font-semibold">
                        {formatCurrencyAmount(amount, form.watch("currency"))}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">Tax ({taxRate}%):</span>
                      <span className="text-red-600 font-semibold">
                        - {formatCurrencyAmount((amount * taxRate) / 100, form.watch("currency"))}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm pt-2 border-t border-blue-200">
                      <span className="font-bold">Net Amount:</span>
                      <span className="text-green-700 font-bold">
                        {formatCurrencyAmount(amount - (amount * taxRate) / 100, form.watch("currency"))}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Project Allocation Section */}
              <div className="border rounded-lg p-4 space-y-4">
                <h3 className="text-lg font-semibold">Project Allocation</h3>
                <div className="grid grid-cols-3 gap-4">
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
                            <SelectItem value="">No Project</SelectItem>
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

                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter location" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Notes Section */}
              <div className="border rounded-lg p-4 space-y-4">
                <h3 className="text-lg font-semibold">Additional Information</h3>
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Add any additional notes or comments..."
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
                        onClick={() => document.getElementById("file-upload")?.click()}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Files
                      </Button>
                      <Input
                        id="file-upload"
                        type="file"
                        multiple
                        className="hidden"
                        onChange={handleFileUpload}
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      />
                      <span className="text-xs text-gray-500">
                        PDF, Word, or Image files
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
                  {isCreating ? "Creating..." : "Create Certificate"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
