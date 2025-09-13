"use client";

import { LeaveRequest, LeaveType, LeaveBalance, LeaveDashboardData, LeaveApprovalWorkflow } from '../types/leave';

// Mock Data
export const mockLeaveTypes: LeaveType[] = [
  {
    id: "lt-001",
    name: "Annual Leave",
    code: "AL",
    isActive: true,
    maxDaysPerYear: 21,
    maxConsecutiveDays: 14,
    allowCarryForward: true,
    carryForwardLimit: 5,
    requiresApproval: true,
    canApplyInAdvance: true,
    advanceNoticeDays: 7,
    includesWeekends: false,
    includesHolidays: false,
    color: "#10B981",
    description: "Annual vacation leave"
  },
  {
    id: "lt-002",
    name: "Sick Leave",
    code: "SL",
    isActive: true,
    maxDaysPerYear: 14,
    maxConsecutiveDays: 7,
    allowCarryForward: false,
    requiresApproval: true,
    canApplyInAdvance: false,
    advanceNoticeDays: 0,
    includesWeekends: true,
    includesHolidays: true,
    color: "#EF4444",
    description: "Medical leave for illness"
  },
  {
    id: "lt-003",
    name: "Maternity Leave",
    code: "ML",
    isActive: true,
    maxDaysPerYear: 90,
    maxConsecutiveDays: 90,
    allowCarryForward: false,
    requiresApproval: true,
    canApplyInAdvance: true,
    advanceNoticeDays: 30,
    includesWeekends: true,
    includesHolidays: true,
    color: "#8B5CF6",
    description: "Maternity leave for new mothers"
  },
  {
    id: "lt-004",
    name: "Personal Leave",
    code: "PL",
    isActive: true,
    maxDaysPerYear: 5,
    maxConsecutiveDays: 3,
    allowCarryForward: false,
    requiresApproval: true,
    canApplyInAdvance: true,
    advanceNoticeDays: 3,
    includesWeekends: false,
    includesHolidays: false,
    color: "#F59E0B",
    description: "Personal time off"
  }
];

export const mockLeaveBalances: LeaveBalance[] = [
  {
    id: "lb-001",
    employeeId: "emp-001",
    leaveTypeId: "lt-001",
    leaveType: mockLeaveTypes[0],
    year: 2024,
    entitled: 21,
    used: 5,
    pending: 2,
    scheduled: 3,
    available: 11,
    carriedForward: 0,
    lastUpdated: "2024-01-15"
  },
  {
    id: "lb-002",
    employeeId: "emp-001",
    leaveTypeId: "lt-002",
    leaveType: mockLeaveTypes[1],
    year: 2024,
    entitled: 14,
    used: 3,
    pending: 0,
    scheduled: 0,
    available: 11,
    carriedForward: 0,
    lastUpdated: "2024-01-15"
  }
];

export const mockLeaveRequests: LeaveRequest[] = [
  {
    id: "lr-001",
    employeeId: "emp-001",
    employee: {
      id: "emp-001",
      name: "John Doe",
      employeeId: "EMP001",
      department: "Engineering",
      position: "Software Developer"
    },
    leaveTypeId: "lt-001",
    leaveType: mockLeaveTypes[0],
    fromDate: "2024-02-15",
    toDate: "2024-02-17",
    numberOfDays: 3,
    duration: "full_day",
    reason: "Family vacation",
    status: "approved",
    appliedDate: "2024-01-20",
    approvedBy: "mgr-001",
    approvedDate: "2024-01-21",
    approver: {
      id: "mgr-001",
      name: "Jane Manager"
    },
    workDaysCount: 3,
    isEmergency: false
  },
  {
    id: "lr-002",
    employeeId: "emp-001",
    employee: {
      id: "emp-001",
      name: "John Doe",
      employeeId: "EMP001",
      department: "Engineering",
      position: "Software Developer"
    },
    leaveTypeId: "lt-001",
    leaveType: mockLeaveTypes[0],
    fromDate: "2024-03-10",
    toDate: "2024-03-15",
    numberOfDays: 6,
    duration: "full_day",
    reason: "Spring break",
    status: "approved",
    appliedDate: "2024-02-01",
    workDaysCount: 4,
    isEmergency: false
  }
];

export const mockEmployees = [
  { 
    id: "emp-002", 
    name: "John Manager", 
    employeeId: "EMP002",
    department: "Engineering",
    position: "Engineering Manager"
  },
  { 
    id: "emp-003", 
    name: "Jane Smith", 
    employeeId: "EMP003",
    department: "HR",
    position: "HR Specialist"
  },
  { 
    id: "emp-004", 
    name: "Mike Johnson", 
    employeeId: "EMP004",
    department: "Finance",
    position: "Financial Analyst"
  },
];

export const mockDashboardData: LeaveDashboardData = {
  myLeaveBalance: mockLeaveBalances,
  myRecentRequests: [mockLeaveRequests[0]],
  myUpcomingLeaves: [mockLeaveRequests[1]],
  leaveCalendarEvents: [],
  statistics: {
    totalEmployees: 45,
    onLeaveToday: 3,
    pendingApprovals: 8,
    upcomingLeaves: 12,
    leavesByType: [
      { leaveType: "Annual Leave", count: 25, percentage: 55 },
      { leaveType: "Sick Leave", count: 12, percentage: 26 },
      { leaveType: "Personal Leave", count: 8, percentage: 19 }
    ],
    leavesByStatus: [
      { status: "approved", count: 35, percentage: 70 },
      { status: "pending_approval", count: 10, percentage: 20 },
      { status: "rejected", count: 5, percentage: 10 }
    ],
    monthlyTrends: []
  },
  notifications: []
};

