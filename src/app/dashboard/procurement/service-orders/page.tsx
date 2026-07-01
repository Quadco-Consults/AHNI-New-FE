"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useServiceOrders } from "@/hooks/useServiceOrders";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileText,
  Plus,
  Eye,
  Filter,
  Package,
  Truck,
  Utensils,
  Printer,
  Wifi,
  Building,
  MoreHorizontal,
} from "lucide-react";

export default function ServiceOrdersPage() {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const { data, isLoading, error } = useServiceOrders({ status: statusFilter });

  const getServiceIcon = (serviceType: string) => {
    const icons: Record<string, any> = {
      TRAVEL: Truck,
      COMMUNICATION: Wifi,
      CATERING: Utensils,
      PRINTING: Printer,
      COURIER: Package,
      UTILITIES: Building,
      OTHER: FileText,
    };
    return icons[serviceType] || FileText;
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

  const serviceOrders = data?.data || [];

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Service Orders</h1>
          <p className="text-muted-foreground">
            Manage recurring service orders with known vendors
          </p>
        </div>
        <Button onClick={() => router.push("/dashboard/procurement/service-orders/create")}>
          <Plus className="h-4 w-4 mr-2" />
          Create Service Order
        </Button>
      </div>

      {/* Status Filter Tabs */}
      <Tabs value={statusFilter || "all"} onValueChange={(v) => setStatusFilter(v === "all" ? undefined : v)}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="DRAFT">Draft</TabsTrigger>
          <TabsTrigger value="PENDING">Pending</TabsTrigger>
          <TabsTrigger value="APPROVED">Approved</TabsTrigger>
          <TabsTrigger value="IN_PROGRESS">In Progress</TabsTrigger>
          <TabsTrigger value="COMPLETED">Completed</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Content */}
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      ) : error ? (
        <Alert variant="destructive">
          <AlertDescription>
            Failed to load service orders. Please try again.
          </AlertDescription>
        </Alert>
      ) : serviceOrders.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-muted-foreground py-12">
              <FileText className="mx-auto h-12 w-12 opacity-50 mb-3" />
              <p className="text-lg font-medium">No service orders found</p>
              <p className="text-sm mt-2">
                {statusFilter
                  ? `No service orders with status "${statusFilter}"`
                  : "Create your first service order to get started"}
              </p>
              <Button
                className="mt-4"
                onClick={() => router.push("/dashboard/procurement/service-orders/create")}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Service Order
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {serviceOrders.map((so) => {
            const Icon = getServiceIcon(so.service_type);
            return (
              <Card key={so.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-blue-100">
                        <Icon className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{so.service_order_number}</CardTitle>
                        <CardDescription className="mt-1">
                          {so.service_type_display} • {so.vendor_name || "No vendor"}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge className={getStatusColor(so.status)}>
                      {so.status_display}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Gross Total</p>
                      <p className="text-lg font-semibold">
                        ₦{parseFloat(so.gross_total).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Net Payable</p>
                      <p className="text-lg font-semibold text-green-600">
                        ₦{parseFloat(so.net_payable).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Payment Frequency</p>
                      <p className="text-sm font-medium">{so.payment_frequency_display}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Items</p>
                      <p className="text-sm font-medium">{so.items.length} items</p>
                    </div>
                  </div>

                  {so.service_description && (
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {so.service_description}
                    </p>
                  )}

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      onClick={() => router.push(`/dashboard/procurement/service-orders/${so.id}`)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    {so.is_recurring && (
                      <Badge variant="outline" className="gap-1">
                        Recurring Service
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Summary Stats */}
      {!isLoading && serviceOrders.length > 0 && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Service Orders</CardDescription>
              <CardTitle className="text-3xl">{serviceOrders.length}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Value</CardDescription>
              <CardTitle className="text-3xl text-green-600">
                ₦
                {serviceOrders
                  .reduce((sum, so) => sum + parseFloat(so.net_payable), 0)
                  .toLocaleString()}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Active Orders</CardDescription>
              <CardTitle className="text-3xl text-blue-600">
                {serviceOrders.filter((so) => so.status === "IN_PROGRESS").length}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>
      )}
    </div>
  );
}
