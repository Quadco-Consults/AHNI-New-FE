"use client";

import { skipToken } from "@reduxjs/toolkit/query";
import Card from "components/Card";
import { partnerSubmissionColumns } from "@/features/contracts-grants/components/table-columns/sub-grant/submission";
import DataTable from "components/Table/DataTable";
import TableFilters from "components/Table/TableFilters";
import { ISubGrantSingleData } from "@/features/contracts-grants/types/contract-management/sub-grant/sub-grant";
import { useState } from "react";
import { useParams } from "next/navigation";
import { useGetAllSubGrantManualSub } from "@/features/contracts-grants/controllers/submissionController";

export default function PartnerSubmissionList({}: ISubGrantSingleData) {
    const [page, setPage] = useState(1);

    const { id: subGrantId } = useParams();

    const { data, isFetching } = useGetAllSubGrantManualSub(
        subGrantId
            ? {
                  sub_grant: subGrantId,
                  page,
                  size: 10,
              }
            : skipToken
    );

    return (
        <Card>
            <TableFilters>
                <DataTable
                    columns={partnerSubmissionColumns}
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
