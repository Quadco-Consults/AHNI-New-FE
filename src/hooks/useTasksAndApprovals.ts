import { useState, useEffect, useCallback } from 'react';
import AxiosWithToken from '@/lib/axios';
import { useToast } from '@/hooks/use-toast';

export type ApprovalModule =
  | 'purchase_request'
  | 'leave_request'
  | 'timesheet'
  | 'payment_request'
  | 'expense_authorization'
  | 'travel_request'
  | 'vehicle_request'
  | 'item_requisition'
  | 'contract_request'
  | 'fund_request'
  | 'asset_request'
  | 'facility_maintenance'
  | 'vehicle_maintenance'
  | 'cba_review'
  | 'cba_authorise'
  | 'cba_approve'
  | 'interview_panel'
  | 'staff_requisition'
  | 'adhoc_staff'
  | 'custom_task';

export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskStatus = 'pending' | 'approved' | 'rejected' | 'in_review' | 'completed';

export interface UnifiedTask {
  id: string;
  type: ApprovalModule;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  requestor?: string;
  amount?: number;
  dueDate?: string;
  createdAt: string;
  metadata?: any;
  approvalUrl?: string;
  detailsUrl?: string;
}

export const useTasksAndApprovals = () => {
  const [tasks, setTasks] = useState<UnifiedTask[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Fetch Purchase Requests pending approval
  const fetchPurchaseRequests = async (): Promise<UnifiedTask[]> => {
    try {
      // Note: endpoint is singular, not plural
      const response = await AxiosWithToken.get('/procurements/purchase-request/', {
        params: { status: 'Pending', page: 1 }
      });

      // Handle different response structures
      let data = [];
      if (Array.isArray(response.data)) {
        data = response.data;
      } else if (response.data?.results) {
        data = response.data.results;
      } else if (response.data?.data?.results) {
        data = response.data.data.results;
      }

      return data.map((pr: any) => ({
        id: `pr_${pr.id}`,
        type: 'purchase_request' as const,
        title: `Purchase Request #${pr.pr_number || pr.id}`,
        description: pr.description || pr.purpose || 'Purchase request pending approval',
        status: 'pending' as const,
        priority: (pr.priority || 'medium') as TaskPriority,
        requestor: pr.requested_by?.full_name || pr.requested_by?.email,
        amount: pr.total_amount || pr.estimated_amount,
        dueDate: pr.required_date,
        createdAt: pr.created_datetime || pr.created_at,
        metadata: pr,
        detailsUrl: `/dashboard/procurement/purchase-request/${pr.id}`,
      }));
    } catch (error: any) {
      console.warn('Purchase requests endpoint not available:', error.response?.status);
      return [];
    }
  };

  // Fetch Leave Requests pending approval
  const fetchLeaveRequests = async (): Promise<UnifiedTask[]> => {
    try {
      const response = await AxiosWithToken.get('/hr/leave-request/', {
        params: { status: 'pending_approval', page: 1 }
      });

      // Handle different response structures
      let data = [];
      if (Array.isArray(response.data)) {
        data = response.data;
      } else if (response.data?.results) {
        data = response.data.results;
      } else if (response.data?.data?.results) {
        data = response.data.data.results;
      }

      return data.map((leave: any) => ({
        id: `leave_${leave.id}`,
        type: 'leave_request' as const,
        title: `Leave Request - ${leave.employee?.full_name || 'Employee'}`,
        description: `${leave.leave_type?.name || 'Leave'} for ${leave.days_requested || leave.duration} days`,
        status: 'pending' as const,
        priority: 'medium' as TaskPriority,
        requestor: leave.employee?.full_name || leave.employee?.email,
        dueDate: leave.start_date,
        createdAt: leave.created_datetime || leave.created_at,
        metadata: leave,
        detailsUrl: `/dashboard/hr/leave-management/leave-list/${leave.id}`,
      }));
    } catch (error: any) {
      console.warn('Leave requests endpoint not available:', error.response?.status);
      return [];
    }
  };

  // Fetch Timesheets pending approval
  const fetchTimesheets = async (): Promise<UnifiedTask[]> => {
    try {
      const response = await AxiosWithToken.get('/hr/time-sheet/time-sheet/', {
        params: { status: 'submitted' }
      });
      const data = response.data.results || response.data.data?.results || [];

      return data.map((timesheet: any) => ({
        id: `timesheet_${timesheet.id}`,
        type: 'timesheet' as const,
        title: `Timesheet - ${timesheet.employee?.full_name || 'Employee'}`,
        description: `Week of ${timesheet.week_start_date || timesheet.period_start}`,
        status: 'pending' as const,
        priority: 'low' as TaskPriority,
        requestor: timesheet.employee?.full_name,
        createdAt: timesheet.created_datetime || timesheet.created_at,
        metadata: timesheet,
        detailsUrl: `/dashboard/hr/timesheet-management/approvals`,
      }));
    } catch (error) {
      console.error('Error fetching timesheets:', error);
      return [];
    }
  };

  // Fetch Payment Requests pending approval
  const fetchPaymentRequests = async (): Promise<UnifiedTask[]> => {
    try {
      // Correct endpoint path
      const response = await AxiosWithToken.get('/admins/payments/requests/', {
        params: { status: 'PENDING', page: 1 }
      });

      // Handle different response structures
      let data = [];
      if (Array.isArray(response.data)) {
        data = response.data;
      } else if (response.data?.results) {
        data = response.data.results;
      } else if (response.data?.data?.results) {
        data = response.data.data.results;
      }

      return data.map((payment: any) => ({
        id: `payment_${payment.id}`,
        type: 'payment_request' as const,
        title: `Payment Request #${payment.pr_number || payment.id}`,
        description: payment.description || payment.purpose || 'Payment request pending approval',
        status: 'pending' as const,
        priority: (payment.amount > 10000 ? 'high' : 'medium') as TaskPriority,
        requestor: payment.requested_by?.full_name,
        amount: payment.amount,
        dueDate: payment.payment_date,
        createdAt: payment.created_datetime || payment.created_at,
        metadata: payment,
        detailsUrl: `/dashboard/admin/payment-request/${payment.id}`,
      }));
    } catch (error: any) {
      console.warn('Payment requests endpoint not available:', error.response?.status);
      return [];
    }
  };

  // Fetch Vehicle Requests pending approval
  const fetchVehicleRequests = async (): Promise<UnifiedTask[]> => {
    try {
      const response = await AxiosWithToken.get('/admins/fleets/vehicles/requests/', {
        params: { status: 'PENDING' }
      });
      const data = response.data.results || response.data.data?.results || [];

      return data.map((vehicle: any) => ({
        id: `vehicle_${vehicle.id}`,
        type: 'vehicle_request' as const,
        title: `Vehicle Request - ${vehicle.requested_by?.full_name || 'Staff'}`,
        description: `${vehicle.purpose || 'Vehicle request'} - ${vehicle.destination || ''}`,
        status: 'pending' as const,
        priority: 'medium' as TaskPriority,
        requestor: vehicle.requested_by?.full_name,
        dueDate: vehicle.start_date || vehicle.travel_date,
        createdAt: vehicle.created_datetime || vehicle.created_at,
        metadata: vehicle,
        detailsUrl: `/dashboard/admin/fleet-management/vehicle-request/${vehicle.id}`,
      }));
    } catch (error) {
      console.error('Error fetching vehicle requests:', error);
      return [];
    }
  };

  // Fetch Expense Authorizations pending approval
  const fetchExpenseAuthorizations = async (): Promise<UnifiedTask[]> => {
    try {
      const response = await AxiosWithToken.get('/admins/authorization/expenses/', {
        params: { status: 'PENDING' }
      });
      const data = response.data.results || response.data.data?.results || [];

      return data.map((expense: any) => ({
        id: `expense_${expense.id}`,
        type: 'expense_authorization' as const,
        title: `Expense Authorization #${expense.id}`,
        description: expense.description || expense.purpose || 'Expense authorization pending',
        status: 'pending' as const,
        priority: (expense.amount > 5000 ? 'high' : 'medium') as TaskPriority,
        requestor: expense.requested_by?.full_name,
        amount: expense.amount,
        createdAt: expense.created_datetime || expense.created_at,
        metadata: expense,
        detailsUrl: `/dashboard/admin/expense-authorization/${expense.id}`,
      }));
    } catch (error) {
      console.error('Error fetching expense authorizations:', error);
      return [];
    }
  };

  // Fetch Contract Requests pending approval
  const fetchContractRequests = async (): Promise<UnifiedTask[]> => {
    try {
      const response = await AxiosWithToken.get('/contract-grants/contract-requests/', {
        params: { status: 'SUBMITTED' }
      });
      const data = response.data.results || response.data.data?.results || [];

      return data.map((contract: any) => ({
        id: `contract_${contract.id}`,
        type: 'contract_request' as const,
        title: `Contract Request - ${contract.consultant_name || contract.title}`,
        description: contract.description || contract.scope_of_work || 'Contract request pending',
        status: 'pending' as const,
        priority: 'high' as TaskPriority,
        requestor: contract.requested_by?.full_name,
        amount: contract.estimated_amount || contract.contract_value,
        createdAt: contract.created_datetime || contract.created_at,
        metadata: contract,
        detailsUrl: `/dashboard/c-and-g/contract-request/${contract.id}`,
      }));
    } catch (error) {
      console.error('Error fetching contract requests:', error);
      return [];
    }
  };

  // Fetch CBAs pending review/authorisation/approval by current user
  const fetchCBATasks = async (): Promise<UnifiedTask[]> => {
    try {
      const response = await AxiosWithToken.get('/procurements/cbas/', {
        params: { status: 'UNDER_REVIEW' }
      });
      const data = response.data.results || response.data.data?.results || [];

      // Get current user ID from token/auth context if available
      // For now, we'll process all CBAs and create tasks based on workflow status
      const tasks: UnifiedTask[] = [];

      for (const cba of data) {
        // Check if user needs to review
        if (cba.reviewers && Array.isArray(cba.reviewers) && cba.reviewers.length > 0) {
          // Check if already reviewed by checking signatures
          const needsReview = !cba.reviewed_by;
          if (needsReview) {
            tasks.push({
              id: `cba_review_${cba.id}`,
              type: 'cba_review' as const,
              title: `CBA Review - ${cba.solicitation?.rfq_id || cba.solicitation?.title || 'Solicitation'}`,
              description: `${cba.cba_type} CBA requires your review`,
              status: 'pending' as const,
              priority: 'high' as TaskPriority,
              requestor: cba.assignee?.first_name ? `${cba.assignee.first_name} ${cba.assignee.last_name}` : undefined,
              dueDate: cba.cba_date,
              createdAt: cba.created_datetime,
              metadata: cba,
              detailsUrl: `/dashboard/procurement/cba/${cba.id}`,
            });
          }
        }

        // Check if user needs to authorise (after all reviewers have signed)
        if (cba.authorisers && Array.isArray(cba.authorisers) && cba.authorisers.length > 0) {
          const needsAuthorisation = cba.reviewed_by && !cba.authorised_by;
          if (needsAuthorisation) {
            tasks.push({
              id: `cba_authorise_${cba.id}`,
              type: 'cba_authorise' as const,
              title: `CBA Authorisation - ${cba.solicitation?.rfq_id || cba.solicitation?.title || 'Solicitation'}`,
              description: `${cba.cba_type} CBA requires your authorisation`,
              status: 'pending' as const,
              priority: 'high' as TaskPriority,
              requestor: cba.assignee?.first_name ? `${cba.assignee.first_name} ${cba.assignee.last_name}` : undefined,
              amount: cba.selected_total,
              dueDate: cba.cba_date,
              createdAt: cba.created_datetime,
              metadata: cba,
              detailsUrl: `/dashboard/procurement/cba/${cba.id}`,
            });
          }
        }

        // Check if user needs to approve (after all reviewers and authorisers have signed)
        if (cba.approvers && Array.isArray(cba.approvers) && cba.approvers.length > 0) {
          const needsApproval = cba.authorised_by && !cba.approved_by_user;
          if (needsApproval) {
            tasks.push({
              id: `cba_approve_${cba.id}`,
              type: 'cba_approve' as const,
              title: `CBA Approval - ${cba.solicitation?.rfq_id || cba.solicitation?.title || 'Solicitation'}`,
              description: `${cba.cba_type} CBA requires your final approval`,
              status: 'pending' as const,
              priority: 'high' as TaskPriority,
              requestor: cba.assignee?.first_name ? `${cba.assignee.first_name} ${cba.assignee.last_name}` : undefined,
              amount: cba.selected_total,
              dueDate: cba.cba_date,
              createdAt: cba.created_datetime,
              metadata: cba,
              detailsUrl: `/dashboard/procurement/cba/${cba.id}`,
            });
          }
        }
      }

      return tasks;
    } catch (error: any) {
      console.warn('CBA tasks endpoint not available:', error.response?.status);
      return [];
    }
  };

  // Fetch Interview Panel assignments
  const fetchInterviewPanelTasks = async (): Promise<UnifiedTask[]> => {
    try {
      const response = await AxiosWithToken.get('/hr/jobs/advertisements/', {
        params: { status: 'PUBLISHED', is_published: true }
      });
      const data = response.data.results || response.data.data?.results || [];

      // Filter to only show advertisements where user is an interviewer
      // and where there are scheduled interviews or applications to review
      const tasks: UnifiedTask[] = [];

      for (const advert of data) {
        // Check if user is in interviewers list
        if (advert.interviewers && Array.isArray(advert.interviewers) && advert.interviewers.length > 0) {
          // Check if interview is scheduled or approaching
          const hasScheduledInterview = advert.interview_date;

          if (hasScheduledInterview) {
            tasks.push({
              id: `interview_${advert.id}`,
              type: 'interview_panel' as const,
              title: `Interview Panel - ${advert.title || advert.position?.name}`,
              description: `Scheduled interview${advert.interview_date ? ` on ${new Date(advert.interview_date).toLocaleDateString()}` : ''}`,
              status: 'pending' as const,
              priority: 'medium' as TaskPriority,
              requestor: advert.published_by?.first_name ? `${advert.published_by.first_name} ${advert.published_by.last_name}` : 'HR',
              dueDate: advert.interview_date,
              createdAt: advert.created_datetime,
              metadata: advert,
              detailsUrl: `/dashboard/hr/jobs/advertisements/${advert.id}`,
            });
          }
        }
      }

      return tasks;
    } catch (error: any) {
      console.warn('Interview panel tasks endpoint not available:', error.response?.status);
      return [];
    }
  };

  // Fetch Staff Requisitions pending approval
  const fetchStaffRequisitions = async (): Promise<UnifiedTask[]> => {
    try {
      const response = await AxiosWithToken.get('/hr/staffing-requisitions/pending-approvals/');
      const data = response.data.results || response.data.data?.results || response.data.data || [];

      return data.map((req: any) => ({
        id: `staff_req_${req.id}`,
        type: 'staff_requisition' as const,
        title: `Staff Requisition - ${req.position?.title || 'Position'}`,
        description: `${req.number_of_staff} staff needed for ${req.department?.name || 'Department'}`,
        status: 'pending' as const,
        priority: (req.position_nature === 'NEW' ? 'high' : 'medium') as TaskPriority,
        requestor: req.created_by?.name || req.created_by?.email,
        dueDate: req.expected_date_of_resumption,
        createdAt: req.created_at || req.created_datetime,
        metadata: req,
        detailsUrl: `/dashboard/hr/staffing-requisitions/${req.id}`,
      }));
    } catch (error: any) {
      console.warn('Staff requisitions endpoint not available:', error.response?.status);
      return [];
    }
  };

  // Fetch Adhoc Staff requests pending approval
  const fetchAdhocStaffRequests = async (): Promise<UnifiedTask[]> => {
    try {
      const response = await AxiosWithToken.get('/hr/adhoc-staff/', {
        params: { status: 'PENDING' }
      });
      const data = response.data.results || response.data.data?.results || [];

      return data.map((adhoc: any) => ({
        id: `adhoc_${adhoc.id}`,
        type: 'adhoc_staff' as const,
        title: `Adhoc Staff Request - ${adhoc.full_name || 'Staff'}`,
        description: `${adhoc.role || 'Adhoc position'} for ${adhoc.duration || 'specified duration'}`,
        status: 'pending' as const,
        priority: 'medium' as TaskPriority,
        requestor: adhoc.requested_by?.full_name || adhoc.requested_by?.email,
        amount: adhoc.proposed_amount || adhoc.total_amount,
        dueDate: adhoc.end_date,
        createdAt: adhoc.created_datetime || adhoc.created_at,
        metadata: adhoc,
        detailsUrl: `/dashboard/hr/adhoc-staff/${adhoc.id}`,
      }));
    } catch (error: any) {
      console.warn('Adhoc staff requests endpoint not available:', error.response?.status);
      return [];
    }
  };

  // Fetch Item Requisitions pending approval
  const fetchItemRequisitions = async (): Promise<UnifiedTask[]> => {
    try {
      const response = await AxiosWithToken.get('/inventory/item-requisitions/', {
        params: { status: 'PENDING' }
      });
      const data = response.data.results || response.data.data?.results || [];

      return data.map((item: any) => ({
        id: `item_req_${item.id}`,
        type: 'item_requisition' as const,
        title: `Item Requisition #${item.requisition_number || item.id}`,
        description: item.purpose || item.description || 'Item requisition pending approval',
        status: 'pending' as const,
        priority: (item.priority || 'medium') as TaskPriority,
        requestor: item.requested_by?.full_name || item.requested_by?.email,
        dueDate: item.required_date || item.needed_by_date,
        createdAt: item.created_datetime || item.created_at,
        metadata: item,
        detailsUrl: `/dashboard/inventory/item-requisitions/${item.id}`,
      }));
    } catch (error: any) {
      console.warn('Item requisitions endpoint not available:', error.response?.status);
      return [];
    }
  };

  // Fetch all tasks and approvals
  const fetchAllTasks = useCallback(async () => {
    setIsLoading(true);
    try {
      const [
        purchaseRequests,
        leaveRequests,
        timesheets,
        paymentRequests,
        vehicleRequests,
        expenseAuths,
        contractRequests,
        cbaTasks,
        interviewPanelTasks,
        staffRequisitions,
        adhocStaffRequests,
        itemRequisitions,
      ] = await Promise.all([
        fetchPurchaseRequests(),
        fetchLeaveRequests(),
        fetchTimesheets(),
        fetchPaymentRequests(),
        fetchVehicleRequests(),
        fetchExpenseAuthorizations(),
        fetchContractRequests(),
        fetchCBATasks(),
        fetchInterviewPanelTasks(),
        fetchStaffRequisitions(),
        fetchAdhocStaffRequests(),
        fetchItemRequisitions(),
      ]);

      const allTasks = [
        ...purchaseRequests,
        ...leaveRequests,
        ...timesheets,
        ...paymentRequests,
        ...vehicleRequests,
        ...expenseAuths,
        ...contractRequests,
        ...cbaTasks,
        ...interviewPanelTasks,
        ...staffRequisitions,
        ...adhocStaffRequests,
        ...itemRequisitions,
      ];

      // Sort by priority and date
      allTasks.sort((a, b) => {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
        if (priorityDiff !== 0) return priorityDiff;

        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });

      setTasks(allTasks);
    } catch (error) {
      console.error('Error fetching tasks and approvals:', error);
      toast({
        title: 'Error',
        description: 'Failed to load tasks and approvals',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Approve a task
  const approveTask = useCallback(async (task: UnifiedTask, comments?: string) => {
    try {
      let endpoint = '';
      const parts = task.id.split('_');
      const baseId = parts[parts.length - 1]; // Get last part (UUID)

      switch (task.type) {
        case 'purchase_request':
          endpoint = `/procurements/purchase-request/${baseId}/approve/`;
          break;
        case 'leave_request':
          endpoint = `/hr/leave-request/${baseId}/approve/`;
          break;
        case 'timesheet':
          endpoint = `/hr/time-sheet/time-sheet/${baseId}/approve/`;
          break;
        case 'payment_request':
          endpoint = `/admins/payments/requests/${baseId}/approve/`;
          break;
        case 'vehicle_request':
          endpoint = `/admins/fleets/vehicles/requests/${baseId}/approve/`;
          break;
        case 'expense_authorization':
          endpoint = `/admins/authorization/expenses/${baseId}/approve/`;
          break;
        case 'contract_request':
          endpoint = `/contract-grants/contract-requests/${baseId}/approve/`;
          break;
        case 'cba_review':
          endpoint = `/procurements/cbas/${baseId}/review/`;
          await AxiosWithToken.post(endpoint, { comments });
          break;
        case 'cba_authorise':
          endpoint = `/procurements/cbas/${baseId}/authorise/`;
          await AxiosWithToken.post(endpoint, { comments });
          break;
        case 'cba_approve':
          endpoint = `/procurements/cbas/${baseId}/approve/`;
          await AxiosWithToken.post(endpoint, { comments });
          break;
        case 'interview_panel':
          // Interview panels are informational, redirect to details page
          throw new Error('Interview panel tasks cannot be approved directly. Please view details.');
        case 'staff_requisition':
          endpoint = `/hr/staffing-requisitions/${baseId}/approve/`;
          break;
        case 'adhoc_staff':
          endpoint = `/hr/adhoc-staff/${baseId}/approve/`;
          break;
        case 'item_requisition':
          endpoint = `/inventory/item-requisitions/${baseId}/approve/`;
          break;
        default:
          throw new Error('Unknown task type');
      }

      if (!endpoint.includes('cbas')) {
        await AxiosWithToken.post(endpoint, { status: 'approved', comments });
      }

      // Remove from tasks list
      setTasks(prev => prev.filter(t => t.id !== task.id));

      toast({
        title: 'Success',
        description: `${task.title} has been approved`,
      });
    } catch (error: any) {
      console.error('Error approving task:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to approve task',
        variant: 'destructive',
      });
      throw error;
    }
  }, [toast]);

  // Reject a task
  const rejectTask = useCallback(async (task: UnifiedTask, reason?: string) => {
    try {
      let endpoint = '';
      const parts = task.id.split('_');
      const baseId = parts[parts.length - 1]; // Get last part (UUID)

      switch (task.type) {
        case 'purchase_request':
          endpoint = `/procurements/purchase-request/${baseId}/reject/`;
          break;
        case 'leave_request':
          endpoint = `/hr/leave-request/${baseId}/reject/`;
          break;
        case 'timesheet':
          endpoint = `/hr/time-sheet/time-sheet/${baseId}/reject/`;
          break;
        case 'payment_request':
          endpoint = `/admins/payments/requests/${baseId}/reject/`;
          break;
        case 'vehicle_request':
          endpoint = `/admins/fleets/vehicles/requests/${baseId}/reject/`;
          break;
        case 'expense_authorization':
          endpoint = `/admins/authorization/expenses/${baseId}/reject/`;
          break;
        case 'contract_request':
          endpoint = `/contract-grants/contract-requests/${baseId}/reject/`;
          break;
        case 'cba_review':
          endpoint = `/procurements/cbas/${baseId}/review-reject/`;
          await AxiosWithToken.post(endpoint, { comments: reason });
          break;
        case 'cba_authorise':
          endpoint = `/procurements/cbas/${baseId}/authorise-reject/`;
          await AxiosWithToken.post(endpoint, { comments: reason });
          break;
        case 'cba_approve':
          endpoint = `/procurements/cbas/${baseId}/approve-reject/`;
          await AxiosWithToken.post(endpoint, { comments: reason });
          break;
        case 'interview_panel':
          // Interview panels are informational, cannot be rejected
          throw new Error('Interview panel tasks cannot be rejected');
        case 'staff_requisition':
          endpoint = `/hr/staffing-requisitions/${baseId}/reject/`;
          break;
        case 'adhoc_staff':
          endpoint = `/hr/adhoc-staff/${baseId}/reject/`;
          break;
        case 'item_requisition':
          endpoint = `/inventory/item-requisitions/${baseId}/reject/`;
          break;
        default:
          throw new Error('Unknown task type');
      }

      if (!endpoint.includes('cbas')) {
        await AxiosWithToken.post(endpoint, { status: 'rejected', reason });
      }

      // Remove from tasks list
      setTasks(prev => prev.filter(t => t.id !== task.id));

      toast({
        title: 'Success',
        description: `${task.title} has been rejected`,
      });
    } catch (error: any) {
      console.error('Error rejecting task:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to reject task',
        variant: 'destructive',
      });
      throw error;
    }
  }, [toast]);

  // Load tasks on mount
  useEffect(() => {
    fetchAllTasks();
  }, [fetchAllTasks]);

  return {
    tasks,
    isLoading,
    approveTask,
    rejectTask,
    refetch: fetchAllTasks,
  };
};
