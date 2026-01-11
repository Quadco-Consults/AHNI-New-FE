"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import {
  Bell,
  Mail,
  Calendar,
  Clock,
  DollarSign,
  FileText,
  Eye,
  Search,
  Filter,
  MarkAsRead,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  Trash2
} from "lucide-react";
import {
  useVendorNotifications,
  useMarkNotificationRead
} from "../controllers/vendorDashboardController";
import { LoadingSpinner } from "@/components/Loading";
import { toast } from "sonner";

interface VendorNotificationsProps {
  showAll?: boolean;
  maxItems?: number;
}

const VendorNotifications: React.FC<VendorNotificationsProps> = ({
  showAll = false,
  maxItems = 5
}) => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data: notifications, isLoading, error } = useVendorNotifications();
  const { mutate: markAsRead } = useMarkNotificationRead();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <LoadingSpinner />
        <span className="ml-2">Loading notifications...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load notifications. Please try refreshing the page.
        </AlertDescription>
      </Alert>
    );
  }

  const filteredNotifications = notifications?.filter((notification: any) => {
    const matchesSearch = notification.rfq_title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || notification.status === statusFilter;
    return matchesSearch && matchesStatus;
  }) || [];

  const displayedNotifications = showAll
    ? filteredNotifications
    : filteredNotifications.slice(0, maxItems);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'READ':
        return 'outline';
      case 'delivered':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'failed':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'read':
        return <CheckCircle className="h-4 w-4" />;
      case 'delivered':
        return <Mail className="h-4 w-4" />;
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const handleMarkAsRead = (notificationId: string) => {
    markAsRead(notificationId, {
      onSuccess: () => {
        toast.success("Notification marked as read");
      },
      onError: () => {
        toast.error("Failed to mark notification as read");
      }
    });
  };

  const handleViewRFQ = (rfqId: string, notificationId: string) => {
    // Mark as read when viewing
    if (notifications?.find(n => n.id === notificationId)?.status !== 'read') {
      handleMarkAsRead(notificationId);
    }
    router.push(`/vendor-portal/rfqs/${rfqId}`);
  };

  const unreadCount = notifications?.filter(n => n.status !== 'read').length || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`${showAll ? 'text-3xl' : 'text-xl'} font-bold text-gray-900 flex items-center gap-2`}>
            <Bell className={`${showAll ? 'h-8 w-8' : 'h-5 w-5'}`} />
            RFQ Notifications
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount} new
              </Badge>
            )}
          </h2>
          {showAll && (
            <p className="text-gray-600 mt-1">
              Stay updated on new procurement opportunities and RFQ announcements
            </p>
          )}
        </div>
      </div>

      {/* Search and Filters (only for full view) */}
      {showAll && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search notifications by RFQ title..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              <div className="sm:w-48">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="delivered">New</option>
                  <option value="read">Read</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notifications List */}
      <div className="space-y-4">
        {displayedNotifications.length > 0 ? (
          displayedNotifications.map((notification: any) => (
            <Card
              key={notification.id}
              className={`hover:shadow-md transition-shadow ${
                notification.status === 'read' ? 'opacity-75' : 'border-l-4 border-l-blue-500'
              }`}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {getStatusIcon(notification.status)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className={`font-semibold ${
                            notification.status === 'read' ? 'text-gray-700' : 'text-gray-900'
                          } truncate`}>
                            {notification.rfq_title}
                          </h3>
                          <Badge
                            variant={getStatusBadgeVariant(notification.status)}
                            className="ml-2 flex-shrink-0"
                          >
                            {notification.status}
                          </Badge>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 mb-3 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Sent: {formatDate(notification.sent_date)}
                          </span>
                          {notification.read_date && (
                            <span className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              Read: {formatDate(notification.read_date)}
                            </span>
                          )}
                          {notification.estimated_value && (
                            <span className="flex items-center gap-1 font-medium text-green-600">
                              <DollarSign className="h-3 w-3" />
                              {formatCurrency(notification.estimated_value)}
                            </span>
                          )}
                        </div>

                        {notification.description && (
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                            {notification.description}
                          </p>
                        )}

                        {notification.categories && (
                          <div className="flex flex-wrap gap-1 mb-3">
                            {notification.categories.slice(0, 3).map((category: string, index: number) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {category}
                              </Badge>
                            ))}
                            {notification.categories.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{notification.categories.length - 3} more
                              </Badge>
                            )}
                          </div>
                        )}

                        {notification.submission_deadline && (
                          <div className="flex items-center gap-1 text-sm text-orange-600 mb-3">
                            <Clock className="h-3 w-3" />
                            <span>Deadline: {formatDate(notification.submission_deadline)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 ml-4">
                    <Button
                      onClick={() => handleViewRFQ(notification.rfq_id, notification.id)}
                      size="sm"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View RFQ
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>

                    {notification.status !== 'read' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleMarkAsRead(notification.id)}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Mark Read
                      </Button>
                    )}
                  </div>
                </div>

                {notification.error_message && (
                  <Alert variant="destructive" className="mt-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Delivery failed: {notification.error_message}
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="py-16 text-center">
              <Bell className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Notifications Found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || statusFilter !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "You don't have any RFQ notifications yet"}
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
      </div>

      {/* View All Link (for dashboard widget) */}
      {!showAll && notifications && notifications.length > maxItems && (
        <div className="text-center">
          <Button
            variant="outline"
            onClick={() => router.push('/vendor-portal/notifications')}
          >
            View All Notifications ({notifications.length})
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      )}

      {/* Summary Stats (for full view) */}
      {showAll && notifications && notifications.length > 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-blue-600">{notifications.length}</p>
                <p className="text-sm text-blue-800">Total Notifications</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">{unreadCount}</p>
                <p className="text-sm text-green-800">Unread</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-600">
                  {notifications.filter((n: any) => n.status === 'read').length}
                </p>
                <p className="text-sm text-purple-800">Read</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-orange-600">
                  {notifications.filter((n: any) => n.status === 'failed').length}
                </p>
                <p className="text-sm text-orange-800">Failed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default VendorNotifications;