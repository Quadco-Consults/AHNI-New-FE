"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { format } from "date-fns";
import { toast } from "sonner";
import BackNavigation from "components/atoms/BackNavigation";
import { Button } from "components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card";
import { Badge } from "components/ui/badge";
import { Separator } from "components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "components/ui/dialog";
import { Textarea } from "components/ui/textarea";
import { Label } from "components/ui/label";
import {
  useGetSingleFuelConsumption,
  useApproveFuelConsumption,
  useRejectFuelConsumption,
} from "@/features/admin/controllers/fuelConsumptionController";
import { AdminRoutes } from "constants/RouterConstants";
import VehicleFuelHistory from "./_components/VehicleFuelHistory";

export default function FuelConsumptionDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [approvalDialog, setApprovalDialog] = useState(false);
  const [rejectionDialog, setRejectionDialog] = useState(false);
  const [comments, setComments] = useState("");

  const { data: fuelConsumption, isLoading } = useGetSingleFuelConsumption(
    id as string,
    true
  );


  const { approveFuelConsumption, isLoading: isApproving } =
    useApproveFuelConsumption(id as string);

  const { rejectFuelConsumption, isLoading: isRejecting } =
    useRejectFuelConsumption(id as string);

  const handleApprove = async () => {
    try {
      await approveFuelConsumption({ comments });
      toast.success("Fuel consumption approved successfully");
      setApprovalDialog(false);
      setComments("");
      router.refresh();
    } catch (error: any) {
      toast.error(error?.data?.message ?? "Something went wrong");
    }
  };

  const handleReject = async () => {
    try {
      await rejectFuelConsumption({ comments });
      toast.success("Fuel consumption rejected successfully");
      setRejectionDialog(false);
      setComments("");
      router.refresh();
    } catch (error: any) {
      toast.error(error?.data?.message ?? "Something went wrong");
    }
  };


  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!fuelConsumption?.data) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Fuel consumption record not found</p>
      </div>
    );
  }

  const data = fuelConsumption.data;
  const isPending = data.status === "PENDING";

  return (
    <div className="space-y-6">
      <BackNavigation extraText="Fuel Consumption Details" />

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Fuel Consumption Details</h1>
        <div className="flex items-center gap-4">
          <Badge
            variant="default"
            className={cn(
              "p-2 rounded-lg font-medium",
              data.status === "PENDING" && "bg-yellow-100 text-yellow-800 border-yellow-200",
              data.status === "APPROVED" && "bg-green-100 text-green-800 border-green-200",
              data.status === "REJECTED" && "bg-red-100 text-red-800 border-red-200"
            )}
          >
            {data.status}
          </Badge>
          
          {/* Action Buttons */}
          {isPending && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setRejectionDialog(true)}
                disabled={isRejecting}
              >
                Reject
              </Button>
              <Button
                onClick={() => setApprovalDialog(true)}
                disabled={isApproving}
              >
                Approve
              </Button>
            </div>
          )}
        </div>
      </div>

      <Tabs defaultValue="details" className="w-full">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="history">Vehicle History</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Vehicle Information */}
            <Card>
              <CardHeader>
                <CardTitle>Vehicle Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Asset</Label>
                  <p className="mt-1 text-sm font-semibold">{data.asset?.name || "N/A"}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Asset Category</Label>
                  <p className="mt-1 text-sm">{data.asset?.category?.name || "N/A"}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Assigned Driver</Label>
                  <p className="mt-1 text-sm">
                    {data.assigned_driver ? 
                      `${data.assigned_driver.first_name} ${data.assigned_driver.last_name}` : 
                      "N/A"
                    }
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Odometer Reading</Label>
                  <p className="mt-1 text-sm">{data.odometer ? data.odometer.toLocaleString() : 0} km</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Distance Covered</Label>
                  <p className="mt-1 text-sm">{data.distance_covered ? data.distance_covered.toLocaleString() : 0} km</p>
                </div>
              </CardContent>
            </Card>

            {/* Fuel Details */}
            <Card>
              <CardHeader>
                <CardTitle>Fuel Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Date</Label>
                  <p className="mt-1 text-sm">
                    {format(new Date(data.date), "dd MMM yyyy")}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Fuel Coupon</Label>
                  <p className="mt-1 text-sm font-semibold">{data.fuel_coupon}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Quantity</Label>
                  <p className="mt-1 text-sm">{data.quantity ? data.quantity.toLocaleString() : 0} L</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Price per Litre</Label>
                  <p className="mt-1 text-sm">₦{data.price_per_litre ? parseFloat(data.price_per_litre).toLocaleString() : '0'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Total Amount</Label>
                  <p className="mt-1 text-lg font-bold text-green-600">
                    ₦{data.amount ? parseFloat(data.amount).toLocaleString() : '0'}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Location & Vendor */}
            <Card>
              <CardHeader>
                <CardTitle>Location & Vendor</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Location</Label>
                  <p className="mt-1 text-sm">{data.location?.name || "N/A"}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Vendor</Label>
                  <p className="mt-1 text-sm">{data.vendor?.company_name || "N/A"}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">FCO Number</Label>
                  <p className="mt-1 text-sm">{data.fco?.name || "N/A"}</p>
                </div>
              </CardContent>
            </Card>

            {/* Timestamps & Approval Info */}
            <Card>
              <CardHeader>
                <CardTitle>Record Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Created Date</Label>
                  <p className="mt-1 text-sm">
                    {format(new Date(data.created_datetime), "dd MMM yyyy, hh:mm a")}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Last Updated</Label>
                  <p className="mt-1 text-sm">
                    {format(new Date(data.updated_datetime), "dd MMM yyyy, hh:mm a")}
                  </p>
                </div>
                {data.approved_datetime && (
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Approved Date</Label>
                    <p className="mt-1 text-sm text-green-600">
                      {format(new Date(data.approved_datetime), "dd MMM yyyy, hh:mm a")}
                    </p>
                  </div>
                )}
                {data.rejected_datetime && (
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Rejected Date</Label>
                    <p className="mt-1 text-sm text-red-600">
                      {format(new Date(data.rejected_datetime), "dd MMM yyyy, hh:mm a")}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <VehicleFuelHistory
            vehicleId={data.asset?.id || ""}
            vehicleName={data.asset?.name}
            showTitle={false}
          />
        </TabsContent>
      </Tabs>

      {/* Approval Dialog */}
      <Dialog open={approvalDialog} onOpenChange={setApprovalDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Fuel Consumption</DialogTitle>
            <DialogDescription>
              Are you sure you want to approve this fuel consumption record?
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="approval-comments">Comments (Optional)</Label>
              <Textarea
                id="approval-comments"
                placeholder="Add any comments..."
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setApprovalDialog(false);
                setComments("");
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleApprove}
              disabled={isApproving}
            >
              {isApproving ? "Approving..." : "Approve"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rejection Dialog */}
      <Dialog open={rejectionDialog} onOpenChange={setRejectionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Fuel Consumption</DialogTitle>
            <DialogDescription>
              Are you sure you want to reject this fuel consumption record?
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="rejection-comments">Comments (Optional)</Label>
              <Textarea
                id="rejection-comments"
                placeholder="Add rejection reason..."
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setRejectionDialog(false);
                setComments("");
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={isRejecting}
            >
              {isRejecting ? "Rejecting..." : "Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}