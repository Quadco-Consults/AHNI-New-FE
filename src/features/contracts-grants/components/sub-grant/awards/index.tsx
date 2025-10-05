"use client";

import { useDebounce } from "ahooks";
import Card from "components/Card";
import { subGrantAwardColumns } from "@/features/contracts-grants/components/table-columns/sub-grant/awards";
import DataTable from "components/Table/DataTable";
import TableFilters from "components/Table/TableFilters";
import { useState, useMemo } from "react";
import { useGetAllSubGrants } from "@/features/contracts-grants/controllers/subGrantController";

export default function SubGrantAwards() {
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

    // Filter only awarded sub-grants
    const awardedSubGrants = useMemo(() => {
        return data?.data?.results?.filter(
            (subGrant: any) => subGrant.status === "AWARDED"
        ) || [];
    }, [data]);

    return (
        <section className="space-y-5">
            <Card>
                <TableFilters onSearchChange={(e) => setSearchQuery(e.target.value)}>
                    <DataTable
                        columns={subGrantAwardColumns}
                        data={awardedSubGrants}
                        isLoading={isFetching}
                        pagination={{
                            total: data?.data?.paginator?.count ?? 0,
                            pageSize: data?.data?.paginator?.page_size ?? 10,
                            onChange: (page: number) => setPage(page),
                        }}
                    />
                </TableFilters>
            </Card>
        </section>
    );
}
