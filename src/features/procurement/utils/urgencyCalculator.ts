// Utility functions for calculating approval urgency and overdue status

export interface UrgencyInfo {
  daysPending: number;
  daysOverdue: number;
  urgencyLevel: 'normal' | 'attention' | 'urgent' | 'critical';
  message: string;
  isOverdue: boolean;
  shouldShowAlert: boolean;
}

/**
 * Calculate urgency information for a purchase request
 */
export const calculateUrgency = (
  requestDate: string | Date,
  status: string,
  reviewSLA: number = 3, // Default: 3 days for review
  authorizeSLA: number = 2, // Default: 2 days for authorization
  approveSLA: number = 1 // Default: 1 day for final approval
): UrgencyInfo => {
  const submissionDate = new Date(requestDate);
  const currentDate = new Date();
  const daysPending = Math.floor((currentDate.getTime() - submissionDate.getTime()) / (1000 * 60 * 60 * 24));

  // Determine SLA based on current status
  let slaTarget: number;
  let stepName: string;

  switch (status) {
    case 'Pending':
      slaTarget = reviewSLA;
      stepName = 'review';
      break;
    case 'Reviewed':
      slaTarget = authorizeSLA;
      stepName = 'authorization';
      break;
    case 'Authorised':
      slaTarget = approveSLA;
      stepName = 'final approval';
      break;
    default:
      // Already approved or other status
      return {
        daysPending,
        daysOverdue: 0,
        urgencyLevel: 'normal',
        message: 'Request completed',
        isOverdue: false,
        shouldShowAlert: false
      };
  }

  const daysOverdue = Math.max(0, daysPending - slaTarget);
  const isOverdue = daysOverdue > 0;

  // Determine urgency level
  let urgencyLevel: UrgencyInfo['urgencyLevel'];
  let message: string;

  if (daysOverdue >= 5) {
    urgencyLevel = 'critical';
    message = `This request has been pending ${stepName} for ${daysPending} days, which is ${daysOverdue} days overdue. Critical attention required.`;
  } else if (daysOverdue >= 3) {
    urgencyLevel = 'urgent';
    message = `This request has been pending ${stepName} for ${daysPending} days, which is ${daysOverdue} days overdue. Urgent action needed.`;
  } else if (daysOverdue >= 1) {
    urgencyLevel = 'attention';
    message = `This request has been pending ${stepName} for ${daysPending} days, which is ${daysOverdue} days overdue. Please prioritize.`;
  } else if (daysPending >= slaTarget - 1) {
    urgencyLevel = 'attention';
    message = `This request has been pending ${stepName} for ${daysPending} days. SLA target is ${slaTarget} days.`;
  } else {
    urgencyLevel = 'normal';
    message = `This request has been pending ${stepName} for ${daysPending} days. Within SLA target of ${slaTarget} days.`;
  }

  const shouldShowAlert = urgencyLevel === 'urgent' || urgencyLevel === 'critical' || daysOverdue >= 1;

  return {
    daysPending,
    daysOverdue,
    urgencyLevel,
    message,
    isOverdue,
    shouldShowAlert
  };
};

/**
 * Get urgency styling classes based on urgency level
 */
export const getUrgencyStyles = (urgencyLevel: UrgencyInfo['urgencyLevel']) => {
  switch (urgencyLevel) {
    case 'critical':
      return {
        borderColor: 'border-red-600',
        bgColor: 'bg-red-50',
        textColor: 'text-red-800',
        badgeColor: 'bg-red-100 text-red-800 border-red-200',
        iconColor: 'text-red-600'
      };
    case 'urgent':
      return {
        borderColor: 'border-red-500',
        bgColor: 'bg-red-50',
        textColor: 'text-red-700',
        badgeColor: 'bg-red-100 text-red-700 border-red-200',
        iconColor: 'text-red-500'
      };
    case 'attention':
      return {
        borderColor: 'border-orange-500',
        bgColor: 'bg-orange-50',
        textColor: 'text-orange-700',
        badgeColor: 'bg-orange-100 text-orange-700 border-orange-200',
        iconColor: 'text-orange-500'
      };
    default:
      return {
        borderColor: 'border-blue-300',
        bgColor: 'bg-blue-50',
        textColor: 'text-blue-700',
        badgeColor: 'bg-blue-100 text-blue-700 border-blue-200',
        iconColor: 'text-blue-500'
      };
  }
};

/**
 * Format urgency message for notifications
 */
export const formatUrgencyNotification = (urgencyInfo: UrgencyInfo, requestId: string): string => {
  const { urgencyLevel, daysPending, daysOverdue } = urgencyInfo;

  switch (urgencyLevel) {
    case 'critical':
      return `🚨 CRITICAL: Purchase Request ${requestId} is ${daysOverdue} days overdue (${daysPending} days pending). Immediate action required.`;
    case 'urgent':
      return `⚠️ URGENT: Purchase Request ${requestId} is ${daysOverdue} days overdue (${daysPending} days pending). Please review immediately.`;
    case 'attention':
      return `⏰ ATTENTION: Purchase Request ${requestId} requires attention (${daysPending} days pending, ${daysOverdue} days overdue).`;
    default:
      return `ℹ️ Purchase Request ${requestId} is pending approval (${daysPending} days).`;
  }
};