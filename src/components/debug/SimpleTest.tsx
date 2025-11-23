import React from 'react';
import { useProgramOfficerPermissions } from '../../hooks/useProgramOfficerPermissions';
import { useAppSelector } from '../../store/hooks';

/**
 * Simple Test Component - Quick verification after login fix
 */
export const SimpleTest: React.FC = () => {
  const authState = useAppSelector((state) => state.auth);
  const permissions = useProgramOfficerPermissions();

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">🧪 Simple Login Test</h1>

      {/* Authentication Status */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Authentication Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className={`p-3 rounded ${authState.isAuthenticated ? 'bg-green-100' : 'bg-red-100'}`}>
            <strong>Authenticated:</strong> {authState.isAuthenticated ? '✅ Yes' : '❌ No'}
          </div>
          <div className={`p-3 rounded ${authState.loading ? 'bg-yellow-100' : 'bg-green-100'}`}>
            <strong>Loading:</strong> {authState.loading ? '⏳ Yes' : '✅ No'}
          </div>
          <div className={`p-3 rounded ${authState.user ? 'bg-green-100' : 'bg-red-100'}`}>
            <strong>User:</strong> {authState.user ? '✅ Loaded' : '❌ Missing'}
          </div>
        </div>
      </div>

      {/* Permission Counts */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Permission Counts</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="p-3 bg-gray-100 rounded">
            <strong>Total Permissions:</strong><br/>
            {authState.permissions?.length || 0} modules
          </div>
          <div className="p-3 bg-gray-100 rounded">
            <strong>User Permissions:</strong><br/>
            {authState.user?.permissions?.length || 0} modules
          </div>
          <div className="p-3 bg-gray-100 rounded">
            <strong>Roles:</strong><br/>
            {authState.roles?.length || authState.user?.roles?.length || 0}
          </div>
          <div className="p-3 bg-gray-100 rounded">
            <strong>Hook Ready:</strong><br/>
            {permissions.hasPermission ? '✅ Yes' : '❌ No'}
          </div>
        </div>
      </div>

      {/* Key Permission Tests */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Key Program Officer Permissions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h3 className="font-medium text-green-700">Should be TRUE:</h3>
            <ul className="text-sm space-y-1">
              <li>Can create workplan: {permissions.canCreateWorkplan ? '✅' : '❌'}</li>
              <li>Can create fund request: {permissions.canCreateFundRequest ? '✅' : '❌'}</li>
              <li>Can create leave request: {permissions.canCreateLeaveRequest ? '✅' : '❌'}</li>
              <li>Can create timesheet: {permissions.canCreateTimesheet ? '✅' : '❌'}</li>
              <li>Can create purchase request: {permissions.canCreatePurchaseRequest ? '✅' : '❌'}</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium text-red-700">Should be FALSE:</h3>
            <ul className="text-sm space-y-1">
              <li>Can approve: {permissions.canApprove ? '❌' : '✅'}</li>
              <li>Can authorize: {permissions.canAuthorize ? '❌' : '✅'}</li>
              <li>Can review: {permissions.canReview ? '❌' : '✅'}</li>
            </ul>
          </div>
        </div>
      </div>

      {/* User Info */}
      {authState.user && (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">User Information</h2>
          <div className="text-sm space-y-1">
            <p><strong>Name:</strong> {authState.user.first_name} {authState.user.last_name}</p>
            <p><strong>Email:</strong> {authState.user.email}</p>
            <p><strong>ID:</strong> {authState.user.id}</p>
            <p><strong>Active:</strong> {authState.user.is_active ? 'Yes' : 'No'}</p>
            <p><strong>Staff:</strong> {authState.user.is_staff ? 'Yes' : 'No'}</p>
          </div>
        </div>
      )}

      {/* Raw Data Preview */}
      <details className="mt-6">
        <summary className="cursor-pointer font-semibold">🔍 View Raw Auth Data</summary>
        <pre className="mt-2 p-4 bg-gray-100 rounded text-xs overflow-auto max-h-96">
          {JSON.stringify(authState, null, 2)}
        </pre>
      </details>
    </div>
  );
};