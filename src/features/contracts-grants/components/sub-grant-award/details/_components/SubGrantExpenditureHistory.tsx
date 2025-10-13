"use client";

import React, { useMemo, useState } from "react";
import { TotalExpenditureSvg, TotalIncomeSvg } from "assets/svgs/CAndGSvgs";
import DataTable from "components/Table/DataTable";
import { expenditureColumns } from "@/features/contracts-grants/components/table-columns/grant/expenditure";
import { ISubGrantSingleData } from "@/features/contracts-grants/types/contract-management/sub-grant/sub-grant";
import { useGetAllSubGrantExpenditures } from "@/features/contracts-grants/controllers/subGrantExpenditureController";
import { formatNumberCurrency } from "utils/utls";
import { ColumnDef } from "@tanstack/react-table";
import { IExpenditurePaginatedData } from "@/features/contracts-grants/types/grants";

interface SubGrantExpenditureHistoryProps {
    subGrantId: string;
    total_expenditure_amount?: string | number;
    total_obligation_amount?: string | number;
    projectName?: string;
}

const SubGrantExpenditureHistory: React.FC<SubGrantExpenditureHistoryProps> = ({
    subGrantId,
    total_expenditure_amount,
    total_obligation_amount,
    projectName,
}) => {
    const [page, setPage] = useState(1);

    // Fetch expenditures for table display with pagination
    const { data, isFetching, error } = useGetAllSubGrantExpenditures({
        subGrantId: subGrantId || "",
        page,
        size: 10,
        enabled: !!subGrantId,
    });

    // Fetch all expenditures for accurate total calculation
    const { data: allExpendituresData } = useGetAllSubGrantExpenditures({
        subGrantId: subGrantId || "",
        page: 1,
        size: 1000,
        enabled: !!subGrantId,
    });

    // Calculate total expenditure from all fetched data
    const calculatedTotalExpenditure = useMemo(() => {
        const expenditures = allExpendituresData?.data?.results || [];
        return expenditures.reduce((sum: number, expenditure: any) => {
            return sum + Number(expenditure.amount || 0);
        }, 0);
    }, [allExpendituresData?.data?.results]);

    // Create custom columns with project name override
    const customColumns = useMemo<ColumnDef<IExpenditurePaginatedData>[]>(() => {
        return expenditureColumns.map(column => {
            if (column.id === 'project' && projectName) {
                return {
                    ...column,
                    accessorFn: () => projectName,
                };
            }
            return column;
        });
    }, [projectName]);

    const StatsCard = useMemo(() => {
        // Calculate balance: Total Obligation - Total Expenditure
        let obligation = 0;
        let expenditure = 0;
        let balance = 0;

        try {
            obligation = Number(total_obligation_amount || 0);
            // Use prop if provided, otherwise use calculated value
            expenditure = total_expenditure_amount
                ? Number(total_expenditure_amount)
                : calculatedTotalExpenditure;
            balance = obligation - expenditure;
        } catch (error) {
            console.warn("Error calculating balance:", error);
            balance = 0;
        }

        return [
            {
                id: 1,
                name: "Total Obligation",
                stat: formatNumberCurrency(obligation.toString(), "USD"),
                icon: <TotalIncomeSvg />,
            },
            {
                id: 2,
                name: "Balance",
                stat: formatNumberCurrency(Math.max(0, balance).toString(), "USD"),
                icon: <TotalIncomeSvg />,
            },
            {
                id: 3,
                name: "Total Expenditure",
                stat: formatNumberCurrency(expenditure.toString(), "USD"),
                icon: <TotalExpenditureSvg />,
            },
        ];
    }, [total_expenditure_amount, total_obligation_amount, calculatedTotalExpenditure]);

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
                {error && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-800 font-medium">Error loading expenditure data:</p>
                        <p className="text-red-600 text-sm mt-1">{error.message}</p>
                    </div>
                )}
                {!subGrantId && (
                    <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-yellow-800 font-medium">No Sub-Grant ID found</p>
                        <p className="text-yellow-600 text-sm mt-1">Unable to load expenditure data without a valid sub-grant ID</p>
                    </div>
                )}
                <DataTable
                    columns={customColumns}
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
