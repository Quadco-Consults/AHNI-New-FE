# Urgent Approval Handler - Usage Example

## The Situation: "8 Days Pending, 3+ Days Overdue"

For the urgent approval situation you mentioned, here's how to implement the enhanced approval system:

## Quick Implementation

### Option 1: Use UrgentApprovalHandler (Recommended)

```tsx
import { UrgentApprovalHandler } from '@/features/procurement/components/purchase-request/UrgentApprovalHandler';

// In your Purchase Request details page
<UrgentApprovalHandler
  requestId="12345"
  requestData={purchaseRequestData}
  currentUser={currentUser}
  onStatusUpdate={() => refetchData()}
/>
```

### Option 2: Use Enhanced ApprovalFlow with Urgent Alert

```tsx
import { ApprovalFlow } from '@/features/procurement/components/purchase-request/ApprovalFlow';
import { calculateUrgency } from '@/features/procurement/utils/urgencyCalculator';

// Calculate urgency for the request
const urgencyInfo = calculateUrgency(
  purchaseRequestData.request_date,
  purchaseRequestData.status
);

const urgentAlert = urgencyInfo.shouldShowAlert ? {
  daysPending: 8,
  daysOverdue: 3,
  message: "This request has been pending review for 8 days, which is 3 days overdue. Critical attention required."
} : undefined;

// Render with urgent alert
<ApprovalFlow
  requestId="12345"
  currentUser={currentUser}
  onStatusUpdate={() => refetchData()}
  urgentAlert={urgentAlert}
/>
```

## What You'll Get

### 🚨 Urgent Alert Banner
- **Red border and background** for critical attention
- **Clear messaging**: "8 days pending, 3+ days overdue"
- **One-click action button** for immediate approval
- **Urgency level indicators** (URGENT/CRITICAL badges)

### ⚡ Quick Actions
- **"Take Action Now"** button for immediate approval
- **"Send Reminder"** to notify all approvers
- **"View Details"** to open full request
- **"Escalate to Management"** for critical cases

### 📊 Visual Indicators
- **Timeline showing delay** at each approval step
- **Color-coded status badges** (red for overdue)
- **Progress indicators** showing where it's stuck
- **SLA tracking** with days over target

### 🔔 Automatic Notifications
- **Toast notifications** for urgent requests
- **Auto-escalation options** for critical delays
- **Reminder system** for pending approvers

## Urgency Levels

The system automatically categorizes urgency:

| Days Overdue | Level | Action |
|-------------|-------|--------|
| 0-1 days | Normal | Standard workflow |
| 1-2 days | Attention | Yellow indicators |
| 3-4 days | Urgent | Red indicators, alerts |
| 5+ days | Critical | Escalation options |

## For Your 8-Day Case

With **8 days pending** and **3+ days overdue**:
- ✅ **Level**: URGENT (red indicators)
- ✅ **Alert**: Prominent banner at top
- ✅ **Actions**: One-click approval, reminders
- ✅ **Notifications**: Auto-toast alerts
- ✅ **Escalation**: Management notification options

## Implementation Steps

1. **Replace existing approval component**:
   ```tsx
   // Before
   <ApprovalWorkflow ... />

   // After
   <UrgentApprovalHandler
     requestId={requestId}
     requestData={purchaseRequestData}
     currentUser={currentUser}
     onStatusUpdate={() => refetchData()}
   />
   ```

2. **The system will automatically**:
   - Calculate urgency based on request date
   - Show appropriate alerts and indicators
   - Enable quick actions for overdue requests
   - Provide escalation options for critical cases

## Benefits

✅ **Immediate visibility** of overdue requests
✅ **One-click approvals** for urgent cases
✅ **Automatic escalation** for critical delays
✅ **SLA tracking** and visual indicators
✅ **Stakeholder notifications** and reminders
✅ **Full backward compatibility** with existing system

This enhanced system will make the "8 days pending, 3+ days overdue" situation immediately visible with clear action paths for resolution.