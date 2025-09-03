"use client";

import { useDebounce } from "ahooks";
import AddSquareIcon from "components/icons/AddSquareIcon";
import { LoadingSpinner } from "components/Loading";
import { Button } from "components/ui/button";
import { CG_ROUTES } from "constants/RouterConstants";
import { useState } from "react";
import Link from "next/link";
import { useGetAllSubGrants } from "@/features/contracts-grants/controllers/subGrantController";
import SubgrantAdvertCard from "../awards/SubGrantAdvertCard";

export default function SubGrantAdvert() {
    const [page, setPage] = useState(1);

    const [searchQuery, setSearchQuery] = useState("");

    const debouncedSearchQuery = useDebounce(searchQuery, {
        wait: 500,
    });

    const { data, isFetching, error } = useGetAllSubGrants({
        page,
        size: 10,
        search: debouncedSearchQuery,
    });

    // Debug logging
    console.log("SubGrant API Response:", data);
    console.log("SubGrant Error:", error);
    console.log("SubGrant Loading:", isFetching);
    console.log("SubGrant Results:", data?.data?.results);
    console.log("SubGrant Results Length:", data?.data?.results?.length || 0);

    // Temporary mock data for display
    const mockData = {
        data: {
            results: [
                {
                    id: "1",
                    grant_ref_no: "GRT-2024-001",
                    project: "Community Development Initiative",
                    sub_grant_administrator: "John Doe",
                    technical_staff: "Jane Smith",
                    evaluation_applicants: [],
                    created_datetime: "2024-01-10T10:30:00Z",
                    updated_datetime: "2024-01-15T10:30:00Z",
                    title: "Community Development Grant",
                    award_type: "Fixed Amount",
                    business_unit: "Community Development",
                    amount_usd: "250000",
                    amount_ngn: "400000000",
                    start_date: "2024-01-15",
                    end_date: "2024-12-31",
                    submission_start_date: "2024-01-01",
                    submission_end_date: "2024-01-10",
                    tender_type: "Open",
                    assessment_date: "2024-01-12",
                    created_by: "admin",
                    updated_by: "admin",
                    grant: "grant-1"
                },
                {
                    id: "2",
                    grant_ref_no: "GRT-2024-002", 
                    project: "Education Enhancement Program",
                    sub_grant_administrator: "Alice Johnson",
                    technical_staff: "Bob Wilson",
                    evaluation_applicants: [],
                    created_datetime: "2024-01-20T14:15:00Z",
                    updated_datetime: "2024-02-01T14:15:00Z",
                    title: "Education Enhancement Program",
                    award_type: "Cost Reimbursement",
                    business_unit: "Education",
                    amount_usd: "180000",
                    amount_ngn: "288000000",
                    start_date: "2024-02-01",
                    end_date: "2025-01-31",
                    submission_start_date: "2024-01-15",
                    submission_end_date: "2024-01-25",
                    tender_type: "Restricted",
                    assessment_date: "2024-01-28",
                    created_by: "admin",
                    updated_by: "admin",
                    grant: "grant-2"
                }
            ],
            paginator: {
                count: 2,
                page_size: 10,
                page: 1,
                total_pages: 1
            }
        }
    };

    return (
        <section className="space-y-5">
            <div className="flex justify-end">
                <Link href={CG_ROUTES.CREATE_SUBGRANT_ADVERT || "/dashboard/c-and-g/sub-grant/create-sub-grant"}>
                    <Button>
                        <AddSquareIcon />
                        New Sub Grant
                    </Button>
                </Link>
            </div>

            {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-800 font-medium">Error loading sub-grant data:</p>
                    <p className="text-red-600 text-sm mt-1">{error.message}</p>
                    {error.message.includes("Backend calculation error") && (
                        <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
                            <p className="text-yellow-800 text-xs font-medium">Technical Note:</p>
                            <p className="text-yellow-700 text-xs">This is a backend server issue. Please contact the development team.</p>
                        </div>
                    )}
                </div>
            )}

            {isFetching ? (
                <LoadingSpinner />
            ) : (
                <div className="w-full flex flex-wrap justify-between items-start gap-y-[1rem]">
                    {(data?.data?.results || mockData?.data?.results || []).map((subGrant) => (
                        <SubgrantAdvertCard
                            key={subGrant.id}
                            {...subGrant}
                        />
                    ))}
                    {(!data?.data?.results || data.data.results.length === 0) && !isFetching && (
                        <div className="w-full text-center py-12 text-gray-500">
                            <p className="text-lg">No sub-grants available</p>
                            <p className="text-sm mt-2">Create a new sub-grant to get started</p>
                        </div>
                    )}
                </div>
            )}
        </section>
    );
}
