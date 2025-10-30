'use client';

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Users, Settings } from 'lucide-react';
import { PermissionGuard } from '@/components/PermissionGuard';
import { ADMIN_PERMISSIONS } from '@/constants/permissions';
import AccessDeniedPage from '@/components/AccessDeniedPage';
import RoleManagement from '@/features/admin/components/RoleManagement';
import UserRoleAssignment from '@/features/admin/components/UserRoleAssignment';

export default function RolesPage() {
  return (
    <PermissionGuard
      anyPermissions={[
        ADMIN_PERMISSIONS.MANAGE_ROLES,
        ADMIN_PERMISSIONS.MANAGE_PERMISSIONS,
        ADMIN_PERMISSIONS.MANAGE_USERS
      ]}
      fallback={
        <AccessDeniedPage
          feature="Role Management"
          message="You don't have permission to access role management. Please contact your administrator."
          backUrl="/dashboard"
        />
      }
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Roles & Permissions</h1>
            <p className="text-muted-foreground">
              Manage user roles, permissions, and access control for your organization
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Role Management</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Create & Edit</div>
              <p className="text-xs text-muted-foreground">
                Create new roles and assign permissions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">User Assignment</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Assign Users</div>
              <p className="text-xs text-muted-foreground">
                Assign roles to users and manage memberships
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Permission Control</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Fine-Grained</div>
              <p className="text-xs text-muted-foreground">
                Module-level permission management
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="roles" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="roles" className="flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span>Role Management</span>
            </TabsTrigger>
            <TabsTrigger value="assignments" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>User Assignments</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="roles" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Role Management</CardTitle>
                <CardDescription>
                  Create, edit, and manage roles with their associated permissions.
                  Changes to roles will take effect immediately for all assigned users.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PermissionGuard
                  permission={ADMIN_PERMISSIONS.MANAGE_ROLES}
                  fallback={
                    <div className="text-center py-8">
                      <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-lg font-medium">Role Management Access Required</p>
                      <p className="text-sm text-muted-foreground">
                        You need the "Manage Roles" permission to access this feature.
                      </p>
                    </div>
                  }
                >
                  <RoleManagement />
                </PermissionGuard>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="assignments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>User Role Assignments</CardTitle>
                <CardDescription>
                  Assign roles to users and manage role memberships.
                  Permission changes will be reflected immediately upon saving.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PermissionGuard
                  anyPermissions={[
                    ADMIN_PERMISSIONS.MANAGE_USERS,
                    ADMIN_PERMISSIONS.MANAGE_ROLES
                  ]}
                  fallback={
                    <div className="text-center py-8">
                      <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-lg font-medium">User Management Access Required</p>
                      <p className="text-sm text-muted-foreground">
                        You need either "Manage Users" or "Manage Roles" permission to access this feature.
                      </p>
                    </div>
                  }
                >
                  <UserRoleAssignment />
                </PermissionGuard>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card className="border-amber-200 bg-amber-50">
          <CardHeader>
            <CardTitle className="text-amber-800">Important Notes</CardTitle>
          </CardHeader>
          <CardContent className="text-amber-700">
            <ul className="list-disc list-inside space-y-2 text-sm">
              <li>
                <strong>Real-time Updates:</strong> Permission changes take effect immediately.
                Users may need to refresh their browser or log out/in to see UI changes.
              </li>
              <li>
                <strong>Super Admin:</strong> Users with the email "admin@mail.com" automatically
                have access to all features regardless of assigned roles.
              </li>
              <li>
                <strong>Module Access:</strong> Ensure users have the appropriate module access
                in addition to specific permissions for features within those modules.
              </li>
              <li>
                <strong>Role Hierarchy:</strong> Consider implementing role hierarchy if you need
                more complex permission inheritance in the future.
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </PermissionGuard>
  );
}