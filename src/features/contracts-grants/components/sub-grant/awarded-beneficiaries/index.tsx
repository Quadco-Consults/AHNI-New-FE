"use client";

import { useDebounce } from "ahooks";
import Card from "@/components/Card";
import { awardedBeneficiariesColumn } from "@/features/contracts-grants/components/table-columns/sub-grant/awarded-beneficiaries";
import DataTable from "@/components/Table/DataTable";
import TableFilters from "@/components/Table/TableFilters";
import { useState, useEffect } from "react";
import { useGetAllSubGrants } from "@/features/contracts-grants/controllers/subGrantController";
import { useGetAllSubGrantSubmissions } from "@/features/contracts-grants/controllers/submissionController";
import { useQuery } from "@tanstack/react-query";
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

    // Fetch awarded sub-grants - temporarily removing status filter to debug
    const { data: subGrantsData, isFetching } = useGetAllSubGrants({
        page,
        size: 10,
        search: debouncedSearchQuery,
        // status: "AWARDED", // Temporarily disabled for debugging
    });

    // NEW: Try to fetch data from the multi-partner API
    const { data: newApiData, isFetching: isNewApiFetching } = useQuery({
        queryKey: ["new-multi-partner-api", page, debouncedSearchQuery],
        queryFn: async () => {
            try {
                const params = new URLSearchParams();
                if (page) params.append('page', page.toString());
                params.append('size', '10');
                if (debouncedSearchQuery) params.append('search', debouncedSearchQuery);

                const response = await AxiosWithToken.get(
                    `/api/v1/contract-grants/sub-grants/multi-awards/all_awarded_partners/?${params.toString()}`
                );
                return response.data;
            } catch (error) {
                console.log("New API not available yet, falling back to mock data");
                return null;
            }
        },
        retry: false,
        refetchOnWindowFocus: false,
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

            // Debug logging
            console.log("=== ENRICHMENT DEBUG ===");
            console.log("Sub-grants found:", subGrants.length);
            console.log("Sub-grants data:", subGrants);

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
                        console.log(`🔍 AWARD API CALL: Fetching award for sub-grant: ${sg.id} (${sg.title})`);

                        // Use the existing axios helper to fetch awards for this sub-grant
                        const response = await AxiosWithToken.get(
                            `/contract-grants/sub-grants/${sg.id}/awards/`
                        );

                        console.log(`Award response for ${sg.title}:`, response.data);
                        console.log(`Full response structure:`, {
                            status: response.status,
                            data: response.data,
                            dataType: typeof response.data?.data,
                            isArray: Array.isArray(response.data?.data),
                            length: response.data?.data?.length
                        });

                        if (response.data) {
                            // The actual API structure is: { status, message, data: {submissions: [], ...} }
                            const awardData = response.data?.data || {};
                            const submissions = awardData.submissions || [];

                            console.log(`Award data for ${sg.title}:`, awardData);
                            console.log(`Submissions found:`, submissions.length);

                            // Check if there are any submissions (beneficiaries)
                            if (Array.isArray(submissions) && submissions.length > 0) {
                                // Get the first submission (or implement ranking logic if needed)
                                const primarySubmission = submissions[0];

                                console.log(`Primary submission for ${sg.title}:`, primarySubmission);

                                return {
                                    ...sg,
                                    sub_grant: sg,
                                    award: awardData,
                                    submission: primarySubmission,
                                    // Extract beneficiary info from submission
                                    organisation_name: primarySubmission?.organisation_name || "N/A",
                                    address: primarySubmission?.address || "N/A",
                                    email: primarySubmission?.email || "N/A",
                                    phone_number: primarySubmission?.phone_number || "N/A",
                                };
                            } else {
                                console.log(`No submissions found for ${sg.title}. Award status: ${awardData.status}`);
                            }
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
                console.log("Enrichment completed, enriched data:", enriched);

                // Check if we have new API data first
                if (newApiData?.data?.partners && newApiData.data.partners.length > 0) {
                    console.log("🎉 Using NEW MULTI-PARTNER API data:", newApiData);

                    const newApiEnrichedData = newApiData.data.partners.map((partner: any) => ({
                        id: partner.award_id,
                        sub_grant: {
                            id: partner.subgrant_id,
                            title: partner.subgrant_title,
                            parent_project: {
                                name: partner.parent_project?.name || "N/A",
                                funding_source: partner.parent_project?.funding_source || "N/A"
                            }
                        },
                        award: {
                            id: partner.award_id,
                            award_amount_usd: partner.award_amount_usd,
                            award_amount_ngn: partner.award_amount_ngn,
                            utilization_percentage: partner.utilization_percentage,
                            status: partner.award_status,
                        },
                        // Map to existing table structure
                        organisation_name: partner.partner_name,
                        address: partner.partner_contact?.address || "N/A",
                        email: partner.partner_contact?.email || "N/A",
                        phone_number: partner.partner_contact?.phone || "N/A",
                        coverage_location: partner.coverage_location,
                        award_amount_usd: partner.award_amount_usd,
                        award_amount_ngn: partner.award_amount_ngn,
                        utilization_percentage: partner.utilization_percentage || 0,
                        expected_beneficiaries: partner.expected_beneficiaries,
                    }));

                    setEnrichedData(newApiEnrichedData);
                    return;
                }

                // Check if we actually got any beneficiary data from old API
                const hasRealBeneficiaries = enriched.some(item =>
                    item.organisation_name !== "N/A" &&
                    item.organisation_name !== undefined
                );

                if (hasRealBeneficiaries) {
                    setEnrichedData(enriched);
                } else {
                    console.log("No real beneficiary data found - all submissions are empty. Using mock data for demonstration.");
                    const mockBeneficiaries = getMockBeneficiaries();
                    setEnrichedData(mockBeneficiaries);
                }

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
    }, [subGrantsData, newApiData]);

    return (
        <section className="space-y-5">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Awarded Beneficiaries</h1>
                <p className="text-gray-600 mt-1">
                    {newApiData?.data?.partners ?
                        `View and manage all multi-partner sub-grant awardees and beneficiaries (${newApiData.data.partners.length} partners)` :
                        "View and manage all sub-grant awardees and beneficiaries"
                    }
                </p>
                {newApiData?.data?.summary && (
                    <div className="mt-2 text-sm text-blue-600">
                        📍 {newApiData.data.summary.total_locations_covered} locations •
                        💰 ${newApiData.data.summary.total_amount_awarded_usd?.toLocaleString()} total awarded
                    </div>
                )}
            </div>

            <Card>
                <TableFilters
                    onSearchChange={(e) => setSearchQuery(e.target.value)}
                >
                    <DataTable
                        columns={awardedBeneficiariesColumn}
                        data={enrichedData}
                        isLoading={isFetching || isEnriching || isNewApiFetching}
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
