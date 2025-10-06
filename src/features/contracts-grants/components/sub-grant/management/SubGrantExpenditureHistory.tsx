"use client";

import React, { useMemo, useState } from "react";
import { TotalExpenditureSvg, TotalIncomeSvg } from "assets/svgs/CAndGSvgs";
import DataTable from "components/Table/DataTable";
import { expenditureColumns } from "@/features/contracts-grants/components/table-columns/grant/expenditure";
import { useGetAllSubGrantExpenditures } from "@/features/contracts-grants/controllers/subGrantExpenditureController";
import { formatNumberCurrency } from "utils/utls";

interface SubGrantExpenditureHistoryProps {
  subGrantId: string;
}

/**
 * SubGrant Expenditure History Component
 *
 * Displays expenditures for an awarded subgrant.
 * Uses SubGrant ID directly (not award ID) because the backend
 * endpoint is /sub-grants/{sub_grant_id}/expenditures/
 */
const SubGrantExpenditureHistory: React.FC<SubGrantExpenditureHistoryProps> = ({
  subGrantId,
}) => {
  const [page, setPage] = useState(1);

  // Fetch expenditures using subGrantId
  const { data, isFetching, error } = useGetAllSubGrantExpenditures({
    subGrantId: subGrantId,  // Use subGrantId, not awardId
    page,
    size: 10,
    enabled: !!subGrantId,
  });

  // Calculate stats from the fetched data
  const stats = useMemo(() => {
    const expenditures = data?.data?.results || [];
    const totalExpenditure = expenditures.reduce(
      (sum: number, item: any) => sum + (parseFloat(item.amount) || 0),
      0
    );

    // TODO: Fetch total obligations to calculate balance
    const totalObligation = 0;
    const balance = totalObligation - totalExpenditure;

    return {
      totalObligation,
      totalExpenditure,
      balance,
    };
  }, [data]);

  const StatsCard = useMemo(() => {
    return [
      {
        id: 1,
        name: "Total Obligation",
        stat: formatNumberCurrency(stats.totalObligation.toString(), "USD"),
        icon: <TotalIncomeSvg />,
        bgColor: "bg-[#107D38]",
      },
      {
        id: 2,
        name: "Balance",
        stat: formatNumberCurrency(stats.balance.toString(), "USD"),
        icon: <TotalIncomeSvg />,
        bgColor: "bg-[#B42318]",
      },
      {
        id: 3,
        name: "Total Expenditure",
        stat: formatNumberCurrency(stats.totalExpenditure.toString(), "USD"),
        icon: <TotalExpenditureSvg />,
        bgColor: "bg-[#B42318]",
      },
    ];
  }, [stats]);

  return (
    <section className="w-full flex flex-col px-5 space-y-[1.25rem]">
      <div className="grid grid-cols-3 gap-5">
        {StatsCard.map((item) => {
          return (
            <div
              className={`px-[1.875rem] py-[1.25rem] rounded-[.625rem] justify-between items-center flex ${item.bgColor}`}
              key={item.id}
            >
              <div className="border border-white p-1 rounded">{item.icon}</div>
              <div className="text-end text-white space-y-[.625rem]">
                <p className="text-sm">{item.name}</p>
                <p className="text-[1.5rem] font-semibold">{item.stat}</p>
              </div>
            </div>
          );
        })}
      </div>
      <div className="w-full bg-white border rounded-lg p-2">
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 font-medium">Error loading expenditure data:</p>
            <p className="text-red-600 text-sm mt-1">
              {(error as any)?.message || "Unknown error"}
            </p>
          </div>
        )}
        {!subGrantId && (
          <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800 font-medium">No Sub-Grant ID found</p>
            <p className="text-yellow-600 text-sm mt-1">
              Unable to load expenditure data without a valid sub-grant ID
            </p>
          </div>
        )}
        <DataTable
          columns={expenditureColumns}
          data={data?.data?.results || []}
          isLoading={isFetching}
          pagination={{
            total: data?.data?.paginator?.count ?? 0,
            pageSize: data?.data?.paginator?.page_size ?? 0,
            onChange: (page: number) => setPage(page),
          }}
        />
      </div>
    </section>
  );
};

export default SubGrantExpenditureHistory;
