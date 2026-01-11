import React, { useMemo, useState } from "react";
import { TotalExpenditureSvg, TotalIncomeSvg } from "assets/svgs/CAndGSvgs";
import DataTable from "@/components/Table/DataTable";
import { ISubGrantSingleData } from "@/features/contracts-grants/types/contract-management/sub-grant/sub-grant";
import { useParams } from "next/navigation";
import { obligationColumns } from "@/features/contracts-grants/components/table-columns/grant/obligation";
import { useGetAllSubGrantObligations } from "@/features/contracts-grants/controllers/subGrantObligationController";
import { formatNumberCurrency } from "@/utils/utls";

const SubGrantObligationHistory: React.FC<any> = ({
  amount_usd,
}: ISubGrantSingleData) => {
  const [page, setPage] = useState(1);

  const { id } = useParams();
  const subGrantId = typeof id === 'string' ? id : Array.isArray(id) ? id[0] : undefined;

  const { data, isFetching, error, isError } = useGetAllSubGrantObligations({
    subGrantId: subGrantId || "",
    page,
    size: 10,
    enabled: !!subGrantId,
  });

  // Debug logging
  console.log('=== OBLIGATION HISTORY DEBUG ===');
  console.log('SubGrant ID:', subGrantId);
  console.log('Is Fetching:', isFetching);
  console.log('Is Error:', isError);
  console.log('Error:', error);
  console.log('Full API Response:', JSON.stringify(data, null, 2));
  console.log('Obligations Data:', data);
  console.log('Data.data:', data?.data);
  console.log('Obligations Results:', data?.data?.results);
  console.log('Number of Obligations:', data?.data?.results?.length);
  console.log('Amount USD prop:', amount_usd);
  console.log('Type of amount_usd:', typeof amount_usd);
  console.log('================================');

  // Calculate obligation totals from the obligations data
  const calculatedTotals = useMemo(() => {
    const obligations = data?.data?.results || [];

    console.log('=== CALCULATING TOTALS ===');
    console.log('Raw Obligations Array:', obligations);
    console.log('Obligations Length:', obligations.length);
    console.log('Obligations Data:', JSON.stringify(obligations, null, 2));

    // Calculate total obligated amount (sum of all obligations)
    const totalObligated = obligations.reduce((sum: number, obligation: any, index: number) => {
      console.log(`Obligation ${index}:`, obligation);
      console.log(`Obligation ${index} amount field:`, obligation.amount);
      console.log(`Obligation ${index} amount type:`, typeof obligation.amount);
      const amount = Number(obligation.amount || 0);
      console.log(`Parsed amount for obligation ${index}:`, amount);
      const newSum = sum + amount;
      console.log(`Running total after obligation ${index}:`, newSum);
      return newSum;
    }, 0);

    console.log('Final Total Obligated:', totalObligated);

    // Get current month's obligations
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    console.log('Current Month:', currentMonth, 'Current Year:', currentYear);

    const currentMonthObligations = obligations.filter((obligation: any) => {
      const obligationDate = new Date(obligation.created_datetime);
      console.log('Obligation Date:', obligation.created_datetime, 'Parsed:', obligationDate);
      const isCurrentMonth = (
        obligationDate.getMonth() === currentMonth &&
        obligationDate.getFullYear() === currentYear
      );
      console.log('Is current month?', isCurrentMonth);
      return isCurrentMonth;
    });

    console.log('Current Month Obligations:', currentMonthObligations);

    const currentMonthTotal = currentMonthObligations.reduce((sum: number, obligation: any) => {
      return sum + Number(obligation.amount || 0);
    }, 0);

    console.log('Current Month Total:', currentMonthTotal);

    // Calculate remaining balance (award amount - total obligated)
    const awardAmount = Number(amount_usd || 0);
    console.log('Award Amount (amount_usd):', amount_usd, 'Parsed:', awardAmount);
    const remainingBalance = awardAmount - totalObligated;

    console.log('=== FINAL CALCULATED TOTALS ===', {
      totalObligated,
      currentMonthTotal,
      remainingBalance,
      awardAmount
    });
    console.log('================================');

    return {
      totalObligated,
      currentMonthTotal,
      remainingBalance,
    };
  }, [data?.data?.results, amount_usd]);

  const StatsCard = useMemo(() => {
    return [
      {
        id: 1,
        name: "Total Obligated Amount",
        stat: calculatedTotals.totalObligated > 0
          ? formatNumberCurrency(calculatedTotals.totalObligated, "USD")
          : "$0.00",
        icon: <TotalIncomeSvg />,
      },
      {
        id: 3,
        name: "Balance",
        stat: formatNumberCurrency(Math.max(0, calculatedTotals.remainingBalance), "USD"),
        icon: <TotalExpenditureSvg />,
      },
      {
        id: 2,
        name: "Obligated Amount (Current Month)",
        stat: calculatedTotals.currentMonthTotal > 0
          ? formatNumberCurrency(calculatedTotals.currentMonthTotal, "USD")
          : "$0.00",
        icon: <TotalExpenditureSvg />,
      },
    ];
  }, [calculatedTotals]);

  return (
    <section className='w-full flex flex-col px-5 space-y-[1.25rem]'>
      {/* Debug Display */}
      <div className='bg-yellow-100 border border-yellow-400 p-4 rounded'>
        <h3 className='font-bold mb-2'>Debug Info:</h3>
        <p>Total Obligated: {calculatedTotals.totalObligated}</p>
        <p>Current Month Total: {calculatedTotals.currentMonthTotal}</p>
        <p>Remaining Balance: {calculatedTotals.remainingBalance}</p>
        <p>Amount USD Prop: {amount_usd}</p>
        <p>Obligations Count: {data?.data?.results?.length || 0}</p>
        <p>Raw Data: {JSON.stringify(data?.data?.results)}</p>
      </div>
      <div className='grid grid-cols-3 gap-5'>
        {StatsCard.map((item, index) => {
          return (
            <div
              className={`px-[1.875rem] py-[1.25rem] rounded-[.625rem] justify-between items-center flex ${
                index === 0 ? "bg-[#107D38]" : "bg-[#B42318]"
              }`}
              key={index}
            >
              <div className='border border-white p-1 rounded'>{item.icon}</div>
              <div className='text-end text-white space-y-[.625rem]'>
                <p className='text-sm'>{item.name}</p>
                <p className='text-[1.5rem] font-semibold'>{item.stat}</p>
              </div>
            </div>
          );
        })}
      </div>
      <div className='w-full bg-white border rounded-lg p-2'>
        <DataTable
          columns={obligationColumns}
          data={data?.data?.results || []}
          isLoading={isFetching}
          pagination={{
            total: data?.data?.pagination?.count || data?.data?.paginator?.count || 0,
            pageSize: data?.data?.pagination?.page_size || data?.data?.paginator?.page_size || 0,
            onChange: (page: number) => setPage(page),
          }}
        />
      </div>
    </section>
  );
};

export default SubGrantObligationHistory;
