"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileText,
  Calendar,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  Search,
  Eye,
  TrendingUp,
  ArrowRight,
  Briefcase,
  Settings
} from "lucide-react";
import {
  useVendorServiceOrders,
  useVendorServiceOrderSummary,
  SOUtils
} from "@/features/vendor-portal/controllers/serviceOrderController";
import { SOStatus } from "@/features/vendor-portal/controllers/serviceOrderController";
import { LoadingSpinner } from "@/components/Loading";

export default function VendorServiceOrdersPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<SOStatus | "all">("all");
  const [activeTab, setActiveTab] = useState("all");

  const { data: allOrdersData, isLoading: ordersLoading, error: ordersError } = useVendorServiceOrders(
    statusFilter === "all" ? undefined : statusFilter
  );
  const { data: orderSummary, isLoading: summaryLoading } = useVendorServiceOrderSummary();

  if (ordersLoading || summaryLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner />
        <span className="ml-2">Loading service orders...</span>
      </div>
    );
  }

  if (ordersError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load service orders. Please try refreshing the page.
        </AlertDescription>
      </Alert>
    );
  }

  const allOrders = allOrdersData?.results || [];

  const filteredOrders = allOrders.filter((order) => {
    const matchesSearch = order.service_order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.service_description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (order.department?.name || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === "all" ||
                      (activeTab === "active" && ['APPROVED', 'AGREED', 'IN_PROGRESS'].includes(order.status)) ||
                      (activeTab === "completed" && order.status === 'COMPLETED') ||
                      (activeTab === "overdue" && SOUtils.isSOOverdue(order));
    return matchesSearch && matchesTab;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusIcon = (status: SOStatus) => {
    switch (status) {
      case 'APPROVED':
        return <FileText className="h-4 w-4" />;
      case 'AGREED':
        return <CheckCircle className="h-4 w-4" />;
      case 'IN_PROGRESS':
        return <Settings className="h-4 w-4" />;
      case 'COMPLETED':
        return <CheckCircle className="h-4 w-4" />;
      case 'CANCELLED':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const overdueOrders = allOrders.filter((order: any) => SOUtils.isSOOverdue(order));
  const activeOrders = allOrders.filter((order: any) =>
    ['APPROVED', 'AGREED', 'IN_PROGRESS'].includes(order.status)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Service Orders</h1>
        <p className="text-gray-600 mt-1">
          Manage your service orders and track service delivery progress
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-blue-600">{orderSummary?.status_counts.total || 0}</p>
              </div>
              <Briefcase className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Orders</p>
                <p className="text-2xl font-bold text-green-600">
                  {(orderSummary?.status_counts.approved || 0) +
                   (orderSummary?.status_counts.agreed || 0) +
                   (orderSummary?.status_counts.in_progress || 0)}
                </p>
              </div>
              <Settings className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Value</p>
                <p className="text-2xl font-bold text-purple-600">
                  {SOUtils.formatCurrency(orderSummary?.financial_summary.total_value || '0')}
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
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-teal-600">{orderSummary?.status_counts.completed || 0}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-teal-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Overdue Orders Alert */}
      {overdueOrders.length > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>{overdueOrders.length} service order{overdueOrders.length !== 1 ? 's' : ''} overdue.</strong>
            Please update service status and contact AHNI procurement if there are delays.
          </AlertDescription>
        </Alert>
      )}

      {/* Pending Acknowledgment Alert */}
      {allOrders.filter(o => o.status === 'APPROVED').length > 0 && (
        <Alert className="border-amber-200 bg-amber-50">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            <strong>{allOrders.filter(o => o.status === 'APPROVED').length} service order{allOrders.filter(o => o.status === 'APPROVED').length !== 1 ? 's' : ''} awaiting acknowledgment.</strong>
            Please review and acknowledge to confirm service terms.
          </AlertDescription>
        </Alert>
      )}

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by SO number, description, or department..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="sm:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as SOStatus | "all")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="APPROVED">Approved</option>
                <option value="AGREED">Acknowledged</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Orders ({allOrders.length})</TabsTrigger>
          <TabsTrigger value="active">Active ({activeOrders.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({orderSummary?.status_counts.completed || 0})</TabsTrigger>
          <TabsTrigger value="overdue">Overdue ({overdueOrders.length})</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <Card key={order.id} className={`hover:shadow-md transition-shadow ${
                SOUtils.isSOOverdue(order) ? 'border-l-4 border-l-red-500' : ''
              } ${
                order.action_required.required ? 'border-l-4 border-l-amber-500' : ''
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
                            <div>
                              <h3 className="font-semibold text-gray-900">
                                SO #{order.service_order_number}
                              </h3>
                              {order.is_new && (
                                <Badge variant="outline" className="ml-2 text-xs">New</Badge>
                              )}
                            </div>
                            <Badge
                              variant={SOUtils.getStatusBadgeVariant(order.status)}
                              className="ml-2 flex-shrink-0"
                              style={{
                                backgroundColor: order.status_info.color === 'green' ? '#10b981' :
                                               order.status_info.color === 'teal' ? '#14b8a6' :
                                               order.status_info.color === 'amber' ? '#f59e0b' :
                                               order.status_info.color === 'red' ? '#ef4444' :
                                               undefined
                              }}
                            >
                              {order.status_info.text}
                            </Badge>
                          </div>

                          <div className="flex flex-wrap items-center gap-4 mb-3 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              Order: {formatDate(order.order_date)}
                            </span>
                            {order.service_start_date && (
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                Start: {formatDate(order.service_start_date)}
                              </span>
                            )}
                            {order.service_end_date && (
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                End: {formatDate(order.service_end_date)}
                              </span>
                            )}
                            <span className="flex items-center gap-1 font-medium text-green-600">
                              <DollarSign className="h-3 w-3" />
                              {SOUtils.formatCurrency(order.net_payable, order.currency)}
                            </span>
                          </div>

                          <div className="mb-3">
                            <p className="text-sm text-gray-600">
                              <strong>Service Type:</strong> {order.service_type_display}
                              {order.is_recurring && <Badge variant="outline" className="ml-2 text-xs">Recurring</Badge>}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              <strong>Description:</strong> {order.service_description}
                            </p>
                            {order.department && (
                              <p className="text-sm text-gray-600 mt-1">
                                <strong>Department:</strong> {order.department.name}
                              </p>
                            )}
                          </div>

                          {/* Financial Summary */}
                          <div className="mb-3 bg-gray-50 rounded-lg p-3">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                              <div>
                                <span className="text-gray-600">Gross Total:</span>
                                <p className="font-medium">{SOUtils.formatCurrency(order.gross_total)}</p>
                              </div>
                              <div>
                                <span className="text-gray-600">VAT:</span>
                                <p className="font-medium">{SOUtils.formatCurrency(order.total_vat)}</p>
                              </div>
                              <div>
                                <span className="text-gray-600">WHT:</span>
                                <p className="font-medium">{SOUtils.formatCurrency(order.total_wht)}</p>
                              </div>
                              <div>
                                <span className="text-gray-600">Net Payable:</span>
                                <p className="font-medium text-green-600">{SOUtils.formatCurrency(order.net_payable)}</p>
                              </div>
                            </div>
                          </div>

                          {/* Items Preview */}
                          {order.items_preview && order.items_preview.length > 0 && (
                            <div className="mb-3">
                              <p className="text-sm font-medium text-gray-700 mb-1">Service Items ({order.items_count}):</p>
                              <ul className="text-sm text-gray-600 space-y-1">
                                {order.items_preview.map((item, idx) => (
                                  <li key={idx} className="flex justify-between">
                                    <span>{item.description}</span>
                                    <span className="text-gray-500">
                                      {item.quantity} × {SOUtils.formatCurrency(item.unit_price)}
                                    </span>
                                  </li>
                                ))}
                                {order.items_count > 3 && (
                                  <li className="text-gray-500 italic">
                                    +{order.items_count - 3} more item{order.items_count - 3 !== 1 ? 's' : ''}
                                  </li>
                                )}
                              </ul>
                            </div>
                          )}

                          {/* Action Required Alert */}
                          {order.action_required.required && (
                            <div className="flex items-center gap-1 text-sm text-amber-600 mb-2 bg-amber-50 p-2 rounded">
                              <AlertCircle className="h-3 w-3" />
                              <span>
                                <strong>Action Required:</strong> {order.action_required.message}
                              </span>
                            </div>
                          )}

                          {/* Overdue Status */}
                          {SOUtils.isSOOverdue(order) && order.service_end_date && (
                            <div className="flex items-center gap-1 text-sm text-red-600 mb-2">
                              <AlertCircle className="h-3 w-3" />
                              <span>
                                Overdue by {Math.abs(SOUtils.getDaysUntilEnd(order.service_end_date))} days
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 ml-4">
                      <Button
                        onClick={() => router.push(`/vendor-portal/service-orders/${order.id}`)}
                        size="sm"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </Button>

                      {order.status === 'APPROVED' && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-amber-50 hover:bg-amber-100 border-amber-300"
                          onClick={() => router.push(`/vendor-portal/service-orders/${order.id}?action=acknowledge`)}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Acknowledge
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
                <Briefcase className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Service Orders Found</h3>
                <p className="text-gray-500 mb-4">
                  {searchTerm || statusFilter !== "all"
                    ? "Try adjusting your search criteria or filters"
                    : "You don't have any service orders yet"}
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
