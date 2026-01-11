"use client";

import Card from "@/components/Card";
import { adhocDatabaseColumns } from "@/features/programs/components/table-columns/adhoc-database";
import DataTable from "@/components/Table/DataTable";
import TableFilters from "@/components/Table/TableFilters";
import { useState } from "react";
import { useGetAllAdhocApplicants } from "@/features/programs/controllers/adhocApplicantController";
import { Badge } from "@/components/ui/badge";

export default function AdhocDatabase() {
    const [page, setPage] = useState(1);

    // Fetch all adhoc applicants and filter for accepted contracts
    // Using applicants endpoint since staff database endpoint doesn't exist yet
    const { data, isLoading } = useGetAllAdhocApplicants({
        page: 1,
        size: 1000,
    });

    const allApplicants = data?.data?.results || [];

    // Filter for staff who have accepted their contracts
    const allResults = allApplicants.filter((applicant: any) =>
        applicant.status === "APPROVED" && applicant.offer_accepted === true
    );

    console.log("🔍 Adhoc Database Data:", {
        total: allResults.length,
        isLoading,
        allApplicants: allApplicants.length,
        acceptedStaff: allResults.length,
        statuses: allApplicants.map((a: any) => a.status),
    });

    // Debug: Log first applicant to see available fields
    if (allResults.length > 0) {
        console.log("📋 Sample Applicant Data:", {
            fullData: allResults[0],
            email: allResults[0]?.email_address,
            position: allResults[0]?.advertisement,
            qualifications: allResults[0]?.qualifications,
            healthFacility: allResults[0]?.assigned_health_facility,
            preferredFacility: allResults[0]?.preferred_health_facility,
        });
    }

    return (
        <section className="space-y-6">
            {/* Header with Stats */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">AHNI Adhoc Staff Database</h1>
                    <p className="text-gray-600 mt-2">
                        All adhoc staff who have accepted their contracts and are actively engaged
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Badge className="bg-green-600 text-white px-4 py-2 text-lg">
                        {allResults.length} Active Staff
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
                        columns={adhocDatabaseColumns}
                        data={allResults}
                        isLoading={isLoading}
                        pagination={{
                            total: allResults.length,
                            pageSize: 1000,
                            onChange: setPage,
                        }}
                    />
                </TableFilters>
            </Card>
        </section>
    );
}