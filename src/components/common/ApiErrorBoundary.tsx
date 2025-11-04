'use client';

import React from 'react';
import { AlertCircle, RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ApiErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ApiErrorBoundaryProps {
  children: React.ReactNode;
}

export class ApiErrorBoundary extends React.Component<ApiErrorBoundaryProps, ApiErrorBoundaryState> {
  constructor(props: ApiErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ApiErrorBoundaryState {
    // Check if this is an API connection error
    const isApiError = error.message?.includes('Unable to connect to the server') ||
                      error.message?.includes('Network error') ||
                      error.message?.includes('timeout') ||
                      error.message?.includes('ECONNABORTED');

    return { hasError: isApiError, error: isApiError ? error : undefined };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Only log API-related errors to avoid noise
    if (error.message?.includes('Unable to connect to the server') ||
        error.message?.includes('Network error')) {
      console.warn('API Connection Error caught by boundary:', error.message);
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
    // Refresh the page to retry API calls
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-center py-8 text-red-700 bg-red-50 rounded-lg mb-4 border border-red-200">
          <div className="flex items-center justify-center mb-4">
            <WifiOff className="h-8 w-8 text-red-500 mr-2" />
            <h3 className="font-medium text-lg">Backend Connection Error</h3>
          </div>

          <p className="text-sm mb-2">
            Unable to connect to the backend API server.
          </p>

          <p className="text-xs text-red-600 mb-4">
            {this.state.error?.message || 'The server may be temporarily unavailable.'}
          </p>

          <div className="space-y-2 text-xs text-red-600">
            <p>• Check if the backend server is running</p>
            <p>• Verify network connectivity</p>
            <p>• Ensure proper authentication</p>
          </div>

          <div className="mt-6">
            <Button
              onClick={this.handleRetry}
              variant="outline"
              size="sm"
              className="flex items-center space-x-2 mx-auto"
            >
              <RefreshCw size={14} />
              <span>Retry Connection</span>
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}