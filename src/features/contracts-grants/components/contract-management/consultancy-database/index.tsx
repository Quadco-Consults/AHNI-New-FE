"use client";

import Card from "components/Card";
import { consultantDatabaseColumns } from "@/features/contracts-grants/components/table-columns/contract-management/consultant-database";
import DataTable from "components/Table/DataTable";
import TableFilters from "components/Table/TableFilters";
import { useState } from "react";
import { useGetAllConsultancyApplicants } from "@/features/contracts-grants/controllers/consultancyApplicantsController";
import { Badge } from "components/ui/badge";

export default function ConsultancyDatabase() {
    const [page, setPage] = useState(1);

    // Fetch all applicants
    const { data, isLoading } = useGetAllConsultancyApplicants({
        page,
        size: 1000,
    });

    const allResults = data?.data?.results || [];

    // Filter for consultants who have accepted their contracts
    const acceptedConsultants = allResults.filter(applicant => {
        // Must have accepted the offer
        if (!applicant.offer_accepted) return false;

        // Must be CONSULTANT type only
        return applicant.type === "CONSULTANT";
    });

    const results = acceptedConsultants;
    const paginator = data?.data?.pagination;

    return (
        <section className="space-y-6">
            {/* Header with Stats */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">AHNi Consultant Database</h1>
                    <p className="text-gray-600 mt-2">
                        All consultants who have accepted their contracts and are actively engaged
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Badge variant="outline" className="text-lg px-4 py-2 bg-purple-50 border-purple-200">
                        <span className="font-bold text-purple-700">{results.length}</span>
                        <span className="text-purple-600 ml-2">Active Consultants</span>
                    </Badge>
                </div>
            </div>

            {/* Data Table */}
            <Card>
                <TableFilters>
                    <DataTable
                        columns={consultantDatabaseColumns as any}
                        data={results}
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
