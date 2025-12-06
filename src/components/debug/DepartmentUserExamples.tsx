import React from 'react';

/**
 * Examples showing how different department users experience the system
 * Demonstrates department isolation and access patterns
 */

export const DepartmentUserExamples = () => {
  return (
    <div className="space-y-8 p-6 bg-gray-50">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          🏢 Multi-Department Access Examples
        </h1>
        <p className="text-gray-600">
          How different department users experience the organizational structure system
        </p>
      </div>

      {/* Program Officer */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
            PO
          </div>
          <div>
            <h2 className="text-xl font-bold text-blue-800">Program Officer (Programs Dept)</h2>
            <p className="text-blue-600">programofficer@ahni.test</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <h3 className="font-semibold text-blue-800 mb-2">🎯 Department Access</h3>
            <ul className="space-y-1 text-sm text-blue-700">
              <li>✅ Programs Module (Full Access)</li>
              <li>❌ HR Module (No Access)</li>
              <li>❌ Finance Module (No Access)</li>
              <li>❌ Procurement Module (No Access)</li>
              <li>❌ Admin Settings (No Access)</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-blue-800 mb-2">🌍 Global Hub Access</h3>
            <ul className="space-y-1 text-sm text-blue-700">
              <li>✅ Announcements</li>
              <li>✅ Staff Directory</li>
              <li>✅ Help Desk</li>
              <li>✅ Document Center</li>
              <li>✅ Training Center</li>
              <li>✅ Global Reports (UNIVERSAL ACCESS)</li>
              <li>✅ Executive Dashboard (UNIVERSAL ACCESS)</li>
              <li>✅ Organization Calendar</li>
              <li>✅ Resource Library</li>
              <li>✅ Feedback & Suggestions</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-blue-800 mb-2">🔑 Specific Permissions</h3>
            <ul className="space-y-1 text-sm text-blue-700">
              <li>📝 Create/Edit Workplans</li>
              <li>💰 Submit Fund Requests</li>
              <li>🏠 Schedule Site Visits</li>
              <li>📋 Submit Leave Requests</li>
              <li>🛒 Create Purchase Requests</li>
              <li>💳 Submit Expense Reports</li>
            </ul>
          </div>
        </div>
      </div>

      {/* HR Officer */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
            HR
          </div>
          <div>
            <h2 className="text-xl font-bold text-purple-800">HR Officer (Human Resources)</h2>
            <p className="text-purple-600">hrofficer@ahni.test</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <h3 className="font-semibold text-purple-800 mb-2">🎯 Department Access</h3>
            <ul className="space-y-1 text-sm text-purple-700">
              <li>✅ HR Module (Full Access)</li>
              <li>👁️ Programs Module (View Only - for staff support)</li>
              <li>❌ Finance Module (No Access)</li>
              <li>❌ Procurement Module (No Access)</li>
              <li>❌ Admin Settings (No Access)</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-purple-800 mb-2">🌍 Global Hub Access</h3>
            <ul className="space-y-1 text-sm text-purple-700">
              <li>✅ Announcements (Can Create)</li>
              <li>✅ Staff Directory (Full Management)</li>
              <li>✅ Help Desk</li>
              <li>✅ Document Center</li>
              <li>✅ Training Center (Can Manage)</li>
              <li>✅ Global Reports (UNIVERSAL ACCESS)</li>
              <li>✅ Executive Dashboard (UNIVERSAL ACCESS)</li>
              <li>✅ Organization Calendar</li>
              <li>✅ Resource Library</li>
              <li>✅ Feedback & Suggestions</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-purple-800 mb-2">🔑 Specific Permissions</h3>
            <ul className="space-y-1 text-sm text-purple-700">
              <li>👥 Manage Leave Requests (All Staff)</li>
              <li>📊 Review Timesheets</li>
              <li>📝 Manage Job Applications</li>
              <li>✅ Approve Leave (up to $2,000)</li>
              <li>📋 Conduct Performance Reviews</li>
              <li>🎓 Coordinate Training Programs</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Finance Analyst */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
            FA
          </div>
          <div>
            <h2 className="text-xl font-bold text-green-800">Finance Analyst (Finance Dept)</h2>
            <p className="text-green-600">financeanalyst@ahni.test</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <h3 className="font-semibold text-green-800 mb-2">🎯 Department Access</h3>
            <ul className="space-y-1 text-sm text-green-700">
              <li>✅ Finance Module (Full Access)</li>
              <li>👁️ Programs Module (View for Budget Tracking)</li>
              <li>👁️ Procurement Module (View for Expense Validation)</li>
              <li>❌ HR Module (No Access)</li>
              <li>❌ Admin Settings (No Access)</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-green-800 mb-2">🌍 Global Hub Access</h3>
            <ul className="space-y-1 text-sm text-green-700">
              <li>✅ Announcements</li>
              <li>✅ Staff Directory</li>
              <li>✅ Help Desk</li>
              <li>✅ Document Center</li>
              <li>✅ Training Center</li>
              <li>✅ Global Reports (UNIVERSAL ACCESS)</li>
              <li>✅ Executive Dashboard (UNIVERSAL ACCESS)</li>
              <li>✅ Organization Calendar</li>
              <li>✅ Resource Library</li>
              <li>✅ Feedback & Suggestions</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-green-800 mb-2">🔑 Specific Permissions</h3>
            <ul className="space-y-1 text-sm text-green-700">
              <li>💰 Review/Approve Expenses (up to $5,000)</li>
              <li>📊 Generate Financial Reports</li>
              <li>💳 Process Reimbursements</li>
              <li>📈 Monitor Budget Utilization</li>
              <li>🔍 Audit Transactions</li>
              <li>💱 Manage Currency Exchanges</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Procurement Officer */}
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
            PO
          </div>
          <div>
            <h2 className="text-xl font-bold text-orange-800">Procurement Officer (Procurement)</h2>
            <p className="text-orange-600">procurementofficer@ahni.test</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <h3 className="font-semibold text-orange-800 mb-2">🎯 Department Access</h3>
            <ul className="space-y-1 text-sm text-orange-700">
              <li>✅ Procurement Module (Full Access)</li>
              <li>👁️ Finance Module (View for Budget Checks)</li>
              <li>👁️ Programs Module (View for Project Needs)</li>
              <li>❌ HR Module (No Access)</li>
              <li>❌ Admin Settings (No Access)</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-orange-800 mb-2">🌍 Global Hub Access</h3>
            <ul className="space-y-1 text-sm text-orange-700">
              <li>✅ Announcements</li>
              <li>✅ Staff Directory</li>
              <li>✅ Help Desk</li>
              <li>✅ Document Center</li>
              <li>✅ Training Center</li>
              <li>✅ Global Reports (UNIVERSAL ACCESS)</li>
              <li>✅ Executive Dashboard (UNIVERSAL ACCESS)</li>
              <li>✅ Organization Calendar</li>
              <li>✅ Resource Library</li>
              <li>✅ Feedback & Suggestions</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-orange-800 mb-2">🔑 Specific Permissions</h3>
            <ul className="space-y-1 text-sm text-orange-700">
              <li>🛒 Process Purchase Requests</li>
              <li>🏪 Manage Vendor Database</li>
              <li>📋 Create Procurement Plans</li>
              <li>📝 Generate Purchase Orders</li>
              <li>🔍 Vendor Performance Reviews</li>
              <li>💰 Financial Approval (up to $2,000)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Executive Director */}
      <div className="bg-gray-800 text-white border border-gray-700 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
            ED
          </div>
          <div>
            <h2 className="text-xl font-bold">Executive Director (Administration)</h2>
            <p className="text-gray-300">executive@ahni.test</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <h3 className="font-semibold mb-2">🎯 Department Access</h3>
            <ul className="space-y-1 text-sm text-gray-300">
              <li>✅ ALL Modules (Full Access)</li>
              <li>✅ Programs Module</li>
              <li>✅ HR Module</li>
              <li>✅ Finance Module</li>
              <li>✅ Procurement Module</li>
              <li>✅ Admin Settings (Full Control)</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2">🌍 Global Hub Access</h3>
            <ul className="space-y-1 text-sm text-gray-300">
              <li>✅ Announcements (Full Control)</li>
              <li>✅ Staff Directory (Full Management)</li>
              <li>✅ Help Desk (Admin)</li>
              <li>✅ Document Center (Full Control)</li>
              <li>✅ Training Center (Full Management)</li>
              <li>✅ Global Reports (All Reports)</li>
              <li>✅ Executive Dashboard</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2">🔑 Specific Permissions</h3>
            <ul className="space-y-1 text-sm text-gray-300">
              <li>👥 User Management (All)</li>
              <li>🔧 System Configuration</li>
              <li>💰 Financial Approval ($1M+ limit)</li>
              <li>✅ Authorize All Operations</li>
              <li>📊 Cross-Department Analytics</li>
              <li>🌍 Global Data Access</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Access Matrix */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">📊 Department Access Matrix</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left p-3 font-semibold">Module/Feature</th>
                <th className="text-center p-3 font-semibold text-blue-600">Program Officer</th>
                <th className="text-center p-3 font-semibold text-purple-600">HR Officer</th>
                <th className="text-center p-3 font-semibold text-green-600">Finance Analyst</th>
                <th className="text-center p-3 font-semibold text-orange-600">Procurement Officer</th>
                <th className="text-center p-3 font-semibold text-gray-600">Executive Director</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="p-3 font-medium">Programs Module</td>
                <td className="p-3 text-center">🟢 Full</td>
                <td className="p-3 text-center">🟡 View</td>
                <td className="p-3 text-center">🟡 View</td>
                <td className="p-3 text-center">🟡 View</td>
                <td className="p-3 text-center">🟢 Full</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">HR Module</td>
                <td className="p-3 text-center">🔴 None</td>
                <td className="p-3 text-center">🟢 Full</td>
                <td className="p-3 text-center">🔴 None</td>
                <td className="p-3 text-center">🔴 None</td>
                <td className="p-3 text-center">🟢 Full</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">Finance Module</td>
                <td className="p-3 text-center">🔴 None</td>
                <td className="p-3 text-center">🔴 None</td>
                <td className="p-3 text-center">🟢 Full</td>
                <td className="p-3 text-center">🟡 View</td>
                <td className="p-3 text-center">🟢 Full</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">Procurement Module</td>
                <td className="p-3 text-center">🔴 None</td>
                <td className="p-3 text-center">🔴 None</td>
                <td className="p-3 text-center">🟡 View</td>
                <td className="p-3 text-center">🟢 Full</td>
                <td className="p-3 text-center">🟢 Full</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">Admin Settings</td>
                <td className="p-3 text-center">🔴 None</td>
                <td className="p-3 text-center">🔴 None</td>
                <td className="p-3 text-center">🔴 None</td>
                <td className="p-3 text-center">🔴 None</td>
                <td className="p-3 text-center">🟢 Full</td>
              </tr>
              <tr className="bg-blue-50">
                <td className="p-3 font-medium">Global Hub</td>
                <td className="p-3 text-center">🟢 Universal</td>
                <td className="p-3 text-center">🟢 Universal</td>
                <td className="p-3 text-center">🟢 Universal</td>
                <td className="p-3 text-center">🟢 Universal</td>
                <td className="p-3 text-center">🟢 Universal</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex space-x-4 text-xs">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
            <span>🟢 Full Access</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-yellow-500 rounded mr-2"></div>
            <span>🟡 View Only</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded mr-2"></div>
            <span>🔴 No Access</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepartmentUserExamples;