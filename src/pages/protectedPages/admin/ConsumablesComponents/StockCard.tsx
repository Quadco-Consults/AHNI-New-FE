import { stockColumns } from "components/Table/columns/consumables";
import DataTable from "components/Table/DataTable";
import TableFilters from "components/Table/TableFilters";
import { Card, CardContent } from "components/ui/card";
import { useSearchParams } from "react-router-dom";
import { useGetStockCardQuery } from "services/adminApi/consumables";

const StockCard = () => {
  const [searchParams] = useSearchParams();

  const id = searchParams.get("id") || "";

  const { data } = useGetStockCardQuery({ consumable: id });

  return (
    <div>
      <Card>
        <CardContent className="py-5">
          <TableFilters>
            <DataTable columns={stockColumns} data={data?.results || []} />
          </TableFilters>
        </CardContent>
      </Card>
    </div>
  );
};

export default StockCard;
