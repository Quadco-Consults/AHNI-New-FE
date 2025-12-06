import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useProgramOfficerPermissions } from '../../hooks/useProgramOfficerPermissions';

// Example 1: Workplan Page Component
export const WorkplanPage: React.FC = () => {
  const navigate = useNavigate();
  const { canCreateWorkplan, canEditWorkplan, canViewWorkplan } = useProgramOfficerPermissions();

  // If user doesn't have view permission, deny access
  if (!canViewWorkplan) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Access Denied</h3>
          <p className="text-gray-600">You don't have permission to view workplans</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Page Header with conditional create button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Workplans</h1>
        {canCreateWorkplan && (
          <button
            onClick={() => navigate('/programs/workplans/create')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Create Workplan
          </button>
        )}
      </div>

      {/* Workplan Table Component */}
      <WorkplanTable canEdit={canEditWorkplan} />
    </div>
  );
};

// Example 2: Fund Request Form Component
export const FundRequestForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { canCreateFundRequest, canEditFundRequest } = useProgramOfficerPermissions();

  const isEditMode = Boolean(id);
  const hasPermission = isEditMode ? canEditFundRequest : canCreateFundRequest;

  // Check permissions
  if (!hasPermission) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Access Denied</h3>
          <p className="text-gray-600">
            You don't have permission to {isEditMode ? 'edit' : 'create'} fund requests
          </p>
        </div>
      </div>
    );
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Handle form submission
    console.log('Fund request submitted');
    navigate('/programs/fund-requests');
  };

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          {isEditMode ? 'Edit' : 'Create'} Fund Request
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Form fields would go here */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Title
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount Requested
              </label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/programs/fund-requests')}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              {isEditMode ? 'Update' : 'Create'} Fund Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Example 3: Approval Actions Component (Should NOT show for Program Officer)
interface ApprovalActionsProps {
  request: {
    id: string;
    status: string;
    type: string;
  };
}

export const ApprovalActions: React.FC<ApprovalActionsProps> = ({ request }) => {
  const { canApprove, canAuthorize, canReview } = useProgramOfficerPermissions();

  // Program Officers should NOT see approval buttons
  const hasAnyApprovalPermissions = canApprove || canAuthorize || canReview;

  if (!hasAnyApprovalPermissions) {
    return null; // Don't render anything for Program Officers
  }

  const handleAction = (action: string) => {
    console.log(`${action} action for request ${request.id}`);
    // Handle approval actions
  };

  return (
    <div className="flex space-x-2">
      {canReview && (
        <button
          onClick={() => handleAction('review')}
          className="px-3 py-1 text-sm bg-yellow-100 text-yellow-800 rounded-md hover:bg-yellow-200 transition-colors"
        >
          Review
        </button>
      )}
      {canApprove && (
        <button
          onClick={() => handleAction('approve')}
          className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded-md hover:bg-green-200 transition-colors"
        >
          Approve
        </button>
      )}
      {canAuthorize && (
        <button
          onClick={() => handleAction('authorize')}
          className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200 transition-colors"
        >
          Authorize
        </button>
      )}
    </div>
  );
};

// Example 4: Purchase Request Component with Permission Checks
export const PurchaseRequestPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    canCreatePurchaseRequest,
    canViewPurchaseRequest,
    canEditPurchaseRequest
  } = useProgramOfficerPermissions();

  if (!canViewPurchaseRequest) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Access Denied</h3>
          <p className="text-gray-600">You don't have permission to view purchase requests</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Purchase Requests</h1>
        {canCreatePurchaseRequest && (
          <button
            onClick={() => navigate('/procurement/purchase-requests/create')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Create Purchase Request
          </button>
        )}
      </div>

      <PurchaseRequestTable canEdit={canEditPurchaseRequest} />
    </div>
  );
};

// Example 5: Quick Actions Dashboard Component
export const QuickActionsDashboard: React.FC = () => {
  const navigate = useNavigate();
  const {
    canCreateWorkplan,
    canCreateFundRequest,
    canCreateLeaveRequest,
    canCreateTimesheet,
    canApplyForJob,
    canCreatePurchaseRequest,
    canCreateEA,
    canCreateTER
  } = useProgramOfficerPermissions();

  const quickActions = [
    {
      title: 'Create Workplan',
      description: 'Start a new program workplan',
      path: '/programs/workplans/create',
      enabled: canCreateWorkplan,
      icon: '📋'
    },
    {
      title: 'Fund Request',
      description: 'Request funding for your project',
      path: '/programs/fund-requests/create',
      enabled: canCreateFundRequest,
      icon: '💰'
    },
    {
      title: 'Leave Request',
      description: 'Apply for time off',
      path: '/hr/leave-requests/create',
      enabled: canCreateLeaveRequest,
      icon: '📅'
    },
    {
      title: 'Timesheet',
      description: 'Submit your timesheet',
      path: '/hr/timesheet/create',
      enabled: canCreateTimesheet,
      icon: '⏰'
    },
    {
      title: 'Job Application',
      description: 'Apply for open positions',
      path: '/hr/job-applications/create',
      enabled: canApplyForJob,
      icon: '👔'
    },
    {
      title: 'Purchase Request',
      description: 'Request procurement items',
      path: '/procurement/purchase-requests/create',
      enabled: canCreatePurchaseRequest,
      icon: '🛒'
    },
    {
      title: 'Expense Authorization',
      description: 'Create expense authorization',
      path: '/administration/expense-authorization/create',
      enabled: canCreateEA,
      icon: '📄'
    },
    {
      title: 'Travel Expense',
      description: 'Submit travel expense report',
      path: '/administration/travel-expense-report/create',
      enabled: canCreateTER,
      icon: '✈️'
    }
  ].filter(action => action.enabled); // Only show actions user can perform

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>

      {quickActions.length === 0 ? (
        <p className="text-gray-500">No quick actions available based on your permissions.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <button
              key={action.title}
              onClick={() => navigate(action.path)}
              className="p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-200 text-left"
            >
              <div className="text-2xl mb-2">{action.icon}</div>
              <h3 className="font-semibold text-gray-900 mb-1">{action.title}</h3>
              <p className="text-sm text-gray-600">{action.description}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Helper Components (would be implemented separately)
const WorkplanTable: React.FC<{ canEdit: boolean }> = ({ canEdit }) => {
  return (
    <div className="bg-white shadow rounded-lg">
      <div className="p-4">
        <p>Workplan table would go here. Edit enabled: {canEdit ? 'Yes' : 'No'}</p>
      </div>
    </div>
  );
};

const PurchaseRequestTable: React.FC<{ canEdit: boolean }> = ({ canEdit }) => {
  return (
    <div className="bg-white shadow rounded-lg">
      <div className="p-4">
        <p>Purchase request table would go here. Edit enabled: {canEdit ? 'Yes' : 'No'}</p>
      </div>
    </div>
  );
};