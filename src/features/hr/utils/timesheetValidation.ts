import { TimesheetSummary } from '../types/timesheet';

// Business Rules Constants
export const BUSINESS_RULES = {
  MAX_HOURS_PER_DAY: 24,
  MAX_HOURS_PER_WEEK: 60,
  MIN_HOURS_PER_DAY: 0,
  HOUR_INCREMENT: 0.5,
  WORK_DAYS: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
} as const;

// Validation Error Types
export interface ValidationError {
  field: string;
  message: string;
  severity: 'error' | 'warning';
}

export interface TimesheetValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
}

// Timesheet Entry Interface for Validation
export interface TimesheetEntryForValidation {
  projectId: string;
  workplanId: string;
  activityId: string;
  name: string;
  activity: string;
  mon: string;
  tue: string;
  wed: string;
  thu: string;
  fri: string;
  sat: string;
  sun: string;
  total: string;
}

/**
 * Validate individual timesheet entry
 */
export const validateTimesheetEntry = (
  entry: TimesheetEntryForValidation, 
  index: number
): ValidationError[] => {
  const errors: ValidationError[] = [];

  // Check required fields
  if (!entry.projectId || !entry.name) {
    errors.push({
      field: `entry_${index}_project`,
      message: `Row ${index + 1}: Project is required`,
      severity: 'error'
    });
  }

  if (!entry.workplanId) {
    errors.push({
      field: `entry_${index}_workplan`,
      message: `Row ${index + 1}: Workplan is required`,
      severity: 'error'
    });
  }

  if (!entry.activityId || !entry.activity) {
    errors.push({
      field: `entry_${index}_activity`,
      message: `Row ${index + 1}: Activity is required`,
      severity: 'error'
    });
  }

  // Validate daily hours
  const dailyHours = [
    { day: 'Monday', value: entry.mon },
    { day: 'Tuesday', value: entry.tue },
    { day: 'Wednesday', value: entry.wed },
    { day: 'Thursday', value: entry.thu },
    { day: 'Friday', value: entry.fri },
    { day: 'Saturday', value: entry.sat },
    { day: 'Sunday', value: entry.sun }
  ];

  dailyHours.forEach(({ day, value }) => {
    const hours = parseFloat(value) || 0;

    // Check minimum hours
    if (hours < BUSINESS_RULES.MIN_HOURS_PER_DAY) {
      errors.push({
        field: `entry_${index}_${day.toLowerCase()}`,
        message: `Row ${index + 1}, ${day}: Hours cannot be negative`,
        severity: 'error'
      });
    }

    // Check maximum hours per day
    if (hours > BUSINESS_RULES.MAX_HOURS_PER_DAY) {
      errors.push({
        field: `entry_${index}_${day.toLowerCase()}`,
        message: `Row ${index + 1}, ${day}: Maximum ${BUSINESS_RULES.MAX_HOURS_PER_DAY} hours per day`,
        severity: 'error'
      });
    }

    // Check hour increments (0.5 hour increments)
    if (hours % BUSINESS_RULES.HOUR_INCREMENT !== 0) {
      errors.push({
        field: `entry_${index}_${day.toLowerCase()}`,
        message: `Row ${index + 1}, ${day}: Hours must be in ${BUSINESS_RULES.HOUR_INCREMENT} hour increments`,
        severity: 'error'
      });
    }

    // Warning for weekend work
    if ((day === 'Saturday' || day === 'Sunday') && hours > 0) {
      errors.push({
        field: `entry_${index}_${day.toLowerCase()}`,
        message: `Row ${index + 1}, ${day}: Weekend work requires approval`,
        severity: 'warning'
      });
    }

    // Warning for overtime (>8 hours per day)
    if (hours > 8) {
      errors.push({
        field: `entry_${index}_${day.toLowerCase()}`,
        message: `Row ${index + 1}, ${day}: Overtime (${hours}h) may require approval`,
        severity: 'warning'
      });
    }
  });

  // Validate total hours calculation
  const calculatedTotal = dailyHours.reduce((sum, { value }) => sum + (parseFloat(value) || 0), 0);
  const entryTotal = parseFloat(entry.total) || 0;
  
  if (Math.abs(calculatedTotal - entryTotal) > 0.01) {
    errors.push({
      field: `entry_${index}_total`,
      message: `Row ${index + 1}: Total hours mismatch (calculated: ${calculatedTotal.toFixed(2)}, shown: ${entryTotal.toFixed(2)})`,
      severity: 'error'
    });
  }

  return errors;
};

/**
 * Validate entire timesheet
 */
