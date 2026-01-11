"use client";

import React, { useState } from 'react';
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Import both old and new components
import { ApprovalFlow as NewApprovalFlow } from './ApprovalFlow';
import ApprovalWorkflow from './ApprovalWorkflow';

interface UnifiedApprovalFlowProps {
  requestId: number | string;
  purchaseRequestData: any;
  activityMemoData?: any;
  currentUser: any;
  onStatusUpdate: () => void;
}

export const UnifiedApprovalFlow: React.FC<UnifiedApprovalFlowProps> = ({
  requestId,
  purchaseRequestData,
  activityMemoData,
  currentUser,
  onStatusUpdate
}) => {
  // State to toggle between old and new systems
  const [useNewSystem, setUseNewSystem] = useState(true);

  return (
    <div className="space-y-4">
      {/* Toggle Controls */}
      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
        <div className="flex items-center space-x-2">
          <Settings className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Approval System</span>
          <Badge variant={useNewSystem ? "default" : "secondary"} className="text-xs">
            {useNewSystem ? "New Backend Integration" : "Legacy System"}
          </Badge>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setUseNewSystem(!useNewSystem)}
          className="text-xs"
        >
          Switch to {useNewSystem ? "Legacy" : "New"} System
        </Button>
      </div>

      {/* Render appropriate component */}
      {useNewSystem ? (
        <NewApprovalFlow
          requestId={requestId}
          currentUser={currentUser}
          onStatusUpdate={onStatusUpdate}
        />
      ) : (
        <ApprovalWorkflow
          purchaseRequestData={purchaseRequestData}
          activityMemoData={activityMemoData}
          currentUser={currentUser}
          purchaseRequestId={String(requestId)}
          onStatusUpdate={onStatusUpdate}
        />
      )}
    </div>
  );
};

export default UnifiedApprovalFlow;