"use client";

import { useState } from "react";
import { Button } from "components/ui/button";
import { Input } from "components/ui/input";
import { Badge } from "components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "components/ui/dialog";
import { Label } from "components/ui/label";
import { Textarea } from "components/ui/textarea";
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
  Building2,
  Calculator,
  DollarSign,
  FileSpreadsheet,
  Printer
} from "lucide-react";
import { toast } from "sonner";
import { useGetUserProfile } from "features/auth/controllers/userController";

// AHNI Bank Reconciliation Data Structure
interface UnpresentedCheque {
  id: string;
  date: string;
  chequeNumber: string;
  payee: string;
  amount: number;
  description?: string;
}

interface BankCharge {
  id: string;
  date: string;
  description: string;
  amount: number;
}

interface UnbankedIncome {
  id: string;
  date: string;
  paidBy: string;
  description: string;
  amount: number;
}

interface BankReconciliation {
  id: string;
  reconciliationDate: string;
  period: string;
  state: string;
  currency: "NGN" | "USD";
  accountName: string;
  bankAccountNumber: string;
  bankStatementDate: string;
  balanceOnBankStatement: number;
  balanceOnBankBook: number;
  unpresentedCheques: UnpresentedCheque[];
  bankCharges: BankCharge[];
  unbankedIncome: UnbankedIncome[];
  adjustedBalance: number;
  difference: number;
  status: "draft" | "pending_review" | "pending_approval" | "approved";
  preparedBy: {
    name: string;
    designation: string;
    date: string;
  };
  reviewedBy?: {
    name: string;
    designation: string;
    date: string;
  };
  approvedBy?: {
    name: string;
    designation: string;
    date: string;
  };
  project: string;
}

// Sample AHNI Bank Reconciliation Data
const sampleReconciliations: BankReconciliation[] = [
  {
    id: "rec_001",
    reconciliationDate: "2024-09-30",
    period: "1-30/9/2024",
    state: "Abuja",
    currency: "NGN",
    accountName: "FHI 360/AHNi-GF HQ",
    bankAccountNumber: "0235139608",
    bankStatementDate: "1-30/9/2024",
    balanceOnBankStatement: 50000.00,
    balanceOnBankBook: 38200.00,
    unpresentedCheques: [
      {
        id: "chq_001",
        date: "01/01/2024",
        chequeNumber: "GFN2401162",
        payee: "GTBank Plc",
        amount: 1000.00,
        description: "Gombe State IRS: WHT Remittance for Dec'23"
      },
      {
        id: "chq_002",
        date: "09/29/2024",
        chequeNumber: "GFN2409266",
        payee: "GTBank Plc",
        amount: 4500.00,
        description: "Staff Retirement: Oluwapelumi Aliu"
      },
      {
        id: "chq_003",
        date: "09/29/2024",
        chequeNumber: "GFN2409307",
        payee: "GTBank Plc",
        amount: 3000.00,
        description: "Staff Retirement: Esther Edet"
      },
      {
        id: "chq_004",
        date: "09/29/2024",
        chequeNumber: "GFN2409279",
        payee: "GTBank Plc",
        amount: 3300.00,
        description: "Vendor Payment: Homtel Derivatives & Suites"
      }
    ],
    bankCharges: [],
    unbankedIncome: [],
    adjustedBalance: 38200.00,
    difference: 0.00,
    status: "approved",
    preparedBy: {
      name: "Daniel Otorkpa",
      designation: "Senior Accountant",
      date: "October 13, 2024"
    },
    reviewedBy: {
      name: "Elizabeth Ebeifenadi",
      designation: "Senior Finance Manager",
      date: "October 13, 2024"
    },
    approvedBy: {
      name: "Charles Ihaza",
      designation: "Director of Finance",
      date: "October 13, 2024"
    },
    project: "GF-NAHI"
  },
  {
    id: "rec_002",
    reconciliationDate: "2024-10-31",
    period: "1-31/10/2024",
    state: "Lagos",
    currency: "NGN",
    accountName: "FHI 360/AHNi-ACEBAY",
    bankAccountNumber: "0234567891",
    bankStatementDate: "1-31/10/2024",
    balanceOnBankStatement: 125000.00,
    balanceOnBankBook: 118500.00,
    unpresentedCheques: [
      {
        id: "chq_005",
        date: "10/28/2024",
        chequeNumber: "ACB2410123",
        payee: "Medical Supplies Ltd",
        amount: 6500.00,
        description: "Medical Equipment Purchase"
      }
    ],
    bankCharges: [],
    unbankedIncome: [],
    adjustedBalance: 118500.00,
    difference: 0.00,
    status: "pending_review",
    preparedBy: {
      name: "Sarah Johnson",
      designation: "Accountant",
      date: "November 05, 2024"
    },
    project: "ACEBAY"
  }
];

