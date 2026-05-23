"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import Card from "@/components/Card";
import DataTable from "@/components/Table/DataTable";
import TableFilters from "@/components/Table/TableFilters";
import { Badge } from "@/components/ui/badge";
import { useGetAllFacilitatorApplicants } from "@/features/contracts-grants/controllers/facilitatorApplicantsController";
import { facilitatorDatabaseColumns } from "@/features/contracts-grants/components/table-columns/contract-management/facilitator-database";

export default function FacilitatorManagement() {
  const [page, setPage] = useState(1);

  // Fetch all facilitator applicants (no status filter - show all)
  const { data, isLoading } = useGetAllFacilitatorApplicants({
    page,
    size: 100,
    enabled: true,
  });

  const results = data?.data?.results || [];

  return (
    <section className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Facilitator Management</h1>
          <p className="text-gray-600 mt-2">
            Manage all facilitators in the system
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
        <TableFilters>
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