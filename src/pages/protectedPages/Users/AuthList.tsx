import { permissionColums } from "components/Table/columns/users";
import DataTable from "components/Table/DataTable";
import TableFilters from "components/Table/TableFilters";
import { Permission } from "definations/users";
import { usePermissionsQuery } from "services/users";

const AuthList = () => {
  const { data, isLoading } = usePermissionsQuery({
    no_paginate: false,
  });

  return (
    <div className="mt-6">
      <TableFilters>
        <DataTable
          columns={permissionColums}
          data={(data?.results as Permission[]) || []}
          isLoading={isLoading}
        />
      </TableFilters>
    </div>
  );
};

export default AuthList;
