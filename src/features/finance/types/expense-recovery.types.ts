/**
 * Expense Recovery Types
 *
 * Types for creating recovery invoices from shared facility expenses
 */

// Vendor Bill (for shared expenses like security, cleaning, utilities)
export interface VendorBill {
  id: string;
  bill_number: string;
  vendor: string;
  vendor_id?: string;
  description: string;
  total_amount: number;
  bill_date: string;
  service_type: string;
  has_recovery_invoice: boolean;
  recovery_invoice_number?: string;
  recovery_invoice_id?: string;
  created_datetime: string;
  updated_datetime: string;
}

// Allocation for splitting costs
export interface ExpenseRecoveryAllocation {
  customer_id: string;
  customer_name?: string;
  allocation_percentage: number;
  amount?: number; // Auto-calculated
}

// Create Recovery Invoice Request
export interface CreateRecoveryInvoiceRequest {
  vendor_bill_id: string;
  allocations: ExpenseRecoveryAllocation[];
  invoice_date: string;
  due_date: string;
  description?: string;
  notes?: string;
}

// Recovery Invoice Response
export interface RecoveryInvoice {
  id: string;
  invoice_number: string;
  customer: string;
  customer_name: string;
  invoice_type: string;
  invoice_type_display: string;
  invoice_date: string;
  due_date: string;
  subtotal: number;
  total_amount: number;
  amount_paid: number;
  balance: number;
  status: string;
  status_display: string;
  description: string;
  notes: string;
  recovered_vendor_bills: {
    id: string;
    bill_number: string;
    vendor: string;
    total_amount: number;
    description: string;
  }[];
  recovered_expenses: {
    id: string;
    description: string;
    amount: number;
    expense_date: string;
  }[];
  created_datetime: string;
  updated_datetime: string;
}

// Filters for vendor bills
export interface VendorBillFilters {
  has_recovery_invoice?: boolean;
  service_type?: string;
  vendor_id?: string;
  start_date?: string;
  end_date?: string;
  search?: string;
  page?: number;
  page_size?: number;
}

// Statistics for expense recovery dashboard
export interface ExpenseRecoveryStats {
  total_bills: number;
  pending_recovery: number;
  recovered: number;
  total_bill_amount: number;
  total_recovered_amount: number;
  recovery_rate: number; // Percentage
}
