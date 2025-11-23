import React from 'react';
import { useAppSelector } from '../../store/hooks';

/**
 * Authentication Debug Component
 * Use this to diagnose authentication and permission loading issues
 */
export const AuthDebugComponent: React.FC = () => {
  // Get the full auth state
  const authState = useAppSelector((state) => state.auth);
  const currentUser = useAppSelector((state) => state.auth.user);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">🔍 Authentication Debug</h1>

      {/* Quick Status */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className={`p-4 rounded-lg ${authState.isAuthenticated ? 'bg-green-100 border border-green-400' : 'bg-red-100 border border-red-400'}`}>
          <h3 className="font-semibold">Authentication Status</h3>
          <p className={authState.isAuthenticated ? 'text-green-700' : 'text-red-700'}>
            {authState.isAuthenticated ? '✅ Authenticated' : '❌ Not Authenticated'}
          </p>
        </div>

        <div className={`p-4 rounded-lg ${currentUser ? 'bg-green-100 border border-green-400' : 'bg-red-100 border border-red-400'}`}>
          <h3 className="font-semibold">User Object</h3>
          <p className={currentUser ? 'text-green-700' : 'text-red-700'}>
            {currentUser ? '✅ User Loaded' : '❌ No User'}
          </p>
        </div>

        <div className={`p-4 rounded-lg ${currentUser?.permissions ? 'bg-green-100 border border-green-400' : 'bg-red-100 border border-red-400'}`}>
          <h3 className="font-semibold">Permissions</h3>
          <p className={currentUser?.permissions ? 'text-green-700' : 'text-red-700'}>
            {currentUser?.permissions ? `✅ ${currentUser.permissions.length} modules` : '❌ No Permissions'}
          </p>
        </div>

        <div className={`p-4 rounded-lg ${authState.loading ? 'bg-yellow-100 border border-yellow-400' : 'bg-blue-100 border border-blue-400'}`}>
          <h3 className="font-semibold">Loading Status</h3>
          <p className={authState.loading ? 'text-yellow-700' : 'text-blue-700'}>
            {authState.loading ? '⏳ Loading...' : '✅ Complete'}
          </p>
        </div>
      </div>

      {/* Detailed Auth State */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">📊 Full Auth State</h2>
        <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-96">
          {JSON.stringify(authState, null, 2)}
        </pre>
      </div>

      {/* User Details */}
      {currentUser && (
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">👤 User Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Basic Info</h3>
              <ul className="space-y-1 text-sm">
                <li><strong>ID:</strong> {currentUser.id}</li>
                <li><strong>Username:</strong> {currentUser.username}</li>
                <li><strong>Email:</strong> {currentUser.email}</li>
                <li><strong>First Name:</strong> {currentUser.first_name}</li>
                <li><strong>Last Name:</strong> {currentUser.last_name}</li>
                <li><strong>Is Active:</strong> {currentUser.is_active ? 'Yes' : 'No'}</li>
                <li><strong>Is Staff:</strong> {currentUser.is_staff ? 'Yes' : 'No'}</li>
                <li><strong>Is Superuser:</strong> {currentUser.is_superuser ? 'Yes' : 'No'}</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Account Status</h3>
              <ul className="space-y-1 text-sm">
                <li><strong>Date Joined:</strong> {currentUser.date_joined}</li>
                <li><strong>Last Login:</strong> {currentUser.last_login || 'N/A'}</li>
                <li><strong>Groups:</strong> {currentUser.groups?.length || 0}</li>
                <li><strong>User Permissions:</strong> {currentUser.user_permissions?.length || 0}</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Permission Modules */}
      {currentUser?.permissions && currentUser.permissions.length > 0 && (
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">🔐 Permission Modules</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentUser.permissions.map((module, index) => (
              <div key={index} className="border border-gray-200 rounded p-4">
                <h3 className="font-semibold text-blue-700 mb-2">{module.module}</h3>
                <p className="text-sm text-gray-600 mb-2">
                  {module.permissions.length} permission{module.permissions.length !== 1 ? 's' : ''}
                </p>
                <details className="text-xs">
                  <summary className="cursor-pointer text-blue-600 hover:text-blue-800">
                    View permissions
                  </summary>
                  <ul className="mt-2 space-y-1 max-h-32 overflow-y-auto">
                    {module.permissions.map((perm, permIndex) => (
                      <li key={permIndex} className="text-gray-700">
                        • {perm.codename}
                      </li>
                    ))}
                  </ul>
                </details>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Token Information */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">🔑 Token Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Access Token</h3>
            <p className="text-sm bg-gray-100 p-2 rounded break-all">
              {authState.access_token ?
                `${authState.access_token.substring(0, 50)}...` :
                'No access token'
              }
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Refresh Token</h3>
            <p className="text-sm bg-gray-100 p-2 rounded break-all">
              {authState.refresh_token ?
                `${authState.refresh_token.substring(0, 50)}...` :
                'No refresh token'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Troubleshooting Steps */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-yellow-800 mb-4">🛠️ Troubleshooting Steps</h2>

        {!authState.isAuthenticated && (
          <div className="mb-4">
            <h3 className="font-semibold text-red-700 mb-2">❌ Not Authenticated</h3>
            <ul className="list-disc list-inside text-sm space-y-1">
              <li>Try logging in again</li>
              <li>Check if your session has expired</li>
              <li>Verify your login credentials</li>
              <li>Check browser console for authentication errors</li>
            </ul>
          </div>
        )}

        {authState.isAuthenticated && !currentUser && (
          <div className="mb-4">
            <h3 className="font-semibold text-orange-700 mb-2">⚠️ Authenticated but No User Data</h3>
            <ul className="list-disc list-inside text-sm space-y-1">
              <li>Check if the user data fetch API call is failing</li>
              <li>Verify the Redux user reducer is working correctly</li>
              <li>Check network tab for failed API requests</li>
            </ul>
          </div>
        )}

        {currentUser && (!currentUser.permissions || currentUser.permissions.length === 0) && (
          <div className="mb-4">
            <h3 className="font-semibold text-red-700 mb-2">❌ User Loaded but No Permissions</h3>
            <ul className="list-disc list-inside text-sm space-y-1">
              <li>Check if the backend is returning permissions in the user API response</li>
              <li>Verify the user has been assigned roles in the backend admin</li>
              <li>Ensure the permissions are being properly deserialized in Redux</li>
              <li>Check the backend user serializer includes permissions</li>
            </ul>
          </div>
        )}

        {authState.loading && (
          <div className="mb-4">
            <h3 className="font-semibold text-blue-700 mb-2">ℹ️ Still Loading</h3>
            <ul className="list-disc list-inside text-sm space-y-1">
              <li>Wait for the authentication process to complete</li>
              <li>If loading persists, check for network issues</li>
              <li>Verify API endpoints are responding</li>
            </ul>
          </div>
        )}

        <div className="mt-4 p-3 bg-blue-50 rounded">
          <h3 className="font-semibold text-blue-800 mb-2">🔄 Next Steps</h3>
          <ol className="list-decimal list-inside text-sm space-y-1 text-blue-700">
            <li>If not authenticated: Try logging in</li>
            <li>If no user data: Check Redux store and API calls</li>
            <li>If no permissions: Verify backend role assignment</li>
            <li>If still issues: Check browser developer tools for errors</li>
          </ol>
        </div>
      </div>
    </div>
  );
};