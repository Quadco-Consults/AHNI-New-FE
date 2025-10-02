export type TimesheetStatus = "draft" | "submitted" | "approved" | "rejected";

export type TimesheetEntry = {
  id?: string;
  project_id: string;
  project_name?: string;
  workplan_id: string;
  activity_id: string;
  activity_name?: string;
  hours: {
    monday: number;
    tuesday: number;
    wednesday: number;
    thursday: number;
    friday: number;
    saturday: number;
    sunday: number;
  };
  total_hours?: number;
};

export type TimesheetSummary = {
  id: string;
  employee: {
    id: string;
    name: string;
    department: string;
  };
  approver?: {
    id: string;
    name: string;
    position?: string;
  };
  weekPeriod: {
    startDate: string;
    endDate: string;
  };
  projects: {
    projectName: string;
    totalHours: number;
    activities: {
      activityName: string;
      hours: number;
    }[];
  }[];
  entries?: TimesheetEntry[];
  totalHours: number;
  status: TimesheetStatus;
  submittedDate?: string;
  approvedBy?: string;
  approvedDate?: string;
  rejectionReason?: string;
  createdAt?: string;
  updatedAt?: string;
};

// Legacy type for compatibility
export type TimesheetResults = {
  employee: string;
  projects: string[];
  hours: string;
};
