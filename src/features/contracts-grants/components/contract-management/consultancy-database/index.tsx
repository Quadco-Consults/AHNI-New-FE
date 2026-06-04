"use client";

import Card from "@/components/Card";
import { consultantDatabaseColumns } from "@/features/contracts-grants/components/table-columns/contract-management/consultant-database";
import DataTable from "@/components/Table/DataTable";
import TableFilters from "@/components/Table/TableFilters";
import { useState } from "react";
import { useGetAllConsultancyApplicants } from "@/features/contracts-grants/controllers/consultancyApplicantsController";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import AddConsultantModal from "./AddConsultantModal";

export default function ConsultancyDatabase() {
    const [page, setPage] = useState(1);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    // Fetch all applicants with enhanced filtering
    const { data, isLoading, error } = useGetAllConsultancyApplicants({
        page,
        size: 1000,
        offer_accepted: true, // Only fetch accepted consultants for better performance
        // type: "CONSULTANT" // This might not be supported by the API
    });

    const allResults = data?.data?.results || [];

    // Filter for consultants who have accepted their contracts
    const acceptedConsultants = allResults.filter(applicant => {
        // Must have accepted the offer (redundant if API filtering works, but safe fallback)
        if (!applicant.offer_accepted) return false;

        // Must be CONSULTANT type only
        return applicant.type === "CONSULTANT";
    });

    const results = acceptedConsultants;
    const paginator = data?.data?.pagination;

    // Log debug information in development
    if (process.env.NODE_ENV === 'development') {
        console.log('Consultancy Database:', {
            totalResults: allResults.length,
            acceptedConsultants: results.length,
            sampleConsultant: results[0]
        });
    }

    // Show error state if there's an error
    if (error) {
        return (
            <section className="space-y-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                    <h2 className="text-xl font-semibold text-red-800 mb-2">Error Loading Consultants</h2>
                    <p className="text-red-600">{error.message || "Failed to load consultancy database"}</p>
                </div>
            </section>
        );
    }

    return (
        <section className="space-y-6">
            {/* Header with Stats */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">AHNi Consultant Database</h1>
                    <p className="text-gray-600 mt-2">
                        All consultants who have accepted their contracts and are actively engaged
                    </p>
                    {isLoading && (
                        <p className="text-blue-600 text-sm mt-1">Loading consultant data...</p>
                    )}
                </div>
                <div className="flex items-center gap-3">
                    <Badge variant="outline" className="text-lg px-4 py-2 bg-purple-50 border-purple-200">
                        <span className="font-bold text-purple-700">
                            {isLoading ? "..." : results.length}
                        </span>
                        <span className="text-purple-600 ml-2">Active Consultants</span>
                    </Badge>
                    {!isLoading && allResults.length > results.length && (
                        <Badge variant="outline" className="text-sm px-3 py-1 bg-gray-50 border-gray-200">
                            <span className="text-gray-600">
                                {allResults.length - results.length} not accepted
                            </span>
                        </Badge>
                    )}
                    <Button size="lg" onClick={() => setIsAddModalOpen(true)}>
                        <PlusIcon className="h-4 w-4 mr-2" />
                        Add Consultant
                    </Button>
                </div>
            </div>

            {/* Data Table */}
            <Card>
                <TableFilters>
                    {!isLoading && results.length === 0 ? (
                        <div className="text-center py-12 px-6">
                            <div className="text-gray-400 text-6xl mb-4">👥</div>
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Active Consultants</h3>
                            <p className="text-gray-500 mb-4">
                                There are currently no consultants who have accepted their contracts.
                            </p>
                            {allResults.length > 0 && (
                                <p className="text-sm text-gray-400">
                                    {allResults.length} consultant(s) found, but none have accepted their contracts yet.
                                </p>
                            )}
                        </div>
                    ) : (
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
                    )}
                </TableFilters>
            </Card>

            {/* Add Consultant Modal */}
            <AddConsultantModal
                open={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
            />
        </section>
    );
}
