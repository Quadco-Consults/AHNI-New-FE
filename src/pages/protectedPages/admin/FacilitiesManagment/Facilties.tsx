import { ColumnDef } from "@tanstack/react-table";
import DataTable from "components/Table/DataTable";
import TableFilters from "components/Table/TableFilters";
import { maintenanceColumns } from "components/Table/columns/facilities";
import { Button } from "components/ui/button";
import { AdminRoutes } from "constants/RouterConstants";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useGetFacilitiesQuery } from "services/adminApi/faciityMaintenance";

const Facilties = () => {
  const { data } = useGetFacilitiesQuery({});

  const drivedData = useMemo(() => {
    return (
      data?.results?.map((item) => {
        return {
          id: item.id,
          facility: item.facility.name,
          maintenance_type: item.maintenance_type,
          description_of_problem: item.description_of_problem,
          status: item.status,
        };
      }) || []
    );
  }, [data?.results]);

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button>
          <Link to={AdminRoutes.FacilitiesTicket}>
            Request Maintenance Ticket
          </Link>
        </Button>
      </div>
      <TableFilters>
        <DataTable
          data={drivedData}
          columns={
            maintenanceColumns as ColumnDef<(typeof drivedData)[number]>[]
          }
        />
      </TableFilters>
    </div>
  );
};

export default Facilties;
