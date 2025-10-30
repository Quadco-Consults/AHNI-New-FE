'use client';

import { useEffect, useState } from 'react';
import { debugCurrentUser, UserDebugInfo, hasPermissionCode } from '@/utils/debugUser';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertTriangle } from 'lucide-react';

export default function DebugUserPage() {
  const [userInfo, setUserInfo] = useState<UserDebugInfo | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const loadUserInfo = () => {
    const info = debugCurrentUser();
    setUserInfo(info);
    console.log('User Debug Info:', info);
  };

  useEffect(() => {
    loadUserInfo();
  }, [refreshKey]);

  const refresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  // Check approval permissions
  const checkApprovalPermissions = () => {
    return {
      canReview: hasPermissionCode('approvals.can_review'),
      canAuthorize: hasPermissionCode('approvals.can_authorize'),
      canApprove: hasPermissionCode('approvals.can_approve')
    };
  };

  if (!userInfo) {
    return <div>Loading user debug info...</div>;
  }

  const approvalPerms = checkApprovalPermissions();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">User Debug Information</h1>
        <Button onClick={refresh} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh Data
        </Button>
      </div>

      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle>Basic User Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div><strong>Has User:</strong> {userInfo.hasUser ? '✅ Yes' : '❌ No'}</div>
          <div><strong>Email:</strong> {userInfo.email}</div>
          <div><strong>User Type:</strong> <Badge>{userInfo.userType}</Badge></div>
          <div><strong>Is Active:</strong> {userInfo.isActive ? '✅ Active' : '❌ Inactive'}</div>
          <div><strong>Is Staff:</strong> {userInfo.user?.is_staff ? '✅ Yes' : '❌ No'}</div>
          <div><strong>Is Superuser:</strong> {userInfo.user?.is_superuser ? '✅ Yes' : '❌ No'}</div>
          <div><strong>Is Admin User:</strong> {typeof window !== 'undefined' && (window as any).debugUser?.isAdminUser() ? '✅ Yes (Bypass Permissions)' : '❌ No'}</div>
        </CardContent>
      </Card>

      {/* APPROVAL PERMISSIONS ISSUE */}
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-800">
            <AlertTriangle className="w-5 h-5" />
            🚨 APPROVAL PERMISSIONS STATUS (Item Requisition Issue)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="p-3 border rounded-lg bg-white">
              <div className="font-medium text-gray-700">Can Review</div>
              <div className="mt-1">
                <Badge variant={approvalPerms.canReview ? "default" : "destructive"}>
                  {approvalPerms.canReview ? "✅ Yes" : "❌ No"}
                </Badge>
              </div>
              <div className="text-xs text-gray-500 mt-1">approvals.can_review</div>
            </div>
            <div className="p-3 border rounded-lg bg-white">
              <div className="font-medium text-gray-700">Can Authorize</div>
              <div className="mt-1">
                <Badge variant={approvalPerms.canAuthorize ? "default" : "destructive"}>
                  {approvalPerms.canAuthorize ? "✅ Yes" : "❌ No"}
                </Badge>
              </div>
              <div className="text-xs text-gray-500 mt-1">approvals.can_authorize</div>
            </div>
            <div className="p-3 border rounded-lg bg-white">
              <div className="font-medium text-gray-700">Can Approve</div>
              <div className="mt-1">
                <Badge variant={approvalPerms.canApprove ? "default" : "destructive"}>
                  {approvalPerms.canApprove ? "✅ Yes" : "❌ No"}
                </Badge>
              </div>
              <div className="text-xs text-gray-500 mt-1">approvals.can_approve</div>
            </div>
          </div>

          {!approvalPerms.canReview && !approvalPerms.canAuthorize && !approvalPerms.canApprove && (
            <div className="p-4 bg-white border border-red-300 rounded-lg">
              <h4 className="font-bold text-red-800 mb-2">🔍 ROOT CAUSE IDENTIFIED</h4>
              <p className="text-red-700 mb-3">
                <strong>This user has NO approval permissions!</strong> The item requisition form filters users based on approval permissions
                (can_review, can_authorize, can_approve), but this user doesn't have any of these permissions assigned.
              </p>

              <div className="bg-yellow-50 border border-yellow-200 p-3 rounded mb-3">
                <h5 className="font-semibold text-yellow-800 mb-1">🔧 SOLUTIONS:</h5>
                <ul className="text-yellow-700 text-sm space-y-1">
                  <li><strong>Option 1:</strong> Add approval permissions to the user's role via Role Management</li>
                  <li><strong>Option 2:</strong> Create approval permissions in backend if they don't exist</li>
                  <li><strong>Option 3:</strong> Modify approval filters to fallback to all AHNI staff</li>
                </ul>
              </div>

              <div className="text-xs text-gray-600">
                <strong>Technical Details:</strong> The approval filters in `/src/utils/approvalFilters.ts` look for
                permissions with codenames "can_review", "can_authorize", and "can_approve" in the "approvals" module.
              </div>
            </div>
          )}

          {(approvalPerms.canReview || approvalPerms.canAuthorize || approvalPerms.canApprove) && (
            <div className="p-4 bg-green-50 border border-green-300 rounded-lg">
              <h4 className="font-bold text-green-800 mb-2">✅ APPROVAL PERMISSIONS FOUND</h4>
              <p className="text-green-700">
                This user has approval permissions and should appear in reviewer/authorizer/approver dropdowns.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Assigned Modules */}
      <Card>
        <CardHeader>
          <CardTitle>Assigned Modules</CardTitle>
        </CardHeader>
        <CardContent>
          {userInfo.assignedModules.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {userInfo.assignedModules.map((module, index) => (
                <Badge key={index} variant="secondary">{module}</Badge>
              ))}
            </div>
          ) : (
            <div className="text-red-500">⚠️ No modules assigned! This might be why you only see admin activities.</div>
          )}
        </CardContent>
      </Card>

      {/* Permission Codes */}
      <Card>
        <CardHeader>
          <CardTitle>Permission Codes (Backend Format)</CardTitle>
        </CardHeader>
        <CardContent>
          {userInfo.permissionCodes && userInfo.permissionCodes.length > 0 ? (
            <div className="space-y-4">
              <div className="text-sm text-gray-600">
                These are the actual permission codes your user has in "module.codename" format:
              </div>

              {/* Global Hub Permissions */}
              <div>
                <h5 className="font-semibold text-blue-600 mb-2">🌍 Global Hub Permissions:</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {userInfo.permissionCodes
                    .filter(code => code.includes("can_view_all_") || code.includes("can_view_global_hub"))
                    .map((code, index) => (
                      <Badge key={index} variant="default" className="text-xs bg-blue-100 text-blue-800">
                        {code}
                      </Badge>
                    ))
                  }
                  {userInfo.permissionCodes.filter(code => code.includes("can_view_all_") || code.includes("can_view_global_hub")).length === 0 && (
                    <div className="text-orange-500 text-sm">No Global Hub permissions found</div>
                  )}
                </div>
              </div>

              {/* Other Permissions */}
              <div>
                <h5 className="font-semibold text-gray-600 mb-2">📋 Other Permissions:</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {userInfo.permissionCodes
                    .filter(code => !code.includes("can_view_all_") && !code.includes("can_view_global_hub"))
                    .map((code, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {code}
                      </Badge>
                    ))
                  }
                </div>
              </div>
            </div>
          ) : (
            <div className="text-red-500">⚠️ No permission codes found!</div>
          )}
        </CardContent>
      </Card>

      {/* Role Names */}
      <Card>
        <CardHeader>
          <CardTitle>Role Names</CardTitle>
        </CardHeader>
        <CardContent>
          {userInfo.roleNames && userInfo.roleNames.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {userInfo.roleNames.map((roleName, index) => (
                <Badge key={index} variant="default">{roleName}</Badge>
              ))}
            </div>
          ) : (
            <div className="text-red-500">⚠️ No role names found!</div>
          )}
        </CardContent>
      </Card>

      {/* Roles */}
      <Card>
        <CardHeader>
          <CardTitle>User Roles</CardTitle>
        </CardHeader>
        <CardContent>
          {userInfo.roles.length > 0 ? (
            <div className="space-y-2">
              {userInfo.roles.map((role, index) => (
                <div key={index} className="border p-3 rounded">
                  <div><strong>Role:</strong> {role.name}</div>
                  <div><strong>ID:</strong> {role.id}</div>
                  {role.permissions && (
                    <div>
                      <strong>Permissions:</strong>
                      <div className="ml-4 mt-2">
                        {role.permissions.map((perm: any, permIndex: number) => (
                          <div key={permIndex} className="text-sm">
                            <strong>Module:</strong> {perm.module}
                            <div className="ml-4">
                              {perm.permissions?.map((p: any, pIndex: number) => (
                                <Badge key={pIndex} variant="outline" className="ml-1">
                                  {p.codename}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-red-500">⚠️ No roles assigned!</div>
          )}
        </CardContent>
      </Card>

      {/* Permissions */}
      <Card>
        <CardHeader>
          <CardTitle>User Permissions (Direct)</CardTitle>
        </CardHeader>
        <CardContent>
          {userInfo.permissions.length > 0 ? (
            <div className="space-y-2">
              {userInfo.permissions.map((permission, index) => (
                <div key={index} className="border p-3 rounded">
                  <div><strong>Module:</strong> {permission.module}</div>
                  <div className="ml-4 mt-2">
                    {permission.permissions?.map((perm: any, permIndex: number) => (
                      <Badge key={permIndex} variant="outline" className="ml-1">
                        {perm.codename}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-red-500">⚠️ No permissions assigned!</div>
          )}
        </CardContent>
      </Card>

      {/* Raw User Object */}
      <Card>
        <CardHeader>
          <CardTitle>Raw User Object (JSON)</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
            {JSON.stringify(userInfo.user, null, 2)}
          </pre>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>How to Fix the Issue</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div>1. <strong>Check Assigned Modules:</strong> If the "Assigned Modules" section above is empty or only contains "admin", that's why you only see admin activities.</div>
          <div>2. <strong>Update User Permissions:</strong> Go to <code>/dashboard/users</code> and edit the testadmin@yopmail.com user to assign more modules.</div>
          <div>3. <strong>Enable Module Filtering:</strong> The sidebar code needs to be updated to actually filter based on assigned modules.</div>
          <div>4. <strong>Console Debugging:</strong> Open browser console and type <code>debugUser.logUserDebugInfo()</code> for detailed logs.</div>
        </CardContent>
      </Card>
    </div>
  );
}