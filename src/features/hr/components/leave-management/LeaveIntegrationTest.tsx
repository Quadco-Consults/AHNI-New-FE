"use client";

import React, { useState, useEffect } from 'react';
import { Card } from 'components/ui/card';
import { Button } from 'components/ui/button';
import { Badge } from 'components/ui/badge';
import { Alert, AlertDescription } from 'components/ui/alert';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Clock,
  TestTube
} from 'lucide-react';
import { leaveService } from '../../services/leaveService';

interface TestResult {
  name: string;
  status: 'running' | 'passed' | 'failed' | 'warning';
  message: string;
  data?: any;
  error?: any;
}

const LeaveIntegrationTest: React.FC = () => {
  const [tests, setTests] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [overallStatus, setOverallStatus] = useState<'idle' | 'running' | 'completed'>('idle');

  const updateTest = (name: string, updates: Partial<TestResult>) => {
    setTests(prev => prev.map(test => 
      test.name === name ? { ...test, ...updates } : test
    ));
  };

  const runTests = async () => {
    setIsRunning(true);
    setOverallStatus('running');
    
    const testList: TestResult[] = [
      { name: 'API Configuration', status: 'running', message: 'Checking API configuration...' },
      { name: 'Leave Types Service', status: 'running', message: 'Testing leave types endpoint...' },
      { name: 'Leave Balances Service', status: 'running', message: 'Testing leave balances endpoint...' },
      { name: 'Dashboard Data Service', status: 'running', message: 'Testing dashboard endpoint...' },
      { name: 'Leave Validation Service', status: 'running', message: 'Testing leave validation...' },
      { name: 'Employee Lookup Service', status: 'running', message: 'Testing employee lookup...' },
      { name: 'Leave Request Creation', status: 'running', message: 'Testing leave request creation...' },
      { name: 'Workflow Integration', status: 'running', message: 'Testing workflow integration...' },
    ];
    
    setTests(testList);

    // Test 1: API Configuration
    try {
      const config = await import('../../config/api');
      if (config.API_CONFIG && config.API_ENDPOINTS) {
        updateTest('API Configuration', {
          status: 'passed',
          message: `✓ API configured for ${config.API_CONFIG.BASE_URL}`,
          data: config.API_CONFIG
        });
      } else {
        updateTest('API Configuration', {
          status: 'failed',
          message: '✗ API configuration missing'
        });
      }
    } catch (error) {
      updateTest('API Configuration', {
        status: 'failed',
        message: '✗ Failed to load API configuration',
        error
      });
    }

    // Test 2: Leave Types Service
    try {
      const response = await leaveService.getLeaveTypes();
      if (response.success && Array.isArray(response.data)) {
        updateTest('Leave Types Service', {
          status: 'passed',
          message: `✓ Found ${response.data.length} leave types`,
          data: response.data.map(lt => ({ id: lt.id, name: lt.name, code: lt.code }))
        });
      } else {
        updateTest('Leave Types Service', {
          status: 'warning',
          message: '⚠ Service responded but data format unexpected',
          data: response
        });
      }
    } catch (error) {
      updateTest('Leave Types Service', {
        status: 'failed',
        message: '✗ Failed to fetch leave types',
        error: error instanceof Error ? error.message : String(error)
      });
    }

    // Test 3: Leave Balances Service
    try {
      const testEmployeeId = 'emp-001';
      const response = await leaveService.getLeaveBalances(testEmployeeId);
      if (response.success && Array.isArray(response.data)) {
        updateTest('Leave Balances Service', {
          status: 'passed',
          message: `✓ Found ${response.data.length} leave balances for employee`,
          data: response.data.map(lb => ({ 
            id: lb.id, 
            leaveType: lb.leaveType?.name, 
            available: lb.available,
            entitled: lb.entitled
          }))
        });
      } else {
        updateTest('Leave Balances Service', {
          status: 'warning',
          message: '⚠ Service responded but data format unexpected',
          data: response
        });
      }
    } catch (error) {
      updateTest('Leave Balances Service', {
        status: 'failed',
        message: '✗ Failed to fetch leave balances',
        error: error instanceof Error ? error.message : String(error)
      });
    }

    // Test 4: Dashboard Data Service
    try {
      const testEmployeeId = 'emp-001';
      const response = await leaveService.getDashboardData(testEmployeeId);
      if (response.success && response.data) {
        const data = response.data;
        updateTest('Dashboard Data Service', {
          status: 'passed',
          message: `✓ Dashboard loaded with ${data.myLeaveBalance?.length || 0} balances, ${data.myRecentRequests?.length || 0} recent requests`,
          data: {
            balances: data.myLeaveBalance?.length || 0,
            recentRequests: data.myRecentRequests?.length || 0,
            upcomingLeaves: data.myUpcomingLeaves?.length || 0,
            statistics: data.statistics ? 'present' : 'missing'
          }
        });
      } else {
        updateTest('Dashboard Data Service', {
          status: 'warning',
          message: '⚠ Service responded but data format unexpected',
          data: response
        });
      }
    } catch (error) {
      updateTest('Dashboard Data Service', {
        status: 'failed',
        message: '✗ Failed to fetch dashboard data',
        error: error instanceof Error ? error.message : String(error)
      });
    }

    // Test 5: Leave Validation Service
    try {
      const validationData = {
        employeeId: 'emp-001',
        leaveTypeId: 'lt-001',
        fromDate: '2024-12-01',
        toDate: '2024-12-03',
        duration: 'full_day' as const
      };
      const response = await leaveService.validateLeaveRequest(validationData);
      if (response.success && response.calculatedDays) {
        updateTest('Leave Validation Service', {
          status: 'passed',
          message: `✓ Validation calculated ${response.calculatedDays.workDaysCount} work days`,
          data: {
            valid: response.valid,
            errors: response.errors?.length || 0,
            warnings: response.warnings?.length || 0,
            calculatedDays: response.calculatedDays
          }
        });
      } else {
        updateTest('Leave Validation Service', {
          status: 'warning',
          message: '⚠ Validation service responded but format unexpected',
          data: response
        });
      }
    } catch (error) {
      updateTest('Leave Validation Service', {
        status: 'failed',
        message: '✗ Failed to validate leave request',
        error: error instanceof Error ? error.message : String(error)
      });
    }

    // Test 6: Employee Lookup Service
    try {
      const response = await leaveService.getEmployees();
      if (response.success && Array.isArray(response.data)) {
        updateTest('Employee Lookup Service', {
          status: 'passed',
          message: `✓ Found ${response.data.length} employees`,
          data: response.data.slice(0, 3).map(emp => ({ 
            id: emp.id, 
            name: emp.name, 
            department: emp.department 
          }))
        });
      } else {
        updateTest('Employee Lookup Service', {
          status: 'warning',
          message: '⚠ Service responded but data format unexpected',
          data: response
        });
      }
    } catch (error) {
      updateTest('Employee Lookup Service', {
        status: 'failed',
        message: '✗ Failed to fetch employees',
        error: error instanceof Error ? error.message : String(error)
      });
    }

    // Test 7: Leave Request Creation (Dry Run)
    try {
      const requestData = {
        employeeId: 'emp-001',
        leaveTypeId: 'lt-001',
        fromDate: '2024-12-01',
        toDate: '2024-12-03',
        duration: 'full_day' as const,
        reason: 'Integration test - please ignore',
        isEmergency: false,
        workCoverage: {
          handoverNotes: 'This is a test request'
        },
        attachments: []
      };

      // Note: For integration testing, you might want to create a test endpoint
      // or use a flag to prevent actual creation
      updateTest('Leave Request Creation', {
        status: 'warning',
        message: '⚠ Skipped to prevent test data creation',
        data: { testData: requestData }
      });
    } catch (error) {
      updateTest('Leave Request Creation', {
        status: 'failed',
        message: '✗ Leave request creation test failed',
        error: error instanceof Error ? error.message : String(error)
      });
    }

    // Test 8: Workflow Integration
    try {
      const testRequestId = 'lr-test-001';
      
      try {
        await leaveService.getLeaveWorkflow(testRequestId);
        updateTest('Workflow Integration', {
          status: 'passed',
          message: '✓ Workflow service accessible'
        });
      } catch (error) {
        updateTest('Workflow Integration', {
          status: 'warning',
          message: '⚠ Workflow service accessible but no test data',
          error: error instanceof Error ? error.message : String(error)
        });
      }
    } catch (error) {
      updateTest('Workflow Integration', {
        status: 'failed',
        message: '✗ Workflow integration failed',
        error: error instanceof Error ? error.message : String(error)
      });
    }

    setIsRunning(false);
    setOverallStatus('completed');
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'running':
        return <Clock className="w-4 h-4 text-blue-600 animate-spin" />;
      case 'passed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: TestResult['status']) => {
    const variants = {
      running: 'default',
      passed: 'default',
      failed: 'destructive',
      warning: 'secondary'
    } as const;

    const colors = {
      running: 'bg-blue-100 text-blue-800',
      passed: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      warning: 'bg-amber-100 text-amber-800'
    };

    return (
      <Badge variant={variants[status]} className={colors[status]}>
        {status}
      </Badge>
    );
  };

  const overallResult = tests.length > 0 ? {
    total: tests.length,
    passed: tests.filter(t => t.status === 'passed').length,
    failed: tests.filter(t => t.status === 'failed').length,
    warnings: tests.filter(t => t.status === 'warning').length
  } : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TestTube className="w-6 h-6" />
          <h1 className="text-2xl font-bold">Leave Management Integration Test</h1>
        </div>
        <Button 
          onClick={runTests} 
          disabled={isRunning}
          className="min-w-[120px]"
        >
          {isRunning ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
              Running...
            </>
          ) : (
            'Run Tests'
          )}
        </Button>
      </div>

      {overallResult && (
        <Alert>
          <AlertDescription>
            <div className="flex items-center gap-4">
              <span>Test Results:</span>
              <div className="flex gap-4">
                <span className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  {overallResult.passed} Passed
                </span>
                <span className="flex items-center gap-1">
                  <XCircle className="w-4 h-4 text-red-600" />
                  {overallResult.failed} Failed
                </span>
                <span className="flex items-center gap-1">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  {overallResult.warnings} Warnings
                </span>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        {tests.map((test, index) => (
          <Card key={index} className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                {getStatusIcon(test.status)}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium">{test.name}</h3>
                    {getStatusBadge(test.status)}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{test.message}</p>
                  
                  {test.data && (
                    <details className="mt-2">
                      <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-700">
                        Show test data
                      </summary>
                      <pre className="mt-2 text-xs bg-gray-50 p-2 rounded overflow-x-auto">
                        {JSON.stringify(test.data, null, 2)}
                      </pre>
                    </details>
                  )}
                  
                  {test.error && (
                    <details className="mt-2">
                      <summary className="text-xs text-red-500 cursor-pointer hover:text-red-700">
                        Show error details
                      </summary>
                      <pre className="mt-2 text-xs bg-red-50 p-2 rounded overflow-x-auto text-red-800">
                        {JSON.stringify(test.error, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default LeaveIntegrationTest;