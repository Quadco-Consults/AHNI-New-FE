"use client";

import { CardContent } from "@/components/ui/card";

interface ViewPaymentModalProps {
  paymentData?: any;
  onClose?: () => void;
}

const ViewPaymentModal = ({ paymentData, onClose }: ViewPaymentModalProps) => {
  console.log({ paymentData });

  return (
    <CardContent>
      <div className="grid grid-cols-2 gap-8 mt-6 text-sm font-mono">
        <div className="border-r pr-4">
          <p className="font-semibold mb-2 underline">Earnings</p>
          <div className="flex justify-between">
            <span>Consolidated Salary</span>
            <span>2.204.183,96</span>
          </div>
          <div className="flex justify-between">
            <span>ICT Support</span>
            <span>20.000,00</span>
          </div>
          <div className="flex justify-between">
            <span>Meal Allowance</span>
            <span>192.324,00</span>
          </div>
          <p className="mt-4 font-semibold">Total Earnings: 2.416.507,96</p>
        </div>

        <div className="pl-4">
          <p className="font-semibold mb-2 underline">Deductions</p>
          <div className="flex justify-between">
            <span>EE Pension Contribution</span>
            <span>176.334,73</span>
          </div>
          <div className="flex justify-between">
            <span>Tax deductible p.m.</span>
            <span>408.779,93</span>
          </div>
          <div className="flex justify-between">
            <span>Lagos Co-op Contribution</span>
            <span>10.000,00</span>
          </div>
          <p className="mt-4 font-semibold">Total Deductions: 595.114,66</p>
        </div>
      </div>

      <div className="text-center mt-6">
        <p className="font-bold">Net Pay: 1.821.393,30</p>
        <p className="italic">
          ONE MILLION EIGHT HUNDRED TWENTY-ONE THOUSAND THREE HUNDRED
          NINETY-THREE
        </p>
      </div>

      <div className="grid grid-cols-2 gap-8 mt-8 text-sm">
        <div>
          <p className="font-semibold underline mb-2">
            Year To Date Statistics
          </p>
          <div className="flex justify-between">
            <span>Pension Contrib. to Date</span>
            <span>26.554.856,42</span>
          </div>
          <div className="flex justify-between">
            <span>Total gross amount</span>
            <span>85.546.656,32</span>
          </div>
          <div className="flex justify-between">
            <span>Tax deductible p.m.</span>
            <span>14.720.856,15</span>
          </div>
          <div className="flex justify-between">
            <span>Chargeable Income Mnth</span>
            <span>21.504.872,56</span>
          </div>
        </div>
        <div>
          <p className="font-semibold underline mb-2">Loan Balances</p>
          <p className="italic text-muted-foreground">
            [Add loan info if available]
          </p>
        </div>
      </div>

      <div className="mt-8 border-t pt-4 text-center text-xs text-muted-foreground">
        This is SAP Payroll Generated Payslip.
      </div>
    </CardContent>
  );
};

export default ViewPaymentModal;