export const mockWorkflow: LeaveApprovalWorkflow = {
  id: "wf-001",
  leaveRequestId: "lr-001",
  currentStep: 1,
  totalSteps: 2,
  status: "in_progress",
  steps: [
    {
      id: "step-001",
      stepNumber: 1,
      approverRole: "manager",
      approverId: "mgr-001",
      approverName: "Jane Manager",
      status: "approved",
      approvedDate: "2024-01-21",
      comments: "Approved. Please ensure handover is complete.",
      isRequired: true
    },
    {
      id: "step-002", 
      stepNumber: 2,
      approverRole: "hr",
      approverId: "hr-001",
      approverName: "Sarah HR",
      status: "pending",
      isRequired: true
    }
  ],
  startedDate: "2024-01-20"
};

export class MockLeaveService {
  private delay(ms: number = 500): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getLeaveTypes(): Promise<{ success: boolean; data: LeaveType[] }> {
    await this.delay();
    return { success: true, data: mockLeaveTypes };
  }

  async getLeaveBalances(employeeId: string): Promise<{ success: boolean; data: LeaveBalance[] }> {
    await this.delay();
    return { success: true, data: mockLeaveBalances };
  }

  async getLeaveRequests(): Promise<{ success: boolean; data: LeaveRequest[] }> {
    await this.delay();
    return { success: true, data: mockLeaveRequests };
  }

  async createLeaveRequest(data: any): Promise<{ success: boolean; data: LeaveRequest }> {
    await this.delay(1000);
    const newRequest: LeaveRequest = {
      id: `lr-${Date.now()}`,
      employeeId: data.employeeId,
      employee: {
        id: data.employeeId,
        name: "Current User",
        employeeId: "EMP001",
        department: "Engineering",
        position: "Software Developer"
      },
      leaveTypeId: data.leaveTypeId,
      leaveType: mockLeaveTypes.find(lt => lt.id === data.leaveTypeId) || mockLeaveTypes[0],
      fromDate: data.fromDate,
      toDate: data.toDate,
      numberOfDays: 3,
      duration: data.duration,
      reason: data.reason,
      status: "pending_approval",
      appliedDate: new Date().toISOString().split('T')[0],
      workDaysCount: 3,
      isEmergency: data.isEmergency
    };
    return { success: true, data: newRequest };
  }

  async validateLeaveRequest(data: any): Promise<{
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
    await this.delay(300);
    
    const fromDate = new Date(data.fromDate);
    const toDate = new Date(data.toDate);
    const totalDays = Math.ceil((toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const workDaysCount = Math.max(1, Math.floor(totalDays * 0.7)); // Rough estimate
    
    const errors: string[] = [];
    const warnings: string[] = [];
    
    // Simulate validation logic
    if (totalDays > 14) {
      warnings.push("Leave request exceeds 2 weeks. Manager approval required.");
    }
    
    const leaveType = mockLeaveTypes.find(lt => lt.id === data.leaveTypeId);
    if (leaveType?.maxConsecutiveDays && totalDays > leaveType.maxConsecutiveDays) {
      errors.push(`Maximum consecutive days for ${leaveType.name} is ${leaveType.maxConsecutiveDays}.`);
    }
    
    return {
      success: true,
      valid: errors.length === 0,
      errors,
      warnings,
      calculatedDays: {
        totalDays,
        workDaysCount,
        weekendDays: totalDays - workDaysCount,
        holidayDays: 0
      }
    };
  }

  async getDashboardData(employeeId: string): Promise<{ success: boolean; data: LeaveDashboardData }> {
    await this.delay();
    return { success: true, data: mockDashboardData };
  }

  async getEmployees(): Promise<{ success: boolean; data: typeof mockEmployees }> {
    await this.delay();
    return { success: true, data: mockEmployees };
  }

  async getLeaveWorkflow(requestId: string): Promise<{ success: boolean; data: LeaveApprovalWorkflow }> {
    await this.delay();
    return { success: true, data: mockWorkflow };
  }

  async approveLeaveRequest(id: string, data: { approverId: string; comments?: string }): Promise<{ success: boolean; data: LeaveRequest }> {
    await this.delay(800);
    const request = mockLeaveRequests.find(r => r.id === id);
    if (request) {
      return { 
        success: true, 
        data: { ...request, status: "approved", approvedDate: new Date().toISOString().split('T')[0] }
      };
    }
    throw new Error('Leave request not found');
  }

  async rejectLeaveRequest(id: string, data: { approverId: string; reason: string }): Promise<{ success: boolean; data: LeaveRequest }> {
    await this.delay(800);
    const request = mockLeaveRequests.find(r => r.id === id);
    if (request) {
      return { 
        success: true, 
        data: { ...request, status: "rejected", rejectionReason: data.reason }
      };
    }
    throw new Error('Leave request not found');
  }

  async uploadAttachment(file: File): Promise<{
    success: boolean;
    data: {
      fileName: string;
      fileUrl: string;
      fileType: string;
      fileSize: number;
    };
  }> {
    await this.delay(1000);
    return {
      success: true,
      data: {
        fileName: file.name,
        fileUrl: `/uploads/mock/${file.name}`,
        fileType: file.type,
        fileSize: file.size
      }
    };
  }
}

export const mockLeaveService = new MockLeaveService();