/**
 * Program Admin Integration Example
 *
 * This component demonstrates how to use the Program Admin functionality
 * with your existing endpoints - NO NEW ENDPOINTS REQUIRED!
 */

'use client';

import React from 'react';
import { useProgramAdmin } from '@/hooks/useProgramAdmin';
import { useUnifiedPermissions } from '@/hooks/useUnifiedPermissions';

// Example: Enhanced Fund Request List with Program Admin features
export const ProgramAdminFundRequests = () => {
  const { user } = useUnifiedPermissions();
  const {
    isProgramAdmin,
    canApproveHighValue,
    financialApprovalLimit,
    canApproveAmount,
    adminLevel
  } = useProgramAdmin();

  // Use your existing endpoint - it automatically works with enhanced permissions!
  // const { data: fundRequests, isLoading } = useGetAllFundRequests({
  //   page: 1,
  //   size: 20,
  //   // Program Admins automatically see more requests through backend permission logic
  // });

  if (!isProgramAdmin) {
    return (
      <div className="p-4 bg-gray-50 rounded">
        <p>This section is only available for Program Admins.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Program Admin Dashboard Header */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-emerald-800">
              👨‍💼 Program Admin Dashboard
            </h2>
            <p className="text-emerald-600 mt-1">
              Welcome, {user?.first_name}! You have {adminLevel} level access.
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-emerald-700">Financial Authority</div>
            <div className="text-lg font-bold text-emerald-800">
              ${financialApprovalLimit.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Fund Request Management */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">💰 Fund Request Management</h3>

        {/* Program Admin gets enhanced fund request view using SAME ENDPOINT */}
        <div className="space-y-4">
          {/* Example fund request items - using existing data structure */}
          {[
            { id: 1, title: 'Training Program Q4', amount: 15000, status: 'pending' },
            { id: 2, title: 'Equipment Purchase', amount: 45000, status: 'under_review' },
            { id: 3, title: 'Field Operations', amount: 120000, status: 'pending_approval' }
          ].map(request => (
            <div key={request.id} className="border rounded p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">{request.title}</h4>
                  <p className="text-sm text-gray-600">
                    Amount: ${request.amount.toLocaleString()}
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs rounded ${{
                    'pending': 'bg-yellow-100 text-yellow-800',
                    'under_review': 'bg-blue-100 text-blue-800',
                    'pending_approval': 'bg-orange-100 text-orange-800'
                  }[request.status]}`}>
                    {request.status.replace('_', ' ')}
                  </span>

                  {/* Program Admin gets enhanced approval buttons */}
                  {canApproveAmount(request.amount) && (
                    <button className="px-3 py-1 bg-emerald-600 text-white text-sm rounded hover:bg-emerald-700">
                      Quick Approve
                    </button>
                  )}

                  {request.amount > financialApprovalLimit && (
                    <span className="text-xs text-red-600">
                      Requires higher authority
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Enhanced Work Plan Management */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">📋 Work Plan Oversight</h3>

        {/* Program Admin sees all work plans using SAME ENDPOINT with enhanced permissions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { id: 1, name: 'Community Health Program', progress: 75, officer: 'John Doe' },
            { id: 2, name: 'Education Initiative', progress: 45, officer: 'Jane Smith' },
            { id: 3, name: 'Water & Sanitation', progress: 90, officer: 'Mike Johnson' }
          ].map(workplan => (
            <div key={workplan.id} className="border rounded p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">{workplan.name}</h4>
                <span className="text-sm text-gray-600">{workplan.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div
                  className="bg-emerald-600 h-2 rounded-full"
                  style={{ width: `${workplan.progress}%` }}
                ></div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Officer: {workplan.officer}</span>
                {/* Program Admin gets admin controls using existing endpoints */}
                <button className="text-emerald-600 hover:text-emerald-800">
                  Review
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Program Admin Analytics */}
      {canApproveHighValue && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">📊 Program Analytics</h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { label: 'Total Programs', value: '12', color: 'blue' },
              { label: 'Pending Approvals', value: '5', color: 'orange' },
              { label: 'This Month Budget', value: '$245K', color: 'green' },
              { label: 'Completion Rate', value: '78%', color: 'purple' }
            ].map(metric => (
              <div key={metric.label} className={`bg-${metric.color}-50 border border-${metric.color}-200 rounded p-4`}>
                <div className={`text-2xl font-bold text-${metric.color}-800`}>
                  {metric.value}
                </div>
                <div className={`text-sm text-${metric.color}-600`}>
                  {metric.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Example: Program Admin Badge Component
export const ProgramAdminBadge = () => {
  const { isProgramAdmin, adminLevel } = useProgramAdmin();

  if (!isProgramAdmin) return null;

  return (
    <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded ${{
      junior: 'bg-emerald-100 text-emerald-800',
      senior: 'bg-emerald-200 text-emerald-900',
      executive: 'bg-yellow-100 text-yellow-800'
    }[adminLevel]}`}>
      👨‍💼 Program Admin ({adminLevel})
    </span>
  );
};

// Example: Conditional Actions based on Program Admin status
export const ConditionalProgramActions = ({ fundRequest }: { fundRequest: any }) => {
  const { isProgramAdmin, canApproveAmount, canModifyWorkPlans } = useProgramAdmin();

  return (
    <div className="flex space-x-2">
      {/* Regular actions available to all Program Officers */}
      <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded">
        View Details
      </button>

      {/* Enhanced actions only for Program Admins */}
      {isProgramAdmin && (
        <>
          {canApproveAmount(fundRequest?.amount || 0) && (
            <button className="px-3 py-1 bg-emerald-600 text-white text-sm rounded">
              Quick Approve
            </button>
          )}

          {canModifyWorkPlans && (
            <button className="px-3 py-1 bg-orange-600 text-white text-sm rounded">
              Admin Edit
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default ProgramAdminFundRequests;