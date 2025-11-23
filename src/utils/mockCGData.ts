/**
 * Mock data for Contracts & Grants (C&G) components
 * Provides realistic test data when backend APIs return empty results
 */

export interface MockSubGrant {
  id: string;
  grant_ref_no: string;
  project: string;
  sub_grant_administrator: string;
  technical_staff: string;
  evaluation_applicants: any[];
  created_datetime: string;
  updated_datetime: string;
  title: string;
  award_type: string;
  business_unit: string;
  amount_usd: string;
  amount_ngn: string;
  start_date: string;
  end_date: string;
  submission_start_date: string;
  submission_end_date: string;
  tender_type: string;
  assessment_date: string;
  created_by: string;
  updated_by: string;
  grant: string;
  status?: string;
}

export interface MockSubmission {
  id: string;
  organisation_name: string;
  address: string;
  email: string;
  phone_number: string;
  contact_person: string;
  sub_grant: string;
  status: string;
  submitted_at: string;
}

export interface MockAward {
  id: string;
  sub_grant: string;
  submission: MockSubmission;
  rank: number;
  award_amount: string;
  award_date: string;
  status: string;
}

export interface MockBeneficiary {
  id: string;
  sub_grant: MockSubGrant;
  award: MockAward;
  submission: MockSubmission;
  organisation_name: string;
  address: string;
  email: string;
  phone_number: string;
}

export interface MockGrant {
  id: string;
  title: string;
  donor: string;
  amount_usd: string;
  start_date: string;
  end_date: string;
  status: string;
  description: string;
  created_datetime: string;
}

export interface MockConsultant {
  id: string;
  title: string;
  consultant_type: string;
  department: string;
  status: string;
  budget: string;
  start_date: string;
  end_date: string;
  created_datetime: string;
}

export interface MockObligation {
  id: string;
  sub_grant: string;
  amount: string;
  description: string;
  created_datetime: string;
  status: string;
  obligation_number: string;
}

export interface MockExpenditure {
  id: string;
  grant: string;
  amount: string;
  description: string;
  created_datetime: string;
  updated_datetime: string;
  date: string;
  work_plan_activity?: string;
  work_plan_activity_details?: {
    id: string;
    work_plan_title: string;
    work_plan_activity_identifier: string;
    activity_name: string;
    activity_description: string;
    status: string;
  } | null;
  project_details?: {
    id: string;
    project_id: string;
    title: string;
    status: string;
    currency: string;
    budget: number;
    award_amount: number;
  } | null;
  created_by: null;
  updated_by: null;
  project: string;
}

export interface MockModification {
  id: string;
  sub_grant: string;
  title: string;
  amount: string;
  description: string;
  date: string;
  created_datetime: string;
  modification_number: string;
  modification_type: string;
  reason: string;
  amount_usd: string;
  amount_ngn: string;
  effective_date: string;
  approval_date: string;
  notes: string;
  approved_by: string;
  status: string;
}

export interface MockDisbursement {
  id: string;
  grant: string;
  project: string;
  amount: string;
  description: string;
  created_datetime: string;
  updated_datetime: string;
  disbursement_date: string;
  disbursement_method?: string;
  reference_number?: string;
  created_by: null;
  updated_by: null;
  obligation?: string;
  obligation_details?: {
    id: string;
    description: string;
    amount: string;
    date: string;
  };
}

