"use client";

import Card from "components/Card";
import { preAwardAssessmentColumns } from "@/features/contracts-grants/components/table-columns/sub-grant/pre-award-assessment";
import DataTable from "components/Table/DataTable";
import TableFilters from "components/Table/TableFilters";
import { useState } from "react";
import { useGetAllSubGrantSubmissions } from "@/features/contracts-grants/controllers/submissionController";

export default function PreAwardAssessment() {
    const [page, setPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");

    const { data, isFetching } = useGetAllSubGrantSubmissions({
        page,
        size: 10,
        search: searchQuery,
    });

    return (
        <section className="space-y-5">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Pre-Award Assessment</h1>
                <p className="text-gray-600 mt-1">
                    View all pre-award assessments and conduct assessments
                </p>
            </div>

            <Card>
                <TableFilters onSearchChange={(e) => setSearchQuery(e.target.value)}>
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
        </section>
    );
}
