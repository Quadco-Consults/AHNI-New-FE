"use client";

import React, { useState } from 'react';
import { useLogin } from '@/features/auth/controllers/authController';

/**
 * Simple debug component to test login functionality
 * Uses the confirmed working credentials from the backend investigation
 */
export function LoginDebugComponent() {
  const { login, isLoading, error, data, isSuccess } = useLogin();
  const [testResult, setTestResult] = useState<string>('');

  const testCredentials = [
    {
      label: "Admin Officer (Confirmed Working)",
      email: "adminofficer@ahni.test",
      password: "Test123!"
    },
    {
      label: "Admin (Confirmed Working)",
      email: "admin@mail.com",
      password: "Admin123!"
    },
    {
      label: "Test User (Confirmed Working)",
      email: "test@example.com",
      password: "TestUser123!"
    }
  ];

  const handleTestLogin = async (email: string, password: string, label: string) => {
    setTestResult(`Testing ${label}...`);

    try {
      console.log('🧪 TESTING LOGIN:', { email, label });
      const response = await login({ email, password });
      console.log('✅ LOGIN SUCCESS:', response);
      setTestResult(`✅ SUCCESS: ${label} - Login successful!`);
    } catch (err) {
      console.error('❌ LOGIN FAILED:', err);
      setTestResult(`❌ FAILED: ${label} - ${error?.message || 'Unknown error'}`);
    }
  };

  return (
    <div className="p-6 bg-white border rounded-lg shadow-sm max-w-2xl mx-auto">
      <h2 className="text-xl font-bold text-gray-800 mb-4">🔐 Login Debug Tool</h2>

      {/* Test Results */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-700 mb-2">Test Results:</h3>
        <div className="p-3 bg-gray-50 border rounded min-h-[50px] flex items-center">
          {testResult || 'Click a test button below to start testing...'}
        </div>
        {isLoading && (
          <div className="mt-2 text-blue-600 font-medium">
            🔄 Testing in progress...
          </div>
        )}
      </div>

      {/* Test Buttons */}
      <div className="space-y-3 mb-6">
        <h3 className="font-semibold text-gray-700">Test Confirmed Working Credentials:</h3>
        {testCredentials.map((cred, index) => (
          <button
            key={index}
            onClick={() => handleTestLogin(cred.email, cred.password, cred.label)}
            disabled={isLoading}
            className="w-full p-3 text-left bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="font-medium text-blue-800">{cred.label}</div>
            <div className="text-sm text-blue-600">{cred.email}</div>
          </button>
        ))}
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded">
          <h4 className="font-semibold text-red-800 mb-1">Error Details:</h4>
          <p className="text-red-700">{error.message}</p>
        </div>
      )}

      {/* Success Display */}
      {isSuccess && data && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded">
          <h4 className="font-semibold text-green-800 mb-1">Success!</h4>
          <p className="text-green-700 text-sm">Login completed successfully</p>
          <details className="mt-2">
            <summary className="cursor-pointer text-green-700 text-sm font-medium">
              Show Response Data
            </summary>
            <pre className="mt-2 p-2 bg-white border rounded text-xs overflow-x-auto">
              {JSON.stringify(data, null, 2)}
            </pre>
          </details>
        </div>
      )}

      {/* Expected vs Actual API Format */}
      <div className="text-xs text-gray-600 space-y-2">
        <h4 className="font-semibold">API Endpoint Info:</h4>
        <p><strong>Endpoint:</strong> https://ahni-erp-029252c2fbb9.herokuapp.com/api/v1/auth/login/</p>
        <p><strong>Method:</strong> POST</p>
        <p><strong>Expected Success Format:</strong> HTTP 200 with {"{"}"status": "success", "data": {"{"}"access_token": "...", "user": {"{"}"..."}"}""{"}"}</p>
        <p><strong>Expected Error Format:</strong> HTTP 401 with {"{"}"status": false, "message": "Invalid email or password"{"}"}</p>
      </div>
    </div>
  );
}

export default LoginDebugComponent;