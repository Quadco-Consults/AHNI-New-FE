"use client";

import { useState } from "react";
import { Button } from "components/ui/button";
import { Input } from "components/ui/input";
import { Badge } from "components/ui/badge";
import { Card } from "components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "components/ui/select";
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
import DataTable from "components/Table/DataTable";
import VendorBillForm from "features/finance/components/payables/VendorBillForm";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "components/ui/dropdown-menu";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "components/ui/tabs";

// Types for Accounts Payable
interface VendorBill {
  id: string;
  bill_number: string;
  vendor_id: string;
  vendor_name: string;
  bill_date: string;
  due_date: string;
  status: BillStatus;
  total_amount: number;
  amount_paid: number;
  balance_due: number;
  description?: string;
  reference_number?: string;
  created_at: string;
  updated_at: string;
}

interface VendorPayment {
  id: string;
  vendor_id: string;
  vendor_name: string;
  payment_date: string;
  payment_method: PaymentMethod;
  amount: number;
  reference_number?: string;
  check_number?: string;
  status: PaymentStatus;
  bills_paid: BillPayment[];
  created_at: string;
}

interface BillPayment {
  bill_id: string;
  bill_number: string;
  amount_paid: number;
  remaining_balance: number;
}

interface Vendor {
  id: string;
  vendor_number: string;
  name: string;
  contact_person?: string;
  email?: string;
  phone?: string;
  address: Address;
  total_owed: number;
  payment_terms?: string;
  status: 'ACTIVE' | 'INACTIVE';
  created_at: string;
}

