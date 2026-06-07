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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  FileText,
  Download,
  Calendar,
  Plus,
  Edit2,
  Eye,
  CheckCircle,
  Clock,
  AlertCircle,
  DollarSign,
  FileSpreadsheet,
  Printer,
  Receipt,
  Users,
  Calculator,
  Send,
  ThumbsUp,
  ThumbsDown,
  FileCheck
} from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  useGetPettyCashRequests,
  useCreatePettyCashRequest,
  useGetPettyCashAuthorizers,
  useSubmitPettyCashForApproval,
  useApprovePettyCashRequest,
  useDownloadCertificate,
  useExportPettyCash,
  useGetMyPendingApprovals,
  useMarkPettyCashAsPaid
} from "@/features/finance/controllers/pettyCashController";
import { CreatePettyCashRequest, AHNI_PROJECTS, AHNI_DEPARTMENTS, AHNI_LOCATIONS } from "@/features/finance/types/petty-cash.types";

// Form validation schema
const PettyCashFormSchema = z.object({
  payeeName: z.string().min(1, "Payee name is required"),
  purpose: z.string().min(10, "Purpose must be at least 10 characters"),
  amountFigures: z.number().min(1, "Amount must be greater than 0"),
  currency: z.enum(["NGN", "USD"]).default("NGN"),
  project: z.string().min(1, "Project is required"),
  department: z.string().min(1, "Department is required"),
  location: z.string().min(1, "Location is required"),
  authorizerId: z.string().min(1, "Authorizer is required"),
  accountCode: z.string().optional(),
  accountDescription: z.string().optional(),
  notes: z.string().optional(),
});

type PettyCashFormData = z.infer<typeof PettyCashFormSchema>;

// AHNI Petty Cash (Honour Certificate) Data Structure - Legacy interface for demo data
interface LegacyPettyCashRequest {
  id: string;
  certificateNumber: string;
  date: string;
  payeeName: string;
  purpose: string;
  amountWords: string;
  amountFigures: number;
  currency: "NGN" | "USD";
  status: "draft" | "pending_approval" | "approved" | "paid" | "cancelled" | "rejected";
  authorizedBy?: {
    name: string;
    signature: string;
    date: string;
  };
  payeeSignature?: {
    name: string;
    signature: string;
    date: string;
  };
  project: string;
  department: string;
  location: string;
  requestedBy: {
    name: string;
    designation: string;
    date: string;
  };
  accountingEntry?: {
    accountCode: string;
    description: string;
    debit: number;
    credit: number;
  };
  attachments: string[];
  notes?: string;
}