// Mock Sub-Grants
export const mockSubGrants: MockSubGrant[] = [
  {
    id: "550e8400-e29b-41d4-a716-446655440001",
    grant_ref_no: "GRT-2024-001",
    project: "Community Development Initiative",
    sub_grant_administrator: "John Doe",
    technical_staff: "Jane Smith",
    evaluation_applicants: [],
    created_datetime: "2024-01-10T10:30:00Z",
    updated_datetime: "2024-01-15T10:30:00Z",
    title: "Community Development Grant",
    award_type: "Fixed Amount",
    business_unit: "Community Development",
    amount_usd: "250000",
    amount_ngn: "400000000",
    start_date: "2024-01-15",
    end_date: "2024-12-31",
    submission_start_date: "2024-01-01",
    submission_end_date: "2024-01-10",
    tender_type: "Open",
    assessment_date: "2024-01-12",
    created_by: "admin",
    updated_by: "admin",
    grant: "grant-1",
    status: "OPEN"
  },
  {
    id: "4d49a188-7f87-41a2-9934-e271831b19b7",
    grant_ref_no: "GRT-2024-002",
    project: "Education Enhancement Program",
    sub_grant_administrator: "Alice Johnson",
    technical_staff: "Bob Wilson",
    evaluation_applicants: [],
    created_datetime: "2024-01-20T14:15:00Z",
    updated_datetime: "2024-02-01T14:15:00Z",
    title: "Education Enhancement Program",
    award_type: "Cost Reimbursement",
    business_unit: "Education",
    amount_usd: "180000",
    amount_ngn: "288000000",
    start_date: "2024-02-01",
    end_date: "2025-01-31",
    submission_start_date: "2024-01-15",
    submission_end_date: "2024-01-25",
    tender_type: "Restricted",
    assessment_date: "2024-01-28",
    created_by: "admin",
    updated_by: "admin",
    grant: "grant-2",
    status: "AWARDED"
  },
  {
    id: "c7fbdbb9-373f-44ca-b395-cf21e4cdb9dd",
    grant_ref_no: "GRT-2024-003",
    project: "Healthcare Access Program",
    sub_grant_administrator: "Dr. Sarah Wilson",
    technical_staff: "Mike Johnson",
    evaluation_applicants: [],
    created_datetime: "2024-02-01T09:15:00Z",
    updated_datetime: "2024-02-05T09:15:00Z",
    title: "Healthcare Access Enhancement",
    award_type: "Cost Reimbursement",
    business_unit: "Healthcare",
    amount_usd: "320000",
    amount_ngn: "512000000",
    start_date: "2024-02-15",
    end_date: "2025-02-14",
    submission_start_date: "2024-01-20",
    submission_end_date: "2024-01-30",
    tender_type: "Restricted",
    assessment_date: "2024-02-03",
    created_by: "admin",
    updated_by: "admin",
    grant: "grant-3",
    status: "AWARDED"
  },
  {
    id: "1c61dc2e-9385-49ed-8507-edee0693f9b0",
    grant_ref_no: "GRT-2024-004",
    project: "Rural Infrastructure Development",
    sub_grant_administrator: "Ahmed Hassan",
    technical_staff: "Lucy Chen",
    evaluation_applicants: [],
    created_datetime: "2024-02-10T11:20:00Z",
    updated_datetime: "2024-02-12T11:20:00Z",
    title: "Rural Infrastructure Grant",
    award_type: "Fixed Amount",
    business_unit: "Infrastructure",
    amount_usd: "450000",
    amount_ngn: "720000000",
    start_date: "2024-03-01",
    end_date: "2024-12-31",
    submission_start_date: "2024-02-01",
    submission_end_date: "2024-02-08",
    tender_type: "Open",
    assessment_date: "2024-02-10",
    created_by: "admin",
    updated_by: "admin",
    grant: "grant-4",
    status: "AWARDED"
  },
  {
    id: "5",
    grant_ref_no: "GRT-2024-005",
    project: "Women Empowerment Initiative",
    sub_grant_administrator: "Maria Rodriguez",
    technical_staff: "James Kim",
    evaluation_applicants: [],
    created_datetime: "2024-02-20T16:45:00Z",
    updated_datetime: "2024-02-22T16:45:00Z",
    title: "Women Empowerment Program",
    award_type: "Fixed Amount",
    business_unit: "Social Development",
    amount_usd: "275000",
    amount_ngn: "440000000",
    start_date: "2024-03-15",
    end_date: "2025-03-14",
    submission_start_date: "2024-02-15",
    submission_end_date: "2024-02-18",
    tender_type: "Open",
    assessment_date: "2024-02-20",
    created_by: "admin",
    updated_by: "admin",
    grant: "grant-5",
    status: "AWARDED"
  }
];

