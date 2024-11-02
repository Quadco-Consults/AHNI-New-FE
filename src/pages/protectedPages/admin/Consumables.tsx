import { FC, useMemo } from "react";
import Card from "components/shared/Card";
import { Button } from "components/ui/button";
import { FileDown, Plus } from "lucide-react";
import { Link, generatePath } from "react-router-dom";
import { AdminRoutes } from "constants/RouterConstants";
import DataTable from "components/Table/DataTable";
import { consumableColums } from "components/Table/columns/consumables";
import TableFilters from "components/Table/TableFilters";
import { useGetConsumablesQuery } from "services/adminApi/consumables";
import { UploadFileSvg } from "assets/svgs/CAndGSvgs";

const Consumables: FC = () => {
  const { data, isLoading } = useGetConsumablesQuery({
    page: 1,
    page_size: 20,
  });

  const drivedData = useMemo(() => {
    return (
      data?.results.map((item) => {
        return {
          ...item,
          // @ts-ignore
          item: item.item.name,
        };
      }) || []
    );
  }, [data?.results]);

  return (
    <div className="space-y-10">
      <Card className="space-y-10">
        <div className="space-y-5">
          <div className="flex justify-end">
            <Link to={generatePath(AdminRoutes.CREateConsumables)}>
              <Button>
                <span>
                  <Plus size={20} />
                </span>
                Add Item
              </Button>
            </Link>
          </div>
          <div className="flex gap-x-4 justify-end">
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
          </div>
        </div>
        <TableFilters>
          <DataTable
            data={drivedData}
            isLoading={isLoading}
            columns={consumableColums}
          />
        </TableFilters>
      </Card>
    </div>
  );
};

export default Consumables;
