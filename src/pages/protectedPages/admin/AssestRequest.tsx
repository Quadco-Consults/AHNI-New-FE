import DataTable from "components/Table/DataTable";
import TableFilters from "components/Table/TableFilters";
import { assestRequestColum } from "components/Table/columns/assest";
import { useMemo } from "react";

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
    <div>
      <div className="flex justify-between">
        <div></div>
      </div>
      <div className="mt-10 space-y-6">
        <TableFilters>
          <DataTable columns={assestRequestColum} data={drivedData} />
        </TableFilters>
      </div>
    </div>
  );
};

export default AssestRequest;