// Mock Submissions
export const mockSubmissions: MockSubmission[] = [
  {
    id: "sub-1",
    organisation_name: "Hope Foundation Nigeria",
    address: "123 Community Street, Lagos, Nigeria",
    email: "info@hopefoundation.ng",
    phone_number: "+234-801-234-5678",
    contact_person: "Amina Usman",
    sub_grant: "4d49a188-7f87-41a2-9934-e271831b19b7",
    status: "APPROVED",
    submitted_at: "2024-01-25T10:30:00Z"
  },
  {
    id: "sub-2",
    organisation_name: "Rural Health Initiative",
    address: "456 Hospital Road, Abuja, Nigeria",
    email: "contact@ruralhealthng.org",
    phone_number: "+234-802-345-6789",
    contact_person: "Dr. Ibrahim Mohammed",
    sub_grant: "c7fbdbb9-373f-44ca-b395-cf21e4cdb9dd",
    status: "APPROVED",
    submitted_at: "2024-01-30T14:20:00Z"
  },
  {
    id: "sub-3",
    organisation_name: "Infrastructure Development Corp",
    address: "789 Development Avenue, Port Harcourt, Nigeria",
    email: "projects@infra-dev.ng",
    phone_number: "+234-803-456-7890",
    contact_person: "Engineer Kemi Adeola",
    sub_grant: "550e8400-e29b-41d4-a716-446655440004",
    status: "APPROVED",
    submitted_at: "2024-02-08T16:45:00Z"
  },
  {
    id: "sub-4",
    organisation_name: "Women Empowerment Network",
    address: "321 Empowerment Street, Kano, Nigeria",
    email: "support@womenempowerment.ng",
    phone_number: "+234-804-567-8901",
    contact_person: "Fatima Aliyu",
    sub_grant: "5",
    status: "APPROVED",
    submitted_at: "2024-02-18T12:15:00Z"
  }
];

// Mock Awards
export const mockAwards: MockAward[] = [
  {
    id: "award-1",
    sub_grant: "4d49a188-7f87-41a2-9934-e271831b19b7",
    submission: mockSubmissions[0],
    rank: 1,
    award_amount: "180000",
    award_date: "2024-02-01T10:00:00Z",
    status: "ACTIVE"
  },
  {
    id: "award-2",
    sub_grant: "c7fbdbb9-373f-44ca-b395-cf21e4cdb9dd",
    submission: mockSubmissions[1],
    rank: 1,
    award_amount: "320000",
    award_date: "2024-02-05T11:00:00Z",
    status: "ACTIVE"
  },
  {
    id: "award-3",
    sub_grant: "550e8400-e29b-41d4-a716-446655440004",
    submission: mockSubmissions[2],
    rank: 1,
    award_amount: "450000",
    award_date: "2024-02-12T09:30:00Z",
    status: "ACTIVE"
  },
  {
    id: "award-4",
    sub_grant: "5",
    submission: mockSubmissions[3],
    rank: 1,
    award_amount: "275000",
    award_date: "2024-02-22T14:00:00Z",
    status: "ACTIVE"
  }
];

// Mock Beneficiaries (combines sub-grants, awards, and submissions)
export const mockBeneficiaries: MockBeneficiary[] = [
  {
    id: "ben-1",
    sub_grant: mockSubGrants[1], // Education Enhancement Program
    award: mockAwards[0],
    submission: mockSubmissions[0],
    organisation_name: "Hope Foundation Nigeria",
    address: "123 Community Street, Lagos, Nigeria",
    email: "info@hopefoundation.ng",
    phone_number: "+234-801-234-5678"
  },
  {
    id: "ben-2",
    sub_grant: mockSubGrants[2], // Healthcare Access Enhancement
    award: mockAwards[1],
    submission: mockSubmissions[1],
    organisation_name: "Rural Health Initiative",
    address: "456 Hospital Road, Abuja, Nigeria",
    email: "contact@ruralhealthng.org",
    phone_number: "+234-802-345-6789"
  },
  {
    id: "ben-3",
    sub_grant: mockSubGrants[3], // Rural Infrastructure Grant
    award: mockAwards[2],
    submission: mockSubmissions[2],
    organisation_name: "Infrastructure Development Corp",
    address: "789 Development Avenue, Port Harcourt, Nigeria",
    email: "projects@infra-dev.ng",
    phone_number: "+234-803-456-7890"
  },
  {
    id: "ben-4",
    sub_grant: mockSubGrants[4], // Women Empowerment Program
    award: mockAwards[3],
    submission: mockSubmissions[3],
    organisation_name: "Women Empowerment Network",
    address: "321 Empowerment Street, Kano, Nigeria",
    email: "support@womenempowerment.ng",
    phone_number: "+234-804-567-8901"
  }
];

// Mock Grants
export const mockGrants: MockGrant[] = [
  {
    id: "grant-1",
    title: "Community Development Fund",
    donor: "World Bank",
    amount_usd: "5000000",
    start_date: "2024-01-01",
    end_date: "2024-12-31",
    status: "ACTIVE",
    description: "Supporting community-led development initiatives across Nigeria",
    created_datetime: "2023-12-15T10:00:00Z"
  },
  {
    id: "grant-2",
    title: "Education Transformation Grant",
    donor: "USAID",
    amount_usd: "3200000",
    start_date: "2024-01-15",
    end_date: "2025-01-14",
    status: "ACTIVE",
    description: "Enhancing educational outcomes in underserved communities",
    created_datetime: "2023-12-20T14:30:00Z"
  },
  {
    id: "grant-3",
    title: "Healthcare Access Initiative",
    donor: "Gates Foundation",
    amount_usd: "4500000",
    start_date: "2024-02-01",
    end_date: "2025-01-31",
    status: "ACTIVE",
    description: "Improving healthcare access and quality in rural areas",
    created_datetime: "2024-01-10T09:15:00Z"
  }
];

