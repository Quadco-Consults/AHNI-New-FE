import { WorkforceResults } from "./workforce";

export interface CompensationSpreadItem {
  id: string;
  employeeId?: string;
  employee?: WorkforceResults; // For nested structure if needed
  employeeNumber: string;
  surname: string;
  firstname: string;
  position: string;
  grade: string;
  level: string;
  location: string;
  project: string;
  hireDate: string;
  basic: string | number;
  housing: string | number;
  transport: string | number;
  meal: string | number;
  miscellaneous: string | number;
  totalAllowance: string | number;
  thirteenthMonth: string | number;
  grossTotal: string | number;
  created_at?: string;
  updated_at?: string;
}
