"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "components/ui/button";
import { Badge } from "components/ui/badge";
import { Card } from "components/ui/card";
import { LoadingSpinner } from "components/Loading";
import { toast } from "sonner";
import {
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  FileText,
  ShoppingCart,
  TrendingUp,
  Users
} from "lucide-react";

import { useGetAllActivityMemos } from "@/features/procurement/controllers/activityMemoController";
import { useGetPurchaseRequests } from "@/features/procurement/controllers/purchaseRequestController";
import { useGetUserProfile } from "@/features/auth/controllers/userController";
import { ActivityMemoApprovalAPI } from "@/features/procurement/controllers/activityMemoApprovalController";
import { PurchaseRequestApprovalAPI } from "@/features/procurement/controllers/purchaseRequestApprovalController";

interface ActivityMemo {
  id: string;
  subject: string;
  comment: string;
  status: 'DRAFT' | 'PENDING' | 'REVIEWED' | 'APPROVED' | 'REJECTED';
  activity_budget?: number;
  requested_date: string;
  created_by: string;
  reviewed_by?: string[];
  approved_by?: string;
}

interface PurchaseRequest {
  id: string;
  ref_number: string;
  status: 'Pending' | 'Reviewed' | 'Authorised' | 'Approved';
  total_cost?: number;
  date_required: string;
  requesting_department_detail?: { name: string };
  reviewed_by?: string;
  authorized_by?: string;
  approved_by?: string;
}

