import { stockColumns } from "components/Table/columns/consumables";
import DataTable from "components/Table/DataTable";
import TableFilters from "components/Table/TableFilters";
import { Card, CardContent } from "components/ui/card";
import { Separator } from "components/ui/separator";
import { useSearchParams } from "react-router-dom";
import { useGetStockCardQuery } from "services/adminApi/consumables";

const StockCard = () => {
  const [searchParams] = useSearchParams();

  const id = searchParams.get("id") || "";

  const { data } = useGetStockCardQuery({ consumable: id });

  return (
    <div className="mt-6">
      <Card>
        <CardContent className="py-5 space-y-6">
          <h4 className="text-lg font-medium">Syringe</h4>
          <Separator />
          <TableFilters>
            <DataTable columns={stockColumns} data={data?.results || []} />
          </TableFilters>
        </CardContent>
      </Card>
    </div>
  );
};

export default StockCard;
