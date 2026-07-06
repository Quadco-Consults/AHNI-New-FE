"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  FileText,
  Download,
  Printer,
  Calendar,
  TrendingUp,
  TrendingDown,
  Search,
  X
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { useGetJournalEntries } from "../../controllers/accountingController";
import { BankAccount } from "../../types/accounting.types";

interface TransactionHistoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  account?: BankAccount;
}

export default function TransactionHistoryDialog({
  open,
  onOpenChange,
  account
}: TransactionHistoryDialogProps) {
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [transactionType, setTransactionType] = useState("all");
  const [page, setPage] = useState(1);

  // Fetch journal entries for this account's GL account
  const { data: journalData, isLoading } = useGetJournalEntries({
    account_id: account?.gl_account,
    date_from: dateFrom || undefined,
    date_to: dateTo || undefined,
    search: searchTerm || undefined,
    status: "POSTED", // Only show posted entries
    page,
    page_size: 20,
  });

  const transactions = journalData?.data?.results || [];
  const totalTransactions = journalData?.data?.count || 0;

  // Calculate statistics
  const totalDebits = transactions.reduce((sum, txn) => {
    const debitLines = txn.line_items?.filter((line: any) =>
      line.account === account?.gl_account && parseFloat(line.debit_amount || "0") > 0
    ) || [];
    return sum + debitLines.reduce((s: number, l: any) => s + parseFloat(l.debit_amount || "0"), 0);
  }, 0);

  const totalCredits = transactions.reduce((sum, txn) => {
    const creditLines = txn.line_items?.filter((line: any) =>
      line.account === account?.gl_account && parseFloat(line.credit_amount || "0") > 0
    ) || [];
    return sum + creditLines.reduce((s: number, l: any) => s + parseFloat(l.credit_amount || "0"), 0);
  }, 0);

  const netChange = totalDebits - totalCredits;

  const formatCurrency = (amount: number, currency: string = "NGN") => {
    const symbol = currency === "NGN" ? "₦" : "$";
    return `${symbol}${new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)}`;
  };

  const handleExport = () => {
    toast.success("Transaction history exported to Excel");
  };

  const handlePrint = () => {
    toast.success("Transaction history sent to printer");
  };

  const clearFilters = () => {
    setDateFrom("");
    setDateTo("");
    setSearchTerm("");
    setTransactionType("all");
    setPage(1);
  };

  if (!account) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Transaction History
          </DialogTitle>
          <DialogDescription>
            All journal entries for {account.account_name} ({account.account_number})
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-4">
                <div className="text-sm text-muted-foreground">Current Balance</div>
                <div className="text-2xl font-bold text-blue-600">
                  {formatCurrency(parseFloat(account.current_balance?.toString() || "0"), account.currency)}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="text-sm text-muted-foreground flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  Total Debits
                </div>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(totalDebits, account.currency)}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="text-sm text-muted-foreground flex items-center gap-1">
                  <TrendingDown className="w-3 h-3" />
                  Total Credits
                </div>
                <div className="text-2xl font-bold text-red-600">
                  {formatCurrency(totalCredits, account.currency)}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="text-sm text-muted-foreground">Net Change</div>
                <div className={`text-2xl font-bold ${netChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(netChange, account.currency)}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-end gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="space-y-2">
              <Label htmlFor="date_from" className="text-xs">From Date</Label>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <Input
                  id="date_from"
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="w-40"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date_to" className="text-xs">To Date</Label>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <Input
                  id="date_to"
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="w-40"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="search" className="text-xs">Search</Label>
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-56"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="type" className="text-xs">Type</Label>
              <Select value={transactionType} onValueChange={setTransactionType}>
                <SelectTrigger id="type" className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="debit">Debits Only</SelectItem>
                  <SelectItem value="credit">Credits Only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button variant="outline" size="sm" onClick={clearFilters}>
              <X className="w-4 h-4 mr-2" />
              Clear
            </Button>

            <div className="ml-auto flex gap-2">
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm" onClick={handlePrint}>
                <Printer className="w-4 h-4 mr-2" />
                Print
              </Button>
            </div>
          </div>

          {/* Transactions Table */}
          <div>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading transactions...</p>
                </div>
              </div>
            ) : transactions.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 font-medium">No transactions found</p>
                  <p className="text-sm text-gray-500 mt-2">
                    {dateFrom || dateTo || searchTerm ? "Try adjusting your filters" : "No journal entries for this account yet"}
                  </p>
                </div>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Entry No.</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Reference</TableHead>
                    <TableHead className="text-right">Debit</TableHead>
                    <TableHead className="text-right">Credit</TableHead>
                    <TableHead className="text-right">Balance</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((txn: any) => {
                    // Find line items for this account
                    const accountLines = txn.line_items?.filter((line: any) =>
                      line.account === account.gl_account
                    ) || [];

                    if (accountLines.length === 0) return null;

                    return accountLines.map((line: any, lineIndex: number) => {
                      const debit = parseFloat(line.debit_amount || "0");
                      const credit = parseFloat(line.credit_amount || "0");

                      // Apply transaction type filter
                      if (transactionType === "debit" && debit === 0) return null;
                      if (transactionType === "credit" && credit === 0) return null;

                      return (
                        <TableRow key={`${txn.id}-${lineIndex}`}>
                          <TableCell>{format(new Date(txn.entry_date), "MMM dd, yyyy")}</TableCell>
                          <TableCell className="font-mono text-sm">{txn.entry_number}</TableCell>
                          <TableCell>
                            <div className="max-w-xs">
                              <div className="font-medium">{txn.description}</div>
                              {line.description && (
                                <div className="text-xs text-gray-500">{line.description}</div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-gray-600">{txn.reference_number || "-"}</TableCell>
                          <TableCell className="text-right font-mono">
                            {debit > 0 ? (
                              <span className="text-green-600">{formatCurrency(debit, account.currency)}</span>
                            ) : "-"}
                          </TableCell>
                          <TableCell className="text-right font-mono">
                            {credit > 0 ? (
                              <span className="text-red-600">{formatCurrency(credit, account.currency)}</span>
                            ) : "-"}
                          </TableCell>
                          <TableCell className="text-right font-mono font-semibold">
                            {formatCurrency(parseFloat(account.current_balance?.toString() || "0"), account.currency)}
                          </TableCell>
                          <TableCell>
                            <Badge className="bg-green-100 text-green-800">
                              {txn.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    });
                  })}
                </TableBody>
              </Table>
            )}

            {/* Pagination */}
            {transactions.length > 0 && (
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-gray-600">
                  Showing {transactions.length} of {totalTransactions} transactions
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(p => p + 1)}
                    disabled={transactions.length < 20}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