const UnifiedApprovalDashboard = () => {
  const [activeTab, setActiveTab] = useState<'memos' | 'requests'>('memos');
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // API hooks
  const { data: memosData, isLoading: memosLoading, refetch: refetchMemos } = useGetAllActivityMemos({
    page: 1,
    size: 100,
    enabled: true
  });

  const { data: requestsData, isLoading: requestsLoading, refetch: refetchRequests } = useGetPurchaseRequests({
    page: 1,
    size: 100,
    enabled: true
  });

  const { data: currentUser } = useGetUserProfile();

  const memos: ActivityMemo[] = memosData?.data?.results || [];
  const purchaseRequests: PurchaseRequest[] = requestsData?.data?.results || [];

  const refreshData = () => {
    refetchMemos();
    refetchRequests();
    setRefreshKey(prev => prev + 1);
  };

  const handleMemoAction = async (memoId: string, action: 'submit' | 'review' | 'approve' | 'reject', reason?: string) => {
    setLoading(true);
    try {
      let result;

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
          if (!reason) {
            toast.error('Rejection reason is required');
            return;
          }
          result = await ActivityMemoApprovalAPI.reject(memoId, reason);
          break;
      }

      if (result.status) {
        toast.success(`Memo ${action}${action.endsWith('e') ? 'd' : action === 'submit' ? 'ted' : 'ed'} successfully!`);
        refreshData();
      } else {
        toast.error(`Error: ${result.message}`);
      }
    } catch (error: any) {
      console.error(`Error ${action}ing memo:`, error);
      toast.error(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handlePRAction = async (requestId: string, action: 'review' | 'authorize' | 'approve') => {
    setLoading(true);
    try {
      let result;

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

      if (result.status) {
        toast.success(`Purchase request ${action}${action.endsWith('e') ? 'd' : 'ed'} successfully!`);
        refreshData();
      } else {
        toast.error(`Error: ${result.message || result.detail}`);
      }
    } catch (error: any) {
      console.error(`Error ${action}ing purchase request:`, error);
      toast.error(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const getMemoActions = (memo: ActivityMemo, currentUser: any) => {
    const actions: Array<{ action: string; label: string; color: string }> = [];
    const userId = currentUser?.data?.id;

    if (memo.status === 'DRAFT' && memo.created_by === userId) {
      actions.push({ action: 'submit', label: 'Submit', color: 'blue' });
    }

    if (memo.status === 'PENDING' && memo.reviewed_by?.includes(userId)) {
      actions.push({ action: 'review', label: 'Review', color: 'yellow' });
      actions.push({ action: 'reject', label: 'Reject', color: 'red' });
    }

    if (memo.status === 'REVIEWED' && memo.approved_by === userId) {
      actions.push({ action: 'approve', label: 'Approve', color: 'green' });
      actions.push({ action: 'reject', label: 'Reject', color: 'red' });
    }

    return actions;
  };

  const getPRActions = (request: PurchaseRequest, currentUser: any) => {
    const actions: Array<{ action: string; label: string; color: string }> = [];
    const userId = currentUser?.data?.id;

    if (request.status === 'Pending' && request.reviewed_by === userId) {
      actions.push({ action: 'review', label: 'Review', color: 'blue' });
    }

    if (request.status === 'Reviewed' && request.authorized_by === userId) {
      actions.push({ action: 'authorize', label: 'Authorize', color: 'yellow' });
    }

    if (request.status === 'Authorised' && request.approved_by === userId) {
      actions.push({ action: 'approve', label: 'Approve', color: 'green' });
    }

    return actions;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      // Activity Memo statuses
      'DRAFT': 'bg-gray-100 text-gray-800 border-gray-200',
      'PENDING': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'REVIEWED': 'bg-blue-100 text-blue-800 border-blue-200',
      'APPROVED': 'bg-green-100 text-green-800 border-green-200',
      'REJECTED': 'bg-red-100 text-red-800 border-red-200',

      // Purchase Request statuses
      'Pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Reviewed': 'bg-blue-100 text-blue-800 border-blue-200',
      'Authorised': 'bg-purple-100 text-purple-800 border-purple-200',
      'Approved': 'bg-green-100 text-green-800 border-green-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'APPROVED':
      case 'Approved':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'REJECTED':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'PENDING':
      case 'Pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'REVIEWED':
      case 'Reviewed':
      case 'Authorised':
        return <AlertTriangle className="w-4 h-4 text-blue-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  // Calculate statistics
  const pendingMemoActions = memos.filter(m => getMemoActions(m, currentUser).length > 0).length;
  const pendingPRActions = purchaseRequests.filter(pr => getPRActions(pr, currentUser).length > 0).length;
  const totalPendingActions = pendingMemoActions + pendingPRActions;

  const approvedMemos = memos.filter(m => m.status === 'APPROVED').length;
  const approvedPRs = purchaseRequests.filter(pr => pr.status === 'Approved').length;
  const totalApproved = approvedMemos + approvedPRs;

  if (memosLoading || requestsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Unified Approval Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage approvals for Activity Memos and Purchase Requests</p>
        </div>
        <Button onClick={refreshData} variant="outline" disabled={loading}>
          {loading ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center">
            <AlertTriangle className="w-8 h-8 text-orange-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Actions</p>
              <p className="text-2xl font-bold text-orange-600">{totalPendingActions}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <CheckCircle className="w-8 h-8 text-green-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Approved Items</p>
              <p className="text-2xl font-bold text-green-600">{totalApproved}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <FileText className="w-8 h-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Activity Memos</p>
              <p className="text-2xl font-bold text-blue-600">{memos.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <ShoppingCart className="w-8 h-8 text-purple-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Purchase Requests</p>
              <p className="text-2xl font-bold text-purple-600">{purchaseRequests.length}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('memos')}
            className={`py-3 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
              activeTab === 'memos'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Activity Memos ({memos.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`py-3 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
              activeTab === 'requests'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Purchase Requests ({purchaseRequests.length})</span>
          </button>
        </nav>
      </div>

      {/* Activity Memos Tab */}
      {activeTab === 'memos' && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Activity Memo Approvals</h2>
            <div className="text-sm text-gray-500">
              {pendingMemoActions} items pending your action
            </div>
          </div>

          {/* Status Summary */}
          <div className="grid grid-cols-5 gap-4 mb-6">
            {['DRAFT', 'PENDING', 'REVIEWED', 'APPROVED', 'REJECTED'].map(status => (
              <Card key={status} className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {memos.filter(m => m.status === status).length}
                </div>
                <div className="text-sm text-gray-600 mt-1">{status}</div>
              </Card>
            ))}
          </div>

          {/* Memos Table */}
          <Card>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subject
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Budget
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {memos.map(memo => {
                    const actions = getMemoActions(memo, currentUser);

                    return (
                      <tr key={memo.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">{memo.subject}</div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">{memo.comment}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(memo.status)}
                            <Badge className={`text-xs ${getStatusColor(memo.status)}`}>
                              {memo.status}
                            </Badge>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          ₦{memo.activity_budget?.toLocaleString() || 'N/A'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {memo.requested_date}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex space-x-2">
                            {actions.map(action => (
                              <Button
                                key={action.action}
                                onClick={() => {
                                  if (action.action === 'reject') {
                                    const reason = prompt('Please provide a reason for rejection:');
                                    if (reason?.trim()) {
                                      handleMemoAction(memo.id, action.action as any, reason);
                                    }
                                  } else {
                                    handleMemoAction(memo.id, action.action as any);
                                  }
                                }}
                                size="sm"
                                disabled={loading}
                                variant={action.color === 'red' ? 'destructive' : action.color === 'green' ? 'default' : 'outline'}
                              >
                                {action.label}
                              </Button>
                            ))}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* Purchase Requests Tab */}
      {activeTab === 'requests' && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Purchase Request Approvals</h2>
            <div className="text-sm text-gray-500">
              {pendingPRActions} items pending your action
            </div>
          </div>

          {/* Status Summary */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            {['Pending', 'Reviewed', 'Authorised', 'Approved'].map(status => (
              <Card key={status} className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {purchaseRequests.filter(pr => pr.status === status).length}
                </div>
                <div className="text-sm text-gray-600 mt-1">{status}</div>
              </Card>
            ))}
          </div>

          {/* Purchase Requests Table */}
          <Card>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reference
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Cost
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Required Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {purchaseRequests.map(request => {
                    const actions = getPRActions(request, currentUser);

                    return (
                      <tr key={request.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">{request.ref_number}</div>
                          <div className="text-sm text-gray-500">
                            {request.requesting_department_detail?.name}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(request.status)}
                            <Badge className={`text-xs ${getStatusColor(request.status)}`}>
                              {request.status}
                            </Badge>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          ₦{request.total_cost?.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {request.date_required}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex space-x-2">
                            {actions.map(action => (
                              <Button
                                key={action.action}
                                onClick={() => handlePRAction(request.id, action.action as any)}
                                size="sm"
                                disabled={loading}
                                variant={action.color === 'green' ? 'default' : 'outline'}
                              >
                                {action.label}
                              </Button>
                            ))}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default UnifiedApprovalDashboard;