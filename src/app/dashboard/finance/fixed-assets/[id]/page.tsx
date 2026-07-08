"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Calendar,
  DollarSign,
  TrendingDown,
  MapPin,
  Building2,
  Heart,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  useGetFixedAsset,
  useGetDepreciationSchedule,
  useDisposeFixedAsset,
  usePostDepreciationSchedule,
} from "@/features/finance/controllers/fixedAssetController";

export default function FixedAssetDetailPage() {
  const params = useParams();
  const router = useRouter();
  const assetId = params.id as string;

  const [isDisposeDialogOpen, setIsDisposeDialogOpen] = useState(false);
  const [disposeData, setDisposeData] = useState({
    disposal_date: new Date().toISOString().split("T")[0],
    disposal_amount: "",
    notes: "",
  });

  // Fetch data
  const { data: asset, isLoading: assetLoading } = useGetFixedAsset(assetId);
  const { data: scheduleData, isLoading: scheduleLoading } = useGetDepreciationSchedule(assetId);

  // Mutations
  const disposeMutation = useDisposeFixedAsset();
  const postScheduleMutation = usePostDepreciationSchedule();

  if (assetLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading asset details...</p>
        </div>
      </div>
    );
  }

  if (!asset) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <AlertCircle className="h-16 w-16 text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Asset Not Found</h2>
        <p className="text-gray-600 mb-4">The asset you're looking for doesn't exist.</p>
        <Button asChild>
          <Link href="/dashboard/finance/fixed-assets">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Assets
          </Link>
        </Button>
      </div>
    );
  }

  const schedules = scheduleData?.schedules || [];
  const scheduleSummary = scheduleData?.summary;

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

  const handleDispose = async () => {
    try {
      await disposeMutation.mutateAsync({
        id: assetId,
        data: {
          disposal_date: disposeData.disposal_date,
          disposal_amount: disposeData.disposal_amount || undefined,
          notes: disposeData.notes || undefined,
        },
      });
      setIsDisposeDialogOpen(false);
      router.push("/dashboard/finance/fixed-assets");
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handlePostSchedule = async (scheduleId: string) => {
    try {
      await postScheduleMutation.mutateAsync(scheduleId);
    } catch (error) {
      // Error handled by mutation
    }
  };

  const depreciationPercentage = parseFloat(asset.depreciation_percentage || "0");

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href="/dashboard/finance/fixed-assets">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">
              {asset.asset_details?.name || asset.asset_name || "Unnamed Asset"}
            </h1>
            <p className="text-muted-foreground mt-1">
              {asset.asset_code} • {getStatusBadge(asset.status)}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/dashboard/finance/fixed-assets/${assetId}/edit`}>
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Link>
          </Button>
          {asset.status !== "DISPOSED" && (
            <Button
              variant="destructive"
              onClick={() => setIsDisposeDialogOpen(true)}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Dispose
            </Button>
          )}
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Acquisition Cost</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(asset.acquisition_cost, asset.currency)}
            </div>
            <p className="text-xs text-muted-foreground">
              {format(new Date(asset.acquisition_date), "MMM dd, yyyy")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Book Value</CardTitle>
            <TrendingDown className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(asset.net_book_value, asset.currency)}
            </div>
            <p className="text-xs text-muted-foreground">
              Current value
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Accumulated Depreciation</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(asset.accumulated_depreciation, asset.currency)}
            </div>
            <p className="text-xs text-muted-foreground">
              {depreciationPercentage.toFixed(2)}% depreciated
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Depreciation</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(asset.monthly_depreciation || "0", asset.currency)}
            </div>
            <p className="text-xs text-muted-foreground">
              {asset.depreciation_method.replace("_", " ")}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Asset Information */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Asset Information</CardTitle>
            <CardDescription>Basic details about this asset</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-muted-foreground">Asset Code</Label>
              <p className="font-mono text-sm mt-1">{asset.asset_code || "-"}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Asset Type</Label>
              <p className="mt-1">{asset.asset_type || "-"}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Description</Label>
              <p className="mt-1">{asset.asset_details?.description || "-"}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-muted-foreground">Manufacturer</Label>
                <p className="mt-1">{asset.asset_details?.manufacturer || "-"}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Model</Label>
                <p className="mt-1">{asset.asset_details?.model || "-"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Financial Information */}
        <Card>
          <CardHeader>
            <CardTitle>Financial Details</CardTitle>
            <CardDescription>Depreciation and accounting information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-muted-foreground">Depreciation Method</Label>
              <p className="mt-1 capitalize">{asset.depreciation_method.replace("_", " ")}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-muted-foreground">Useful Life</Label>
                <p className="mt-1">
                  {asset.useful_life_years} years
                  {asset.useful_life_months > 0 && ` ${asset.useful_life_months} months`}
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground">Salvage Value</Label>
                <p className="mt-1">{formatCurrency(asset.salvage_value, asset.currency)}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-muted-foreground">Placed in Service</Label>
                <p className="mt-1">{format(new Date(asset.placed_in_service_date), "MMM dd, yyyy")}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Last Depreciation</Label>
                <p className="mt-1">
                  {asset.last_depreciation_date
                    ? format(new Date(asset.last_depreciation_date), "MMM dd, yyyy")
                    : "Never"}
                </p>
              </div>
            </div>
            <div>
              <Label className="text-muted-foreground">Auto Depreciate</Label>
              <p className="mt-1">
                {asset.auto_depreciate ? (
                  <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                ) : (
                  <Badge className="bg-gray-100 text-gray-800">Disabled</Badge>
                )}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* GL Accounts */}
        <Card>
          <CardHeader>
            <CardTitle>GL Accounts</CardTitle>
            <CardDescription>Chart of accounts assignments</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-muted-foreground">Asset Account</Label>
              <p className="mt-1 font-mono text-sm">
                {asset.asset_account_details?.account_code} -{" "}
                {asset.asset_account_details?.account_name}
              </p>
            </div>
            <div>
              <Label className="text-muted-foreground">Accumulated Depreciation</Label>
              <p className="mt-1 font-mono text-sm">
                {asset.accumulated_depreciation_account_details?.account_code} -{" "}
                {asset.accumulated_depreciation_account_details?.account_name}
              </p>
            </div>
            <div>
              <Label className="text-muted-foreground">Depreciation Expense</Label>
              <p className="mt-1 font-mono text-sm">
                {asset.depreciation_expense_account_details?.account_code} -{" "}
                {asset.depreciation_expense_account_details?.account_name}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Location & Project */}
        <Card>
          <CardHeader>
            <CardTitle>Location & Assignment</CardTitle>
            <CardDescription>Where this asset is located and assigned</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-muted-foreground">
                <MapPin className="w-4 h-4 inline mr-1" />
                Location
              </Label>
              <p className="mt-1">{asset.location_details?.name || "Not assigned"}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">
                <Building2 className="w-4 h-4 inline mr-1" />
                Project
              </Label>
              <p className="mt-1">{asset.project_details?.name || "Not assigned"}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">
                <Heart className="w-4 h-4 inline mr-1" />
                Donor/Funding Source
              </Label>
              <p className="mt-1">{asset.donor_details?.name || "Not assigned"}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Depreciation Schedule */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Depreciation Schedule</CardTitle>
              <CardDescription>
                Monthly depreciation history and pending entries
              </CardDescription>
            </div>
            {scheduleSummary && (
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Total Periods</div>
                <div className="text-2xl font-bold">{scheduleSummary.total_periods}</div>
                <div className="text-xs text-muted-foreground">
                  {scheduleSummary.posted_periods} posted, {scheduleSummary.pending_periods} pending
                </div>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {scheduleLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-gray-600">Loading schedule...</p>
              </div>
            </div>
          ) : schedules.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-600 font-medium">No depreciation entries yet</p>
              <p className="text-sm text-gray-500 mt-2">
                Run monthly depreciation to create schedule entries
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Period</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Depreciation</TableHead>
                  <TableHead className="text-right">Accumulated</TableHead>
                  <TableHead className="text-right">Book Value</TableHead>
                  <TableHead>Journal Entry</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {schedules.map((schedule) => (
                  <TableRow key={schedule.id}>
                    <TableCell className="font-medium">
                      {schedule.period_year}/{schedule.period_month.toString().padStart(2, "0")}
                    </TableCell>
                    <TableCell>
                      {format(new Date(schedule.period_date), "MMM dd, yyyy")}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {formatCurrency(schedule.depreciation_amount, asset.currency)}
                    </TableCell>
                    <TableCell className="text-right font-mono text-red-600">
                      {formatCurrency(schedule.accumulated_depreciation, asset.currency)}
                    </TableCell>
                    <TableCell className="text-right font-mono font-semibold">
                      {formatCurrency(schedule.net_book_value, asset.currency)}
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {schedule.journal_entry_number || "-"}
                    </TableCell>
                    <TableCell>
                      {schedule.is_posted ? (
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Posted
                        </Badge>
                      ) : (
                        <Badge className="bg-yellow-100 text-yellow-800">
                          <XCircle className="w-3 h-3 mr-1" />
                          Pending
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {!schedule.is_posted && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePostSchedule(schedule.id)}
                          disabled={postScheduleMutation.isPending}
                        >
                          Post
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Dispose Dialog */}
      <Dialog open={isDisposeDialogOpen} onOpenChange={setIsDisposeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dispose Asset</DialogTitle>
            <DialogDescription>
              Record the disposal of this asset. This will create a disposal journal entry.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="disposal_date">Disposal Date</Label>
              <Input
                id="disposal_date"
                type="date"
                value={disposeData.disposal_date}
                onChange={(e) =>
                  setDisposeData({ ...disposeData, disposal_date: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="disposal_amount">
                Disposal Amount (Optional)
              </Label>
              <Input
                id="disposal_amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={disposeData.disposal_amount}
                onChange={(e) =>
                  setDisposeData({ ...disposeData, disposal_amount: e.target.value })
                }
              />
              <p className="text-xs text-muted-foreground mt-1">
                Amount received if asset was sold
              </p>
            </div>
            <div>
              <Label htmlFor="disposal_notes">Notes</Label>
              <Textarea
                id="disposal_notes"
                placeholder="Reason for disposal..."
                value={disposeData.notes}
                onChange={(e) =>
                  setDisposeData({ ...disposeData, notes: e.target.value })
                }
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDisposeDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDispose}
              disabled={disposeMutation.isPending}
            >
              {disposeMutation.isPending ? "Disposing..." : "Dispose Asset"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