interface Address {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

type BillStatus =
  | 'OPEN'
  | 'PARTIAL'
  | 'PAID'
  | 'OVERDUE'
  | 'VOID'
  | 'CANCELLED';

type PaymentMethod =
  | 'CHECK'
  | 'ACH'
  | 'WIRE_TRANSFER'
  | 'CREDIT_CARD'
  | 'CASH'
  | 'OTHER';

type PaymentStatus =
  | 'PENDING'
  | 'PROCESSED'
  | 'CLEARED'
  | 'FAILED'
  | 'CANCELLED';

// Mock data
const mockVendorBills: VendorBill[] = [
  {
    id: "1",
    bill_number: "BILL-001",
    vendor_id: "vendor-1",
    vendor_name: "Office Supplies Co.",
    bill_date: "2024-10-15",
    due_date: "2024-11-15",
    status: "OPEN",
    total_amount: 2500.00,
    amount_paid: 0,
    balance_due: 2500.00,
    description: "Office supplies and equipment",
    reference_number: "PO-001",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    bill_number: "BILL-002",
    vendor_id: "vendor-2",
    vendor_name: "Tech Services Inc.",
    bill_date: "2024-10-10",
    due_date: "2024-10-25",
    status: "OVERDUE",
    total_amount: 5000.00,
    amount_paid: 2000.00,
    balance_due: 3000.00,
    description: "IT consulting services",
    reference_number: "INV-2024-456",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "3",
    bill_number: "BILL-003",
    vendor_id: "vendor-3",
    vendor_name: "Utilities Company",
    bill_date: "2024-10-20",
    due_date: "2024-11-05",
    status: "PAID",
    total_amount: 1200.00,
    amount_paid: 1200.00,
    balance_due: 0,
    description: "Monthly utility bills",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
];

const mockVendorPayments: VendorPayment[] = [
  {
    id: "1",
    vendor_id: "vendor-3",
    vendor_name: "Utilities Company",
    payment_date: "2024-10-22",
    payment_method: "ACH",
    amount: 1200.00,
    reference_number: "PAY-001",
    status: "PROCESSED",
    bills_paid: [
      {
        bill_id: "3",
        bill_number: "BILL-003",
        amount_paid: 1200.00,
        remaining_balance: 0
      }
    ],
    created_at: new Date().toISOString(),
  }
];

const mockVendors: Vendor[] = [
  {
    id: "vendor-1",
    vendor_number: "V001",
    name: "Office Supplies Co.",
    contact_person: "John Manager",
    email: "john@officesupplies.com",
    phone: "+1-555-0101",
    address: {
      line1: "123 Supply Street",
      city: "Supply City",
      state: "CA",
      postal_code: "90001",
      country: "US"
    },
    total_owed: 2500.00,
    payment_terms: "NET_30",
    status: "ACTIVE",
    created_at: new Date().toISOString(),
  },
  {
    id: "vendor-2",
    vendor_number: "V002",
    name: "Tech Services Inc.",
    contact_person: "Jane Consultant",
    email: "jane@techservices.com",
    phone: "+1-555-0202",
    address: {
      line1: "456 Tech Avenue",
      city: "Tech City",
      state: "CA",
      postal_code: "90002",
      country: "US"
    },
    total_owed: 3000.00,
    payment_terms: "NET_15",
    status: "ACTIVE",
    created_at: new Date().toISOString(),
  }
];

export default function AccountsPayablePage() {
  const [activeTab, setActiveTab] = useState("bills");
  const [filters, setFilters] = useState<{
    status?: string;
    vendor_id?: string;
    search?: string;
    page?: number;
    page_size?: number;
  }>({
    page: 1,
    page_size: 10,
  });

  // Form state
  const [formOpen, setFormOpen] = useState(false);
  const [editingBill, setEditingBill] = useState<VendorBill | undefined>();

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

  const getStatusColor = (status: BillStatus) => {
    switch (status) {
      case 'OPEN': return 'bg-blue-100 text-blue-700';
      case 'PARTIAL': return 'bg-yellow-100 text-yellow-700';
      case 'PAID': return 'bg-green-100 text-green-700';
      case 'OVERDUE': return 'bg-red-100 text-red-700';
      case 'VOID': return 'bg-gray-100 text-gray-500';
      case 'CANCELLED': return 'bg-gray-100 text-gray-500';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getPaymentStatusColor = (status: PaymentStatus) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-700';
      case 'PROCESSED': return 'bg-blue-100 text-blue-700';
      case 'CLEARED': return 'bg-green-100 text-green-700';
      case 'FAILED': return 'bg-red-100 text-red-700';
      case 'CANCELLED': return 'bg-gray-100 text-gray-500';
      default: return 'bg-gray-100 text-gray-700';
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
        <div className="font-medium">{row.getValue("vendor_name")}</div>
      ),
    },
    {
      id: "bill_date",
      accessorKey: "bill_date",
      header: "Bill Date",
      cell: ({ row }: any) => (
        <div className="text-sm">
          {new Date(row.getValue("bill_date")).toLocaleDateString()}
        </div>
      ),
    },
    {
      id: "due_date",
      accessorKey: "due_date",
      header: "Due Date",
      cell: ({ row }: any) => {
        const dueDate = new Date(row.getValue("due_date"));
        const isOverdue = dueDate < new Date() && row.original.status !== 'PAID';
        return (
          <div className={`text-sm ${isOverdue ? 'text-red-600 font-medium' : ''}`}>
            {dueDate.toLocaleDateString()}
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
          ${row.getValue("total_amount")?.toLocaleString() || "0.00"}
        </div>
      ),
    },
    {
      id: "balance_due",
      accessorKey: "balance_due",
      header: "Balance Due",
      cell: ({ row }: any) => {
        const balance = row.getValue("balance_due");
        return (
          <div className={`font-mono text-sm font-medium ${balance > 0 ? 'text-red-600' : 'text-green-600'}`}>
            ${balance?.toLocaleString() || "0.00"}
          </div>
        );
      },
    },
    {
      id: "status",
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: any) => {
        const status = row.getValue("status") as BillStatus;
        return (
          <Badge className={`${getStatusColor(status)} border-0`}>
            {status}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }: any) => {
        const bill = row.original;
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
              {bill.balance_due > 0 && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Make Payment
                  </DropdownMenuItem>
                </>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  // Statistics
  const stats = {
    totalBills: mockVendorBills.length,
    totalAmount: mockVendorBills.reduce((sum, bill) => sum + bill.total_amount, 0),
    totalDue: mockVendorBills.reduce((sum, bill) => sum + bill.balance_due, 0),
    overdueBills: mockVendorBills.filter(bill => {
      const dueDate = new Date(bill.due_date);
      return dueDate < new Date() && bill.status !== 'PAID';
    }).length,
    paidBills: mockVendorBills.filter(bill => bill.status === 'PAID').length,
    totalVendors: mockVendors.length,
    totalPayments: mockVendorPayments.length,
    avgPaymentAmount: mockVendorPayments.reduce((sum, payment) => sum + payment.amount, 0) / mockVendorPayments.length || 0,
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
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-blue-600">{stats.totalBills}</div>
          <div className="text-sm text-gray-600">Total Bills</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-green-600">${stats.totalAmount.toLocaleString()}</div>
          <div className="text-sm text-gray-600">Total Amount</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-red-600">${stats.totalDue.toLocaleString()}</div>
          <div className="text-sm text-gray-600">Amount Due</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-orange-600">{stats.overdueBills}</div>
          <div className="text-sm text-gray-600">Overdue</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-emerald-600">{stats.paidBills}</div>
          <div className="text-sm text-gray-600">Paid</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-purple-600">{stats.totalVendors}</div>
          <div className="text-sm text-gray-600">Vendors</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-indigo-600">{stats.totalPayments}</div>
          <div className="text-sm text-gray-600">Payments</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-cyan-600">${stats.avgPaymentAmount.toLocaleString()}</div>
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
                <SelectItem value="OPEN">Open</SelectItem>
                <SelectItem value="PARTIAL">Partial</SelectItem>
                <SelectItem value="PAID">Paid</SelectItem>
                <SelectItem value="OVERDUE">Overdue</SelectItem>
                <SelectItem value="VOID">Void</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            {(filters.search || filters.status) && (
              <Button variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
            )}

            <div className="ml-auto flex items-center space-x-2 text-sm text-gray-600">
              <Filter className="w-4 h-4" />
              <span>{mockVendorBills.length} bill{mockVendorBills.length !== 1 ? 's' : ''}</span>
            </div>
          </div>

          {/* Bills Table */}
          <Card className="p-6">
            <DataTable
              columns={billsColumns}
              data={mockVendorBills}
              pagination={{
                total: mockVendorBills.length,
                pageSize: filters.page_size || 10,
                onChange: (page) => {
                  setFilters(prev => ({ ...prev, page }));
                }
              }}
            />
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Payments</h3>
            <div className="space-y-4">
              {mockVendorPayments.map((payment) => (
                <div key={payment.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{payment.vendor_name}</h4>
                      <p className="text-sm text-gray-600">
                        {payment.payment_method} • {payment.reference_number}
                      </p>
                      <p className="text-sm text-gray-600">
                        Paid on {new Date(payment.payment_date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-medium">${payment.amount.toLocaleString()}</div>
                      <Badge className={`${getPaymentStatusColor(payment.status)} border-0 text-xs`}>
                        {payment.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="mt-3">
                    <h5 className="text-sm font-medium text-gray-700 mb-2">Bills Paid:</h5>
                    {payment.bills_paid.map((billPayment, index) => (
                      <div key={index} className="text-sm flex justify-between py-1">
                        <span>{billPayment.bill_number}</span>
                        <span className="font-mono">${billPayment.amount_paid.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="vendors" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Vendor Directory</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockVendors.map((vendor) => (
                <div key={vendor.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium">{vendor.name}</h4>
                      <p className="text-sm text-gray-600 font-mono">{vendor.vendor_number}</p>
                    </div>
                    <Badge className={vendor.status === 'ACTIVE' ? 'bg-green-100 text-green-700 border-0' : 'bg-gray-100 text-gray-700 border-0'}>
                      {vendor.status}
                    </Badge>
                  </div>
                  <div className="mt-3 space-y-1 text-sm">
                    {vendor.contact_person && <p>{vendor.contact_person}</p>}
                    {vendor.email && <p className="text-blue-600">{vendor.email}</p>}
                    {vendor.phone && <p>{vendor.phone}</p>}
                  </div>
                  <div className="mt-3 pt-3 border-t">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Amount Owed:</span>
                      <span className="font-mono font-medium text-red-600">
                        ${vendor.total_owed.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
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