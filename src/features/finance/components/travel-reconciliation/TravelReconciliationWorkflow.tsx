"use client";

import React, { useState } from "react";
import { format } from "date-fns";
import {
  Calculator,
  DollarSign,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  Clock,
  AlertTriangle,
  FileText,
  Banknote,
  CreditCard,
  Search,
  Filter
} from "lucide-react";
import { toast } from "sonner";

// UI Components
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Types and Controllers
import {
  useProcessReconciliation,
} from "@/features/hr/controllers/employeeTravelExpenseController";
import {
  useGetAllTravelExpenses
} from "@/features/admin/controllers/travelExpenseController";

interface TravelReconciliationWorkflowProps {
  // Can be used by finance team to manage all reconciliations
}

const TravelReconciliationWorkflow: React.FC<TravelReconciliationWorkflowProps> = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedReconciliationType, setSelectedReconciliationType] = useState("all");
  const [selectedExpense, setSelectedExpense] = useState<any>(null);
  const [processingNotes, setProcessingNotes] = useState("");
  const [isProcessingDialogOpen, setIsProcessingDialogOpen] = useState(false);

  // Document upload states
  const [reimbursementInvoice, setReimbursementInvoice] = useState<File | null>(null);
  const [retirementReceipt, setRetirementReceipt] = useState<File | null>(null);
  const [supportingDocuments, setSupportingDocuments] = useState<File[]>([]);
  const [documentDescriptions, setDocumentDescriptions] = useState<string[]>([]);

  // Fetch all travel expenses that need reconciliation
  const { data: expensesData, isLoading, refetch } = useGetAllTravelExpenses({
    page: 1,
    size: 100,
    search: searchTerm,
    status: "APPROVED", // Only approved expenses need reconciliation
  });

  const { processReconciliation, isLoading: isProcessingReconciliation } = useProcessReconciliation();

  const expenses = expensesData?.data?.results || [];

  // Calculate reconciliation data for each expense
  const expensesWithReconciliation = React.useMemo(() => {
    return expenses.map((expense: any) => {
      const actualTotal = (expense.activities || []).reduce((total: number, activity: any) => {
        return total +
          parseFloat(activity.airport_taxi_fee || 0) +
          parseFloat(activity.registration_fee || 0) +
          parseFloat(activity.inter_city_taxi_fee || 0) +
          parseFloat(activity.others || 0);
      }, 0);

      const budgetedTotal = expense.expense_authorization?.budgeted_total ||
                           expense.site_visit?.travel_fees?.total_cost || 0;

      const difference = actualTotal - budgetedTotal;
      const reconciliationType = difference > 0 ? "REIMBURSEMENT" : difference < 0 ? "RETIREMENT" : "BALANCED";
      const reconciliationAmount = Math.abs(difference);

      return {
        ...expense,
        actualTotal,
        budgetedTotal,
        difference,
        reconciliationType,
        reconciliationAmount,
        needsAction: reconciliationAmount > 0,
      };
    });
  }, [expenses]);

  // Filter expenses based on reconciliation type
  const filteredExpenses = expensesWithReconciliation.filter((expense: any) => {
    if (selectedReconciliationType !== "all" && expense.reconciliationType !== selectedReconciliationType) {
      return false;
    }
    return true;
  });

  // Calculate summary statistics
  const summary = React.useMemo(() => {
    const reimbursements = filteredExpenses.filter((e: any) => e.reconciliationType === "REIMBURSEMENT");
    const retirements = filteredExpenses.filter((e: any) => e.reconciliationType === "RETIREMENT");
    const balanced = filteredExpenses.filter((e: any) => e.reconciliationType === "BALANCED");

    return {
      total: filteredExpenses.length,
      reimbursements: reimbursements.length,
      retirements: retirements.length,
      balanced: balanced.length,
      totalReimbursementAmount: reimbursements.reduce((sum, e) => sum + e.reconciliationAmount, 0),
      totalRetirementAmount: retirements.reduce((sum, e) => sum + e.reconciliationAmount, 0),
    };
  }, [filteredExpenses]);

  // Handle file uploads
  const handleFileUpload = (file: File, type: "reimbursement" | "retirement" | "supporting") => {
    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB");
      return;
    }

    // Validate file type
    const allowedTypes = [
      "image/jpeg", "image/png", "image/jpg",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error("Only PDF, JPG, PNG, DOC, DOCX files are allowed");
      return;
    }

    switch (type) {
      case "reimbursement":
        setReimbursementInvoice(file);
        break;
      case "retirement":
        setRetirementReceipt(file);
        break;
      case "supporting":
        setSupportingDocuments(prev => [...prev, file]);
        setDocumentDescriptions(prev => [...prev, ""]);
        break;
    }
  };

  // Remove supporting document
  const removeSupportingDocument = (index: number) => {
    setSupportingDocuments(prev => prev.filter((_, i) => i !== index));
    setDocumentDescriptions(prev => prev.filter((_, i) => i !== index));
  };

  // Update document description
  const updateDocumentDescription = (index: number, description: string) => {
    setDocumentDescriptions(prev => {
      const updated = [...prev];
      updated[index] = description;
      return updated;
    });
  };

  // Reset form data
  const resetFormData = () => {
    setProcessingNotes("");
    setReimbursementInvoice(null);
    setRetirementReceipt(null);
    setSupportingDocuments([]);
    setDocumentDescriptions([]);
  };

  // Handle reconciliation processing
  const handleProcessReconciliation = async (action: "approve" | "request_reimbursement" | "request_retirement") => {
    if (!selectedExpense) return;

    // Validate required documents
    if (action === "request_reimbursement" && !reimbursementInvoice) {
      toast.error("Please upload a reimbursement invoice/receipt");
      return;
    }

    if (action === "request_retirement" && !retirementReceipt) {
      toast.error("Please upload a fund retirement receipt");
      return;
    }

    try {
      await processReconciliation({
        travelExpenseId: selectedExpense.id,
        action,
        notes: processingNotes,
        reimbursementInvoice: reimbursementInvoice || undefined,
        retirementReceipt: retirementReceipt || undefined,
        supportingDocuments: supportingDocuments.length > 0 ? supportingDocuments : undefined,
        documentDescriptions: documentDescriptions.length > 0 ? documentDescriptions : undefined,
      });

      toast.success(`Reconciliation ${action.replace('_', ' ')} processed successfully`);
      setIsProcessingDialogOpen(false);
      setSelectedExpense(null);
      resetFormData();
      refetch();
    } catch (error: any) {
      toast.error("Failed to process reconciliation: " + (error.message || "Unknown error"));
    }
  };

  // Get reconciliation badge
  const getReconciliationBadge = (type: string) => {
    const badges = {
      REIMBURSEMENT: <Badge className="bg-red-100 text-red-800">Reimbursement Due</Badge>,
      RETIREMENT: <Badge className="bg-orange-100 text-orange-800">Retirement Required</Badge>,
      BALANCED: <Badge className="bg-green-100 text-green-800">Balanced</Badge>,
    };
    return badges[type as keyof typeof badges] || <Badge variant="outline">Unknown</Badge>;
  };

  // Get reconciliation status badge
  const getStatusBadge = (reconciliation: any) => {
    if (!reconciliation) {
      return <Badge variant="outline">Pending Calculation</Badge>;
    }

    const statusColors = {
      PENDING: "bg-yellow-100 text-yellow-800",
      PROCESSED: "bg-blue-100 text-blue-800",
      COMPLETED: "bg-green-100 text-green-800",
    };

    return (
      <Badge className={statusColors[reconciliation.reconciliation_status as keyof typeof statusColors]}>
        {reconciliation.reconciliation_status}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Travel Expense Reconciliation</h1>
          <p className="text-gray-600">
            Manage travel expense reconciliations, reimbursements, and fund retirements
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reconciliations</CardTitle>
            <Calculator className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{summary.total}</div>
            <p className="text-xs text-muted-foreground">Approved TERs for reconciliation</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reimbursements Due</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{summary.reimbursements}</div>
            <p className="text-xs text-muted-foreground">
              ₦{summary.totalReimbursementAmount.toLocaleString()} total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Retirements Required</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{summary.retirements}</div>
            <p className="text-xs text-muted-foreground">
              ₦{summary.totalRetirementAmount.toLocaleString()} total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Balanced</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{summary.balanced}</div>
            <p className="text-xs text-muted-foreground">No action required</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="reconciliations" className="space-y-4">
        <TabsList>
          <TabsTrigger value="reconciliations">Reconciliation Queue</TabsTrigger>
          <TabsTrigger value="reimbursements">Reimbursement Processing</TabsTrigger>
          <TabsTrigger value="retirements">Fund Retirement</TabsTrigger>
          <TabsTrigger value="reports">Reconciliation Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="reconciliations" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Travel Expense Reconciliations</CardTitle>
                  <CardDescription>
                    Review and process travel expense reconciliations
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by employee or travel purpose..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
                <Select value={selectedReconciliationType} onValueChange={setSelectedReconciliationType}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Reconciliation Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="REIMBURSEMENT">Reimbursement Due</SelectItem>
                    <SelectItem value="RETIREMENT">Retirement Required</SelectItem>
                    <SelectItem value="BALANCED">Balanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Reconciliation Table */}
              {isLoading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  <span className="ml-2">Loading reconciliations...</span>
                </div>
              ) : filteredExpenses.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Travel Purpose</TableHead>
                      <TableHead>Submission Date</TableHead>
                      <TableHead>Budgeted</TableHead>
                      <TableHead>Actual</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredExpenses.map((expense: any) => (
                      <TableRow key={expense.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{expense.user?.full_name || expense.user}</div>
                            <div className="text-sm text-gray-500">{expense.staff_id}</div>
                          </div>
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          {expense.travel_purpose}
                        </TableCell>
                        <TableCell>
                          {format(new Date(expense.created_datetime), "MMM dd, yyyy")}
                        </TableCell>
                        <TableCell>₦{expense.budgetedTotal.toLocaleString()}</TableCell>
                        <TableCell>₦{expense.actualTotal.toLocaleString()}</TableCell>
                        <TableCell>{getReconciliationBadge(expense.reconciliationType)}</TableCell>
                        <TableCell>
                          <span className={
                            expense.reconciliationType === "REIMBURSEMENT" ? "text-red-600" :
                            expense.reconciliationType === "RETIREMENT" ? "text-orange-600" :
                            "text-green-600"
                          }>
                            ₦{expense.reconciliationAmount.toLocaleString()}
                          </span>
                        </TableCell>
                        <TableCell>{getStatusBadge(expense.reconciliation)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedExpense(expense);
                                setIsProcessingDialogOpen(true);
                              }}
                              disabled={expense.reconciliationType === "BALANCED"}
                            >
                              <FileText className="h-4 w-4" />
                              Process
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8">
                  <Calculator className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No reconciliations pending</h3>
                  <p className="text-gray-600">
                    All approved travel expense reports have been reconciled.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reimbursements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Reimbursement Processing</CardTitle>
              <CardDescription>
                Manage employee reimbursements for excess travel expenses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert>
                  <Banknote className="h-4 w-4" />
                  <AlertDescription>
                    {summary.reimbursements} employee{summary.reimbursements !== 1 ? 's' : ''} require reimbursement totaling ₦{summary.totalReimbursementAmount.toLocaleString()}.
                  </AlertDescription>
                </Alert>

                {/* Reimbursement Queue */}
                <div className="space-y-3">
                  {filteredExpenses
                    .filter((e: any) => e.reconciliationType === "REIMBURSEMENT")
                    .map((expense: any) => (
                      <div key={expense.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="font-medium">{expense.user?.full_name}</div>
                          <div className="text-sm text-gray-500">{expense.travel_purpose}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-red-600">₦{expense.reconciliationAmount.toLocaleString()}</div>
                          <div className="text-sm text-gray-500">Reimbursement due</div>
                        </div>
                        <Button size="sm" className="ml-4">
                          <CreditCard className="h-4 w-4 mr-1" />
                          Process Payment
                        </Button>
                      </div>
                    ))
                  }
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="retirements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Fund Retirement</CardTitle>
              <CardDescription>
                Manage fund retirements from employees who spent less than budgeted
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert>
                  <TrendingDown className="h-4 w-4" />
                  <AlertDescription>
                    {summary.retirements} employee{summary.retirements !== 1 ? 's' : ''} need to return ₦{summary.totalRetirementAmount.toLocaleString()} in unspent funds.
                  </AlertDescription>
                </Alert>

                {/* Retirement Queue */}
                <div className="space-y-3">
                  {filteredExpenses
                    .filter((e: any) => e.reconciliationType === "RETIREMENT")
                    .map((expense: any) => (
                      <div key={expense.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="font-medium">{expense.user?.full_name}</div>
                          <div className="text-sm text-gray-500">{expense.travel_purpose}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-orange-600">₦{expense.reconciliationAmount.toLocaleString()}</div>
                          <div className="text-sm text-gray-500">To be returned</div>
                        </div>
                        <Button size="sm" variant="outline" className="ml-4">
                          <AlertTriangle className="h-4 w-4 mr-1" />
                          Follow Up
                        </Button>
                      </div>
                    ))
                  }
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Reconciliation Reports</CardTitle>
              <CardDescription>
                Generate reports for travel expense reconciliations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="h-20 justify-start p-4">
                  <div className="flex items-center gap-3">
                    <FileText className="h-6 w-6 text-blue-600" />
                    <div className="text-left">
                      <div className="font-medium">Monthly Reconciliation Summary</div>
                      <div className="text-sm text-gray-500">Overview of all reconciliations</div>
                    </div>
                  </div>
                </Button>

                <Button variant="outline" className="h-20 justify-start p-4">
                  <div className="flex items-center gap-3">
                    <Banknote className="h-6 w-6 text-green-600" />
                    <div className="text-left">
                      <div className="font-medium">Reimbursement Report</div>
                      <div className="text-sm text-gray-500">Outstanding reimbursements</div>
                    </div>
                  </div>
                </Button>

                <Button variant="outline" className="h-20 justify-start p-4">
                  <div className="flex items-center gap-3">
                    <TrendingDown className="h-6 w-6 text-orange-600" />
                    <div className="text-left">
                      <div className="font-medium">Fund Retirement Report</div>
                      <div className="text-sm text-gray-500">Pending fund returns</div>
                    </div>
                  </div>
                </Button>

                <Button variant="outline" className="h-20 justify-start p-4">
                  <div className="flex items-center gap-3">
                    <Calculator className="h-6 w-6 text-purple-600" />
                    <div className="text-left">
                      <div className="font-medium">Budget vs Actual Analysis</div>
                      <div className="text-sm text-gray-500">Variance analysis report</div>
                    </div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Processing Dialog */}
      <Dialog open={isProcessingDialogOpen} onOpenChange={setIsProcessingDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Process Reconciliation</DialogTitle>
            <DialogDescription>
              Review and process the travel expense reconciliation
            </DialogDescription>
          </DialogHeader>

          {selectedExpense && (
            <div className="space-y-4">
              {/* Expense Summary */}
              <div className="grid grid-cols-2 gap-4 p-4 border rounded-lg">
                <div>
                  <Label className="text-sm font-medium">Employee</Label>
                  <div>{selectedExpense.user?.full_name}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Travel Purpose</Label>
                  <div>{selectedExpense.travel_purpose}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Budgeted Amount</Label>
                  <div>₦{selectedExpense.budgetedTotal.toLocaleString()}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Actual Expenses</Label>
                  <div>₦{selectedExpense.actualTotal.toLocaleString()}</div>
                </div>
                <div className="col-span-2">
                  <Label className="text-sm font-medium">Reconciliation Type</Label>
                  <div>{getReconciliationBadge(selectedExpense.reconciliationType)}</div>
                </div>
                <div className="col-span-2">
                  <Label className="text-sm font-medium">Amount</Label>
                  <div className="text-lg font-bold text-red-600">
                    ₦{selectedExpense.reconciliationAmount.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Document Upload Section */}
              <div className="space-y-4">
                <h4 className="font-semibold text-lg border-b pb-2">Supporting Documents</h4>

                {/* Reimbursement Invoice Upload */}
                {selectedExpense?.reconciliationType === "REIMBURSEMENT" && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-red-700">
                      Reimbursement Invoice/Receipt *
                    </Label>
                    <div className="border-2 border-dashed border-red-200 rounded-lg p-4">
                      {reimbursementInvoice ? (
                        <div className="flex items-center justify-between p-2 bg-red-50 border border-red-200 rounded">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-red-600" />
                            <div>
                              <div className="font-medium text-red-900">{reimbursementInvoice.name}</div>
                              <div className="text-sm text-red-600">
                                {(reimbursementInvoice.size / 1024 / 1024).toFixed(2)} MB
                              </div>
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setReimbursementInvoice(null)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Remove
                          </Button>
                        </div>
                      ) : (
                        <div className="text-center">
                          <Upload className="h-8 w-8 text-red-400 mx-auto mb-2" />
                          <div className="text-sm text-red-600 mb-2">
                            Upload invoice or receipt for reimbursement payment
                          </div>
                          <Input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleFileUpload(file, "reimbursement");
                            }}
                            className="text-sm"
                          />
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-red-600">
                      Required: Upload an invoice or receipt showing reimbursement payment details
                    </p>
                  </div>
                )}

                {/* Retirement Receipt Upload */}
                {selectedExpense?.reconciliationType === "RETIREMENT" && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-orange-700">
                      Fund Retirement Receipt *
                    </Label>
                    <div className="border-2 border-dashed border-orange-200 rounded-lg p-4">
                      {retirementReceipt ? (
                        <div className="flex items-center justify-between p-2 bg-orange-50 border border-orange-200 rounded">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-orange-600" />
                            <div>
                              <div className="font-medium text-orange-900">{retirementReceipt.name}</div>
                              <div className="text-sm text-orange-600">
                                {(retirementReceipt.size / 1024 / 1024).toFixed(2)} MB
                              </div>
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setRetirementReceipt(null)}
                            className="text-orange-600 hover:text-orange-800"
                          >
                            Remove
                          </Button>
                        </div>
                      ) : (
                        <div className="text-center">
                          <Upload className="h-8 w-8 text-orange-400 mx-auto mb-2" />
                          <div className="text-sm text-orange-600 mb-2">
                            Upload receipt of fund return from employee
                          </div>
                          <Input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleFileUpload(file, "retirement");
                            }}
                            className="text-sm"
                          />
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-orange-600">
                      Required: Upload a receipt showing employee has returned the unspent funds
                    </p>
                  </div>
                )}

                {/* Supporting Documents */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Additional Supporting Documents (Optional)
                  </Label>
                  <div className="border-2 border-dashed border-gray-200 rounded-lg p-4">
                    <div className="text-center mb-3">
                      <Upload className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                      <div className="text-sm text-gray-600 mb-2">
                        Upload bank statements, additional receipts, or other supporting documents
                      </div>
                      <Input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload(file, "supporting");
                        }}
                        className="text-sm"
                      />
                    </div>

                    {/* Display uploaded supporting documents */}
                    {supportingDocuments.length > 0 && (
                      <div className="space-y-2 mt-4">
                        {supportingDocuments.map((doc, index) => (
                          <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 border rounded">
                            <FileText className="h-4 w-4 text-gray-600" />
                            <div className="flex-1">
                              <div className="font-medium text-sm">{doc.name}</div>
                              <Input
                                placeholder="Document description (optional)"
                                value={documentDescriptions[index] || ""}
                                onChange={(e) => updateDocumentDescription(index, e.target.value)}
                                className="text-xs mt-1"
                              />
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeSupportingDocument(index)}
                              className="text-gray-600 hover:text-gray-800"
                            >
                              Remove
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Processing Notes */}
              <div>
                <Label htmlFor="processingNotes" className="text-sm font-medium">
                  Processing Notes
                </Label>
                <Textarea
                  id="processingNotes"
                  value={processingNotes}
                  onChange={(e) => setProcessingNotes(e.target.value)}
                  placeholder="Add notes about this reconciliation processing..."
                  rows={3}
                  className="mt-1"
                />
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsProcessingDialogOpen(false);
                setSelectedExpense(null);
                resetFormData();
              }}
            >
              Cancel
            </Button>

            {selectedExpense?.reconciliationType === "REIMBURSEMENT" && (
              <Button
                onClick={() => handleProcessReconciliation("request_reimbursement")}
                disabled={isProcessingReconciliation}
                className="bg-red-600 hover:bg-red-700"
              >
                <Banknote className="h-4 w-4 mr-1" />
                Process Reimbursement
              </Button>
            )}

            {selectedExpense?.reconciliationType === "RETIREMENT" && (
              <Button
                onClick={() => handleProcessReconciliation("request_retirement")}
                disabled={isProcessingReconciliation}
                className="bg-orange-600 hover:bg-orange-700"
              >
                <TrendingDown className="h-4 w-4 mr-1" />
                Request Fund Return
              </Button>
            )}

            <Button
              onClick={() => handleProcessReconciliation("approve")}
              disabled={isProcessingReconciliation}
              className="bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              Approve Reconciliation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TravelReconciliationWorkflow;