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
      ] = await Promise.all([
        fetchPurchaseRequests(),
        fetchLeaveRequests(),
        fetchTimesheets(),
        fetchPaymentRequests(),
        fetchVehicleRequests(),
        fetchExpenseAuthorizations(),
        fetchContractRequests(),
      ]);

      const allTasks = [
        ...purchaseRequests,
        ...leaveRequests,
        ...timesheets,
        ...paymentRequests,
        ...vehicleRequests,
        ...expenseAuths,
        ...contractRequests,
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
  const approveTask = useCallback(async (task: UnifiedTask) => {
    try {
      let endpoint = '';
      const baseId = task.id.split('_')[1];

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
        default:
          throw new Error('Unknown task type');
      }

      await AxiosWithToken.post(endpoint, { status: 'approved' });

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
      const baseId = task.id.split('_')[1];

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
        default:
          throw new Error('Unknown task type');
      }

      await AxiosWithToken.post(endpoint, { status: 'rejected', reason });

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
