import BackNavigation from "atoms/BackNavigation";
import DataTable from "components/Table/DataTable";
import TableFilters from "components/Table/TableFilters";
import { columnsLease, dataLease } from "components/Table/columns/lease";
import { AdminRoutes } from "constants/RouterConstants";
import { useNavigate } from "react-router-dom";

const Lease = () => {
  const navigation = useNavigate();

  const onRowClick = () => {
    navigation(AdminRoutes.ViewAggrement);
  };
  return (
    <div>
      <BackNavigation extraText="Lease" />
      <TableFilters>
        <DataTable
          onRowClick={onRowClick}
          columns={columnsLease}
          data={dataLease}
        />
      </TableFilters>
    </div>
  );
};

export default Lease;
