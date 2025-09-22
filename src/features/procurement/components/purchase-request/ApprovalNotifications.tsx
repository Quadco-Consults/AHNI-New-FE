"use client";

import { useEffect, useState } from "react";
import { Bell, CheckCircle, XCircle, Clock, AlertTriangle } from "lucide-react";
import { Card } from "components/ui/card";
import { Badge } from "components/ui/badge";
import { Button } from "components/ui/button";
import { toast } from "sonner";

interface ApprovalNotification {
  id: string;
  type: 'approval_required' | 'approved' | 'rejected' | 'overdue' | 'reminder';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  timestamp: string;
  isRead: boolean;
  actionRequired: boolean;
  purchaseRequestId: string;
  stepType?: 'review' | 'authorization' | 'approval';
}

interface ApprovalNotificationsProps {
  purchaseRequestData: any;
  currentUser: any;
  onActionTaken?: () => void;
}

const ApprovalNotifications = ({
  purchaseRequestData,
  currentUser,
  onActionTaken
}: ApprovalNotificationsProps) => {
  const [notifications, setNotifications] = useState<ApprovalNotification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Generate notifications based on purchase request status
  useEffect(() => {
    if (!purchaseRequestData?.data || !currentUser?.data) return;

    const data = purchaseRequestData.data;
    const newNotifications: ApprovalNotification[] = [];

    // Check for pending approvals that require current user's action
    const userId = currentUser.data.id;

    // Review notification
    if (!data.reviewed_by && !data.review_status) {
      newNotifications.push({
        id: `review-${data.id}`,
        type: 'approval_required',
        title: 'Review Required',
        message: `Purchase request ${data.ref_number || data.id} requires your review`,
        priority: 'high',
        timestamp: new Date().toISOString(),
        isRead: false,
        actionRequired: true,
        purchaseRequestId: data.id,
        stepType: 'review'
      });
    }

    // Authorization notification (only if review is complete)
    if (data.reviewed_by && !data.authorized_by && !data.authorization_status) {
      newNotifications.push({
        id: `authorization-${data.id}`,
        type: 'approval_required',
        title: 'Authorization Required',
        message: `Purchase request ${data.ref_number || data.id} requires authorization`,
        priority: 'high',
        timestamp: new Date().toISOString(),
        isRead: false,
        actionRequired: true,
        purchaseRequestId: data.id,
        stepType: 'authorization'
      });
    }

    // Final approval notification (only if authorization is complete)
    if (data.authorized_by && !data.approved_by && !data.approval_status) {
      newNotifications.push({
        id: `approval-${data.id}`,
        type: 'approval_required',
        title: 'Final Approval Required',
        message: `Purchase request ${data.ref_number || data.id} requires final approval`,
        priority: 'urgent',
        timestamp: new Date().toISOString(),
        isRead: false,
        actionRequired: true,
        purchaseRequestId: data.id,
        stepType: 'approval'
      });
    }

    // Overdue notifications (requests older than 3 days without action)
    const createdDate = new Date(data.created_at || data.requested_date);
    const daysSinceCreated = Math.floor((Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24));

    if (daysSinceCreated > 3 && data.status !== 'approved' && data.status !== 'rejected') {
      newNotifications.push({
        id: `overdue-${data.id}`,
        type: 'overdue',
        title: 'Overdue Request',
        message: `Purchase request ${data.ref_number || data.id} has been pending for ${daysSinceCreated} days`,
        priority: 'urgent',
        timestamp: new Date().toISOString(),
        isRead: false,
        actionRequired: true,
        purchaseRequestId: data.id
      });
    }

    // Status change notifications
    if (data.status === 'approved') {
      newNotifications.push({
        id: `approved-${data.id}`,
        type: 'approved',
        title: 'Request Approved',
        message: `Purchase request ${data.ref_number || data.id} has been fully approved`,
        priority: 'medium',
        timestamp: data.approved_date || new Date().toISOString(),
        isRead: false,
        actionRequired: false,
        purchaseRequestId: data.id
      });
    }

    if (data.status === 'rejected') {
      newNotifications.push({
        id: `rejected-${data.id}`,
        type: 'rejected',
        title: 'Request Rejected',
        message: `Purchase request ${data.ref_number || data.id} has been rejected`,
        priority: 'high',
        timestamp: data.approved_date || data.authorized_date || data.reviewed_date || new Date().toISOString(),
        isRead: false,
        actionRequired: false,
        purchaseRequestId: data.id
      });
    }

    setNotifications(newNotifications);

    // Auto-show notifications if there are urgent ones
    if (newNotifications.some(n => n.priority === 'urgent' && n.actionRequired)) {
      setShowNotifications(true);
    }

  }, [purchaseRequestData, currentUser]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'approval_required':
        return <Clock className="w-5 h-5 text-blue-500" />;
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'overdue':
        return <AlertTriangle className="w-5 h-5 text-orange-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'low':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleNotificationAction = (notification: ApprovalNotification) => {
    if (notification.actionRequired && onActionTaken) {
      // This would typically navigate to the appropriate action or open a modal
      toast.info(`Action required for ${notification.stepType} step`);
      onActionTaken();
    }
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
    );
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const urgentCount = notifications.filter(n => !n.isRead && n.priority === 'urgent').length;

  return (
    <div className="relative">
      {/* Notification Bell */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <Badge className={`absolute -top-2 -right-2 w-5 h-5 text-xs flex items-center justify-center ${
            urgentCount > 0 ? 'bg-red-500' : 'bg-blue-500'
          }`}>
            {unreadCount}
          </Badge>
        )}
      </Button>

      {/* Notifications Panel */}
      {showNotifications && (
        <Card className="absolute right-0 top-full mt-2 w-96 max-h-96 overflow-y-auto z-50 shadow-lg">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Notifications</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowNotifications(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </Button>
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <Bell className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p>No notifications</p>
              </div>
            ) : (
              <div className="space-y-1">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 border-l-4 cursor-pointer hover:bg-gray-50 ${
                      notification.isRead ? 'bg-white' : 'bg-blue-50'
                    } ${
                      notification.priority === 'urgent' ? 'border-l-red-500' :
                      notification.priority === 'high' ? 'border-l-orange-500' :
                      notification.priority === 'medium' ? 'border-l-blue-500' :
                      'border-l-gray-300'
                    }`}
                    onClick={() => {
                      markAsRead(notification.id);
                      handleNotificationAction(notification);
                    }}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium text-gray-900">
                            {notification.title}
                          </h4>
                          <Badge className={`text-xs ${getPriorityColor(notification.priority)}`}>
                            {notification.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {notification.message}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-gray-500">
                            {new Date(notification.timestamp).toLocaleDateString()}
                          </span>
                          {notification.actionRequired && (
                            <Badge className="text-xs bg-blue-100 text-blue-800">
                              Action Required
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};

export default ApprovalNotifications;