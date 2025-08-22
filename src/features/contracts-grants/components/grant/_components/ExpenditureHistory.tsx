import React, { useMemo, useState } from "react";
import { TotalExpenditureSvg, TotalIncomeSvg } from "assets/svgs/CAndGSvgs";
import DataTable from "components/Table/DataTable";
import { expenditureColumns } from "components/Table/columns/c&g/grant/expenditure";
import { IGrantSingleData } from "features/contracts-grants/types/grants";
import { useParams } from "next/navigation";
import { skipToken } from "@reduxjs/toolkit/query";
import { useGetAllExpenditures } from "@/features/contracts-grants/controllers/grant/expenditure";
import { formatNumberCurrency } from "utils/utls";

const ExpenditureHistory: React.FC<any> = ({
    total_expenditure_amount,
    total_obligation_amount,
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
                name: "Balance",
                stat: "$1000",
                icon: <TotalIncomeSvg />,
            },
            {
                id: 3,
                name: "Total Expenditure",
                stat: total_expenditure_amount
                    ? formatNumberCurrency(total_expenditure_amount, "USD")
                    : 0,
                icon: <TotalExpenditureSvg />,
            },
        ];
    }, [total_expenditure_amount, total_obligation_amount]);

    const [page, setPage] = useState(1);

    const { id } = useParams();

    const { data, isFetching } = useGetAllExpenditures(
        id ? { grantId: id, page, size: 10 } : skipToken
    );

    return (
        <section className="w-full flex flex-col px-5 space-y-[1.25rem]">
            <div className="grid grid-cols-3 gap-5">
                {StatsCard.map((item, index) => {
                    return (
                        <div
                            className={`px-[1.875rem] py-[1.25rem] rounded-[.625rem] justify-between items-center flex ${
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
                                    {item.stat}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className="w-full bg-white border rounded-lg p-2">
                <DataTable
                    columns={expenditureColumns}
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
