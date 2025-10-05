"use client";

import { useDebounce } from "ahooks";
import Card from "components/Card";
import { awardedBeneficiariesColumn } from "@/features/contracts-grants/components/table-columns/sub-grant/awarded-beneficiaries";
import DataTable from "components/Table/DataTable";
import TableFilters from "components/Table/TableFilters";
import { useState, useMemo } from "react";
import { useGetAllSubGrantSubmissions } from "@/features/contracts-grants/controllers/submissionController";
import { useGetAllSubGrants } from "@/features/contracts-grants/controllers/subGrantController";

export default function AwardedBeneficiaries() {
    const [page, setPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");

    const debouncedSearchQuery = useDebounce(searchQuery, {
        wait: 500,
    });

    const { data: submissionsData, isFetching: isSubmissionsFetching } = useGetAllSubGrantSubmissions({
        page,
        size: 10,
        search: debouncedSearchQuery,
    });

    // Fetch all sub-grants to get the full details
    const { data: subGrantsData, isFetching: isSubGrantsFetching } = useGetAllSubGrants({
        page: 1,
        size: 1000, // Fetch all sub-grants
        enabled: true,
    });

    // Filter awarded submissions and enrich with sub-grant data
    const awardedSubmissions = useMemo(() => {
        const awarded = submissionsData?.data?.results?.filter(
            (submission: any) => submission.status === "AWARDED"
        ) || [];

        // Enrich submissions with full sub-grant data
        return awarded.map((submission: any) => {
            const subGrantId = typeof submission.sub_grant === 'string'
                ? submission.sub_grant
                : submission.sub_grant_id;

            const subGrantDetails = subGrantsData?.data?.results?.find(
                (sg: any) => sg.id === subGrantId
            );

            return {
                ...submission,
                sub_grant: subGrantDetails || submission.sub_grant,
            };
        });
    }, [submissionsData, subGrantsData]);

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
                        isLoading={isSubmissionsFetching || isSubGrantsFetching}
                        pagination={{
                            total: submissionsData?.data?.paginator?.count ?? 0,
                            pageSize: submissionsData?.data?.paginator?.page_size ?? 10,
                            onChange: (page: number) => setPage(page),
                        }}
                    />
                </TableFilters>
            </Card>
        </section>
    );
}
