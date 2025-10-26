"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "components/ui/card";
import { Button } from "components/ui/button";
import { Badge } from "components/ui/badge";
import { Alert, AlertDescription } from "components/ui/alert";
import { Input } from "components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
import {
  ShoppingCart,
  Calendar,
  DollarSign,
  Package,
  Clock,
  CheckCircle,
  AlertCircle,
  Search,
  Filter,
  Eye,
  FileText,
  TrendingUp,
  ArrowRight,
  Truck,
  ClipboardCheck
} from "lucide-react";
import {
  useVendorPurchaseOrders,
  useVendorOrderSummary,
  useDeliveryPerformanceMetrics,
  POGRNUtils
} from "@/features/vendor-portal/controllers/purchaseOrderController";
import { POStatus } from "@/features/vendor-portal/types/purchase-orders";
import { LoadingSpinner } from "components/Loading";

export default function VendorOrdersPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<POStatus | "all">("all");
  const [activeTab, setActiveTab] = useState("all");

  const { data: allOrders, isLoading: ordersLoading, error: ordersError } = useVendorPurchaseOrders();
  const { data: orderSummary, isLoading: summaryLoading } = useVendorOrderSummary();
  const { data: performanceMetrics } = useDeliveryPerformanceMetrics();

  if (ordersLoading || summaryLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner />
        <span className="ml-2">Loading purchase orders...</span>
      </div>
    );
  }

  if (ordersError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load purchase orders. Please try refreshing the page.
        </AlertDescription>
      </Alert>
    );
  }

  const filteredOrders = allOrders?.filter((order) => {
    const matchesSearch = order.po_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.delivery_location.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    const matchesTab = activeTab === "all" ||
                      (activeTab === "active" && ['ISSUED', 'ACKNOWLEDGED', 'IN_PROGRESS', 'PARTIALLY_DELIVERED'].includes(order.status)) ||
                      (activeTab === "completed" && ['DELIVERED', 'COMPLETED'].includes(order.status)) ||
                      (activeTab === "overdue" && POGRNUtils.isPOOverdue(order));
    return matchesSearch && matchesStatus && matchesTab;
  }) || [];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusIcon = (status: POStatus) => {
    switch (status) {
      case 'ISSUED':
        return <FileText className="h-4 w-4" />;
      case 'ACKNOWLEDGED':
        return <CheckCircle className="h-4 w-4" />;
      case 'IN_PROGRESS':
        return <Package className="h-4 w-4" />;
      case 'PARTIALLY_DELIVERED':
        return <Truck className="h-4 w-4" />;
      case 'DELIVERED':
        return <CheckCircle className="h-4 w-4" />;
      case 'COMPLETED':
        return <ClipboardCheck className="h-4 w-4" />;
      case 'CANCELLED':
        return <AlertCircle className="h-4 w-4" />;
      case 'DISPUTED':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const overdueOrders = allOrders?.filter(order => POGRNUtils.isPOOverdue(order)) || [];
  const activeOrders = allOrders?.filter(order =>
    ['ISSUED', 'ACKNOWLEDGED', 'IN_PROGRESS', 'PARTIALLY_DELIVERED'].includes(order.status)
  ) || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Purchase Orders</h1>
        <p className="text-gray-600 mt-1">
          Manage your purchase orders and track delivery progress
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-blue-600">{orderSummary?.total_pos || 0}</p>
              </div>
              <ShoppingCart className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Orders</p>
                <p className="text-2xl font-bold text-green-600">{orderSummary?.active_pos || 0}</p>
              </div>
              <Package className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Value</p>
                <p className="text-2xl font-bold text-purple-600">
                  {POGRNUtils.formatCurrency(orderSummary?.total_value || 0)}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Deliveries</p>
                <p className="text-2xl font-bold text-orange-600">{orderSummary?.pending_deliveries || 0}</p>
              </div>
              <Truck className="h-8 w-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Overdue Orders Alert */}
      {overdueOrders.length > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>{overdueOrders.length} order{overdueOrders.length !== 1 ? 's' : ''} overdue.</strong>
            Please update delivery status and contact AHNI procurement if there are delays.
          </AlertDescription>
        </Alert>
      )}

      {/* Performance Metrics */}
      {performanceMetrics && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold text-blue-900">Your Performance</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {Math.round(performanceMetrics.on_time_delivery_rate)}%
                </p>
                <p className="text-sm text-blue-800">On-Time Delivery</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {Math.round(performanceMetrics.quality_score)}/5
                </p>
                <p className="text-sm text-green-800">Quality Score</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">
                  {performanceMetrics.total_deliveries}
                </p>
                <p className="text-sm text-purple-800">Total Deliveries</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-600">
                  {Math.round(performanceMetrics.rejected_items_rate)}%
                </p>
                <p className="text-sm text-orange-800">Rejection Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by PO number or delivery location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="sm:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as POStatus | "all")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="ISSUED">Issued</option>
                <option value="ACKNOWLEDGED">Acknowledged</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="PARTIALLY_DELIVERED">Partially Delivered</option>
                <option value="DELIVERED">Delivered</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
                <option value="DISPUTED">Disputed</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Orders ({allOrders?.length || 0})</TabsTrigger>
          <TabsTrigger value="active">Active ({activeOrders.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({orderSummary?.completed_pos || 0})</TabsTrigger>
          <TabsTrigger value="overdue">Overdue ({overdueOrders.length})</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <Card key={order.id} className={`hover:shadow-md transition-shadow ${
                POGRNUtils.isPOOverdue(order) ? 'border-l-4 border-l-red-500' : ''
              }`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-1">
                          {getStatusIcon(order.status)}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-semibold text-gray-900">
                              PO #{order.po_number}
                            </h3>
                            <Badge
                              variant={POGRNUtils.getPOStatusBadgeVariant(order.status)}
                              className="ml-2 flex-shrink-0"
                            >
                              {POGRNUtils.getPOStatusDisplayName(order.status)}
                            </Badge>
                          </div>

                          <div className="flex flex-wrap items-center gap-4 mb-3 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              Issued: {formatDate(order.issue_date)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Truck className="h-3 w-3" />
                              Delivery: {formatDate(order.delivery_date)}
                            </span>
                            <span className="flex items-center gap-1 font-medium text-green-600">
                              <DollarSign className="h-3 w-3" />
                              {POGRNUtils.formatCurrency(order.total_amount, order.currency)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Package className="h-3 w-3" />
                              {order.line_items.length} item{order.line_items.length !== 1 ? 's' : ''}
                            </span>
                          </div>

                          <div className="mb-3">
                            <p className="text-sm text-gray-600">
                              <strong>Delivery Location:</strong> {order.delivery_location.name}
                            </p>
                            <p className="text-sm text-gray-600">
                              {order.delivery_location.address}
                            </p>
                          </div>

                          {/* Progress Bar */}
                          <div className="mb-3">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm text-gray-600">Completion Progress</span>
                              <span className="text-sm font-medium">
                                {POGRNUtils.calculateCompletionPercentage(order)}%
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: `${POGRNUtils.calculateCompletionPercentage(order)}%` }}
                              ></div>
                            </div>
                          </div>

                          {/* Delivery Status */}
                          {POGRNUtils.isPOOverdue(order) && (
                            <div className="flex items-center gap-1 text-sm text-red-600 mb-2">
                              <AlertCircle className="h-3 w-3" />
                              <span>
                                Overdue by {Math.abs(POGRNUtils.getDaysUntilDelivery(order.delivery_date))} days
                              </span>
                            </div>
                          )}

                          {order.tracking_information && (
                            <div className="bg-blue-50 rounded-lg p-3 mb-3">
                              <p className="text-sm text-blue-800">
                                <strong>Tracking:</strong> {order.tracking_information.carrier} - {order.tracking_information.tracking_number}
                              </p>
                              {order.tracking_information.estimated_delivery && (
                                <p className="text-sm text-blue-700">
                                  Estimated Delivery: {formatDate(order.tracking_information.estimated_delivery)}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 ml-4">
                      <Button
                        onClick={() => router.push(`/vendor-portal/orders/${order.id}`)}
                        size="sm"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </Button>

                      {order.status === 'ISSUED' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/vendor-portal/orders/${order.id}?action=acknowledge`)}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Acknowledge
                        </Button>
                      )}

                      {['ACKNOWLEDGED', 'IN_PROGRESS'].includes(order.status) && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/vendor-portal/orders/${order.id}?action=update`)}
                        >
                          <Truck className="h-4 w-4 mr-1" />
                          Update Status
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="py-16 text-center">
                <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Orders Found</h3>
                <p className="text-gray-500 mb-4">
                  {searchTerm || statusFilter !== "all"
                    ? "Try adjusting your search criteria or filters"
                    : "You don't have any purchase orders yet"}
                </p>
                {(searchTerm || statusFilter !== "all") && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchTerm("");
                      setStatusFilter("all");
                    }}
                  >
                    Clear Filters
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}