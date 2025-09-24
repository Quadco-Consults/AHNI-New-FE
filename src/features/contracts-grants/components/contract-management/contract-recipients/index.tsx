"use client";

import { useState } from "react";
import Card from "components/Card";
import { contractRecipientsColumns } from "@/features/contracts-grants/components/table-columns/contract-management/contract-recipients";
import DataTable from "components/Table/DataTable";
import TableFilters from "components/Table/TableFilters";
import { useGetAllConsultancyApplicants } from "@/features/contracts-grants/controllers/consultancyApplicantsController";

export default function ContractRecipients() {
    const [page, setPage] = useState(1);

    const { data, isFetching, error } = useGetAllConsultancyApplicants({
        page,
        size: 10,
        // Temporarily remove status filter to see all data
    });

    console.log("ContractRecipients List - Data:", data);
    console.log("ContractRecipients List - Error:", error);

    const results = data?.data?.results || [];
    const paginator = data?.data?.pagination;

    // Debug: Show status values in console and UI
    console.log("All applicant statuses:", results.map(r => ({
        id: r.id,
        name: r.name,
        status: r.status
    })));


    return (
        <section className="space-y-10">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Contract Recipients (Debug Mode)</h1>
                    <p className="text-gray-600 mt-1">
                        Showing all applicants to debug status values
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                        {results.length} Total Applicants
                    </div>
                </div>
            </div>

            {/* Debug Section */}
            {results.length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h3 className="font-medium text-yellow-800 mb-3">🔍 Debug: Current Applicant Statuses</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                        {results.map(applicant => (
                            <div key={applicant.id} className="bg-white p-3 rounded border">
                                <div className="font-medium text-sm text-gray-900 mb-1">
                                    {applicant.name || 'No Name'}
                                </div>
                                <div className="text-xs text-gray-600 mb-2">
                                    ID: {applicant.id}
                                </div>
                                <span className="inline-block bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs font-mono">
                                    {applicant.status || 'No Status'}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {results.length === 0 && !isFetching && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
                    <h3 className="font-medium text-gray-700 mb-2">No Applicants Found</h3>
                    <p className="text-gray-500 text-sm">
                        Either there are no applicants in the system, or there's an API issue.
                    </p>
                    <p className="text-gray-500 text-sm mt-1">
                        Check the browser console for error details.
                    </p>
                </div>
            )}

            <Card>
                <TableFilters>
                    <DataTable
                        columns={contractRecipientsColumns}
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