// AHNI Staff for Approval Workflow
const ahniStaff = {
  preparers: [
    { name: "Daniel Otorkpa", designation: "Senior Accountant", department: "Finance" },
    { name: "Sarah Johnson", designation: "Accountant", department: "Finance" },
    { name: "Michael Adebayo", designation: "Junior Accountant", department: "Finance" },
    { name: "Grace Adamu", designation: "Accounts Officer", department: "Finance" }
  ],
  reviewers: [
    { name: "Elizabeth Ebeifenadi", designation: "Senior Finance Manager", department: "Finance" },
    { name: "John Okwu", designation: "Finance Manager", department: "Finance" },
    { name: "Fatima Abubakar", designation: "Deputy Finance Manager", department: "Finance" }
  ],
  approvers: [
    { name: "Charles Ihaza", designation: "Director of Finance", department: "Finance" },
    { name: "Dr. Amina Hassan", designation: "Deputy Director", department: "Executive" },
    { name: "Prof. Adebayo Olusegun", designation: "Executive Director", department: "Executive" }
  ]
};

// AHNI Bank Accounts
const ahniAccounts = [
  {
    name: "FHI 360/AHNi-GF HQ",
    number: "0235139608",
    bank: "GTBank Plc",
    currency: "NGN",
    project: "GF-NAHI",
    state: "Abuja"
  },
  {
    name: "FHI 360/AHNi-ACEBAY",
    number: "0234567891",
    bank: "GTBank Plc",
    currency: "NGN",
    project: "ACEBAY",
    state: "Lagos"
  },
  {
    name: "FHI 360/AHNi-PLANE",
    number: "0235678902",
    bank: "First Bank Plc",
    currency: "NGN",
    project: "PLANE",
    state: "Kano"
  },
  {
    name: "FHI 360/AHNi-USD",
    number: "0236789013",
    bank: "Access Bank Plc",
    currency: "USD",
    project: "UNHCR",
    state: "Abuja"
  }
];

