"use client";

import Card from "components/Card";
import { consultantDatabaseColumns } from "@/features/contracts-grants/components/table-columns/contract-management/consultant-database";
import DataTable from "components/Table/DataTable";
import TableFilters from "components/Table/TableFilters";
import { useState } from "react";
import { useGetAllAdhocApplicants } from "@/features/programs/controllers/adhocApplicantController";
import { Badge } from "components/ui/badge";

export default function AdhocDatabase() {
    const [page, setPage] = useState(1);

    // Fetch all hired adhoc staff from dedicated adhoc endpoint
    const { data, isLoading } = useGetAllAdhocApplicants({
        page,
        size: 1000,
        status: "HIRED",  // Only hired staff appear in database
        enabled: true,
    });

    const allResults = data?.data?.results || [];

    // Debug: Log first applicant to see what fields are available
    if (allResults.length > 0) {
        console.log("Sample adhoc staff data:", allResults[0]);
    }

    // No need to filter - already filtered by status=HIRED in query
    const acceptedApplicants = allResults;

    // Map adhoc applicant data to match database table structure
    const results = acceptedApplicants.map(applicant => {
        return {
            id: applicant.id,
            // Adhoc applicant fields (already in correct structure)
            sur_name: applicant.surname,
            other_names: applicant.other_names,
            gender: applicant.gender || null,
            state_of_origin: applicant.state_of_origin || null,
            designation: applicant.designation,
            phone_number: applicant.phone_number,
            email_address: applicant.email,
            qualifications: applicant.qualification,
            health_facility: applicant.health_facility || null,
            spoke_site_name: applicant.spoke_site_name || null,
            lga: applicant.lga || null,
            status_of_adhoc_staff: applicant.status === 'HIRED' ? 'Active' : 'Pending',
            qmap_backstop: applicant.qmap_backstop || null,
            programs_officer: applicant.programs_officer || null,
            stl: applicant.stl || null,
            seo: applicant.seo || null,
            lga2: applicant.lga2 || null,
            cluster: applicant.cluster || null,
            account_name: applicant.account_name || null,
            bank_name: applicant.bank_name || null,
            account_number: applicant.account_number || null,
            sort_code: applicant.sort_code || null,
            // Keep original applicant data for reference
            _originalData: applicant
        };
    });

    const paginator = data?.data?.pagination;

    return (
        <section className="space-y-6">
            {/* Header with Stats */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">AHNi Adhoc Staff Database</h1>
                    <p className="text-gray-600 mt-2">
                        All adhoc staff who have accepted their contracts and are actively engaged
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Badge className="bg-green-600 text-white px-4 py-2 text-lg">
                        {results.length} Active Staff
                    </Badge>
                </div>
            </div>

            {/* Info Banner */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                    <div className="bg-blue-500 text-white p-2 rounded-lg">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="font-semibold text-blue-900 mb-1">About This Database</h3>
                        <p className="text-sm text-blue-800">
                            This database shows adhoc staff who have completed the contract acceptance process.
                            You can view their details, edit information, and manage their assignments.
                        </p>
                    </div>
                </div>
            </div>

            {/* Data Table */}
            <Card>
                <TableFilters>
                    <DataTable
                        columns={consultantDatabaseColumns as any}
                        data={results as any}
                        isLoading={isLoading}
                        pagination={{
                            total: results.length,
                            pageSize: 100,
                            onChange: setPage,
                        }}
                    />
                </TableFilters>
            </Card>
        </section>
    );
}