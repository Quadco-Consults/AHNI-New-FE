import DataTable from "components/Table/DataTable";
import TableFilters from "components/Table/TableFilters";
import {
  maintenanceColumns,
  maintenanceData,
} from "components/Table/columns/facilities";
import { AdminRoutes } from "constants/RouterConstants";
import { useNavigate } from "react-router-dom";

const Facilties = () => {
  const navigate = useNavigate();
  const onRowClick = () => {
    navigate(AdminRoutes.FacilitiesView);
  };
  return (
    <div>
      <TableFilters>
        <DataTable
          onRowClick={onRowClick}
          data={maintenanceData}
          columns={maintenanceColumns}
        />
      </TableFilters>
    </div>
  );
};

export default Facilties;
