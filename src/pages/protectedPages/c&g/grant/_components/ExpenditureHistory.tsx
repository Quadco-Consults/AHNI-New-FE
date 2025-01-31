import React, { useMemo, useState } from "react";
import { TotalExpenditureSvg, TotalIncomeSvg } from "assets/svgs/CAndGSvgs";
import DataTable from "components/Table/DataTable";
import { expenditureHistoryColumns } from "components/Table/columns/c&g/grant/expenditure-history";
import { IGrantSingleData } from "definations/c&g/grants";
import { useGetAllExpendituresQuery } from "services/c&g/expenditure";
import { useParams } from "react-router-dom";
import { skipToken } from "@reduxjs/toolkit/query";

const ExpenditureHistory: React.FC<any> = ({}: IGrantSingleData) => {
    const StatsCard = useMemo(() => {
        return [
            {
                id: 1,
                name: "Total Income",
                stat: 2000000,
                icon: <TotalIncomeSvg />,
            },
            {
                id: 1,
                name: "Total Expenditure",
                stat: 300000,
                icon: <TotalExpenditureSvg />,
            },
        ];
    }, []);

    const [page, setPage] = useState(1);

    const { id } = useParams();

    const { data, isFetching } = useGetAllExpendituresQuery(
        id ? { grantId: id, page, size: 10 } : skipToken
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
                            <div className="border border-white p-1 rounded">
                                {item.icon}
                            </div>
                            <div className="text-end text-white space-y-[.625rem]">
                                <p className="text-sm">{item.name}</p>
                                <p className="text-[1.5rem] font-semibold">
                                    ${item.stat}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className="w-full bg-white border rounded-lg p-2">
                <DataTable
                    columns={expenditureHistoryColumns}
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

export default ExpenditureHistory;
