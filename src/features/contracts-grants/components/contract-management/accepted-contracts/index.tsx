"use client";

import { useState } from "react";
import Card from "components/Card";
import { acceptedContractsColumns } from "@/features/contracts-grants/components/table-columns/contract-management/accepted-contracts";
import DataTable from "components/Table/DataTable";
import TableFilters from "components/Table/TableFilters";
import { useGetAllConsultancyApplicants } from "@/features/contracts-grants/controllers/consultancyApplicantsController";

export default function AcceptedContracts() {
    const [page, setPage] = useState(1);

    const { data, isFetching, error } = useGetAllConsultancyApplicants({
        page,
        size: 10,
        status: "ACCEPTED", // Show applicants who have accepted contracts
    });

    console.log("AcceptedContracts List - Data:", data);
    console.log("AcceptedContracts List - Error:", error);

    const results = data?.data?.results || [];
    const paginator = data?.data?.pagination;

    // Debug: Show status values in console
    console.log("Accepted contract statuses:", results.map(r => ({
        id: r.id,
        name: r.name,
        status: r.status
    })));

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