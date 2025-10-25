"use client";

import React, { useState } from "react";
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

const FixedAssetsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [isAssetDialogOpen, setIsAssetDialogOpen] = useState(false);
  const [isDisposalDialogOpen, setIsDisposalDialogOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);

  // Mock data for fixed assets
  const assetSummary = {
    totalAssets: 127,
    totalCost: 2450000,
    totalDepreciation: 420000,
    netBookValue: 2030000,
    monthlyDepreciation: 18500,
    assetsAdded: 5,
    assetsDisposed: 2,
  };

  const mockAssets = [
    {
      id: "1",
      assetNumber: "FA-001",
      name: "Office Building",
      category: "Real Estate",
      acquisitionDate: "2020-01-15",
      cost: 850000,
      accumulatedDepreciation: 127500,
      netBookValue: 722500,
      depreciationMethod: "Straight Line",
      usefulLife: 20,
      location: "Main Office",
      status: "Active",
      lastDepreciation: "2024-01-31",
    },
    {
      id: "2",
      assetNumber: "FA-002",
      name: "Production Equipment",
      category: "Machinery",
      acquisitionDate: "2021-06-10",
      cost: 125000,
      accumulatedDepreciation: 31250,
      netBookValue: 93750,
      depreciationMethod: "Double Declining",
      usefulLife: 8,
      location: "Factory Floor",
      status: "Active",
      lastDepreciation: "2024-01-31",
    },
    {
      id: "3",
      assetNumber: "FA-003",
      name: "Company Vehicles",
      category: "Vehicles",
      acquisitionDate: "2022-03-20",
      cost: 45000,
      accumulatedDepreciation: 13500,
      netBookValue: 31500,
      depreciationMethod: "Units of Production",
      usefulLife: 5,
      location: "Fleet",
      status: "Active",
      lastDepreciation: "2024-01-31",
    },
    {
      id: "4",
      assetNumber: "FA-004",
      name: "Old Computer System",
      category: "IT Equipment",
      acquisitionDate: "2018-09-15",
      cost: 25000,
      accumulatedDepreciation: 25000,
      netBookValue: 0,
      depreciationMethod: "Straight Line",
      usefulLife: 5,
      location: "IT Department",
      status: "Fully Depreciated",
      lastDepreciation: "2023-09-15",
    },
  ];

  const mockDepreciationSchedule = [
    {
      id: "1",
      assetNumber: "FA-001",
      assetName: "Office Building",
      period: "Feb 2024",
      depreciationAmount: 3542,
      accumulatedDepreciation: 131042,
      netBookValue: 718958,
      method: "Straight Line",
    },
    {
      id: "2",
      assetNumber: "FA-002",
      assetName: "Production Equipment",
      period: "Feb 2024",
      depreciationAmount: 1953,
      accumulatedDepreciation: 33203,
      netBookValue: 91797,
      method: "Double Declining",
    },
  ];

  const mockDisposals = [
    {
      id: "1",
      assetNumber: "FA-010",
      assetName: "Old Laptop",
      disposalDate: "2024-01-15",
      originalCost: 2500,
      accumulatedDepreciation: 2200,
      netBookValue: 300,
      salePrice: 150,
      gainLoss: -150,
      disposalMethod: "Sale",
      reason: "End of useful life",
    },
  ];

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
    },
    {
      accessorKey: "cost",
      header: "Original Cost",
      cell: ({ row }) => `$${row.getValue("cost").toLocaleString()}`,
    },
    {
      accessorKey: "accumulatedDepreciation",
      header: "Accumulated Depreciation",
      cell: ({ row }) => `$${row.getValue("accumulatedDepreciation").toLocaleString()}`,
    },
    {
      accessorKey: "netBookValue",
      header: "Net Book Value",
      cell: ({ row }) => `$${row.getValue("netBookValue").toLocaleString()}`,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status");
        return (
          <Badge
            variant={status === "Active" ? "default" : status === "Fully Depreciated" ? "secondary" : "destructive"}
          >
            {status}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => setSelectedAsset(row.original)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="outline" onClick={() => {
            setSelectedAsset(row.original);
            setIsDisposalDialogOpen(true);
          }}>
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
              ${assetSummary.netBookValue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Current market value
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
              ${assetSummary.monthlyDepreciation.toLocaleString()}
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
              ${assetSummary.totalDepreciation.toLocaleString()}
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

              <DataTable columns={assetColumns} data={mockAssets} />
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

              <DataTable columns={depreciationColumns} data={mockDepreciationSchedule} />
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
              <DataTable columns={disposalColumns} data={mockDisposals} />
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
    </div>
  );
};

export default FixedAssetsPage;