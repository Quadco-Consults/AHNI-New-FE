"use client";

import { useDebounce } from "ahooks";
import AddSquareIcon from "components/icons/AddSquareIcon";
import { LoadingSpinner } from "components/Loading";
import { Button } from "components/ui/button";
import { CG_ROUTES } from "constants/RouterConstants";
import { useState } from "react";
import Link from "next/link";
import { useGetAllSubGrants } from "@/features/contracts-grants/controllers/subGrantController";
import SubgrantAdvertCard from "../awards/SubGrantAdvertCard";

export default function SubGrantAdvert() {
    const [page, setPage] = useState(1);

    const [searchQuery, setSearchQuery] = useState("");

    const debouncedSearchQuery = useDebounce(searchQuery, {
        wait: 500,
    });

    const { data, isFetching, error } = useGetAllSubGrants({
        page,
        size: 10,
        search: debouncedSearchQuery,
    });

    // Debug logging
    console.log("📊 SubGrant API Response:", data);
    console.log("🚨 SubGrant Error:", error);
    console.log("⏳ SubGrant Loading:", isFetching);
    console.log("📝 SubGrant Results:", data?.data?.results);
    console.log("🔢 SubGrant Results Length:", data?.data?.results?.length || 0);

    if (data?.data?.results && data.data.results.length > 0) {
        console.log("✅ Backend SubGrant IDs found:", data.data.results.map(sg => sg.id));
    }

    return (
        <section className="space-y-5">
            <div className="flex justify-end">
                <Link href={CG_ROUTES.CREATE_SUBGRANT_ADVERT || "/dashboard/c-and-g/sub-grant/create-sub-grant"}>
                    <Button>
                        <AddSquareIcon />
                        New Sub Grant
                    </Button>
                </Link>
            </div>

            {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-800 font-medium">Error loading sub-grant data:</p>
                    <p className="text-red-600 text-sm mt-1">{error.message}</p>
                    {error.message.includes("Backend calculation error") && (
                        <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
                            <p className="text-yellow-800 text-xs font-medium">Technical Note:</p>
                            <p className="text-yellow-700 text-xs">This is a backend server issue. Please contact the development team.</p>
                        </div>
                    )}
                </div>
            )}

            {isFetching ? (
                <LoadingSpinner />
            ) : (
                <div className="w-full flex flex-wrap justify-between items-start gap-y-[1rem]">
                    {/* Use real API data from backend - mock fallback is now handled in the controller */}
                    {data?.data?.results && data.data.results.length > 0 ? (
                        data.data.results.map((subGrant) => (
                            <SubgrantAdvertCard
                                key={subGrant.id}
                                {...subGrant}
                            />
                        ))
                    ) : (
                        <div className="w-full text-center py-12 text-gray-500">
                            <p className="text-lg">No sub-grants available</p>
                            <p className="text-sm mt-2">Create a new sub-grant to get started</p>
                            {error && (
                                <p className="text-xs text-red-500 mt-2">
                                    API Error: {error.message}
                                </p>
                            )}
                        </div>
                    )}
                </div>
            )}
        </section>
    );
}
