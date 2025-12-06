"use client";

import { useDebounce } from "ahooks";
import Card from "components/Card";
import { awardedBeneficiariesColumn } from "@/features/contracts-grants/components/table-columns/sub-grant/awarded-beneficiaries";
import DataTable from "components/Table/DataTable";
import TableFilters from "components/Table/TableFilters";
import { useState, useEffect } from "react";
import { useGetAllSubGrants } from "@/features/contracts-grants/controllers/subGrantController";
import { useGetAllSubGrantSubmissions } from "@/features/contracts-grants/controllers/submissionController";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { getMockBeneficiaries, getMockAwardedSubGrants } from "@/utils/mockCGData";

export default function AwardedBeneficiaries() {
    const [page, setPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [enrichedData, setEnrichedData] = useState<any[]>([]);
    const [isEnriching, setIsEnriching] = useState(false);

    const debouncedSearchQuery = useDebounce(searchQuery, {
        wait: 500,
    });

    // Fetch awarded sub-grants
    const { data: subGrantsData, isFetching } = useGetAllSubGrants({
        page,
        size: 10,
        search: debouncedSearchQuery,
        status: "AWARDED",
    });

    // Fetch all submissions to map beneficiary data
    const { data: submissionsData } = useGetAllSubGrantSubmissions({
        page: 1,
        size: 1000,
    });

    // Enrich sub-grants with award/submission data
    useEffect(() => {
        const enrichSubGrants = async () => {
            const subGrants = subGrantsData?.data?.results || [];

            // If no real data, use mock beneficiaries data
            if (subGrants.length === 0) {
                console.log("No real sub-grants data, using mock beneficiaries");
                const mockBeneficiaries = getMockBeneficiaries();
                setEnrichedData(mockBeneficiaries);
                setIsEnriching(false);
                return;
            }

            setIsEnriching(true);

            try {
                // Fetch award details for each sub-grant to get submission info
                const enrichedPromises = subGrants.map(async (sg: any) => {
                    try {
                        console.log(`Fetching award for sub-grant: ${sg.id} (${sg.title})`);

                        // Use the existing axios helper to fetch awards for this sub-grant
                        const response = await AxiosWithToken.get(
                            `/contract-grants/sub-grants/${sg.id}/awards/`
                        );

                        console.log(`Award response for ${sg.title}:`, response.data);

                        if (response.data) {
                            // The response structure is { status, message, data: [...awards] }
                            const awards = response.data?.data || [];

                            // Get the highest ranked award (rank 1) or first award
                            const topAward = awards.find((a: any) => a.rank === 1) || awards[0];

                            console.log(`Top award for ${sg.title}:`, topAward);
                            console.log(`Submission data:`, topAward?.submission);

                            // Get submission data from the award
                            const submissionData = topAward?.submission;

                            return {
                                ...sg,
                                sub_grant: sg,
                                award: topAward,
                                submission: submissionData,
                                // Extract beneficiary info from submission
                                organisation_name: submissionData?.organisation_name || "N/A",
                                address: submissionData?.address || "N/A",
                                email: submissionData?.email || "N/A",
                                phone_number: submissionData?.phone_number || "N/A",
                            };
                        }
                    } catch (error) {
                        console.error(`Error fetching award for sub-grant ${sg.id} (${sg.title}):`, error);
                    }

                    // Return sub-grant data even if award fetch fails
                    return {
                        ...sg,
                        sub_grant: sg,
                    };
                });

                const enriched = await Promise.all(enrichedPromises);
                setEnrichedData(enriched);
            } catch (error) {
                console.error('Error enriching sub-grants:', error);
                // Fallback to mock data if enrichment fails
                console.log("Enrichment failed, using mock beneficiaries");
                const mockBeneficiaries = getMockBeneficiaries();
                setEnrichedData(mockBeneficiaries);
            } finally {
                setIsEnriching(false);
            }
        };

        enrichSubGrants();
    }, [subGrantsData]);

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
                        data={enrichedData}
                        isLoading={isFetching || isEnriching}
                        pagination={{
                            total: subGrantsData?.data?.paginator?.count ?? 0,
                            pageSize: subGrantsData?.data?.paginator?.page_size ?? 10,
                            onChange: (page: number) => setPage(page),
                        }}
                    />
                </TableFilters>
            </Card>
        </section>
    );
}
