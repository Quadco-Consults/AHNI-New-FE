import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useDepartmentFeatures } from '@/hooks/useDepartmentFeatures';
import { handleApiError, createErrorContext } from '@/utils/errorHandlers';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle, Users, Building, Shield } from 'lucide-react';

/**
 * Example component showcasing department-based features and enhanced error handling
 * This demonstrates how to implement the frontend improvements for departmental officers
 */
export const DepartmentFeatureExample: React.FC = () => {
  const {
    userDepartment,
    hasEmployeeProfile,
    canAccessProgramsFeatures,
    canAccessContractsGrantsFeatures,
    canAccessHRFeatures,
    canAccessFinanceFeatures,
    canAccessAdminFeatures,
    canAccessProcurementFeatures,
    getDepartmentTheme,
    getDepartmentDashboardWidgets,
  } = useDepartmentFeatures();

  const departmentTheme = getDepartmentTheme();
  const dashboardWidgets = getDepartmentDashboardWidgets();

  // Simulate API call with enhanced error handling
  const handleTestApiCall = async () => {
    try {
      // Simulate different error scenarios
      const errorType = Math.random();

      if (errorType < 0.3) {
        // Simulate 404 Employee Profile error
        const error = {
          response: {
            status: 404,
            data: {
              message: 'Employee profile not found for user. Please contact HR to set up your profile.'
            }
          }
        };
        throw error;
      } else if (errorType < 0.6) {
        // Simulate 403 Department permission error
        const error = {
          response: {
            status: 403,
            data: {
              message: 'You do not have permission to access this department feature.'
            }
          }
        };
        throw error;
      } else {
        // Simulate success
        alert('API call successful! Enhanced error handling is working.');
      }
    } catch (error) {
      // Use enhanced error handling
      const errorContext = createErrorContext(
        'test API call',
        userDepartment || 'Unknown',
        'Department Feature Test'
      );
      handleApiError(error, errorContext);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="w-5 h-5" />
            Department Features Demonstration
          </CardTitle>
          <CardDescription>
            This component demonstrates the enhanced frontend features for departmental officers
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Employee Profile Status */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Employee Profile Status</AlertTitle>
            <AlertDescription>
              {hasEmployeeProfile ? (
                <span className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Employee profile is set up
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-orange-600" />
                  Employee profile needs to be set up by HR
                </span>
              )}
            </AlertDescription>
          </Alert>

          {/* Department Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Your Department</CardTitle>
              </CardHeader>
              <CardContent>
                {userDepartment ? (
                  <Badge
                    className="text-lg px-3 py-1"
                    style={{
                      backgroundColor: departmentTheme.primary,
                      color: 'white'
                    }}
                  >
                    {departmentTheme.icon} {userDepartment}
                  </Badge>
                ) : (
                  <span className="text-gray-500">No department assigned</span>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Feature Access</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {canAccessProgramsFeatures && (
                    <Badge variant="secondary">Programs</Badge>
                  )}
                  {canAccessContractsGrantsFeatures && (
                    <Badge variant="secondary">Contracts & Grants</Badge>
                  )}
                  {canAccessHRFeatures && (
                    <Badge variant="secondary">HR</Badge>
                  )}
                  {canAccessFinanceFeatures && (
                    <Badge variant="secondary">Finance</Badge>
                  )}
                  {canAccessAdminFeatures && (
                    <Badge variant="secondary">Admin</Badge>
                  )}
                  {canAccessProcurementFeatures && (
                    <Badge variant="secondary">Procurement</Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Dashboard Widgets */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Available Dashboard Widgets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {dashboardWidgets.map((widget, index) => (
                  <Card key={widget.name} className="border-l-4" style={{ borderLeftColor: departmentTheme.primary }}>
                    <CardContent className="p-3">
                      <div className="font-medium">{widget.title}</div>
                      <div className="text-sm text-gray-500">Priority: {widget.priority}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Error Handling Demo */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Enhanced Error Handling Demo</CardTitle>
              <CardDescription>
                Test the improved error handling for employee profiles and department permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={handleTestApiCall} className="w-full">
                Test Enhanced Error Handling
              </Button>
              <p className="text-sm text-gray-600 mt-2">
                This will randomly simulate different error scenarios to demonstrate the enhanced error handling
              </p>
            </CardContent>
          </Card>

          {/* Department-Specific Features */}
          {userDepartment && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Department-Specific Features</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {userDepartment === 'PROGRAMS' && canAccessProgramsFeatures && (
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-blue-900">Programs Department Features</h4>
                      <ul className="list-disc list-inside text-blue-700 text-sm mt-1">
                        <li>Fund Request Management</li>
                        <li>Project Oversight</li>
                        <li>Stakeholder Management</li>
                        <li>Performance Monitoring</li>
                      </ul>
                    </div>
                  )}

                  {userDepartment === 'C ANG G' && canAccessContractsGrantsFeatures && (
                    <div className="p-3 bg-green-50 rounded-lg">
                      <h4 className="font-medium text-green-900">Contracts & Grants Features</h4>
                      <ul className="list-disc list-inside text-green-700 text-sm mt-1">
                        <li>Contract Management</li>
                        <li>Grant Tracking</li>
                        <li>Compliance Monitoring</li>
                        <li>Disbursement Processing</li>
                      </ul>
                    </div>
                  )}

                  {userDepartment === 'PROCUREMENT' && canAccessProcurementFeatures && (
                    <div className="p-3 bg-cyan-50 rounded-lg">
                      <h4 className="font-medium text-cyan-900">Procurement Department Features</h4>
                      <ul className="list-disc list-inside text-cyan-700 text-sm mt-1">
                        <li>Purchase Request Processing</li>
                        <li>Vendor Management</li>
                        <li>Procurement Tracking</li>
                        <li>Asset Management</li>
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DepartmentFeatureExample;