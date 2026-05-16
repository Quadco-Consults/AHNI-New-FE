import { CardContent } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/Loading";
import { useGetCompensationsSpread } from "@/features/hr/controllers/hrCompensationSpreadController";

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

const Compensation = ({ id }: { id: string }) => {
  const { data, isLoading } = useGetCompensationsSpread({
    params: {
      employee: id,
    },
  });

  const compensationData = data?.data?.results?.[0]; // Get the first (and should be only) compensation record

  // If no compensation data, show message
  if (!isLoading && !compensationData) {
    return (
      <div className='space-y-10'>
        <p className='text-small'>
          This page contains a breakdown of the monthly earning of this staff,
          carefully go through the page to understand the way the payment
          system is structured.
        </p>
        <div className='card-wrapper text-center py-10'>
          <p className='text-muted-foreground text-lg'>
            No compensation data available for this employee.
          </p>
          <p className='text-sm text-muted-foreground mt-2'>
            Compensation information will appear here once it has been configured.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className='space-y-10'>
        <LoadingSpinner />
      </div>
    );
  }

  // Format numbers for display
  const formatAmount = (amount: number) => {
    return amount.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const earnings: EarningItem[] = [
    { label: "Basic Salary", amount: formatAmount(parseFloat(compensationData.basic || '0')) },
    { label: "Housing Allowance", amount: formatAmount(parseFloat(compensationData.housing || '0')) },
    { label: "Transport Allowance", amount: formatAmount(parseFloat(compensationData.transport || '0')) },
    { label: "Meal Allowance", amount: formatAmount(parseFloat(compensationData.meal || '0')) },
    { label: "Miscellaneous", amount: formatAmount(parseFloat(compensationData.miscellaneous || '0')) },
  ];

  const netPay = formatAmount(parseFloat(compensationData.net_salary || '0'));

  return (
    <div className='space-y-10'>
      <p className='text-small'>
        This page contains a breakdown of the monthly earning of this staff,
        carefully go through the page to understand the way the payment
        system is structured.
      </p>
      <EarningsBreakdown
        period={compensationData.effective_date ? new Date(compensationData.effective_date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : undefined}
        earnings={earnings}
        netPay={netPay}
      />
    </div>
  );
};

export default Compensation;
