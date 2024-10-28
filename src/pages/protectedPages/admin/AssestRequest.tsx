import DataTable from "components/Table/DataTable";
import TableFilters from "components/Table/TableFilters";
import { assestRequestColum } from "components/Table/columns/assest";
import AddSquareIcon from "components/icons/AddSquareIcon";
import Card from "components/shared/Card";
import { Button } from "components/ui/button";
import { AdminRoutes } from "constants/RouterConstants";
import { useMemo } from "react";
import { Link } from "react-router-dom";

import { useGetAssetsRequestQuery } from "services/adminApi/assetsApi";

const AssestRequest = () => {
  const { data } = useGetAssetsRequestQuery({
    page: 1,
    page_size: 20,
  });

  const drivedData = useMemo(() => {
    return (
      data?.results.map((item) => {
        return {
          ...item,
          // @ts-ignore
          asset_condition: item.asset_condition.name,
        };
      }) || []
    );
  }, [data?.results]);

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
          <DataTable columns={assestRequestColum} data={drivedData} />
        </TableFilters>
      </Card>
    </div>
  );
};

export default AssestRequest;
