import React, { useMemo, useState } from "react";
import { TotalExpenditureSvg, TotalIncomeSvg } from "assets/svgs/CAndGSvgs";
import DataTable from "components/Table/DataTable";
import { ISubGrantSingleData } from "@/features/contracts-grants/types/contract-management/sub-grant/sub-grant";
import { obligationColumns } from "@/features/contracts-grants/components/table-columns/grant/obligation";
import { useGetAllSubGrantObligations } from "@/features/contracts-grants/controllers/subGrantObligationController";
import { formatNumberCurrency } from "utils/utls";

interface SubGrantObligationHistoryProps {
  subGrantId: string;
  awardAmountUsd?: string | number;
  total_obligation_amount?: string | number;
  current_month_obligation_amount?: string | number;
  remaining_award_amount?: string | number;
}

const SubGrantObligationHistory: React.FC<SubGrantObligationHistoryProps> = ({
  subGrantId,
  awardAmountUsd,
  total_obligation_amount,
  current_month_obligation_amount,
  remaining_award_amount,
}) => {
  const [page, setPage] = useState(1);

  const { data, isFetching } = useGetAllSubGrantObligations({
    subGrantId: subGrantId || "",
    page,
    size: 10,
    enabled: !!subGrantId,
  });

  // Calculate stats from the fetched data
  const calculatedStats = useMemo(() => {
    const obligations = data?.data?.results || [];

    // Calculate total obligated amount (sum of all obligations)
    const totalObligated = obligations.reduce((sum: number, obligation: any) => {
      return sum + Number(obligation.amount || 0);
    }, 0);

    // Get current month obligations
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const currentMonthTotal = obligations
      .filter((obligation: any) => {
        const obligationDate = new Date(obligation.created_datetime);
        return (
          obligationDate.getMonth() === currentMonth &&
          obligationDate.getFullYear() === currentYear
        );
      })
      .reduce((sum: number, obligation: any) => {
        return sum + Number(obligation.amount || 0);
      }, 0);

    return {
      totalObligated,
      currentMonthTotal,
    };
  }, [data?.data?.results]);

  const StatsCard = useMemo(() => {
    return [
      {
        id: 1,
        name: "Total Obligated Amount",
        stat: total_obligation_amount
          ? formatNumberCurrency(total_obligation_amount, "USD")
          : calculatedStats.totalObligated > 0
          ? formatNumberCurrency(calculatedStats.totalObligated, "USD")
          : "$0.00",
        icon: <TotalIncomeSvg />,
      },
      {
        id: 3,
        name: "Balance ",
        stat: remaining_award_amount
          ? formatNumberCurrency(remaining_award_amount, "USD")
          : awardAmountUsd
          ? formatNumberCurrency(Math.max(0, Number(awardAmountUsd) - calculatedStats.totalObligated), "USD")
          : "$0.00",
        icon: <TotalExpenditureSvg />,
      },
      {
        id: 2,
        name: "Obligated Amount (Current Month)",
        stat: current_month_obligation_amount
          ? formatNumberCurrency(current_month_obligation_amount, "USD")
          : calculatedStats.currentMonthTotal > 0
          ? formatNumberCurrency(calculatedStats.currentMonthTotal, "USD")
          : "$0.00",
        icon: <TotalExpenditureSvg />,
      },
    ];
  }, [
    total_obligation_amount,
    current_month_obligation_amount,
    remaining_award_amount,
    awardAmountUsd,
    calculatedStats,
  ]);

  return (
    <section className='w-full flex flex-col px-5 space-y-[1.25rem]'>
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
