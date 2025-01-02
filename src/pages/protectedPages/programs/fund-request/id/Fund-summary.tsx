import { ColumnDef } from "@tanstack/react-table";
import DataTable from "components/Table/DataTable";
import Card from "components/shared/Card";
import { FundRequestPaginatedData } from "definations/program-types/fund-request";
import { Button } from "components/ui/button";
import { useGetAllFundRequestsQuery } from "services/programsApi/fund-request";
import { generatePath, Link, useParams } from "react-router-dom";
import { skipToken } from "@reduxjs/toolkit/query/react";
import { RouteEnum } from "constants/RouterConstants";

const FundSummary = () => {
    const { id } = useParams();

    const { data: fundRequest, isLoading } = useGetAllFundRequestsQuery(
        id ? { project: id } : skipToken
    );

    return (
        <Card>
            <DataTable
                data={fundRequest?.data.results || []}
                columns={columns}
                isLoading={isLoading}
                footer={true}
            />
        </Card>
    );
};

export default FundSummary;

const columns: ColumnDef<FundRequestPaginatedData>[] = [
    {
        header: "S/N",
        accessorFn: (_, index) => `${index + 1}`,
        size: 80,
    },

    {
        header: "Location",
        id: "location",
        accessorKey: "location",
        size: 200,
        footer: () => <span className="text-red-500">GRAND TOTAL</span>,
    },

    {
        header: "Fund Request For This Period",
        id: "amount",
        accessorFn: (data) => {
            const currencySymbol = data.currency === "NGN" ? "₦" : "$";

            return `${currencySymbol}${data.total_amount}`;
        },
        footer(props) {
            const data = props.table
                .getRowModel()
                .flatRows.map((row) => row.original);

            const sum = data
                .map((data) => data.total_amount)
                .reduce(
                    (accumulator, value) =>
                        (Number(accumulator as any) +
                            Number(value as any)) as any,
                    []
                );

            return <span>${sum}</span>;
        },
        size: 200,
    },

    {
        header: "Unique Identifier Code",
        id: "uuid_code",
        accessorKey: "uuid_code",
        size: 200,
    },

    {
        header: "",
        id: "actions",
        cell: ({ row }) => <TableAction data={row.original} />,
    },
];

const TableAction = ({ data }: { data: FundRequestPaginatedData }) => {
    const { id } = useParams();

    return (
        <Link
            to={{
                pathname: generatePath(
                    RouteEnum.PROGRAM_FUND_REQUEST_VIEW_ACTIVITY,
                    {
                        id,
                    }
                ),
                search: `?fundRequestId=${data?.id}`,
            }}
        >
            <Button
                type="button"
                variant="ghost"
                className="text-[#DEA004] hover:text-[#DEA004]"
            >
                View
            </Button>
        </Link>
    );
};
