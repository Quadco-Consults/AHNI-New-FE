'use client';

import React from 'react';
import { useGetUserProfile } from '@/features/auth/controllers/userController';
import { usePermissions } from '@/hooks/usePermissions';
import {
  isUserAdmin,
  calculateUIPermissions,
  calculateMenuPermissions,
  analyzeUserPosition,
  isAdminOfficer,
  getUserAccessDescription,
  getUserRoleNames,
  getUserPermissionCodenames
} from '@/utils/positionRolePermissions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function PermissionDebug() {
  const { data: userProfile } = useGetUserProfile();
  const user = userProfile?.data;
  const permissions = usePermissions();

  if (!user) {
    return <div>Loading user data...</div>;
  }

  const userRoles = getUserRoleNames(user);
  const permissionCodenames = getUserPermissionCodenames(user);
  const uiPermissions = calculateUIPermissions(user);
  const menuPermissions = calculateMenuPermissions(user);
  const positionInfo = analyzeUserPosition(user);
  const userIsAdmin = isUserAdmin(user);
  const userIsAdminOfficer = isAdminOfficer(user);
  const accessDescription = getUserAccessDescription(user);

  return (
    <div className="space-y-4 p-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Permission Debug Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Basic User Info */}
          <div>
            <h4 className="font-semibold mb-2">User Information</h4>
            <div className="text-sm space-y-1">
              <p><strong>Name:</strong> {user.first_name} {user.last_name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Is Superuser:</strong> {user.is_superuser ? 'Yes' : 'No'}</p>
              <p><strong>Is Staff:</strong> {user.is_staff ? 'Yes' : 'No'}</p>
              <p><strong>Is Active:</strong> {user.is_active ? 'Yes' : 'No'}</p>
            </div>
          </div>

          {/* Role Analysis */}
          <div>
            <h4 className="font-semibold mb-2">Role Analysis</h4>
            <div className="space-y-2">
              <p className="text-sm"><strong>Is Admin (Enhanced):</strong> {userIsAdmin ? 'Yes' : 'No'}</p>
              <p className="text-sm"><strong>Is Admin Officer:</strong> {userIsAdminOfficer ? 'Yes' : 'No'}</p>
              <p className="text-sm"><strong>Access Description:</strong> {accessDescription}</p>
              <div>
                <p className="text-sm font-medium">User Roles:</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {userRoles.map((role, index) => (
                    <Badge key={index} variant="outline">{role}</Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Permission Details */}
          <div>
            <h4 className="font-semibold mb-2">Detailed Permissions</h4>
            <div className="text-xs space-y-2">
              <div>
                <p className="font-medium">Permission Codenames ({permissionCodenames.length} total):</p>
                <div className="max-h-32 overflow-y-auto bg-gray-50 p-2 rounded">
                  {permissionCodenames.map((perm, index) => (
                    <div key={index}>{perm}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* UI Permissions */}
          <div>
            <h4 className="font-semibold mb-2">UI Permissions</h4>
            <div className="text-sm space-y-2">
              <div>
                <p className="font-medium">UI Permission Categories ({uiPermissions.length} total):</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {uiPermissions.map((perm, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">{perm}</Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Menu Permissions */}
          <div>
            <h4 className="font-semibold mb-2">Menu Permissions</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>HR Menu: {menuPermissions.showHRMenu ? '✅' : '❌'}</div>
              <div>Finance Menu: {menuPermissions.showFinanceMenu ? '✅' : '❌'}</div>
              <div>Approvals Menu: {menuPermissions.showApprovalsMenu ? '✅' : '❌'}</div>
              <div>Procurement Menu: {menuPermissions.showProcurementMenu ? '✅' : '❌'}</div>
              <div>Projects Menu: {menuPermissions.showProjectsMenu ? '✅' : '❌'}</div>
              <div>Config Menu: {menuPermissions.showConfigMenu ? '✅' : '❌'}</div>
              <div>Approve Button: {menuPermissions.showApproveButton ? '✅' : '❌'}</div>
              <div>Authorize Button: {menuPermissions.showAuthorizeButton ? '✅' : '❌'}</div>
              <div>Review Button: {menuPermissions.showReviewButton ? '✅' : '❌'}</div>
            </div>
          </div>

          {/* Hook Results */}
          <div>
            <h4 className="font-semibold mb-2">usePermissions() Hook Results</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>Can Approve: {permissions.canApprove ? '✅' : '❌'}</div>
              <div>Can Authorize: {permissions.canAuthorize ? '✅' : '❌'}</div>
              <div>Can Review: {permissions.canReview ? '✅' : '❌'}</div>
              <div>Can Access HR: {permissions.canAccessHR ? '✅' : '❌'}</div>
              <div>Can Access Finance: {permissions.canAccessFinance ? '✅' : '❌'}</div>
              <div>Can Manage Employees: {permissions.canManageEmployees ? '✅' : '❌'}</div>
              <div>Is Admin: {permissions.isAdmin ? '✅' : '❌'}</div>
            </div>
          </div>

          {/* Raw Data */}
          <details className="mt-4">
            <summary className="font-semibold cursor-pointer">Raw User Data (Click to expand)</summary>
            <pre className="text-xs bg-gray-100 p-2 rounded mt-2 overflow-auto max-h-64">
              {JSON.stringify(user, null, 2)}
            </pre>
          </details>
        </CardContent>
      </Card>
    </div>
  );
}