'use client';

import React from 'react';
import { usePermissions } from '@/hooks/usePermissions';

/**
 * Simple test component to verify the permission system is working
 */
export const PermissionTest: React.FC = () => {
  const { user, isAuthenticated, userModules, hasPermission, isAdmin } = usePermissions();

  return (
    <div className="p-4 bg-blue-50 border border-blue-200 rounded">
      <h3 className="font-bold mb-2">Permission System Test</h3>

      <div className="space-y-2 text-sm">
        <div>
          <strong>Authenticated:</strong> {isAuthenticated ? '✅ Yes' : '❌ No'}
        </div>

        {user && (
          <>
            <div>
              <strong>User:</strong> {user.full_name || `${user.first_name} ${user.last_name}`}
            </div>

            <div>
              <strong>Email:</strong> {user.email}
            </div>

            <div>
              <strong>Department:</strong> {user.department || 'Not specified'}
            </div>

            <div>
              <strong>Assigned Modules:</strong> {userModules.length > 0 ? userModules.join(', ') : 'None'}
            </div>

            <div>
              <strong>Is Admin:</strong> {isAdmin() ? '✅ Yes' : '❌ No'}
            </div>

            <div>
              <strong>Roles:</strong> {user.roles?.length > 0 ? user.roles.map(r => r.name).join(', ') : 'None'}
            </div>

            <div>
              <strong>Direct Permissions:</strong> {user.permissions?.length > 0 ? user.permissions.length + ' groups' : 'None'}
            </div>
          </>
        )}

        {!user && (
          <div className="text-gray-500">No user data available</div>
        )}

        <hr className="my-2" />

        <div>
          <strong>Sample Permission Checks:</strong>
        </div>

        <div className="ml-4 space-y-1">
          <div>Dashboard Access: {hasPermission('access_dashboard') ? '✅' : '❌'}</div>
          <div>View Users: {hasPermission('view_users') ? '✅' : '❌'}</div>
          <div>Global Hub: {hasPermission('view_global_hub') ? '✅' : '❌'}</div>
        </div>
      </div>
    </div>
  );
};

export default PermissionTest;