import React, { useMemo, useState } from "react";
import { TotalExpenditureSvg, TotalIncomeSvg } from "assets/svgs/CAndGSvgs";
import DataTable from "components/Table/DataTable";
import { IGrantSingleData } from "features/contracts-grants/types/grants";
import { useParams } from "next/navigation";
import { skipToken } from "@reduxjs/toolkit/query";
import { obligationColumns } from "@/features/contracts-grants/components/table-columns/grant/obligation";
import { useGetAllObligations } from "@/features/contracts-grants/controllers/obligationController";
import { formatNumberCurrency } from "utils/utls";

const ObligationHistory: React.FC<any> = ({
  total_obligation_amount,
  current_month_obligation_amount,
  remaining_award_amount,
  grandID,
}: IGrantSingleData) => {
  const StatsCard = useMemo(() => {
    return [
      {
        id: 1,
        name: "Total Obligated Amount",
        stat: total_obligation_amount
          ? formatNumberCurrency(total_obligation_amount, "USD")
          : 0,
        icon: <TotalIncomeSvg />,
      },
      {
        id: 3,
        name: "Balance ",
        // stat: "$100",
        stat: remaining_award_amount
          ? formatNumberCurrency(remaining_award_amount, "USD")
          : 0,
        icon: <TotalExpenditureSvg />,
      },
      {
        id: 2,
        name: "Obligated Amount",
        stat: current_month_obligation_amount
          ? formatNumberCurrency(current_month_obligation_amount)
          : 0,
        icon: <TotalExpenditureSvg />,
      },
    ];
  }, [
    total_obligation_amount,
    current_month_obligation_amount,
    remaining_award_amount,
  ]);

  const [page, setPage] = useState(1);

  const { id } = useParams();
  const idToUse = id;

  const { data, isFetching } = useGetAllObligations(
    idToUse ? { grantId: idToUse, page, size: 10 } : skipToken
  );

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
          data={data?.data.results || []}
          isLoading={isFetching}
          pagination={{
            total: data?.data.pagination.count ?? 0,
            pageSize: data?.data.pagination.page_size ?? 0,
            onChange: (page: number) => setPage(page),
          }}
        />
      </div>
    </section>
  );
};

export default ObligationHistory;
