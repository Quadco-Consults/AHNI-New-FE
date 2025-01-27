import DataTable from "components/Table/DataTable";
import Card from "components/shared/Card";
import { useGetAllFundRequestsQuery } from "services/programsApi/fund-request";
import { useParams } from "react-router-dom";
import { skipToken } from "@reduxjs/toolkit/query/react";
import { fundRequestSummaryColumns } from "components/Table/columns/program/fund-request/fund-request-summary";
import TableFilters from "components/Table/TableFilters";

export default function FundRequestSummary() {
    const { id } = useParams();

    const { data: fundRequest, isLoading } = useGetAllFundRequestsQuery(
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
