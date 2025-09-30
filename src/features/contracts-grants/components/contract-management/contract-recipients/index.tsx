"use client";

import { useState } from "react";
import Card from "components/Card";
import { contractRecipientsColumns } from "@/features/contracts-grants/components/table-columns/contract-management/contract-recipients";
import DataTable from "components/Table/DataTable";
import TableFilters from "components/Table/TableFilters";
import { useGetAllConsultancyApplicants } from "@/features/contracts-grants/controllers/consultancyApplicantsController";

export default function ContractRecipients() {
    const [page, setPage] = useState(1);

    // Filter to show only CONTRACT_ISSUED applicants (those who have been issued contracts)
    const { data, isFetching, error } = useGetAllConsultancyApplicants({
        page,
        size: 50,
        status: "CONTRACT_ISSUED",
    });

    const contractRecipients = data?.data?.results || [];
    const paginator = data?.data?.pagination;

    console.log("🔍 Contract Recipients Debug:");
    console.log("- Data:", data);
    console.log("- Results Count:", contractRecipients.length);
    console.log("- Is Fetching:", isFetching);
    console.log("- Error:", error);
    if (contractRecipients.length > 0) {
        console.log("- First Applicant:", contractRecipients[0]);
        console.log("- Sample applicant data:", {
            name: contractRecipients[0].name || contractRecipients[0].first_name,
            status: contractRecipients[0].status,
            has_accepted: contractRecipients[0].has_accepted,
            contract_accepted_at: contractRecipients[0].contract_accepted_at,
        });
    }

    return (
        <section className="space-y-10">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Contract Recipients</h1>
                    <p className="text-gray-600 mt-1">
                        Candidates who have been issued contracts or have accepted contracts for adhoc positions
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                        {contractRecipients.length} Contract{contractRecipients.length !== 1 ? 's' : ''} Issued
                    </div>
                </div>
            </div>

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

            {contractRecipients.length > 0 && (
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