// Mock Consultants
export const mockConsultants: MockConsultant[] = [
  {
    id: "cons-1",
    title: "IT Infrastructure Consultant",
    consultant_type: "Technical",
    department: "IT",
    status: "ACTIVE",
    budget: "25000",
    start_date: "2024-01-15",
    end_date: "2024-04-15",
    created_datetime: "2024-01-10T10:00:00Z"
  },
  {
    id: "cons-2",
    title: "Financial Management Advisor",
    consultant_type: "Advisory",
    department: "Finance",
    status: "ACTIVE",
    budget: "30000",
    start_date: "2024-02-01",
    end_date: "2024-06-30",
    created_datetime: "2024-01-25T11:30:00Z"
  },
  {
    id: "cons-3",
    title: "Program Evaluation Specialist",
    consultant_type: "Evaluation",
    department: "Programs",
    status: "COMPLETED",
    budget: "18000",
    start_date: "2024-01-01",
    end_date: "2024-01-31",
    created_datetime: "2023-12-20T15:45:00Z"
  }
];

// Mock Obligations
export const mockObligations: MockObligation[] = [
  // Obligations for sub-grant "4d49a188-7f87-41a2-9934-e271831b19b7" (Education Enhancement Program)
  {
    id: "obl-1",
    sub_grant: "4d49a188-7f87-41a2-9934-e271831b19b7",
    amount: "90000",
    description: "Initial funding for teacher training program",
    created_datetime: "2024-02-01T10:00:00Z",
    status: "ACTIVE",
    obligation_number: "OBL-2024-001"
  },
  {
    id: "obl-2",
    sub_grant: "4d49a188-7f87-41a2-9934-e271831b19b7",
    amount: "60000",
    description: "Equipment and materials procurement",
    created_datetime: "2024-02-15T14:30:00Z",
    status: "ACTIVE",
    obligation_number: "OBL-2024-002"
  },
  {
    id: "obl-3",
    sub_grant: "4d49a188-7f87-41a2-9934-e271831b19b7",
    amount: "30000",
    description: "Program evaluation and assessment",
    created_datetime: "2024-03-01T09:15:00Z",
    status: "PENDING",
    obligation_number: "OBL-2024-003"
  },

  // Obligations for sub-grant "c7fbdbb9-373f-44ca-b395-cf21e4cdb9dd" (Healthcare Access Enhancement)
  {
    id: "obl-4",
    sub_grant: "c7fbdbb9-373f-44ca-b395-cf21e4cdb9dd",
    amount: "150000",
    description: "Medical equipment purchase",
    created_datetime: "2024-02-05T11:00:00Z",
    status: "ACTIVE",
    obligation_number: "OBL-2024-004"
  },
  {
    id: "obl-5",
    sub_grant: "c7fbdbb9-373f-44ca-b395-cf21e4cdb9dd",
    amount: "100000",
    description: "Healthcare worker training",
    created_datetime: "2024-02-20T13:45:00Z",
    status: "ACTIVE",
    obligation_number: "OBL-2024-005"
  },
  {
    id: "obl-6",
    sub_grant: "c7fbdbb9-373f-44ca-b395-cf21e4cdb9dd",
    amount: "70000",
    description: "Community outreach program",
    created_datetime: "2024-03-10T16:20:00Z",
    status: "PENDING",
    obligation_number: "OBL-2024-006"
  },

  // Obligations for sub-grant "550e8400-e29b-41d4-a716-446655440004" (Rural Infrastructure Grant)
  {
    id: "obl-7",
    sub_grant: "550e8400-e29b-41d4-a716-446655440004",
    amount: "200000",
    description: "Road construction phase 1",
    created_datetime: "2024-02-12T08:30:00Z",
    status: "ACTIVE",
    obligation_number: "OBL-2024-007"
  },
  {
    id: "obl-8",
    sub_grant: "550e8400-e29b-41d4-a716-446655440004",
    amount: "150000",
    description: "Bridge construction materials",
    created_datetime: "2024-02-25T12:00:00Z",
    status: "ACTIVE",
    obligation_number: "OBL-2024-008"
  },
  {
    id: "obl-9",
    sub_grant: "550e8400-e29b-41d4-a716-446655440004",
    amount: "100000",
    description: "Water system installation",
    created_datetime: "2024-03-15T10:45:00Z",
    status: "PENDING",
    obligation_number: "OBL-2024-009"
  }
];

