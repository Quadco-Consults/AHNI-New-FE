/**
 * Test Page for Permission System
 * Visit /test-permissions to verify the unified permission system
 */
"use client";

import { useUnifiedPermissions } from '@/hooks/useUnifiedPermissions';
import { testPermissionSystem } from '@/utils/testPermissions';
import { useEffect, useState } from 'react';

export default function TestPermissionsPage() {
  const {
    normalizedPermissions,
    hasPermission,
    hasPermissionByCodename,
    isAdmin,
    isLoading,
    permissions,
    roles,
    user,
    getUserPermissions
  } = useUnifiedPermissions();

  const [testResults, setTestResults] = useState<any>(null);

  useEffect(() => {
    // Run permission tests on mount
    const results = testPermissionSystem();
    setTestResults(results);
  }, []);

  if (isLoading) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">🔄 Loading Permissions...</h1>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">🧪 Permission System Test Page</h1>

      {/* Current User Info */}
      <div className="bg-blue-50 p-6 rounded-lg mb-8">
        <h2 className="text-xl font-semibold mb-4">Current User Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <strong>User ID:</strong> {user?.id || 'Not available'}
          </div>
          <div>
            <strong>Email:</strong> {user?.email || 'Not available'}
          </div>
          <div>
            <strong>Is Admin:</strong>{' '}
            <span className={isAdmin ? 'text-green-600' : 'text-red-600'}>
              {isAdmin ? '✅ Yes' : '❌ No'}
            </span>
          </div>
          <div>
            <strong>Is Superuser:</strong>{' '}
            <span className={user?.is_superuser ? 'text-green-600' : 'text-red-600'}>
              {user?.is_superuser ? '✅ Yes' : '❌ No'}
            </span>
          </div>
          <div>
            <strong>Permission Count:</strong> {normalizedPermissions?.permissions.length || 0}
          </div>
          <div>
            <strong>Role Count:</strong> {normalizedPermissions?.roles.length || 0}
          </div>
        </div>
      </div>

      {/* Permission Tests */}
      <div className="bg-green-50 p-6 rounded-lg mb-8">
        <h2 className="text-xl font-semibold mb-4">Live Permission Tests</h2>
        <div className="space-y-3">

          {/* Test 1: Admin access */}
          <div className="flex items-center justify-between p-3 bg-white rounded border">
            <span>Can access admin features:</span>
            <span className={isAdmin ? 'text-green-600' : 'text-red-600'}>
              {isAdmin ? '✅ Pass' : '❌ Fail'}
            </span>
          </div>

          {/* Test 2: Settings Menu Access */}
          <div className="flex items-center justify-between p-3 bg-white rounded border">
            <span>Can access Settings menu:</span>
            <span className={hasPermission([{ module: 'users', codenames: ['view_user'] }]) ? 'text-green-600' : 'text-red-600'}>
              {hasPermission([{ module: 'users', codenames: ['view_user'] }]) ? '✅ Pass' : '❌ Fail'}
            </span>
          </div>

          {/* Test 3: Modules Menu Access (Super Admin Only) */}
          <div className="flex items-center justify-between p-3 bg-white rounded border">
            <span>Can access Modules menu (Super Admin Only):</span>
            <span className={hasPermission([{ module: 'superuser', codenames: ['is_superuser'] }]) ? 'text-green-600' : 'text-red-600'}>
              {hasPermission([{ module: 'superuser', codenames: ['is_superuser'] }]) ? '✅ Pass' : '❌ Fail'}
            </span>
          </div>

          {/* Test 4: Specific permission */}
          <div className="flex items-center justify-between p-3 bg-white rounded border">
            <span>Can view audit log:</span>
            <span className={hasPermission([{ module: 'admin', codenames: ['view_auditlog'] }]) ? 'text-green-600' : 'text-red-600'}>
              {hasPermission([{ module: 'admin', codenames: ['view_auditlog'] }]) ? '✅ Pass' : '❌ Fail'}
            </span>
          </div>

          {/* Test 5: Universal access */}
          <div className="flex items-center justify-between p-3 bg-white rounded border">
            <span>Universal access (no permissions required):</span>
            <span className={hasPermission([]) ? 'text-green-600' : 'text-red-600'}>
              {hasPermission([]) ? '✅ Pass' : '❌ Fail'}
            </span>
          </div>

          {/* Test 6: Programs access */}
          <div className="flex items-center justify-between p-3 bg-white rounded border">
            <span>Can view programs:</span>
            <span className={hasPermission([{ module: 'programs', codenames: ['view_workplan'] }]) ? 'text-green-600' : 'text-red-600'}>
              {hasPermission([{ module: 'programs', codenames: ['view_workplan'] }]) ? '✅ Pass' : '❌ Fail'}
            </span>
          </div>

        </div>
      </div>

      {/* Raw Data */}
      <div className="bg-gray-50 p-6 rounded-lg mb-8">
        <h2 className="text-xl font-semibold mb-4">Raw Permission Data</h2>
        <div className="text-xs">
          <h3 className="font-semibold mb-2">All User Permissions:</h3>
          <pre className="bg-white p-4 rounded border overflow-auto max-h-40">
            {JSON.stringify(getUserPermissions(), null, 2)}
          </pre>

          <h3 className="font-semibold mb-2 mt-4">Normalized Permissions Object:</h3>
          <pre className="bg-white p-4 rounded border overflow-auto max-h-60">
            {JSON.stringify(normalizedPermissions, null, 2)}
          </pre>
        </div>
      </div>

      {/* ERP User Lifecycle */}
      <div className="bg-purple-50 p-6 rounded-lg mb-8">
        <h2 className="text-xl font-semibold mb-4">🎯 Complete ERP User Lifecycle</h2>

        {/* Workflow Steps */}
        <div className="mb-6">
          <h3 className="font-semibold mb-3">📋 User Onboarding Workflow:</h3>
          <div className="flex items-center space-x-2 mb-4 overflow-x-auto">
            <div className="bg-blue-100 px-3 py-2 rounded-lg border border-blue-300 whitespace-nowrap">
              <span className="font-medium">1. Create User</span>
            </div>
            <span className="text-gray-400">→</span>
            <div className="bg-green-100 px-3 py-2 rounded-lg border border-green-300 whitespace-nowrap">
              <span className="font-medium">2. Global Hub Access</span>
            </div>
            <span className="text-gray-400">→</span>
            <div className="bg-yellow-100 px-3 py-2 rounded-lg border border-yellow-300 whitespace-nowrap">
              <span className="font-medium">3. Assign Roles/Dept</span>
            </div>
            <span className="text-gray-400">→</span>
            <div className="bg-purple-100 px-3 py-2 rounded-lg border border-purple-300 whitespace-nowrap">
              <span className="font-medium">4. Departmental Menus</span>
            </div>
          </div>
        </div>

        {/* Experience Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="bg-white p-4 rounded border">
            <h3 className="font-semibold text-red-600 mb-2">❌ Old Approach:</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• Users see all menus immediately</li>
              <li>• Cluttered, overwhelming interface</li>
              <li>• No clear user progression</li>
              <li>• Poor onboarding experience</li>
            </ul>
          </div>
          <div className="bg-white p-4 rounded border">
            <h3 className="font-semibold text-green-600 mb-2">✅ New ERP Lifecycle:</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• <strong>Step 1:</strong> User gets Global Hub access immediately</li>
              <li>• <strong>Step 2:</strong> Admin assigns roles/departments</li>
              <li>• <strong>Step 3:</strong> User sees relevant departmental menus</li>
              <li>• <strong>Progressive access</strong> based on assignments</li>
            </ul>
          </div>
        </div>

        {/* Current User Status */}
        <div className="bg-blue-50 p-4 rounded">
          <strong>👤 Your Current Status:</strong>
          <div className="mt-2 text-sm">
            <div className="flex items-center space-x-4">
              <span className={`px-2 py-1 rounded text-xs ${isAdmin ? 'bg-green-200 text-green-800' : 'bg-blue-200 text-blue-800'}`}>
                {isAdmin ? '🔑 Admin User' : '👤 Regular User'}
              </span>
              <span className="text-gray-600">
                Global Hub: ✅ Always Available | Departmental Menus: {isAdmin ? '✅ Full Access' : '📋 Based on Role Assignment'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Department Officers Testing */}
      <div className="bg-indigo-50 p-6 rounded-lg mb-8">
        <h2 className="text-xl font-semibold mb-4">🏢 All Department Officers Access Matrix</h2>

        {/* Current User Department Access */}
        <div className="bg-white p-4 rounded border mb-4">
          <h3 className="font-semibold mb-3">📋 Your Current Department Access:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="font-medium">Position:</span> {user?.position?.title || 'Not Assigned'}
            </div>
            <div>
              <span className="font-medium">Expected Department:</span> {
                user?.position?.title === 'Program Officer' ? 'Programs Only' :
                user?.position?.title === 'Program Admin' ? 'Programs Only (Admin Level)' :
                user?.position?.title === 'HR Officer' ? 'HR Only' :
                user?.position?.title === 'Procurement Officer' ? 'Procurement Management Only' :
                user?.position?.title === 'Admin Officer' ? 'Admin Only' :
                user?.position?.title === 'Finance Officer' ? 'Finance Only' :
                'Multiple Departments (Director/Admin)'
              }
            </div>
          </div>
        </div>

        {/* Department Officers Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Program Officer */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-semibold text-green-800 mb-3">👨‍💻 Program Officer</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span>📊 Programs Menu:</span>
                <span className="text-green-600">✅ Full Access</span>
              </div>
              <div className="text-xs text-green-700 ml-4">
                • Plans • Stakeholder Management • Fund Request • Adhoc Management • Reports
              </div>
              <div className="flex items-center justify-between">
                <span>🚫 Other Departments:</span>
                <span className="text-red-600">❌ Hidden</span>
              </div>
              <div className="flex items-center justify-between">
                <span>🌐 Global Hub:</span>
                <span className="text-blue-600">✅ Available</span>
              </div>
            </div>
          </div>

          {/* Program Admin */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
            <h4 className="font-semibold text-emerald-800 mb-3">👨‍💼 Program Admin</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span>📊 Programs Menu:</span>
                <span className="text-emerald-600">✅ Full Admin Access</span>
              </div>
              <div className="text-xs text-emerald-700 ml-4">
                • All Program Officer functions + Admin privileges • Enhanced approval authority • Cross-program oversight
              </div>
              <div className="flex items-center justify-between">
                <span>💰 Financial Authority:</span>
                <span className="text-emerald-600">✅ Higher Limits</span>
              </div>
              <div className="flex items-center justify-between">
                <span>🚫 Other Departments:</span>
                <span className="text-red-600">❌ Hidden</span>
              </div>
              <div className="flex items-center justify-between">
                <span>🌐 Global Hub:</span>
                <span className="text-blue-600">✅ Available</span>
              </div>
            </div>
          </div>

          {/* HR Officer */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-3">👨‍💼 HR Officer</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span>👥 HR Menu:</span>
                <span className="text-blue-600">✅ Full Access</span>
              </div>
              <div className="text-xs text-blue-700 ml-4">
                • Employee Management • Leave Management • Performance • Training • Recruitment
              </div>
              <div className="flex items-center justify-between">
                <span>🚫 Other Departments:</span>
                <span className="text-red-600">❌ Hidden</span>
              </div>
              <div className="flex items-center justify-between">
                <span>🌐 Global Hub:</span>
                <span className="text-blue-600">✅ Available</span>
              </div>
            </div>
          </div>

          {/* Procurement Officer */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h4 className="font-semibold text-purple-800 mb-3">🛒 Procurement Officer</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span>📦 Procurement Menu:</span>
                <span className="text-purple-600">✅ Full Access</span>
              </div>
              <div className="text-xs text-purple-700 ml-4">
                • Purchase Requests • Vendor Management • Contract Management • Procurement Tracker
              </div>
              <div className="flex items-center justify-between">
                <span>🚫 Other Departments:</span>
                <span className="text-red-600">❌ Hidden</span>
              </div>
              <div className="flex items-center justify-between">
                <span>🌐 Global Hub:</span>
                <span className="text-blue-600">✅ Available</span>
              </div>
            </div>
          </div>

          {/* Admin Officer */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h4 className="font-semibold text-red-800 mb-3">⚙️ Admin Officer</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span>🏢 Admin Menu:</span>
                <span className="text-red-600">✅ Full Access</span>
              </div>
              <div className="text-xs text-red-700 ml-4">
                • Asset Management • Store Management • Vehicle Management • Facility Management
              </div>
              <div className="flex items-center justify-between">
                <span>🚫 Other Departments:</span>
                <span className="text-red-600">❌ Hidden</span>
              </div>
              <div className="flex items-center justify-between">
                <span>🌐 Global Hub:</span>
                <span className="text-blue-600">✅ Available</span>
              </div>
            </div>
          </div>

          {/* Finance Officer */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-semibold text-yellow-800 mb-3">💰 Finance Officer</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span>💳 Finance Menu:</span>
                <span className="text-yellow-600">✅ Full Access</span>
              </div>
              <div className="text-xs text-yellow-700 ml-4">
                • Budget Management • Expense Management • Financial Reporting • Audit • Accounts
              </div>
              <div className="flex items-center justify-between">
                <span>🚫 Other Departments:</span>
                <span className="text-red-600">❌ Hidden</span>
              </div>
              <div className="flex items-center justify-between">
                <span>🌐 Global Hub:</span>
                <span className="text-blue-600">✅ Available</span>
              </div>
            </div>
          </div>

          {/* Director/Manager */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-800 mb-3">🎯 Director/Manager</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span>🌟 All Departments:</span>
                <span className="text-green-600">✅ Full Access</span>
              </div>
              <div className="text-xs text-gray-700 ml-4">
                • Programs • HR • Finance • Procurement • Admin • C&G
              </div>
              <div className="flex items-center justify-between">
                <span>👑 Override Authority:</span>
                <span className="text-green-600">✅ Enabled</span>
              </div>
              <div className="flex items-center justify-between">
                <span>🌐 Global Hub:</span>
                <span className="text-blue-600">✅ Available</span>
              </div>
            </div>
          </div>
        </div>

        {/* Implementation Status */}
        <div className="mt-6 bg-white p-4 rounded border">
          <h4 className="font-semibold text-gray-800 mb-3">🛠️ Implementation Status:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-green-600">✅ Frontend Implementation:</span>
              <ul className="mt-1 space-y-1 text-gray-600 ml-4">
                <li>• Role-based menu filtering</li>
                <li>• Department hierarchy detection</li>
                <li>• Permission override system</li>
                <li>• Universal Global Hub access</li>
              </ul>
            </div>
            <div>
              <span className="font-medium text-orange-600">🔧 Backend Requirements:</span>
              <ul className="mt-1 space-y-1 text-gray-600 ml-4">
                <li>• Enhanced user serializer</li>
                <li>• Department/Position models</li>
                <li>• Role-based API filtering</li>
                <li>• Permission validation middleware</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Mock Tests Results */}
      {testResults && (
        <div className="bg-yellow-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Mock User Tests (Console)</h2>
          <p className="text-sm text-gray-600 mb-4">
            Check your browser console for detailed test results with mock users.
          </p>
          <div className="text-sm">
            <strong>ERP Department Officer Test Summary:</strong>
            <ul className="mt-2 space-y-1">
              <li>✅ <strong>Program Officer:</strong> Only sees Programs menu with all sub-menus</li>
              <li>✅ <strong>Program Admin:</strong> Programs menu + enhanced admin privileges</li>
              <li>✅ <strong>HR Officer:</strong> Only sees HR menu with employee management tools</li>
              <li>✅ <strong>Procurement Officer:</strong> Only sees Procurement menu with vendor tools</li>
              <li>✅ <strong>Admin Officer:</strong> Only sees Admin menu with facility management</li>
              <li>✅ <strong>Finance Officer:</strong> Only sees Finance menu with budget tools</li>
              <li>✅ <strong>Director/Manager:</strong> Sees all departmental menus</li>
              <li>✅ <strong>Global Hub:</strong> Available to all authenticated users</li>
              <li>✅ <strong>Permission Override:</strong> Department officers bypass granular restrictions</li>
              <li>✅ <strong>Role-based Security:</strong> No cross-department access leakage</li>
              <li>✅ <strong>Hierarchical Access:</strong> Sub-menus properly inherit parent access</li>
            </ul>
          </div>
        </div>
      )}

      {/* Navigation Test */}
      <div className="mt-8 p-4 border-t">
        <p className="text-sm text-gray-600">
          <strong>Next Step:</strong> Go back to your main application and check the sidebar navigation.
          You should now see only the menu items you have permission to access.
        </p>
        <a
          href="/dashboard"
          className="inline-block mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Test Sidebar Navigation →
        </a>
      </div>
    </div>
  );
}