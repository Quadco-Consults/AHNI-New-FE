"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "components/ui/card";
import { Button } from "components/ui/button";
import { Badge } from "components/ui/badge";
import { Alert, AlertDescription } from "components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
import {
  Send,
  Users,
  Mail,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  RefreshCw,
  Download,
  Eye,
  BarChart3,
  TrendingUp,
  Globe
} from "lucide-react";
import {
  useRFQDistributionStatus,
  useResendRFQNotifications
} from "../../controllers/rfqDistributionController";
import { LoadingSpinner } from "components/Loading";
import { toast } from "sonner";

interface RFQDistributionStatusProps {
  rfq_id: string;
}

const RFQDistributionStatus: React.FC<RFQDistributionStatusProps> = ({ rfq_id }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedFailedVendors, setSelectedFailedVendors] = useState<string[]>([]);

  const { data: distributionStatus, isLoading, error, refetch } = useRFQDistributionStatus(rfq_id);
  const { mutate: resendNotifications, isPending: isResending } = useResendRFQNotifications();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <LoadingSpinner />
        <span className="ml-2">Loading distribution status...</span>
      </div>
    );
  }

  if (error || !distributionStatus) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load distribution status. Please try refreshing the page.
        </AlertDescription>
      </Alert>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getNotificationStatusBadge = (status: string) => {
    const variants = {
      'SENT': { variant: 'default' as const, icon: <CheckCircle className="h-3 w-3" /> },
      'DELIVERED': { variant: 'default' as const, icon: <Mail className="h-3 w-3" /> },
      'READ': { variant: 'outline' as const, icon: <Eye className="h-3 w-3" /> },
      'PENDING': { variant: 'secondary' as const, icon: <Clock className="h-3 w-3" /> },
      'FAILED': { variant: 'destructive' as const, icon: <XCircle className="h-3 w-3" /> }
    };

    const config = variants[status as keyof typeof variants] || variants.PENDING;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        {config.icon}
        {status}
      </Badge>
    );
  };

  const handleResendNotifications = (vendorIds?: string[]) => {
    resendNotifications({
      rfq_id,
      vendor_ids: vendorIds,
      notification_type: 'BOTH'
    }, {
      onSuccess: (result) => {
        toast.success(`Notifications resent to ${result.notifications_sent} vendors`);
        setSelectedFailedVendors([]);
        refetch();
      },
      onError: () => {
        toast.error("Failed to resend notifications");
      }
    });
  };

  const failedNotifications = distributionStatus.notification_results.filter(n => n.status === 'FAILED');
  const successRate = distributionStatus.total_eligible_vendors > 0
    ? Math.round((distributionStatus.notifications_sent / distributionStatus.total_eligible_vendors) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Eligible</p>
                <p className="text-2xl font-bold text-blue-600">{distributionStatus.total_eligible_vendors}</p>
              </div>
              <Users className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Notifications Sent</p>
                <p className="text-2xl font-bold text-green-600">{distributionStatus.notifications_sent}</p>
              </div>
              <Send className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Failed</p>
                <p className="text-2xl font-bold text-red-600">{distributionStatus.failed_notifications}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold text-purple-600">{successRate}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Failed Notifications Alert */}
      {failedNotifications.length > 0 && (
        <Alert className="border-orange-200 bg-orange-50">
          <AlertCircle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            <div className="flex items-center justify-between">
              <span>
                <strong>{failedNotifications.length} notifications failed.</strong>
                You can resend them individually or in bulk.
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleResendNotifications(failedNotifications.map(n => n.vendor_id))}
                disabled={isResending}
                className="ml-4"
              >
                {isResending ? (
                  <>
                    <LoadingSpinner />
                    <span className="ml-2">Resending...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Resend All Failed
                  </>
                )}
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="vendors">Vendor Status</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="actions">Actions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Distribution Summary</CardTitle>
              <CardDescription>
                Overview of RFQ distribution results and vendor reach
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* By Category */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">By Category</h4>
                  <div className="space-y-2">
                    {Object.entries(distributionStatus.distribution_summary.by_category).map(([category, count]) => (
                      <div key={category} className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">{category}</span>
                        <Badge variant="outline">{count}</Badge>
                      </div>
                    ))}
                  </div>
                </div>

                {/* By Geographical Area */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">By Region</h4>
                  <div className="space-y-2">
                    {Object.entries(distributionStatus.distribution_summary.by_geographical_area).map(([area, count]) => (
                      <div key={area} className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">{area}</span>
                        <Badge variant="outline">{count}</Badge>
                      </div>
                    ))}
                  </div>
                </div>

                {/* By Qualification Score */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">By Score Range</h4>
                  <div className="space-y-2">
                    {Object.entries(distributionStatus.distribution_summary.by_qualification_score).map(([range, count]) => (
                      <div key={range} className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">{range}</span>
                        <Badge variant="outline">{count}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vendors" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Vendor Notification Status</CardTitle>
              <CardDescription>
                Detailed status of notifications sent to each vendor
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {distributionStatus.notification_results.map((notification) => {
                  const vendor = distributionStatus.eligible_vendors.find(v => v.vendor_id === notification.vendor_id);

                  return (
                    <div key={notification.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-medium text-gray-900">
                            {vendor?.company_name || 'Unknown Vendor'}
                          </h4>
                          {getNotificationStatusBadge(notification.status)}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>Email: {vendor?.email}</span>
                          <span>Sent: {formatDate(notification.sent_date)}</span>
                          {notification.read_date && (
                            <span>Read: {formatDate(notification.read_date)}</span>
                          )}
                          {notification.retry_count > 0 && (
                            <span>Retries: {notification.retry_count}</span>
                          )}
                        </div>
                        {notification.error_message && (
                          <p className="text-sm text-red-600 mt-1">
                            Error: {notification.error_message}
                          </p>
                        )}
                      </div>

                      {notification.status === 'FAILED' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleResendNotifications([notification.vendor_id])}
                          disabled={isResending}
                        >
                          <RefreshCw className="h-4 w-4 mr-1" />
                          Resend
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Distribution Analytics
              </CardTitle>
              <CardDescription>
                Performance metrics and insights
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Delivery Performance */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">Delivery Performance</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Successful Deliveries</span>
                      <div className="text-right">
                        <span className="font-medium">{distributionStatus.notifications_sent - distributionStatus.failed_notifications}</span>
                        <span className="text-xs text-gray-500 ml-1">
                          ({Math.round(((distributionStatus.notifications_sent - distributionStatus.failed_notifications) / distributionStatus.notifications_sent) * 100)}%)
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Failed Deliveries</span>
                      <div className="text-right">
                        <span className="font-medium">{distributionStatus.failed_notifications}</span>
                        <span className="text-xs text-gray-500 ml-1">
                          ({Math.round((distributionStatus.failed_notifications / distributionStatus.notifications_sent) * 100)}%)
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Read Notifications</span>
                      <div className="text-right">
                        <span className="font-medium">
                          {distributionStatus.notification_results.filter(n => n.read_date).length}
                        </span>
                        <span className="text-xs text-gray-500 ml-1">
                          ({Math.round((distributionStatus.notification_results.filter(n => n.read_date).length / distributionStatus.notifications_sent) * 100)}%)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Vendor Engagement */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">Vendor Reach</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Total Categories</span>
                      <span className="font-medium">
                        {Object.keys(distributionStatus.distribution_summary.by_category).length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Geographic Coverage</span>
                      <span className="font-medium">
                        {Object.keys(distributionStatus.distribution_summary.by_geographical_area).length} regions
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">High Performers</span>
                      <span className="font-medium">
                        {distributionStatus.distribution_summary.by_qualification_score['High (80-100)'] || 0}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="actions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Distribution Actions</CardTitle>
              <CardDescription>
                Manage and monitor your RFQ distribution
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Notification Management</h4>

                  <Button
                    variant="outline"
                    onClick={() => refetch()}
                    className="w-full justify-start"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh Status
                  </Button>

                  {failedNotifications.length > 0 && (
                    <Button
                      variant="outline"
                      onClick={() => handleResendNotifications(failedNotifications.map(n => n.vendor_id))}
                      disabled={isResending}
                      className="w-full justify-start"
                    >
                      {isResending ? (
                        <>
                          <LoadingSpinner />
                          <span className="ml-2">Resending All Failed...</span>
                        </>
                      ) : (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Resend All Failed ({failedNotifications.length})
                        </>
                      )}
                    </Button>
                  )}

                  <Button
                    variant="outline"
                    onClick={() => {/* TODO: Implement export */}}
                    className="w-full justify-start"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export Distribution Report
                  </Button>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Monitoring</h4>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Globe className="h-4 w-4 text-blue-600" />
                      <span className="font-medium text-gray-900">Distribution Complete</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      RFQ has been distributed to all eligible vendors. Monitor vendor responses
                      and submission activity through the RFQ management dashboard.
                    </p>
                  </div>

                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      Vendors can now view this RFQ in their portal and submit bids.
                      You'll receive notifications when bids are submitted.
                    </AlertDescription>
                  </Alert>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RFQDistributionStatus;