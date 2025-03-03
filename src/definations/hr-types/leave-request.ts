import { EmployeeOnboarding } from "./employee-onboarding";

export interface LeaveRequest {
  id: string;
  employee: EmployeeOnboarding;
  reason: string;
  fromDate: string;
  toDate: string;
  status: "Approved" | "Pending" | "Rejected";
  statusDisplay: string;
  numberOfDays: number;
}
