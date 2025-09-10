"use client";

import { LeaveRequest, LeaveType, LeaveBalance, LeaveDashboardData, LeaveApprovalWorkflow } from '../types/leave';
import { API_CONFIG, API_ENDPOINTS } from '../config/api';

const API_BASE = API_CONFIG.BASE_URL;

export class LeaveService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE}${endpoint}`;
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        // Add auth token if available
        ...(typeof window !== 'undefined' && localStorage.getItem('authToken') && {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }),
      },
    };

    const response = await fetch(url, { ...defaultOptions, ...options });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Leave Types
  async getLeaveTypes(): Promise<{ success: boolean; data: LeaveType[] }> {
    return this.request<{ success: boolean; data: LeaveType[] }>('/leave-types/');
  }

  // Leave Balances
  async getLeaveBalances(employeeId: string): Promise<{ success: boolean; data: LeaveBalance[] }> {
    return this.request<{ success: boolean; data: LeaveBalance[] }>(`/leave-balances/${employeeId}/`);
  }

  // Leave Requests CRUD
  async getLeaveRequests(filters?: {
    employeeId?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }): Promise<{ success: boolean; data: LeaveRequest[]; pagination?: any }> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) params.append(key, String(value));
      });
    }
    
    return this.request<{ success: boolean; data: LeaveRequest[]; pagination?: any }>(
      `/leave-requests/?${params.toString()}`
    );
  }

  async getLeaveRequest(id: string): Promise<{ success: boolean; data: LeaveRequest }> {
    return this.request<{ success: boolean; data: LeaveRequest }>(`/leave-requests/${id}/`);
  }

  async createLeaveRequest(data: {
    employeeId: string;
    leaveTypeId: string;
    fromDate: string;
    toDate: string;
    duration: "full_day" | "half_day_morning" | "half_day_afternoon";
    reason: string;
    workCoverage?: {
      backupPersonId?: string;
      handoverNotes?: string;
      clientNotificationRequired?: boolean;
    };
    isEmergency: boolean;
    attachments?: {
      fileName: string;
      fileUrl: string;
      fileType: string;
    }[];
  }): Promise<{ success: boolean; data: LeaveRequest }> {
    return this.request<{ success: boolean; data: LeaveRequest }>('/leave-requests/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateLeaveRequest(id: string, data: Partial<LeaveRequest>): Promise<{ success: boolean; data: LeaveRequest }> {
    return this.request<{ success: boolean; data: LeaveRequest }>(`/leave-requests/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Workflow Actions
  async submitLeaveRequest(id: string): Promise<{ success: boolean; data: LeaveRequest }> {
    return this.request<{ success: boolean; data: LeaveRequest }>(`/leave-requests/${id}/submit/`, {
      method: 'POST',
    });
  }

  async approveLeaveRequest(id: string, data: {
    approverId: string;
    comments?: string;
  }): Promise<{ success: boolean; data: LeaveRequest }> {
    return this.request<{ success: boolean; data: LeaveRequest }>(`/leave-requests/${id}/approve/`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async rejectLeaveRequest(id: string, data: {
    approverId: string;
    reason: string;
  }): Promise<{ success: boolean; data: LeaveRequest }> {
    return this.request<{ success: boolean; data: LeaveRequest }>(`/leave-requests/${id}/reject/`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async cancelLeaveRequest(id: string): Promise<{ success: boolean; data: LeaveRequest }> {
    return this.request<{ success: boolean; data: LeaveRequest }>(`/leave-requests/${id}/cancel/`, {
      method: 'POST',
    });
  }

  // Workflow
  async getLeaveWorkflow(id: string): Promise<{ success: boolean; data: LeaveApprovalWorkflow }> {
    return this.request<{ success: boolean; data: LeaveApprovalWorkflow }>(`/leave-requests/${id}/workflow/`);
  }

  // Validation
  async validateLeaveRequest(data: {
    employeeId: string;
    leaveTypeId: string;
    fromDate: string;
    toDate: string;
    duration: string;
  }): Promise<{
    success: boolean;
    valid: boolean;
    errors: string[];
    warnings: string[];
    calculatedDays: {
      totalDays: number;
      workDaysCount: number;
      weekendDays: number;
      holidayDays: number;
    };
  }> {
    return this.request<{
      success: boolean;
      valid: boolean;
      errors: string[];
      warnings: string[];
      calculatedDays: {
        totalDays: number;
        workDaysCount: number;
        weekendDays: number;
        holidayDays: number;
      };
    }>('/leave-requests/validate/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Dashboard
  async getDashboardData(employeeId: string): Promise<{ success: boolean; data: LeaveDashboardData }> {
    return this.request<{ success: boolean; data: LeaveDashboardData }>(`/leave-requests/dashboard/?employeeId=${employeeId}`);
  }

  // File Upload
  async uploadAttachment(file: File): Promise<{
    success: boolean;
    data: {
      fileName: string;
      fileUrl: string;
      fileType: string;
      fileSize: number;
    };
  }> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE}/leave-attachments/`, {
      method: 'POST',
      headers: {
        ...(typeof window !== 'undefined' && localStorage.getItem('authToken') && {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }),
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Employee lookup for backup person selection
  async getEmployees(query?: string): Promise<{ 
    success: boolean; 
    data: Array<{
      id: string;
      name: string;
      employeeId: string;
      department: string;
      position: string;
    }>
  }> {
    const params = query ? `?search=${encodeURIComponent(query)}` : '';
    return this.request<{ 
      success: boolean; 
      data: Array<{
        id: string;
        name: string;
        employeeId: string;
        department: string;
        position: string;
      }>
    }>(`/employees/${params}`);
  }
}

// Create singleton instance
export const leaveService = new LeaveService();

// Hook for React components
import { useState, useEffect } from 'react';

export function useLeaveTypes() {
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaveTypes = async () => {
      try {
        setLoading(true);
        const response = await leaveService.getLeaveTypes();
        if (response.success) {
          setLeaveTypes(response.data);
        } else {
          setError('Failed to fetch leave types');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch leave types');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaveTypes();
  }, []);

  const refetch = async () => {
    try {
      setLoading(true);
      const response = await leaveService.getLeaveTypes();
      if (response.success) {
        setLeaveTypes(response.data);
      } else {
        setError('Failed to fetch leave types');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch leave types');
    } finally {
      setLoading(false);
    }
  };
  
  return { leaveTypes, loading, error, refetch };
}

export function useLeaveBalances(employeeId: string) {
  const [balances, setBalances] = useState<LeaveBalance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!employeeId) return;

    const fetchBalances = async () => {
      try {
        setLoading(true);
        const response = await leaveService.getLeaveBalances(employeeId);
        if (response.success) {
          setBalances(response.data);
        } else {
          setError('Failed to fetch leave balances');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch leave balances');
      } finally {
        setLoading(false);
      }
    };

    fetchBalances();
  }, [employeeId]);

  const refetch = async () => {
    if (!employeeId) return;
    try {
      setLoading(true);
      const response = await leaveService.getLeaveBalances(employeeId);
      if (response.success) {
        setBalances(response.data);
      } else {
        setError('Failed to fetch leave balances');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch leave balances');
    } finally {
      setLoading(false);
    }
  };
  
  return { balances, loading, error, refetch };
}

export function useDashboardData(employeeId: string) {
  const [data, setData] = useState<LeaveDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!employeeId) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await leaveService.getDashboardData(employeeId);
        if (response.success) {
          setData(response.data);
        } else {
          setError('Failed to fetch dashboard data');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [employeeId]);

  const refetch = async () => {
    if (!employeeId) return;
    try {
      setLoading(true);
      const response = await leaveService.getDashboardData(employeeId);
      if (response.success) {
        setData(response.data);
      } else {
        setError('Failed to fetch dashboard data');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };
  
  return { data, loading, error, refetch };
}