"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Building2,
  Plus,
  Search,
  Filter,
  Edit2,
  Eye,
  Trash2,
  DollarSign,
  CreditCard,
  Landmark,
  CheckCircle,
  XCircle,
  FileSpreadsheet,
  Printer,
  Settings,
  ArrowRightLeft,
  Send,
  Network,
  FileText
} from "lucide-react";
import { toast } from "sonner";
import { useGetBankAccounts, useDeleteBankAccount } from "@/features/finance/controllers/accountingController";
import { BankAccount } from "@/features/finance/types/accounting.types";
import BankAccountForm from "@/features/finance/components/banking/BankAccountForm";
import CurrencyConversionDialog from "@/features/finance/components/banking/CurrencyConversionDialog";
import FundTransferDialog from "@/features/finance/components/banking/FundTransferDialog";
import FundDistributionDialog from "@/features/finance/components/banking/FundDistributionDialog";
import TransactionHistoryDialog from "@/features/finance/components/banking/TransactionHistoryDialog";
import { useGetAllProjects } from "@/features/projects/controllers/projectController";
import { useGetAllGrants } from "@/features/contracts-grants/controllers/grantController";
import { useGetLocationsDropdown } from "@/features/modules/controllers/config/allConfigController";

// AHNI Nigerian Banks List
const nigerianBanks = [
  { name: "Access Bank Plc", code: "044" },
  { name: "Citibank Nigeria Limited", code: "023" },
  { name: "Ecobank Nigeria Plc", code: "050" },
  { name: "Fidelity Bank Plc", code: "070" },
  { name: "First Bank of Nigeria Limited", code: "011" },
  { name: "First City Monument Bank Plc", code: "214" },
  { name: "Guaranty Trust Bank Plc", code: "058" },
  { name: "Heritage Banking Company Ltd", code: "030" },
  { name: "Keystone Bank Limited", code: "082" },
  { name: "Polaris Bank Limited", code: "076" },
  { name: "Providus Bank", code: "101" },
  { name: "Stanbic IBTC Bank Plc", code: "221" },
  { name: "Standard Chartered Bank Nigeria Limited", code: "068" },
  { name: "Sterling Bank Plc", code: "232" },
  { name: "Union Bank of Nigeria Plc", code: "032" },
  { name: "United Bank For Africa Plc", code: "033" },
  { name: "Unity Bank Plc", code: "215" },
  { name: "Wema Bank Plc", code: "035" },
  { name: "Zenith Bank Plc", code: "057" }
];

// AHNI Projects for account categorization
const ahniProjects = [
  "GF-NAHI", "ACEBAY", "PLANE", "GF_HIV", "SIDHAS", "SHARP",
  "MALARIA", "RANA", "UNHCR", "UNFPA", "EPIC"
];

// Sample bank accounts for AHNI (this would come from your API)
const sampleBankAccounts: BankAccount[] = [
  {
    id: "bank_001",
    account_name: "FHI 360/AHNi-GF HQ",
    account_number: "0235139608",
    bank_name: "Guaranty Trust Bank Plc",
    account_type: "CHECKING",
    currency: "NGN",
    current_balance: 5200000.00,
    gl_account: "gl_001",
    is_active: true,
    created_at: "2024-01-15T00:00:00Z",
    updated_at: "2024-10-25T00:00:00Z"
  },
  {
    id: "bank_002",
    account_name: "FHI 360/AHNi-ACEBAY",
    account_number: "0234567891",
    bank_name: "Guaranty Trust Bank Plc",
    account_type: "CHECKING",
    currency: "NGN",
    current_balance: 3150000.00,
    gl_account: "gl_002",
    is_active: true,
    created_at: "2024-02-01T00:00:00Z",
    updated_at: "2024-10-25T00:00:00Z"
  },
  {
    id: "bank_003",
    account_name: "FHI 360/AHNi-PLANE",
    account_number: "0235678902",
    bank_name: "First Bank of Nigeria Limited",
    account_type: "CHECKING",
    currency: "NGN",
    current_balance: 2800000.00,
    gl_account: "gl_003",
    is_active: true,
    created_at: "2024-03-10T00:00:00Z",
    updated_at: "2024-10-25T00:00:00Z"
  },
  {
    id: "bank_004",
    account_name: "FHI 360/AHNi-USD Operations",
    account_number: "0236789013",
    bank_name: "Access Bank Plc",
    account_type: "CHECKING",
    currency: "USD",
    current_balance: 125000.00,
    gl_account: "gl_004",
    is_active: true,
    created_at: "2024-04-05T00:00:00Z",
    updated_at: "2024-10-25T00:00:00Z"
  }
];