// Sample AHNI Petty Cash Data
const samplePettyCashRequests: LegacyPettyCashRequest[] = [
  {
    id: "pc_001",
    certificateNumber: "HC/2024/001",
    date: "2024-07-13",
    payeeName: "Daniel Otorkpa",
    purpose: "Local transport from Grace land hotel to De-Mandoli Hotel & Suites in Nasarawa",
    amountWords: "Two Thousand Five Hundred Naira Only",
    amountFigures: 2500.00,
    currency: "NGN",
    status: "approved",
    authorizedBy: {
      name: "Elizabeth Ebeifenadi",
      signature: "E. Ebeifenadi",
      date: "2024-07-13"
    },
    payeeSignature: {
      name: "Daniel Otorkpa",
      signature: "D. Otorkpa",
      date: "2024-07-13"
    },
    project: "GF-NAHI",
    department: "Finance",
    location: "Nasarawa",
    requestedBy: {
      name: "Daniel Otorkpa",
      designation: "Senior Accountant",
      date: "2024-07-13"
    },
    accountingEntry: {
      accountCode: "5100-001",
      description: "Travel & Transport",
      debit: 2500.00,
      credit: 0
    },
    attachments: ["receipt_001.pdf"],
    notes: "Hotel to hotel transfer for official assignment"
  },
  {
    id: "pc_002",
    certificateNumber: "HC/2024/002",
    date: "2024-10-15",
    payeeName: "Sarah Johnson",
    purpose: "Office supplies purchase - stationery and printing materials",
    amountWords: "Five Thousand Naira Only",
    amountFigures: 5000.00,
    currency: "NGN",
    status: "pending_approval",
    project: "ACEBAY",
    department: "Admin",
    location: "Lagos",
    requestedBy: {
      name: "Sarah Johnson",
      designation: "Admin Officer",
      date: "2024-10-15"
    },
    accountingEntry: {
      accountCode: "6200-001",
      description: "Office Supplies",
      debit: 5000.00,
      credit: 0
    },
    attachments: ["quotation_001.pdf"],
    notes: "Urgent office supplies needed for monthly reports"
  },
  {
    id: "pc_003",
    certificateNumber: "HC/2024/003",
    date: "2024-10-20",
    payeeName: "Michael Adebayo",
    purpose: "Fuel for generator during power outage",
    amountWords: "Three Thousand Naira Only",
    amountFigures: 3000.00,
    currency: "NGN",
    status: "paid",
    authorizedBy: {
      name: "Charles Ihaza",
      signature: "C. Ihaza",
      date: "2024-10-20"
    },
    payeeSignature: {
      name: "Michael Adebayo",
      signature: "M. Adebayo",
      date: "2024-10-20"
    },
    project: "PLANE",
    department: "Facilities",
    location: "Kano",
    requestedBy: {
      name: "Michael Adebayo",
      designation: "Facilities Officer",
      date: "2024-10-20"
    },
    accountingEntry: {
      accountCode: "6300-001",
      description: "Utilities",
      debit: 3000.00,
      credit: 0
    },
    attachments: ["fuel_receipt.pdf"],
    notes: "Emergency generator fuel during extended power outage"
  }
];

// Common petty cash purposes
const commonPurposes = [
  "Local transport",
  "Office supplies",
  "Fuel for generator",
  "Refreshments for meeting",
  "Courier services",
  "Telephone recharge",
  "Emergency repairs",
  "Cleaning supplies",
  "Stationery purchase",
  "Taxi fare"
];

// AHNI Projects and Departments
const ahniProjects = ["GF-NAHI", "ACEBAY", "PLANE", "SIDHAS", "SHARP+", "UNHCR", "UNFPA", "EPiC"];
const ahniDepartments = ["Finance", "Admin", "HR", "Programs", "Procurement", "Facilities", "IT"];
const ahniLocations = ["Abuja", "Lagos", "Kano", "Gombe", "Nasarawa", "Kaduna"];

