import BackNavigation from "atoms/BackNavigation";
import AddSquareIcon from "components/icons/AddSquareIcon";
import { userColumns } from "components/Table/columns/users";
import DataTable from "components/Table/DataTable";
import TableFilters from "components/Table/TableFilters";
import { Button } from "components/ui/button";
import { RouteEnum } from "constants/RouterConstants";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useGetAllUsersQuery } from "services/auth/user";

export default function UserTablePage() {
  const [page, setPage] = useState(1);

  const { data: user, isFetching } = useGetAllUsersQuery(
    { page, size: 10 },
    { refetchOnMountOrArgChange: true }
  );

  return (
    <div>
      <div className='flex items-center justify-between'>
        <BackNavigation extraText='Users' />
        <Link to={RouteEnum.CREATE_USERS}>
          <Button className='gap-x-2' size='sm'>
            <AddSquareIcon />
            Add User
          </Button>
        </Link>
      </div>
      <div>
        <TableFilters>
          <DataTable
            columns={userColumns}
            data={user?.data.results || []}
            isLoading={isFetching}
            pagination={{
              total: user?.data.pagination.count ?? 0,
              pageSize: user?.data.pagination.page_size ?? 0,
              onChange: (page: number) => setPage(page),
            }}
          />
        </TableFilters>
      </div>
    </div>
  );
}
