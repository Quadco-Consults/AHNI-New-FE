import React from 'react';
import { useProgramOfficerPermissions } from '../../hooks/useProgramOfficerPermissions';

/**
 * Quick Permission Test Component
 * Use this component to quickly verify Program Officer permissions are working
 * after login with the real user data you provided
 */
export const QuickPermissionTest: React.FC = () => {
  const permissions = useProgramOfficerPermissions();

  // Expected permissions based on your login response
  const expectedResults = {
    // Should be TRUE for Program Officer
    canCreateWorkplan: true,
    canCreateFundRequest: true,
    canCreateLeaveRequest: true,
    canCreateTimesheet: true,
    canApplyForJob: true, // add_jobapplication
    canCreatePurchaseRequest: true,
    canCreateEA: true, // add_expenseauthorization
    canCreateTER: true, // add_travelexpensereport
    canCreateItemRequisition: true,
    canCreateAdhocRequisition: true,
    canCreateSiteVisit: true, // add_sitevisit
    canCreateAnnualPlan: true, // add_annualsupervisionplan

    // Should be FALSE for Program Officer (no approval permissions)
    canApprove: false,
    canAuthorize: false,
    canReview: false
  };

  // Calculate test results
  const testResults = Object.entries(expectedResults).map(([key, expected]) => {
    const actual = permissions[key as keyof typeof permissions];
    const passed = actual === expected;
    return {
      permission: key,
      expected,
      actual,
      passed
    };
  });

  const totalTests = testResults.length;
  const passedTests = testResults.filter(r => r.passed).length;
  const accuracy = Math.round((passedTests / totalTests) * 100);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        🧪 Quick Permission Test - Program Officer
      </h1>

      {/* Overall Status */}
      <div className={`p-4 rounded-lg mb-6 ${
        accuracy === 100 ? 'bg-green-100 border border-green-400' : 'bg-red-100 border border-red-400'
      }`}>
        <h2 className="text-xl font-semibold mb-2">
          {accuracy === 100 ? '✅ All Tests Passed!' : '❌ Some Tests Failed'}
        </h2>
        <p className="text-lg">
          Score: {passedTests}/{totalTests} ({accuracy}%)
        </p>
        <p className="text-sm mt-2">
          Authentication: {permissions.isAuthenticated ? '✅ Authenticated' : '❌ Not Authenticated'}
        </p>
        <p className="text-sm">
          Loading: {permissions.loading ? '⏳ Loading...' : '✅ Complete'}
        </p>
        <p className="text-sm">
          Is Program Officer: {permissions.isProgramOfficer ? '✅ Yes' : '❌ No'}
        </p>
      </div>

      {/* Test Results */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b">
          <h3 className="text-lg font-semibold">Test Results</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {testResults.map((result, index) => (
            <div
              key={index}
              className={`px-6 py-3 flex justify-between items-center ${
                result.passed ? 'bg-green-50' : 'bg-red-50'
              }`}
            >
              <span className="font-medium text-gray-900">
                {result.permission}
              </span>
              <div className="flex items-center space-x-4 text-sm">
                <span className="text-gray-600">
                  Expected: {result.expected ? 'TRUE' : 'FALSE'}
                </span>
                <span className="text-gray-600">
                  Actual: {result.actual ? 'TRUE' : 'FALSE'}
                </span>
                <span className={`font-semibold ${
                  result.passed ? 'text-green-600' : 'text-red-600'
                }`}>
                  {result.passed ? '✅ PASS' : '❌ FAIL'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Debug Info */}
      <div className="mt-6 bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold mb-2">Quick Debug Info</h3>
        <div className="text-sm space-y-1">
          <p>Total Permissions Available: {permissions.hasPermission ? 'Hook Ready' : 'Hook Not Ready'}</p>
          <p>Has Program Permissions: {permissions.hasAnyProgramPermissions ? 'Yes' : 'No'}</p>
          <p>Has HR Permissions: {permissions.hasAnyHRPermissions ? 'Yes' : 'No'}</p>
          <p>Has Procurement Permissions: {permissions.hasAnyProcurementPermissions ? 'Yes' : 'No'}</p>
          <p>Has Admin Permissions: {permissions.hasAnyAdminPermissions ? 'Yes' : 'No'}</p>
        </div>
      </div>

      {/* Action Buttons */}
      {accuracy === 100 && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="font-semibold text-green-800 mb-2">🎉 Perfect! Ready to Use</h3>
          <p className="text-green-700 text-sm mb-3">
            Your Program Officer permissions are working perfectly. You can now:
          </p>
          <div className="space-y-1 text-sm text-green-700">
            <p>✅ Update your sidebar to use the new permission hook</p>
            <p>✅ Replace existing permission checks in components</p>
            <p>✅ Use the example components as templates</p>
          </div>
        </div>
      )}

      {accuracy < 100 && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="font-semibold text-red-800 mb-2">🔧 Needs Debugging</h3>
          <p className="text-red-700 text-sm mb-3">
            Some permissions aren't working as expected. Check:
          </p>
          <div className="space-y-1 text-sm text-red-700">
            <p>• Are you logged in with the correct Program Officer account?</p>
            <p>• Is the Redux store receiving the permissions properly?</p>
            <p>• Check the browser console for errors</p>
          </div>
        </div>
      )}
    </div>
  );
};