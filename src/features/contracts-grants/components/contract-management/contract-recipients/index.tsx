"use client";

import { useState } from "react";
import Card from "components/Card";
import { contractRecipientsColumns } from "@/features/contracts-grants/components/table-columns/contract-management/contract-recipients";
import DataTable from "components/Table/DataTable";
import TableFilters from "components/Table/TableFilters";
import { useGetAllAdhocApplicants } from "@/features/programs/controllers/adhocApplicantController";

export default function ContractRecipients() {
    const [page, setPage] = useState(1);

    // Using dedicated adhoc applicants endpoint
    const { data, isFetching, error } = useGetAllAdhocApplicants({
        page,
        size: 50,
    });

    // Filter to show ONLY applicants who have been issued contracts
    const allApplicants = data?.data?.results || [];
    const contractRecipients = allApplicants.filter((applicant: any) => {
        // Check if applicant has contract_issued status
        // According to the workflow: APPLIED → SHORTLISTED → INTERVIEWED → CONTRACT_ISSUED → ACCEPTED/REJECTED
        const hasContractIssued = applicant.status === "CONTRACT_ISSUED" ||
                                  applicant.status === "ACCEPTED" ||
                                  applicant.status === "REJECTED" ||
                                  applicant.contract_issued === true ||
                                  applicant.has_contract === true;

        return hasContractIssued;
    });
    const paginator = data?.data?.paginator;

    console.log("🔍 Adhoc Contract Recipients Debug:");
    console.log("- Total Applicants Fetched:", allApplicants.length);
    console.log("- Contract Recipients (Filtered):", contractRecipients.length);
    console.log("- Is Fetching:", isFetching);
    console.log("- Error:", error);
    console.log("- All Applicants (status):", allApplicants.map((a: any) => ({
        name: a.surname || a.other_names || a.full_name,
        status: a.status,
    })));
    console.log("- Unique Statuses:", [...new Set(allApplicants.map((a: any) => a.status))]);
    if (contractRecipients.length > 0) {
        console.log("- Sample recipient:", {
            name: (contractRecipients[0] as any).surname || (contractRecipients[0] as any).full_name,
            status: contractRecipients[0].status,
        });
    }

    return (
        <section className="space-y-10">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Adhoc Contract Recipients</h1>
                    <p className="text-gray-600 mt-1">
                        Adhoc staff who have been issued contracts or have accepted contracts
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