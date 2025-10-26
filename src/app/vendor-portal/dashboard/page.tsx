"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "components/ui/card";
import { Button } from "components/ui/button";
import { Badge } from "components/ui/badge";
import { Alert, AlertDescription } from "components/ui/alert";
import {
  FileText,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Building2,
  Calendar,
  DollarSign,
  Package,
  Truck,
  Star,
  AlertTriangle
} from "lucide-react";
import { VendorAuthUtils, useVendorProfile } from "@/features/vendor-portal/controllers/vendorAuthController";
import { useVendorDashboardStats, useVendorAvailableRFQs } from "@/features/vendor-portal/controllers/vendorDashboardController";
import { useVendorOrderSummary, useVendorPurchaseOrders, useVendorGRNs, POGRNUtils } from "@/features/vendor-portal/controllers/purchaseOrderController";
import VendorNotifications from "@/features/vendor-portal/components/VendorNotifications";
import { LoadingSpinner } from "components/Loading";

export default function VendorDashboardPage() {
  const router = useRouter();
  const { data: vendorProfile, isLoading: profileLoading, error: profileError } = useVendorProfile();
  const { data: dashboardStats, isLoading: statsLoading } = useVendorDashboardStats();
  const { data: availableRFQs, isLoading: rfqsLoading } = useVendorAvailableRFQs();

  // PO and GRN data
  const { data: orderSummary, isLoading: orderSummaryLoading } = useVendorOrderSummary();
  const { data: recentPOs, isLoading: recentPOsLoading } = useVendorPurchaseOrders();
  const { data: recentGRNs, isLoading: recentGRNsLoading } = useVendorGRNs();

  useEffect(() => {
    // Redirect if not authenticated
    if (!VendorAuthUtils.isVendorAuthenticated()) {
      router.push('/vendor-portal/login');
    }
  }, [router]);

  if (profileLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner />
        <span className="ml-2">Loading dashboard...</span>
      </div>
    );
  }

  if (profileError || !vendorProfile) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load vendor profile. Please try refreshing the page.
        </AlertDescription>
      </Alert>
    );
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'default';
      case 'PENDING':
        return 'secondary';
      case 'REJECTED':
        return 'destructive';
      case 'SUSPENDED':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome, {vendorProfile.company_name}
          </h1>
          <p className="text-gray-600 mt-1">
            Manage your RFQ submissions and track your performance
          </p>
        </div>
        <Badge variant={getStatusBadgeVariant(vendorProfile.status)} className="text-sm">
          {vendorProfile.status}
        </Badge>
      </div>

      {/* Status Alert for non-approved vendors */}
      {vendorProfile.status !== 'APPROVED' && (
        <Alert className={vendorProfile.status === 'REJECTED' ? "border-red-200 bg-red-50" : "border-yellow-200 bg-yellow-50"}>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {vendorProfile.status === 'PENDING' && (
              "Your vendor registration is under review. You'll be notified once approved to access RFQs."
            )}
            {vendorProfile.status === 'REJECTED' && (
              "Your vendor registration was not approved. Contact support for more information."
            )}
            {vendorProfile.status === 'SUSPENDED' && (
              "Your vendor account is currently suspended. Contact support to resolve this issue."
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available RFQs</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading ? "..." : dashboardStats?.total_rfqs_available || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Open for submission
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Submitted Bids</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {vendorProfile.submitted_bids}
            </div>
            <p className="text-xs text-muted-foreground">
              Total submissions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Evaluations</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading ? "..." : dashboardStats?.pending_evaluations || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Under review
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Awarded Contracts</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {vendorProfile.awarded_contracts}
            </div>
            <p className="text-xs text-muted-foreground">
              Successful bids
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {orderSummaryLoading ? "..." : orderSummary?.active_pos || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Purchase orders
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {orderSummaryLoading ? "..." : orderSummary ? POGRNUtils.formatCurrency(orderSummary.total_value) : "$0"}
            </div>
            <p className="text-xs text-muted-foreground">
              Order value
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Available RFQs */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Available RFQs</CardTitle>
              <CardDescription>
                New procurement opportunities you can bid on
              </CardDescription>
            </CardHeader>
            <CardContent>
              {rfqsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <LoadingSpinner />
                  <span className="ml-2">Loading RFQs...</span>
                </div>
              ) : availableRFQs && availableRFQs.length > 0 ? (
                <div className="space-y-4">
                  {availableRFQs.slice(0, 3).map((rfq: any) => (
                    <div key={rfq.rfq_id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 mb-1">
                            {rfq.rfq_title}
                          </h4>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              Closes: {formatDate(rfq.closing_date)}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {rfq.rfq_status}
                            </Badge>
                          </div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {rfq.categories?.slice(0, 3).map((category: string, index: number) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {category}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="ml-4">
                          <Badge
                            variant={rfq.eligibility_status === 'ELIGIBLE' ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {rfq.eligibility_status === 'ELIGIBLE' ? 'Eligible' : 'Under Review'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="pt-4 border-t">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => router.push('/vendor-portal/rfqs')}
                    >
                      View All RFQs
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No RFQs available at the moment</p>
                  <p className="text-sm">Check back later for new opportunities</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Purchase Orders */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Recent Purchase Orders</CardTitle>
              <CardDescription>
                Latest orders issued to you
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recentPOsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <LoadingSpinner />
                  <span className="ml-2">Loading orders...</span>
                </div>
              ) : recentPOs && recentPOs.length > 0 ? (
                <div className="space-y-4">
                  {recentPOs.slice(0, 3).map((po: any) => {
                    const completionPercentage = POGRNUtils.calculateCompletionPercentage(po);
                    const isOverdue = POGRNUtils.isPOOverdue(po);

                    return (
                      <div key={po.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                           onClick={() => router.push(`/vendor-portal/orders/${po.id}`)}>
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 mb-1">
                              {po.po_number}
                            </h4>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                Due: {formatDate(po.delivery_date)}
                              </span>
                              {isOverdue && (
                                <span className="flex items-center gap-1 text-red-600">
                                  <AlertTriangle className="h-3 w-3" />
                                  Overdue
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                              Value: {POGRNUtils.formatCurrency(po.total_amount)}
                            </p>
                          </div>
                          <div className="ml-4">
                            <Badge variant={POGRNUtils.getPOStatusBadgeVariant(po.status)} className="text-xs">
                              {POGRNUtils.getPOStatusDisplayName(po.status)}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all"
                              style={{ width: `${completionPercentage}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-600">{completionPercentage}%</span>
                        </div>
                      </div>
                    );
                  })}
                  <div className="pt-4 border-t">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => router.push('/vendor-portal/orders')}
                    >
                      View All Orders
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No purchase orders yet</p>
                  <p className="text-sm">Orders will appear here when issued</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent GRNs */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Recent GRNs</CardTitle>
              <CardDescription>
                Goods received notes requiring attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recentGRNsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <LoadingSpinner />
                  <span className="ml-2">Loading GRNs...</span>
                </div>
              ) : recentGRNs && recentGRNs.length > 0 ? (
                <div className="space-y-4">
                  {recentGRNs.slice(0, 3).map((grn: any) => {
                    const acceptanceRate = POGRNUtils.calculateGRNAcceptanceRate(grn);
                    const requiresResponse = ['RECEIVED', 'INSPECTED'].includes(grn.status);

                    return (
                      <div key={grn.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                           onClick={() => router.push(`/vendor-portal/grn/${grn.id}`)}>
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 mb-1">
                              {grn.grn_number}
                            </h4>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                Received: {formatDate(grn.received_date)}
                              </span>
                              {requiresResponse && (
                                <span className="flex items-center gap-1 text-orange-600">
                                  <AlertTriangle className="h-3 w-3" />
                                  Action Required
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                              PO: {grn.po_number}
                            </p>
                          </div>
                          <div className="ml-4">
                            <Badge variant={POGRNUtils.getGRNStatusBadgeVariant(grn.status)} className="text-xs">
                              {POGRNUtils.getGRNStatusDisplayName(grn.status)}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 text-yellow-500" />
                            <span className="text-xs text-gray-600">
                              {acceptanceRate}% accepted
                            </span>
                          </div>
                          {grn.quality_rating && (
                            <div className="flex items-center gap-1">
                              <span className="text-xs text-gray-600">
                                Quality: {grn.quality_rating}/5
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  <div className="pt-4 border-t">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => router.push('/vendor-portal/grn')}
                    >
                      View All GRNs
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Truck className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No goods received notes yet</p>
                  <p className="text-sm">GRNs will appear here when items are received</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Additional Performance and Alert Widgets */}
      {orderSummary && (orderSummary.overdue_deliveries > 0 || orderSummary.pending_deliveries > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {orderSummary.overdue_deliveries > 0 && (
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="text-red-800 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Overdue Deliveries
                </CardTitle>
                <CardDescription className="text-red-700">
                  Orders requiring immediate attention
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-800 mb-2">
                  {orderSummary.overdue_deliveries}
                </div>
                <p className="text-sm text-red-700 mb-4">
                  Orders past their delivery date need immediate action
                </p>
                <Button
                  variant="outline"
                  className="w-full border-red-300 text-red-800 hover:bg-red-100"
                  onClick={() => router.push('/vendor-portal/orders?status=overdue')}
                >
                  View Overdue Orders
                </Button>
              </CardContent>
            </Card>
          )}

          {orderSummary.pending_deliveries > 0 && (
            <Card className="border-orange-200 bg-orange-50">
              <CardHeader>
                <CardTitle className="text-orange-800 flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Pending Deliveries
                </CardTitle>
                <CardDescription className="text-orange-700">
                  Orders awaiting delivery updates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-800 mb-2">
                  {orderSummary.pending_deliveries}
                </div>
                <p className="text-sm text-orange-700 mb-4">
                  Update delivery status to keep customers informed
                </p>
                <Button
                  variant="outline"
                  className="w-full border-orange-300 text-orange-800 hover:bg-orange-100"
                  onClick={() => router.push('/vendor-portal/orders?status=pending')}
                >
                  Update Deliveries
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Vendor Profile Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {dashboardStats?.success_rate !== undefined && (
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>
                  Your delivery and quality performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-1">
                      {Math.round(dashboardStats.success_rate)}%
                    </div>
                    <p className="text-sm text-gray-600">Bid Success Rate</p>
                  </div>
                  {orderSummary?.average_delivery_rating && (
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600 mb-1">
                        {orderSummary.average_delivery_rating.toFixed(1)}
                      </div>
                      <p className="text-sm text-gray-600">Delivery Rating</p>
                    </div>
                  )}
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-1">
                      {vendorProfile.awarded_contracts}
                    </div>
                    <p className="text-sm text-gray-600">Contracts Awarded</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Company Profile</CardTitle>
              <CardDescription>
                Your vendor information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Company Name</label>
                <p className="text-sm text-gray-900">{vendorProfile.company_name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Email</label>
                <p className="text-sm text-gray-900">{vendorProfile.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Phone</label>
                <p className="text-sm text-gray-900">{vendorProfile.phone_number || 'Not provided'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Business Type</label>
                <p className="text-sm text-gray-900">{vendorProfile.type_of_business || 'Not specified'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Registration Date</label>
                <p className="text-sm text-gray-900">{formatDate(vendorProfile.registration_date)}</p>
              </div>
              <div className="pt-4 border-t">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => router.push('/vendor-portal/profile')}
                >
                  <Building2 className="h-4 w-4 mr-2" />
                  View Full Profile
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Approved Categories</CardTitle>
              <CardDescription>
                Areas you're qualified to bid on
              </CardDescription>
            </CardHeader>
            <CardContent>
              {vendorProfile.approved_categories && vendorProfile.approved_categories.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {vendorProfile.approved_categories.map((category, index) => (
                    <Badge key={index} variant="default" className="text-xs">
                      {category}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No categories approved yet</p>
              )}
            </CardContent>
          </Card>

          {dashboardStats?.success_rate !== undefined && (
            <Card>
              <CardHeader>
                <CardTitle>Performance</CardTitle>
                <CardDescription>
                  Your bidding success rate
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">
                    {Math.round(dashboardStats.success_rate)}%
                  </div>
                  <p className="text-sm text-gray-600">Success Rate</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Recent Notifications */}
      <div className="mt-8">
        <VendorNotifications maxItems={3} />
      </div>
    </div>
  );
}