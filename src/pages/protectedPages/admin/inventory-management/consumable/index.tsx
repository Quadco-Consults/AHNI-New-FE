import { useState } from "react";
import Card from "components/shared/Card";
import { Button } from "components/ui/button";
import { Plus } from "lucide-react";
import { Link, generatePath } from "react-router-dom";
import { AdminRoutes } from "constants/RouterConstants";
import DataTable from "components/Table/DataTable";
import { consumableColums } from "components/Table/columns/admin/inventory-management/consumables";
import TableFilters from "components/Table/TableFilters";
import { useGetAllItemsQuery } from "services/modules/config/item";

export default function ConsumablesHomePage() {
  const [page, setPage] = useState(1);

  const { data: item, isFetching } = useGetAllItemsQuery({
    page,
    size: 20,
    category: "b3fb7e09-deb2-4feb-b6d6-66595747350a",
  });

  return (
    <div className='space-y-10'>
      <Card className='space-y-10'>
        <div className='space-y-5'>
          <div className='flex justify-end'>
            <Link to={generatePath(AdminRoutes.CREATE_CONSUMABLE)}>
              <Button>
                <Plus size={20} />
                Add Consumable
              </Button>
            </Link>
          </div>
        </div>
        <TableFilters>
          <DataTable
            data={item?.data.results || []}
            isLoading={isFetching}
            // @ts-ignore
            columns={consumableColums}
            pagination={{
              total: item?.data.pagination.count ?? 0,
              pageSize: item?.data.pagination.page_size ?? 0,
              onChange: (page: number) => setPage(page),
            }}
          />
        </TableFilters>
      </Card>
    </div>
  );
}
