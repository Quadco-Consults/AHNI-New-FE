import Card from "components/Card";

const Summary = (data: any) => {
  console.log({ data });

  return (
    <div className='bg-white border shadow-sm rounded-2xl dark:bg-[hsl(15,13%,6%)]'>
      <div className='p-5 flex justify-between items-center'>
        <h4 className='font-bold text-lg'>March 2024</h4>
      </div>
      <div className='flex flex-col px-5 pb-5 gap-4'>
        <Card className='grid grid-cols-2'>
          <div className='flex flex-col gap-2'>
            <h4 className='font-semibold text-sm'>Total Payout</h4>
            <p className='text-sm'> ₦2,750,974.90</p>
          </div>
          <div className='flex flex-col gap-2 border-l pl-4'>
            <h4 className='font-semibold text-sm'>Total Deductions</h4>
            <p className='text-sm'> ₦13,103,011.00</p>
          </div>
        </Card>
        <Card className='flex flex-col gap-4'>
          <h4 className='font-bold text-lg text-yellow-darker'>
            Payment Breakdown
          </h4>
          <div className='grid grid-cols-3 gap-4'>
            <div className='flex flex-col gap-2'>
              <h4 className='font-semibold text-sm'>Total Basic Salary</h4>
              <p className='text-sm'> ₦2,750,974.90</p>
            </div>
            <div className='flex flex-col gap-2'>
              <h4 className='font-semibold text-sm'>Total Housing Allowance</h4>
              <p className='text-sm'> ₦13,103,011.00</p>
            </div>
            <div className='flex flex-col gap-2'>
              <h4 className='font-semibold text-sm'>
                Total Transport Allowance
              </h4>
              <p className='text-sm'> ₦2,750,974.90</p>
            </div>
            <div className='flex flex-col gap-2'>
              <h4 className='font-semibold text-sm'>Meal Allowance</h4>
              <p className='text-sm'> ₦13,103,011.00</p>
            </div>{" "}
            <div className='flex flex-col gap-2'>
              <h4 className='font-semibold text-sm'>Miscellaneous Allowance</h4>
              <p className='text-sm'> ₦2,750,974.90</p>
            </div>
          </div>
        </Card>
        <Card className='flex flex-col gap-4'>
          <h4 className='font-bold text-lg text-yellow-darker'>
            Deduction Breakdown
          </h4>
          <div className='grid grid-cols-2'>
            <div className='flex flex-col gap-2'>
              <h4 className='font-semibold text-sm'>Total Tax Deduction</h4>
              <p className='text-sm'> ₦2,750,974.90</p>
            </div>
            <div className='flex flex-col gap-2'>
              <h4 className='font-semibold text-sm'>Total HMO Deductions</h4>
              <p className='text-sm'> ₦13,103,011.00</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Summary;
