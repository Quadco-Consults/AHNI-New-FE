import React, { useMemo } from "react";
import { TotalExpenditureSvg, TotalIncomeSvg } from "assets/svgs/CAndGSvgs";
import { expenditureAPIs } from "services/cAndGApi/expenditure";
import { ColumnDef } from "@tanstack/react-table";
import DataTable from "components/Table/DataTable";

const ExpenditureHistory: React.FC<any> = ({ grantDetails }) => {
  console.log(grantDetails);

  const getExpenditures = expenditureAPIs.useGetExpendituresQuery({});
  console.log(getExpenditures);

  const columns: ColumnDef<any>[] = [
    {
      header: "Project",
      accessorKey: "project",
      size: 200,
      cell: ({ row }) => <p>{row?.original?.project || "-"}</p>,
    },
    {
      header: "Amount Spent",
      accessorKey: "amount",
      size: 200,
      cell: ({ row }) => <p>{row?.original?.amount}</p>,
    },
    {
      header: "Month/Year",
      accessorKey: "mounth_year",
      size: 200,
      cell: ({ row }) => <p>{row?.original?.month_year}</p>,
    },
  ];

  const StatsCard = useMemo(() => {
    return [
      { id: 1, name: "Total Income", stat: 2000000, icon: <TotalIncomeSvg /> },
      { id: 1, name: "Total Expenditure", stat: 300000, icon: <TotalExpenditureSvg /> },
    ];
  }, []);
  return (
    <section className="w-full flex flex-col px-5 space-y-[1.25rem]">
      <div className="flex flex-wrap items-start justify-between">
        {StatsCard.map((item, index) => {
          return (
            <div className={`w-[49%] px-[1.875rem] py-[1.25rem] rounded-[.625rem] justify-between items-center flex ${index === 0 ? "bg-[#107D38]" : "bg-[#B42318]"}`} key={index}>
              <div className="border border-white p-1 rounded">{item.icon}</div>
              <div className="text-end text-white space-y-[.625rem]">
                <p className="text-sm">{item.name}</p>
                <p className="text-[1.5rem] font-semibold">N{item.stat}</p>
              </div>
            </div>
          );
        })}
      </div>
      <div className="w-full bg-white border rounded-lg p-2">
        <DataTable columns={columns} data={getExpenditures?.data?.results || []} isLoading={getExpenditures.isLoading} />
      </div>
    </section>
  );
};

export default ExpenditureHistory;
