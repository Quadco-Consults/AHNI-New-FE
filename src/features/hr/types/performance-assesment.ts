export interface PerformanceAssesmentModel {
  status?: boolean;
  message?: string;
  data?: PerformanceAssesment;
}

export interface PerformanceAssesment {
  id?: string;
  description?: string;
  cycle_name?: string;
  employee?: string | Employee;
  status?: string;
  start_date?: string | null;
  end_date?: string | null;
  rating?: string | null;
  time_stamp?: string;
  evaluators?: Evaluator[];
  goals?: Goal[];
  competencies?: Competency[];
  created_datetime?: string;
  updated_datetime?: string;
}

export interface Employee {
  id: string;
  legal_firstname: string;
  legal_lastname: string;
  email?: string;
}

export interface Evaluator {
  id?: string;
  evaluator: string | User;
  evaluation_category: string;
  competency: string;
  status?: string;
  created_datetime?: string;
  updated_datetime?: string;
}

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
}

export interface Goal {
  id?: number;
  goal: string;
  weight: string;
  rating: string;
  comments: string;
  category?: string;
  evaluator?: string;
  created_datetime?: string;
  updated_datetime?: string;
}

export interface Competency {
  id?: string;
  competency: string;
  evaluation_category: string;
  weight: string;
  rating: string;
  comments: string;
  evaluator?: string;
  created_datetime?: string;
  updated_datetime?: string;
}
