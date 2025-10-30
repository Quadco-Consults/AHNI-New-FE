'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, ArrowLeft, Mail, Settings } from 'lucide-react';
import { usePermissions } from '@/hooks/usePermissions';
import { getModuleDisplayName } from '@/constants/permissions';

interface AccessDeniedPageProps {
  /** The module or feature that was denied */
  module?: string;

  /** The specific feature that was denied */
  feature?: string;

  /** The permission that was required */
  permission?: string;

  /** Custom message to display */
  message?: string;

  /** Show contact admin option */
  showContactAdmin?: boolean;

  /** Custom back URL */
  backUrl?: string;

  /** Show user's current permissions for debugging */
  showDebugInfo?: boolean;
}

/**
 * AccessDeniedPage - Shows when user doesn't have permission to access content
 *
 * Features:
 * - Clear explanation of what was denied
 * - Navigation options to go back
 * - Contact admin option
 * - Debug information for development
 * - Responsive design
 */
export const AccessDeniedPage: React.FC<AccessDeniedPageProps> = ({
  module,
  feature,
  permission,
  message,
  showContactAdmin = true,
  backUrl,
  showDebugInfo = false
}) => {
  const router = useRouter();
  const { user, getAllPermissions, getAccessibleModules, isAdmin } = usePermissions();

  const handleGoBack = () => {
    if (backUrl) {
      router.push(backUrl);
    } else {
      router.back();
    }
  };

  const handleGoToDashboard = () => {
    router.push('/dashboard');
  };

  const handleContactAdmin = () => {
    // You can customize this to open a support ticket system or email
    const subject = encodeURIComponent(`Access Request: ${module || feature || 'System Feature'}`);
    const body = encodeURIComponent(
      `Hello,\n\nI am requesting access to the following:\n\n` +
      `Module: ${module || 'N/A'}\n` +
      `Feature: ${feature || 'N/A'}\n` +
      `Permission: ${permission || 'N/A'}\n` +
      `User: ${user?.full_name} (${user?.email})\n` +
      `Department: ${user?.department}\n\n` +
      `Please review and grant appropriate access.\n\nThank you.`
    );

    window.location.href = `mailto:admin@ahni.org?subject=${subject}&body=${body}`;
  };

  // Generate descriptive title and message
  const getTitle = () => {
    if (module) {
      return `Access Denied - ${getModuleDisplayName(module)}`;
    }
    if (feature) {
      return `Access Denied - ${feature}`;
    }
    return 'Access Denied';
  };

  const getDescription = () => {
    if (message) {
      return message;
    }

    if (module) {
      return `You don't have permission to access the ${getModuleDisplayName(module)} module. This module may be restricted to specific departments or roles.`;
    }

    if (feature) {
      return `You don't have permission to access the ${feature} feature. This feature may require additional permissions.`;
    }

    if (permission) {
      return `You don't have the required permission: "${permission}". Please contact your administrator to request access.`;
    }

    return 'You don\'t have permission to access this content. Please contact your administrator if you believe this is an error.';
  };

  const userPermissions = getAllPermissions();
  const userModules = getAccessibleModules();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        <Card className="shadow-lg">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <Shield className="w-8 h-8 text-red-600" />
            </div>
            <CardTitle className="text-xl font-bold text-gray-900">
              {getTitle()}
            </CardTitle>
            <CardDescription className="text-gray-600 mt-2">
              {getDescription()}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* User Information */}
            {user && (
              <div className="bg-gray-50 rounded-lg p-3 text-sm">
                <div className="font-medium text-gray-900">{user.full_name}</div>
                <div className="text-gray-600">{user.email}</div>
                <div className="text-gray-600">{user.department} - {user.designation}</div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={handleGoBack}
                variant="outline"
                className="w-full"
                size="sm"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back
              </Button>

              <Button
                onClick={handleGoToDashboard}
                variant="default"
                className="w-full"
                size="sm"
              >
                <Settings className="w-4 h-4 mr-2" />
                Return to Dashboard
              </Button>

              {showContactAdmin && (
                <Button
                  onClick={handleContactAdmin}
                  variant="secondary"
                  className="w-full"
                  size="sm"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Request Access
                </Button>
              )}
            </div>

            {/* Debug Information (only in development) */}
            {showDebugInfo && process.env.NODE_ENV === 'development' && (
              <details className="bg-yellow-50 border border-yellow-200 rounded p-3 text-xs">
                <summary className="font-medium text-yellow-800 cursor-pointer">
                  Debug Information
                </summary>
                <div className="mt-2 space-y-2 text-yellow-700">
                  <div>
                    <strong>Required Permission:</strong> {permission || 'Not specified'}
                  </div>
                  <div>
                    <strong>Required Module:</strong> {module || 'Not specified'}
                  </div>
                  <div>
                    <strong>User Modules:</strong> {userModules.length > 0 ? userModules.join(', ') : 'None'}
                  </div>
                  <div>
                    <strong>User Permissions ({userPermissions.length}):</strong>
                    <div className="max-h-32 overflow-y-auto mt-1">
                      {userPermissions.length > 0 ? (
                        userPermissions.map(perm => (
                          <div key={perm.id} className="text-xs">
                            • {perm.codename}
                          </div>
                        ))
                      ) : (
                        'None'
                      )}
                    </div>
                  </div>
                  <div>
                    <strong>Is Admin:</strong> {isAdmin() ? 'Yes' : 'No'}
                  </div>
                </div>
              </details>
            )}
          </CardContent>
        </Card>

        {/* Additional Help Text */}
        <div className="text-center text-sm text-gray-500">
          If you believe you should have access to this content, please contact your system administrator or use the "Request Access" button above.
        </div>
      </div>
    </div>
  );
};

/**
 * Simplified AccessDenied component for inline use
 */
export const AccessDeniedInline: React.FC<{
  message?: string;
  className?: string;
}> = ({
  message = "You don't have permission to view this content.",
  className = ""
}) => {
  return (
    <div className={`flex items-center justify-center p-8 ${className}`}>
      <div className="text-center">
        <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Access Restricted</h3>
        <p className="text-gray-600 max-w-sm">{message}</p>
      </div>
    </div>
  );
};

/**
 * Mini access denied component for small spaces
 */
export const AccessDeniedMini: React.FC<{
  message?: string;
}> = ({ message = "Access denied" }) => {
  return (
    <div className="flex items-center justify-center p-4 bg-gray-50 rounded border border-gray-200">
      <Shield className="w-4 h-4 text-gray-400 mr-2" />
      <span className="text-sm text-gray-600">{message}</span>
    </div>
  );
};

export default AccessDeniedPage;