import Card from "components/Card";

interface SummaryProps {
  month?: string;
  year?: number;
  total_employees?: number;
  total_gross_payment?: number;
  total_deductions?: number;
  total_net_payment?: number;
  employees?: any[];
}

const Summary = ({
  month,
  year,
  total_employees = 0,
  total_gross_payment = 0,
  total_deductions = 0,
  total_net_payment = 0,
  employees = []
}: SummaryProps) => {
  // Calculate breakdown from employees data
  const calculateTotals = () => {
    let totalBasicSalary = 0;
    let totalHousing = 0;
    let totalTransport = 0;
    let totalMeal = 0;
    let totalMiscellaneous = 0;
    let totalTax = 0;
    let totalPension = 0;
    let totalNHIS = 0;

    employees.forEach((emp: any) => {
      totalBasicSalary += emp.basic_salary || 0;
      totalHousing += emp.allowances?.housing || 0;
      totalTransport += emp.allowances?.transport || 0;
      totalMeal += emp.allowances?.meal || 0;
      totalMiscellaneous += emp.allowances?.miscellaneous || 0;
      totalTax += emp.deductions?.tax || 0;
      totalPension += emp.deductions?.pension || 0;
      totalNHIS += emp.deductions?.nhis || 0;
    });

    return {
      totalBasicSalary,
      totalHousing,
      totalTransport,
      totalMeal,
      totalMiscellaneous,
      totalTax,
      totalPension,
      totalNHIS,
    };
  };

  const totals = calculateTotals();

  // Format the month/year display
  const formatMonthYear = () => {
    if (month && year) {
      const date = new Date(`${month}-01`);
      return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    }
    if (month) {
      return new Date(`${month}-01`).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    }
    return 'Payroll Summary';
  };

  return (
    <div className='bg-white border shadow-sm rounded-2xl dark:bg-[hsl(15,13%,6%)]'>
      <div className='p-5 flex justify-between items-center'>
        <h4 className='font-bold text-lg'>{formatMonthYear()}</h4>
        <div className='text-sm text-gray-600'>
          {total_employees} Employee{total_employees !== 1 ? 's' : ''}
        </div>
      </div>
      <div className='flex flex-col px-5 pb-5 gap-4'>
        <Card className='grid grid-cols-2'>
          <div className='flex flex-col gap-2'>
            <h4 className='font-semibold text-sm'>Total Net Payout</h4>
            <p className='text-xl font-bold text-green-600'>₦{total_net_payment?.toLocaleString() || '0'}</p>
          </div>
          <div className='flex flex-col gap-2 border-l pl-4'>
            <h4 className='font-semibold text-sm'>Total Deductions</h4>
            <p className='text-xl font-bold text-red-600'>₦{total_deductions?.toLocaleString() || '0'}</p>
          </div>
        </Card>

        <Card className='flex flex-col gap-4'>
          <h4 className='font-bold text-lg text-yellow-darker'>
            Payment Breakdown
          </h4>
          <div className='grid grid-cols-3 gap-4'>
            <div className='flex flex-col gap-2'>
              <h4 className='font-semibold text-sm'>Total Basic Salary</h4>
              <p className='text-sm'>₦{totals.totalBasicSalary.toLocaleString()}</p>
            </div>
            <div className='flex flex-col gap-2'>
              <h4 className='font-semibold text-sm'>Total Housing Allowance</h4>
              <p className='text-sm'>₦{totals.totalHousing.toLocaleString()}</p>
            </div>
            <div className='flex flex-col gap-2'>
              <h4 className='font-semibold text-sm'>
                Total Transport Allowance
              </h4>
              <p className='text-sm'>₦{totals.totalTransport.toLocaleString()}</p>
            </div>
            <div className='flex flex-col gap-2'>
              <h4 className='font-semibold text-sm'>Meal Allowance</h4>
              <p className='text-sm'>₦{totals.totalMeal.toLocaleString()}</p>
            </div>
            <div className='flex flex-col gap-2'>
              <h4 className='font-semibold text-sm'>Miscellaneous Allowance</h4>
              <p className='text-sm'>₦{totals.totalMiscellaneous.toLocaleString()}</p>
            </div>
            <div className='flex flex-col gap-2'>
              <h4 className='font-semibold text-sm'>Total Gross Payment</h4>
              <p className='text-sm font-bold'>₦{total_gross_payment?.toLocaleString() || '0'}</p>
            </div>
          </div>
        </Card>

        <Card className='flex flex-col gap-4'>
          <h4 className='font-bold text-lg text-yellow-darker'>
            Deduction Breakdown
          </h4>
          <div className='grid grid-cols-3 gap-4'>
            <div className='flex flex-col gap-2'>
              <h4 className='font-semibold text-sm'>Total Tax Deduction</h4>
              <p className='text-sm'>₦{totals.totalTax.toLocaleString()}</p>
            </div>
            <div className='flex flex-col gap-2'>
              <h4 className='font-semibold text-sm'>Total Pension Deductions</h4>
              <p className='text-sm'>₦{totals.totalPension.toLocaleString()}</p>
            </div>
            <div className='flex flex-col gap-2'>
              <h4 className='font-semibold text-sm'>Total NHIS Deductions</h4>
              <p className='text-sm'>₦{totals.totalNHIS.toLocaleString()}</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Summary;
