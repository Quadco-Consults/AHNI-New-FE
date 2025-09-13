/**
 * Generate unique timesheet ID in the format ts-XXX
 */
export const generateTimesheetId = (): string => {
  // In a real application, this would be handled by the backend
  // For now, we'll generate a unique ID using timestamp and random number
  const timestamp = Date.now().toString().slice(-6); // Last 6 digits of timestamp
  const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  
  return `ts-${timestamp}${randomNum.slice(-3)}`; // Ensures 3-digit suffix
};

/**
 * Generate timesheet ID with incremental counter (mock backend behavior)
 */
let timesheetCounter = 1;

export const generateIncrementalTimesheetId = (): string => {
  const id = `ts-${timesheetCounter.toString().padStart(3, '0')}`;
  timesheetCounter++;
  return id;
};

/**
 * Validate timesheet ID format
 */
export const isValidTimesheetId = (id: string): boolean => {
  const pattern = /^ts-\d{3}$/;
  return pattern.test(id);
};

/**
 * Extract numeric part from timesheet ID
 */
export const getTimesheetNumber = (id: string): number | null => {
  const match = id.match(/^ts-(\d{3})$/);
  return match ? parseInt(match[1], 10) : null;
};

/**
 * Format timesheet ID for display
 */
export const formatTimesheetId = (id: string): string => {
  return id.toUpperCase();
};

/**
 * Generate timesheet ID based on user and date
 */
export const generateContextualTimesheetId = (
  employeeId: string, 
  weekStartDate: string
): string => {
  // In production, this would be handled by backend with proper uniqueness
  // For demo, we'll use a simple format
  const date = new Date(weekStartDate);
  const year = date.getFullYear().toString().slice(-2);
  const week = getWeekNumber(date);
  const empNum = employeeId.slice(-3).padStart(3, '0');
  
  return `ts-${year}${week.toString().padStart(2, '0')}${empNum.slice(-1)}`;
};

/**
 * Get week number of the year
 */
function getWeekNumber(date: Date): number {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

/**
 * Check if timesheet ID already exists (would normally check backend)
 */
const existingIds = new Set<string>();

export const isTimesheetIdUnique = async (id: string): Promise<boolean> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // In real app, this would make API call to check uniqueness
  return !existingIds.has(id);
};

/**
 * Reserve a timesheet ID (mark as used)
 */
export const reserveTimesheetId = (id: string): void => {
  existingIds.add(id);
};

/**
 * Get next available timesheet ID
 */
export const getNextAvailableTimesheetId = async (): Promise<string> => {
  let attempts = 0;
  const maxAttempts = 10;
  
  while (attempts < maxAttempts) {
    const id = generateIncrementalTimesheetId();
    
    if (await isTimesheetIdUnique(id)) {
      reserveTimesheetId(id);
      return id;
    }
    
    attempts++;
  }
  
  throw new Error('Unable to generate unique timesheet ID');
};

/**
 * Create timesheet URL path
 */
export const createTimesheetUrl = (id: string): string => {
  return `/dashboard/hr/timesheet-management/${id}`;
};

/**
 * Create timesheet edit URL path
 */
export const createTimesheetEditUrl = (id: string): string => {
  return `/dashboard/hr/timesheet-management/${id}/edit`;
};