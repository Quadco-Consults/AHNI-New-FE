"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Search,
  Filter,
  FileText,
  Calendar,
  DollarSign,
  CreditCard,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  AlertTriangle,
  Building,
  Download
} from "lucide-react";
import { toast } from "sonner";
import DataTable from "@/components/Table/DataTable";
import VendorBillForm from "@/features/finance/components/payables/VendorBillForm";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  useGetVendorBills,
  useGetVendorBillStats,
  useGetVendorPayments,
  useDeleteVendorBill,
} from "@/features/finance/controllers/vendorBillController";
import {
  VendorBill,
  VendorBillStatus,
  VendorBillFilters,
  VendorPayment,
  PaymentMethod,
} from "@/features/finance/types/accounts-payable.types";
import { format } from "date-fns";

// Empty - types now imported from accounts-payable.types.ts

export default function AccountsPayablePage() {
  const [activeTab, setActiveTab] = useState("bills");
  const [filters, setFilters] = useState<VendorBillFilters>({
    page: 1,
    page_size: 10,
  });

  // Form state
  const [formOpen, setFormOpen] = useState(false);
  const [editingBill, setEditingBill] = useState<VendorBill | undefined>();

  // Fetch data from backend
  const { data: billsData, isLoading: billsLoading } = useGetVendorBills(filters);
  const { data: statsData, isLoading: statsLoading } = useGetVendorBillStats();
  const { data: paymentsData, isLoading: paymentsLoading } = useGetVendorPayments({ page: 1, page_size: 20 });
  const deleteBillMutation = useDeleteVendorBill();

  const vendorBills = billsData?.data || [];
  const totalBills = billsData?.pagination?.total || 0;
  const vendorPayments = paymentsData?.data || [];
  const stats = statsData?.data;

  const handleSearch = (search: string) => {
    setFilters(prev => ({ ...prev, search, page: 1 }));
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const clearFilters = () => {
    setFilters({ page: 1, page_size: 10 });
  };

  const handleCreateBill = () => {
    setEditingBill(undefined);
    setFormOpen(true);
  };

  const handleEditBill = (bill: VendorBill) => {
    setEditingBill(bill);
    setFormOpen(true);
  };

  const handleFormSuccess = () => {
    // In a real app, you would refetch the data here
    // For now, just show a success message
    setFormOpen(false);
    setEditingBill(undefined);
  };

  const getStatusColor = (status: VendorBillStatus) => {
    switch (status) {
      case 'approved': return 'bg-blue-100 text-blue-700';
      case 'partially_paid': return 'bg-yellow-100 text-yellow-700';
      case 'paid': return 'bg-green-100 text-green-700';
      case 'overdue': return 'bg-red-100 text-red-700';
      case 'draft': return 'bg-gray-100 text-gray-500';
      case 'pending': return 'bg-yellow-100 text-yellow-600';
      case 'disputed': return 'bg-orange-100 text-orange-700';
      case 'cancelled': return 'bg-gray-100 text-gray-500';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getPaymentMethodLabel = (method: PaymentMethod) => {
    switch (method) {
      case 'bank_transfer': return 'Bank Transfer';
      case 'check': return 'Check';
      case 'cash': return 'Cash';
      case 'wire_transfer': return 'Wire Transfer';
      case 'electronic': return 'Electronic';
      case 'other': return 'Other';
      default: return method;
    }
  };

  const formatCurrency = (amount: string | number) => {
    const value = typeof amount === 'string' ? parseFloat(amount) : amount;
    return `₦${new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)}`;
  };

  // Delete bill handler
  const handleDeleteBill = async (id: string) => {
    if (confirm("Are you sure you want to delete this bill?")) {
      await deleteBillMutation.mutateAsync(id);
    }
  };

  // Bills columns
  const billsColumns = [
    {
      id: "bill_number",
      accessorKey: "bill_number",
      header: "Bill #",
      cell: ({ row }: any) => (
        <span className="font-mono text-sm font-medium">{row.getValue("bill_number")}</span>
      ),
    },
    {
      id: "vendor_name",
      accessorKey: "vendor_name",
      header: "Vendor",
      cell: ({ row }: any) => (
        <div className="font-medium">{row.getValue("vendor_name") || "-"}</div>
      ),
    },
    {
      id: "bill_date",
      accessorKey: "bill_date",
      header: "Bill Date",
      cell: ({ row }: any) => (
        <div className="text-sm">
          {format(new Date(row.getValue("bill_date")), "MMM dd, yyyy")}
        </div>
      ),
    },
    {
      id: "due_date",
      accessorKey: "due_date",
      header: "Due Date",
      cell: ({ row }: any) => {
        const dueDate = new Date(row.getValue("due_date"));
        const isOverdue = row.original.is_overdue;
        return (
          <div className={`text-sm ${isOverdue ? 'text-red-600 font-medium' : ''}`}>
            {format(dueDate, "MMM dd, yyyy")}
            {isOverdue && row.original.days_overdue && (
              <div className="text-xs text-red-500">
                {row.original.days_overdue} days overdue
              </div>
            )}
          </div>
        );
      },
    },
    {
      id: "total_amount",
      accessorKey: "total_amount",
      header: "Amount",
      cell: ({ row }: any) => (
        <div className="font-mono text-sm font-medium">
          {formatCurrency(row.getValue("total_amount"))}
        </div>
      ),
    },
    {
      id: "outstanding_amount",
      accessorKey: "outstanding_amount",
      header: "Balance Due",
      cell: ({ row }: any) => {
        const balance = parseFloat(row.getValue("outstanding_amount"));
        return (
          <div className={`font-mono text-sm font-medium ${balance > 0 ? 'text-red-600' : 'text-green-600'}`}>
            {formatCurrency(balance)}
          </div>
        );
      },
    },
    {
      id: "status",
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: any) => {
        const status = row.getValue("status") as VendorBillStatus;
        return (
          <Badge className={`${getStatusColor(status)} border-0 capitalize`}>
            {status.replace(/_/g, ' ')}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }: any) => {
        const bill = row.original;
        const outstandingAmount = parseFloat(bill.outstanding_amount);
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleEditBill(bill)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              {outstandingAmount > 0 && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Make Payment
                  </DropdownMenuItem>
                </>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleDeleteBill(bill.id)}
                className="text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  // Calculate display statistics
  const displayStats = {
    totalBills: stats?.total_bills || 0,
    totalAmount: stats?.total_amount || "0.00",
    totalDue: stats?.total_outstanding || "0.00",
    overdueBills: stats?.overdue_bills || 0,
    paidBills: stats?.bills_by_status?.paid || 0,
    totalPayments: vendorPayments.length,
    avgPaymentAmount: vendorPayments.length > 0
      ? vendorPayments.reduce((sum, p) => sum + parseFloat(p.amount), 0) / vendorPayments.length
      : 0,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Accounts Payable</h1>
          <p className="text-gray-600">
            Manage vendor bills, payments, and supplier relationships
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download size={20} className="mr-2" />
            Export Data
          </Button>
          <Button onClick={handleCreateBill}>
            <Plus size={20} className="mr-2" />
            Add Bill
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-blue-600">
            {statsLoading ? "..." : displayStats.totalBills}
          </div>
          <div className="text-sm text-gray-600">Total Bills</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-green-600">
            {statsLoading ? "..." : formatCurrency(displayStats.totalAmount)}
          </div>
          <div className="text-sm text-gray-600">Total Amount</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-red-600">
            {statsLoading ? "..." : formatCurrency(displayStats.totalDue)}
          </div>
          <div className="text-sm text-gray-600">Amount Due</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-orange-600">
            {statsLoading ? "..." : displayStats.overdueBills}
          </div>
          <div className="text-sm text-gray-600">Overdue</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-emerald-600">
            {statsLoading ? "..." : displayStats.paidBills}
          </div>
          <div className="text-sm text-gray-600">Paid</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-indigo-600">
            {paymentsLoading ? "..." : displayStats.totalPayments}
          </div>
          <div className="text-sm text-gray-600">Payments</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-cyan-600">
            {paymentsLoading ? "..." : formatCurrency(displayStats.avgPaymentAmount)}
          </div>
          <div className="text-sm text-gray-600">Avg Payment</div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="bills">Vendor Bills</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="vendors">Vendors</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="bills" className="space-y-6">
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-4 p-4 bg-white rounded-lg border">
            <div className="flex items-center space-x-2">
              <Search className="w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search bills..."
                value={filters.search || ""}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-64"
              />
            </div>

            <Select
              value={filters.status || "all"}
              onValueChange={(value) => handleFilterChange("status", value === "all" ? undefined : value)}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="partially_paid">Partial</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
                <SelectItem value="disputed">Disputed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            {(filters.search || filters.status) && (
              <Button variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
            )}

            <div className="ml-auto flex items-center space-x-2 text-sm text-gray-600">
              <Filter className="w-4 h-4" />
              <span>{totalBills} bill{totalBills !== 1 ? 's' : ''}</span>
            </div>
          </div>

          {/* Bills Table */}
          <Card className="p-6">
            {billsLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading bills...</p>
                </div>
              </div>
            ) : vendorBills.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-600 font-medium">No vendor bills found</p>
                <p className="text-sm text-gray-500 mt-2">
                  {filters.search || filters.status
                    ? "Try adjusting your filters"
                    : "Create your first vendor bill to get started"}
                </p>
              </div>
            ) : (
              <DataTable
                columns={billsColumns}
                data={vendorBills}
                pagination={{
                  total: totalBills,
                  pageSize: filters.page_size || 10,
                  onChange: (page) => {
                    setFilters(prev => ({ ...prev, page }));
                  }
                }}
              />
            )}
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Payments</h3>
            {paymentsLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading payments...</p>
                </div>
              </div>
            ) : vendorPayments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <CreditCard className="h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-600 font-medium">No payments found</p>
                <p className="text-sm text-gray-500 mt-2">
                  Payment records will appear here
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {vendorPayments.map((payment) => (
                  <div key={payment.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{payment.vendor_name || "Unknown Vendor"}</h4>
                        <p className="text-sm text-gray-600">
                          {getPaymentMethodLabel(payment.payment_method)}
                          {payment.reference_number && ` • ${payment.reference_number}`}
                        </p>
                        <p className="text-sm text-gray-600">
                          Paid on {format(new Date(payment.payment_date), "MMM dd, yyyy")}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="font-mono font-medium">{formatCurrency(payment.amount)}</div>
                        {payment.approved_datetime && (
                          <p className="text-xs text-green-600 mt-1">Approved</p>
                        )}
                      </div>
                    </div>
                    {payment.bill_number && (
                      <div className="mt-3 pt-3 border-t">
                        <p className="text-sm text-gray-600">
                          Bill: <span className="font-mono font-medium">{payment.bill_number}</span>
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="vendors" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Vendor Directory</h3>
            <p className="text-gray-600">Vendor management features will be implemented here.</p>
            <p className="text-sm text-gray-500 mt-2">
              This will include vendor profiles, contact information, and outstanding balances.
            </p>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Accounts Payable Reports</h3>
            <p className="text-gray-600">AP reporting features will be implemented here.</p>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Vendor Bill Form */}
      <VendorBillForm
        open={formOpen}
        onOpenChange={setFormOpen}
        bill={editingBill}
        onSuccess={handleFormSuccess}
      />
    </div>
  );
}