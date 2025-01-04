import { useState } from "react";
import Card from "components/shared/Card";
import { Button } from "components/ui/button";
import { FileDown, Plus } from "lucide-react";
import { Link, generatePath } from "react-router-dom";
import { AdminRoutes } from "constants/RouterConstants";
import DataTable from "components/Table/DataTable";
import { consumableColums } from "components/Table/columns/admin/inventory-management/consumables";
import TableFilters from "components/Table/TableFilters";
import { UploadFileSvg } from "assets/svgs/CAndGSvgs";
import { useGetAllConsumablesQuery } from "services/admin/inventory-management/consumable";

export default function ConsumablesHomePage() {
    const [page, setPage] = useState(1);

    const { data: consumable, isFetching } = useGetAllConsumablesQuery({
        page,
        size: 10,
    });

    return (
        <div className="space-y-10">
            <Card className="space-y-10">
                <div className="space-y-5">
                    <div className="flex justify-end">
                        <Link to={generatePath(AdminRoutes.CREATE_CONSUMABLE)}>
                            <Button>
                                <Plus size={20} />
                                Add Consumable
                            </Button>
                        </Link>
                    </div>

                    {/* <div className="flex gap-x-4 justify-end">
                        <Button variant="outline">
                            <span>
                                <UploadFileSvg />
                            </span>
                            Upload
                        </Button>
                        <Button variant="custom">
                            <span>
                                <FileDown size={18} />
                            </span>
                            Download
                        </Button>
                    </div> */}
                </div>
                <TableFilters>
                    <DataTable
                        data={consumable?.data.results || []}
                        isLoading={isFetching}
                        columns={consumableColums}
                        pagination={{
                            total: consumable?.data.pagination.count ?? 0,
                            pageSize:
                                consumable?.data.pagination.page_size ?? 0,
                            onChange: (page: number) => setPage(page),
                        }}
                    />
                </TableFilters>
            </Card>
        </div>
    );
}
