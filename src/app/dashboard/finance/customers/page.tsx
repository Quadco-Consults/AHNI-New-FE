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
import { Plus, Search, Filter, Users, Building2, Mail, Phone, DollarSign, Edit, Trash2, Eye } from "lucide-react";
import { toast } from "sonner";
import DataTable from "@/components/Table/DataTable";
import CustomerForm from "../../../../features/finance/components/customer/CustomerForm";
import {
  useGetCustomers,
  useCreateCustomer,
  useUpdateCustomer,
  useDeleteCustomer,
  useToggleCustomerStatus,
} from "../../../../features/finance/controllers/customerController";
import { Customer, CustomerFormData } from "../../../../features/finance/types/customer.types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

export default function CustomersPage() {
  const [filters, setFilters] = useState<{
    customer_type?: string;
    is_active?: boolean;
    search?: string;
    page?: number;
    page_size?: number;
  }>({
    page: 1,
    page_size: 10,
  });

  const [formOpen, setFormOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [viewingCustomer, setViewingCustomer] = useState<Customer | null>(null);
  const [deletingCustomer, setDeletingCustomer] = useState<Customer | null>(null);

  // API hooks
  const { data: customersData, isLoading } = useGetCustomers(filters);
  const createCustomerMutation = useCreateCustomer();
  const updateCustomerMutation = useUpdateCustomer();
  const deleteCustomerMutation = useDeleteCustomer();
  const toggleStatusMutation = useToggleCustomerStatus();

  const customers = Array.isArray(customersData?.data) ? customersData.data : [];
  const totalCustomers = customersData?.meta?.total || 0;

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

  const handleCreateCustomer = async (data: CustomerFormData) => {
    await createCustomerMutation.mutateAsync(data);
  };

  const handleUpdateCustomer = async (data: CustomerFormData) => {
    if (editingCustomer) {
      await updateCustomerMutation.mutateAsync({ id: editingCustomer.id, data });
      setEditingCustomer(null);
    }
  };

  const handleDeleteCustomer = async () => {
    if (deletingCustomer) {
      await deleteCustomerMutation.mutateAsync(deletingCustomer.id);
      setDeletingCustomer(null);
      toast.success("Customer deleted successfully");
    }
  };

  const handleToggleStatus = async (customer: Customer) => {
    await toggleStatusMutation.mutateAsync({
      id: customer.id,
      is_active: !customer.is_active,
    });
    toast.success(`Customer ${!customer.is_active ? "activated" : "deactivated"} successfully`);
  };

  const handleViewCustomer = (customer: Customer) => {
    setViewingCustomer(customer);
  };

  const handleEditCustomer = (customer: Customer) => {
    setEditingCustomer(customer);
    setFormOpen(true);
  };

  const handleOpenCreateForm = () => {
    setEditingCustomer(null);
    setFormOpen(true);
  };

  // Column definitions
  const columns = [
    {
      id: "customer_number",
      accessorKey: "customer_number",
      header: "Customer #",
      cell: ({ row }: any) => (
        <span className="font-mono text-sm">{row.getValue("customer_number")}</span>
      ),
    },
    {
      id: "display_name",
      accessorKey: "display_name",
      header: "Customer Name",
      cell: ({ row }: any) => (
        <div className="flex items-center space-x-2">
          {row.original.customer_type === 'COMPANY' ? (
            <Building2 className="h-4 w-4 text-blue-600" />
          ) : (
            <Users className="h-4 w-4 text-green-600" />
          )}
          <span className="font-medium">{row.getValue("display_name")}</span>
        </div>
      ),
    },
    {
      id: "customer_type",
      accessorKey: "customer_type",
      header: "Type",
      cell: ({ row }: any) => (
        <Badge variant={row.getValue("customer_type") === "COMPANY" ? "default" : "secondary"}>
          {row.getValue("customer_type")}
        </Badge>
      ),
    },
    {
      id: "email",
      accessorKey: "email",
      header: "Contact",
      cell: ({ row }: any) => (
        <div className="space-y-1">
          {row.getValue("email") && (
            <div className="flex items-center space-x-1 text-sm">
              <Mail className="h-3 w-3" />
              <span>{row.getValue("email")}</span>
            </div>
          )}
          {row.original.phone && (
            <div className="flex items-center space-x-1 text-sm">
              <Phone className="h-3 w-3" />
              <span>{row.original.phone}</span>
            </div>
          )}
        </div>
      ),
    },
    {
      id: "is_active",
      accessorKey: "is_active",
      header: "Status",
      cell: ({ row }: any) => (
        <Badge variant={row.getValue("is_active") ? "default" : "secondary"}>
          {row.getValue("is_active") ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }: any) => {
        const customer = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleViewCustomer(customer)}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleEditCustomer(customer)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleToggleStatus(customer)}
                className={customer.is_active ? "text-orange-600" : "text-green-600"}
              >
                {customer.is_active ? "Deactivate" : "Activate"}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setDeletingCustomer(customer)}
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
    total: customers.length,
    active: customers.filter(c => c.is_active).length,
    companies: customers.filter(c => c.customer_type === 'COMPANY').length,
    individuals: customers.filter(c => c.customer_type === 'INDIVIDUAL').length,
    totalSales: customers.reduce((sum, c) => sum + c.total_sales, 0),
    outstanding: customers.reduce((sum, c) => sum + c.outstanding_balance, 0),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Customer Management</h1>
          <p className="text-gray-600">
            Manage customers, contacts, and customer relationships
          </p>
        </div>
        <Button onClick={handleOpenCreateForm}>
          <Plus size={20} className="mr-2" />
          Add Customer
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
          <div className="text-sm text-gray-600">Total Customers</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-green-600">{stats.active}</div>
          <div className="text-sm text-gray-600">Active</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-purple-600">{stats.companies}</div>
          <div className="text-sm text-gray-600">Companies</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-orange-600">{stats.individuals}</div>
          <div className="text-sm text-gray-600">Individuals</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-emerald-600">
            ${stats.totalSales.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">Total Sales</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-red-600">
            ${stats.outstanding.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">Outstanding</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 p-4 bg-white rounded-lg border">
        <div className="flex items-center space-x-2">
          <Search className="w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search customers..."
            value={filters.search || ""}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-64"
          />
        </div>

        <Select
          value={filters.customer_type || "all"}
          onValueChange={(value) => handleFilterChange("customer_type", value === "all" ? undefined : value)}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Customer Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="COMPANY">Companies</SelectItem>
            <SelectItem value="INDIVIDUAL">Individuals</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.is_active?.toString() || "all"}
          onValueChange={(value) =>
            handleFilterChange("is_active", value === "all" ? undefined : value === "true")
          }
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="true">Active</SelectItem>
            <SelectItem value="false">Inactive</SelectItem>
          </SelectContent>
        </Select>

        {(filters.search || filters.customer_type || filters.is_active !== undefined) && (
          <Button variant="outline" onClick={clearFilters}>
            Clear Filters
          </Button>
        )}

        <div className="ml-auto flex items-center space-x-2 text-sm text-gray-600">
          <Filter className="w-4 h-4" />
          <span>
            {customers.length} customer{customers.length !== 1 ? 's' : ''}
            {filters.search || filters.customer_type || filters.is_active !== undefined ? ' (filtered)' : ''}
          </span>
        </div>
      </div>

      {/* Data Table */}
      <Card className="p-6">
        <DataTable
          columns={columns}
          data={customers}
          pagination={{
            total: totalCustomers,
            pageSize: filters.page_size || 10,
            onChange: (page) => {
              setFilters(prev => ({ ...prev, page }));
            }
          }}
        />
      </Card>

      {/* Customer Form Dialog */}
      <CustomerForm
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={editingCustomer ? handleUpdateCustomer : handleCreateCustomer}
        loading={createCustomerMutation.isPending || updateCustomerMutation.isPending}
        initialData={editingCustomer ? {
          customer_type: editingCustomer.customer_type,
          company_name: editingCustomer.company_name || "",
          first_name: editingCustomer.first_name || "",
          last_name: editingCustomer.last_name || "",
          display_name: editingCustomer.display_name,
          email: editingCustomer.email || "",
          phone: editingCustomer.phone || "",
          mobile: editingCustomer.mobile || "",
          website: editingCustomer.website || "",
          billing_address: editingCustomer.billing_address,
          shipping_address: editingCustomer.shipping_address || editingCustomer.billing_address,
          same_as_billing: editingCustomer.same_as_billing,
          payment_terms: editingCustomer.payment_terms?.toString() || "",
          credit_limit: editingCustomer.credit_limit || 0,
          tax_rate: editingCustomer.tax_rate || 0,
          currency: editingCustomer.currency,
          is_active: editingCustomer.is_active,
          is_taxable: editingCustomer.is_taxable,
          send_statements: editingCustomer.send_statements,
          notes: editingCustomer.notes || "",
        } : undefined}
      />

      {/* View Customer Dialog */}
      <Dialog open={!!viewingCustomer} onOpenChange={() => setViewingCustomer(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Customer Details</DialogTitle>
            <DialogDescription>
              Detailed information for {viewingCustomer?.display_name}
            </DialogDescription>
          </DialogHeader>
          {viewingCustomer && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Customer Number</label>
                  <p className="font-mono">{viewingCustomer.customer_number}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Type</label>
                  <div className="flex items-center space-x-2">
                    {viewingCustomer.customer_type === 'COMPANY' ? (
                      <Building2 className="h-4 w-4 text-blue-600" />
                    ) : (
                      <Users className="h-4 w-4 text-green-600" />
                    )}
                    <span>{viewingCustomer.customer_type}</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Email</label>
                  <p>{viewingCustomer.email || "N/A"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Phone</label>
                  <p>{viewingCustomer.phone || "N/A"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Currency</label>
                  <p>{viewingCustomer.currency}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Status</label>
                  <Badge variant={viewingCustomer.is_active ? "default" : "secondary"}>
                    {viewingCustomer.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Billing Address</label>
                <div className="mt-1 p-3 bg-gray-50 rounded">
                  <p>{viewingCustomer.billing_address.line1}</p>
                  {viewingCustomer.billing_address.line2 && <p>{viewingCustomer.billing_address.line2}</p>}
                  <p>
                    {viewingCustomer.billing_address.city}, {viewingCustomer.billing_address.state} {viewingCustomer.billing_address.postal_code}
                  </p>
                  <p>{viewingCustomer.billing_address.country}</p>
                </div>
              </div>

              {viewingCustomer.notes && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Notes</label>
                  <p className="mt-1 p-3 bg-gray-50 rounded">{viewingCustomer.notes}</p>
                </div>
              )}

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setViewingCustomer(null)}>
                  Close
                </Button>
                <Button onClick={() => {
                  setViewingCustomer(null);
                  handleEditCustomer(viewingCustomer);
                }}>
                  Edit Customer
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingCustomer} onOpenChange={() => setDeletingCustomer(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Customer</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {deletingCustomer?.display_name}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeletingCustomer(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteCustomer}
              className="bg-red-600 hover:bg-red-700"
              disabled={deleteCustomerMutation.isPending}
            >
              {deleteCustomerMutation.isPending ? "Deleting..." : "Delete Customer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}