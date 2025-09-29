// TypeScript interfaces for the new approval workflow system

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  designation?: string;
  phone_number?: string;
}

export interface ApprovalInfo {
  current_status: 'Pending' | 'Reviewed' | 'Authorised' | 'Approved';
  next_action_required: 'review' | 'authorise' | 'approve' | null;
  current_user_permissions: {
    can_review: boolean;
    can_authorize: boolean;
    can_approve: boolean;
  };
  memo_approvers: {
    reviewers: User[];
    authorizers: User[];
    approver: User | null;
  };
  memo_id: number | null;
}

export interface ApprovalResponse {
  detail: string;
  reason?: string;
}

export interface PurchaseRequestWithApproval {
  id: number;
  ref_number: string;
  status: 'Pending' | 'Reviewed' | 'Authorised' | 'Approved';
  requested_by_detail: User;
  reviewed_by_detail?: User;
  authorised_by_detail?: User;
  approved_by_detail?: User;
  request_memo?: {
    id: number;
    subject: string;
  };
  // Include other existing fields from PurchaseRequestResultsData
  title: string;
  total_amount: number;
  request_date: string;
  required_date: string;
  requesting_department_detail: {
    name: string;
    id: string;
  };
  location_detail: {
    name: string;
    id?: string;
  };
}

export type ApprovalAction = 'review' | 'authorise' | 'approve';

export type ApprovalStatus = 'Pending' | 'Reviewed' | 'Authorised' | 'Approved';