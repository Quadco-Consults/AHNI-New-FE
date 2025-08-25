"use client";

import { useDebounce } from "ahooks";
import AddSquareIcon from "components/icons/AddSquareIcon";
import Card from "components/Card";
import { LoadingSpinner } from "components/Loading";
import { subGrantAwardColumns } from "@/features/contracts-grants/components/table-columns/sub-grant/awards";
import DataTable from "components/Table/DataTable";
import TableFilters from "components/Table/TableFilters";
import { Button } from "components/ui/button";
import { CG_ROUTES } from "constants/RouterConstants";
import { useState } from "react";
import Link from "next/link";
import { useGetAllSubGrants } from "@/features/contracts-grants/controllers/subGrantController";
import ConsultantCard from "../../contract-management/consultant-management/ConsultantCard";
import SubgrantAdvertCard from "./SubGrantAdvertCard";

export default function SubGrant() {
    const [page, setPage] = useState(1);

    const [searchQuery, setSearchQuery] = useState("");

    const debouncedSearchQuery = useDebounce(searchQuery, {
        wait: 500,
    });

    const { data, isFetching } = useGetAllSubGrants({
        page,
        size: 10,
        search: debouncedSearchQuery,
    });

    return (
        <section className="space-y-5">
            <div className="flex justify-end">
                <Link href={CG_ROUTES.CREATE_SUBGRANT_ADVERT}>
                    <Button>
                        <AddSquareIcon />
                        New Sub Grant
                    </Button>
                </Link>
            </div>

            {isFetching ? (
                <LoadingSpinner />
            ) : (
                data && (
                    <div className="w-full flex flex-wrap justify-between items-start gap-y-[1rem]">
                        {data.data.results.map((subGrant) => (
                            <SubgrantAdvertCard
                                key={subGrant.id}
                                {...subGrant}
                            />
                        ))}
                    </div>
                )
            )}
        </section>
    );
}
