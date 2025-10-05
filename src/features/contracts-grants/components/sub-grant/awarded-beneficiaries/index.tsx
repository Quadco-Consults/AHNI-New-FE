"use client";

import { useDebounce } from "ahooks";
import Card from "components/Card";
import { awardedBeneficiariesColumn } from "@/features/contracts-grants/components/table-columns/sub-grant/awarded-beneficiaries";
import DataTable from "components/Table/DataTable";
import TableFilters from "components/Table/TableFilters";
import { useState } from "react";
import { useGetAllSubGrantSubmissions } from "@/features/contracts-grants/controllers/submissionController";

export default function AwardedBeneficiaries() {
    const [page, setPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");

    const debouncedSearchQuery = useDebounce(searchQuery, {
        wait: 500,
    });

    const { data, isFetching } = useGetAllSubGrantSubmissions({
        page,
        size: 10,
        search: debouncedSearchQuery,
    });

    // Filter awarded submissions
    const awardedSubmissions = data?.data?.results?.filter(
        (submission: any) => submission.status === "AWARDED"
    ) || [];

    return (
        <section className="space-y-5">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Awarded Beneficiaries</h1>
                <p className="text-gray-600 mt-1">
                    View and manage all sub-grant awardees and beneficiaries
                </p>
            </div>

            <Card>
                <TableFilters
                    onSearchChange={(e) => setSearchQuery(e.target.value)}
                >
                    <DataTable
                        columns={awardedBeneficiariesColumn}
                        data={awardedSubmissions}
                        isLoading={isFetching}
                        pagination={{
                            total: data?.data?.paginator?.count ?? 0,
                            pageSize: data?.data?.paginator?.page_size ?? 10,
                            onChange: (page: number) => setPage(page),
                        }}
                    />
                </TableFilters>
            </Card>
        </section>
    );
}
