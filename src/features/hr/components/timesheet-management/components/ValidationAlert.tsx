"use client";

import { AlertCircle, AlertTriangle, X } from "lucide-react";
import { ValidationError, getValidationMessageStyle } from "../../../utils/timesheetValidation";
import { Button } from "components/ui/button";
import { useState } from "react";

interface ValidationAlertProps {
  errors: ValidationError[];
  warnings: ValidationError[];
  onDismiss?: () => void;
  showDismiss?: boolean;
}

const ValidationAlert: React.FC<ValidationAlertProps> = ({ 
  errors, 
  warnings, 
  onDismiss,
  showDismiss = false 
}) => {
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed || (errors.length === 0 && warnings.length === 0)) {
    return null;
  }

  const handleDismiss = () => {
    setIsDismissed(true);
    onDismiss?.();
  };

  return (
    <div className="space-y-2">
      {/* Errors */}
      {errors.length > 0 && (
        <div className="border rounded-lg p-4 bg-red-50 border-red-200">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-medium text-red-800 mb-2">
                  Validation Errors ({errors.length})
                </h4>
                <ul className="text-sm text-red-700 space-y-1">
                  {errors.map((error, index) => (
                    <li key={index} className="flex items-start">
                      <span className="w-2 h-2 bg-red-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                      {error.message}
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-red-600 mt-2">
                  Please fix these errors before submitting the timesheet.
                </p>
              </div>
            </div>
            {showDismiss && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDismiss}
                className="text-red-600 hover:text-red-800 p-1"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Warnings */}
      {warnings.length > 0 && (
        <div className="border rounded-lg p-4 bg-amber-50 border-amber-200">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-medium text-amber-800 mb-2">
                  Warnings ({warnings.length})
                </h4>
                <ul className="text-sm text-amber-700 space-y-1">
                  {warnings.map((warning, index) => (
                    <li key={index} className="flex items-start">
                      <span className="w-2 h-2 bg-amber-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                      {warning.message}
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-amber-600 mt-2">
                  These warnings don't prevent submission but may require manager approval.
                </p>
              </div>
            </div>
            {showDismiss && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDismiss}
                className="text-amber-600 hover:text-amber-800 p-1"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ValidationAlert;