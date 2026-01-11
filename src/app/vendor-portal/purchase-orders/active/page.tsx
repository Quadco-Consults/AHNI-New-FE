"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import {
  Package,
  Calendar,
  TrendingUp,
  AlertTriangle,
  Search,
  Filter,
  ExternalLink,
  Clock,
  CheckCircle,
  DollarSign
} from "lucide-react";
import { useVendorPurchaseOrders, useVendorOrderSummary, POGRNUtils } from "@/features/vendor-portal/controllers/purchaseOrderController";
import { LoadingSpinner } from "@/components/Loading";

export default function ActivePurchaseOrdersPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const { data: orders, isLoading, error } = useVendorPurchaseOrders();
  const { data: orderSummary, isLoading: summaryLoading } = useVendorOrderSummary();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner />
        <span className="ml-2">Loading active orders...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Failed to load purchase orders. Please try refreshing the page.
        </AlertDescription>
      </Alert>
    );
  }

  // Ensure orders is an array and filter for active orders only
  const ordersArray = Array.isArray(orders) ? orders : (orders?.results || []);
  const activeOrders = ordersArray.filter((order: any) =>
    ['CONFIRMED', 'IN_PROGRESS', 'PARTIALLY_DELIVERED'].includes(order.status)
  );

  // Apply search and status filters
  const filteredOrders = activeOrders.filter((order: any) => {
    const matchesSearch = searchTerm === "" ||
      order.po_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === "all" || order.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getUrgencyLevel = (deliveryDate: string) => {
    const daysUntilDelivery = Math.ceil((new Date(deliveryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    if (daysUntilDelivery < 0) return 'overdue';
    if (daysUntilDelivery <= 3) return 'urgent';
    if (daysUntilDelivery <= 7) return 'high';
    return 'normal';
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'overdue': return 'bg-red-100 text-red-800 border-red-200';
      case 'urgent': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'high': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Active Purchase Orders</h1>
          <p className="text-gray-600 mt-1">
            Manage your current orders and delivery commitments
          </p>
        </div>
        <Button onClick={() => router.push('/vendor-portal/orders')}>
          View All Orders
        </Button>
      </div>

      {/* Summary Cards */}
      {!summaryLoading && orderSummary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{orderSummary.active_pos || 0}</div>
              <p className="text-xs text-muted-foreground">Currently processing</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Value</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{POGRNUtils.formatCurrency(orderSummary.total_value || 0)}</div>
              <p className="text-xs text-muted-foreground">Active order value</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overdue</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{orderSummary.overdue_deliveries || 0}</div>
              <p className="text-xs text-muted-foreground">Require immediate attention</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Delivery</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{orderSummary.pending_deliveries || 0}</div>
              <p className="text-xs text-muted-foreground">Awaiting delivery updates</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by PO number or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterStatus === "all" ? "default" : "outline"}
                onClick={() => setFilterStatus("all")}
                size="sm"
              >
                All
              </Button>
              <Button
                variant={filterStatus === "CONFIRMED" ? "default" : "outline"}
                onClick={() => setFilterStatus("CONFIRMED")}
                size="sm"
              >
                Confirmed
              </Button>
              <Button
                variant={filterStatus === "IN_PROGRESS" ? "default" : "outline"}
                onClick={() => setFilterStatus("IN_PROGRESS")}
                size="sm"
              >
                In Progress
              </Button>
              <Button
                variant={filterStatus === "PARTIALLY_DELIVERED" ? "default" : "outline"}
                onClick={() => setFilterStatus("PARTIALLY_DELIVERED")}
                size="sm"
              >
                Partial
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order: any) => {
            const completionPercentage = POGRNUtils.calculateCompletionPercentage(order);
            const isOverdue = POGRNUtils.isPOOverdue(order);
            const urgency = getUrgencyLevel(order.delivery_date);

            return (
              <Card key={order.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {order.po_number}
                        </h3>
                        <Badge variant={POGRNUtils.getPOStatusBadgeVariant(order.status)}>
                          {POGRNUtils.getPOStatusDisplayName(order.status)}
                        </Badge>
                        {urgency !== 'normal' && (
                          <Badge className={getUrgencyColor(urgency)}>
                            {urgency === 'overdue' ? 'Overdue' :
                             urgency === 'urgent' ? 'Due Soon' :
                             urgency === 'high' ? 'High Priority' : 'Normal'}
                          </Badge>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>Due: {formatDate(order.delivery_date)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          <span>Value: {POGRNUtils.formatCurrency(order.total_amount)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Package className="h-4 w-4" />
                          <span>{order.items?.length || 0} items</span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Completion Progress</span>
                          <span className="font-medium">{completionPercentage}%</span>
                        </div>
                        <Progress value={completionPercentage} className="h-2" />
                      </div>

                      {/* Recent Activity */}
                      <div className="mt-3 text-sm text-gray-600">
                        <p>Last updated: {formatDate(order.updated_at || order.created_at)}</p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 ml-4">
                      <Button
                        size="sm"
                        onClick={() => router.push(`/vendor-portal/orders/${order.id}`)}
                        className="flex items-center gap-1"
                      >
                        <ExternalLink className="h-3 w-3" />
                        View Details
                      </Button>
                      {order.status === 'CONFIRMED' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/vendor-portal/purchase-orders/delivery`)}
                        >
                          Update Delivery
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <Card>
            <CardContent className="text-center py-8">
              <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Orders Found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || filterStatus !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "You don't have any active purchase orders at the moment"
                }
              </p>
              <div className="flex justify-center gap-2">
                <Button onClick={() => router.push('/vendor-portal/orders')}>
                  View All Orders
                </Button>
                <Button variant="outline" onClick={() => router.push('/vendor-portal/rfqs')}>
                  Browse RFQs
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}