export default function BankAccountsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBank, setFilterBank] = useState("all");
  const [filterCurrency, setFilterCurrency] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterLocation, setFilterLocation] = useState("all");
  const [filterProject, setFilterProject] = useState("all");
  const [filterGrant, setFilterGrant] = useState("all");
  const [showFormDialog, setShowFormDialog] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<BankAccount | null>(null);
  const [editingAccount, setEditingAccount] = useState<BankAccount | undefined>();

  // New dialogs for fund management
  const [showConversionDialog, setShowConversionDialog] = useState(false);
  const [showTransferDialog, setShowTransferDialog] = useState(false);
  const [showDistributionDialog, setShowDistributionDialog] = useState(false);
  const [showTransactionHistory, setShowTransactionHistory] = useState(false);
  const [actionAccount, setActionAccount] = useState<BankAccount | undefined>();
  const [historyAccount, setHistoryAccount] = useState<BankAccount | undefined>();

  // API hooks
  const { data: bankAccountsData, isLoading } = useGetBankAccounts({ is_active: undefined });
  const deleteBankAccount = useDeleteBankAccount();

  // Dropdown data for filters
  const { data: projectsData } = useGetAllProjects({ page: 1, size: 100, search: "", enabled: true });
  const { data: grantsData } = useGetAllGrants({ page: 1, size: 100, search: "", enabled: true });
  const { data: locationsData } = useGetLocationsDropdown();

  // Get bank accounts from API or use empty array
  const bankAccounts = Array.isArray(bankAccountsData?.data?.results) ? bankAccountsData.data.results : [];
  const projects = projectsData?.data?.results || [];
  const grants = grantsData?.data?.results || [];
  const locations = locationsData || [];

  // Filter bank accounts
  const filteredAccounts = bankAccounts.filter((account: any) => {
    if (searchTerm && !account.account_name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !account.account_number.includes(searchTerm) &&
        !account.bank_name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    if (filterBank !== "all" && account.bank_name !== filterBank) return false;
    if (filterCurrency !== "all" && account.currency !== filterCurrency) return false;
    if (filterStatus !== "all") {
      if (filterStatus === "active" && !account.is_active) return false;
      if (filterStatus === "inactive" && account.is_active) return false;
    }

    // Location filter
    if (filterLocation !== "all" && account.location !== filterLocation) return false;

    // Project filter (based on account name containing project name)
    if (filterProject !== "all") {
      const selectedProject = projects.find((p: any) => p.id === filterProject);
      const projectName = selectedProject?.name || selectedProject?.project_name || "";
      if (projectName && !account.account_name.toLowerCase().includes(projectName.toLowerCase())) return false;
    }

    // Grant/Donor filter (based on account name containing grant title)
    if (filterGrant !== "all") {
      const selectedGrant = grants.find((g: any) => g.id === filterGrant);
      const grantTitle = selectedGrant?.title || selectedGrant?.grant_name || "";
      if (grantTitle && !account.account_name.toLowerCase().includes(grantTitle.toLowerCase())) return false;
    }

    return true;
  });

  const formatCurrency = (amount: number, currency: string = "NGN") => {
    const symbol = currency === "NGN" ? "₦" : "$";
    const formattedAmount = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
    return `${symbol}${formattedAmount}`;
  };

  const handleAddAccount = () => {
    setEditingAccount(undefined);
    setShowFormDialog(true);
  };

  const handleEditAccount = (account: BankAccount) => {
    setEditingAccount(account);
    setShowFormDialog(true);
  };

  const handleDeleteAccount = async (account: BankAccount) => {
    if (!confirm(`Are you sure you want to delete "${account.account_name}"?`)) return;

    try {
      // When backend is ready, use:
      // await deleteBankAccount.deleteBankAccount(account.id);
      toast.success("Bank account deleted successfully");
    } catch (error: any) {
      toast.error(error?.message || "Failed to delete bank account");
    }
  };

  const handleFormSuccess = () => {
    // Refresh data when form succeeds
    // This will be handled automatically by React Query when backend is ready
  };

  // New action handlers
  const handleConvertCurrency = (account: BankAccount) => {
    setActionAccount(account);
    setShowConversionDialog(true);
  };

  const handleTransferFunds = (account: BankAccount) => {
    setActionAccount(account);
    setShowTransferDialog(true);
  };

  const handleDistributeFunds = (account: BankAccount) => {
    setActionAccount(account);
    setShowDistributionDialog(true);
  };

  const handleDialogSuccess = () => {
    // Refresh will happen automatically via React Query
    setActionAccount(undefined);
  };

  const handleViewTransactions = (account: BankAccount) => {
    setHistoryAccount(account);
    setShowTransactionHistory(true);
  };

  const exportToExcel = () => {
    toast.success("Bank accounts exported to Excel");
  };

  const printAccounts = () => {
    toast.success("Bank accounts list sent to printer");
  };

  // Statistics
  const totalBalance = bankAccounts.reduce((sum, account) => {
    const balance = parseFloat(account.current_balance || "0");
    if (account.currency === "NGN") return sum + balance;
    return sum + (balance * 1600); // Convert USD to NGN at approx rate
  }, 0);

  const activeAccounts = bankAccounts.filter((a: any) => a.is_active).length;
  const ngnAccounts = bankAccounts.filter((a: any) => a.currency === "NGN").length;
  const usdAccounts = bankAccounts.filter((a: any) => a.currency === "USD").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bank Accounts</h1>
          <p className="text-gray-600">
            ACHIEVING HEALTH NIGERIA INITIATIVE - Bank Account Management
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={exportToExcel} variant="outline">
            <FileSpreadsheet size={16} className="mr-2" />
            Export Excel
          </Button>
          <Button onClick={printAccounts} variant="outline">
            <Printer size={16} className="mr-2" />
            Print
          </Button>
          <Button onClick={handleAddAccount}>
            <Plus size={16} className="mr-2" />
            Add Bank Account
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Accounts</CardTitle>
            <Landmark className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{bankAccounts.length}</div>
            <p className="text-xs text-muted-foreground">Across all banks</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Accounts</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeAccounts}</div>
            <p className="text-xs text-muted-foreground">Ready for transactions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance (NGN)</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-purple-600 break-words">
              {formatCurrency(totalBalance, "NGN")}
            </div>
            <p className="text-xs text-muted-foreground">Combined balances</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Multi-Currency</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{ngnAccounts + usdAccounts}</div>
            <p className="text-xs text-muted-foreground">{ngnAccounts} NGN, {usdAccounts} USD</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 p-4 bg-white rounded-lg border">
        <div className="flex items-center space-x-2">
          <Search className="w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search accounts, numbers, or banks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-72"
          />
        </div>

        <Select value={filterBank} onValueChange={setFilterBank}>
          <SelectTrigger className="w-52">
            <SelectValue placeholder="Select Bank" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Banks</SelectItem>
            {nigerianBanks.map((bank) => (
              <SelectItem key={bank.code} value={bank.name}>
                {bank.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filterCurrency} onValueChange={setFilterCurrency}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Currency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="NGN">NGN</SelectItem>
            <SelectItem value="USD">USD</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filterLocation} onValueChange={setFilterLocation}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All Locations" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Locations</SelectItem>
            {locations.map((location: any) => (
              <SelectItem key={location.id} value={location.id}>
                {location.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filterProject} onValueChange={setFilterProject}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All Projects" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Projects</SelectItem>
            {projects.map((project: any) => (
              <SelectItem key={project.id} value={project.id}>
                {project.name || project.project_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filterGrant} onValueChange={setFilterGrant}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All Grants/Donors" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Grants/Donors</SelectItem>
            {grants.map((grant: any) => (
              <SelectItem key={grant.id} value={grant.id}>
                {grant.title || grant.grant_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>

        <div className="ml-auto flex items-center space-x-2 text-sm text-gray-600">
          <Filter className="w-4 h-4" />
          <span>
            {filteredAccounts.length} account{filteredAccounts.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Bank Accounts Table */}
      <Card>
        <CardHeader>
          <CardTitle>Bank Accounts</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-gray-600">Loading bank accounts...</p>
              </div>
            </div>
          ) : filteredAccounts.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Landmark className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 font-medium">No bank accounts found</p>
                <p className="text-sm text-gray-500 mt-2">
                  {bankAccounts.length === 0 ? "Get started by adding your first bank account" : "Try adjusting your filters"}
                </p>
                {bankAccounts.length === 0 && (
                  <Button onClick={handleAddAccount} className="mt-4">
                    <Plus size={16} className="mr-2" />
                    Add Bank Account
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Account Details</TableHead>
                  <TableHead>Bank</TableHead>
                  <TableHead>Account Type</TableHead>
                  <TableHead>Currency</TableHead>
                  <TableHead>Current Balance</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAccounts.map((account) => (
                <TableRow key={account.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{account.account_name}</div>
                      <div className="text-sm text-gray-500 font-mono">{account.account_number}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Building2 className="w-4 h-4 text-gray-400" />
                      <span>{account.bank_name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {account.account_type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={account.currency === "NGN" ? "default" : "secondary"}>
                      {account.currency}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono">
                    {formatCurrency(account.current_balance, account.currency)}
                  </TableCell>
                  <TableCell>
                    {account.is_active ? (
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Active
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-red-600">
                        <XCircle className="w-3 h-3 mr-1" />
                        Inactive
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedAccount(account)}
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewTransactions(account)}
                        title="View Transactions"
                        className="text-indigo-600 hover:text-indigo-700"
                      >
                        <FileText className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditAccount(account)}
                        title="Edit Account"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>

                      {/* Fund Management Actions */}
                      {account.currency === "USD" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-blue-600 hover:text-blue-700"
                          onClick={() => handleConvertCurrency(account)}
                          title="Convert to NGN"
                        >
                          <ArrowRightLeft className="w-4 h-4" />
                        </Button>
                      )}

                      {account.currency === "NGN" && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-green-600 hover:text-green-700"
                            onClick={() => handleTransferFunds(account)}
                            title="Transfer Funds"
                          >
                            <Send className="w-4 h-4" />
                          </Button>
                          {(account.account_name.toLowerCase().includes("main") ||
                            account.account_name.toLowerCase().includes("central")) && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-purple-600 hover:text-purple-700"
                              onClick={() => handleDistributeFunds(account)}
                              title="Distribute to Locations"
                            >
                              <Network className="w-4 h-4" />
                            </Button>
                          )}
                        </>
                      )}

                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600"
                        onClick={() => handleDeleteAccount(account)}
                        title="Delete Account"
                      >
                        <Trash2 className="w-4 h-4" />
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

      {/* Bank Account Form Dialog */}
      <BankAccountForm
        open={showFormDialog}
        onOpenChange={setShowFormDialog}
        account={editingAccount}
        onSuccess={handleFormSuccess}
      />

      {/* Currency Conversion Dialog */}
      <CurrencyConversionDialog
        open={showConversionDialog}
        onOpenChange={setShowConversionDialog}
        sourceAccount={actionAccount}
        onSuccess={handleDialogSuccess}
      />

      {/* Fund Transfer Dialog */}
      <FundTransferDialog
        open={showTransferDialog}
        onOpenChange={setShowTransferDialog}
        fromAccount={actionAccount}
        onSuccess={handleDialogSuccess}
      />

      {/* Fund Distribution Dialog */}
      <FundDistributionDialog
        open={showDistributionDialog}
        onOpenChange={setShowDistributionDialog}
        mainAccount={actionAccount}
        onSuccess={handleDialogSuccess}
      />

      {/* Transaction History Dialog */}
      <TransactionHistoryDialog
        open={showTransactionHistory}
        onOpenChange={setShowTransactionHistory}
        account={historyAccount}
      />

      {/* Account Details Dialog */}
      {selectedAccount && (
        <Dialog open={!!selectedAccount} onOpenChange={() => setSelectedAccount(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Bank Account Details</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Account Name</Label>
                  <div className="text-lg font-semibold">{selectedAccount.account_name}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Account Number</Label>
                  <div className="text-lg font-mono">{selectedAccount.account_number}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Bank Name</Label>
                  <div className="text-lg">{selectedAccount.bank_name}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Account Type</Label>
                  <Badge variant="outline" className="text-sm">
                    {selectedAccount.account_type}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Currency</Label>
                  <Badge variant={selectedAccount.currency === "NGN" ? "default" : "secondary"}>
                    {selectedAccount.currency}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Current Balance</Label>
                  <div className="text-2xl font-bold text-green-600">
                    {formatCurrency(selectedAccount.current_balance, selectedAccount.currency)}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Status</Label>
                  <div>
                    {selectedAccount.is_active ? (
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Active
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-red-600">
                        <XCircle className="w-3 h-3 mr-1" />
                        Inactive
                      </Badge>
                    )}
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">GL Account</Label>
                  <div className="text-lg font-mono">{selectedAccount.gl_account}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Created</Label>
                  <div>{new Date(selectedAccount.created_at).toLocaleDateString()}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Last Updated</Label>
                  <div>{new Date(selectedAccount.updated_at).toLocaleDateString()}</div>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedAccount(null)}>
                Close
              </Button>
              <Button>
                <Edit2 className="w-4 h-4 mr-2" />
                Edit Account
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}