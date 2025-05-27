import DataTable from "components/Table/DataTable";
import TableFilters from "components/Table/TableFilters";
import { useState } from "react";
import Card from "components/shared/Card";
import { subGrantAwardColumns } from "components/Table/columns/c&g/sub-grant/awards";
import { useGetAllSubGrantsQuery } from "services/c&g/subgrant/sub-grant";

export default function SubGrantAward() {
    const [page, setPage] = useState(1);

    const [searchQuery, setSearchQuery] = useState("");

    const { data, isFetching } = useGetAllSubGrantsQuery({
        page,
        size: 10,
    });

    return (
        <section className="space-y-5">
            <Card>
                <TableFilters
                    onSearchChange={(e) => setSearchQuery(e.target.value)}
                >
                    <DataTable
                        columns={subGrantAwardColumns}
                        data={data?.data.results || []}
                        isLoading={isFetching}
                        pagination={{
                            total: data?.data.pagination.count ?? 0,
                            pageSize: data?.data.pagination.page_size ?? 0,
                            onChange: (page: number) => setPage(page),
                        }}
                    />
                </TableFilters>
            </Card>
        </section>
    );
}
