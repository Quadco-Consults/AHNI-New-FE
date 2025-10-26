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
  DollarSign,
  Calendar,
  Send,
  Download,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Mail,
  CreditCard,
  AlertCircle,
  CheckCircle
} from "lucide-react";
import { toast } from "sonner";
import DataTable from "components/Table/DataTable";
import { Invoice, InvoiceStatus } from "../../../../features/finance/types/invoice.types";
import InvoiceForm from "../../../../features/finance/components/invoicing/InvoiceForm";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "components/ui/dialog";

// Mock data for now - replace with actual API integration
const mockInvoices: Invoice[] = [
  {
    id: "1",
    invoice_number: "INV-001",
    customer_id: "cust-1",
    customer_name: "Acme Corporation",
    invoice_date: "2024-10-01",
    due_date: "2024-10-31",
    subtotal: 5000.00,
    tax_amount: 400.00,
    discount_amount: 0,
    total_amount: 5400.00,
    amount_paid: 5400.00,
    balance_due: 0,
    status: "PAID",
    payment_terms: "NET_30",
    currency: "USD",
    line_items: [],
    billing_address: {
      line1: "123 Business St",
      city: "Business City",
      state: "CA",
      postal_code: "90210",
      country: "US"
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: "user-1"
  },
  {
    id: "2",
    invoice_number: "INV-002",
    customer_id: "cust-2",
    customer_name: "Tech Solutions Inc",
    invoice_date: "2024-10-15",
    due_date: "2024-11-15",
    subtotal: 3500.00,
    tax_amount: 280.00,
    discount_amount: 100.00,
    total_amount: 3680.00,
    amount_paid: 0,
    balance_due: 3680.00,
    status: "SENT",
    payment_terms: "NET_30",
    currency: "USD",
    line_items: [],
    billing_address: {
      line1: "456 Tech Ave",
      city: "Silicon Valley",
      state: "CA",
      postal_code: "94025",
      country: "US"
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: "user-1"
  },
  {
    id: "3",
    invoice_number: "INV-003",
    customer_id: "cust-3",
    customer_name: "Small Business LLC",
    invoice_date: "2024-09-01",
    due_date: "2024-09-30",
    subtotal: 1200.00,
    tax_amount: 96.00,
    discount_amount: 0,
    total_amount: 1296.00,
    amount_paid: 0,
    balance_due: 1296.00,
    status: "OVERDUE",
    payment_terms: "NET_30",
    currency: "USD",
    line_items: [],
    billing_address: {
      line1: "789 Small St",
      city: "Small Town",
      state: "TX",
      postal_code: "75001",
      country: "US"
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: "user-1"
  }
];

export default function InvoicesPage() {
  const [filters, setFilters] = useState<{
    status?: InvoiceStatus;
    customer_id?: string;
    date_from?: string;
    date_to?: string;
    search?: string;
    page?: number;
    page_size?: number;
  }>({
    page: 1,
    page_size: 10,
  });

  const [formOpen, setFormOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [viewingInvoice, setViewingInvoice] = useState<Invoice | null>(null);
  const [deletingInvoice, setDeletingInvoice] = useState<Invoice | null>(null);

  const invoices = mockInvoices;
  const totalInvoices = invoices.length;

  // Handlers
  const handleSearch = (search: string) => {
    setFilters(prev => ({ ...prev, search, page: 1 }));
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const clearFilters = () => {
    setFilters({ page: 1, page_size: 10 });
  };

  const handleViewInvoice = (invoice: Invoice) => {
    setViewingInvoice(invoice);
  };

  const handleEditInvoice = (invoice: Invoice) => {
    setEditingInvoice(invoice);
    setFormOpen(true);
  };

  const handleDeleteInvoice = () => {
    if (deletingInvoice) {
      // API call would go here
      setDeletingInvoice(null);
      toast.success("Invoice deleted successfully");
    }
  };

  const handleSendInvoice = (invoice: Invoice) => {
    // API call would go here
    toast.success(`Invoice ${invoice.invoice_number} sent successfully`);
  };

  const handleMarkPaid = (invoice: Invoice) => {
    // API call would go here
    toast.success(`Invoice ${invoice.invoice_number} marked as paid`);
  };

  const handleDownloadPDF = (invoice: Invoice) => {
    // API call would go here
    toast.success(`PDF for ${invoice.invoice_number} downloaded`);
  };

  const handleFormSuccess = () => {
    // Refresh invoice list when form succeeds
    // This will be handled automatically by React Query when backend is ready
    toast.success("Invoice list refreshed");
  };

  const getStatusColor = (status: InvoiceStatus) => {
    switch (status) {
      case 'DRAFT': return 'bg-gray-100 text-gray-700';
      case 'PENDING': return 'bg-yellow-100 text-yellow-700';
      case 'SENT': return 'bg-blue-100 text-blue-700';
      case 'VIEWED': return 'bg-purple-100 text-purple-700';
      case 'PARTIAL': return 'bg-orange-100 text-orange-700';
      case 'PAID': return 'bg-green-100 text-green-700';
      case 'OVERDUE': return 'bg-red-100 text-red-700';
      case 'VOID': return 'bg-gray-100 text-gray-500';
      case 'CANCELLED': return 'bg-gray-100 text-gray-500';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: InvoiceStatus) => {
    switch (status) {
      case 'PAID': return <CheckCircle className="w-3 h-3" />;
      case 'OVERDUE': return <AlertCircle className="w-3 h-3" />;
      case 'SENT': return <Send className="w-3 h-3" />;
      default: return <FileText className="w-3 h-3" />;
    }
  };

  // Column definitions
  const columns = [
    {
      accessorKey: "invoice_number",
      header: "Invoice #",
      cell: ({ row }: any) => (
        <span className="font-mono text-sm font-medium">{row.getValue("invoice_number")}</span>
      ),
    },
    {
      accessorKey: "customer_name",
      header: "Customer",
      cell: ({ row }: any) => (
        <div className="font-medium">{row.getValue("customer_name")}</div>
      ),
    },
    {
      accessorKey: "invoice_date",
      header: "Date",
      cell: ({ row }: any) => (
        <div className="text-sm">
          {new Date(row.getValue("invoice_date")).toLocaleDateString()}
        </div>
      ),
    },
    {
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
      accessorKey: "total_amount",
      header: "Amount",
      cell: ({ row }: any) => (
        <div className="font-mono text-sm font-medium">
          ${row.getValue("total_amount")?.toLocaleString() || "0.00"}
        </div>
      ),
    },
    {
      accessorKey: "balance_due",
      header: "Balance",
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
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: any) => {
        const status = row.getValue("status") as InvoiceStatus;
        return (
          <Badge className={`${getStatusColor(status)} border-0`}>
            <div className="flex items-center space-x-1">
              {getStatusIcon(status)}
              <span>{status}</span>
            </div>
          </Badge>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }: any) => {
        const invoice = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleViewInvoice(invoice)}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleEditInvoice(invoice)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDownloadPDF(invoice)}>
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {invoice.status !== 'SENT' && invoice.status !== 'PAID' && (
                <DropdownMenuItem onClick={() => handleSendInvoice(invoice)}>
                  <Mail className="mr-2 h-4 w-4" />
                  Send Invoice
                </DropdownMenuItem>
              )}
              {invoice.status !== 'PAID' && invoice.balance_due > 0 && (
                <DropdownMenuItem onClick={() => handleMarkPaid(invoice)}>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Mark as Paid
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setDeletingInvoice(invoice)}
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

  // Statistics
  const stats = {
    total: invoices.length,
    totalAmount: invoices.reduce((sum, inv) => sum + inv.total_amount, 0),
    paidAmount: invoices.filter(inv => inv.status === 'PAID').reduce((sum, inv) => sum + inv.total_amount, 0),
    outstandingAmount: invoices.reduce((sum, inv) => sum + inv.balance_due, 0),
    overdue: invoices.filter(inv => inv.status === 'OVERDUE').length,
    draft: invoices.filter(inv => inv.status === 'DRAFT').length,
    sent: invoices.filter(inv => inv.status === 'SENT').length,
    paid: invoices.filter(inv => inv.status === 'PAID').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Invoicing & Billing</h1>
          <p className="text-gray-600">
            Create, send, and manage customer invoices and billing
          </p>
        </div>
        <Button onClick={() => setFormOpen(true)}>
          <Plus size={20} className="mr-2" />
          Create Invoice
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
          <div className="text-sm text-gray-600">Total Invoices</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-green-600">${stats.totalAmount.toLocaleString()}</div>
          <div className="text-sm text-gray-600">Total Invoiced</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-emerald-600">${stats.paidAmount.toLocaleString()}</div>
          <div className="text-sm text-gray-600">Paid</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-red-600">${stats.outstandingAmount.toLocaleString()}</div>
          <div className="text-sm text-gray-600">Outstanding</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-gray-600">{stats.draft}</div>
          <div className="text-sm text-gray-600">Draft</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-blue-600">{stats.sent}</div>
          <div className="text-sm text-gray-600">Sent</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-green-600">{stats.paid}</div>
          <div className="text-sm text-gray-600">Paid</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
          <div className="text-sm text-gray-600">Overdue</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 p-4 bg-white rounded-lg border">
        <div className="flex items-center space-x-2">
          <Search className="w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search invoices..."
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
            <SelectItem value="DRAFT">Draft</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="SENT">Sent</SelectItem>
            <SelectItem value="VIEWED">Viewed</SelectItem>
            <SelectItem value="PARTIAL">Partial</SelectItem>
            <SelectItem value="PAID">Paid</SelectItem>
            <SelectItem value="OVERDUE">Overdue</SelectItem>
            <SelectItem value="VOID">Void</SelectItem>
            <SelectItem value="CANCELLED">Cancelled</SelectItem>
          </SelectContent>
        </Select>

        <Input
          type="date"
          placeholder="From Date"
          value={filters.date_from || ""}
          onChange={(e) => handleFilterChange("date_from", e.target.value)}
          className="w-40"
        />

        <Input
          type="date"
          placeholder="To Date"
          value={filters.date_to || ""}
          onChange={(e) => handleFilterChange("date_to", e.target.value)}
          className="w-40"
        />

        {(filters.search || filters.status || filters.date_from || filters.date_to) && (
          <Button variant="outline" onClick={clearFilters}>
            Clear Filters
          </Button>
        )}

        <div className="ml-auto flex items-center space-x-2 text-sm text-gray-600">
          <Filter className="w-4 h-4" />
          <span>
            {invoices.length} invoice{invoices.length !== 1 ? 's' : ''}
            {filters.search || filters.status || filters.date_from || filters.date_to ? ' (filtered)' : ''}
          </span>
        </div>
      </div>

      {/* Data Table */}
      <Card className="p-6">
        <DataTable
          columns={columns}
          data={invoices}
          pageCount={Math.ceil(totalInvoices / (filters.page_size || 10))}
          pageIndex={(filters.page || 1) - 1}
          pageSize={filters.page_size || 10}
          onPaginationChange={(pagination) => {
            setFilters(prev => ({
              ...prev,
              page: pagination.pageIndex + 1,
              page_size: pagination.pageSize,
            }));
          }}
        />
      </Card>

      {/* Invoice Form Dialog */}
      <InvoiceForm
        open={formOpen}
        onOpenChange={setFormOpen}
        invoice={editingInvoice}
        onSuccess={handleFormSuccess}
      />

      {/* View Invoice Dialog */}
      <Dialog open={!!viewingInvoice} onOpenChange={() => setViewingInvoice(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Invoice Details</DialogTitle>
            <DialogDescription>
              Detailed information for {viewingInvoice?.invoice_number}
            </DialogDescription>
          </DialogHeader>
          {viewingInvoice && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Invoice Number</label>
                  <p className="font-mono">{viewingInvoice.invoice_number}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Customer</label>
                  <p>{viewingInvoice.customer_name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Invoice Date</label>
                  <p>{new Date(viewingInvoice.invoice_date).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Due Date</label>
                  <p>{new Date(viewingInvoice.due_date).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Total Amount</label>
                  <p className="font-mono">${viewingInvoice.total_amount.toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Balance Due</label>
                  <p className={`font-mono ${viewingInvoice.balance_due > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    ${viewingInvoice.balance_due.toLocaleString()}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Status</label>
                  <Badge className={`${getStatusColor(viewingInvoice.status)} border-0`}>
                    <div className="flex items-center space-x-1">
                      {getStatusIcon(viewingInvoice.status)}
                      <span>{viewingInvoice.status}</span>
                    </div>
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Payment Terms</label>
                  <p>{viewingInvoice.payment_terms}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Billing Address</label>
                <div className="mt-1 p-3 bg-gray-50 rounded">
                  <p>{viewingInvoice.billing_address.line1}</p>
                  {viewingInvoice.billing_address.line2 && <p>{viewingInvoice.billing_address.line2}</p>}
                  <p>
                    {viewingInvoice.billing_address.city}, {viewingInvoice.billing_address.state} {viewingInvoice.billing_address.postal_code}
                  </p>
                  <p>{viewingInvoice.billing_address.country}</p>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setViewingInvoice(null)}>
                  Close
                </Button>
                <Button onClick={() => handleDownloadPDF(viewingInvoice)}>
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingInvoice} onOpenChange={() => setDeletingInvoice(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Invoice</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete invoice {deletingInvoice?.invoice_number}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeletingInvoice(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteInvoice}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Invoice
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}