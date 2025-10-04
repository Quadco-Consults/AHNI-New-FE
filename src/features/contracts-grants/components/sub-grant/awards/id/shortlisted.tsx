"use client";

import { skipToken } from "@reduxjs/toolkit/query";
import Card from "components/Card";
import { shortlistedSubmissionColumns } from "@/features/contracts-grants/components/table-columns/sub-grant/shortlisted";
import DataTable from "components/Table/DataTable";
import TableFilters from "components/Table/TableFilters";
import { ISubGrantSingleData } from "@/features/contracts-grants/types/contract-management/sub-grant/sub-grant";
import { useState } from "react";
import { useParams } from "next/navigation";
import { useGetAllSubGrantManualSub } from "@/features/contracts-grants/controllers/submissionController";

export default function ShortlistedSubmissionsList({}: ISubGrantSingleData) {
    const [page, setPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");

    const { id: subGrantId } = useParams();

    const { data, isFetching } = useGetAllSubGrantManualSub(
        subGrantId
            ? {
                  sub_grant: subGrantId as string,
                  page,
                  size: 10,
                  search: searchQuery,
              }
            : skipToken
    );

    // Filter only shortlisted submissions
    const shortlistedSubmissions = data?.data.results?.filter(
        (submission: any) => submission.status === "SHORTLISTED" || submission.is_shortlisted
    ) || [];

    return (
        <Card>
            <TableFilters onSearchChange={(e) => setSearchQuery(e.target.value)}>
                <DataTable
                    columns={shortlistedSubmissionColumns}
                    data={shortlistedSubmissions}
                    isLoading={isFetching}
                    pagination={{
                        total: shortlistedSubmissions.length,
                        pageSize: 10,
                        onChange: (page: number) => setPage(page),
                    }}
                />
            </TableFilters>
        </Card>
    );
}
