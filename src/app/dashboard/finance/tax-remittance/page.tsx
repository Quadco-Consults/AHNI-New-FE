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
  DollarSign,
  Calendar,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  MoreHorizontal,
  Eye,
  Edit,
  Send,
  Download,
} from "lucide-react";
import { toast } from "sonner";
import DataTable from "@/components/Table/DataTable";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  useGetTaxRemittances,
} from "@/features/finance/controllers/taxController";

export default function TaxRemittancePage() {
  const [filters, setFilters] = useState<{
    status?: string;
    tax_authority_id?: string;
    tax_type_id?: string;
  }>({});

  // Fetch tax remittances from backend
  const { data: remittancesData, isLoading, error } = useGetTaxRemittances(filters);

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'DRAFT': return 'bg-gray-100 text-gray-700';
      case 'PENDING': return 'bg-yellow-100 text-yellow-700';
      case 'SUBMITTED': return 'bg-blue-100 text-blue-700';
      case 'PAID': return 'bg-green-100 text-green-700';
      case 'REJECTED': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'DRAFT': return <FileText className="w-4 h-4" />;
      case 'PENDING': return <Clock className="w-4 h-4" />;
      case 'SUBMITTED': return <Send className="w-4 h-4" />;
      case 'PAID': return <CheckCircle className="w-4 h-4" />;
      case 'REJECTED': return <AlertCircle className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  // Tax Remittance columns
  const columns = [
    {
      id: "remittance_number",
      accessorKey: "remittance_number",
      header: "Remittance #",
      cell: ({ row }: any) => (
        <span className="font-mono text-sm font-medium">{row.getValue("remittance_number")}</span>
      ),
    },
    {
      id: "tax_authority_name",
      accessorKey: "tax_authority_name",
      header: "Tax Authority",
      cell: ({ row }: any) => (
        <div className="font-medium">{row.getValue("tax_authority_name") || "-"}</div>
      ),
    },
    {
      id: "tax_type_name",
      accessorKey: "tax_type_name",
      header: "Tax Type",
      cell: ({ row }: any) => (
        <div className="text-sm">{row.getValue("tax_type_name") || "-"}</div>
      ),
    },
    {
      id: "period_from",
      accessorKey: "period_from",
      header: "Period",
      cell: ({ row }: any) => {
        const periodFrom = row.getValue("period_from");
        const periodTo = row.original.period_to;
        if (!periodFrom || !periodTo) return "-";
        return (
          <div className="flex items-center text-sm">
            <Calendar className="w-3 h-3 mr-1 text-gray-400" />
            {new Date(periodFrom).toLocaleDateString()} - {new Date(periodTo).toLocaleDateString()}
          </div>
        );
      },
    },
    {
      id: "total_amount",
      accessorKey: "total_amount",
      header: "Amount",
      cell: ({ row }: any) => {
        const amount = row.getValue("total_amount");
        return (
          <div className="flex items-center font-mono">
            <DollarSign className="w-3 h-3 mr-1 text-gray-400" />
            {amount ? parseFloat(amount).toLocaleString('en-NG', {
              style: 'currency',
              currency: 'NGN',
              minimumFractionDigits: 2
            }) : "₦0.00"}
          </div>
        );
      },
    },
    {
      id: "withholding_count",
      accessorKey: "withholding_count",
      header: "Items",
      cell: ({ row }: any) => (
        <div className="text-center">
          <Badge variant="outline" className="text-xs">
            {row.getValue("withholding_count") || 0} items
          </Badge>
        </div>
      ),
    },
    {
      id: "due_date",
      accessorKey: "due_date",
      header: "Due Date",
      cell: ({ row }: any) => {
        const dueDate = row.getValue("due_date");
        if (!dueDate) return "-";
        const date = new Date(dueDate);
        const isOverdue = date < new Date() && row.original.status !== 'PAID';
        return (
          <div className={`text-sm ${isOverdue ? 'text-red-600 font-medium' : ''}`}>
            {date.toLocaleDateString()}
            {isOverdue && <span className="ml-1">(Overdue)</span>}
          </div>
        );
      },
    },
    {
      id: "status",
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: any) => {
        const status = row.getValue("status") as string;
        return (
          <Badge className={`${getStatusColor(status)} border-0 flex items-center gap-1 w-fit`}>
            {getStatusIcon(status)}
            {status || "DRAFT"}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }: any) => {
        const remittance = row.original;
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
              {remittance.status === 'DRAFT' && (
                <>
                  <DropdownMenuItem>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Send className="mr-2 h-4 w-4" />
                    Submit
                  </DropdownMenuItem>
                </>
              )}
              {remittance.status === 'PENDING' && (
                <DropdownMenuItem>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Mark as Paid
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Download className="mr-2 h-4 w-4" />
                Download Receipt
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  // Extract data
  const remittances = remittancesData?.data?.results || [];
  const totalCount = remittancesData?.data?.count || 0;

  // Statistics
  const stats = {
    total: totalCount,
    draft: remittances.filter((r: any) => r.status === 'DRAFT').length,
    pending: remittances.filter((r: any) => r.status === 'PENDING').length,
    paid: remittances.filter((r: any) => r.status === 'PAID').length,
    totalAmount: remittances.reduce((sum: number, r: any) => sum + (parseFloat(r.total_amount) || 0), 0),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tax Remittance</h1>
          <p className="text-gray-600">
            Manage tax withholding remittances to tax authorities
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download size={20} className="mr-2" />
            Export
          </Button>
          <Button>
            <Plus size={20} className="mr-2" />
            Prepare Remittance
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
          <div className="text-sm text-gray-600">Total Remittances</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-gray-600">{stats.draft}</div>
          <div className="text-sm text-gray-600">Draft</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          <div className="text-sm text-gray-600">Pending</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-green-600">{stats.paid}</div>
          <div className="text-sm text-gray-600">Paid</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-emerald-600">
            {stats.totalAmount.toLocaleString('en-NG', {
              style: 'currency',
              currency: 'NGN',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0
            })}
          </div>
          <div className="text-sm text-gray-600">Total Amount</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 p-4 bg-white rounded-lg border">
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
            <SelectItem value="SUBMITTED">Submitted</SelectItem>
            <SelectItem value="PAID">Paid</SelectItem>
            <SelectItem value="REJECTED">Rejected</SelectItem>
          </SelectContent>
        </Select>

        {(filters.status || filters.tax_authority_id || filters.tax_type_id) && (
          <Button variant="outline" onClick={clearFilters}>
            Clear Filters
          </Button>
        )}

        <div className="ml-auto flex items-center space-x-2 text-sm text-gray-600">
          <Filter className="w-4 h-4" />
          <span>{totalCount} remittance{totalCount !== 1 ? 's' : ''}</span>
        </div>
      </div>

      {/* Tax Remittances Table */}
      <Card className="p-6">
        {isLoading ? (
          <div className="text-center py-8">Loading tax remittances...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-600">
            Error loading tax remittances. Please try again.
          </div>
        ) : remittances.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 mx-auto text-gray-400 mb-3" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No Remittances Yet</h3>
            <p className="text-gray-600 mb-4">Get started by preparing your first tax remittance</p>
            <Button>
              <Plus size={20} className="mr-2" />
              Prepare Remittance
            </Button>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={remittances}
            pagination={{
              total: totalCount,
              pageSize: 10,
              onChange: (page) => {
                // Handle pagination
              }
            }}
          />
        )}
      </Card>
    </div>
  );
}
