"use client";

import { skipToken } from "@reduxjs/toolkit/query";
import Card from "@/components/Card";
import { shortlistedSubmissionColumns } from "@/features/contracts-grants/components/table-columns/sub-grant/shortlisted";
import DataTable from "@/components/Table/DataTable";
import TableFilters from "@/components/Table/TableFilters";
import { ISubGrantSingleData } from "@/features/contracts-grants/types/contract-management/sub-grant/sub-grant";
import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { useGetAllSubGrantManualSub } from "@/features/contracts-grants/controllers/submissionController";
import { useGetAllAssessments } from "@/features/contracts-grants/controllers/preAwardAssessmentController";

export default function ShortlistedSubmissionsList({}: ISubGrantSingleData) {
    const [page, setPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");

    const { id: subGrantId } = useParams();

    const { data, isFetching } = useGetAllSubGrantManualSub(
        subGrantId
            ? {
                  sub_grant: subGrantId as string,
                  page,
                  size: 100,
                  search: searchQuery,
              }
            : skipToken
    );

    const { data: assessmentsData, isFetching: assessmentsFetching } = useGetAllAssessments({
        page: 1,
        size: 100,
        enabled: !!subGrantId,
    });

    // Filter only shortlisted submissions and enrich with assessment data
    const shortlistedSubmissions = useMemo(() => {
        const submissions = data?.data.results?.filter(
            (submission: any) => submission.status === "SHORTLISTED" || submission.is_shortlisted
        ) || [];

        const assessments = assessmentsData?.data?.results || [];

        // Enrich submissions with assessment data
        return submissions.map((submission: any) => {
            const assessment = assessments.find(
                (a: any) => a.submission === submission.id || a.submission?.id === submission.id
            );

            return {
                ...submission,
                has_assessment: !!assessment && assessment.status === "COMPLETED",
                assessment_score: assessment?.total_score || null,
            };
        });
    }, [data, assessmentsData]);

    return (
        <Card>
            <TableFilters onSearchChange={(e) => setSearchQuery(e.target.value)}>
                <DataTable
                    columns={shortlistedSubmissionColumns}
                    data={shortlistedSubmissions}
                    isLoading={isFetching || assessmentsFetching}
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
