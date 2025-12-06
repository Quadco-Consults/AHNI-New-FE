import React, { useEffect } from 'react';
import { useAppSelector } from '../../store/hooks';
import { useOrganizationalAccess } from '../../hooks/useOrganizationalAccess';

/**
 * Debug component to test the enhanced login flow and organizational access
 * Shows detailed breakdown of user's organizational context and permissions
 */
export function LoginTestComponent() {
  const authState = useAppSelector((state) => state.auth);
  const orgAccess = useOrganizationalAccess();

  useEffect(() => {
    console.log('🧪 LOGIN TEST - Auth State:', {
      isAuthenticated: authState.isAuthenticated,
      loading: authState.loading,
      hasUser: !!authState.user,
      userPermissionsCount: (authState.permissions || []).length,
      user: authState.user,
      permissions: authState.permissions,
      roles: authState.roles
    });

    console.log('🏢 ORGANIZATIONAL ACCESS TEST:', {
      canViewPrograms: orgAccess.canViewModule('programs'),
      canCreateInPrograms: orgAccess.canCreateInModule('programs'),
      canApproveInPrograms: orgAccess.canApproveInModule('programs'),
      dashboardConfig: orgAccess.getDashboardConfig(),
      menuStructure: orgAccess.getMenuStructure(),
      accessibleLocations: orgAccess.getAccessibleLocations(),
      accessibleDepartments: orgAccess.getAccessibleDepartments()
    });
  }, [authState, orgAccess]);

  if (!authState.isAuthenticated || authState.loading) {
    return (
      <div className="p-4 border border-yellow-300 bg-yellow-50 rounded-lg">
        <h3 className="font-bold text-yellow-800">🔐 Authentication Status</h3>
        <p>Not authenticated or loading... Please log in to test organizational access.</p>
        <div className="mt-2 text-sm text-gray-600">
          <p>Authenticated: {authState.isAuthenticated ? 'Yes' : 'No'}</p>
          <p>Loading: {authState.loading ? 'Yes' : 'No'}</p>
        </div>
      </div>
    );
  }

  const user = authState.user;
  const permissions = authState.permissions || [];
  const menuStructure = orgAccess.getMenuStructure();

  return (
    <div className="p-6 space-y-6 bg-gray-50">
      <div className="bg-white p-4 rounded-lg border border-green-200">
        <h2 className="text-xl font-bold text-green-800 mb-4">✅ Enhanced Login Test Results</h2>

        {/* User Information */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">👤 User Profile</h3>
            <div className="space-y-1 text-sm">
              <p><span className="font-medium">Name:</span> {user?.first_name} {user?.last_name}</p>
              <p><span className="font-medium">Email:</span> {user?.email}</p>
              <p><span className="font-medium">Employee ID:</span> {user?.employee_id || 'Not set'}</p>
              <p><span className="font-medium">Employment Type:</span> {user?.employment_type || 'Not set'}</p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-800 mb-2">🏢 Organizational Context</h3>
            <div className="space-y-1 text-sm">
              <p><span className="font-medium">Department:</span> {user?.department?.name || 'Not assigned'} ({typeof user?.department?.code === 'string' ? user.department.code : typeof user?.department?.code === 'object' && user?.department?.code?.code ? user.department.code.code : 'N/A'})</p>
              <p><span className="font-medium">Position:</span> {user?.position?.title || 'Not assigned'} ({typeof user?.position?.level === 'string' || typeof user?.position?.level === 'number' ? user.position.level : 'N/A'})</p>
              <p><span className="font-medium">Role:</span> {user?.role?.name || 'Not assigned'}</p>
              <p><span className="font-medium">Location:</span> {user?.location?.name || 'Not assigned'}</p>
              <p><span className="font-medium">Data Access Level:</span> {user?.data_access_level || 'Not set'}</p>
            </div>
          </div>
        </div>

        {/* Position Authority */}
        {user?.position && (
          <div className="mb-4">
            <h3 className="font-semibold text-gray-800 mb-2">🔐 Position Authorities</h3>
            <div className="flex space-x-4 text-sm">
              <span className={`px-2 py-1 rounded ${user.position.can_approve ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                Can Approve: {user.position.can_approve ? 'Yes' : 'No'}
              </span>
              <span className={`px-2 py-1 rounded ${user.position.can_authorize ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                Can Authorize: {user.position.can_authorize ? 'Yes' : 'No'}
              </span>
              {user.position.financial_approval_limit && (
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">
                  Financial Limit: ${user.position.financial_approval_limit?.toLocaleString()}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Permissions Summary */}
        <div className="mb-4">
          <h3 className="font-semibold text-gray-800 mb-2">📋 Permissions Summary</h3>
          <p className="text-sm text-gray-600 mb-2">
            Total permissions: {permissions.reduce((total, module) => total + module.permissions.length, 0)}
            across {permissions.length} modules
          </p>
          <div className="grid md:grid-cols-3 gap-2">
            {permissions.map((module, index) => (
              <div key={index} className="p-2 bg-blue-50 rounded border">
                <p className="font-medium text-blue-800 text-sm">{module.module}</p>
                <p className="text-xs text-blue-600">{module.permissions.length} permissions</p>
              </div>
            ))}
          </div>
        </div>

        {/* Access Test Results */}
        <div className="mb-4">
          <h3 className="font-semibold text-gray-800 mb-2">🧪 Access Test Results</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-700 mb-1">Programs Module</h4>
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span>View Programs:</span>
                  <span className={orgAccess.canViewModule('programs') ? 'text-green-600 font-medium' : 'text-red-600'}>
                    {orgAccess.canViewModule('programs') ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Create in Programs:</span>
                  <span className={orgAccess.canCreateInModule('programs') ? 'text-green-600 font-medium' : 'text-red-600'}>
                    {orgAccess.canCreateInModule('programs') ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Approve in Programs:</span>
                  <span className={orgAccess.canApproveInModule('programs') ? 'text-green-600 font-medium' : 'text-red-600'}>
                    {orgAccess.canApproveInModule('programs') ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-700 mb-1">Access Scope</h4>
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span>Accessible Locations:</span>
                  <span className="font-medium">{orgAccess.getAccessibleLocations()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Accessible Departments:</span>
                  <span className="font-medium">{orgAccess.getAccessibleDepartments()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Dashboard Config:</span>
                  <span className="font-medium">{orgAccess.getDashboardConfig()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Menu Structure */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-2">🎯 Menu Structure</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-700 mb-1">Department Menus ({menuStructure.department_menus.length})</h4>
              <div className="text-sm space-y-1">
                {menuStructure.department_menus.map((menu, index) => (
                  <div key={index} className="p-2 bg-purple-50 rounded">
                    <p className="font-medium text-purple-800">{menu.title}</p>
                    <p className="text-xs text-purple-600">{menu.children?.length || 0} items</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-700 mb-1">Global Hub Items ({menuStructure.global_hub_items.length})</h4>
              <div className="text-sm space-y-1">
                {menuStructure.global_hub_items.map((item, index) => (
                  <div key={index} className="p-2 bg-green-50 rounded">
                    <p className="font-medium text-green-800">{item.title}</p>
                    <p className="text-xs text-green-600">{item.category}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Raw Data for Debugging */}
      <details className="bg-white p-4 rounded-lg border border-gray-200">
        <summary className="cursor-pointer font-semibold text-gray-800 mb-2">🔍 Raw Debug Data</summary>
        <div className="space-y-4 text-xs">
          <div>
            <h4 className="font-medium mb-1">Auth State:</h4>
            <pre className="bg-gray-100 p-2 rounded overflow-x-auto">
              {JSON.stringify(authState, null, 2)}
            </pre>
          </div>
          <div>
            <h4 className="font-medium mb-1">Menu Structure:</h4>
            <pre className="bg-gray-100 p-2 rounded overflow-x-auto">
              {JSON.stringify(menuStructure, null, 2)}
            </pre>
          </div>
        </div>
      </details>
    </div>
  );
}

export default LoginTestComponent;