export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1',
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
};

export const API_ENDPOINTS = {
  // Leave Types (Backend uses 'leave-package')
  // Note: No leading slashes because BASE_URL already has trailing slash
  LEAVE_TYPES: 'hr/leave-package/',

  // Leave Balances
  LEAVE_BALANCES: (employeeId: string) => `hr/leave-balance/?employee_id=${employeeId}`,

  // Leave Requests (Backend uses 'leave-request' singular)
  LEAVE_REQUESTS: 'hr/leave-request/',
  LEAVE_REQUEST: (id: string) => `hr/leave-request/${id}/`,
  LEAVE_REQUEST_SUBMIT: (id: string) => `hr/leave-request/${id}/submit/`,
  LEAVE_REQUEST_APPROVE: (id: string) => `hr/leave-request/${id}/approve/`,
  LEAVE_REQUEST_REJECT: (id: string) => `hr/leave-request/${id}/reject/`,
  LEAVE_REQUEST_CANCEL: (id: string) => `hr/leave-request/${id}/cancel/`,
  LEAVE_REQUEST_WORKFLOW: (id: string) => `hr/leave-request/${id}/workflow/`,
  LEAVE_REQUEST_VALIDATE: 'hr/leave-request/validate/',
  LEAVE_DASHBOARD: 'hr/leave-request/dashboard/',

  // File Uploads (Backend uses leave-request upload_document)
  LEAVE_ATTACHMENTS: (leaveRequestId: string) => `hr/leave-request/${leaveRequestId}/upload_document/`,

  // Employees
  EMPLOYEES: 'hr/employees/',
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;