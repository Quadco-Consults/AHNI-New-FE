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
  ShoppingCart,
  Calendar,
  DollarSign,
  Package,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  FileText,
  Send,
  CheckCircle,
  Clock,
  AlertCircle,
  Truck
} from "lucide-react";
import { toast } from "sonner";
import DataTable from "components/Table/DataTable";
import SalesOrderForm from "../../../../features/finance/components/sales/SalesOrderForm";
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

// Types for Sales Orders
interface SalesOrder {
  id: string;
  order_number: string;
  customer_id: string;
  customer_name: string;
  order_date: string;
  delivery_date: string;
  status: SalesOrderStatus;
  total_amount: number;
  subtotal: number;
  tax_amount: number;
  discount_amount: number;
  shipping_amount: number;
  line_items: SalesOrderLineItem[];
  billing_address: Address;
  shipping_address: Address;
  notes?: string;
  created_at: string;
  updated_at: string;
  created_by: string;
}

interface SalesOrderLineItem {
  id: string;
  product_id?: string;
  description: string;
  quantity: number;
  unit_price: number;
  discount_percent?: number;
  discount_amount?: number;
  tax_amount?: number;
  line_total: number;
}

interface Address {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

type SalesOrderStatus =
  | 'DRAFT'
  | 'PENDING'
  | 'CONFIRMED'
  | 'IN_PROGRESS'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'ON_HOLD';

// Mock data for now - replace with actual API integration
const mockSalesOrders: SalesOrder[] = [
  {
    id: "1",
    order_number: "SO-001",
    customer_id: "cust-1",
    customer_name: "Acme Corporation",
    order_date: "2024-10-20",
    delivery_date: "2024-10-30",
    status: "CONFIRMED",
    subtotal: 4500.00,
    tax_amount: 360.00,
    discount_amount: 0,
    shipping_amount: 50.00,
    total_amount: 4910.00,
    line_items: [],
    billing_address: {
      line1: "123 Business St",
      city: "Business City",
      state: "CA",
      postal_code: "90210",
      country: "US"
    },
    shipping_address: {
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
    order_number: "SO-002",
    customer_id: "cust-2",
    customer_name: "Tech Solutions Inc",
    order_date: "2024-10-22",
    delivery_date: "2024-11-05",
    status: "IN_PROGRESS",
    subtotal: 2800.00,
    tax_amount: 224.00,
    discount_amount: 140.00,
    shipping_amount: 25.00,
    total_amount: 2909.00,
    line_items: [],
    billing_address: {
      line1: "456 Tech Ave",
      city: "Silicon Valley",
      state: "CA",
      postal_code: "94025",
      country: "US"
    },
    shipping_address: {
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
    order_number: "SO-003",
    customer_id: "cust-3",
    customer_name: "Small Business LLC",
    order_date: "2024-10-15",
    delivery_date: "2024-10-25",
    status: "SHIPPED",
    subtotal: 1200.00,
    tax_amount: 96.00,
    discount_amount: 0,
    shipping_amount: 15.00,
    total_amount: 1311.00,
    line_items: [],
    billing_address: {
      line1: "789 Small St",
      city: "Small Town",
      state: "TX",
      postal_code: "75001",
      country: "US"
    },
    shipping_address: {
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

export default function SalesOrdersPage() {
  const [filters, setFilters] = useState<{
    status?: SalesOrderStatus;
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
  const [editingOrder, setEditingOrder] = useState<SalesOrder | null>(null);
  const [viewingOrder, setViewingOrder] = useState<SalesOrder | null>(null);
  const [deletingOrder, setDeletingOrder] = useState<SalesOrder | null>(null);

  const salesOrders = mockSalesOrders;
  const totalOrders = salesOrders.length;

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

  const handleViewOrder = (order: SalesOrder) => {
    setViewingOrder(order);
  };

  const handleEditOrder = (order: SalesOrder) => {
    setEditingOrder(order);
    setFormOpen(true);
  };

  const handleDeleteOrder = () => {
    if (deletingOrder) {
      // API call would go here
      setDeletingOrder(null);
      toast.success("Sales order deleted successfully");
    }
  };

  const handleFormSuccess = () => {
    // Refresh orders list when form succeeds
    // This will be handled automatically by React Query when backend is ready
    toast.success("Sales orders list refreshed");
  };

  const handleUpdateStatus = (order: SalesOrder, newStatus: SalesOrderStatus) => {
    // API call would go here
    toast.success(`Order ${order.order_number} status updated to ${newStatus}`);
  };

  const handleConvertToInvoice = (order: SalesOrder) => {
    // API call would go here
    toast.success(`Converting order ${order.order_number} to invoice`);
  };

  const getStatusColor = (status: SalesOrderStatus) => {
    switch (status) {
      case 'DRAFT': return 'bg-gray-100 text-gray-700';
      case 'PENDING': return 'bg-yellow-100 text-yellow-700';
      case 'CONFIRMED': return 'bg-blue-100 text-blue-700';
      case 'IN_PROGRESS': return 'bg-purple-100 text-purple-700';
      case 'SHIPPED': return 'bg-orange-100 text-orange-700';
      case 'DELIVERED': return 'bg-green-100 text-green-700';
      case 'COMPLETED': return 'bg-emerald-100 text-emerald-700';
      case 'CANCELLED': return 'bg-red-100 text-red-700';
      case 'ON_HOLD': return 'bg-amber-100 text-amber-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: SalesOrderStatus) => {
    switch (status) {
      case 'COMPLETED': return <CheckCircle className="w-3 h-3" />;
      case 'SHIPPED': return <Truck className="w-3 h-3" />;
      case 'CANCELLED': return <AlertCircle className="w-3 h-3" />;
      case 'ON_HOLD': return <Clock className="w-3 h-3" />;
      default: return <Package className="w-3 h-3" />;
    }
  };

  // Column definitions
  const columns = [
    {
      accessorKey: "order_number",
      header: "Order #",
      cell: ({ row }: any) => (
        <span className="font-mono text-sm font-medium">{row.getValue("order_number")}</span>
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
      accessorKey: "order_date",
      header: "Order Date",
      cell: ({ row }: any) => (
        <div className="text-sm">
          {new Date(row.getValue("order_date")).toLocaleDateString()}
        </div>
      ),
    },
    {
      accessorKey: "delivery_date",
      header: "Delivery Date",
      cell: ({ row }: any) => {
        const deliveryDate = new Date(row.getValue("delivery_date"));
        const isOverdue = deliveryDate < new Date() && !['DELIVERED', 'COMPLETED', 'CANCELLED'].includes(row.original.status);
        return (
          <div className={`text-sm ${isOverdue ? 'text-red-600 font-medium' : ''}`}>
            {deliveryDate.toLocaleDateString()}
          </div>
        );
      },
    },
    {
      accessorKey: "total_amount",
      header: "Total Amount",
      cell: ({ row }: any) => (
        <div className="font-mono text-sm font-medium">
          ${row.getValue("total_amount")?.toLocaleString() || "0.00"}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: any) => {
        const status = row.getValue("status") as SalesOrderStatus;
        return (
          <Badge className={`${getStatusColor(status)} border-0`}>
            <div className="flex items-center space-x-1">
              {getStatusIcon(status)}
              <span>{status.replace('_', ' ')}</span>
            </div>
          </Badge>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }: any) => {
        const order = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleViewOrder(order)}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleEditOrder(order)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {order.status === 'DRAFT' && (
                <DropdownMenuItem onClick={() => handleUpdateStatus(order, 'CONFIRMED')}>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Confirm Order
                </DropdownMenuItem>
              )}
              {order.status === 'CONFIRMED' && (
                <DropdownMenuItem onClick={() => handleUpdateStatus(order, 'IN_PROGRESS')}>
                  <Package className="mr-2 h-4 w-4" />
                  Start Processing
                </DropdownMenuItem>
              )}
              {order.status === 'IN_PROGRESS' && (
                <DropdownMenuItem onClick={() => handleUpdateStatus(order, 'SHIPPED')}>
                  <Truck className="mr-2 h-4 w-4" />
                  Mark as Shipped
                </DropdownMenuItem>
              )}
              {['CONFIRMED', 'IN_PROGRESS', 'SHIPPED'].includes(order.status) && (
                <DropdownMenuItem onClick={() => handleConvertToInvoice(order)}>
                  <FileText className="mr-2 h-4 w-4" />
                  Convert to Invoice
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setDeletingOrder(order)}
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
    total: salesOrders.length,
    totalAmount: salesOrders.reduce((sum, order) => sum + order.total_amount, 0),
    draft: salesOrders.filter(order => order.status === 'DRAFT').length,
    confirmed: salesOrders.filter(order => order.status === 'CONFIRMED').length,
    inProgress: salesOrders.filter(order => order.status === 'IN_PROGRESS').length,
    shipped: salesOrders.filter(order => order.status === 'SHIPPED').length,
    delivered: salesOrders.filter(order => order.status === 'DELIVERED').length,
    completed: salesOrders.filter(order => order.status === 'COMPLETED').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sales Orders</h1>
          <p className="text-gray-600">
            Manage sales orders and track fulfillment process
          </p>
        </div>
        <Button onClick={() => setFormOpen(true)}>
          <Plus size={20} className="mr-2" />
          Create Sales Order
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
          <div className="text-sm text-gray-600">Total Orders</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-green-600">${stats.totalAmount.toLocaleString()}</div>
          <div className="text-sm text-gray-600">Total Value</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-gray-600">{stats.draft}</div>
          <div className="text-sm text-gray-600">Draft</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-blue-600">{stats.confirmed}</div>
          <div className="text-sm text-gray-600">Confirmed</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-purple-600">{stats.inProgress}</div>
          <div className="text-sm text-gray-600">In Progress</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-orange-600">{stats.shipped}</div>
          <div className="text-sm text-gray-600">Shipped</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-green-600">{stats.delivered}</div>
          <div className="text-sm text-gray-600">Delivered</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-emerald-600">{stats.completed}</div>
          <div className="text-sm text-gray-600">Completed</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 p-4 bg-white rounded-lg border">
        <div className="flex items-center space-x-2">
          <Search className="w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search orders..."
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
            <SelectItem value="CONFIRMED">Confirmed</SelectItem>
            <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
            <SelectItem value="SHIPPED">Shipped</SelectItem>
            <SelectItem value="DELIVERED">Delivered</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
            <SelectItem value="CANCELLED">Cancelled</SelectItem>
            <SelectItem value="ON_HOLD">On Hold</SelectItem>
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
            {salesOrders.length} order{salesOrders.length !== 1 ? 's' : ''}
            {filters.search || filters.status || filters.date_from || filters.date_to ? ' (filtered)' : ''}
          </span>
        </div>
      </div>

      {/* Data Table */}
      <Card className="p-6">
        <DataTable
          columns={columns}
          data={salesOrders}
          pageCount={Math.ceil(totalOrders / (filters.page_size || 10))}
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

      {/* Sales Order Form Dialog */}
      <SalesOrderForm
        open={formOpen}
        onOpenChange={setFormOpen}
        order={editingOrder}
        onSuccess={handleFormSuccess}
      />

      {/* View Order Dialog */}
      <Dialog open={!!viewingOrder} onOpenChange={() => setViewingOrder(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Sales Order Details</DialogTitle>
            <DialogDescription>
              Detailed information for {viewingOrder?.order_number}
            </DialogDescription>
          </DialogHeader>
          {viewingOrder && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Order Number</label>
                  <p className="font-mono">{viewingOrder.order_number}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Customer</label>
                  <p>{viewingOrder.customer_name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Order Date</label>
                  <p>{new Date(viewingOrder.order_date).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Delivery Date</label>
                  <p>{new Date(viewingOrder.delivery_date).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Total Amount</label>
                  <p className="font-mono">${viewingOrder.total_amount.toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Status</label>
                  <Badge className={`${getStatusColor(viewingOrder.status)} border-0`}>
                    <div className="flex items-center space-x-1">
                      {getStatusIcon(viewingOrder.status)}
                      <span>{viewingOrder.status.replace('_', ' ')}</span>
                    </div>
                  </Badge>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Shipping Address</label>
                <div className="mt-1 p-3 bg-gray-50 rounded">
                  <p>{viewingOrder.shipping_address.line1}</p>
                  {viewingOrder.shipping_address.line2 && <p>{viewingOrder.shipping_address.line2}</p>}
                  <p>
                    {viewingOrder.shipping_address.city}, {viewingOrder.shipping_address.state} {viewingOrder.shipping_address.postal_code}
                  </p>
                  <p>{viewingOrder.shipping_address.country}</p>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setViewingOrder(null)}>
                  Close
                </Button>
                <Button onClick={() => handleConvertToInvoice(viewingOrder)}>
                  <FileText className="w-4 h-4 mr-2" />
                  Convert to Invoice
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingOrder} onOpenChange={() => setDeletingOrder(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Sales Order</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete order {deletingOrder?.order_number}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeletingOrder(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteOrder}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Order
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}