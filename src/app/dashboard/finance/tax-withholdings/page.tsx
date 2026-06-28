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
  Send,
  MoreHorizontal,
  Eye,
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
  useGetTaxWithholdings,
} from "@/features/finance/controllers/taxController";

export default function TaxWithholdingsPage() {
  const [filters, setFilters] = useState<{
    remittance_status?: string;
    tax_type_id?: string;
    tax_authority_id?: string;
    date_from?: string;
    date_to?: string;
  }>({});

  // Fetch tax withholdings from backend
  const { data: withholdingsData, isLoading, error } = useGetTaxWithholdings(filters);

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  const getRemittanceStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-700';
      case 'REMITTED': return 'bg-green-100 text-green-700';
      case 'INCLUDED': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  // Tax Withholdings columns
  const columns = [
    {
      id: "withholding_number",
      accessorKey: "withholding_number",
      header: "Withholding #",
      cell: ({ row }: any) => (
        <span className="font-mono text-sm font-medium">{row.getValue("withholding_number") || "-"}</span>
      ),
    },
    {
      id: "payment_voucher_number",
      accessorKey: "payment_voucher_number",
      header: "PV Number",
      cell: ({ row }: any) => (
        <span className="font-mono text-sm">{row.getValue("payment_voucher_number") || "-"}</span>
      ),
    },
    {
      id: "tax_type_name",
      accessorKey: "tax_type_name",
      header: "Tax Type",
      cell: ({ row }: any) => (
        <div className="font-medium">{row.getValue("tax_type_name") || "-"}</div>
      ),
    },
    {
      id: "tax_authority_name",
      accessorKey: "tax_authority_name",
      header: "Tax Authority",
      cell: ({ row }: any) => (
        <div className="text-sm">{row.getValue("tax_authority_name") || "-"}</div>
      ),
    },
    {
      id: "payee_name",
      accessorKey: "payee_name",
      header: "Payee",
      cell: ({ row }: any) => (
        <div className="text-sm max-w-xs truncate">{row.getValue("payee_name") || "-"}</div>
      ),
    },
    {
      id: "taxable_amount",
      accessorKey: "taxable_amount",
      header: "Taxable Amount",
      cell: ({ row }: any) => {
        const amount = row.getValue("taxable_amount");
        return (
          <div className="font-mono text-sm">
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
      id: "tax_amount",
      accessorKey: "tax_amount",
      header: "Tax Amount",
      cell: ({ row }: any) => {
        const amount = row.getValue("tax_amount");
        return (
          <div className="flex items-center font-mono font-medium">
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
      id: "withholding_date",
      accessorKey: "withholding_date",
      header: "Date",
      cell: ({ row }: any) => {
        const date = row.getValue("withholding_date");
        if (!date) return "-";
        return (
          <div className="flex items-center text-sm">
            <Calendar className="w-3 h-3 mr-1 text-gray-400" />
            {new Date(date).toLocaleDateString()}
          </div>
        );
      },
    },
    {
      id: "remittance_status",
      accessorKey: "remittance_status",
      header: "Status",
      cell: ({ row }: any) => {
        const status = row.getValue("remittance_status") as string;
        return (
          <Badge className={`${getRemittanceStatusColor(status)} border-0`}>
            {status || "PENDING"}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }: any) => {
        const withholding = row.original;
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
              {withholding.remittance_status === 'PENDING' && (
                <DropdownMenuItem>
                  <Send className="mr-2 h-4 w-4" />
                  Include in Remittance
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Download className="mr-2 h-4 w-4" />
                Download Certificate
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  // Extract data
  const withholdings = withholdingsData?.data?.results || [];
  const totalCount = withholdingsData?.data?.count || 0;

  // Statistics
  const stats = {
    total: totalCount,
    pending: withholdings.filter((w: any) => w.remittance_status === 'PENDING').length,
    remitted: withholdings.filter((w: any) => w.remittance_status === 'REMITTED').length,
    totalAmount: withholdings.reduce((sum: number, w: any) => sum + (parseFloat(w.tax_amount) || 0), 0),
    pendingAmount: withholdings
      .filter((w: any) => w.remittance_status === 'PENDING')
      .reduce((sum: number, w: any) => sum + (parseFloat(w.tax_amount) || 0), 0),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tax Withholdings</h1>
          <p className="text-gray-600">
            Track and manage tax withholdings from payments
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download size={20} className="mr-2" />
            Export
          </Button>
          <Button>
            <Send size={20} className="mr-2" />
            Prepare Remittance
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
          <div className="text-sm text-gray-600">Total Withholdings</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          <div className="text-sm text-gray-600">Pending</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-green-600">{stats.remitted}</div>
          <div className="text-sm text-gray-600">Remitted</div>
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
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-orange-600">
            {stats.pendingAmount.toLocaleString('en-NG', {
              style: 'currency',
              currency: 'NGN',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0
            })}
          </div>
          <div className="text-sm text-gray-600">Pending Amount</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 p-4 bg-white rounded-lg border">
        <div className="flex items-center space-x-2">
          <Search className="w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search withholdings..."
            className="w-64"
          />
        </div>

        <Select
          value={filters.remittance_status || "all"}
          onValueChange={(value) => handleFilterChange("remittance_status", value === "all" ? undefined : value)}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="INCLUDED">Included</SelectItem>
            <SelectItem value="REMITTED">Remitted</SelectItem>
          </SelectContent>
        </Select>

        {(filters.remittance_status || filters.tax_type_id || filters.tax_authority_id || filters.date_from || filters.date_to) && (
          <Button variant="outline" onClick={clearFilters}>
            Clear Filters
          </Button>
        )}

        <div className="ml-auto flex items-center space-x-2 text-sm text-gray-600">
          <Filter className="w-4 h-4" />
          <span>{totalCount} withholding{totalCount !== 1 ? 's' : ''}</span>
        </div>
      </div>

      {/* Tax Withholdings Table */}
      <Card className="p-6">
        {isLoading ? (
          <div className="text-center py-8">Loading tax withholdings...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-600">
            Error loading tax withholdings. Please try again.
          </div>
        ) : withholdings.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 mx-auto text-gray-400 mb-3" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No Withholdings Yet</h3>
            <p className="text-gray-600 mb-4">Tax withholdings will appear here when payment vouchers are created</p>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={withholdings}
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
