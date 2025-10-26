// Petty Cash Types with Approval Workflow
export interface PettyCashRequest {
  id: string;
  certificateNumber: string;
  date: string;
  payeeName: string;
  purpose: string;
  amountWords: string;
  amountFigures: number;
  currency: "NGN" | "USD";
  status: "draft" | "pending_approval" | "approved" | "paid" | "rejected" | "cancelled";

  // Approval workflow
  authorizer?: {
    id: string;
    name: string;
    email: string;
    designation: string;
  };
  approvalDate?: string;
  approvalNotes?: string;
  rejectionReason?: string;

  // Signatures
  authorizedBy?: {
    name: string;
    signature: string;
    date: string;
    digitalSignature?: string;
  };
  payeeSignature?: {
    name: string;
    signature: string;
    date: string;
  };

  // Request details
  project: string;
  department: string;
  location: string;
  requestedBy: {
    id: string;
    name: string;
    designation: string;
    date: string;
    email: string;
  };

  // Accounting
  accountingEntry?: {
    accountCode: string;
    description: string;
    debit: number;
    credit: number;
  };

  // Documentation
  attachments: PettyCashAttachment[];
  notes?: string;

  // Audit trail
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  lastModifiedBy?: string;

  // Workflow history
  workflowHistory: PettyCashWorkflowStep[];
}

// Workflow step tracking
export interface PettyCashWorkflowStep {
  id: string;
  stepType: "created" | "submitted" | "approved" | "rejected" | "paid" | "cancelled";
  performedBy: {
    id: string;
    name: string;
    email: string;
  };
  performedAt: string;
  comments?: string;
  previousStatus?: string;
  newStatus: string;
}

// Attachment handling
export interface PettyCashAttachment {
  id: string;
  filename: string;
  fileType: string;
  fileSize: number;
  url: string;
  uploadedBy: string;
  uploadedAt: string;
  description?: string;
}

// Authorizer profile
export interface PettyCashAuthorizer {
  id: string;
  name: string;
  email: string;
  designation: string;
  department: string;
  approvalLimit: number; // Maximum amount they can approve
  isActive: boolean;
  delegatedTo?: string; // For delegation scenarios
  delegationStartDate?: string;
  delegationEndDate?: string;
}

// Create/Update request interfaces
export interface CreatePettyCashRequest {
  payeeName: string;
  purpose: string;
  amountFigures: number;
  currency: "NGN" | "USD";
  project: string;
  department: string;
  location: string;
  authorizerId: string; // Required during creation
  accountCode?: string;
  accountDescription?: string;
  notes?: string;
  attachments?: File[];
}

export interface UpdatePettyCashRequest {
  payeeName?: string;
  purpose?: string;
  amountFigures?: number;
  currency?: "NGN" | "USD";
  project?: string;
  department?: string;
  location?: string;
  authorizerId?: string;
  accountCode?: string;
  accountDescription?: string;
  notes?: string;
}

// Approval action interfaces
export interface ApprovalAction {
  action: "approve" | "reject";
  comments?: string;
  digitalSignature?: string;
}

// Filter and search interfaces
export interface PettyCashFilters {
  status?: string;
  project?: string;
  department?: string;
  dateFrom?: string;
  dateTo?: string;
  amountMin?: number;
  amountMax?: number;
  authorizerId?: string;
  requesterId?: string;
}

// Summary statistics
export interface PettyCashSummary {
  totalRequests: number;
  totalValue: number;
  pendingApproval: {
    count: number;
    value: number;
  };
  approved: {
    count: number;
    value: number;
  };
  paid: {
    count: number;
    value: number;
  };
  rejected: {
    count: number;
    value: number;
  };
  byProject: Record<string, {
    count: number;
    value: number;
  }>;
  byDepartment: Record<string, {
    count: number;
    value: number;
  }>;
}

// Export/Download options
export interface ExportOptions {
  format: "pdf" | "excel" | "csv";
  includeAttachments: boolean;
  dateRange?: {
    from: string;
    to: string;
  };
  filters?: PettyCashFilters;
}

// Notification preferences
export interface NotificationSettings {
  emailOnSubmission: boolean;
  emailOnApproval: boolean;
  emailOnRejection: boolean;
  reminderFrequency: "none" | "daily" | "weekly";
  escalationDays: number;
}

// API Response types
export interface PettyCashApiResponse<T> {
  status: string;
  message: string;
  data: T;
  pagination?: {
    page: number;
    size: number;
    total: number;
    pages: number;
  };
}

// Common AHNI constants
export const AHNI_PROJECTS = ["GF-NAHI", "ACEBAY", "PLANE", "SIDHAS", "SHARP+", "UNHCR", "UNFPA", "EPiC"] as const;
export const AHNI_DEPARTMENTS = ["Finance", "Admin", "HR", "Programs", "Procurement", "Facilities", "IT"] as const;
export const AHNI_LOCATIONS = ["Abuja", "Lagos", "Kano", "Gombe", "Nasarawa", "Kaduna"] as const;

export type AhniProject = typeof AHNI_PROJECTS[number];
export type AhniDepartment = typeof AHNI_DEPARTMENTS[number];
export type AhniLocation = typeof AHNI_LOCATIONS[number];