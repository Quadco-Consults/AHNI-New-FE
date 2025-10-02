"use client";

import React, { useEffect } from 'react';
import { AlertTriangle, Clock, Users } from 'lucide-react';
import { Button } from 'components/ui/button';
import { Card } from 'components/ui/card';
import { Badge } from 'components/ui/badge';
import { toast } from 'sonner';
import { ApprovalFlow } from './ApprovalFlow';
import { calculateUrgency, getUrgencyStyles, formatUrgencyNotification } from '../../utils/urgencyCalculator';

interface UrgentApprovalHandlerProps {
  requestId: number | string;
  requestData: any; // Your purchase request data
  currentUser: any;
  onStatusUpdate: () => void;
}

export const UrgentApprovalHandler: React.FC<UrgentApprovalHandlerProps> = ({
  requestId,
  requestData,
  currentUser,
  onStatusUpdate
}) => {
  // Calculate urgency based on request data
  const urgencyInfo = calculateUrgency(
    requestData?.request_date || requestData?.created_at,
    requestData?.status
  );

  const styles = getUrgencyStyles(urgencyInfo.urgencyLevel);

  // Show toast notification for critical/urgent requests
  useEffect(() => {
    if (urgencyInfo.urgencyLevel === 'critical' || urgencyInfo.urgencyLevel === 'urgent') {
      const notificationMessage = formatUrgencyNotification(urgencyInfo, String(requestId));

      toast.error(notificationMessage, {
        duration: 10000, // 10 seconds for urgent notifications
        action: {
          label: 'View Request',
          onClick: () => {
            // Scroll to the approval section or focus on it
            const approvalSection = document.getElementById('approval-flow');
            if (approvalSection) {
              approvalSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }
        }
      });
    }
  }, [urgencyInfo.urgencyLevel, requestId]);

  // For the case mentioned: "8 days pending, 3+ days overdue"
  const urgentAlert = urgencyInfo.shouldShowAlert ? {
    daysPending: urgencyInfo.daysPending,
    daysOverdue: urgencyInfo.daysOverdue,
    message: urgencyInfo.message
  } : undefined;

  return (
    <div className="space-y-4">
      {/* Urgent Summary Card */}
      {urgencyInfo.shouldShowAlert && (
        <Card className={`p-4 border-l-4 ${styles.borderColor} ${styles.bgColor}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <AlertTriangle className={`w-6 h-6 ${styles.iconColor}`} />
              <div>
                <h4 className={`font-semibold ${styles.textColor}`}>
                  Approval Required - {urgencyInfo.urgencyLevel.toUpperCase()}
                </h4>
                <p className={`text-sm ${styles.textColor} mt-1`}>
                  Request #{requestId} • {urgencyInfo.daysPending} days pending
                  {urgencyInfo.isOverdue && ` • ${urgencyInfo.daysOverdue} days overdue`}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Badge className={styles.badgeColor}>
                {urgencyInfo.urgencyLevel.toUpperCase()}
              </Badge>
              {urgencyInfo.urgencyLevel === 'critical' && (
                <Badge className="bg-red-600 text-white animate-pulse">
                  ACTION REQUIRED
                </Badge>
              )}
            </div>
          </div>

          {/* Quick Action Bar */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  Submitted: {new Date(requestData?.request_date || requestData?.created_at).toLocaleDateString()}
                </div>
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  Status: {requestData?.status}
                </div>
              </div>

              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    // Open request details in new tab or navigate
                    window.open(`/dashboard/procurement/purchase-request/${requestId}/details`, '_blank');
                  }}
                >
                  View Details
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    // Send notification to approvers
                    toast.info("Reminder sent to all approvers");
                  }}
                >
                  Send Reminder
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Enhanced Approval Flow with Urgent Alert */}
      <div id="approval-flow">
        <ApprovalFlow
          requestId={requestId}
          currentUser={currentUser}
          onStatusUpdate={onStatusUpdate}
          urgentAlert={urgentAlert}
        />
      </div>

      {/* Additional Urgent Actions */}
      {urgencyInfo.urgencyLevel === 'critical' && (
        <Card className="p-4 bg-yellow-50 border border-yellow-200">
          <h5 className="font-semibold text-yellow-800 mb-2">Critical Escalation Options</h5>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <Button
              variant="outline"
              size="sm"
              className="text-yellow-700 border-yellow-300 hover:bg-yellow-100"
              onClick={() => {
                toast.info("Escalating to senior management...");
                // Implement escalation logic
              }}
            >
              Escalate to Management
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-yellow-700 border-yellow-300 hover:bg-yellow-100"
              onClick={() => {
                toast.info("Notifying all stakeholders...");
                // Implement stakeholder notification
              }}
            >
              Notify All Stakeholders
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-yellow-700 border-yellow-300 hover:bg-yellow-100"
              onClick={() => {
                toast.info("Setting up urgent review meeting...");
                // Implement meeting setup
              }}
            >
              Schedule Urgent Review
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default UrgentApprovalHandler;