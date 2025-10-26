"use client";

import React, { useState, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Search, Plus, Filter, Download, TrendingUp, TrendingDown, DollarSign, Calendar, FileText, Trash2, Edit } from "lucide-react";
import DataTable from "@/components/DataTable";
import { useGetAllItemsQuery } from "@/features/modules/controllers/config/itemController";
import { convertItemToFixedAsset, calculateAssetSummary, generateDepreciationSchedule } from "@/features/finance/utils/depreciation-calculator";
import { FixedAsset, AssetFilters } from "@/features/finance/types/fixed-assets.types";

const FixedAssetsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [isAssetDialogOpen, setIsAssetDialogOpen] = useState(false);
  const [isDisposalDialogOpen, setIsDisposalDialogOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<FixedAsset | null>(null);
  const [page, setPage] = useState(1);
  const [isAssetDetailDialogOpen, setIsAssetDetailDialogOpen] = useState(false);

  // Fetch assets from admin module
  const { data: assetsData, isLoading } = useGetAllItemsQuery({
    page,
    size: 50,
    search: searchTerm,
    expand: "category,assignee,asset_type,project,donor,asset_condition,location,classification,implementer",
  });

  // Convert admin assets to fixed assets with financial calculations
  const fixedAssets = useMemo(() => {
    if (!assetsData?.data?.results) return [];
    return assetsData.data.results.map(item => convertItemToFixedAsset(item));
  }, [assetsData]);

  // Filter assets based on current filters
  const filteredAssets = useMemo(() => {
    return fixedAssets.filter(asset => {
      if (selectedCategory !== "all") {
        const categoryName = typeof asset.category === "string"
          ? asset.category
          : asset.category?.name || "";
        if (!categoryName.toLowerCase().includes(selectedCategory.toLowerCase())) {
          return false;
        }
      }

      if (selectedStatus !== "all") {
        if (selectedStatus === "active" && asset.assetStatus !== "active") return false;
        if (selectedStatus === "fully-depreciated" && !asset.isFullyDepreciated) return false;
        if (selectedStatus === "disposed" && asset.assetStatus !== "disposed") return false;
      }

      return true;
    });
  }, [fixedAssets, selectedCategory, selectedStatus]);

  // Calculate summary from real data
  const assetSummary = useMemo(() => {
    return calculateAssetSummary(filteredAssets);
  }, [filteredAssets]);

  // Generate depreciation schedule for current month
  const currentDepreciationSchedule = useMemo(() => {
    const currentDate = new Date();
    const currentPeriod = currentDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });

    return filteredAssets
      .filter(asset => !asset.isFullyDepreciated)
      .slice(0, 10) // Limit to first 10 for performance
      .map(asset => ({
        id: asset.id,
        assetNumber: asset.assetNumber,
        assetName: asset.name,
        period: currentPeriod,
        depreciationAmount: Math.round(asset.monthlyDepreciation),
        accumulatedDepreciation: Math.round(asset.accumulatedDepreciation + asset.monthlyDepreciation),
        netBookValue: Math.round(asset.currentBookValue - asset.monthlyDepreciation),
        method: asset.depreciationMethod.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      }));
  }, [filteredAssets]);

  // Get disposed assets (for now, using mock data since we don't have disposal tracking yet)
  const disposedAssets = useMemo(() => {
    return filteredAssets
      .filter(asset => asset.assetStatus === "disposed" || asset.isFullyDepreciated)
      .slice(0, 5) // Limit for demo
      .map(asset => ({
        id: asset.id,
        assetNumber: asset.assetNumber,
        assetName: asset.name,
        disposalDate: new Date().toISOString().split('T')[0], // Mock disposal date
        originalCost: asset.originalCost,
        accumulatedDepreciation: asset.accumulatedDepreciation,
        netBookValue: asset.currentBookValue,
        salePrice: asset.currentBookValue * 0.6, // Mock sale price
        gainLoss: (asset.currentBookValue * 0.6) - asset.currentBookValue,
        disposalMethod: "Sale",
        reason: asset.isFullyDepreciated ? "Fully depreciated" : "End of useful life",
      }));
  }, [filteredAssets]);

  const assetColumns = [
    {
      accessorKey: "assetNumber",
      header: "Asset #",
    },
    {
      accessorKey: "name",
      header: "Asset Name",
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => {
        const asset = row.original as FixedAsset;
        const categoryName = typeof asset.category === "string"
          ? asset.category
          : asset.category?.name || "N/A";
        return categoryName;
      },
    },
    {
      accessorKey: "originalCost",
      header: "Original Cost",
      cell: ({ row }) => {
        const cost = row.getValue("originalCost") as number;
        return `$${cost.toLocaleString()}`;
      },
    },
    {
      accessorKey: "accumulatedDepreciation",
      header: "Accumulated Depreciation",
      cell: ({ row }) => {
        const depreciation = row.getValue("accumulatedDepreciation") as number;
        return `$${depreciation.toLocaleString()}`;
      },
    },
    {
      accessorKey: "currentBookValue",
      header: "Net Book Value",
      cell: ({ row }) => {
        const bookValue = row.getValue("currentBookValue") as number;
        return `$${bookValue.toLocaleString()}`;
      },
    },
    {
      accessorKey: "currentLocation",
      header: "Location",
    },
    {
      accessorKey: "assetStatus",
      header: "Status",
      cell: ({ row }) => {
        const asset = row.original as FixedAsset;
        const status = asset.assetStatus;
        const isFullyDepreciated = asset.isFullyDepreciated;

        let variant: "default" | "secondary" | "destructive" = "default";
        let displayStatus = status;

        if (isFullyDepreciated) {
          variant = "secondary";
          displayStatus = "Fully Depreciated";
        } else if (status === "active") {
          variant = "default";
          displayStatus = "Active";
        } else if (status === "disposed") {
          variant = "destructive";
          displayStatus = "Disposed";
        }

        return (
          <Badge variant={variant}>
            {displayStatus}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setSelectedAsset(row.original as FixedAsset);
              setIsAssetDetailDialogOpen(true);
            }}
            title="View Details"
          >
            <FileText className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setSelectedAsset(row.original as FixedAsset)}
            title="Edit Asset"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setSelectedAsset(row.original as FixedAsset);
              setIsDisposalDialogOpen(true);
            }}
            title="Dispose Asset"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  const depreciationColumns = [
    {
      accessorKey: "assetNumber",
      header: "Asset #",
    },
    {
      accessorKey: "assetName",
      header: "Asset Name",
    },
    {
      accessorKey: "period",
      header: "Period",
    },
    {
      accessorKey: "depreciationAmount",
      header: "Depreciation Amount",
      cell: ({ row }) => `$${row.getValue("depreciationAmount").toLocaleString()}`,
    },
    {
      accessorKey: "method",
      header: "Method",
    },
    {
      accessorKey: "netBookValue",
      header: "Net Book Value",
      cell: ({ row }) => `$${row.getValue("netBookValue").toLocaleString()}`,
    },
  ];

  const disposalColumns = [
    {
      accessorKey: "assetNumber",
      header: "Asset #",
    },
    {
      accessorKey: "assetName",
      header: "Asset Name",
    },
    {
      accessorKey: "disposalDate",
      header: "Disposal Date",
    },
    {
      accessorKey: "salePrice",
      header: "Sale Price",
      cell: ({ row }) => `$${row.getValue("salePrice").toLocaleString()}`,
    },
    {
      accessorKey: "gainLoss",
      header: "Gain/Loss",
      cell: ({ row }) => {
        const value = row.getValue("gainLoss");
        return (
          <span className={value >= 0 ? "text-green-600" : "text-red-600"}>
            ${Math.abs(value).toLocaleString()}
          </span>
        );
      },
    },
    {
      accessorKey: "disposalMethod",
      header: "Method",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Fixed Assets</h1>
          <p className="text-muted-foreground">
            Manage and track your company's fixed assets, depreciation, and disposals
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
          <Dialog open={isAssetDialogOpen} onOpenChange={setIsAssetDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Asset
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Add New Fixed Asset</DialogTitle>
                <DialogDescription>
                  Enter the details for the new fixed asset
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="assetNumber">Asset Number</Label>
                  <Input id="assetNumber" placeholder="FA-XXX" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="assetName">Asset Name</Label>
                  <Input id="assetName" placeholder="Enter asset name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="real-estate">Real Estate</SelectItem>
                      <SelectItem value="machinery">Machinery</SelectItem>
                      <SelectItem value="vehicles">Vehicles</SelectItem>
                      <SelectItem value="it-equipment">IT Equipment</SelectItem>
                      <SelectItem value="furniture">Furniture</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="acquisitionDate">Acquisition Date</Label>
                  <Input id="acquisitionDate" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cost">Original Cost</Label>
                  <Input id="cost" type="number" placeholder="0.00" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="usefulLife">Useful Life (Years)</Label>
                  <Input id="usefulLife" type="number" placeholder="5" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="depreciationMethod">Depreciation Method</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="straight-line">Straight Line</SelectItem>
                      <SelectItem value="double-declining">Double Declining Balance</SelectItem>
                      <SelectItem value="units-production">Units of Production</SelectItem>
                      <SelectItem value="sum-years">Sum of Years Digits</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" placeholder="Asset location" />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Asset description and notes" />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setIsAssetDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsAssetDialogOpen(false)}>
                  Add Asset
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{assetSummary.totalAssets}</div>
            <p className="text-xs text-muted-foreground">
              +{assetSummary.assetsAdded} this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Book Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${Math.round(assetSummary.totalCurrentBookValue).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Current book value
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Depreciation</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${Math.round(assetSummary.monthlyDepreciation).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              This month's depreciation
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Depreciation</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${Math.round(assetSummary.totalAccumulatedDepreciation).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Accumulated to date
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="assets" className="space-y-4">
        <TabsList>
          <TabsTrigger value="assets">Asset Register</TabsTrigger>
          <TabsTrigger value="depreciation">Depreciation Schedule</TabsTrigger>
          <TabsTrigger value="disposals">Asset Disposals</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="assets" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Fixed Assets Register</CardTitle>
              <CardDescription>
                Complete list of all fixed assets with their current values
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search assets..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="real-estate">Real Estate</SelectItem>
                    <SelectItem value="machinery">Machinery</SelectItem>
                    <SelectItem value="vehicles">Vehicles</SelectItem>
                    <SelectItem value="it-equipment">IT Equipment</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="fully-depreciated">Fully Depreciated</SelectItem>
                    <SelectItem value="disposed">Disposed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <DataTable
                columns={assetColumns}
                data={filteredAssets}
                isLoading={isLoading}
                pagination={{
                  total: assetsData?.data?.pagination?.count ?? 0,
                  pageSize: assetsData?.data?.pagination?.page_size ?? 0,
                  onChange: (page: number) => setPage(page),
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="depreciation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Depreciation Schedule</CardTitle>
              <CardDescription>
                Monthly depreciation calculations for all assets
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Previous Month
                  </Button>
                  <Button variant="outline" size="sm">
                    Next Month
                  </Button>
                </div>
                <Button>
                  Run Depreciation
                </Button>
              </div>

              <DataTable columns={depreciationColumns} data={currentDepreciationSchedule} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="disposals" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Asset Disposals</CardTitle>
                  <CardDescription>
                    Track assets that have been sold, retired, or disposed of
                  </CardDescription>
                </div>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Record Disposal
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <DataTable columns={disposalColumns} data={disposedAssets} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Asset Reports</CardTitle>
                <CardDescription>Generate comprehensive asset reports</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full justify-start">
                  <FileText className="mr-2 h-4 w-4" />
                  Fixed Asset Register Report
                </Button>
                <Button className="w-full justify-start">
                  <TrendingDown className="mr-2 h-4 w-4" />
                  Depreciation Summary Report
                </Button>
                <Button className="w-full justify-start">
                  <Calendar className="mr-2 h-4 w-4" />
                  Asset Acquisition Report
                </Button>
                <Button className="w-full justify-start">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Asset Disposal Report
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Compliance Reports</CardTitle>
                <CardDescription>Tax and regulatory compliance reports</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full justify-start">
                  <FileText className="mr-2 h-4 w-4" />
                  Tax Depreciation Schedule
                </Button>
                <Button className="w-full justify-start">
                  <DollarSign className="mr-2 h-4 w-4" />
                  Asset Valuation Report
                </Button>
                <Button className="w-full justify-start">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Capital Expenditure Report
                </Button>
                <Button className="w-full justify-start">
                  <Calendar className="mr-2 h-4 w-4" />
                  Asset Age Analysis
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Asset Disposal Dialog */}
      <Dialog open={isDisposalDialogOpen} onOpenChange={setIsDisposalDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Record Asset Disposal</DialogTitle>
            <DialogDescription>
              Record the disposal of {selectedAsset?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="disposalDate">Disposal Date</Label>
              <Input id="disposalDate" type="date" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="disposalMethod">Disposal Method</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sale">Sale</SelectItem>
                  <SelectItem value="scrap">Scrap</SelectItem>
                  <SelectItem value="donation">Donation</SelectItem>
                  <SelectItem value="retirement">Retirement</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="salePrice">Sale Price</Label>
              <Input id="salePrice" type="number" placeholder="0.00" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reason">Reason for Disposal</Label>
              <Textarea id="reason" placeholder="Reason for disposing of this asset" />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsDisposalDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsDisposalDialogOpen(false)}>
              Record Disposal
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Asset Detail Dialog */}
      <Dialog open={isAssetDetailDialogOpen} onOpenChange={setIsAssetDetailDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Asset Details - {selectedAsset?.name}</DialogTitle>
            <DialogDescription>
              Complete financial and operational details for {selectedAsset?.assetNumber}
            </DialogDescription>
          </DialogHeader>

          {selectedAsset && (
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Basic Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Asset Number</Label>
                        <p className="text-sm">{selectedAsset.assetNumber}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Asset Name</Label>
                        <p className="text-sm">{selectedAsset.name}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Category</Label>
                        <p className="text-sm">
                          {typeof selectedAsset.category === "string"
                            ? selectedAsset.category
                            : selectedAsset.category?.name || "N/A"}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Asset Type</Label>
                        <p className="text-sm">
                          {typeof selectedAsset.asset_type === "string"
                            ? selectedAsset.asset_type
                            : selectedAsset.asset_type?.name || "N/A"}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Current Location</Label>
                        <p className="text-sm">{selectedAsset.currentLocation || "N/A"}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Project</Label>
                        <p className="text-sm">{selectedAsset.assignedProject || "N/A"}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Financial Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Original Cost</Label>
                        <p className="text-lg font-semibold">${selectedAsset.originalCost.toLocaleString()}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Current Book Value</Label>
                        <p className="text-lg font-semibold text-green-600">
                          ${selectedAsset.currentBookValue.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Accumulated Depreciation</Label>
                        <p className="text-lg font-semibold text-red-600">
                          ${selectedAsset.accumulatedDepreciation.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Monthly Depreciation</Label>
                        <p className="text-lg font-semibold">
                          ${selectedAsset.monthlyDepreciation.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="pt-2">
                      <Label className="text-sm font-medium text-gray-600">Status</Label>
                      <div className="mt-1">
                        <Badge
                          variant={
                            selectedAsset.isFullyDepreciated
                              ? "secondary"
                              : selectedAsset.assetStatus === "active"
                              ? "default"
                              : "destructive"
                          }
                        >
                          {selectedAsset.isFullyDepreciated
                            ? "Fully Depreciated"
                            : selectedAsset.assetStatus === "active"
                            ? "Active"
                            : selectedAsset.assetStatus}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Depreciation Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Depreciation Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Depreciation Method</Label>
                      <p className="text-sm capitalize">
                        {selectedAsset.depreciationMethod.replace('_', ' ')}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Useful Life</Label>
                      <p className="text-sm">{selectedAsset.usefulLifeYears} years</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Depreciation Rate</Label>
                      <p className="text-sm">{selectedAsset.depreciationRate.toFixed(2)}%</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Acquisition Date</Label>
                      <p className="text-sm">
                        {new Date(selectedAsset.acquisitionDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Years in Service</Label>
                      <p className="text-sm">
                        {(
                          (new Date().getTime() - new Date(selectedAsset.acquisitionDate).getTime()) /
                          (1000 * 3600 * 24 * 365.25)
                        ).toFixed(1)} years
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Yearly Depreciation</Label>
                      <p className="text-sm">${selectedAsset.yearlyDepreciation.toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Additional Asset Details */}
              {(selectedAsset.serial_number || selectedAsset.plate_number || selectedAsset.chasis_number) && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Asset Identifiers</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4">
                      {selectedAsset.serial_number && (
                        <div>
                          <Label className="text-sm font-medium text-gray-600">Serial Number</Label>
                          <p className="text-sm">{selectedAsset.serial_number}</p>
                        </div>
                      )}
                      {selectedAsset.plate_number && (
                        <div>
                          <Label className="text-sm font-medium text-gray-600">Plate Number</Label>
                          <p className="text-sm">{selectedAsset.plate_number}</p>
                        </div>
                      )}
                      {selectedAsset.chasis_number && (
                        <div>
                          <Label className="text-sm font-medium text-gray-600">Chassis Number</Label>
                          <p className="text-sm">{selectedAsset.chasis_number}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Depreciation Schedule Preview */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Depreciation Schedule (Next 12 Months)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="max-h-64 overflow-y-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2">Period</th>
                          <th className="text-right p-2">Opening Value</th>
                          <th className="text-right p-2">Depreciation</th>
                          <th className="text-right p-2">Closing Value</th>
                        </tr>
                      </thead>
                      <tbody>
                        {generateDepreciationSchedule(selectedAsset, 12).map((schedule, index) => (
                          <tr key={index} className="border-b">
                            <td className="p-2">{schedule.period}</td>
                            <td className="text-right p-2">${schedule.openingBookValue.toLocaleString()}</td>
                            <td className="text-right p-2">${schedule.depreciationAmount.toLocaleString()}</td>
                            <td className="text-right p-2">${schedule.closingBookValue.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={() => setIsAssetDetailDialogOpen(false)}>
              Close
            </Button>
            <Button
              onClick={() => {
                setIsAssetDetailDialogOpen(false);
                setIsDisposalDialogOpen(true);
              }}
            >
              Dispose Asset
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FixedAssetsPage;