import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";

// Types
export interface PayItem {
  s_n: number;
  name: string;
  total_amount: number;
  arrears: number;
  current: number;
  year_to_date: number;
}

export interface DeductionItem {
  s_n: number;
  name: string;
  total_amount: number;
  arrears: number;
  current: number;
  year_to_date: number;
}

export interface EmployerRemittance {
  s_n: number;
  name: string;
  employer_remittance: number;
  employee_remittance: number;
  total_remittance: number;
  employer_year_to_date: number;
}

export interface BankDetails {
  bank_name: string;
  account_number: string;
  account_name: string;
}

export interface PensionDetails {
  pfa_name: string;
  rsa_number: string;
  pfc_account_number: string;
}

export interface PayslipData {
  company_name: string;
  payroll_period: string;
  employee_name: string;
  employee_number: string;
  paygroup: string;
  period_display: string;
  job_grade: string;
  position: string;
  bank_details: BankDetails | null;
  pension_details: PensionDetails | null;
  pay_items: PayItem[];
  gross_pay: {
    total_amount: number;
    arrears: number;
    current: number;
    year_to_date: number;
  };
  deduction_items: DeductionItem[];
  total_deductions: {
    total_amount: number;
    arrears: number;
    current: number;
    year_to_date: number;
  };
  net_pay: {
    total_amount: number;
    arrears: number;
    current: number;
    year_to_date: number;
  };
  employer_remittances: EmployerRemittance[];
  total_remittances: {
    employer_remittance: number;
    employee_remittance: number;
    total_remittance: number;
    employer_year_to_date: number;
  };
  payroll_record_id: string;
  payroll_batch_id: string;
  payment_status: string;
  payment_date: string | null;
}

// Fetch payslip data
export const useGetPayslip = (payrollRecordId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["payslip", payrollRecordId],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(
          `/hr/employee-benefits/payslips/${payrollRecordId}/`
        );
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Failed to fetch payslip: " + (axiosError.response?.data as any)?.message);
      }
    },
    enabled: enabled && !!payrollRecordId,
    refetchOnWindowFocus: false,
  });
};

// Helper functions
export const formatCurrency = (amount: number): string => {
  return `₦${amount.toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

export const formatDate = (dateString: string | null): string => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-NG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