// Mock Expenditures
export const mockExpenditures: MockExpenditure[] = [
  // Expenditures for grant "4d49a188-7f87-41a2-9934-e271831b19b7" (Education Enhancement Program)
  {
    id: "exp-1",
    grant: "4d49a188-7f87-41a2-9934-e271831b19b7",
    amount: "25000",
    description: "Training materials for teacher development",
    created_datetime: "2024-02-10T14:30:00Z",
    updated_datetime: "2024-02-10T14:30:00Z",
    date: "2024-02-10",
    work_plan_activity: "ACT-001",
    work_plan_activity_details: {
      id: "wpa-1",
      work_plan_title: "Teacher Training Program",
      work_plan_activity_identifier: "ACT-001",
      activity_name: "Materials Procurement",
      activity_description: "Purchase and distribution of training materials",
      status: "COMPLETED"
    },
    project_details: {
      id: "proj-2",
      project_id: "PROJ-2024-002",
      title: "Education Enhancement Program",
      status: "ACTIVE",
      currency: "USD",
      budget: 500000,
      award_amount: 400000
    },
    created_by: null,
    updated_by: null,
    project: "4d49a188-7f87-41a2-9934-e271831b19b7"
  },
  {
    id: "exp-2",
    grant: "4d49a188-7f87-41a2-9934-e271831b19b7",
    amount: "15000",
    description: "Venue rental for training sessions",
    created_datetime: "2024-02-20T11:15:00Z",
    updated_datetime: "2024-02-20T11:15:00Z",
    date: "2024-02-20",
    work_plan_activity: "ACT-002",
    work_plan_activity_details: {
      id: "wpa-2",
      work_plan_title: "Teacher Training Program",
      work_plan_activity_identifier: "ACT-002",
      activity_name: "Venue Setup",
      activity_description: "Secure and prepare training venues",
      status: "ACTIVE"
    },
    project_details: {
      id: "proj-2",
      project_id: "PROJ-2024-002",
      title: "Education Enhancement Program",
      status: "ACTIVE",
      currency: "USD",
      budget: 500000,
      award_amount: 400000
    },
    created_by: null,
    updated_by: null,
    project: "4d49a188-7f87-41a2-9934-e271831b19b7"
  },
  {
    id: "exp-3",
    grant: "4d49a188-7f87-41a2-9934-e271831b19b7",
    amount: "8500",
    description: "Equipment maintenance and calibration",
    created_datetime: "2024-03-05T16:45:00Z",
    updated_datetime: "2024-03-05T16:45:00Z",
    date: "2024-03-05",
    work_plan_activity: "ACT-003",
    work_plan_activity_details: {
      id: "wpa-3",
      work_plan_title: "Equipment Management",
      work_plan_activity_identifier: "ACT-003",
      activity_name: "Equipment Maintenance",
      activity_description: "Regular maintenance of educational equipment",
      status: "COMPLETED"
    },
    project_details: {
      id: "proj-2",
      project_id: "PROJ-2024-002",
      title: "Education Enhancement Program",
      status: "ACTIVE",
      currency: "USD",
      budget: 500000,
      award_amount: 400000
    },
    created_by: null,
    updated_by: null,
    project: "4d49a188-7f87-41a2-9934-e271831b19b7"
  },

  // Expenditures for grant "550e8400-e29b-41d4-a716-446655440003" (Healthcare Access Enhancement)
  {
    id: "exp-4",
    grant: "550e8400-e29b-41d4-a716-446655440003",
    amount: "45000",
    description: "Medical equipment procurement",
    created_datetime: "2024-02-15T09:30:00Z",
    updated_datetime: "2024-02-15T09:30:00Z",
    date: "2024-02-15",
    work_plan_activity: "ACT-004",
    work_plan_activity_details: {
      id: "wpa-4",
      work_plan_title: "Healthcare Infrastructure",
      work_plan_activity_identifier: "ACT-004",
      activity_name: "Equipment Procurement",
      activity_description: "Purchase of essential medical equipment",
      status: "COMPLETED"
    },
    project_details: {
      id: "proj-3",
      project_id: "PROJ-2024-003",
      title: "Healthcare Access Enhancement",
      status: "ACTIVE",
      currency: "USD",
      budget: 750000,
      award_amount: 600000
    },
    created_by: null,
    updated_by: null,
    project: "550e8400-e29b-41d4-a716-446655440003"
  },
  {
    id: "exp-5",
    grant: "550e8400-e29b-41d4-a716-446655440003",
    amount: "20000",
    description: "Healthcare worker training program",
    created_datetime: "2024-03-01T13:20:00Z",
    updated_datetime: "2024-03-01T13:20:00Z",
    date: "2024-03-01",
    work_plan_activity: "ACT-005",
    work_plan_activity_details: {
      id: "wpa-5",
      work_plan_title: "Staff Development",
      work_plan_activity_identifier: "ACT-005",
      activity_name: "Staff Training",
      activity_description: "Comprehensive training for healthcare workers",
      status: "ACTIVE"
    },
    project_details: {
      id: "proj-3",
      project_id: "PROJ-2024-003",
      title: "Healthcare Access Enhancement",
      status: "ACTIVE",
      currency: "USD",
      budget: 750000,
      award_amount: 600000
    },
    created_by: null,
    updated_by: null,
    project: "550e8400-e29b-41d4-a716-446655440003"
  }
];

