export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
};

export const API_ENDPOINTS = {
  // Leave Types
  LEAVE_TYPES: '/leave-types/',
  
  // Leave Balances
  LEAVE_BALANCES: (employeeId: string) => `/leave-balances/${employeeId}/`,
  
  // Leave Requests
  LEAVE_REQUESTS: '/leave-requests/',
  LEAVE_REQUEST: (id: string) => `/leave-requests/${id}/`,
  LEAVE_REQUEST_SUBMIT: (id: string) => `/leave-requests/${id}/submit/`,
  LEAVE_REQUEST_APPROVE: (id: string) => `/leave-requests/${id}/approve/`,
  LEAVE_REQUEST_REJECT: (id: string) => `/leave-requests/${id}/reject/`,
  LEAVE_REQUEST_CANCEL: (id: string) => `/leave-requests/${id}/cancel/`,
  LEAVE_REQUEST_WORKFLOW: (id: string) => `/leave-requests/${id}/workflow/`,
  LEAVE_REQUEST_VALIDATE: '/leave-requests/validate/',
  LEAVE_DASHBOARD: '/leave-requests/dashboard/',
  
  // File Uploads
  LEAVE_ATTACHMENTS: '/leave-attachments/',
  
  // Employees
  EMPLOYEES: '/employees/',
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