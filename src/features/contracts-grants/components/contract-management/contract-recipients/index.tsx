"use client";

import { useState, useMemo } from "react";
import Card from "components/Card";
import { contractRecipientsColumns } from "@/features/contracts-grants/components/table-columns/contract-management/contract-recipients";
import DataTable from "components/Table/DataTable";
import TableFilters from "components/Table/TableFilters";
import { useGetAllConsultancyApplicants } from "@/features/contracts-grants/controllers/consultancyApplicantsController";
import { useGetAllAdhocApplicants } from "@/features/programs/controllers/adhocApplicantController";

export default function ContractRecipients() {
    const [page, setPage] = useState(1);

    // Fetch from BOTH endpoints to check which one has data
    const { data: consultancyData, isFetching: isFetchingConsultancy } = useGetAllConsultancyApplicants({
        page,
        size: 50,
    });

    const { data: adhocData, isFetching: isFetchingAdhoc } = useGetAllAdhocApplicants({
        page,
        size: 50,
    });

    // Determine which endpoint to use based on data availability
    const { data, isFetching, sourceEndpoint } = useMemo(() => {
        const consultancyResults = consultancyData?.data?.results || [];
        const adhocResults = adhocData?.data?.results || [];

        // Filter consultancy results for ADHOC type with contracts
        const consultancyAdhocWithContracts = consultancyResults.filter((applicant: any) =>
            applicant.type === "ADHOC" &&
            (applicant.status === "CONTRACT_ISSUED" ||
             applicant.status === "APPROVED" ||
             applicant.status === "ACCEPTED" ||
             applicant.status === "REJECTED")
        );

        // Filter adhoc results for contracts
        const adhocWithContracts = adhocResults.filter((applicant: any) =>
            applicant.status === "CONTRACT_ISSUED" ||
            applicant.status === "APPROVED" ||
            applicant.status === "ACCEPTED" ||
            applicant.status === "REJECTED"
        );

        console.log("🔍 Dual Endpoint Check:");
        console.log("- Consultancy endpoint (/contract-grants/consultancy/applicants/):", {
            total: consultancyResults.length,
            adhocWithContracts: consultancyAdhocWithContracts.length,
        });
        console.log("- Adhoc endpoint (/programs/adhoc/applicants/):", {
            total: adhocResults.length,
            withContracts: adhocWithContracts.length,
        });

        // Prefer dedicated adhoc endpoint if it has data
        if (adhocWithContracts.length > 0) {
            console.log("✅ Using dedicated adhoc endpoint (backend separated!)");
            return {
                data: adhocData,
                isFetching: isFetchingAdhoc,
                sourceEndpoint: "/programs/adhoc/applicants/",
            };
        } else if (consultancyAdhocWithContracts.length > 0) {
            console.log("⚠️ Using consultancy endpoint with type filter (backend not yet separated)");
            return {
                data: consultancyData,
                isFetching: isFetchingConsultancy,
                sourceEndpoint: "/contract-grants/consultancy/applicants/ (type=ADHOC)",
            };
        } else {
            console.log("ℹ️ No contract recipients found in either endpoint");
            return {
                data: adhocData,
                isFetching: isFetchingAdhoc || isFetchingConsultancy,
                sourceEndpoint: "/programs/adhoc/applicants/ (preferred)",
            };
        }
    }, [consultancyData, adhocData, isFetchingConsultancy, isFetchingAdhoc]);

    // Filter to show ONLY adhoc applicants who have been issued contracts
    const allApplicants = data?.data?.results || [];
    const contractRecipients = allApplicants.filter((applicant: any) => {
        // If using consultancy endpoint, filter by type = ADHOC
        if (sourceEndpoint.includes("consultancy")) {
            if (applicant.type !== "ADHOC") {
                return false;
            }
        }

        // Check if applicant has contract_issued status
        const hasContractIssued = applicant.status === "CONTRACT_ISSUED" ||
                                  applicant.status === "APPROVED" ||
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

    if (contractRecipients.length > 0) {
        console.log("✅ Sample Contract Recipient (FULL OBJECT):", contractRecipients[0]);
        console.log("📋 Field Names Available:", Object.keys(contractRecipients[0]));
        console.log("📋 Name Fields:", {
            sur_name: (contractRecipients[0] as any).sur_name,
            surname: (contractRecipients[0] as any).surname,
            other_names: (contractRecipients[0] as any).other_names,
            full_name: (contractRecipients[0] as any).full_name,
            first_name: (contractRecipients[0] as any).first_name,
            last_name: (contractRecipients[0] as any).last_name,
        });
        console.log("📋 Email Fields:", {
            email_address: (contractRecipients[0] as any).email_address,
            email: (contractRecipients[0] as any).email,
        });
        console.log("📋 Position Fields:", {
            advertisement: (contractRecipients[0] as any).advertisement,
            consultancy: (contractRecipients[0] as any).consultancy,
            contract_request: (contractRecipients[0] as any).contract_request,
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
                    <p className="text-xs text-gray-500 mt-1">
                        Data source: <code className="bg-gray-100 px-1 py-0.5 rounded">{sourceEndpoint}</code>
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    {sourceEndpoint.includes("consultancy") && (
                        <div className="bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full text-xs font-medium">
                            Legacy Mode
                        </div>
                    )}
                    {sourceEndpoint.includes("programs/adhoc") && contractRecipients.length > 0 && (
                        <div className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                            ✅ Separated Tables
                        </div>
                    )}
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