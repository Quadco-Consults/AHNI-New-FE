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
  Percent,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Settings,
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
  useGetTaxTypes,
  useDeleteTaxType,
} from "@/features/finance/controllers/taxController";

export default function TaxTypesPage() {
  const [filters, setFilters] = useState<{
    search?: string;
    category?: string;
    is_active?: boolean;
  }>({});

  // Fetch tax types from backend
  const { data: taxTypesData, isLoading, error } = useGetTaxTypes(filters);
  const deleteTaxType = useDeleteTaxType();

  const handleSearch = (search: string) => {
    setFilters(prev => ({ ...prev, search }));
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this tax type?")) {
      try {
        await deleteTaxType.mutateAsync(id);
        toast.success("Tax type deleted successfully");
      } catch (error) {
        toast.error("Failed to delete tax type");
      }
    }
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700';
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'VAT': return 'bg-purple-100 text-purple-700';
      case 'WHT': return 'bg-orange-100 text-orange-700';
      case 'INCOME_TAX': return 'bg-green-100 text-green-700';
      case 'EXCISE': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  // Tax Types columns
  const columns = [
    {
      id: "code",
      accessorKey: "code",
      header: "Tax Code",
      cell: ({ row }: any) => (
        <span className="font-mono text-sm font-medium">{row.getValue("code")}</span>
      ),
    },
    {
      id: "name",
      accessorKey: "name",
      header: "Name",
      cell: ({ row }: any) => (
        <div className="font-medium">{row.getValue("name")}</div>
      ),
    },
    {
      id: "tax_category",
      accessorKey: "tax_category",
      header: "Category",
      cell: ({ row }: any) => {
        const category = row.getValue("tax_category") as string;
        return (
          <Badge className={`${getCategoryColor(category)} border-0 text-xs`}>
            {category?.replace('_', ' ')}
          </Badge>
        );
      },
    },
    {
      id: "rate",
      accessorKey: "rate",
      header: "Rate",
      cell: ({ row }: any) => (
        <div className="flex items-center space-x-1">
          <Percent className="w-3 h-3" />
          <span className="font-mono">{row.getValue("rate")}%</span>
        </div>
      ),
    },
    {
      id: "description",
      accessorKey: "description",
      header: "Description",
      cell: ({ row }: any) => (
        <div className="text-sm text-gray-600 max-w-xs truncate">
          {row.getValue("description") || "-"}
        </div>
      ),
    },
    {
      id: "is_active",
      accessorKey: "is_active",
      header: "Status",
      cell: ({ row }: any) => {
        const isActive = row.getValue("is_active") as boolean;
        return (
          <Badge className={`${getStatusColor(isActive)} border-0`}>
            {isActive ? "Active" : "Inactive"}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }: any) => {
        const taxType = row.original;
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
              <DropdownMenuItem>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Configure
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => handleDelete(taxType.id)}
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

  // Extract data
  const taxTypes = taxTypesData?.data?.results || [];
  const totalCount = taxTypesData?.data?.count || 0;

  // Statistics
  const stats = {
    total: totalCount,
    active: taxTypes.filter((tt: any) => tt.is_active).length,
    vat: taxTypes.filter((tt: any) => tt.tax_category === 'VAT').length,
    wht: taxTypes.filter((tt: any) => tt.tax_category === 'WHT').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tax Types</h1>
          <p className="text-gray-600">
            Manage tax types, rates, and configurations
          </p>
        </div>
        <div className="flex space-x-2">
          <Button>
            <Plus size={20} className="mr-2" />
            Add Tax Type
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
          <div className="text-sm text-gray-600">Total Tax Types</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-green-600">{stats.active}</div>
          <div className="text-sm text-gray-600">Active</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-purple-600">{stats.vat}</div>
          <div className="text-sm text-gray-600">VAT Types</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-orange-600">{stats.wht}</div>
          <div className="text-sm text-gray-600">WHT Types</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 p-4 bg-white rounded-lg border">
        <div className="flex items-center space-x-2">
          <Search className="w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search tax types..."
            value={filters.search || ""}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-64"
          />
        </div>

        <Select
          value={filters.category || "all"}
          onValueChange={(value) => handleFilterChange("category", value === "all" ? undefined : value)}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="VAT">VAT</SelectItem>
            <SelectItem value="WHT">WHT</SelectItem>
            <SelectItem value="INCOME_TAX">Income Tax</SelectItem>
            <SelectItem value="EXCISE">Excise</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.is_active === undefined ? "all" : filters.is_active.toString()}
          onValueChange={(value) => handleFilterChange("is_active", value === "all" ? undefined : value === "true")}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="true">Active</SelectItem>
            <SelectItem value="false">Inactive</SelectItem>
          </SelectContent>
        </Select>

        {(filters.search || filters.category || filters.is_active !== undefined) && (
          <Button variant="outline" onClick={clearFilters}>
            Clear Filters
          </Button>
        )}

        <div className="ml-auto flex items-center space-x-2 text-sm text-gray-600">
          <Filter className="w-4 h-4" />
          <span>{totalCount} tax type{totalCount !== 1 ? 's' : ''}</span>
        </div>
      </div>

      {/* Tax Types Table */}
      <Card className="p-6">
        {isLoading ? (
          <div className="text-center py-8">Loading tax types...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-600">
            Error loading tax types. Please try again.
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={taxTypes}
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
