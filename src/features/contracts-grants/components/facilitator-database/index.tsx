"use client";

import Card from "components/Card";
import { consultantDatabaseColumns } from "@/features/contracts-grants/components/table-columns/contract-management/consultant-database";
import DataTable from "components/Table/DataTable";
import TableFilters from "components/Table/TableFilters";
import { useState } from "react";
import { useGetAllFacilitatorApplicants } from "@/features/contracts-grants/controllers/facilitatorApplicantsController";
import { Badge } from "components/ui/badge";

export default function FacilitatorDatabase() {
    const [page, setPage] = useState(1);

    // Fetch all facilitator applicants with APPROVED status
    const { data, isLoading } = useGetAllFacilitatorApplicants({
        page,
        size: 1000,
        status: "APPROVED", // Only get approved facilitators
        enabled: true,
    });

    console.log("🔍 Facilitator Database Data:", {
        total: data?.data?.results?.length || 0,
        isLoading,
        data: data?.data?.results
    });

    const results = data?.data?.results || [];

    return (
        <section className="space-y-6">
            {/* Header with Stats */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">AHNI Facilitator Database</h1>
                    <p className="text-gray-600 mt-2">
                        All facilitators who have accepted their contracts and are actively engaged
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Badge variant="outline" className="text-lg px-4 py-2 bg-blue-50 border-blue-200">
                        <span className="font-bold text-blue-700">{results.length}</span>
                        <span className="text-blue-600 ml-2">Active Facilitators</span>
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