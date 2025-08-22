import { CardContent } from "components/ui/card";

type EarningItem = {
  label: string;
  amount: string;
};

type Props = {
  period?: string;
  earnings: EarningItem[];
  netPay: string;
  netPayWords?: string;
};

const EarningsBreakdown = ({
  earnings,
  netPay,
  netPayWords,
  period,
}: Props) => {
  const total = earnings
    .reduce((sum, item) => sum + parseFloat(item.amount.replace(/,/g, "")), 0)
    .toLocaleString();

  return (
    <CardContent className='bg-white rounded-lg shadow-sm p-6 space-y-6'>
      <div className='text-center'>
        <h2 className='text-2xl font-bold text-primary'>
          Compensation & Benefits
        </h2>
        {period && (
          <p className='text-sm text-muted-foreground'>for {period}</p>
        )}
      </div>

      <div className='rounded-md border border-muted p-5 bg-gray-50'>
        <h3 className='text-lg font-semibold text-gray-800 underline mb-4'>
          Earnings
        </h3>
        <div className='space-y-3 text-sm font-mono text-gray-700'>
          {earnings.map((item, idx) => (
            <div
              key={idx}
              className='flex justify-between items-center border-b border-dashed py-1'
            >
              <span>{item.label}</span>
              <span className='font-semibold'>₦{item.amount}</span>
            </div>
          ))}
        </div>
        <p className='mt-6 text-right font-bold text-base text-green-700'>
          Total Earnings: ₦{total}
        </p>
      </div>

      <div className='text-center space-y-1'>
        <p className='text-xl font-bold text-black'>Net Pay: ₦{netPay}</p>
        {netPayWords && (
          <p className='italic text-sm text-muted-foreground'>{netPayWords}</p>
        )}
      </div>

      {/* <div className='mt-8 pt-4 text-center text-xs text-muted-foreground border-t'>
        This is a SAP Payroll Generated Payslip.
      </div> */}
    </CardContent>
  );
};

const Compensation = () => {
  return (
    <div className='space-y-10'>
      <p className='text-small'>
        This page contains a breakdown of the monthly earning of this staff,
        carefully go through the page to understand the <br /> way the payment
        system is structured.
      </p>
      <EarningsBreakdown
        // period='May 2025'
        earnings={[
          { label: "Basic Salary", amount: "1,500,000.00" },
          { label: "Meal Allowance", amount: "75,000.00" },
          { label: "Miscellaneous", amount: "50,000.00" },
          { label: "Transport Allowance", amount: "100,000.00" },
          { label: "Housing Allowance", amount: "250,000.00" },
        ]}
        netPay='1,975,000.00'
        netPayWords='ONE MILLION NINE HUNDRED SEVENTY-FIVE THOUSAND NAIRA ONLY'
      />
    </div>
  );
};

export default Compensation;
