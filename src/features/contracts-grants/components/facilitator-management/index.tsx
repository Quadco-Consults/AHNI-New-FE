"use client";

import { Button } from "components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useGetAllFacilitators } from "@/features/contracts-grants/controllers/facilitatorManagementController";
import { LoadingSpinner } from "components/Loading";
import Pagination from "components/Pagination";
import FacilitatorCard from "./FacilitatorCard";

export default function FacilitatorManagement() {
    const [page, setPage] = useState(1);

    const { data, isFetching, error } = useGetAllFacilitators({
        page,
        size: 10,
    });

    return (
        <section className="space-y-5">
            <div className="flex justify-end">
                <Link href="/dashboard/c-and-g/facilitator-management/create/application-details">
                    <Button>
                        <Plus size={29} /> New Facilitator
                    </Button>
                </Link>
            </div>

            {isFetching ? (
                <LoadingSpinner />
            ) : error ? (
                <div className="text-center py-8 text-red-500">
                    <p>Error loading data: {error.message}</p>
                </div>
            ) : data?.data?.results?.length > 0 ? (
                <div className="w-full flex flex-wrap justify-between items-start gap-y-[1rem]">
                    {data.data.results.map((facilitator) => (
                        <FacilitatorCard key={facilitator.id} {...facilitator} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-8 text-gray-500">
                    <p>No facilitators found.</p>
                    <p className="text-sm mt-2">Try creating a new facilitator to get started.</p>
                </div>
            )}

            {data?.data?.pagination && (
                <Pagination
                    total={data.data.pagination.count}
                    itemsPerPage={data.data.pagination.page_size}
                    onChange={(page) => setPage(page)}
                />
            )}
        </section>
    );
}