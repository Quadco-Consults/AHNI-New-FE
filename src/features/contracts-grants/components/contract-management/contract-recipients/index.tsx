"use client";

import { useState } from "react";
import Card from "components/Card";
import { contractRecipientsColumns } from "@/features/contracts-grants/components/table-columns/contract-management/contract-recipients";
import DataTable from "components/Table/DataTable";
import TableFilters from "components/Table/TableFilters";
import { useGetAllConsultancyApplicants } from "@/features/contracts-grants/controllers/consultancyApplicantsController";

export default function ContractRecipients() {
    const [page, setPage] = useState(1);

    // First, let's call the API without status filter to see all available statuses
    const [showAllStatuses, setShowAllStatuses] = useState(true);

    const { data, isFetching, error } = useGetAllConsultancyApplicants({
        page,
        size: 50, // Get more results to see different statuses
        ...(showAllStatuses ? {} : { status: "APPLIED" }), // No status filter to see all
    });

    // Enhanced Debug logs for contract recipients
    console.log("🔍 ContractRecipients Debug:");
    console.log("- Show All Statuses:", showAllStatuses);
    console.log("- API URL:", `/contract-grants/consultancy/applicants/?page=${page}&size=50${showAllStatuses ? '' : '&status=APPLIED'}`);
    console.log("- Data:", data);
    console.log("- Error:", error);
    console.log("- Is Fetching:", isFetching);

    // Extract and show all unique statuses from the results
    if (data?.data?.results) {
        const allStatuses = [...new Set(data.data.results.map((r: any) => r.status))];
        console.log("🚨 ALL AVAILABLE STATUSES:", allStatuses);

        console.log("📊 STATUS BREAKDOWN:");
        allStatuses.forEach(status => {
            const count = data.data.results.filter((r: any) => r.status === status).length;
            console.log(`  - ${status}: ${count} applicants`);
        });
    }

    const contractRecipients = data?.data?.results || [];
    const paginator = data?.data?.pagination;

    // Check if we're getting the wrong data structure
    if (contractRecipients.length > 0) {
        console.log("🚨 CRITICAL: Checking data structure...");
        console.log("First item keys:", Object.keys(contractRecipients[0]));
        console.log("First item sample:", contractRecipients[0]);

        // Check if this looks like consultant management data instead of applicant data
        const firstItem = contractRecipients[0];
        if (firstItem.title || firstItem.commencement_date || firstItem.type) {
            console.log("❌ ERROR: Getting consultant management data instead of applicant data!");
            console.log("This appears to be job postings, not individual applicants");
        } else {
            console.log("✅ Correct applicant data structure");
        }
    }

    // Enhanced logging for contract recipients
    console.log("Contract Recipients:", contractRecipients.map(r => ({
        id: r.id,
        name: r.name || `${r.first_name || 'N/A'} ${r.last_name || 'N/A'}`,
        status: r.status,
        consultant_id: r.consultant_id || r.consultancy,
        email: r.email
    })));

    console.log("✅ CONTRACT_ISSUED Recipients Count:", contractRecipients.length);


    return (
        <section className="space-y-10">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Contract Recipients</h1>
                    <p className="text-gray-600 mt-1">
                        Candidates who have been issued contracts for adhoc positions
                    </p>
                    <p className="text-sm text-blue-600 mt-1">
                        {showAllStatuses ?
                            "Showing all applicants to identify available statuses" :
                            "Filtering by status"
                        }
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                        {contractRecipients.length} Contract{contractRecipients.length !== 1 ? 's' : ''} Issued
                    </div>
                </div>
            </div>

            {/* Status discovery interface */}
            {showAllStatuses && data?.data?.results && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <h3 className="font-medium text-blue-800 mb-2">Available Statuses Found</h3>
                            <p className="text-blue-700 text-sm mb-3">
                                Found {data.data.results.length} total applicants. Here are the available status values:
                            </p>
                            <div className="flex flex-wrap gap-2 mb-3">
                                {[...new Set(data.data.results.map((r: any) => r.status))].map((status: string) => {
                                    const count = data.data.results.filter((r: any) => r.status === status).length;
                                    return (
                                        <span
                                            key={status}
                                            className="px-3 py-1 bg-white border border-blue-200 rounded text-sm font-mono"
                                        >
                                            "{status}" ({count})
                                        </span>
                                    );
                                })}
                            </div>
                            <p className="text-blue-700 text-sm">
                                Check the browser console for detailed breakdown. Look for statuses that might represent "contract issued" candidates.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Show error message if we're getting wrong data structure */}
            {contractRecipients.length > 0 && (contractRecipients[0] as any).title && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="font-medium text-red-800 mb-2">API Configuration Issue</h3>
                            <p className="text-red-700 text-sm mb-2">
                                The API is returning consultant management data (job postings) instead of individual applicant data.
                            </p>
                            <p className="text-red-700 text-sm mb-3">
                                Expected: Individual applicants with status "CONTRACT_ISSUED"<br/>
                                Received: Consultant management entries (job postings)
                            </p>
                            <div className="bg-red-100 p-3 rounded text-xs font-mono text-red-800">
                                Current API: /contract-grants/consultancy/applicants/?status=CONTRACT_ISSUED<br/>
                                Actual Response: Consultant management data with fields like 'title', 'type', 'commencement_date'
                            </div>
                            <p className="text-red-700 text-sm mt-2">
                                Please check the backend API routing or contact the backend team to resolve this issue.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {contractRecipients.length === 0 && !isFetching && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="font-medium text-gray-700 mb-2">No Contract Recipients</h3>
                            <p className="text-gray-500 text-sm">
                                No contracts have been issued to candidates yet.
                            </p>
                            <p className="text-gray-500 text-sm mt-1">
                                Issue contracts to interviewed candidates from their respective adhoc management pages.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Only show table if we have correct applicant data structure */}
            {contractRecipients.length > 0 && !(contractRecipients[0] as any).title && (
                <Card>
                    <TableFilters>
                        <DataTable
                            columns={contractRecipientsColumns}
                            data={contractRecipients}
                            isLoading={isFetching}
                            pagination={{
                                total: paginator?.count || 0,
                                pageSize: paginator?.page_size || 10,
                                onChange: setPage,
                            }}
                        />
                    </TableFilters>
                </Card>
            )}
        </section>
    );
}