export default function PettyCashPage() {
  // Legacy state for demo data - will be replaced by API calls
  const [requests, setRequests] = useState<LegacyPettyCashRequest[]>(samplePettyCashRequests);
  const [selectedProject, setSelectedProject] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedPeriod, setSelectedPeriod] = useState("2024-10");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<LegacyPettyCashRequest | null>(null);
  const [showCertificateView, setShowCertificateView] = useState(false);
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const [currentTab, setCurrentTab] = useState("all");

  // API hooks
  const { data: pettyCashData, isLoading: isLoadingRequests, refetch } = useGetPettyCashRequests({
    status: selectedStatus !== "all" ? selectedStatus : undefined,
    project: selectedProject !== "all" ? selectedProject : undefined,
  });

  const { data: authorizersData, isLoading: isLoadingAuthorizers } = useGetPettyCashAuthorizers();
  const { data: pendingApprovalsData } = useGetMyPendingApprovals();
  const { createRequest, isLoading: isCreating } = useCreatePettyCashRequest();
  const { submitForApproval } = useSubmitPettyCashForApproval("");
  const { processApproval } = useApprovePettyCashRequest("");
  const { downloadCertificate } = useDownloadCertificate();
  const { exportToExcel } = useExportPettyCash();
  const { markAsPaid } = useMarkPettyCashAsPaid("");

  // Form handling
  const form = useForm<PettyCashFormData>({
    resolver: zodResolver(PettyCashFormSchema),
    defaultValues: {
      currency: "NGN",
      amountFigures: 0,
    },
  });

  // Use API data if available, otherwise fallback to sample data
  const displayRequests = Array.isArray(pettyCashData?.data)
    ? pettyCashData.data
    : requests;
  const authorizers = Array.isArray(authorizersData?.data)
    ? authorizersData.data
    : [];

  // Convert API PettyCashRequest to LegacyPettyCashRequest for compatibility
  const convertToLegacy = (apiRequest: any): LegacyPettyCashRequest => ({
    ...apiRequest,
    attachments: apiRequest.attachments?.map((att: any) => att.filename || att.url || '') || []
  });

  const pendingApprovals = pendingApprovalsData?.data?.map(convertToLegacy) || [];

  // Filter requests
  const filteredRequests = requests.filter(req => {
    if (selectedProject !== "all" && req.project !== selectedProject) return false;
    if (selectedStatus !== "all" && req.status !== selectedStatus) return false;
    if (selectedPeriod && !req.date.includes(selectedPeriod.replace("-", "-"))) return false;
    return true;
  });

  const formatCurrency = (amount: number, currency: "NGN" | "USD" = "NGN") => {
    const symbol = currency === "NGN" ? "₦" : "$";
    return `${symbol}${amount.toLocaleString()}`;
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      draft: "outline",
      pending_approval: "secondary",
      approved: "default",
      paid: "default",
      cancelled: "destructive"
    };

    const colors: Record<string, string> = {
      draft: "text-gray-600",
      pending_approval: "text-yellow-600",
      approved: "text-green-600",
      paid: "text-blue-600",
      cancelled: "text-red-600"
    };

    return (
      <Badge variant={variants[status]} className={colors[status]}>
        {status.replace("_", " ").toUpperCase()}
      </Badge>
    );
  };

  const numberToWords = (amount: number): string => {
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const thousands = ['', 'Thousand', 'Million', 'Billion'];

    if (amount === 0) return 'Zero Naira Only';

    function convertHundreds(num: number): string {
      let result = '';

      if (num > 99) {
        result += ones[Math.floor(num / 100)] + ' Hundred ';
        num %= 100;
      }

      if (num > 19) {
        result += tens[Math.floor(num / 10)] + ' ';
        num %= 10;
      } else if (num > 9) {
        result += teens[num - 10] + ' ';
        return result;
      }

      if (num > 0) {
        result += ones[num] + ' ';
      }

      return result;
    }

    let result = '';
    let thousandCounter = 0;

    while (amount > 0) {
      if (amount % 1000 !== 0) {
        result = convertHundreds(amount % 1000) + thousands[thousandCounter] + ' ' + result;
      }
      amount = Math.floor(amount / 1000);
      thousandCounter++;
    }

    return result.trim() + ' Naira Only';
  };

  // Form submission handler
  const onSubmitForm = async (data: PettyCashFormData) => {
    try {
      console.log("Submitting petty cash request:", data);
      await createRequest(data);
      toast.success("Petty cash request created successfully!");
      setShowCreateDialog(false);
      form.reset();
      refetch(); // Refresh the data
    } catch (error: any) {
      toast.error(error.message || "Failed to create petty cash request");
    }
  };

  // Submit for approval
  const handleSubmitForApproval = async (request: LegacyPettyCashRequest) => {
    try {
      await submitForApproval();
      toast.success("Request submitted for approval");
      refetch();
    } catch (error: any) {
      toast.error(error.message || "Failed to submit for approval");
    }
  };

  // Approve/Reject handler
  const handleApprovalAction = async (action: "approve" | "reject", comments?: string) => {
    if (!selectedRequest) return;

    try {
      await processApproval({ action, comments });
      toast.success(`Request ${action}d successfully`);
      setShowApprovalDialog(false);
      setSelectedRequest(null);
      refetch();
    } catch (error: any) {
      toast.error(error.message || `Failed to ${action} request`);
    }
  };

  // Download certificate
  const handleDownloadCertificate = async (request: LegacyPettyCashRequest) => {
    try {
      await downloadCertificate(request.id);
      toast.success("Certificate downloaded successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to download certificate");
    }
  };

  // Export to Excel
  const handleExportToExcel = async () => {
    try {
      await exportToExcel({
        format: "excel",
        includeAttachments: false,
        filters: {
          status: selectedStatus !== "all" ? selectedStatus : undefined,
          project: selectedProject !== "all" ? selectedProject : undefined,
        }
      });
      toast.success("Petty cash records exported successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to export records");
    }
  };

  const printCertificate = (request: LegacyPettyCashRequest) => {
    setSelectedRequest(request);
    setShowCertificateView(true);
  };

  const calculateTotalByStatus = (status: string) => {
    return requests
      .filter(req => req.status === status)
      .reduce((total, req) => total + req.amountFigures, 0);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-3xl font-bold tracking-tight">Petty Cash Management</h1>
            <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
              Syncs to QB as Expenses
            </Badge>
          </div>
          <p className="text-gray-600">
            ACHIEVING HEALTH NIGERIA INITIATIVE - Petty Cash Requests & Approvals (QuickBooks: Cash Expenses)
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={handleExportToExcel} variant="outline">
            <FileSpreadsheet size={16} className="mr-2" />
            Export Excel
          </Button>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus size={16} className="mr-2" />
            New Certificate
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{requests.length}</div>
            <p className="text-xs text-muted-foreground">All certificates</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {requests.filter(r => r.status === "pending_approval").length}
            </div>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(calculateTotalByStatus("pending_approval"))}
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
              {requests.filter(r => r.status === "approved").length}
            </div>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(calculateTotalByStatus("approved"))}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paid Out</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {requests.filter(r => r.status === "paid").length}
            </div>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(calculateTotalByStatus("paid"))}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <Calculator className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {formatCurrency(requests.reduce((total, req) => total + req.amountFigures, 0))}
            </div>
            <p className="text-xs text-muted-foreground">All certificates</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 p-4 bg-white rounded-lg border">
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024-10">Oct 2024</SelectItem>
              <SelectItem value="2024-09">Sep 2024</SelectItem>
              <SelectItem value="2024-08">Aug 2024</SelectItem>
              <SelectItem value="2024-07">Jul 2024</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Select value={selectedProject} onValueChange={setSelectedProject}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Project" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Projects</SelectItem>
            {ahniProjects.map((project) => (
              <SelectItem key={project} value={project || "unknown"}>
                {project}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="pending_approval">Pending Approval</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>

        <div className="ml-auto flex items-center space-x-2 text-sm text-gray-600">
          <Receipt className="w-4 h-4" />
          <span>
            {filteredRequests.length} certificate{filteredRequests.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Tabs for different views */}
      <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All Requests</TabsTrigger>
          <TabsTrigger value="pending-approval">
            Pending My Approval ({pendingApprovals.length})
          </TabsTrigger>
          <TabsTrigger value="my-requests">My Requests</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>All Honour Certificates (Petty Cash)</CardTitle>
            </CardHeader>
            <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Certificate #</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Payee</TableHead>
                <TableHead>Purpose</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-mono">{request.certificateNumber}</TableCell>
                  <TableCell>{request.date}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{request.payeeName}</div>
                      <div className="text-sm text-gray-500">{request.requestedBy.designation}</div>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <div className="truncate" title={request.purpose}>
                      {request.purpose}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{request.project}</Badge>
                  </TableCell>
                  <TableCell className="font-mono">
                    {formatCurrency(request.amountFigures, request.currency)}
                  </TableCell>
                  <TableCell>{getStatusBadge(request.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => printCertificate(request)}
                        title="View Certificate"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>

                      {request.status === "draft" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedRequest(request);
                            setShowCreateDialog(true);
                          }}
                          title="Edit Certificate"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                      )}

                      {request.status === "draft" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSubmitForApproval(request)}
                          title="Submit for Approval"
                        >
                          <Send className="w-4 h-4" />
                        </Button>
                      )}

                      {request.status === "approved" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDownloadCertificate(request)}
                          title="Download Certificate"
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending-approval">
          <Card>
            <CardHeader>
              <CardTitle>Pending My Approval ({pendingApprovals.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {pendingApprovals.length === 0 ? (
                <div className="text-center py-8">
                  <AlertCircle className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">No requests pending your approval</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Certificate #</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Payee</TableHead>
                      <TableHead>Purpose</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Requested By</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingApprovals.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell className="font-mono">{request.certificateNumber}</TableCell>
                        <TableCell>{request.date}</TableCell>
                        <TableCell className="font-medium">{request.payeeName}</TableCell>
                        <TableCell className="max-w-xs">
                          <div className="truncate" title={request.purpose}>
                            {request.purpose}
                          </div>
                        </TableCell>
                        <TableCell className="font-mono">
                          {formatCurrency(request.amountFigures, request.currency)}
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{request.requestedBy.name}</div>
                            <div className="text-sm text-gray-500">{request.requestedBy.designation}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => printCertificate(request)}
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedRequest(request);
                                setShowApprovalDialog(true);
                              }}
                              className="text-green-600 hover:text-green-700"
                              title="Approve"
                            >
                              <ThumbsUp className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedRequest(request);
                                setShowApprovalDialog(true);
                              }}
                              className="text-red-600 hover:text-red-700"
                              title="Reject"
                            >
                              <ThumbsDown className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="my-requests">
          <Card>
            <CardHeader>
              <CardTitle>My Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Certificate #</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Purpose</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequests
                    .filter(req => req.requestedBy.name === "Current User") // This should be dynamic
                    .map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-mono">{request.certificateNumber}</TableCell>
                      <TableCell>{request.date}</TableCell>
                      <TableCell className="max-w-xs">
                        <div className="truncate" title={request.purpose}>
                          {request.purpose}
                        </div>
                      </TableCell>
                      <TableCell className="font-mono">
                        {formatCurrency(request.amountFigures, request.currency)}
                      </TableCell>
                      <TableCell>{getStatusBadge(request.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => printCertificate(request)}
                            title="View Certificate"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>

                          {request.status === "approved" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDownloadCertificate(request)}
                              title="Download Certificate"
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Honour Certificate View Dialog */}
      {selectedRequest && showCertificateView && (
        <Dialog open={showCertificateView} onOpenChange={setShowCertificateView}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-center text-lg font-bold">
                ACHIEVING HEALTH NIGERIA INITIATIVE [AHNI]<br />
                HONOUR CERTIFICATE
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6 p-6 bg-white border rounded-lg font-mono text-sm">
              {/* Date */}
              <div className="text-right">
                <span>Date: {selectedRequest.date}</span>
              </div>

              {/* Certificate Content */}
              <div className="space-y-4">
                <div className="flex">
                  <span className="min-w-[120px]">Name of Payee:</span>
                  <span className="border-b border-dotted border-gray-400 flex-1 px-2">
                    {selectedRequest.payeeName}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex">
                    <span className="min-w-[120px]">Purpose:</span>
                    <span className="border-b border-dotted border-gray-400 flex-1 px-2">
                      {selectedRequest.purpose}
                    </span>
                  </div>
                  <div className="border-b border-dotted border-gray-400 w-full h-4"></div>
                </div>

                <div className="flex">
                  <span className="min-w-[140px]">Amount (Words):</span>
                  <span className="border-b border-dotted border-gray-400 flex-1 px-2">
                    {selectedRequest.amountWords}
                  </span>
                </div>

                <div className="flex">
                  <span className="min-w-[120px]">Amount</span>
                  <span className="border-b border-dotted border-gray-400 flex-1 px-2 text-center font-bold">
                    {formatCurrency(selectedRequest.amountFigures, selectedRequest.currency)}
                  </span>
                </div>
              </div>

              {/* Signature Section */}
              <div className="grid grid-cols-2 gap-8 mt-12">
                <div className="space-y-2">
                  <div className="border-b border-dotted border-gray-400 h-6"></div>
                  <div className="text-center text-xs">
                    Authorized by (Name & Sign)
                  </div>
                  {selectedRequest.authorizedBy && (
                    <div className="text-center text-xs text-gray-600">
                      {selectedRequest.authorizedBy.name}<br />
                      {selectedRequest.authorizedBy.date}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="border-b border-dotted border-gray-400 h-6"></div>
                  <div className="text-center text-xs">
                    Payee (Name & Sign)
                  </div>
                  {selectedRequest.payeeSignature && (
                    <div className="text-center text-xs text-gray-600">
                      {selectedRequest.payeeSignature.name}<br />
                      {selectedRequest.payeeSignature.date}
                    </div>
                  )}
                </div>
              </div>

              {/* Additional Info */}
              <div className="text-xs text-gray-500 border-t pt-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>Certificate #: {selectedRequest.certificateNumber}</div>
                  <div>Project: {selectedRequest.project}</div>
                  <div>Department: {selectedRequest.department}</div>
                </div>
              </div>
            </div>

            <DialogFooter className="flex justify-between">
              <div className="flex space-x-2">
                <Button variant="outline" onClick={() => {
                  window.print();
                  toast.success("Certificate sent to printer");
                }}>
                  <Printer className="w-4 h-4 mr-2" />
                  Print
                </Button>
                <Button variant="outline" onClick={() => {
                  toast.success("Certificate exported to PDF");
                }}>
                  <FileText className="w-4 h-4 mr-2" />
                  Export PDF
                </Button>
              </div>
              <Button onClick={() => setShowCertificateView(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Create/Edit Certificate Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedRequest ? "Edit" : "Create New"} Honour Certificate
            </DialogTitle>
            <DialogDescription>
              Create a new petty cash honour certificate for AHNI. All requests require approval before payment.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={form.handleSubmit(onSubmitForm)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="payeeName">Name of Payee *</Label>
                <Input
                  id="payeeName"
                  placeholder="Enter payee name"
                  {...form.register("payeeName")}
                />
                {form.formState.errors.payeeName && (
                  <p className="text-sm text-red-600">{form.formState.errors.payeeName.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="authorizerId">Select Authorizer *</Label>
                <Select
                  value={form.watch("authorizerId")}
                  onValueChange={(value) => form.setValue("authorizerId", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose an authorizer" />
                  </SelectTrigger>
                  <SelectContent>
                    {authorizers.map((authorizer) => (
                      <SelectItem key={authorizer.id} value={authorizer.id}>
                        {authorizer.name} - {authorizer.designation}
                        <span className="text-sm text-gray-500 ml-2">
                          (Limit: {formatCurrency(authorizer.approvalLimit)})
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.authorizerId && (
                  <p className="text-sm text-red-600">{form.formState.errors.authorizerId.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="amountFigures">Amount (₦) *</Label>
                <Input
                  id="amountFigures"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  {...form.register("amountFigures", { valueAsNumber: true })}
                  onChange={(e) => {
                    const amount = parseFloat(e.target.value) || 0;
                    form.setValue("amountFigures", amount);
                    // Update amount in words display
                    const wordsElement = document.getElementById("amountWords");
                    if (wordsElement) {
                      wordsElement.textContent = numberToWords(amount);
                    }
                  }}
                />
                {form.formState.errors.amountFigures && (
                  <p className="text-sm text-red-600">{form.formState.errors.amountFigures.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="currency">Currency</Label>
                <Select
                  value={form.watch("currency")}
                  onValueChange={(value: "NGN" | "USD") => form.setValue("currency", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NGN">Nigerian Naira (₦)</SelectItem>
                    <SelectItem value="USD">US Dollar ($)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="amountWords">Amount in Words</Label>
              <div
                id="amountWords"
                className="p-2 bg-gray-50 border rounded text-sm min-h-[40px] flex items-center"
              >
                {numberToWords(form.watch("amountFigures") || 0)}
              </div>
            </div>

            <div>
              <Label htmlFor="purpose">Purpose *</Label>
              <Textarea
                id="purpose"
                placeholder="Enter purpose of payment"
                rows={2}
                {...form.register("purpose")}
              />
              {form.formState.errors.purpose && (
                <p className="text-sm text-red-600">{form.formState.errors.purpose.message}</p>
              )}
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="project">Project *</Label>
                <Select
                  value={form.watch("project")}
                  onValueChange={(value) => form.setValue("project", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select project" />
                  </SelectTrigger>
                  <SelectContent>
                    {AHNI_PROJECTS.map((project) => (
                      <SelectItem key={project} value={project}>
                        {project}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.project && (
                  <p className="text-sm text-red-600">{form.formState.errors.project.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="department">Department *</Label>
                <Select
                  value={form.watch("department")}
                  onValueChange={(value) => form.setValue("department", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {AHNI_DEPARTMENTS.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.department && (
                  <p className="text-sm text-red-600">{form.formState.errors.department.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="location">Location *</Label>
                <Select
                  value={form.watch("location")}
                  onValueChange={(value) => form.setValue("location", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    {AHNI_LOCATIONS.map((location) => (
                      <SelectItem key={location} value={location}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.location && (
                  <p className="text-sm text-red-600">{form.formState.errors.location.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="accountCode">Account Code</Label>
                <Input
                  id="accountCode"
                  placeholder="e.g., 5100-001"
                  {...form.register("accountCode")}
                />
              </div>
              <div>
                <Label htmlFor="accountDescription">Account Description</Label>
                <Input
                  id="accountDescription"
                  placeholder="e.g., Travel & Transport"
                  {...form.register("accountDescription")}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                placeholder="Any additional notes or comments"
                rows={2}
                {...form.register("notes")}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowCreateDialog(false);
                  setSelectedRequest(null);
                  form.reset();
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isCreating}>
                {isCreating ? "Creating..." : selectedRequest ? "Update" : "Create"} Certificate
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Approval Dialog */}
      <Dialog open={showApprovalDialog} onOpenChange={setShowApprovalDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Review Petty Cash Request</DialogTitle>
            <DialogDescription>
              Review the request details and approve or reject
            </DialogDescription>
          </DialogHeader>

          {selectedRequest && (
            <div className="space-y-4">
              {/* Request Summary */}
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="font-medium">Certificate #:</span>
                    <span className="ml-2">{selectedRequest.certificateNumber}</span>
                  </div>
                  <div>
                    <span className="font-medium">Amount:</span>
                    <span className="ml-2 font-mono">
                      {formatCurrency(selectedRequest.amountFigures, selectedRequest.currency)}
                    </span>
                  </div>
                </div>
                <div>
                  <span className="font-medium">Payee:</span>
                  <span className="ml-2">{selectedRequest.payeeName}</span>
                </div>
                <div>
                  <span className="font-medium">Purpose:</span>
                  <span className="ml-2">{selectedRequest.purpose}</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="font-medium">Project:</span>
                    <span className="ml-2">{selectedRequest.project}</span>
                  </div>
                  <div>
                    <span className="font-medium">Department:</span>
                    <span className="ml-2">{selectedRequest.department}</span>
                  </div>
                </div>
              </div>

              {/* Approval Actions */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="approvalComments">Comments (Optional)</Label>
                  <Textarea
                    id="approvalComments"
                    placeholder="Add any comments about your decision..."
                    rows={3}
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowApprovalDialog(false);
                      setSelectedRequest(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      const comments = (document.getElementById("approvalComments") as HTMLTextAreaElement)?.value;
                      handleApprovalAction("reject", comments);
                    }}
                  >
                    <ThumbsDown className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                  <Button
                    onClick={() => {
                      const comments = (document.getElementById("approvalComments") as HTMLTextAreaElement)?.value;
                      handleApprovalAction("approve", comments);
                    }}
                  >
                    <ThumbsUp className="w-4 h-4 mr-2" />
                    Approve
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}