import React, { useMemo, useState } from "react";
import { TotalExpenditureSvg, TotalIncomeSvg } from "assets/svgs/CAndGSvgs";
import DataTable from "@/components/Table/DataTable";
import { obligationColumns } from "@/features/contracts-grants/components/table-columns/grant/obligation";
import { useGetAllSubGrantObligations } from "@/features/contracts-grants/controllers/subGrantObligationController";
import { formatNumberCurrency } from "@/utils/utls";

interface SubGrantObligationHistoryProps {
  subGrantId: string;
  awardAmountUsd?: string | number;
}

/**
 * SubGrant Obligation History Component
 *
 * Displays obligations for an awarded subgrant.
 * Uses SubGrant ID directly (not award ID) because the backend
 * endpoint is /sub-grants/{sub_grant_id}/obligations/
 */
const SubGrantObligationHistory: React.FC<SubGrantObligationHistoryProps> = ({
  subGrantId,
  awardAmountUsd,
}) => {
  const [page, setPage] = useState(1);

  // Fetch obligations using subGrantId
  const { data, isFetching } = useGetAllSubGrantObligations({
    subGrantId: subGrantId,  // Use subGrantId, not awardId
    page,
    size: 10,
    enabled: !!subGrantId,
  });

  // Calculate stats from the fetched data
  const stats = useMemo(() => {
    const obligations = data?.data?.results || [];

    const total = obligations.reduce(
      (sum: number, item: any) => {
        return sum + (Number(item.amount) || 0);
      },
      0
    );

    // Get current month obligations
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const currentMonthTotal = obligations
      .filter((item: any) => {
        const itemDate = new Date(item.created_datetime);
        return (
          itemDate.getMonth() === currentMonth &&
          itemDate.getFullYear() === currentYear
        );
      })
      .reduce((sum: number, item: any) => sum + (Number(item.amount) || 0), 0);

    // Calculate balance (award amount - total obligations)
    const awardAmount = Number(awardAmountUsd || 0);
    const balance = awardAmount - total;

    return {
      total,
      currentMonth: currentMonthTotal,
      balance: Math.max(0, balance), // Ensure balance is not negative
    };
  }, [data, awardAmountUsd]);

  const StatsCard = useMemo(() => {
    return [
      {
        id: 1,
        name: "Total Obligated Amount",
        stat: formatNumberCurrency(stats.total, "USD"),
        icon: <TotalIncomeSvg />,
        bgColor: "bg-[#107D38]",
      },
      {
        id: 2,
        name: "Current Month Obligations",
        stat: formatNumberCurrency(stats.currentMonth, "USD"),
        icon: <TotalExpenditureSvg />,
        bgColor: "bg-[#B42318]",
      },
      {
        id: 3,
        name: "Balance",
        stat: formatNumberCurrency(stats.balance, "USD"),
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
        <DataTable
          columns={obligationColumns}
          data={data?.data?.results || []}
          isLoading={isFetching}
          pagination={{
            total:
              data?.data?.pagination?.count || data?.data?.paginator?.count || 0,
            pageSize:
              data?.data?.pagination?.page_size ||
              data?.data?.paginator?.page_size ||
              0,
            onChange: (page: number) => setPage(page),
          }}
        />
      </div>
    </section>
  );
};

export default SubGrantObligationHistory;
