"use client";

import BackNavigation from "@/components/BackNavigation";
import Card from "@/components/Card";
import { agreementColumns } from "@/features/contracts-grants/components/table-columns/contract-management/agreement";
import DataTable from "@/components/Table/DataTable";
import TableFilters from "@/components/Table/TableFilters";
import { Button } from "@/components/ui/button";
import { CG_ROUTES } from "@/constants/RouterConstants";
import { Plus } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useGetAllAgreements } from "@/features/contracts-grants/controllers/agreementController";

export default function Agreement() {
    const [page, setPage] = useState(1);

    const { data, isFetching, error } = useGetAllAgreements({ page, size: 10 });

    // Debug logging
    console.log('📋 Agreements Data:', {
        data,
        isFetching,
        error,
        results: data?.data?.results,
        resultsLength: data?.data?.results?.length,
        pagination: data?.data?.pagination
    });

    // Handle error state
    if (error) {
        return (
            <section>
                <div className="flex items-center justify-between">
                    <BackNavigation extraText="Agreements" />
                    <Link href={CG_ROUTES.CREATE_AGREEMENT}>
                        <Button>
                            <Plus size={20} />
                            Create Agreement
                        </Button>
                    </Link>
                </div>
                <Card className="p-6">
                    <div className="text-center">
                        <p className="text-red-600 mb-4">Error loading agreements:</p>
                        <p className="text-gray-600">{error.message}</p>
                        <Button
                            onClick={() => window.location.reload()}
                            className="mt-4"
                            variant="outline"
                        >
                            Try Again
                        </Button>
                    </div>
                </Card>
            </section>
        );
    }

    return (
        <section>
            <div className="flex items-center justify-between">
                <BackNavigation extraText="Agreements" />
                <Link href={CG_ROUTES.CREATE_AGREEMENT}>
                    <Button>
                        <Plus size={20} />
                        Create Agreement
                    </Button>
                </Link>
            </div>
            <Card>
                <TableFilters>
                    <DataTable
                        columns={agreementColumns}
                        data={data?.data?.results || []}
                        isLoading={isFetching}
                        pagination={{
                            total: data?.data?.paginator?.count ?? 0,
                            pageSize: data?.data?.paginator?.page_size ?? 0,
                            onChange: (page: number) => setPage(page),
                        }}
                    />
                </TableFilters>
            </Card>
        </section>
    );
}