// Mock Modifications
export const mockModifications: MockModification[] = [
  // Modifications for sub-grant "550e8400-e29b-41d4-a716-446655440002" (Education Enhancement Program)
  {
    id: "mod-1",
    sub_grant: "4d49a188-7f87-41a2-9934-e271831b19b7",
    title: "Funding Increase - MOD-001",
    amount: "50000",
    description: "Increased funding for additional teacher training materials",
    date: "2024-02-15",
    created_datetime: "2024-02-15T10:30:00Z",
    modification_number: "MOD-001",
    modification_type: "FUNDING_INCREASE",
    reason: "Additional funding required for expanded teacher training program to reach more beneficiaries",
    amount_usd: "50000",
    amount_ngn: "77500000",
    effective_date: "2024-02-15",
    approval_date: "2024-02-10",
    notes: "Approved to accommodate increased demand for teacher training across additional districts",
    approved_by: "admin-001",
    status: "APPROVED"
  },
  {
    id: "mod-2",
    sub_grant: "4d49a188-7f87-41a2-9934-e271831b19b7",
    title: "Time Extension - MOD-002",
    amount: "0",
    description: "Extension of project timeline due to regulatory delays",
    date: "2024-03-01",
    created_datetime: "2024-03-01T14:20:00Z",
    modification_number: "MOD-002",
    modification_type: "TIME_EXTENSION",
    reason: "Regulatory approval delays require extension of project timeline by 3 months",
    amount_usd: "0",
    amount_ngn: "0",
    effective_date: "2024-03-01",
    approval_date: "2024-02-28",
    notes: "Extension granted to allow for completion of regulatory requirements and maintain quality standards",
    approved_by: "admin-002",
    status: "APPROVED"
  },

  // Modifications for sub-grant "550e8400-e29b-41d4-a716-446655440003" (Healthcare Access Enhancement)
  {
    id: "mod-3",
    sub_grant: "c7fbdbb9-373f-44ca-b395-cf21e4cdb9dd",
    title: "Scope Change - MOD-003",
    amount: "25000",
    description: "Addition of mobile health unit to project scope",
    date: "2024-02-20",
    created_datetime: "2024-02-20T11:45:00Z",
    modification_number: "MOD-003",
    modification_type: "SCOPE_CHANGE",
    reason: "Community assessment revealed need for mobile health services in remote areas",
    amount_usd: "25000",
    amount_ngn: "38750000",
    effective_date: "2024-02-20",
    approval_date: "2024-02-18",
    notes: "Scope expansion approved to increase impact in underserved communities",
    approved_by: "admin-001",
    status: "APPROVED"
  },
  {
    id: "mod-4",
    sub_grant: "c7fbdbb9-373f-44ca-b395-cf21e4cdb9dd",
    title: "Funding Decrease - MOD-004",
    amount: "-10000",
    description: "Reduction due to equipment cost savings",
    date: "2024-03-10",
    created_datetime: "2024-03-10T09:15:00Z",
    modification_number: "MOD-004",
    modification_type: "FUNDING_DECREASE",
    reason: "Achieved cost savings through bulk procurement of medical equipment",
    amount_usd: "-10000",
    amount_ngn: "-15500000",
    effective_date: "2024-03-10",
    approval_date: "2024-03-08",
    notes: "Funds redirected to enhance training component of the project",
    approved_by: "admin-003",
    status: "APPROVED"
  },

  // Modifications for sub-grant "550e8400-e29b-41d4-a716-446655440004" (Rural Infrastructure Grant)
  {
    id: "mod-5",
    sub_grant: "550e8400-e29b-41d4-a716-446655440004",
    title: "Other - MOD-005",
    amount: "15000",
    description: "Environmental compliance requirements",
    date: "2024-02-25",
    created_datetime: "2024-02-25T16:30:00Z",
    modification_number: "MOD-005",
    modification_type: "OTHER",
    reason: "Additional environmental impact assessments required by local authorities",
    amount_usd: "15000",
    amount_ngn: "23250000",
    effective_date: "2024-02-25",
    approval_date: "2024-02-23",
    notes: "Compliance modification to ensure project meets all environmental standards",
    approved_by: "admin-002",
    status: "APPROVED"
  }
];

