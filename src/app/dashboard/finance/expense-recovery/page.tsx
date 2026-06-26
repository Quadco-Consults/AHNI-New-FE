"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Plus,
  RefreshCw,
  FileText,
  Building2,
  DollarSign,
  Calendar,
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useGetVendorBills, useGetExpenseRecoveryStats } from "@/features/finance/controllers/expenseRecoveryController";

export default function ExpenseRecoveryPage() {
  const router = useRouter();

  // Fetch vendor bills
  const { data: billsData, isLoading, refetch } = useGetVendorBills();
  const vendorBills = billsData?.data || [];

  // Fetch statistics
  const { data: statsData } = useGetExpenseRecoveryStats();
  const stats = statsData?.data;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Expense Recovery</h1>
          <p className="text-muted-foreground">
            Create recovery invoices for shared facility expenses
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bills</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.total_bills || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Vendor bills tracked
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Recovery</CardTitle>
            <XCircle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.pending_recovery || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Bills awaiting recovery
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recovered</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.recovered || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Recovery invoices created
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Vendor Bills Table */}
      <Card>
        <CardHeader>
          <CardTitle>Vendor Bills - Shared Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bill Number</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Service Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Bill Date</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Loading vendor bills...
                    </p>
                  </TableCell>
                </TableRow>
              ) : vendorBills.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <FileText className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      No vendor bills found
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                vendorBills.map((bill) => (
                <TableRow key={bill.id}>
                  <TableCell className="font-mono font-medium">
                    {bill.bill_number}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      {bill.vendor}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{bill.service_type}</Badge>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {bill.description}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      {formatDate(bill.bill_date)}
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    {formatCurrency(bill.total_amount)}
                  </TableCell>
                  <TableCell>
                    {bill.has_recovery_invoice ? (
                      <Badge variant="default" className="bg-green-600">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Recovered
                      </Badge>
                    ) : (
                      <Badge variant="secondary">
                        <XCircle className="h-3 w-3 mr-1" />
                        Pending
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {bill.has_recovery_invoice ? (
                      <Link
                        href={`/dashboard/finance/invoices?invoice=${bill.recovery_invoice_number}`}
                      >
                        <Button variant="outline" size="sm">
                          View Invoice
                        </Button>
                      </Link>
                    ) : (
                      <Link href={`/dashboard/finance/expense-recovery/create?bill=${bill.id}`}>
                        <Button size="sm">
                          <Plus className="h-4 w-4 mr-1" />
                          Create Recovery
                        </Button>
                      </Link>
                    )}
                  </TableCell>
                </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