export const validateTimesheet = (
  entries: TimesheetEntryForValidation[],
  weekStartDate: string,
  weekEndDate: string
): TimesheetValidationResult => {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];

  // Validate date range
  const startDate = new Date(weekStartDate);
  const endDate = new Date(weekEndDate);

  if (endDate <= startDate) {
    errors.push({
      field: 'week_dates',
      message: 'End date must be after start date',
      severity: 'error'
    });
  }

  const daysDifference = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  if (daysDifference !== 7) {
    errors.push({
      field: 'week_dates',
      message: 'Timesheet must cover exactly 7 days',
      severity: 'error'
    });
  }

  // Check if we have at least one entry
  if (entries.length === 0) {
    errors.push({
      field: 'entries',
      message: 'Timesheet must have at least one entry',
      severity: 'error'
    });
  }

  // Validate each entry
  entries.forEach((entry, index) => {
    const entryErrors = validateTimesheetEntry(entry, index);
    errors.push(...entryErrors.filter(e => e.severity === 'error'));
    warnings.push(...entryErrors.filter(e => e.severity === 'warning'));
  });

  // Check for duplicate project-activity combinations
  const combinations = new Map<string, number>();
  entries.forEach((entry, index) => {
    const key = `${entry.projectId}-${entry.activityId}`;
    if (combinations.has(key)) {
      errors.push({
        field: `entry_${index}_duplicate`,
        message: `Row ${index + 1}: Duplicate project-activity combination (same as row ${combinations.get(key)! + 1})`,
        severity: 'error'
      });
    } else {
      combinations.set(key, index);
    }
  });

  // Validate total weekly hours
  const weeklyTotals = { mon: 0, tue: 0, wed: 0, thu: 0, fri: 0, sat: 0, sun: 0 };
  entries.forEach(entry => {
    weeklyTotals.mon += parseFloat(entry.mon) || 0;
    weeklyTotals.tue += parseFloat(entry.tue) || 0;
    weeklyTotals.wed += parseFloat(entry.wed) || 0;
    weeklyTotals.thu += parseFloat(entry.thu) || 0;
    weeklyTotals.fri += parseFloat(entry.fri) || 0;
    weeklyTotals.sat += parseFloat(entry.sat) || 0;
    weeklyTotals.sun += parseFloat(entry.sun) || 0;
  });

  // Check daily totals across all entries
  Object.entries(weeklyTotals).forEach(([day, total]) => {
    if (total > BUSINESS_RULES.MAX_HOURS_PER_DAY) {
      errors.push({
        field: `daily_total_${day}`,
        message: `${day.charAt(0).toUpperCase() + day.slice(1)}: Total daily hours (${total.toFixed(2)}) exceeds maximum (${BUSINESS_RULES.MAX_HOURS_PER_DAY})`,
        severity: 'error'
      });
    }
  });

  // Check total weekly hours
  const totalWeeklyHours = Object.values(weeklyTotals).reduce((sum, hours) => sum + hours, 0);
  if (totalWeeklyHours > BUSINESS_RULES.MAX_HOURS_PER_WEEK) {
    errors.push({
      field: 'weekly_total',
      message: `Total weekly hours (${totalWeeklyHours.toFixed(2)}) exceeds maximum (${BUSINESS_RULES.MAX_HOURS_PER_WEEK})`,
      severity: 'error'
    });
  }

  // Warning for low weekly hours
  if (totalWeeklyHours < 20 && totalWeeklyHours > 0) {
    warnings.push({
      field: 'weekly_total',
      message: `Low weekly hours (${totalWeeklyHours.toFixed(2)}h) - is this correct?`,
      severity: 'warning'
    });
  }

  // Warning for very high weekly hours
  if (totalWeeklyHours > 50) {
    warnings.push({
      field: 'weekly_total',
      message: `High weekly hours (${totalWeeklyHours.toFixed(2)}h) - manager approval may be required`,
      severity: 'warning'
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

/**
 * Check if timesheet can be edited based on status
 */
export const canEditTimesheet = (
  status: TimesheetSummary['status'], 
  userRole: string,
  isOwner: boolean
): boolean => {
  if (userRole === 'admin') return true;
  
  if (!isOwner) return false;
  
  return status === 'draft' || status === 'rejected';
};

/**
 * Check if timesheet can be submitted
 */
export const canSubmitTimesheet = (
  status: TimesheetSummary['status'],
  isOwner: boolean,
  validationResult: TimesheetValidationResult
): boolean => {
  return (
    isOwner &&
    status === 'draft' &&
    validationResult.isValid
  );
};

/**
 * Check if timesheet can be approved/rejected
 */
export const canApproveTimesheet = (
  status: TimesheetSummary['status'],
  userRole: string,
  isOwner: boolean
): boolean => {
  if (isOwner) return false; // Can't approve own timesheet
  
  return (
    (userRole === 'manager' || userRole === 'hr' || userRole === 'admin') &&
    status === 'submitted'
  );
};

/**
 * Get validation message styling
 */
export const getValidationMessageStyle = (severity: 'error' | 'warning'): string => {
  return severity === 'error' 
    ? 'text-red-600 bg-red-50 border-red-200' 
    : 'text-amber-600 bg-amber-50 border-amber-200';
};

/**
 * Format validation errors for display
 */
export const formatValidationErrors = (errors: ValidationError[]): string[] => {
  return errors.map(error => error.message);
};

/**
 * Real-time validation for hour inputs
 */
export const validateHourInput = (value: string): { isValid: boolean; message?: string } => {
  const hours = parseFloat(value);
  
  if (isNaN(hours)) {
    return { isValid: false, message: 'Invalid number' };
  }
  
  if (hours < 0) {
    return { isValid: false, message: 'Hours cannot be negative' };
  }
  
  if (hours > BUSINESS_RULES.MAX_HOURS_PER_DAY) {
    return { isValid: false, message: `Maximum ${BUSINESS_RULES.MAX_HOURS_PER_DAY} hours per day` };
  }
  
  if (hours % BUSINESS_RULES.HOUR_INCREMENT !== 0) {
    return { isValid: false, message: `Must be in ${BUSINESS_RULES.HOUR_INCREMENT} hour increments` };
  }
  
  return { isValid: true };
};