import { stockColumns } from "@/features/admin/components/table-columns/inventory-management/consumables";
import DataTable from "components/Table/DataTable";
import TableFilters from "components/Table/TableFilters";
import { Card, CardContent } from "components/ui/card";
import { Separator } from "components/ui/separator";

export default function ConsumableStockCard({ stockCard }: { stockCard: any }) {
  return (
    <div className='mt-6'>
      <Card>
        <CardContent className='py-5 space-y-6'>
          <h4 className='text-lg font-medium'>
            {stockCard?.data?.data?.results[0]?.item_detail?.name}
          </h4>
          <Separator />
          <TableFilters>
            <DataTable
              columns={stockColumns}
              data={stockCard?.data?.data?.results}
            />
          </TableFilters>
        </CardContent>
      </Card>
    </div>
  );
}
