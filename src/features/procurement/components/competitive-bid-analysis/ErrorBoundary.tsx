'use client';

import { Component, ReactNode } from 'react';
import { Icon } from '@iconify/react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: string;
}

/**
 * Error Boundary for CBA components
 * Catches JavaScript errors anywhere in the child component tree
 */
export class CBAErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: error.message
    };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    // Log error to console for debugging
    console.error('CBA Error Boundary caught an error:', error, errorInfo);

    // You can also log to an error reporting service here
    // logErrorToService(error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoBack = () => {
    window.history.back();
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
          <div className="max-w-2xl w-full">
            <div className="bg-white border border-red-200 rounded-lg shadow-lg p-8">
              {/* Error Icon */}
              <div className="flex justify-center mb-6">
                <div className="bg-red-100 rounded-full p-4">
                  <Icon
                    icon="mdi:alert-circle"
                    className="w-16 h-16 text-red-600"
                  />
                </div>
              </div>

              {/* Error Title */}
              <h2 className="text-2xl font-bold text-gray-900 text-center mb-4">
                Oops! Something went wrong
              </h2>

              {/* Error Description */}
              <p className="text-gray-600 text-center mb-6">
                We encountered an unexpected error while loading this page.
                This could be due to a temporary issue.
              </p>

              {/* Error Details (Development Mode) */}
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="mb-6 p-4 bg-gray-100 rounded-lg border border-gray-300">
                  <div className="flex items-start gap-2 mb-2">
                    <Icon icon="mdi:code-tags" className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900 mb-1">
                        Error Details (Development Only)
                      </p>
                      <p className="text-xs font-mono text-red-700 break-all">
                        {this.state.error.toString()}
                      </p>
                      {this.state.errorInfo && (
                        <p className="text-xs text-gray-600 mt-2">
                          {this.state.errorInfo}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={this.handleReload}
                  className="flex items-center justify-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  <Icon icon="mdi:refresh" className="w-5 h-5" />
                  Reload Page
                </button>

                <button
                  onClick={this.handleGoBack}
                  className="flex items-center justify-center gap-2 bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors font-medium"
                >
                  <Icon icon="mdi:arrow-left" className="w-5 h-5" />
                  Go Back
                </button>
              </div>

              {/* Help Text */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-500 text-center">
                  If this problem persists, please contact the system administrator.
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Lightweight error boundary for inline use
 */
export class InlineCBAErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Icon icon="mdi:alert" className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-red-900 mb-1">
                Failed to load this section
              </p>
              <p className="text-xs text-red-700">
                {this.state.error?.message || 'An unexpected error occurred'}
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
