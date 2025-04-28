import React, { useMemo, useState } from "react";
import { TotalExpenditureSvg, TotalIncomeSvg } from "assets/svgs/CAndGSvgs";
import DataTable from "components/Table/DataTable";
import { IGrantSingleData } from "definations/c&g/grants";
import { useLocation, useParams } from "react-router-dom";
import { skipToken } from "@reduxjs/toolkit/query";
import { obligationColumns } from "components/Table/columns/c&g/grant/obligation";
import { useGetAllObligationsQuery } from "services/c&g/grant/obligation";
import { formatNumberCurrency } from "utils/utls";

const ObligationHistory: React.FC<any> = ({
  total_obligation_amount,
  total_expenditure_amount,
  grandID,
}: IGrantSingleData) => {
  const StatsCard = useMemo(() => {
    return [
      {
        id: 1,
        name: "Total Obligation",
        stat: total_obligation_amount
          ? formatNumberCurrency(total_obligation_amount, "USD")
          : 0,
        icon: <TotalIncomeSvg />,
      },
      {
        id: 2,
        name: "Total Expenditure",
        stat: total_expenditure_amount
          ? formatNumberCurrency(total_expenditure_amount)
          : 0,
        icon: <TotalExpenditureSvg />,
      },
    ];
  }, [total_obligation_amount, total_expenditure_amount]);

  const [page, setPage] = useState(1);
  const path = useLocation();

  const { id } = useParams();
  const idToUse = !path.pathname.includes("projects") ? id : grandID;

  const { data, isFetching } = useGetAllObligationsQuery(
    idToUse ? { grantId: idToUse, page, size: 10 } : skipToken
  );

  return (
    <section className="w-full flex flex-col px-5 space-y-[1.25rem]">
      <div className="flex flex-wrap items-start justify-between">
        {StatsCard.map((item, index) => {
          return (
            <div
              className={`w-[49%] px-[1.875rem] py-[1.25rem] rounded-[.625rem] justify-between items-center flex ${
                index === 0 ? "bg-[#107D38]" : "bg-[#B42318]"
              }`}
              key={index}
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
