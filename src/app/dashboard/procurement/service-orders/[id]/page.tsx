"use client";

import React from "react";
import { useRouter, useParams } from "next/navigation";
import {
  useServiceOrder,
  useApproveServiceOrder,
  useStartServiceOrder,
  useCompleteServiceOrder,
  useCancelServiceOrder,
} from "@/hooks/useServiceOrders";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  ArrowLeft,
  CheckCircle,
  Play,
  X,
  FileText,
  Calendar,
  DollarSign,
  Package,
  User,
  Building2,
  Phone,
  Loader2,
} from "lucide-react";

export default function ServiceOrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const serviceOrderId = params.id as string;

  const { data, isLoading, error } = useServiceOrder(serviceOrderId);
  const approveMutation = useApproveServiceOrder();
  const startMutation = useStartServiceOrder();
  const completeMutation = useCompleteServiceOrder();
  const cancelMutation = useCancelServiceOrder();

  const serviceOrder = data?.data;

  const handleApprove = async () => {
    try {
      await approveMutation.mutateAsync(serviceOrderId);
      toast.success("Service Order approved successfully!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to approve service order");
    }
  };

  const handleStart = async () => {
    try {
      await startMutation.mutateAsync(serviceOrderId);
      toast.success("Service Order started successfully!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to start service order");
    }
  };

  const handleComplete = async () => {
    try {
      await completeMutation.mutateAsync(serviceOrderId);
      toast.success("Service Order completed successfully!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to complete service order");
    }
  };

  const handleCancel = async () => {
    if (!confirm("Are you sure you want to cancel this service order?")) {
      return;
    }
    try {
      await cancelMutation.mutateAsync(serviceOrderId);
      toast.success("Service Order cancelled successfully!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to cancel service order");
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      DRAFT: "bg-gray-100 text-gray-800",
      PENDING: "bg-yellow-100 text-yellow-800",
      APPROVED: "bg-green-100 text-green-800",
      IN_PROGRESS: "bg-blue-100 text-blue-800",
      COMPLETED: "bg-purple-100 text-purple-800",
      CANCELLED: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error || !serviceOrder) {
    return (
      <div className="container mx-auto py-6">
        <Alert variant="destructive">
          <AlertDescription>
            Failed to load service order. Please try again.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {serviceOrder.service_order_number}
            </h1>
            <p className="text-muted-foreground">{serviceOrder.service_type_display}</p>
          </div>
        </div>
        <Badge className={getStatusColor(serviceOrder.status)}>
          {serviceOrder.status_display}
        </Badge>
      </div>

      {/* Action Buttons */}
      <Card>
        <CardHeader>
          <CardTitle>Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 flex-wrap">
            {serviceOrder.status === "PENDING" && (
              <Button
                onClick={handleApprove}
                disabled={approveMutation.isPending}
                className="gap-2"
              >
                {approveMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle className="h-4 w-4" />
                )}
                Approve
              </Button>
            )}

            {serviceOrder.status === "APPROVED" && (
              <Button
                onClick={handleStart}
                disabled={startMutation.isPending}
                className="gap-2"
                variant="outline"
              >
                {startMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
                Start Service
              </Button>
            )}

            {serviceOrder.status === "IN_PROGRESS" && (
              <Button
                onClick={handleComplete}
                disabled={completeMutation.isPending}
                className="gap-2"
              >
                {completeMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle className="h-4 w-4" />
                )}
                Complete
              </Button>
            )}

            {serviceOrder.status !== "COMPLETED" && serviceOrder.status !== "CANCELLED" && (
              <Button
                onClick={handleCancel}
                disabled={cancelMutation.isPending}
                variant="destructive"
                className="gap-2"
              >
                {cancelMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <X className="h-4 w-4" />
                )}
                Cancel
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Service Details */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Service Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Service Type</p>
              <p className="font-medium">{serviceOrder.service_type_display}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Payment Frequency</p>
              <p className="font-medium">{serviceOrder.payment_frequency_display}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Description</p>
              <p className="font-medium">{serviceOrder.service_description}</p>
            </div>
            {serviceOrder.is_recurring && (
              <Badge variant="outline">Recurring Service</Badge>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Vendor Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Vendor</p>
              <p className="font-medium">{serviceOrder.vendor_name || "N/A"}</p>
            </div>
            {serviceOrder.vendor_contact_person && (
              <div>
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Contact Person
                </p>
                <p className="font-medium">{serviceOrder.vendor_contact_person}</p>
              </div>
            )}
            {serviceOrder.vendor_contact_phone && (
              <div>
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Contact Phone
                </p>
                <p className="font-medium">{serviceOrder.vendor_contact_phone}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Dates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Important Dates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Order Date</p>
              <p className="font-medium">
                {new Date(serviceOrder.order_date).toLocaleDateString()}
              </p>
            </div>
            {serviceOrder.service_start_date && (
              <div>
                <p className="text-sm text-muted-foreground">Service Start</p>
                <p className="font-medium">
                  {new Date(serviceOrder.service_start_date).toLocaleDateString()}
                </p>
              </div>
            )}
            {serviceOrder.service_end_date && (
              <div>
                <p className="text-sm text-muted-foreground">Service End</p>
                <p className="font-medium">
                  {new Date(serviceOrder.service_end_date).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Financial Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Financial Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Gross Total:</span>
                <span className="font-medium">
                  ₦{parseFloat(serviceOrder.gross_total).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">WHT (10%):</span>
                <span className="font-medium text-red-600">
                  -₦{parseFloat(serviceOrder.total_wht).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">VAT (7.5%):</span>
                <span className="font-medium text-green-600">
                  +₦{parseFloat(serviceOrder.total_vat).toLocaleString()}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-center border-l pl-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">Net Payable</p>
                <p className="text-3xl font-bold text-green-600">
                  ₦{parseFloat(serviceOrder.net_payable).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {serviceOrder.payment_terms && (
            <>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground">Payment Terms</p>
                <p className="font-medium">{serviceOrder.payment_terms}</p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Service Items */}
      {serviceOrder.items && serviceOrder.items.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Service Items ({serviceOrder.items.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {serviceOrder.items.map((item: any, index: number) => (
                <div key={item.id} className="flex justify-between items-start p-4 border rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">{item.description}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Quantity: {item.quantity} {item.unit_of_measure}
                    </p>
                    {item.notes && (
                      <p className="text-sm text-muted-foreground mt-1">{item.notes}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      ₦{parseFloat(item.total_price).toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      @ ₦{parseFloat(item.unit_price).toLocaleString()}/{item.unit_of_measure}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Additional Information */}
      {(serviceOrder.notes || serviceOrder.assignee_name || serviceOrder.department_name) && (
        <Card>
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {serviceOrder.assignee_name && (
              <div>
                <p className="text-sm text-muted-foreground">Assigned To</p>
                <p className="font-medium">{serviceOrder.assignee_name}</p>
              </div>
            )}
            {serviceOrder.department_name && (
              <div>
                <p className="text-sm text-muted-foreground">Department</p>
                <p className="font-medium">{serviceOrder.department_name}</p>
              </div>
            )}
            {serviceOrder.notes && (
              <div>
                <p className="text-sm text-muted-foreground">Notes</p>
                <p className="font-medium">{serviceOrder.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
