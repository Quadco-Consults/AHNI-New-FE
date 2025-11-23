import React from 'react';
import { useProgramOfficerPermissions } from '../../hooks/useProgramOfficerPermissions';
import { useAppSelector } from '../../store/hooks';

/**
 * Permission Test Component for Program Officers
 * Use this component to verify that permissions are working correctly
 *
 * To use this component:
 * 1. Import it into your app
 * 2. Add it as a route (e.g., /debug/permissions)
 * 3. Navigate to it as a Program Officer user
 * 4. Verify the permissions match expectations
 */
export const PermissionTestComponent: React.FC = () => {
  const permissions = useProgramOfficerPermissions();
  const currentUser = useAppSelector((state) => state.auth.user);

  if (!currentUser) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          <h3 className="font-bold">No User Logged In</h3>
          <p>Please log in to test permissions.</p>
        </div>
      </div>
    );
  }

  const renderPermissionItem = (permission: boolean, label: string, expected: boolean) => {
    const isCorrect = permission === expected;
    const statusIcon = permission ? '✅' : '❌';
    const correctnessIcon = isCorrect ? '✅' : '⚠️';

    return (
      <li className={`flex justify-between items-center p-2 rounded ${
        isCorrect ? 'bg-green-50' : 'bg-red-50'
      }`}>
        <span className="flex-1">{label}</span>
        <span className="mx-4">{statusIcon} {permission ? 'True' : 'False'}</span>
        <span className="text-sm">
          {correctnessIcon} {isCorrect ? 'Correct' : `Expected: ${expected ? 'True' : 'False'}`}
        </span>
      </li>
    );
  };

  // Expected permissions for Program Officer role
  const expectedPermissions = {
    // Should be TRUE for Program Officer
    canCreateWorkplan: true,
    canCreateFundRequest: true,
    canCreateLeaveRequest: true,
    canCreateTimesheet: true,
    canApplyForJob: true,
    canCreatePurchaseRequest: true,
    canCreateEA: true,
    canCreateTER: true,
    canCreateItemRequisition: true,
    canCreateAdhocRequisition: true,
    canCreateAnnualPlan: true,
    canCreateSiteVisit: true,
    canCreateActivityMemo: true,

    // View permissions should also be true
    canViewWorkplan: true,
    canViewFundRequest: true,
    canViewLeaveRequest: true,
    canViewTimesheet: true,
    canViewPurchaseRequest: true,
    canViewEA: true,
    canViewTER: true,
    canViewItemRequisition: true,

    // Edit permissions should be true
    canEditWorkplan: true,
    canEditFundRequest: true,
    canEditLeaveRequest: true,
    canEditTimesheet: true,
    canEditPurchaseRequest: true,
    canEditEA: true,
    canEditTER: true,
    canEditItemRequisition: true,

    // Should be FALSE for Program Officer (approval permissions)
    canApprove: false,
    canAuthorize: false,
    canReview: false,
  };

  const correctPermissions = Object.entries(expectedPermissions).filter(
    ([key, expected]) => permissions[key as keyof typeof permissions] === expected
  ).length;

  const totalPermissions = Object.keys(expectedPermissions).length;
  const accuracy = (correctPermissions / totalPermissions) * 100;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Program Officer Permission Test</h1>

        {/* Overall Status */}
        <div className={`p-4 rounded-lg mb-6 ${
          accuracy === 100 ? 'bg-green-100 border border-green-400' : 'bg-yellow-100 border border-yellow-400'
        }`}>
          <h2 className="text-xl font-semibold mb-2">
            Overall Status: {accuracy === 100 ? '✅ All Good!' : '⚠️ Issues Found'}
          </h2>
          <p className="text-lg">
            Accuracy: {correctPermissions}/{totalPermissions} ({accuracy.toFixed(1)}%)
          </p>
          {permissions.isProgramOfficer && (
            <p className="text-green-700 font-semibold mt-2">✅ User identified as Program Officer</p>
          )}
        </div>

        {/* User Info */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="text-lg font-semibold mb-2">User Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p><strong>Name:</strong> {currentUser.first_name} {currentUser.last_name}</p>
              <p><strong>Email:</strong> {currentUser.email}</p>
              <p><strong>Username:</strong> {currentUser.username}</p>
            </div>
            <div>
              <p><strong>Total Permissions:</strong> {
                currentUser.permissions?.reduce((total, module) => total + module.permissions.length, 0) || 0
              }</p>
              <p><strong>Permission Modules:</strong> {
                currentUser.permissions?.map(p => p.module).join(', ') || 'None'
              }</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Create Permissions */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-xl font-semibold text-green-700 mb-4">✅ Create Permissions (Should be TRUE)</h3>
          <ul className="space-y-2">
            {renderPermissionItem(permissions.canCreateWorkplan, 'Can create workplan', true)}
            {renderPermissionItem(permissions.canCreateFundRequest, 'Can create fund request', true)}
            {renderPermissionItem(permissions.canCreateLeaveRequest, 'Can create leave request', true)}
            {renderPermissionItem(permissions.canCreateTimesheet, 'Can create timesheet', true)}
            {renderPermissionItem(permissions.canApplyForJob, 'Can apply for job', true)}
            {renderPermissionItem(permissions.canCreatePurchaseRequest, 'Can create purchase request', true)}
            {renderPermissionItem(permissions.canCreateEA, 'Can create expense authorization', true)}
            {renderPermissionItem(permissions.canCreateTER, 'Can create travel expense report', true)}
            {renderPermissionItem(permissions.canCreateItemRequisition, 'Can create item requisition', true)}
            {renderPermissionItem(permissions.canCreateAdhocRequisition, 'Can create adhoc requisition', true)}
          </ul>
        </div>

        {/* Approval Permissions */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-xl font-semibold text-red-700 mb-4">❌ Approval Permissions (Should be FALSE)</h3>
          <ul className="space-y-2">
            {renderPermissionItem(permissions.canApprove, 'Can approve requests', false)}
            {renderPermissionItem(permissions.canAuthorize, 'Can authorize requests', false)}
            {renderPermissionItem(permissions.canReview, 'Can review requests', false)}
          </ul>
          <div className="mt-4 p-3 bg-blue-50 rounded">
            <p className="text-sm text-blue-700">
              <strong>Note:</strong> Program Officers should NOT have approval permissions.
              They can create and manage their own requests but cannot approve others' requests.
            </p>
          </div>
        </div>

        {/* View Permissions */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-xl font-semibold text-blue-700 mb-4">👁️ View Permissions (Should be TRUE)</h3>
          <ul className="space-y-2">
            {renderPermissionItem(permissions.canViewWorkplan, 'Can view workplan', true)}
            {renderPermissionItem(permissions.canViewFundRequest, 'Can view fund request', true)}
            {renderPermissionItem(permissions.canViewLeaveRequest, 'Can view leave request', true)}
            {renderPermissionItem(permissions.canViewTimesheet, 'Can view timesheet', true)}
            {renderPermissionItem(permissions.canViewPurchaseRequest, 'Can view purchase request', true)}
            {renderPermissionItem(permissions.canViewEA, 'Can view expense authorization', true)}
            {renderPermissionItem(permissions.canViewTER, 'Can view travel expense report', true)}
          </ul>
        </div>

        {/* Edit Permissions */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-xl font-semibold text-purple-700 mb-4">✏️ Edit Permissions (Should be TRUE)</h3>
          <ul className="space-y-2">
            {renderPermissionItem(permissions.canEditWorkplan, 'Can edit workplan', true)}
            {renderPermissionItem(permissions.canEditFundRequest, 'Can edit fund request', true)}
            {renderPermissionItem(permissions.canEditLeaveRequest, 'Can edit leave request', true)}
            {renderPermissionItem(permissions.canEditTimesheet, 'Can edit timesheet', true)}
            {renderPermissionItem(permissions.canEditPurchaseRequest, 'Can edit purchase request', true)}
            {renderPermissionItem(permissions.canEditEA, 'Can edit expense authorization', true)}
            {renderPermissionItem(permissions.canEditTER, 'Can edit travel expense report', true)}
          </ul>
        </div>
      </div>

      {/* Computed Properties */}
      <div className="mt-8 bg-white shadow rounded-lg p-6">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">📊 Computed Properties</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-3 bg-gray-50 rounded">
            <p className="font-semibold">Has Program Permissions</p>
            <p className={permissions.hasAnyProgramPermissions ? 'text-green-600' : 'text-red-600'}>
              {permissions.hasAnyProgramPermissions ? '✅ Yes' : '❌ No'}
            </p>
          </div>
          <div className="p-3 bg-gray-50 rounded">
            <p className="font-semibold">Has HR Permissions</p>
            <p className={permissions.hasAnyHRPermissions ? 'text-green-600' : 'text-red-600'}>
              {permissions.hasAnyHRPermissions ? '✅ Yes' : '❌ No'}
            </p>
          </div>
          <div className="p-3 bg-gray-50 rounded">
            <p className="font-semibold">Has Procurement Permissions</p>
            <p className={permissions.hasAnyProcurementPermissions ? 'text-green-600' : 'text-red-600'}>
              {permissions.hasAnyProcurementPermissions ? '✅ Yes' : '❌ No'}
            </p>
          </div>
          <div className="p-3 bg-gray-50 rounded">
            <p className="font-semibold">Is Program Officer</p>
            <p className={permissions.isProgramOfficer ? 'text-green-600' : 'text-red-600'}>
              {permissions.isProgramOfficer ? '✅ Yes' : '❌ No'}
            </p>
          </div>
        </div>
      </div>

      {/* Raw Permission Data */}
      <div className="mt-8 bg-white shadow rounded-lg p-6">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">🔍 Raw Permission Data</h3>
        <details className="cursor-pointer">
          <summary className="font-semibold mb-2">Click to view raw permission data</summary>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-96">
            {JSON.stringify(currentUser.permissions, null, 2)}
          </pre>
        </details>
      </div>

      {/* Instructions */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-blue-800 mb-4">📋 Testing Instructions</h3>
        <ol className="list-decimal list-inside space-y-2 text-blue-700">
          <li>Ensure you're logged in as a Program Officer user</li>
          <li>Verify that all create permissions show ✅ (green checkmarks)</li>
          <li>Verify that all approval permissions show ❌ (red X marks) </li>
          <li>Check that "Is Program Officer" shows ✅</li>
          <li>If any permissions are incorrect, check the backend role assignment</li>
          <li>Use your browser's developer tools to inspect the raw permission data</li>
        </ol>
      </div>
    </div>
  );
};