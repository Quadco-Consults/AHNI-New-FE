"use client";

import { useState } from "react";
import Card from "@/components/Card";
import { acceptedContractsColumns } from "@/features/contracts-grants/components/table-columns/contract-management/accepted-contracts";
import DataTable from "@/components/Table/DataTable";
import TableFilters from "@/components/Table/TableFilters";
import { useGetAllAdhocApplicants } from "@/features/programs/controllers/adhocApplicantController";

export default function AcceptedContracts() {
    const [page, setPage] = useState(1);

    // Using dedicated adhoc applicants endpoint
    const { data, isFetching, error } = useGetAllAdhocApplicants({
        page,
        size: 1000, // Get all to filter on frontend
    });

    const allResults = data?.data?.results || [];

    // Frontend filter to ensure only ACCEPTED contracts show
    const results = allResults.filter(applicant => {
        // Check if applicant has ACCEPTED status
        const hasAcceptedStatus = applicant.status === "ACCEPTED" ||
                                  applicant.offer_accepted === true;

        return hasAcceptedStatus;
    });
    const paginator = data?.data?.paginator;

    // Debug logging
    console.log("🔍 Adhoc Accepted Contracts Debug:");
    console.log("- Total Applicants Fetched:", allResults.length);
    console.log("- Accepted Contracts (Filtered):", results.length);
    console.log("- Is Fetching:", isFetching);
    console.log("- Error:", error);
    console.log("- All Applicants (status):", allResults.map((a: any) => ({
        name: a.full_name || a.surname || a.other_names,
        status: a.status,
        offer_accepted: a.offer_accepted,
    })));
    console.log("- Unique Statuses:", [...new Set(allResults.map((a: any) => a.status))]);
    if (results.length > 0) {
        console.log("- Sample accepted applicant:", {
            id: results[0].id,
            name: (results[0] as any).full_name,
            status: results[0].status,
            offer_accepted: (results[0] as any).offer_accepted,
        });
    }

    return (
        <section className="space-y-10">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Accepted Contracts</h1>
                    <p className="text-gray-600 mt-1">
                        Adhoc staff who have accepted their contracts and are now active
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                        {results.length} Active Contracts
                    </div>
                </div>
            </div>

            {/* Debug Section */}
            {results.length > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="font-medium text-green-800 mb-3">✅ Accepted Contracts</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                        {results.map(applicant => (
                            <div key={applicant.id} className="bg-white p-3 rounded border">
                                <div className="font-medium text-sm text-gray-900 mb-1">
                                    {applicant.name || 'No Name'}
                                </div>
                                <div className="text-xs text-gray-600 mb-2">
                                    Position: {applicant.position_under_contract || 'N/A'}
                                </div>
                                <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                                    {applicant.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {results.length === 0 && !isFetching && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <div>
                            <h4 className="font-medium text-gray-700">No Accepted Contracts</h4>
                            <p className="text-sm text-gray-500 mt-1">
                                Contracts will appear here after applicants accept them
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <Card>
                <TableFilters>
                    <DataTable
                        columns={acceptedContractsColumns}
                        data={results}
                        isLoading={isFetching}
                        pagination={{
                            total: paginator?.count || 0,
                            pageSize: paginator?.page_size || 10,
                            onChange: setPage,
                        }}
                    />
                </TableFilters>
            </Card>
        </section>
    );
}