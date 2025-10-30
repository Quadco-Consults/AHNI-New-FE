'use client';

import React from 'react';
import { PermissionGuard } from '@/components/PermissionGuard';
import { usePermissions } from '@/hooks/usePermissions';
import {
  NAVIGATION_PERMISSIONS,
  MODULE_PERMISSIONS,
  SETTINGS_PERMISSIONS,
  DATA_PERMISSIONS,
  WORKFLOW_PERMISSIONS
} from '@/constants/permissions';

/**
 * PermissionDemo - Examples of how to use the permission system
 *
 * This component demonstrates various ways to implement permission-based
 * access control in your React components.
 */
export const PermissionDemo: React.FC = () => {
  const { hasPermission, hasModule, userModules, isAdmin } = usePermissions();

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">Permission System Demo</h1>

      {/* Example 1: Basic Permission Guard */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Example 1: Basic Permission Guard</h2>
        <PermissionGuard permission={SETTINGS_PERMISSIONS.VIEW_USERS}>
          <div className="p-4 bg-green-100 rounded border border-green-300">
            ✅ You can see this because you have the "view_users" permission
          </div>
        </PermissionGuard>

        <PermissionGuard
          permission="non_existent_permission"
          fallback={
            <div className="p-4 bg-red-100 rounded border border-red-300">
              ❌ You cannot see the protected content because you lack the required permission
            </div>
          }
        >
          <div className="p-4 bg-green-100 rounded border border-green-300">
            This won't show if you don't have the permission
          </div>
        </PermissionGuard>
      </section>

      {/* Example 2: Module-Based Access */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Example 2: Module-Based Access</h2>
        <PermissionGuard module="hr">
          <div className="p-4 bg-blue-100 rounded border border-blue-300">
            📋 HR Module Content - You have access to the HR module
          </div>
        </PermissionGuard>

        <PermissionGuard module="finance">
          <div className="p-4 bg-purple-100 rounded border border-purple-300">
            💰 Finance Module Content - You have access to the Finance module
          </div>
        </PermissionGuard>
      </section>

      {/* Example 3: Multiple Permission Logic */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Example 3: Multiple Permission Logic</h2>

        {/* OR Logic - Any of these permissions */}
        <PermissionGuard
          anyPermissions={[
            WORKFLOW_PERMISSIONS.REVIEW_REQUESTS,
            WORKFLOW_PERMISSIONS.AUTHORIZE_REQUESTS,
            WORKFLOW_PERMISSIONS.APPROVE_REQUESTS
          ]}
          fallback={<div className="text-gray-500">No approval permissions</div>}
        >
          <div className="p-4 bg-yellow-100 rounded border border-yellow-300">
            📝 You have at least one approval permission (review, authorize, or approve)
          </div>
        </PermissionGuard>

        {/* AND Logic - All of these permissions */}
        <PermissionGuard
          allPermissions={[
            DATA_PERMISSIONS.VIEW_ALL_RECORDS,
            DATA_PERMISSIONS.EDIT_RECORDS
          ]}
          fallback={<div className="text-gray-500">Missing required data permissions</div>}
        >
          <div className="p-4 bg-indigo-100 rounded border border-indigo-300">
            🔧 You can both view all records AND edit them
          </div>
        </PermissionGuard>
      </section>

      {/* Example 4: Imperative Permission Checking */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Example 4: Imperative Permission Checking</h2>

        <div className="space-y-2">
          <div className="flex gap-4">
            <button
              className={`px-4 py-2 rounded ${
                hasPermission(DATA_PERMISSIONS.CREATE_RECORDS)
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              disabled={!hasPermission(DATA_PERMISSIONS.CREATE_RECORDS)}
              onClick={() => alert('Create action triggered')}
            >
              Create Record
            </button>

            <button
              className={`px-4 py-2 rounded ${
                hasPermission(DATA_PERMISSIONS.EDIT_RECORDS)
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              disabled={!hasPermission(DATA_PERMISSIONS.EDIT_RECORDS)}
              onClick={() => alert('Edit action triggered')}
            >
              Edit Record
            </button>

            <button
              className={`px-4 py-2 rounded ${
                hasPermission(DATA_PERMISSIONS.DELETE_RECORDS)
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              disabled={!hasPermission(DATA_PERMISSIONS.DELETE_RECORDS)}
              onClick={() => alert('Delete action triggered')}
            >
              Delete Record
            </button>
          </div>
        </div>
      </section>

      {/* Example 5: Custom Logic */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Example 5: Custom Logic</h2>

        <PermissionGuard
          customCheck={() => isAdmin() && hasModule('hr')}
          fallback={<div className="text-gray-500">Not an HR admin</div>}
        >
          <div className="p-4 bg-orange-100 rounded border border-orange-300">
            👑 You are an admin with HR module access
          </div>
        </PermissionGuard>
      </section>

      {/* Example 6: User Information Display */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Example 6: User Information</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-100 rounded">
            <h3 className="font-semibold mb-2">User Modules</h3>
            <div className="space-y-1">
              {userModules.length > 0 ? (
                userModules.map(module => (
                  <span key={module} className="inline-block px-2 py-1 bg-blue-200 text-blue-800 rounded text-sm mr-2">
                    {module}
                  </span>
                ))
              ) : (
                <span className="text-gray-500">No modules assigned</span>
              )}
            </div>
          </div>

          <div className="p-4 bg-gray-100 rounded">
            <h3 className="font-semibold mb-2">Admin Status</h3>
            <span className={`inline-block px-2 py-1 rounded text-sm ${
              isAdmin() ? 'bg-green-200 text-green-800' : 'bg-gray-200 text-gray-800'
            }`}>
              {isAdmin() ? 'Administrator' : 'Regular User'}
            </span>
          </div>
        </div>
      </section>

      {/* Example 7: Navigation Items with Permissions */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Example 7: Dynamic Navigation</h2>

        <nav className="flex flex-wrap gap-2">
          <PermissionGuard permission={NAVIGATION_PERMISSIONS.VIEW_PROCUREMENT_REQUESTS}>
            <a href="/dashboard/procurement/purchase-request" className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              Purchase Requests
            </a>
          </PermissionGuard>

          <PermissionGuard permission={NAVIGATION_PERMISSIONS.VIEW_MY_TIMESHEET}>
            <a href="/dashboard/hr/timesheet-management" className="px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600">
              My Timesheet
            </a>
          </PermissionGuard>

          <PermissionGuard permission={SETTINGS_PERMISSIONS.VIEW_USERS}>
            <a href="/dashboard/users" className="px-3 py-2 bg-purple-500 text-white rounded hover:bg-purple-600">
              User Management
            </a>
          </PermissionGuard>

          <PermissionGuard permission={NAVIGATION_PERMISSIONS.VIEW_FINANCIAL_REQUESTS}>
            <a href="/dashboard/admin/payment-request" className="px-3 py-2 bg-orange-500 text-white rounded hover:bg-orange-600">
              Payment Requests
            </a>
          </PermissionGuard>
        </nav>
      </section>
    </div>
  );
};

export default PermissionDemo;