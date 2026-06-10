export interface Timesheet {
  id: string;
  start_date: string;
  end_date: string;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  total_hours: number;
  entry_count: number;
  is_editable: boolean;
  submitted_datetime: string | null;
  approved_datetime: string | null;
  approver: {
    id: string;
    name: string;
  } | null;
}

export interface TimesheetDetail extends Timesheet {
  rejection_reason: string | null;
  approved_by: {
    id: string;
    name: string;
  } | null;
  approver: {
    id: string;
    name: string;
    email: string;
  } | null;
  entries: TimesheetEntry[];
  blocked_dates: BlockedDate[];
  available_dates: string[];
}

export interface TimesheetEntry {
  id: string;
  project: {
    id: string;
    title: string;
  };
  activity_name: string;
  activity_description: string;
  is_custom_activity: boolean;
  date: string;
  hours_worked: number;
  description: string;
}

export interface BlockedDate {
  date: string;
  reason: string;
  type: 'weekend' | 'leave';
}

export interface Project {
  id: string;
  title: string;
  project_code: string | null;
}

export interface TimesheetStatistics {
  total_timesheets: number;
  draft: number;
  submitted: number;
  approved: number;
  rejected: number;
  total_hours_logged: number;
  total_hours_approved: number;
}

export interface CreateTimesheetData {
  start_date: string;
  end_date: string;
  period_type?: 'daily' | 'weekly' | 'monthly' | 'custom';
  activities?: Array<{
    activity: string;
    description?: string;
    hours?: number;
  }>;
  submit_immediately?: boolean;
}

export interface CreateTimesheetEntryData {
  timesheet_id: string;
  project_id: string;
  date: string;
  hours_worked: number;
  custom_activity: string;
  description?: string;
}

export interface UpdateTimesheetEntryData {
  hours_worked?: number;
  description?: string;
  custom_activity?: string;
}

export interface TimesheetListResponse {
  status: boolean;
  message: string;
  data: {
    results: Timesheet[];
    pagination: {
      page: number;
      page_size: number;
      total: number;
      pages: number;
    };
  };
}

export interface TimesheetDetailResponse {
  status: boolean;
  message: string;
  data: TimesheetDetail;
}

export interface TimesheetStatisticsResponse {
  status: boolean;
  message: string;
  data: TimesheetStatistics;
}

export interface ProjectListResponse {
  status: boolean;
  message: string;
  data: Project[];
}
