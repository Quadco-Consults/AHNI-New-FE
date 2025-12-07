"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "components/ui/card";
import { Button } from "components/ui/button";
import { Badge } from "components/ui/badge";
import { Input } from "components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "components/ui/select";
import { Alert, AlertDescription } from "components/ui/alert";
import {
  Package,
  Calendar,
  Search,
  Filter,
  Download,
  ExternalLink,
  TrendingUp,
  FileText,
  DollarSign,
  CheckCircle,
  XCircle,
  Clock
} from "lucide-react";
import { useVendorPurchaseOrders, useVendorOrderSummary, POGRNUtils } from "@/features/vendor-portal/controllers/purchaseOrderController";
import { LoadingSpinner } from "components/Loading";

export default function PurchaseOrderHistoryPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPeriod, setFilterPeriod] = useState("all");
  const [sortBy, setSortBy] = useState("date_desc");

  const { data: orders, isLoading, error } = useVendorPurchaseOrders();
  const { data: orderSummary, isLoading: summaryLoading } = useVendorOrderSummary();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner />
        <span className="ml-2">Loading order history...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <Package className="h-4 w-4" />
        <AlertDescription>
          Failed to load purchase order history. Please try refreshing the page.
        </AlertDescription>
      </Alert>
    );
  }

  // Ensure orders is an array and apply filters and search
  const ordersArray = Array.isArray(orders) ? orders : (orders?.results || []);
  const filteredOrders = ordersArray.filter((order: any) => {
      // Search filter
      const matchesSearch = searchTerm === "" ||
        order.po_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.description?.toLowerCase().includes(searchTerm.toLowerCase());

      // Status filter
      const matchesStatus = filterStatus === "all" || order.status === filterStatus;

      // Period filter
      let matchesPeriod = true;
      if (filterPeriod !== "all") {
        const orderDate = new Date(order.created_at);
        const now = new Date();
        const daysAgo = Math.floor((now.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24));

        switch (filterPeriod) {
          case "30":
            matchesPeriod = daysAgo <= 30;
            break;
          case "90":
            matchesPeriod = daysAgo <= 90;
            break;
          case "180":
            matchesPeriod = daysAgo <= 180;
            break;
          case "365":
            matchesPeriod = daysAgo <= 365;
            break;
        }
      }

      return matchesSearch && matchesStatus && matchesPeriod;
    })
    .sort((a: any, b: any) => {
      switch (sortBy) {
        case "date_desc":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case "date_asc":
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case "value_desc":
          return (b.total_amount || 0) - (a.total_amount || 0);
        case "value_asc":
          return (a.total_amount || 0) - (b.total_amount || 0);
        case "status":
          return (a.status || "").localeCompare(b.status || "");
        default:
          return 0;
      }
    });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
      case 'DELIVERED':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'CANCELLED':
      case 'REJECTED':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-600" />;
    }
  };

  // Calculate summary statistics
  const totalOrders = filteredOrders.length;
  const totalValue = filteredOrders.reduce((sum: number, order: any) => sum + (order.total_amount || 0), 0);
  const completedOrders = filteredOrders.filter((order: any) => ['COMPLETED', 'DELIVERED'].includes(order.status)).length;
  const completionRate = totalOrders > 0 ? Math.round((completedOrders / totalOrders) * 100) : 0;

  const exportToCSV = () => {
    const csvData = filteredOrders.map((order: any) => ({
      'PO Number': order.po_number,
      'Date': formatDate(order.created_at),
      'Status': order.status,
      'Value': order.total_amount,
      'Delivery Date': order.delivery_date ? formatDate(order.delivery_date) : '',
      'Items': order.items?.length || 0
    }));

    // Convert to CSV string
    const headers = Object.keys(csvData[0] || {});
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => headers.map(header => `"${(row as any)[header] || ''}"`).join(','))
    ].join('\n');

    // Download
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `purchase_orders_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Purchase Order History</h1>
          <p className="text-gray-600 mt-1">
            View and analyze your complete order history and performance
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={exportToCSV} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
          <Button onClick={() => router.push('/vendor-portal/orders')}>
            View Active Orders
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
            <p className="text-xs text-muted-foreground">In selected period</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{POGRNUtils.formatCurrency(totalValue)}</div>
            <p className="text-xs text-muted-foreground">Order value</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{completedOrders}</div>
            <p className="text-xs text-muted-foreground">Successfully delivered</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{completionRate}%</div>
            <p className="text-xs text-muted-foreground">Completion rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Filters & Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
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

            {/* Status Filter */}
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="DELIVERED">Delivered</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                <SelectItem value="CONFIRMED">Confirmed</SelectItem>
              </SelectContent>
            </Select>

            {/* Period Filter */}
            <Select value={filterPeriod} onValueChange={setFilterPeriod}>
              <SelectTrigger>
                <SelectValue placeholder="All Time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="30">Last 30 Days</SelectItem>
                <SelectItem value="90">Last 3 Months</SelectItem>
                <SelectItem value="180">Last 6 Months</SelectItem>
                <SelectItem value="365">Last Year</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date_desc">Latest First</SelectItem>
                <SelectItem value="date_asc">Oldest First</SelectItem>
                <SelectItem value="value_desc">Highest Value</SelectItem>
                <SelectItem value="value_asc">Lowest Value</SelectItem>
                <SelectItem value="status">Status</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Order History</CardTitle>
          <CardDescription>
            Showing {filteredOrders.length} orders
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredOrders.length > 0 ? (
            <div className="space-y-3">
              {filteredOrders.map((order: any) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-gray-900">{order.po_number}</h4>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(order.status)}
                        <Badge variant={POGRNUtils.getPOStatusBadgeVariant(order.status)}>
                          {POGRNUtils.getPOStatusDisplayName(order.status)}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>Created: {formatDate(order.created_at)}</span>
                      </div>
                      {order.delivery_date && (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>Delivered: {formatDate(order.delivery_date)}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        <span>{POGRNUtils.formatCurrency(order.total_amount)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Package className="h-3 w-3" />
                        <span>{order.items?.length || 0} items</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/vendor-portal/orders/${order.id}`)}
                      className="flex items-center gap-1"
                    >
                      <ExternalLink className="h-3 w-3" />
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Orders Found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || filterStatus !== "all" || filterPeriod !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "You don't have any purchase orders yet"
                }
              </p>
              <Button onClick={() => router.push('/vendor-portal/rfqs')}>
                Browse Available RFQs
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}