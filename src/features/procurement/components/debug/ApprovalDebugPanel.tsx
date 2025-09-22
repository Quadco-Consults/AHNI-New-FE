"use client";

import { useState } from "react";
import { Button } from "components/ui/button";
import { Card } from "components/ui/card";
import { Badge } from "components/ui/badge";
import {
  Bug,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Copy,
  Eye,
  EyeOff
} from "lucide-react";
import { PurchaseRequestApprovalAPI } from "@/features/procurement/controllers/purchaseRequestApprovalController";
import { ActivityMemoApprovalAPI } from "@/features/procurement/controllers/activityMemoApprovalController";
import { toast } from "sonner";

interface ApprovalDebugPanelProps {
  purchaseRequestData?: any;
  activityMemoData?: any;
  currentUser?: any;
}

const ApprovalDebugPanel = ({
  purchaseRequestData,
  activityMemoData,
  currentUser
}: ApprovalDebugPanelProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [testResults, setTestResults] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const testPurchaseRequestAPI = async (action: 'review' | 'authorize' | 'approve') => {
    if (!purchaseRequestData?.data?.id) {
      toast.error("No purchase request ID available");
      return;
    }

    setIsLoading(true);
    const requestId = purchaseRequestData.data.id;

    try {
      let result;
      const startTime = Date.now();

      switch (action) {
        case 'review':
          result = await PurchaseRequestApprovalAPI.review(requestId);
          break;
        case 'authorize':
          result = await PurchaseRequestApprovalAPI.authorize(requestId);
          break;
        case 'approve':
          result = await PurchaseRequestApprovalAPI.approve(requestId);
          break;
      }

      const duration = Date.now() - startTime;

      setTestResults(prev => ({
        ...prev,
        [`pr_${action}`]: {
          success: true,
          result,
          duration,
          timestamp: new Date().toISOString()
        }
      }));

      toast.success(`${action} API test successful!`);

    } catch (error: any) {
      const duration = Date.now() - Date.now();

      setTestResults(prev => ({
        ...prev,
        [`pr_${action}`]: {
          success: false,
          error: error.message || error.toString(),
          duration,
          timestamp: new Date().toISOString()
        }
      }));

      toast.error(`${action} API test failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testActivityMemoAPI = async (action: 'submit' | 'review' | 'approve' | 'reject') => {
    if (!activityMemoData?.data?.id) {
      toast.error("No activity memo ID available");
      return;
    }

    setIsLoading(true);
    const memoId = activityMemoData.data.id;

    try {
      let result;
      const startTime = Date.now();

      switch (action) {
        case 'submit':
          result = await ActivityMemoApprovalAPI.submit(memoId);
          break;
        case 'review':
          result = await ActivityMemoApprovalAPI.review(memoId);
          break;
        case 'approve':
          result = await ActivityMemoApprovalAPI.approve(memoId);
          break;
        case 'reject':
          result = await ActivityMemoApprovalAPI.reject(memoId, "Test rejection reason");
          break;
      }

      const duration = Date.now() - startTime;

      setTestResults(prev => ({
        ...prev,
        [`memo_${action}`]: {
          success: true,
          result,
          duration,
          timestamp: new Date().toISOString()
        }
      }));

      toast.success(`${action} API test successful!`);

    } catch (error: any) {
      const duration = Date.now() - Date.now();

      setTestResults(prev => ({
        ...prev,
        [`memo_${action}`]: {
          success: false,
          error: error.message || error.toString(),
          duration,
          timestamp: new Date().toISOString()
        }
      }));

      toast.error(`${action} API test failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (success: boolean) => {
    return success ? (
      <CheckCircle className="w-4 h-4 text-green-500" />
    ) : (
      <XCircle className="w-4 h-4 text-red-500" />
    );
  };

  const clearResults = () => {
    setTestResults({});
    toast.info("Test results cleared");
  };

  if (!isVisible) {
    return (
      <Button
        onClick={() => setIsVisible(true)}
        variant="outline"
        size="sm"
        className="fixed bottom-4 right-4 z-50"
      >
        <Bug className="w-4 h-4 mr-2" />
        Debug
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-4 right-4 w-96 max-h-96 overflow-y-auto z-50 shadow-lg">
      <div className="p-4 border-b bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bug className="w-5 h-5 text-blue-500" />
            <h3 className="font-semibold text-gray-900">Approval API Debug</h3>
          </div>
          <div className="flex space-x-2">
            <Button
              onClick={clearResults}
              variant="ghost"
              size="sm"
            >
              Clear
            </Button>
            <Button
              onClick={() => setIsVisible(false)}
              variant="ghost"
              size="sm"
            >
              <EyeOff className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Current Data Info */}
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Current Data:</h4>
          <div className="text-xs space-y-1">
            <div>PR ID: {purchaseRequestData?.data?.id || 'None'}</div>
            <div>Memo ID: {activityMemoData?.data?.id || 'None'}</div>
            <div>User ID: {currentUser?.data?.id || 'None'}</div>
          </div>
        </div>

        {/* Purchase Request API Tests */}
        {purchaseRequestData?.data?.id && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Purchase Request APIs:</h4>
            <div className="grid grid-cols-3 gap-2">
              <Button
                onClick={() => testPurchaseRequestAPI('review')}
                disabled={isLoading}
                size="sm"
                variant="outline"
                className="text-xs"
              >
                Review
              </Button>
              <Button
                onClick={() => testPurchaseRequestAPI('authorize')}
                disabled={isLoading}
                size="sm"
                variant="outline"
                className="text-xs"
              >
                Authorize
              </Button>
              <Button
                onClick={() => testPurchaseRequestAPI('approve')}
                disabled={isLoading}
                size="sm"
                variant="outline"
                className="text-xs"
              >
                Approve
              </Button>
            </div>
          </div>
        )}

        {/* Activity Memo API Tests */}
        {activityMemoData?.data?.id && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Activity Memo APIs:</h4>
            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={() => testActivityMemoAPI('submit')}
                disabled={isLoading}
                size="sm"
                variant="outline"
                className="text-xs"
              >
                Submit
              </Button>
              <Button
                onClick={() => testActivityMemoAPI('review')}
                disabled={isLoading}
                size="sm"
                variant="outline"
                className="text-xs"
              >
                Review
              </Button>
              <Button
                onClick={() => testActivityMemoAPI('approve')}
                disabled={isLoading}
                size="sm"
                variant="outline"
                className="text-xs"
              >
                Approve
              </Button>
              <Button
                onClick={() => testActivityMemoAPI('reject')}
                disabled={isLoading}
                size="sm"
                variant="outline"
                className="text-xs"
              >
                Reject
              </Button>
            </div>
          </div>
        )}

        {/* Test Results */}
        {Object.keys(testResults).length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Test Results:</h4>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {Object.entries(testResults).map(([key, result]) => (
                <div key={key} className="flex items-center justify-between p-2 bg-gray-50 rounded text-xs">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(result.success)}
                    <span className="font-medium">{key.replace('_', ' ').toUpperCase()}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Badge variant={result.success ? "default" : "destructive"} className="text-xs">
                      {result.duration}ms
                    </Badge>
                    <Button
                      onClick={() => copyToClipboard(JSON.stringify(result, null, 2))}
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex items-center justify-center p-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ApprovalDebugPanel;