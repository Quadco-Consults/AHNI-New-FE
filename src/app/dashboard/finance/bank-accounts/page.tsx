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
  Settings
} from "lucide-react";
import { toast } from "sonner";
import { useGetBankAccounts, useDeleteBankAccount } from "@/features/finance/controllers/accountingController";
import { BankAccount } from "@/features/finance/types/accounting.types";
import BankAccountForm from "@/features/finance/components/banking/BankAccountForm";

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
  const [bankAccounts] = useState<BankAccount[]>(sampleBankAccounts);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBank, setFilterBank] = useState("all");
  const [filterCurrency, setFilterCurrency] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showFormDialog, setShowFormDialog] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<BankAccount | null>(null);
  const [editingAccount, setEditingAccount] = useState<BankAccount | undefined>();

  // API hooks (uncomment when backend is ready)
  // const { data: bankAccountsData, isLoading } = useGetBankAccounts();
  const deleteBankAccount = useDeleteBankAccount();

  // Filter bank accounts
  const filteredAccounts = bankAccounts.filter(account => {
    if (searchTerm && !account.account_name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !account.account_number.includes(searchTerm) &&
        !account.bank_name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    if (filterBank !== "all" && account.bank_name !== filterBank) return false;
    if (filterCurrency !== "all" && account.currency !== filterCurrency) return false;
    if (filterStatus !== "all") {
      if (filterStatus === "active" && !account.is_active) return false;
      if (filterStatus === "inactive" && account.is_active) return false;
    }
    return true;
  });

  const formatCurrency = (amount: number, currency: string = "NGN") => {
    const symbol = currency === "NGN" ? "₦" : "$";
    return `${symbol}${amount.toLocaleString()}`;
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

  const exportToExcel = () => {
    toast.success("Bank accounts exported to Excel");
  };

  const printAccounts = () => {
    toast.success("Bank accounts list sent to printer");
  };

  // Statistics
  const totalBalance = bankAccounts.reduce((sum, account) => {
    if (account.currency === "NGN") return sum + account.current_balance;
    return sum + (account.current_balance * 1600); // Convert USD to NGN at approx rate
  }, 0);

  const activeAccounts = bankAccounts.filter(a => a.is_active).length;
  const ngnAccounts = bankAccounts.filter(a => a.currency === "NGN").length;
  const usdAccounts = bankAccounts.filter(a => a.currency === "USD").length;

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
            <div className="text-2xl font-bold text-purple-600">
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
          <SelectTrigger className="w-64">
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
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditAccount(account)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600"
                        onClick={() => handleDeleteAccount(account)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Bank Account Form Dialog */}
      <BankAccountForm
        open={showFormDialog}
        onOpenChange={setShowFormDialog}
        account={editingAccount}
        onSuccess={handleFormSuccess}
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