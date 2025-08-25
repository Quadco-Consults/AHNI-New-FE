import DataTable from "components/Table/DataTable";
import Card from "components/Card";
import { useGetAllFundRequests } from "@/features/programs/controllers/fundRequestController";
import { useParams } from "next/navigation";
import { skipToken } from "@reduxjs/toolkit/query/react";
import { fundRequestSummaryColumns } from "@/features/programs/components/table-columns/fund-request/fund-request-summary";
import TableFilters from "components/Table/TableFilters";

export default function FundRequestSummary() {
    const { id } = useParams();

    const { data: fundRequest, isLoading } = useGetAllFundRequests(
        id ? { project: id } : skipToken
    );

    return (
        <Card>
            <TableFilters>
                <DataTable
                    data={fundRequest?.data.results || []}
                    columns={fundRequestSummaryColumns}
                    isLoading={isLoading}
                    footer={true}
                />
            </TableFilters>
        </Card>
    );
}
