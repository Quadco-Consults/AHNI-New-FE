"use client";

import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription } from 'components/ui/alert';
import { Button } from 'components/ui/button';
import { 
  AlertTriangle, 
  CheckCircle, 
  RefreshCw,
  X,
  Info
} from 'lucide-react';
import { leaveService } from '../../services/leaveService';

interface BackendStatusBannerProps {
  onStatusChange?: (isAvailable: boolean) => void;
}

const BackendStatusBanner: React.FC<BackendStatusBannerProps> = ({ onStatusChange }) => {
  const [isBackendAvailable, setIsBackendAvailable] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);

  const checkBackendStatus = async () => {
    setIsChecking(true);
    try {
      // Try to get leave types as a health check
      const response = await leaveService.getLeaveTypes();
      const isAvailable = response.success && !response.data.some((type: any) => type.id === 'lt-001' && type.name === 'Annual Leave');
      setIsBackendAvailable(isAvailable);
      setLastCheck(new Date());
      onStatusChange?.(isAvailable);
    } catch (error) {
      setIsBackendAvailable(false);
      setLastCheck(new Date());
      onStatusChange?.(false);
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkBackendStatus();
    
    // Check every 2 minutes
    const interval = setInterval(checkBackendStatus, 120000);
    return () => clearInterval(interval);
  }, []);

  const getBannerConfig = () => {
    if (isBackendAvailable) {
      return {
        variant: 'default' as const,
        icon: CheckCircle,
        title: 'Backend Connected',
        message: 'All leave management features are available.',
        bgColor: 'bg-green-50 border-green-200',
        textColor: 'text-green-800',
        iconColor: 'text-green-600',
        autoDismiss: true
      };
    } else {
      return {
        variant: 'destructive' as const,
        icon: AlertTriangle,
        title: 'Demo Mode',
        message: 'Backend is not available. Using mock data for demonstration. Your changes will not be saved.',
        bgColor: 'bg-amber-50 border-amber-200',
        textColor: 'text-amber-800',
        iconColor: 'text-amber-600',
        autoDismiss: false
      };
    }
  };

  const config = getBannerConfig();
  const IconComponent = config.icon;

  // Auto-dismiss success banner after 5 seconds (always call useEffect)
  useEffect(() => {
    if (config.autoDismiss) {
      const timer = setTimeout(() => setIsDismissed(true), 5000);
      return () => clearTimeout(timer);
    }
  }, [config.autoDismiss]);

  // Early return after all hooks
  if (isDismissed || isBackendAvailable === null) {
    return null;
  }

  return (
    <div className={`rounded-lg border p-4 mb-6 ${config.bgColor}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <IconComponent className={`w-5 h-5 mt-0.5 ${config.iconColor}`} />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className={`font-medium ${config.textColor}`}>{config.title}</h4>
              {!isBackendAvailable && (
                <span className="text-xs bg-amber-200 text-amber-800 px-2 py-1 rounded">
                  DEMO
                </span>
              )}
            </div>
            <p className={`text-sm ${config.textColor} opacity-90`}>
              {config.message}
            </p>
            
            {lastCheck && (
              <div className="flex items-center gap-2 mt-2">
                <Info className={`w-4 h-4 ${config.iconColor} opacity-60`} />
                <span className={`text-xs ${config.textColor} opacity-60`}>
                  Last checked: {lastCheck.toLocaleTimeString()}
                </span>
              </div>
            )}
            
            {!isBackendAvailable && (
              <div className="mt-3 space-y-2">
                <p className={`text-xs ${config.textColor} opacity-80`}>
                  <strong>Features available in demo mode:</strong>
                </p>
                <ul className={`text-xs ${config.textColor} opacity-80 ml-4 space-y-1`}>
                  <li>• Create and view leave requests (temporary)</li>
                  <li>• Browse leave balances and types</li>
                  <li>• Test approval workflows</li>
                  <li>• Upload attachments (not saved)</li>
                </ul>
                <p className={`text-xs ${config.textColor} opacity-80 mt-2`}>
                  Connect your backend to enable full functionality.
                </p>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2 ml-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={checkBackendStatus}
            disabled={isChecking}
            className="h-8 px-2"
          >
            <RefreshCw className={`w-4 h-4 ${isChecking ? 'animate-spin' : ''}`} />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsDismissed(true)}
            className="h-8 px-2"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BackendStatusBanner;