export default function BankReconciliationPage() {
  const [reconciliations, setReconciliations] = useState<BankReconciliation[]>(sampleReconciliations);
  const [selectedAccount, setSelectedAccount] = useState("all");
  const [selectedPeriod, setSelectedPeriod] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedReconciliation, setSelectedReconciliation] = useState<BankReconciliation | null>(null);

  // Get current user profile for auto-populating prepared by field
  const { data: userProfile, isLoading: userLoading } = useGetUserProfile();

  // Get current user info for prepared by field
  const getCurrentUserInfo = () => {
    if (!userProfile?.data) return null;
    const user = userProfile.data;
    return {
      name: user.full_name || `${user.first_name} ${user.last_name}`,
      designation: user.position || "Staff", // Use position as designation
      department: user.department || "Finance"
    };
  };

  // Filter reconciliations
  const filteredReconciliations = reconciliations.filter(rec => {
    if (selectedAccount && selectedAccount !== "all" && !rec.accountName.includes(selectedAccount)) return false;
    if (selectedStatus !== "all" && rec.status !== selectedStatus) return false;
    if (selectedPeriod && selectedPeriod !== "all") {
      // Convert "2024-09" to "9/2024" for matching "1-30/9/2024"
      const [year, month] = selectedPeriod.split("-");
      const monthNum = parseInt(month);
      const periodPattern = `${monthNum}/${year}`;
      if (!rec.period.includes(periodPattern)) return false;
    }
    return true;
  });

  const formatCurrency = (amount: number, currency: "NGN" | "USD" = "NGN") => {
    const symbol = currency === "NGN" ? "₦" : "$";
    return `${symbol}${amount.toLocaleString()}`;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "draft":
        return <Edit2 className="w-4 h-4 text-gray-500" />;
      case "pending_review":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "pending_approval":
        return <AlertCircle className="w-4 h-4 text-orange-500" />;
      case "approved":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return <Edit2 className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      draft: "outline",
      pending_review: "secondary",
      pending_approval: "default",
      approved: "default"
    };

    const colors: Record<string, string> = {
      draft: "text-gray-600",
      pending_review: "text-yellow-600",
      pending_approval: "text-orange-600",
      approved: "text-green-600"
    };

    return (
      <Badge variant={variants[status]} className={colors[status]}>
        {status.replace("_", " ").toUpperCase()}
      </Badge>
    );
  };

  const calculateTotalUnpresentedCheques = (cheques: UnpresentedCheque[]) => {
    return cheques.reduce((total, cheque) => total + cheque.amount, 0);
  };

  const calculateAdjustedBalance = (reconciliation: BankReconciliation) => {
    const totalUnpresented = calculateTotalUnpresentedCheques(reconciliation.unpresentedCheques);
    const totalCharges = reconciliation.bankCharges.reduce((total, charge) => total + charge.amount, 0);
    const totalUnbanked = reconciliation.unbankedIncome.reduce((total, income) => total + income.amount, 0);

    return reconciliation.balanceOnBankStatement - totalUnpresented + totalCharges + totalUnbanked;
  };

  const exportToExcel = () => {
    toast.success("Bank reconciliation exported to Excel");
  };

  const printReconciliation = () => {
    toast.success("Bank reconciliation sent to printer");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bank Reconciliation</h1>
          <p className="text-gray-600">
            ACHIEVING HEALTH NIGERIA INITIATIVE - Bank Reconciliation Management
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={exportToExcel} variant="outline">
            <FileSpreadsheet size={16} className="mr-2" />
            Export Excel
          </Button>
          <Button onClick={printReconciliation} variant="outline">
            <Printer size={16} className="mr-2" />
            Print
          </Button>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus size={16} className="mr-2" />
            New Reconciliation
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reconciliations</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{reconciliations.length}</div>
            <p className="text-xs text-muted-foreground">Across all bank accounts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved This Month</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {reconciliations.filter(r => r.status === "approved").length}
            </div>
            <p className="text-xs text-muted-foreground">Ready for audit</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {reconciliations.filter(r => r.status === "pending_review").length}
            </div>
            <p className="text-xs text-muted-foreground">Awaiting finance manager</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bank Accounts</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{ahniAccounts.length}</div>
            <p className="text-xs text-muted-foreground">Active accounts</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 p-4 bg-white rounded-lg border">
        <div className="flex items-center space-x-2">
          <Building2 className="w-4 h-4 text-gray-400" />
          <Select value={selectedAccount} onValueChange={setSelectedAccount}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Select Bank Account" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Accounts</SelectItem>
              {ahniAccounts.map((account) => (
                <SelectItem key={account.number} value={account.name}>
                  {account.name} ({account.project})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Periods</SelectItem>
              <SelectItem value="2024-10">Oct 2024</SelectItem>
              <SelectItem value="2024-09">Sep 2024</SelectItem>
              <SelectItem value="2024-08">Aug 2024</SelectItem>
              <SelectItem value="2024-07">Jul 2024</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="pending_review">Pending Review</SelectItem>
            <SelectItem value="pending_approval">Pending Approval</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
          </SelectContent>
        </Select>

        <div className="ml-auto flex items-center space-x-2 text-sm text-gray-600">
          <Calculator className="w-4 h-4" />
          <span>
            {filteredReconciliations.length} reconciliation{filteredReconciliations.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Bank Reconciliation List */}
      <Card>
        <CardHeader>
          <CardTitle>Bank Reconciliations</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Account</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Bank Balance</TableHead>
                <TableHead>Book Balance</TableHead>
                <TableHead>Difference</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReconciliations.map((reconciliation) => (
                <TableRow key={reconciliation.id}>
                  <TableCell>{reconciliation.reconciliationDate}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{reconciliation.accountName}</div>
                      <div className="text-sm text-gray-500">{reconciliation.bankAccountNumber}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{reconciliation.project}</Badge>
                  </TableCell>
                  <TableCell>{reconciliation.period}</TableCell>
                  <TableCell className="font-mono">
                    {formatCurrency(reconciliation.balanceOnBankStatement, reconciliation.currency)}
                  </TableCell>
                  <TableCell className="font-mono">
                    {formatCurrency(reconciliation.balanceOnBankBook, reconciliation.currency)}
                  </TableCell>
                  <TableCell className={`font-mono ${reconciliation.difference === 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(reconciliation.difference, reconciliation.currency)}
                  </TableCell>
                  <TableCell>{getStatusBadge(reconciliation.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedReconciliation(reconciliation)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Detailed Reconciliation View Dialog */}
      {selectedReconciliation && (
        <Dialog open={!!selectedReconciliation} onOpenChange={() => setSelectedReconciliation(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-center text-lg font-bold">
                ACHIEVING HEALTH NIGERIA INITIATIVE<br />
                GT Bank - Cash Book ({selectedReconciliation.state})<br />
                Bank Reconciliation Statement as at {selectedReconciliation.reconciliationDate}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              {/* Header Information */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div><strong>State:</strong> {selectedReconciliation.state}</div>
                  <div><strong>Account Name:</strong> {selectedReconciliation.accountName}</div>
                  <div><strong>Bank Statement Date:</strong> {selectedReconciliation.bankStatementDate}</div>
                </div>
                <div>
                  <div><strong>Currency:</strong> {selectedReconciliation.currency}</div>
                  <div><strong>Period:</strong> {selectedReconciliation.period}</div>
                  <div><strong>Bank Account No.:</strong> {selectedReconciliation.bankAccountNumber}</div>
                </div>
              </div>

              {/* Reconciliation Details */}
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex justify-between">
                    <span><strong>Balance on bank statement:</strong></span>
                    <span className="font-mono">{formatCurrency(selectedReconciliation.balanceOnBankStatement, selectedReconciliation.currency)}</span>
                  </div>
                </div>

                {/* Unpresented Cheques */}
                {selectedReconciliation.unpresentedCheques.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Less payments in accounts, not on statement (e.g. unpresented cheques, returned cheques)</h4>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Chq #</TableHead>
                          <TableHead>Payee</TableHead>
                          <TableHead>Amount</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedReconciliation.unpresentedCheques.map((cheque) => (
                          <TableRow key={cheque.id}>
                            <TableCell>{cheque.date}</TableCell>
                            <TableCell>{cheque.chequeNumber}</TableCell>
                            <TableCell>
                              <div>
                                <div>{cheque.payee}</div>
                                <div className="text-sm text-gray-500">{cheque.description}</div>
                              </div>
                            </TableCell>
                            <TableCell className="font-mono text-right">
                              {formatCurrency(cheque.amount, selectedReconciliation.currency)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    <div className="flex justify-end mt-2 bg-red-50 p-2 rounded">
                      <span><strong>Total Deduction: {formatCurrency(calculateTotalUnpresentedCheques(selectedReconciliation.unpresentedCheques), selectedReconciliation.currency)}</strong></span>
                    </div>
                  </div>
                )}

                {/* Bank Charges */}
                <div>
                  <h4 className="font-semibold mb-2">Plus payments on statements not in accounts (e.g. bank charges)</h4>
                  {selectedReconciliation.bankCharges.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Amount</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedReconciliation.bankCharges.map((charge) => (
                          <TableRow key={charge.id}>
                            <TableCell>{charge.date}</TableCell>
                            <TableCell>{charge.description}</TableCell>
                            <TableCell className="font-mono text-right">
                              {formatCurrency(charge.amount, selectedReconciliation.currency)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-4 text-gray-500">No bank charges</div>
                  )}
                  <div className="flex justify-end mt-2 bg-green-50 p-2 rounded">
                    <span><strong>Total Addition: {formatCurrency(selectedReconciliation.bankCharges.reduce((total, charge) => total + charge.amount, 0), selectedReconciliation.currency)}</strong></span>
                  </div>
                </div>

                {/* Adjusted Balance */}
                <div className="bg-blue-100 p-4 rounded-lg">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Adjusted balance on the bank statement:</span>
                    <span className="font-mono">{formatCurrency(selectedReconciliation.adjustedBalance, selectedReconciliation.currency)}</span>
                  </div>
                </div>

                {/* Final Balances */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span><strong>Balance on bankbook:</strong> (enter this manually from Cash Book report)</span>
                    <span className="font-mono">{formatCurrency(selectedReconciliation.balanceOnBankBook, selectedReconciliation.currency)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span><strong>Difference</strong> (+ More in Bank A/C than Cash Book / - Cash Book higher than Bank A/C)</span>
                    <span className={`font-mono ${selectedReconciliation.difference === 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(selectedReconciliation.difference, selectedReconciliation.currency)}
                    </span>
                  </div>
                </div>

                {/* Approval Section */}
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-4">Approval Trail</h4>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="space-y-2">
                      <div><strong>Prepared by</strong></div>
                      <div>{selectedReconciliation.preparedBy.name}</div>
                      <div className="text-gray-600">{selectedReconciliation.preparedBy.designation}</div>
                      <div className="text-gray-600">{selectedReconciliation.preparedBy.date}</div>
                    </div>

                    <div className="space-y-2">
                      <div><strong>Reviewed by</strong></div>
                      {selectedReconciliation.reviewedBy ? (
                        <>
                          <div>{selectedReconciliation.reviewedBy.name}</div>
                          <div className="text-gray-600">{selectedReconciliation.reviewedBy.designation}</div>
                          <div className="text-gray-600">{selectedReconciliation.reviewedBy.date}</div>
                        </>
                      ) : (
                        <div className="text-yellow-600">Pending Review</div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div><strong>Approved by</strong></div>
                      {selectedReconciliation.approvedBy ? (
                        <>
                          <div>{selectedReconciliation.approvedBy.name}</div>
                          <div className="text-gray-600">{selectedReconciliation.approvedBy.designation}</div>
                          <div className="text-gray-600">{selectedReconciliation.approvedBy.date}</div>
                        </>
                      ) : (
                        <div className="text-orange-600">Pending Approval</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter className="flex justify-between">
              <div className="flex space-x-2">
                <Button variant="outline" onClick={printReconciliation}>
                  <Printer className="w-4 h-4 mr-2" />
                  Print
                </Button>
                <Button variant="outline" onClick={exportToExcel}>
                  <FileSpreadsheet className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
              <Button onClick={() => setSelectedReconciliation(null)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Create New Reconciliation Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Bank Reconciliation</DialogTitle>
            <DialogDescription>
              Create a new bank reconciliation statement for AHNI accounts
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="account">Bank Account</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select account" />
                  </SelectTrigger>
                  <SelectContent>
                    {ahniAccounts.map((account) => (
                      <SelectItem key={account.number} value={account.number}>
                        {account.name} ({account.project})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="period">Reconciliation Period</Label>
                <Input type="month" defaultValue="2024-10" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="bankBalance">Balance on Bank Statement</Label>
                <Input type="number" step="0.01" placeholder="0.00" />
              </div>
              <div>
                <Label htmlFor="bookBalance">Balance on Bank Book</Label>
                <Input type="number" step="0.01" placeholder="0.00" />
              </div>
            </div>

            <div>
              <Label htmlFor="state">State</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Abuja">Abuja</SelectItem>
                  <SelectItem value="Lagos">Lagos</SelectItem>
                  <SelectItem value="Kano">Kano</SelectItem>
                  <SelectItem value="Gombe">Gombe</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Approval Workflow Section */}
            <div className="space-y-4 border-t pt-4">
              <h3 className="text-lg font-semibold text-gray-700">Approval Workflow</h3>
              <p className="text-sm text-gray-600">Select the approval chain for this bank reconciliation</p>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="preparer">Prepared By *</Label>
                  {getCurrentUserInfo() ? (
                    <div className="flex items-center space-x-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
                      <div className="flex-1">
                        <div className="font-medium text-blue-900">
                          {getCurrentUserInfo()?.name}
                        </div>
                        <div className="text-sm text-blue-700">
                          {getCurrentUserInfo()?.designation} - {getCurrentUserInfo()?.department}
                        </div>
                      </div>
                      <div className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
                        Current User
                      </div>
                    </div>
                  ) : userLoading ? (
                    <div className="p-3 bg-gray-50 border border-gray-200 rounded-md">
                      <div className="text-sm text-gray-500">Loading user information...</div>
                    </div>
                  ) : (
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select preparer" />
                      </SelectTrigger>
                      <SelectContent>
                        {ahniStaff.preparers.map((staff, index) => (
                          <SelectItem key={index} value={staff.name}>
                            {staff.name} - {staff.designation}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>

                <div>
                  <Label htmlFor="reviewer">Reviewed By *</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select reviewer" />
                    </SelectTrigger>
                    <SelectContent>
                      {ahniStaff.reviewers.map((staff, index) => (
                        <SelectItem key={index} value={staff.name}>
                          {staff.name} - {staff.designation}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="approver">Approved By *</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select approver" />
                    </SelectTrigger>
                    <SelectContent>
                      {ahniStaff.approvers.map((staff, index) => (
                        <SelectItem key={index} value={staff.name}>
                          {staff.name} - {staff.designation}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Additional Options */}
            <div className="space-y-4 border-t pt-4">
              <h3 className="text-lg font-semibold text-gray-700">Additional Options</h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="priority">Priority Level</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input type="date" />
                </div>
              </div>

              <div>
                <Label htmlFor="notes">Notes/Comments</Label>
                <Textarea
                  placeholder="Add any notes or special instructions for this reconciliation..."
                  rows={3}
                />
              </div>
            </div>
          </div>

          <DialogFooter className="flex justify-between">
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
              <Button variant="secondary" onClick={() => {
                toast.success("Bank reconciliation saved as draft");
              }}>
                Save as Draft
              </Button>
            </div>
            <Button onClick={() => {
              setShowCreateDialog(false);
              toast.success("Bank reconciliation created and sent for approval");
            }}>
              Create & Submit for Approval
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}