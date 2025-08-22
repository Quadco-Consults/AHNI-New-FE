import Card from "components/Card";
import { preAwardAssessmentColumns } from "components/Table/columns/c&g/sub-grant/pre-award-assessment";
import { partnerSubmissionColumns } from "components/Table/columns/c&g/sub-grant/submission";
import DataTable from "components/Table/DataTable";
import TableFilters from "components/Table/TableFilters";
import { useState } from "react";
import { useGetAllSubGrantManualSub } from "@/features/contracts-grants/controllers/subgrant/submissionController";

export default function PreAwardAssessment() {
    const [page, setPage] = useState(1);

    const { data, isFetching } = useGetAllSubGrantManualSub({
        page,
        size: 10,
    });

    return (
        <Card>
            <TableFilters>
                <DataTable
                    columns={preAwardAssessmentColumns}
                    data={data?.data.results || []}
                    isLoading={isFetching}
                    pagination={{
                        total: data?.data.pagination.count ?? 0,
                        pageSize: data?.data.pagination.page_size ?? 0,
                        onChange: (page: number) => setPage(page),
                    }}
                />
            </TableFilters>
        </Card>
    );
}
