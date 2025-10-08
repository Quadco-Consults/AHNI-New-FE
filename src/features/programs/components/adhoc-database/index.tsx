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

    // Debug: Check if updated fields are in API response
    if (allResults.length > 0) {
        console.log("🔍 First applicant from API:", allResults[0]);
        console.log("🔍 Key fields:", {
            gender: (allResults[0] as any).gender,
            state_of_origin: (allResults[0] as any).state_of_origin,
            account_name: (allResults[0] as any).account_name,
            qmap_backstop: (allResults[0] as any).qmap_backstop,
        });
    }

    // Map adhoc applicant data to match database table structure
    const results = allResults.map(applicant => {
        const app = applicant as any;
        return {
            id: app.id,
            // Map API response fields to table columns
            sur_name: app.surname || app.sur_name || null,
            other_names: app.other_names || null,
            gender: app.gender || null,
            state_of_origin: app.state_of_origin || null,
            designation: app.designation || null,
            phone_number: app.phone_number || null,
            email_address: app.email || app.email_address || null,
            qualifications: app.qualification || app.qualifications || null,
            health_facility: app.health_facility || null,
            spoke_site_name: app.spoke_site_name || null,
            lga: app.lga || null,
            status_of_adhoc_staff: app.status === 'HIRED' ? 'Active' : 'Pending',
            qmap_backstop: app.qmap_backstop || null,
            programs_officer: app.programs_officer || null,
            stl: app.stl || null,
            seo: app.seo || null,
            lga2: app.lga2 || null,
            cluster: app.cluster || null,
            account_name: app.account_name || null,
            bank_name: app.bank_name || null,
            account_number: app.account_number || null,
            sort_code: app.sort_code || null,
            // Keep original applicant data for reference
            _originalData: applicant
        };
    });

    const paginator = data?.data?.paginator;

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