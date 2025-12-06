import React from 'react';
import { LoginTestComponent } from '../../components/debug/LoginTestComponent';

/**
 * Debug page to test the enhanced login integration
 *
 * To use this page:
 * 1. Add this route to your router: /debug/login-test
 * 2. Login with a Program Officer account
 * 3. Navigate to /debug/login-test
 * 4. Check the console and UI for detailed breakdown
 *
 * Expected results for Program Officer:
 * - User should have organizational context (department: Programs)
 * - Should have 120+ permissions across multiple modules
 * - Should see Programs department menu + Global Hub items
 * - Should have appropriate access levels based on position
 */
export function LoginTestPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              🧪 Enhanced Login Integration Test
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              This page tests the integration between your backend organizational structure
              and frontend permission system. Login with different user types to see how
              their organizational context affects their access and menu structure.
            </p>
          </div>

          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h2 className="font-semibold text-blue-800 mb-2">📋 Test Instructions</h2>
            <div className="text-blue-700 text-sm space-y-1">
              <p>1. <strong>Backend Setup:</strong> Ensure your Django backend has the organizational structure implemented</p>
              <p>2. <strong>Login Test:</strong> Login with the test accounts: programofficer@ahni.test (password: testpass123)</p>
              <p>3. <strong>Expected Results:</strong> User should have full organizational context and appropriate permissions</p>
              <p>4. <strong>Console Logs:</strong> Check browser console for detailed authentication and permission data</p>
            </div>
          </div>

          <LoginTestComponent />

          <div className="mt-8 p-4 bg-gray-100 border border-gray-200 rounded-lg">
            <h2 className="font-semibold text-gray-800 mb-2">🔧 Integration Checklist</h2>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <h3 className="font-medium mb-2">Backend Requirements:</h3>
                <ul className="space-y-1 text-gray-600">
                  <li>✅ Django organizational models created</li>
                  <li>✅ Enhanced login endpoint implemented</li>
                  <li>✅ Permission serialization working</li>
                  <li>✅ User organizational context included</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium mb-2">Frontend Requirements:</h3>
                <ul className="space-y-1 text-gray-600">
                  <li>✅ Auth controller updated to dispatch to Redux</li>
                  <li>✅ Auth types updated with organizational fields</li>
                  <li>✅ Organizational access hook updated</li>
                  <li>✅ Permission checking working</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h2 className="font-semibold text-yellow-800 mb-2">⚠️ Troubleshooting</h2>
            <div className="text-yellow-700 text-sm space-y-2">
              <p><strong>If permissions show as 0:</strong> Check that login response includes permissions array</p>
              <p><strong>If organizational context is missing:</strong> Verify backend serializer includes department/position/role</p>
              <p><strong>If access checks fail:</strong> Ensure permission codes match between backend and frontend</p>
              <p><strong>If menus don't show:</strong> Check that user has appropriate position level and permissions</p>
            </div>
          </div>

          <div className="mt-8 text-center text-gray-500 text-sm">
            <p>🗑️ This debug page should be removed before production deployment</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginTestPage;