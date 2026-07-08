"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  Filter,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  Download,
  FileText,
  AlertCircle,
  BarChart3,
} from "lucide-react";
import { format } from "date-fns";
import {
  useGetFixedAssets,
  useGetFixedAssetStats,
} from "@/features/finance/controllers/fixedAssetController";
import { useGetAllProjects } from "@/features/projects/controllers/projectController";
import { useGetLocationsDropdown } from "@/features/modules/controllers/config/allConfigController";
import { FixedAssetFilters } from "@/features/finance/types/fixed-assets.types";

export default function FixedAssetsPage() {
  const [filters, setFilters] = useState<FixedAssetFilters>({
    search: "",
    status: "all",
    location: "",
    project: "",
    donor: "",
    currency: "all",
    page: 1,
    page_size: 20,
  });

  // Fetch data
  const { data: assetsData, isLoading: assetsLoading } = useGetFixedAssets(filters);
  const { data: stats, isLoading: statsLoading } = useGetFixedAssetStats();
  const { data: projectsData } = useGetAllProjects({ page: 1, size: 100, search: "", enabled: true });
  const { data: locationsData } = useGetLocationsDropdown();

  const assets = assetsData?.results || [];
  const totalAssets = assetsData?.count || 0;

  const projects = projectsData?.data?.results || [];
  const locations = locationsData?.data || [];

  const formatCurrency = (amount: string, currency: string = "NGN") => {
    const symbol = currency === "NGN" ? "₦" : "$";
    const value = parseFloat(amount);
    return `${symbol}${new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)}`;
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; className: string }> = {
      ACTIVE: { label: "Active", className: "bg-green-100 text-green-800" },
      INACTIVE: { label: "Inactive", className: "bg-gray-100 text-gray-800" },
      DISPOSED: { label: "Disposed", className: "bg-red-100 text-red-800" },
      UNDER_MAINTENANCE: { label: "Maintenance", className: "bg-yellow-100 text-yellow-800" },
      RETIRED: { label: "Retired", className: "bg-purple-100 text-purple-800" },
    };

    const config = statusConfig[status] || statusConfig.ACTIVE;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const handleFilterChange = (key: keyof FixedAssetFilters, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: key !== "page" ? 1 : value, // Reset to page 1 when changing filters
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      status: "all",
      location: "",
      project: "",
      donor: "",
      currency: "all",
      page: 1,
      page_size: 20,
    });
  };

  const activeFilterCount = [
    filters.search,
    filters.status !== "all",
    filters.location,
    filters.project,
    filters.donor,
    filters.currency !== "all",
  ].filter(Boolean).length;

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Fixed Assets</h1>
          <p className="text-muted-foreground mt-1">
            Manage and track your organization's fixed assets and depreciation
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/dashboard/finance/fixed-assets/depreciation">
              <BarChart3 className="w-4 h-4 mr-2" />
              Depreciation
            </Link>
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading ? "..." : stats?.total_assets || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats?.active_assets || 0} active assets
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Acquisition Cost</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading ? "..." : formatCurrency(stats?.total_acquisition_cost || "0")}
            </div>
            <p className="text-xs text-muted-foreground">Total investment</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Accumulated Depreciation</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {statsLoading ? "..." : formatCurrency(stats?.total_accumulated_depreciation || "0")}
            </div>
            <p className="text-xs text-muted-foreground">Total depreciated</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Book Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {statsLoading ? "..." : formatCurrency(stats?.total_net_book_value || "0")}
            </div>
            <p className="text-xs text-muted-foreground">Current value</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Filters</CardTitle>
            {activeFilterCount > 0 && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear All ({activeFilterCount})
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-6">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search assets..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            {/* Status */}
            <Select
              value={filters.status as string}
              onValueChange={(value) => handleFilterChange("status", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="INACTIVE">Inactive</SelectItem>
                <SelectItem value="DISPOSED">Disposed</SelectItem>
                <SelectItem value="UNDER_MAINTENANCE">Under Maintenance</SelectItem>
                <SelectItem value="RETIRED">Retired</SelectItem>
              </SelectContent>
            </Select>

            {/* Location */}
            <Select
              value={filters.location || "all"}
              onValueChange={(value) =>
                handleFilterChange("location", value === "all" ? "" : value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {locations.map((loc: any) => (
                  <SelectItem key={loc.id} value={loc.id}>
                    {loc.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Project */}
            <Select
              value={filters.project || "all"}
              onValueChange={(value) =>
                handleFilterChange("project", value === "all" ? "" : value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Project" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Projects</SelectItem>
                {projects.map((project: any) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name || project.project_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Currency */}
            <Select
              value={filters.currency as string}
              onValueChange={(value) => handleFilterChange("currency", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Currencies</SelectItem>
                <SelectItem value="NGN">NGN</SelectItem>
                <SelectItem value="USD">USD</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Assets Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Fixed Assets ({totalAssets})
          </CardTitle>
          <CardDescription>
            List of all fixed assets with depreciation tracking
          </CardDescription>
        </CardHeader>
        <CardContent>
          {assetsLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-gray-600">Loading assets...</p>
              </div>
            </div>
          ) : assets.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-600 font-medium">No assets found</p>
              <p className="text-sm text-gray-500 mt-2">
                {activeFilterCount > 0
                  ? "Try adjusting your filters"
                  : "Assets will appear here when created via AssetRequest approval"}
              </p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Asset Code</TableHead>
                    <TableHead>Asset Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead className="text-right">Acquisition Cost</TableHead>
                    <TableHead className="text-right">Book Value</TableHead>
                    <TableHead className="text-right">Depreciation</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assets.map((asset) => (
                    <TableRow key={asset.id}>
                      <TableCell className="font-mono text-sm">
                        {asset.asset_code || "-"}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{asset.asset_name || "Unnamed Asset"}</div>
                          <div className="text-xs text-gray-500">
                            Since {format(new Date(asset.placed_in_service_date), "MMM dd, yyyy")}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{asset.asset_type || "-"}</TableCell>
                      <TableCell>{asset.location_name || "-"}</TableCell>
                      <TableCell className="text-right font-mono">
                        {formatCurrency(asset.acquisition_cost, asset.currency)}
                      </TableCell>
                      <TableCell className="text-right font-mono font-semibold">
                        {formatCurrency(asset.net_book_value, asset.currency)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="text-sm">
                          <div className="font-mono text-red-600">
                            {formatCurrency(asset.accumulated_depreciation, asset.currency)}
                          </div>
                          <div className="text-xs text-gray-500">
                            {asset.depreciation_percentage}%
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(asset.status)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                        >
                          <Link href={`/dashboard/finance/fixed-assets/${asset.id}`}>
                            View Details
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-gray-600">
                  Showing {assets.length} of {totalAssets} assets
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleFilterChange("page", (filters.page || 1) - 1)}
                    disabled={!assetsData?.previous}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleFilterChange("page", (filters.page || 1) + 1)}
                    disabled={!assetsData?.next}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
