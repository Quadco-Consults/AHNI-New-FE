"use client";

import React, { useMemo, useState } from "react";
import { TotalExpenditureSvg, TotalIncomeSvg } from "assets/svgs/CAndGSvgs";
import DataTable from "components/Table/DataTable";
import { expenditureColumns } from "@/features/contracts-grants/components/table-columns/grant/expenditure";
import { IGrantSingleData } from "features/contracts-grants/types/grants";
import { useParams } from "next/navigation";
import { useGetAllExpenditures } from "@/features/contracts-grants/controllers/expenditureController";
import { formatNumberCurrency } from "utils/utls";

const ExpenditureHistory: React.FC<any> = ({
    total_expenditure_amount,
    total_obligation_amount,
}: IGrantSingleData) => {
    const StatsCard = useMemo(() => {
        // Calculate balance: Total Obligation - Total Expenditure
        const obligation = parseFloat(total_obligation_amount || "0");
        const expenditure = parseFloat(total_expenditure_amount || "0");
        const balance = obligation - expenditure;

        return [
            {
                id: 1,
                name: "Total Obligation",
                stat: total_obligation_amount
                    ? formatNumberCurrency(total_obligation_amount, "USD")
                    : formatNumberCurrency("0", "USD"),
                icon: <TotalIncomeSvg />,
            },
            {
                id: 2,
                name: "Balance",
                stat: formatNumberCurrency(balance.toString(), "USD"),
                icon: <TotalIncomeSvg />,
            },
            {
                id: 3,
                name: "Total Expenditure",
                stat: total_expenditure_amount
                    ? formatNumberCurrency(total_expenditure_amount, "USD")
                    : formatNumberCurrency("0", "USD"),
                icon: <TotalExpenditureSvg />,
            },
        ];
    }, [total_expenditure_amount, total_obligation_amount]);

    const [page, setPage] = useState(1);

    const { id } = useParams();
    const grantId = typeof id === 'string' ? id : Array.isArray(id) ? id[0] : undefined;
    

    const { data, isFetching } = useGetAllExpenditures(
        grantId ? { grantId: grantId, page, size: 10, enabled: true } : { grantId: "", enabled: false }
    );

    // Debug logging
    console.log("Expenditure data:", data?.data?.results);

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

export default ExpenditureHistory;
