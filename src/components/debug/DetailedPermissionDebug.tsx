'use client';

import React, { useEffect } from 'react';
import { useGetUserProfile } from '@/features/auth/controllers/userController';
import { usePermissions } from '@/hooks/usePermissions';
import { isUserAdmin } from '@/utils/positionRolePermissions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DetailedPermissionDebug() {
  const { data: userProfile, isLoading, error } = useGetUserProfile();
  const permissions = usePermissions();

  // Log everything on every render
  useEffect(() => {
    console.log('🔍 DETAILED DEBUG - useGetUserProfile result:', {
      data: userProfile,
      isLoading,
      error: error?.message || error,
      timestamp: new Date().toISOString()
    });

    console.log('🔍 DETAILED DEBUG - Raw API response structure:', {
      hasData: !!userProfile,
      dataKeys: userProfile ? Object.keys(userProfile) : 'No data',
      dataDataExists: !!(userProfile as any)?.data,
      dataDataKeys: (userProfile as any)?.data ? Object.keys((userProfile as any).data) : 'No .data',
      actualUserObject: (userProfile as any)?.data,
      timestamp: new Date().toISOString()
    });

    const user = userProfile?.data;
    if (user) {
      console.log('🔍 DETAILED DEBUG - User object analysis:', {
        hasIsSuperuser: 'is_superuser' in user,
        isSuperuserValue: user.is_superuser,
        isSuperuserType: typeof user.is_superuser,
        isSuperuserStrict: user.is_superuser === true,
        isAdminUtil: isUserAdmin(user),
        userRoles: user.roles?.map(r => r.name),
        permissionsCount: user.permissions?.length,
        timestamp: new Date().toISOString()
      });
    }

    console.log('🔍 DETAILED DEBUG - usePermissions hook result:', {
      ...permissions,
      timestamp: new Date().toISOString()
    });
  });

  // Test the actual condition used in Authorization component
  const user = userProfile?.data;
  const canManageRoles = user ? (isUserAdmin(user) || user.is_superuser === true || permissions.isAdmin) : false;

  return (
    <Card className="w-full border-red-500">
      <CardHeader>
        <CardTitle className="text-red-600">🔍 Detailed Permission Debug</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">

        {/* API State */}
        <div className="p-3 bg-gray-100 rounded">
          <h4 className="font-semibold mb-2">API State</h4>
          <div className="text-sm space-y-1">
            <p><strong>Loading:</strong> {isLoading ? 'YES' : 'NO'}</p>
            <p><strong>Error:</strong> {error ? String(error) : 'None'}</p>
            <p><strong>Has Response:</strong> {userProfile ? 'YES' : 'NO'}</p>
            <p><strong>Response Status:</strong> {(userProfile as any)?.status || 'Unknown'}</p>
            <p><strong>Response Message:</strong> {(userProfile as any)?.message || 'Unknown'}</p>
          </div>
        </div>

        {/* User Data */}
        <div className="p-3 bg-blue-50 rounded">
          <h4 className="font-semibold mb-2">User Data</h4>
          <div className="text-sm space-y-1">
            <p><strong>User Object:</strong> {user ? 'EXISTS' : 'NULL'}</p>
            {user && (
              <>
                <p><strong>Name:</strong> {user.first_name} {user.last_name}</p>
                <p><strong>is_superuser:</strong> {String(user.is_superuser)} ({typeof user.is_superuser})</p>
                <p><strong>is_staff:</strong> {String(user.is_staff)} ({typeof user.is_staff})</p>
                <p><strong>Roles Count:</strong> {user.roles?.length || 0}</p>
                <p><strong>Permissions Count:</strong> {user.permissions?.length || 0}</p>
              </>
            )}
          </div>
        </div>

        {/* Permission Logic */}
        <div className="p-3 bg-green-50 rounded">
          <h4 className="font-semibold mb-2">Permission Logic</h4>
          <div className="text-sm space-y-1">
            <p><strong>isUserAdmin(user):</strong> {user ? String(isUserAdmin(user)) : 'N/A'}</p>
            <p><strong>user.is_superuser === true:</strong> {user ? String(user.is_superuser === true) : 'N/A'}</p>
            <p><strong>permissions.isAdmin:</strong> {String(permissions.isAdmin)}</p>
            <p><strong>Final canManageRoles:</strong> {String(canManageRoles)}</p>
          </div>
        </div>

        {/* Raw Data */}
        <details className="p-3 bg-gray-50 rounded">
          <summary className="font-semibold cursor-pointer">Raw API Response</summary>
          <pre className="text-xs mt-2 overflow-auto max-h-40">
            {JSON.stringify(userProfile, null, 2)}
          </pre>
        </details>

      </CardContent>
    </Card>
  );
}