import DataTable from "components/Table/DataTable";
import TableFilters from "components/Table/TableFilters";
import { assestRequestColum } from "components/Table/columns/admin/inventory-management/asset-request";
import AddSquareIcon from "components/icons/AddSquareIcon";
import Card from "components/shared/Card";
import { Button } from "components/ui/button";
import { AdminRoutes } from "constants/RouterConstants";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useGetAllAssetRequestsQuery } from "services/admin/inventory-management/asset-request";

export default function AssestRequestTable() {
    const [page, setPage] = useState(1);

    const { data: assetRequest, isFetching } = useGetAllAssetRequestsQuery({
        page,
        size: 10,
    });

    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <Link to={AdminRoutes.ASSETS_REQUEST_CREATE}>
                    <Button>
                        <AddSquareIcon /> Asset Request
                    </Button>
                </Link>
            </div>
            <Card className="space-y-6">
                <TableFilters>
                    <DataTable
                        columns={assestRequestColum}
                        data={assetRequest?.data.results || []}
                        isLoading={isFetching}
                        pagination={{
                            total: assetRequest?.data.pagination.count ?? 0,
                            pageSize:
                                assetRequest?.data.pagination.page_size ?? 0,
                            onChange: (page: number) => setPage(page),
                        }}
                    />
                </TableFilters>
            </Card>
        </div>
    );
}
