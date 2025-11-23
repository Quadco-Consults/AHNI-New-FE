/**
 * Enhanced Permission Debugging Panel
 * For troubleshooting permission and menu issues
 */

import React, { useState } from 'react';
import { useGetUserProfile } from '@/features/auth/controllers/userController';
import { useAppSelector } from '@/store/hooks';
import { debugCurrentUserState, normalizeUserPermissions } from '@/utils/authFixUtils';
import { departmentalLinks, moduleLinks, globalHubLinks } from '@/utils/sidebarItems';
import {
  filterSidebarByPermissionsEnhanced,
  hasPermissionEnhanced,
  hasGlobalHubAccessEnhanced
} from '@/utils/enhancedSidebarPermissions';

const PermissionsDebugPanel: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { data: userProfile } = useGetUserProfile();
  const authState = useAppSelector(state => state.auth);

  const rawUserData = userProfile?.data || authState.user;

  if (!rawUserData) {
    return (
      <div className="fixed bottom-4 right-4 z-50 bg-red-100 p-4 rounded-lg shadow-lg">
        <p className="text-red-800 font-medium">🚨 No user data available</p>
      </div>
    );
  }

  const runFullDebug = () => {
    console.log('🚀 === FULL PERMISSION DEBUG START ===');

    // Debug user state
    debugCurrentUserState(rawUserData);

    // Debug filtering results
    const filteredDepartmental = filterSidebarByPermissionsEnhanced(departmentalLinks, rawUserData, true);
    const filteredModules = filterSidebarByPermissionsEnhanced(moduleLinks, rawUserData, true);
    const filteredGlobalHub = filterSidebarByPermissionsEnhanced(globalHubLinks, rawUserData, true);

    console.log('📊 FILTERED RESULTS:', {
      departmental: {
        total: departmentalLinks.length,
        visible: filteredDepartmental.length,
        items: filteredDepartmental.map(item => item.name)
      },
      modules: {
        total: moduleLinks.length,
        visible: filteredModules.length,
        items: filteredModules.map(item => item.name)
      },
      globalHub: {
        total: globalHubLinks.length,
        visible: filteredGlobalHub.length,
        hasAccess: hasGlobalHubAccessEnhanced(rawUserData)
      }
    });

    console.log('🚀 === FULL PERMISSION DEBUG END ===');
  };

  const { permissions, roles, enhancedUser } = normalizeUserPermissions(rawUserData);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Toggle Button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-lg mb-2 font-medium"
      >
        🔍 Permission Debug
      </button>

      {/* Debug Panel */}
      {isVisible && (
        <div className="bg-white border border-gray-300 rounded-lg shadow-xl max-w-md max-h-96 overflow-y-auto">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-bold text-lg text-gray-800">🔐 Permission Debug</h3>
          </div>

          <div className="p-4 space-y-4">
            {/* User Info */}
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">👤 User Info</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p><strong>Name:</strong> {enhancedUser.first_name} {enhancedUser.last_name}</p>
                <p><strong>Email:</strong> {enhancedUser.email}</p>
                <p><strong>Department:</strong> {enhancedUser.department?.name || 'N/A'}</p>
                <p><strong>Position:</strong> {enhancedUser.position?.title || 'N/A'}</p>
                <p><strong>Location:</strong> {enhancedUser.location?.name || 'N/A'}</p>
                <p><strong>Staff:</strong> {enhancedUser.is_staff ? '✅' : '❌'}</p>
                <p><strong>Superuser:</strong> {enhancedUser.is_superuser ? '✅' : '❌'}</p>
              </div>
            </div>

            {/* Roles */}
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">🎭 Roles ({roles.length})</h4>
              <div className="text-sm text-gray-600">
                {roles.length > 0 ? (
                  <ul className="list-disc list-inside space-y-1">
                    {roles.map((role, index) => (
                      <li key={index}>
                        {typeof role === 'string' ? role : role?.name || role?.id}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-400">No roles assigned</p>
                )}
              </div>
            </div>

            {/* Permission Summary */}
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">🔐 Permissions ({permissions.length} modules)</h4>
              <div className="text-sm text-gray-600 space-y-1">
                {permissions.map((perm, index) => (
                  <div key={index}>
                    <strong>{perm.module}:</strong> {perm.permissions?.length || 0} permissions
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Tests */}
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">🧪 Quick Tests</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span>{hasPermissionEnhanced(rawUserData, [{ module: 'users', codenames: ['view_user'] }]) ? '✅' : '❌'}</span>
                  <span>Users Access</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>{hasPermissionEnhanced(rawUserData, [{ module: 'hr', codenames: ['view_employee'] }]) ? '✅' : '❌'}</span>
                  <span>HR Access</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>{hasPermissionEnhanced(rawUserData, [{ module: 'admin', codenames: ['view_auditlog'] }]) ? '✅' : '❌'}</span>
                  <span>Admin Access</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>{hasGlobalHubAccessEnhanced(rawUserData) ? '✅' : '❌'}</span>
                  <span>Global Hub Access</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-gray-200 space-y-2">
              <button
                onClick={runFullDebug}
                className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                🚀 Run Full Debug (Check Console)
              </button>
              <button
                onClick={() => {
                  console.log('🔍 RAW USER DATA:', rawUserData);
                  console.log('🔍 PROFILE DATA:', userProfile?.data);
                  console.log('🔍 AUTH STATE:', authState);
                }}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                📊 Log Raw Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PermissionsDebugPanel;