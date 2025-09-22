"use client";

import { Card } from "components/ui/card";
import { Badge } from "components/ui/badge";
import { CheckCircle, XCircle, Clock, User, Calendar, MessageSquare } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";

interface ApprovalHistoryEvent {
  id: string;
  action: 'submitted' | 'reviewed' | 'authorized' | 'approved' | 'rejected';
  user: {
    id: string;
    name: string;
    role?: string;
  };
  timestamp: string;
  comment?: string;
  status: 'approved' | 'rejected' | 'pending';
}

interface ApprovalHistoryProps {
  purchaseRequestData: any;
}

const ApprovalHistory = ({ purchaseRequestData }: ApprovalHistoryProps) => {
  // Extract approval history from purchase request data
  const extractApprovalHistory = (): ApprovalHistoryEvent[] => {
    const data = purchaseRequestData?.data;
    if (!data) return [];

    const events: ApprovalHistoryEvent[] = [];

    // Initial submission
    if (data.created_at || data.requested_date) {
      events.push({
        id: 'submitted',
        action: 'submitted',
        user: {
          id: data.requested_by?.id || data.created_by || 'unknown',
          name: data.requested_by?.name ||
                (data.requested_by?.first_name && data.requested_by?.last_name
                  ? `${data.requested_by.first_name} ${data.requested_by.last_name}`
                  : 'Unknown User'),
          role: data.requested_by?.designation || 'Requestor'
        },
        timestamp: data.created_at || data.requested_date,
        status: 'approved'
      });
    }

    // Review step
    if (data.reviewed_by || data.reviewed_date) {
      events.push({
        id: 'reviewed',
        action: 'reviewed',
        user: {
          id: data.reviewed_by?.id || data.reviewed_by || 'unknown',
          name: data.reviewed_by?.name ||
                (data.reviewed_by?.first_name && data.reviewed_by?.last_name
                  ? `${data.reviewed_by.first_name} ${data.reviewed_by.last_name}`
                  : data.reviewed_by || 'Unknown Reviewer'),
          role: 'Reviewer'
        },
        timestamp: data.reviewed_date,
        status: data.review_status === 'rejected' ? 'rejected' : 'approved'
      });
    }

    // Authorization step
    if (data.authorized_by || data.authorized_date) {
      events.push({
        id: 'authorized',
        action: 'authorized',
        user: {
          id: data.authorized_by?.id || data.authorized_by || 'unknown',
          name: data.authorized_by?.name ||
                (data.authorized_by?.first_name && data.authorized_by?.last_name
                  ? `${data.authorized_by.first_name} ${data.authorized_by.last_name}`
                  : data.authorized_by || 'Unknown Authorizer'),
          role: 'Authorizer'
        },
        timestamp: data.authorized_date,
        status: data.authorization_status === 'rejected' ? 'rejected' : 'approved'
      });
    }

    // Final approval step
    if (data.approved_by || data.approved_date) {
      events.push({
        id: 'approved',
        action: 'approved',
        user: {
          id: data.approved_by?.id || data.approved_by || 'unknown',
          name: data.approved_by?.name ||
                (data.approved_by?.first_name && data.approved_by?.last_name
                  ? `${data.approved_by.first_name} ${data.approved_by.last_name}`
                  : data.approved_by || 'Unknown Approver'),
          role: 'Final Approver'
        },
        timestamp: data.approved_date,
        status: data.approval_status === 'rejected' ? 'rejected' : 'approved'
      });
    }

    // Sort by timestamp
    return events.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  };

  const getActionIcon = (action: string, status: string) => {
    if (status === 'rejected') {
      return <XCircle className="w-5 h-5 text-red-500" />;
    }

    switch (action) {
      case 'submitted':
        return <Clock className="w-5 h-5 text-blue-500" />;
      case 'reviewed':
      case 'authorized':
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getActionLabel = (action: string, status: string) => {
    if (status === 'rejected') {
      return `${action.charAt(0).toUpperCase() + action.slice(1)} - Rejected`;
    }

    switch (action) {
      case 'submitted':
        return 'Request Submitted';
      case 'reviewed':
        return 'Review Completed';
      case 'authorized':
        return 'Authorization Completed';
      case 'approved':
        return 'Final Approval Completed';
      default:
        return action.charAt(0).toUpperCase() + action.slice(1);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      'approved': 'bg-green-100 text-green-800 border-green-200',
      'rejected': 'bg-red-100 text-red-800 border-red-200',
      'pending': 'bg-gray-100 text-gray-800 border-gray-200'
    };

    return (
      <Badge className={`px-2 py-1 text-xs font-medium rounded-full border ${variants[status as keyof typeof variants]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const formatTimestamp = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      const formatted = format(date, 'MMM dd, yyyy at HH:mm');
      const relative = formatDistanceToNow(date, { addSuffix: true });
      return { formatted, relative };
    } catch {
      return { formatted: timestamp, relative: '' };
    }
  };

  const approvalHistory = extractApprovalHistory();

  if (approvalHistory.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Approval History</h3>
        <div className="text-center text-gray-500 py-8">
          <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p>No approval history available</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Approval History</h3>

      <div className="space-y-6">
        {approvalHistory.map((event, index) => {
          const { formatted, relative } = formatTimestamp(event.timestamp);

          return (
            <div key={event.id} className="relative">
              {/* Timeline line */}
              {index < approvalHistory.length - 1 && (
                <div className="absolute left-6 top-12 w-0.5 h-16 bg-gray-200"></div>
              )}

              <div className="flex items-start space-x-4">
                {/* Icon */}
                <div className="flex-shrink-0 w-12 h-12 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center">
                  {getActionIcon(event.action, event.status)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <h4 className="text-sm font-medium text-gray-900">
                        {getActionLabel(event.action, event.status)}
                      </h4>
                      {getStatusBadge(event.status)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {relative}
                    </div>
                  </div>

                  <div className="mt-2 space-y-2">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <User className="w-4 h-4" />
                      <span className="font-medium">{event.user.name}</span>
                      {event.user.role && (
                        <span className="text-gray-400">• {event.user.role}</span>
                      )}
                    </div>

                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      <span>{formatted}</span>
                    </div>

                    {event.comment && (
                      <div className="flex items-start space-x-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                        <MessageSquare className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>{event.comment}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">
            Total steps completed: {approvalHistory.length}
          </span>
          <span className="text-gray-600">
            Current status: {
              purchaseRequestData?.data?.status === 'approved' ? 'Fully Approved' :
              purchaseRequestData?.data?.status === 'rejected' ? 'Rejected' :
              'In Progress'
            }
          </span>
        </div>
      </div>
    </Card>
  );
};

export default ApprovalHistory;