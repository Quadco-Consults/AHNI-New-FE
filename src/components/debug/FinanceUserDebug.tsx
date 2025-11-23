/**
 * Finance User Debug Component
 *
 * This component helps debug finance user authentication and menu visibility issues.
 * Only shows in development mode and when user email contains "finance".
 */
'use client';

import { useAppSelector } from '@/store/hooks';
import { useDepartmentFeatures } from '@/hooks/useDepartmentFeatures';
import { useUnifiedPermissions } from '@/hooks/useUnifiedPermissions';

export default function FinanceUserDebug() {
  const authState = useAppSelector(state => state.auth);
  const { user, hasPermission, isLoading: permissionsLoading } = useUnifiedPermissions();
  const { canAccessFinanceFeatures, userDepartment } = useDepartmentFeatures();

  // Only show in development
  // Show for any user with "finance" in email OR if accessing the page and no authentication
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  const hasFinanceEmail = user?.email?.toLowerCase().includes('finance');
  const isUnauthenticated = !authState.isAuthenticated;

  // Show debug if: finance user OR unauthenticated (to help with finance login)
  if (!hasFinanceEmail && authState.isAuthenticated) {
    return null;
  }

  const financePermissions = user?.permissions?.filter(p =>
    p.module === 'finance' || (p as any).codename?.includes('finance')
  ) || [];

  const checkFinanceModulePermission = () => {
    return hasPermission([{
      module: "finance",
      codenames: ["view_budgetline"]
    }]);
  };

  return (
    <div className="fixed bottom-4 right-4 bg-blue-900 text-white p-4 rounded-lg shadow-lg max-w-md text-xs z-50">
      <h3 className="font-bold text-sm mb-2">🏦 Finance User Debug</h3>

      <div className="space-y-2">
        <div>
          <strong>Authentication:</strong>
          <div className="ml-2">
            ✓ Email: {user?.email}<br/>
            ✓ Authenticated: {authState.isAuthenticated ? '✅' : '❌'}<br/>
            ✓ Loading: {permissionsLoading ? '⏳' : '✅'}<br/>
          </div>
        </div>

        <div>
          <strong>Department Info:</strong>
          <div className="ml-2">
            ✓ Position: {user?.position?.name || user?.position?.title || 'Not set'}<br/>
            ✓ Department: {userDepartment || 'Not set'}<br/>
            ✓ Can Access Finance: {canAccessFinanceFeatures ? '✅' : '❌'}<br/>
          </div>
        </div>

        <div>
          <strong>Permissions:</strong>
          <div className="ml-2">
            ✓ Total Permissions: {user?.permissions?.length || 0}<br/>
            ✓ Finance Permissions: {financePermissions.length}<br/>
            ✓ Finance Module Access: {checkFinanceModulePermission() ? '✅' : '❌'}<br/>
          </div>
        </div>

        <div>
          <strong>Expected Finance Menus (22 items):</strong>
          <div className="ml-2 text-xs">
            • Overview<br/>
            • Financial Classifications<br/>
            • Chart of Accounts<br/>
            • Bank Accounts<br/>
            • Journal Entries<br/>
            • Financial Reports<br/>
            • Bank Reconciliation<br/>
            • Integration Dashboard<br/>
            • Financial Analysis<br/>
            • QuickBooks Settings<br/>
            • QuickBooks Sync<br/>
            • Customer Management<br/>
            • Invoicing & Billing<br/>
            • Sales Orders<br/>
            • Accounts Receivable<br/>
            • Tax Management<br/>
            • Accounts Payable<br/>
            • Fixed Assets<br/>
            • Expense Tracking<br/>
            • Budget Reports<br/>
            • Petty Cash<br/>
            • Travel Reconciliation
          </div>
        </div>

        <div>
          <strong>Expected Result:</strong>
          <div className="ml-2 text-green-300">
            Should see Finance menu if authenticated ✅ AND (email contains "finance" OR department is "Finance" OR has finance permissions)
          </div>
        </div>

        {!authState.isAuthenticated && (
          <div className="bg-red-800 p-2 rounded mt-2">
            <strong>❌ Issue:</strong> User not authenticated.<br/>
            <strong>Solution:</strong> Log out completely and log in with financemanager@ahni.test to see Finance menu.<br/>
            <strong>Steps:</strong><br/>
            1. Go to /auth/login<br/>
            2. Enter: financemanager@ahni.test<br/>
            3. Use correct password<br/>
            4. Return to dashboard
          </div>
        )}

        {authState.isAuthenticated && !canAccessFinanceFeatures && (
          <div className="bg-orange-800 p-2 rounded mt-2">
            <strong>⚠️ Issue:</strong> Authenticated but no finance access detected.<br/>
            <strong>Possible causes:</strong><br/>
            • Backend user lacks finance permissions<br/>
            • User department not set to "Finance"<br/>
            • Email doesn't contain "finance"<br/>
            • Position doesn't contain "finance"
          </div>
        )}

        {authState.isAuthenticated && canAccessFinanceFeatures && (
          <div className="bg-green-800 p-2 rounded mt-2">
            <strong>✅ Success:</strong> Authentication and finance access working correctly!<br/>
            Finance menu should be visible in the sidebar.
          </div>
        )}

        <div className="bg-blue-800 p-2 rounded mt-2">
          <strong>💡 Debug Info:</strong><br/>
          • Current URL: {typeof window !== 'undefined' ? window.location.pathname : 'SSR'}<br/>
          • Local Storage Token: {typeof window !== 'undefined' ? (localStorage.getItem('token') ? '✅ Present' : '❌ Missing') : 'SSR'}<br/>
          • Local Storage User: {typeof window !== 'undefined' ? (localStorage.getItem('user') ? '✅ Present' : '❌ Missing') : 'SSR'}
        </div>
      </div>
    </div>
  );
}