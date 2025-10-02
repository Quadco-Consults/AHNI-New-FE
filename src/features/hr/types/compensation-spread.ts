export interface CompensationSpreadItem {
  id: string;
  employee: string; // Employee UUID
  employeeNumber: string;
  surname: string;
  firstname: string;
  position: string;
  grade: string;
  level: string;
  location?: string;
  project: string | null;
  projectName?: string | null;
  hireDate?: string;
  basic: string | number;
  housing: string | number;
  transport: string | number;
  meal: string | number;
  miscellaneous: string | number;
  totalAllowance: string | number;
  thirteenthMonth: string | number;
  grossTotal: string | number;
  is_active?: boolean;
  effective_date?: string | null;
  notes?: string | null;
  created_at?: string;
  updated_at?: string;
}
