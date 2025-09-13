"use client";

import { useState, useEffect } from "react";
import { validateHourInput } from "../../../utils/timesheetValidation";
import { cn } from "lib/utils";

interface ValidatedHourInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
  onValidationChange?: (isValid: boolean) => void;
}

const ValidatedHourInput: React.FC<ValidatedHourInputProps> = ({
  value,
  onChange,
  disabled = false,
  className = "",
  placeholder = "0",
  onValidationChange
}) => {
  const [validationState, setValidationState] = useState<{
    isValid: boolean;
    message?: string;
  }>({ isValid: true });
  
  const [isFocused, setIsFocused] = useState(false);
  const [showValidation, setShowValidation] = useState(false);

  // Validate on value change
  useEffect(() => {
    if (value.trim() === '') {
      setValidationState({ isValid: true });
      onValidationChange?.(true);
      setShowValidation(false);
      return;
    }

    const validation = validateHourInput(value);
    setValidationState(validation);
    onValidationChange?.(validation.isValid);
    
    // Only show validation messages if user has interacted with the input
    if (!isFocused && value.trim() !== '') {
      setShowValidation(!validation.isValid);
    }
  }, [value, isFocused, onValidationChange]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    
    // Allow empty string or valid number patterns
    if (newValue === '' || /^\d*\.?\d*$/.test(newValue)) {
      onChange(newValue);
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    setShowValidation(false);
  };

  const handleBlur = () => {
    setIsFocused(false);
    
    // Format the value if it's valid
    if (value.trim() !== '' && validationState.isValid) {
      const numValue = parseFloat(value);
      if (!isNaN(numValue)) {
        onChange(numValue.toFixed(1));
      }
    }
    
    // Show validation errors after blur if invalid
    if (!validationState.isValid && value.trim() !== '') {
      setShowValidation(true);
    }
  };

  const inputClassName = cn(
    "w-16 px-1 border rounded text-sm text-center transition-colors",
    "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
    {
      "border-red-300 bg-red-50": !validationState.isValid && showValidation,
      "border-gray-300": validationState.isValid || !showValidation,
      "cursor-not-allowed bg-gray-100": disabled,
    },
    className
  );

  return (
    <div className="relative group">
      <input
        type="text"
        value={value}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        disabled={disabled}
        className={inputClassName}
        placeholder={placeholder}
        min="0"
        max="24"
        step="0.5"
        autoComplete="off"
      />
      
      {/* Validation tooltip */}
      {showValidation && !validationState.isValid && validationState.message && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 bg-red-600 text-white text-xs rounded shadow-lg whitespace-nowrap z-10 opacity-0 group-hover:opacity-100 transition-opacity">
          {validationState.message}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-red-600"></div>
        </div>
      )}
      
      {/* Input hints on focus */}
      {isFocused && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 px-2 py-1 bg-gray-800 text-white text-xs rounded shadow-lg whitespace-nowrap z-10">
          Use 0.5 hour increments (max 24h/day)
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-b-gray-800"></div>
        </div>
      )}
    </div>
  );
};

export default ValidatedHourInput;