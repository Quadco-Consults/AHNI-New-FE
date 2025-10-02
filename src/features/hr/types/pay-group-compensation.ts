export interface PayGroupCompensation {
  id: string;
  pay_group: {
    id: string;
    position?: {
      id: string;
      name: string;
    };
    grade?: {
      id: string;
      name: string;
    };
    level?: {
      id: string;
      name: string;
    };
  };
  housing: number;
  transport: number;
  meal: number;
  miscellaneous: number;
  basic: number;
  thirteenth_month?: number;
  total_allowance?: number;
  gross_total?: number;
  created_at?: string;
  updated_at?: string;
}