// Mock Disbursements
export const mockDisbursements: MockDisbursement[] = [
  // Disbursements for grant "550e8400-e29b-41d4-a716-446655440002" (Education Enhancement Program)
  {
    id: "dis-1",
    grant: "4d49a188-7f87-41a2-9934-e271831b19b7",
    project: "4d49a188-7f87-41a2-9934-e271831b19b7",
    amount: "75000",
    description: "Initial project disbursement for teacher training setup",
    created_datetime: "2024-02-05T09:00:00Z",
    updated_datetime: "2024-02-05T09:00:00Z",
    disbursement_date: "2024-02-05",
    disbursement_method: "Bank Transfer",
    reference_number: "TXN-2024-001",
    created_by: null,
    updated_by: null,
    obligation: "obl-1",
    obligation_details: {
      id: "obl-1",
      description: "Initial funding for teacher training program",
      amount: "90000",
      date: "2024-02-01"
    }
  },
  {
    id: "dis-2",
    grant: "4d49a188-7f87-41a2-9934-e271831b19b7",
    project: "4d49a188-7f87-41a2-9934-e271831b19b7",
    amount: "40000",
    description: "Equipment procurement disbursement",
    created_datetime: "2024-02-18T14:30:00Z",
    updated_datetime: "2024-02-18T14:30:00Z",
    disbursement_date: "2024-02-18",
    disbursement_method: "Electronic Transfer",
    reference_number: "TXN-2024-002",
    created_by: null,
    updated_by: null,
    obligation: "obl-2",
    obligation_details: {
      id: "obl-2",
      description: "Equipment and materials procurement",
      amount: "60000",
      date: "2024-02-15"
    }
  },
  {
    id: "dis-3",
    grant: "4d49a188-7f87-41a2-9934-e271831b19b7",
    project: "4d49a188-7f87-41a2-9934-e271831b19b7",
    amount: "25000",
    description: "Program evaluation phase disbursement",
    created_datetime: "2024-03-08T11:15:00Z",
    updated_datetime: "2024-03-08T11:15:00Z",
    disbursement_date: "2024-03-08",
    disbursement_method: "Bank Transfer",
    reference_number: "TXN-2024-003",
    created_by: null,
    updated_by: null,
    obligation: "obl-3",
    obligation_details: {
      id: "obl-3",
      description: "Program evaluation and assessment",
      amount: "30000",
      date: "2024-03-01"
    }
  },

  // Disbursements for grant "550e8400-e29b-41d4-a716-446655440003" (Healthcare Access Enhancement)
  {
    id: "dis-4",
    grant: "550e8400-e29b-41d4-a716-446655440003",
    project: "550e8400-e29b-41d4-a716-446655440003",
    amount: "120000",
    description: "Medical equipment procurement - Phase 1",
    created_datetime: "2024-02-12T10:45:00Z",
    updated_datetime: "2024-02-12T10:45:00Z",
    disbursement_date: "2024-02-12",
    disbursement_method: "Wire Transfer",
    reference_number: "TXN-2024-004",
    created_by: null,
    updated_by: null,
    obligation: "obl-4",
    obligation_details: {
      id: "obl-4",
      description: "Medical equipment purchase",
      amount: "150000",
      date: "2024-02-05"
    }
  },
  {
    id: "dis-5",
    grant: "550e8400-e29b-41d4-a716-446655440003",
    project: "550e8400-e29b-41d4-a716-446655440003",
    amount: "80000",
    description: "Healthcare worker training program disbursement",
    created_datetime: "2024-02-28T15:20:00Z",
    updated_datetime: "2024-02-28T15:20:00Z",
    disbursement_date: "2024-02-28",
    disbursement_method: "Electronic Transfer",
    reference_number: "TXN-2024-005",
    created_by: null,
    updated_by: null,
    obligation: "obl-5",
    obligation_details: {
      id: "obl-5",
      description: "Healthcare worker training",
      amount: "100000",
      date: "2024-02-20"
    }
  },
  {
    id: "dis-6",
    grant: "550e8400-e29b-41d4-a716-446655440003",
    project: "550e8400-e29b-41d4-a716-446655440003",
    amount: "50000",
    description: "Community outreach program funding",
    created_datetime: "2024-03-18T13:45:00Z",
    updated_datetime: "2024-03-18T13:45:00Z",
    disbursement_date: "2024-03-18",
    disbursement_method: "Bank Transfer",
    reference_number: "TXN-2024-006",
    created_by: null,
    updated_by: null,
    obligation: "obl-6",
    obligation_details: {
      id: "obl-6",
      description: "Community outreach program",
      amount: "70000",
      date: "2024-03-10"
    }
  }
];

