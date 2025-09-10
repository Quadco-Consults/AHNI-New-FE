export type TimesheetStatus = "draft" | "submitted" | "approved" | "rejected";

export type TimesheetSummary = {
  id: string;
  employee: {
    id: string;
    name: string;
    department: string;
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
  totalHours: number;
  status: TimesheetStatus;
  submittedDate?: string;
  approvedBy?: string;
  approvedDate?: string;
  rejectionReason?: string;
};

// Legacy type for compatibility
export type TimesheetResults = {
  employee: string;
  projects: string[];
  hours: string;
};
