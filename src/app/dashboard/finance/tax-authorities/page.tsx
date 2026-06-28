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
  Building2,
  Mail,
  Phone,
  MapPin,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
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
  useGetTaxAuthorities,
  useDeleteTaxAuthority,
} from "@/features/finance/controllers/taxController";

export default function TaxAuthoritiesPage() {
  const [filters, setFilters] = useState<{
    search?: string;
    is_active?: boolean;
  }>({});

  // Fetch tax authorities from backend
  const { data: authoritiesData, isLoading, error } = useGetTaxAuthorities(filters);
  const deleteTaxAuthority = useDeleteTaxAuthority();

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
    if (confirm("Are you sure you want to delete this tax authority?")) {
      try {
        await deleteTaxAuthority.mutateAsync(id);
        toast.success("Tax authority deleted successfully");
      } catch (error) {
        toast.error("Failed to delete tax authority");
      }
    }
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700';
  };

  // Tax Authorities columns
  const columns = [
    {
      id: "code",
      accessorKey: "code",
      header: "Code",
      cell: ({ row }: any) => (
        <span className="font-mono text-sm font-medium">{row.getValue("code")}</span>
      ),
    },
    {
      id: "name",
      accessorKey: "name",
      header: "Name",
      cell: ({ row }: any) => (
        <div className="font-medium flex items-center">
          <Building2 className="w-4 h-4 mr-2 text-gray-400" />
          {row.getValue("name")}
        </div>
      ),
    },
    {
      id: "contact_email",
      accessorKey: "contact_email",
      header: "Email",
      cell: ({ row }: any) => (
        <div className="flex items-center text-sm">
          <Mail className="w-3 h-3 mr-1 text-gray-400" />
          {row.getValue("contact_email") || "-"}
        </div>
      ),
    },
    {
      id: "contact_phone",
      accessorKey: "contact_phone",
      header: "Phone",
      cell: ({ row }: any) => (
        <div className="flex items-center text-sm">
          <Phone className="w-3 h-3 mr-1 text-gray-400" />
          {row.getValue("contact_phone") || "-"}
        </div>
      ),
    },
    {
      id: "address",
      accessorKey: "address",
      header: "Address",
      cell: ({ row }: any) => (
        <div className="flex items-center text-sm text-gray-600 max-w-xs truncate">
          <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
          {row.getValue("address") || "-"}
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
        const authority = row.original;
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
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => handleDelete(authority.id)}
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
  const authorities = authoritiesData?.data?.results || [];
  const totalCount = authoritiesData?.data?.count || 0;

  // Statistics
  const stats = {
    total: totalCount,
    active: authorities.filter((auth: any) => auth.is_active).length,
    inactive: authorities.filter((auth: any) => !auth.is_active).length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tax Authorities</h1>
          <p className="text-gray-600">
            Manage tax authorities and their contact information
          </p>
        </div>
        <div className="flex space-x-2">
          <Button>
            <Plus size={20} className="mr-2" />
            Add Tax Authority
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
          <div className="text-sm text-gray-600">Total Authorities</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-green-600">{stats.active}</div>
          <div className="text-sm text-gray-600">Active</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-gray-600">{stats.inactive}</div>
          <div className="text-sm text-gray-600">Inactive</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 p-4 bg-white rounded-lg border">
        <div className="flex items-center space-x-2">
          <Search className="w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search authorities..."
            value={filters.search || ""}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-64"
          />
        </div>

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

        {(filters.search || filters.is_active !== undefined) && (
          <Button variant="outline" onClick={clearFilters}>
            Clear Filters
          </Button>
        )}

        <div className="ml-auto flex items-center space-x-2 text-sm text-gray-600">
          <Filter className="w-4 h-4" />
          <span>{totalCount} authorit{totalCount !== 1 ? 'ies' : 'y'}</span>
        </div>
      </div>

      {/* Tax Authorities Table */}
      <Card className="p-6">
        {isLoading ? (
          <div className="text-center py-8">Loading tax authorities...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-600">
            Error loading tax authorities. Please try again.
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={authorities}
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
