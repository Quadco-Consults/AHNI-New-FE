"use client";

import React, { useMemo, useState } from "react";
import { TotalIncomeSvg, TotalExpenditureSvg } from "assets/svgs/CAndGSvgs";
import DataTable from "@/components/Table/DataTable";
import { IGrantSingleData } from "@/features/contracts-grants/types/grants";
import { useParams } from "next/navigation";
import { formatNumberCurrency } from "@/utils/utls";
import { ColumnDef } from "@tanstack/react-table";
import { IDisbursementPaginatedData } from "../../../types/grants";
import { Badge } from "@/components/ui/badge";
import { useGetAllDisbursements } from "../../../controllers/disbursementController";

// Calculate total disbursed amount from real data
const calculateTotalDisbursed = (disbursements: IDisbursementPaginatedData[] = []) => {
    return disbursements.reduce((total, disbursement) => {
        const amount = parseFloat(disbursement.amount || "0") || 0;
        return total + amount;
    }, 0).toString();
};

// Disbursement table columns
const disbursementColumns: ColumnDef<IDisbursementPaginatedData>[] = [
    {
        accessorKey: "disbursement_date",
        header: "Date",
        cell: ({ row }) => {
            const date = new Date(row.original.disbursement_date);
            return <span>{date.toLocaleDateString()}</span>;
        },
    },
    {
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => (
            <div className="max-w-xs">
                <p className="font-medium">{row.original.description}</p>
                {row.original.reference_number && (
                    <p className="text-sm text-gray-500">Ref: {row.original.reference_number}</p>
                )}
            </div>
        ),
    },
    {
        accessorKey: "amount",
        header: "Amount",
        cell: ({ row }) => {
            return (
                <span className="font-semibold text-green-600">
                    {formatNumberCurrency(row.original.amount, "USD")}
                </span>
            );
        },
    },
    {
        accessorKey: "disbursement_method",
        header: "Method",
        cell: ({ row }) => {
            if (!row.original.disbursement_method) return <span>-</span>;
            return (
                <Badge variant="outline" className="text-xs">
                    {row.original.disbursement_method}
                </Badge>
            );
        },
    },
    {
        accessorKey: "created_datetime",
        header: "Recorded On",
        cell: ({ row }) => {
            const date = new Date(row.original.created_datetime);
            return <span className="text-sm text-gray-500">{date.toLocaleDateString()}</span>;
        },
    },
];

const DisbursementHistory: React.FC<any> = ({
    total_disbursement_amount,
    total_obligation_amount,
    project_id,
}: IGrantSingleData & { total_disbursement_amount?: string }) => {
    const { id } = useParams();
    const grantId = typeof id === 'string' ? id : Array.isArray(id) ? id[0] : undefined;

    const [page, setPage] = useState(1);

    const { data, isFetching, error } = useGetAllDisbursements({
        grantId: grantId || "",
        page,
        size: 20,
        enabled: !!grantId,
    });

    // Calculate total disbursed from real data
    const actualTotalDisbursed = useMemo(() => {
        if (data?.data?.results) {
            return calculateTotalDisbursed(data.data.results);
        }
        return "0";
    }, [data?.data?.results]);

    const StatsCard = useMemo(() => {
        // Calculate pending disbursements: Total Obligation - Total Disbursed
        // Handle potential type conversion issues that might occur in backend
        let obligation = 0;
        let disbursed = 0;
        let pending = 0;

        try {
            obligation = parseFloat(total_obligation_amount?.toString() || "0") || 0;
            disbursed = parseFloat(actualTotalDisbursed || "0") || 0; // Use real calculated amount
            pending = obligation - disbursed;
        } catch (error) {
            console.warn("Error calculating disbursement balance:", error);
            pending = 0;
        }

        return [
            {
                id: 1,
                name: "Total Obligation",
                stat: total_obligation_amount
                    ? formatNumberCurrency(total_obligation_amount, "USD")
                    : formatNumberCurrency("0", "USD"),
                icon: <TotalIncomeSvg />,
                color: "bg-[#107D38]"
            },
            {
                id: 2,
                name: "Total Disbursed",
                stat: formatNumberCurrency(disbursed.toString(), "USD"),
                icon: <TotalExpenditureSvg />,
                color: "bg-[#2563EB]"
            },
            {
                id: 3,
                name: "Pending Disbursement",
                stat: formatNumberCurrency(pending.toString(), "USD"),
                icon: <TotalIncomeSvg />,
                color: "bg-[#B42318]"
            },
        ];
    }, [actualTotalDisbursed, total_obligation_amount]);

    // Log errors only when they occur
    if (error) {
        console.error("❌ Disbursement API Error:", error);
    }

    // Log successful data load only once
    if (data?.data?.results && !isFetching) {
        console.log("✅ Disbursements loaded:", data.data.results.length, "records");
    }

    return (
        <section className="w-full flex flex-col px-5 space-y-[1.25rem]">
            <div className="grid grid-cols-3 gap-5">
                {StatsCard.map((item, index) => {
                    return (
                        <div
                            className={`px-[1.875rem] py-[1.25rem] rounded-[.625rem] justify-between items-center flex ${item.color}`}
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
                        <p className="text-red-800 font-medium">Error loading disbursement data:</p>
                        <p className="text-red-600 text-sm mt-1">{error.message}</p>
                        {error.message && error.message.includes("decimal.InvalidOperation") && (
                            <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
                                <p className="text-yellow-800 text-xs font-medium">Backend Decimal Error:</p>
                                <p className="text-yellow-700 text-xs">The backend is encountering invalid decimal operations. This usually means there are NULL or invalid values in the financial data. The backend team needs to add null-safe decimal handling in the disbursement calculations.</p>
                            </div>
                        )}
                    </div>
                )}
                {!grantId && (
                    <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-yellow-800 font-medium">No Grant ID found</p>
                        <p className="text-yellow-600 text-sm mt-1">Unable to load disbursement data without a valid grant ID</p>
                    </div>
                )}
                <DataTable
                    columns={disbursementColumns}
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

export default DisbursementHistory;