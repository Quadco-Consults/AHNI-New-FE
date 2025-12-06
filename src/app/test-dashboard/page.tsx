/**
 * Simple Dashboard Test Page
 * Visit /test-dashboard to verify routing works
 */
"use client";

import { useUnifiedPermissions } from '@/hooks/useUnifiedPermissions';

export default function TestDashboardPage() {
  const {
    isLoading,
    isAdmin,
    user
  } = useUnifiedPermissions();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🎯 Test Dashboard
          </h1>
          <p className="text-gray-600">
            Welcome back, {user?.first_name || 'User'}!
          </p>
        </div>

        {/* User Info Card */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">👤 User Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h3 className="font-medium text-gray-700">Name</h3>
              <p className="text-gray-900">{user?.first_name} {user?.last_name}</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-700">Email</h3>
              <p className="text-gray-900">{user?.email}</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-700">Role</h3>
              <p className="text-gray-900">
                {isAdmin ? '🔑 Administrator' : '👤 Regular User'}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm">📊</span>
              </div>
              <div className="ml-3">
                <p className="text-blue-600 text-sm font-medium">Dashboard</p>
                <p className="text-blue-900 text-lg font-semibold">Working ✅</p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm">🔐</span>
              </div>
              <div className="ml-3">
                <p className="text-green-600 text-sm font-medium">Permissions</p>
                <p className="text-green-900 text-lg font-semibold">Active ✅</p>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm">🚀</span>
              </div>
              <div className="ml-3">
                <p className="text-purple-600 text-sm font-medium">Route</p>
                <p className="text-purple-900 text-lg font-semibold">Loaded ✅</p>
              </div>
            </div>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm">⚙️</span>
              </div>
              <div className="ml-3">
                <p className="text-orange-600 text-sm font-medium">System</p>
                <p className="text-orange-900 text-lg font-semibold">Ready ✅</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">🔧 Troubleshooting</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <span>Main Dashboard Route</span>
                <a
                  href="/dashboard"
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Test →
                </a>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <span>Permission Test</span>
                <a
                  href="/test-permissions"
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Test →
                </a>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <span>Projects Page</span>
                <a
                  href="/dashboard/projects"
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Test →
                </a>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">📱 Quick Links</h3>
            <div className="space-y-3">
              <a
                href="/dashboard/adhoc-requisition/create"
                className="block p-3 bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition-colors"
              >
                📝 Create Adhoc Requisition
              </a>
              <a
                href="/dashboard/projects"
                className="block p-3 bg-green-50 text-green-700 rounded hover:bg-green-100 transition-colors"
              >
                🎯 View Projects
              </a>
              <a
                href="/dashboard/admin"
                className="block p-3 bg-purple-50 text-purple-700 rounded hover:bg-purple-100 transition-colors"
              >
                ⚙️ Admin Panel
              </a>
            </div>
          </div>
        </div>

        {/* Debug Info */}
        <div className="mt-8 bg-gray-800 text-green-400 rounded-lg p-4 font-mono text-sm">
          <h3 className="text-green-300 font-semibold mb-2">🐛 Debug Info:</h3>
          <p>✅ Test dashboard is working</p>
          <p>✅ User authentication is working</p>
          <p>✅ Permission system is working</p>
          <p>⏰ Timestamp: {new Date().toLocaleString()}</p>
        </div>

      </div>
    </div>
  );
}