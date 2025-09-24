import React from 'react';
import { Badge } from './ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Button } from './ui/button';
import { cn } from 'lib/utils';
import { InfoIcon, UserIcon, CalendarIcon } from 'lucide-react';
import { ApprovalInfo } from './ApprovalDisplay';

interface ApprovalSummaryProps {
  approval?: ApprovalInfo;
  className?: string;
  variant?: 'badge' | 'compact' | 'minimal';
}

const ApprovalSummary: React.FC<ApprovalSummaryProps> = ({
  approval,
  className,
  variant = 'badge'
}) => {
  if (!approval) {
    return (
      <Badge variant="outline" className={cn("text-gray-500", className)}>
        No Approval
      </Badge>
    );
  }

  const getStatusColor = (status: ApprovalInfo['status']) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'REJECTED':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'UNDER_REVIEW':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'PENDING':
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';

    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  if (variant === 'minimal') {
    return (
      <Badge className={getStatusColor(approval.status)}>
        {approval.status.replace('_', ' ')}
      </Badge>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={cn("flex items-center space-x-2", className)}>
        <Badge className={getStatusColor(approval.status)}>
          {approval.status.replace('_', ' ')}
        </Badge>
        <span className="text-sm text-gray-600">{approval.name}</span>
      </div>
    );
  }

  // Default badge variant with popover
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" className={cn("p-0 h-auto", className)}>
          <Badge className={cn(getStatusColor(approval.status), "cursor-pointer hover:opacity-80")}>
            {approval.status.replace('_', ' ')}
            <InfoIcon className="w-3 h-3 ml-1" />
          </Badge>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="start">
        <div className="space-y-3">
          {/* Approver Info */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full">
              {approval.avatar ? (
                <img
                  src={approval.avatar}
                  alt={approval.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <UserIcon className="w-4 h-4 text-gray-600" />
              )}
            </div>
            <div>
              <p className="font-medium text-sm">{approval.name}</p>
              <p className="text-xs text-gray-600">{approval.position}</p>
              {approval.level && (
                <p className="text-xs text-gray-500">Level: {approval.level}</p>
              )}
            </div>
          </div>

          {/* Dates */}
          <div className="space-y-2 text-xs">
            {approval.creationDate && (
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Created:</span>
                <span className="font-medium">{formatDate(approval.creationDate)}</span>
              </div>
            )}
            {approval.reviewDate && (
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Reviewed:</span>
                <span className="font-medium">{formatDate(approval.reviewDate)}</span>
              </div>
            )}
            {approval.approvalDate && (
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Approved:</span>
                <span className="font-medium">{formatDate(approval.approvalDate)}</span>
              </div>
            )}
            {approval.authorizationDate && (
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Authorized:</span>
                <span className="font-medium">{formatDate(approval.authorizationDate)}</span>
              </div>
            )}
          </div>

          {/* Comments */}
          {approval.comments && (
            <div className="pt-2 border-t">
              <p className="text-xs text-gray-500 mb-1">Comments:</p>
              <p className="text-xs text-gray-700">{approval.comments}</p>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ApprovalSummary;