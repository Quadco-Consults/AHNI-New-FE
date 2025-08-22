export interface LeavePackage {
  id: string;
  created_datetime: string;
  updated_datetime: string;
  name: string;
  number_of_days: number;
  max_leave_days: number;
  value_of_a_leave_day: number;
  carry_forward: boolean;
  is_convertible: boolean;
}
