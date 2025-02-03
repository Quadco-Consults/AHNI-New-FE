import { useDebounce } from "ahooks";
import AddSquareIcon from "components/icons/AddSquareIcon";
import Card from "components/shared/Card";
import { subGrantAwardColumns } from "components/Table/columns/c&g/sub-grant/awards";
import DataTable from "components/Table/DataTable";
import TableFilters from "components/Table/TableFilters";
import { Button } from "components/ui/button";
import { CG_GROUTES } from "constants/RouterConstants";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useGetAllSubGrantsQuery } from "services/c&g/sub-grant";

export default function SubGrant() {
    const [page, setPage] = useState(1);

    const [searchQuery, setSearchQuery] = useState("");

    const debouncedSearchQuery = useDebounce(searchQuery, {
        wait: 500,
    });

    const { data, isFetching } = useGetAllSubGrantsQuery({
        page,
        size: 10,
        search: debouncedSearchQuery,
    });

    return (
        <section className="space-y-5">
            <div className="flex justify-end">
                <Link to={CG_GROUTES.CREATE_SUBGRANT_AWARD}>
                    <Button>
                        <AddSquareIcon />
                        New Sub Grant
                    </Button>
                </Link>
            </div>
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