// Helper functions to get filtered mock data
export const getMockSubGrants = (filters: {
  status?: string;
  search?: string;
  page?: number;
  size?: number;
} = {}) => {
  let filtered = [...mockSubGrants];

  if (filters.status) {
    filtered = filtered.filter(sg => sg.status === filters.status);
  }

  if (filters.search) {
    const search = filters.search.toLowerCase();
    filtered = filtered.filter(sg =>
      sg.title.toLowerCase().includes(search) ||
      sg.grant_ref_no.toLowerCase().includes(search) ||
      sg.project.toLowerCase().includes(search)
    );
  }

  return {
    status: true,
    message: "Successfully retrieved mock data",
    data: {
      results: filtered,
      paginator: {
        count: filtered.length,
        page: filters.page || 1,
        page_size: filters.size || 10,
        total_pages: Math.ceil(filtered.length / (filters.size || 10))
      }
    }
  };
};

export const getMockAwardedSubGrants = () => {
  return getMockSubGrants({ status: "AWARDED" });
};

export const getMockBeneficiaries = () => {
  return mockBeneficiaries;
};

export const getMockGrants = () => {
  return {
    status: true,
    message: "Successfully retrieved mock data",
    data: {
      results: mockGrants,
      paginator: {
        count: mockGrants.length,
        page: 1,
        page_size: 10,
        total_pages: 1
      }
    }
  };
};

export const getMockConsultants = () => {
  return {
    status: true,
    message: "Successfully retrieved mock data",
    data: {
      results: mockConsultants,
      paginator: {
        count: mockConsultants.length,
        page: 1,
        page_size: 10,
        total_pages: 1
      }
    }
  };
};

export const getMockAwardsForSubGrant = (subGrantId: string) => {
  const awards = mockAwards.filter(award => award.sub_grant === subGrantId);
  return {
    status: true,
    message: "Successfully retrieved mock data",
    data: awards
  };
};

export const getMockObligationsForSubGrant = (subGrantId: string) => {
  const obligations = mockObligations.filter(obligation => obligation.sub_grant === subGrantId);
  return {
    status: true,
    message: "Successfully retrieved mock data",
    data: {
      results: obligations,
      paginator: {
        count: obligations.length,
        page: 1,
        page_size: 20,
        total_pages: 1
      }
    }
  };
};

export const getMockExpendituresForGrant = (grantId: string) => {
  const expenditures = mockExpenditures.filter(expenditure => expenditure.grant === grantId);
  return {
    status: true,
    message: "Successfully retrieved mock data",
    data: {
      results: expenditures,
      paginator: {
        count: expenditures.length,
        page: 1,
        page_size: 20,
        total_pages: 1
      }
    }
  };
};

export const getMockModificationsForSubGrant = (subGrantId: string) => {
  const modifications = mockModifications.filter(modification => modification.sub_grant === subGrantId);
  return {
    status: true,
    message: "Successfully retrieved mock data",
    data: {
      results: modifications,
      paginator: {
        count: modifications.length,
        page: 1,
        page_size: 20,
        total_pages: 1
      }
    }
  };
};

export const getMockDisbursementsForGrant = (grantId: string) => {
  const disbursements = mockDisbursements.filter(disbursement => disbursement.grant === grantId);
  return {
    status: true,
    message: "Successfully retrieved mock data",
    data: {
      results: disbursements,
      paginator: {
        count: disbursements.length,
        page: 1,
        page_size: 20,
        total_pages: 1
      }
    }
  };
};