import BackNavigation from "atoms/BackNavigation";
import DataTable from "components/Table/DataTable";
import TableFilters from "components/Table/TableFilters";
import { columnsLease } from "components/Table/columns/lease";
import { Button } from "components/ui/button";
import { AdminRoutes } from "constants/RouterConstants";
import { useMemo } from "react";

import { Link, useNavigate } from "react-router-dom";
import { useGetAgreementsQuery } from "services/adminApi/agreements";

const Lease = () => {
  const navigation = useNavigate();

  const onRowClick = () => {
    navigation(AdminRoutes.ViewAggrement);
  };

  const { data } = useGetAgreementsQuery({
    page: 1,
    page_size: 20,
  });

  const drivedData = useMemo(() => {
    return data?.results || [];
  }, [data?.results]);

  return (
    <div>
      <BackNavigation extraText="Agreements" />
      <div className="flex justify-end my-6">
        <Button>
          <Link to={AdminRoutes.AgrementsCreeate}>Create Agreement</Link>
        </Button>
      </div>
      <TableFilters>
        <DataTable
          onRowClick={onRowClick}
          columns={columnsLease}
          data={drivedData}
        />
      </TableFilters>
    </div>
  );
};

export default Lease;
