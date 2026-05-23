export interface Deliverable {
  id: string;
  title: string;
  description: string;
  due_date: string;
  frequency: 'Monthly' | 'Quarterly' | 'Annually' | 'One-time';
  status: 'pending' | 'submitted' | 'approved' | 'rejected' | 'overdue';
  submitted_date: string | null;
  approved_date: string | null;
}

export interface DeliverableDetail extends Deliverable {
  submission_count: number;
  requirements: string[];
  format: string;
  approver: {
    name: string;
    role: string;
  };
  submissions: DeliverableSubmission[];
}

export interface DeliverableSubmission {
  id: string;
  submitted_date: string;
  status: 'pending' | 'approved' | 'rejected';
  document: string;
  comments: string;
  reviewer_comments: string | null;
}

export interface DeliverableStatistics {
  total: number;
  pending: number;
  submitted: number;
  approved: number;
  overdue: number;
}

export interface DeliverableOverview {
  upcoming_deliverables: Array<{
    id: string;
    title: string;
    due_date: string;
    days_until_due: number;
    status: string;
  }>;
  completion_rate: number;
  on_time_rate: number;
  total_deliverables: number;
  completed_deliverables: number;
}

export interface DeliverablesListResponse {
  status: boolean;
  message: string;
  data: {
    deliverables: Deliverable[];
    contract_info: {
      contract_start: string | null;
      contract_end: string | null;
      contract_status: string;
    };
    statistics: DeliverableStatistics;
  };
}

export interface DeliverableDetailResponse {
  status: boolean;
  message: string;
  data: DeliverableDetail;
}

export interface DeliverableOverviewResponse {
  status: boolean;
  message: string;
  data: DeliverableOverview;
}
