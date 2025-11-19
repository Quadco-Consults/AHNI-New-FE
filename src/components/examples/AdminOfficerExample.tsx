'use client';

import React from 'react';
import { useGetUserProfile } from '@/features/auth/controllers/userController';
import {
  isAdminOfficer,
  getUserAccessDescription,
  shouldShowApprovalUI,
  isManagerLevel,
  getAccessibleModules,
  UIPermissionCategory
} from '@/utils/positionRolePermissions';
import { usePermissions } from '@/hooks/usePermissions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ApprovalButtons } from '@/components/common/ApprovalButtons';
import PermissionGate from '@/components/common/PermissionGate';
import { Eye, Edit, Plus, Check, Shield, AlertTriangle } from 'lucide-react';

/**
 * AdminOfficerExample component demonstrates the enhanced permission system
 *
 * This component shows:
 * 1. Admin Officer detection and handling
 * 2. Permission-based UI rendering
 * 3. Approval buttons that hide for Admin Officers
 * 4. Module access visualization
 * 5. Real-world usage patterns
 */
export default function AdminOfficerExample() {
  const { data: userProfile } = useGetUserProfile();
  const user = userProfile?.data;
  const {
    canApprove,
    canAuthorize,
    canReview,
    canAccessHR,
    canAccessFinance,
    positionInfo,
    isAdmin
  } = usePermissions();

  if (!user) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Loading Permission Example...</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  const isAdminOfficerUser = isAdminOfficer(user);
  const accessDescription = getUserAccessDescription(user);
  const showApprovalUI = shouldShowApprovalUI(user);
  const isManager = isManagerLevel(user);
  const accessibleModules = getAccessibleModules(user);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* User Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>Permission System Demo</span>
            {isAdminOfficerUser && <Badge variant="secondary">Admin Officer</Badge>}
            {isManager && <Badge variant="outline">Manager Level</Badge>}
            {isAdmin && <Badge variant="destructive">Administrator</Badge>}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium text-sm text-gray-600 mb-2">User Information</h4>
            <p className="text-sm">
              <strong>Name:</strong> {user.first_name} {user.last_name}
            </p>
            <p className="text-sm">
              <strong>Position:</strong> {positionInfo.name}
            </p>
            <p className="text-sm">
              <strong>Access Level:</strong> {accessDescription}
            </p>
          </div>

          <div>
            <h4 className="font-medium text-sm text-gray-600 mb-2">Accessible Modules</h4>
            <div className="flex flex-wrap gap-2">
              {accessibleModules.map((module) => (
                <Badge key={module} variant="outline">{module}</Badge>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-medium text-sm text-gray-600 mb-2">Permissions</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${canApprove ? 'bg-green-500' : 'bg-gray-300'}`} />
                <span>Can Approve: {canApprove ? 'Yes' : 'No'}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${canAuthorize ? 'bg-green-500' : 'bg-gray-300'}`} />
                <span>Can Authorize: {canAuthorize ? 'Yes' : 'No'}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${canReview ? 'bg-green-500' : 'bg-gray-300'}`} />
                <span>Can Review: {canReview ? 'Yes' : 'No'}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${canAccessHR ? 'bg-green-500' : 'bg-gray-300'}`} />
                <span>HR Access: {canAccessHR ? 'Yes' : 'No'}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Admin Officer Specific Card */}
      {isAdminOfficerUser && (
        <Card className="border-amber-200 bg-amber-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-800">
              <AlertTriangle className="w-5 h-5" />
              Admin Officer Mode
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-amber-700 text-sm">
              As an Admin Officer, you can create and view data but approval/authorization buttons
              are hidden since you don't have those permissions. This demonstrates the exact
              scenario requested by the user.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons Demo */}
      <Card>
        <CardHeader>
          <CardTitle>Action Buttons Demo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Always available actions */}
          <div>
            <h4 className="font-medium text-sm text-gray-600 mb-3">Basic Actions (Always Available)</h4>
            <div className="flex gap-2">
              <Button size="sm" variant="outline">
                <Eye className="w-4 h-4 mr-2" />
                View
              </Button>
              <Button size="sm" variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Create
              </Button>
              <Button size="sm" variant="outline">
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            </div>
          </div>

          {/* Approval buttons - hidden for Admin Officers */}
          <div>
            <h4 className="font-medium text-sm text-gray-600 mb-3">
              Approval Actions {!showApprovalUI && "(Hidden for Admin Officers)"}
            </h4>

            {showApprovalUI ? (
              <ApprovalButtons
                onReview={() => console.log('Review clicked')}
                onAuthorize={() => console.log('Authorize clicked')}
                onApprove={() => console.log('Approve clicked')}
                size="sm"
              />
            ) : (
              <p className="text-gray-500 text-sm italic">
                Approval buttons are not available for your role.
              </p>
            )}
          </div>

          {/* Permission-gated actions */}
          <div>
            <h4 className="font-medium text-sm text-gray-600 mb-3">Permission-Gated Actions</h4>
            <div className="space-y-2">
              <PermissionGate
                permission={UIPermissionCategory.MANAGE_EMPLOYEES}
                fallback={<p className="text-gray-500 text-sm">Employee management not available</p>}
              >
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  Manage Employees
                </Button>
              </PermissionGate>

              <PermissionGate
                permission={UIPermissionCategory.APPROVE_REQUESTS}
                fallback={<p className="text-gray-500 text-sm">Approval actions not available</p>}
              >
                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                  <Check className="w-4 h-4 mr-2" />
                  Approve Request
                </Button>
              </PermissionGate>

              <PermissionGate
                permission={UIPermissionCategory.AUTHORIZE_REQUESTS}
                fallback={<p className="text-gray-500 text-sm">Authorization actions not available</p>}
              >
                <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                  <Shield className="w-4 h-4 mr-2" />
                  Authorize Payment
                </Button>
              </PermissionGate>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Module Access Demo */}
      <Card>
        <CardHeader>
          <CardTitle>Module Access Demo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <PermissionGate permission={UIPermissionCategory.HR_MODULE}>
              <div className="p-4 border border-green-200 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-800">HR Module</h4>
                <p className="text-sm text-green-600">You have access to HR features</p>
              </div>
            </PermissionGate>

            <PermissionGate
              permission={UIPermissionCategory.FINANCE_MODULE}
              fallback={
                <div className="p-4 border border-gray-200 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-500">Finance Module</h4>
                  <p className="text-sm text-gray-400">Access restricted</p>
                </div>
              }
            >
              <div className="p-4 border border-green-200 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-800">Finance Module</h4>
                <p className="text-sm text-green-600">You have access to Finance features</p>
              </div>
            </PermissionGate>

            <PermissionGate
              permission={UIPermissionCategory.PROCUREMENT_MODULE}
              fallback={
                <div className="p-4 border border-gray-200 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-500">Procurement Module</h4>
                  <p className="text-sm text-gray-400">Access restricted</p>
                </div>
              }
            >
              <div className="p-4 border border-green-200 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-800">Procurement Module</h4>
                <p className="text-sm text-green-600">You have access to Procurement features</p>
              </div>
            </PermissionGate>

            <PermissionGate
              permission={UIPermissionCategory.PROGRAMS_MODULE}
              fallback={
                <div className="p-4 border border-gray-200 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-500">Programs Module</h4>
                  <p className="text-sm text-gray-400">Access restricted</p>
                </div>
              }
            >
              <div className="p-4 border border-green-200 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-800">Programs Module</h4>
                <p className="text-sm text-green-600">You have access to Programs features</p>
              </div>
            </PermissionGate>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}