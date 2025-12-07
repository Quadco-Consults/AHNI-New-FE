"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "components/ui/card";
import { Button } from "components/ui/button";
import { Badge } from "components/ui/badge";
import { Input } from "components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "components/ui/select";
import { Alert, AlertDescription } from "components/ui/alert";
import {
  Package,
  Calendar,
  DollarSign,
  Truck,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  ArrowRight
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useVendorPurchaseOrders, POGRNUtils } from "@/features/vendor-portal/controllers/purchaseOrderController";
import { LoadingSpinner } from "components/Loading";

export default function VendorPurchaseOrdersPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");

  const { data: purchaseOrders, isLoading, error } = useVendorPurchaseOrders({
    status: statusFilter || undefined
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const filteredOrders = purchaseOrders?.filter(order =>
    order.po_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    searchTerm === ""
  ) || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner />
        <span className="ml-2">Loading purchase orders...</span>
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Purchase Orders</h1>
        <p className="text-gray-600 mt-1">
          Manage your purchase orders and delivery schedules
        </p>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by PO number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="sm:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Status</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                  <SelectItem value="PARTIALLY_DELIVERED">Partially Delivered</SelectItem>
                  <SelectItem value="DELIVERED">Delivered</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Purchase Orders List */}
      <div className="space-y-4">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => {
            const completionPercentage = POGRNUtils.calculateCompletionPercentage(order);
            const isOverdue = POGRNUtils.isPOOverdue(order);

            return (
              <Card
                key={order.id}
                className={`hover:shadow-md transition-shadow cursor-pointer ${
                  isOverdue ? 'border-red-200 bg-red-50' : ''
                }`}
                onClick={() => router.push(`/vendor-portal/orders/${order.id}`)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Package className="h-5 w-5 text-blue-600" />
                        <h3 className="text-lg font-semibold text-gray-900">
                          {order.po_number}
                        </h3>
                        <Badge variant={POGRNUtils.getPOStatusBadgeVariant(order.status)}>
                          {POGRNUtils.getPOStatusDisplayName(order.status)}
                        </Badge>
                        {isOverdue && (
                          <Badge variant="destructive" className="text-xs">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Overdue
                          </Badge>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <DollarSign className="h-4 w-4" />
                          <span>Value: {POGRNUtils.formatCurrency(order.total_amount)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="h-4 w-4" />
                          <span>Delivery: {formatDate(order.delivery_date)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <FileText className="h-4 w-4" />
                          <span>{order.items?.length || 0} items</span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">
                            Delivery Progress
                          </span>
                          <span className="text-sm text-gray-500">
                            {completionPercentage}% complete
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all ${
                              completionPercentage === 100 ? 'bg-green-500' :
                              completionPercentage >= 50 ? 'bg-blue-500' : 'bg-gray-400'
                            }`}
                            style={{ width: `${completionPercentage}%` }}
                          />
                        </div>
                      </div>

                      <div className="text-xs text-gray-500">
                        Created: {formatDate(order.created_date)}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 ml-4">
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/vendor-portal/orders/${order.id}`);
                        }}
                        size="sm"
                      >
                        View Details
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </Button>

                      {order.status === 'IN_PROGRESS' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Handle delivery update
                          }}
                        >
                          <Truck className="h-4 w-4 mr-1" />
                          Update Delivery
                        </Button>
                      )}
                    </div>
                  </div>

                  {isOverdue && (
                    <Alert variant="destructive" className="mt-4">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        This order is overdue. Please update delivery status or contact procurement immediately.
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            );
          })
        ) : (
          <Card>
            <CardContent className="py-16 text-center">
              <Package className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Purchase Orders Found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || statusFilter
                  ? "Try adjusting your search criteria or filters"
                  : "You don't have any purchase orders yet. Orders will appear here when issued."}
              </p>
              {(searchTerm || statusFilter) && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("");
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Summary Statistics */}
      {filteredOrders.length > 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-900">Order Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{filteredOrders.length}</p>
                <p className="text-sm text-blue-800">Total Orders</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-600">
                  {filteredOrders.filter(order => POGRNUtils.isPOOverdue(order)).length}
                </p>
                <p className="text-sm text-orange-800">Overdue</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {filteredOrders.filter(order => order.status === 'COMPLETED').length}
                </p>
                <p className="text-sm text-green-800">Completed</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">
                  {POGRNUtils.formatCurrency(
                    filteredOrders.reduce((sum, order) => sum + order.total_amount, 0)
                  )}
                </p>
                <p className="text-sm text-purple-800">Total Value</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}