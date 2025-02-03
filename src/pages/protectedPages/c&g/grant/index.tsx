import DataTable from "components/Table/DataTable";
import { Button } from "components/ui/button";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { grantColumns } from "components/Table/columns/c&g/grant/grant";
import TableFilters from "components/Table/TableFilters";
import { CG_GROUTES } from "constants/RouterConstants";
import { useGetAllGrantsQuery } from "services/c&g/grant";
import { useState } from "react";
import Card from "components/shared/Card";
import { useDebounce } from "ahooks";

export default function GrantHomePage() {
    const [page, setPage] = useState(1);

    const [searchQuery, setSearchQuery] = useState("");

    const debouncedSearchQuery = useDebounce(searchQuery, {
        wait: 500,
    });

    const { data, isFetching } = useGetAllGrantsQuery({
        page,
        size: 10,
        search: debouncedSearchQuery,
    });

    return (
        <section className="space-y-5">
            <div className="flex justify-end">
                <Link to={CG_GROUTES.GRANT_CREATE}>
                    <Button>
                        <Plus size={20} /> New Grant
                    </Button>
                </Link>
            </div>
            <Card>
                <TableFilters
                    onSearchChange={(e) => setSearchQuery(e.target.value)}
                >
                    <DataTable
                        columns={grantColumns}
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
