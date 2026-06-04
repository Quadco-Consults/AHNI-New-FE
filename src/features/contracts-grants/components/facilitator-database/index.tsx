"use client";

import Card from "@/components/Card";
import { facilitatorDatabaseColumns } from "@/features/contracts-grants/components/table-columns/contract-management/facilitator-database";
import DataTable from "@/components/Table/DataTable";
import TableFilters from "@/components/Table/TableFilters";
import { useState } from "react";
import { useGetAllFacilitatorApplicants } from "@/features/contracts-grants/controllers/facilitatorApplicantsController";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function FacilitatorDatabase() {
    const [page, setPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");

    // Fetch all facilitator applicants (no status filter - show all)
    const { data, isLoading } = useGetAllFacilitatorApplicants({
        page,
        size: 1000,
        search: searchQuery,
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
                    <h1 className="text-3xl font-bold text-gray-900">Facilitator Database</h1>
                    <p className="text-gray-600 mt-2">
                        View and manage all facilitators in the system
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Badge variant="outline" className="text-lg px-4 py-2 bg-blue-50 border-blue-200">
                        <span className="font-bold text-blue-700">{results.length}</span>
                        <span className="text-blue-600 ml-2">Total Facilitators</span>
                    </Badge>
                    <Link href="/dashboard/c-and-g/facilitator-management/create">
                        <Button size="lg">
                            <Plus size={20} className="mr-2" />
                            Add Facilitator
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Data Table */}
            <Card>
                <TableFilters onSearchChange={(e) => setSearchQuery(e.target.value)}>
                    <DataTable
                        columns={facilitatorDatabaseColumns as any}
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