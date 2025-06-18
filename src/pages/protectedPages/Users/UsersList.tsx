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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";

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
        <div className='col-span-3'>
          <Tabs defaultValue='Admin Officer'>
            <TabsList className='border-b !py-0 rounded-none border-[#E4E7EC] w-full justify-start '>
              <TabsTrigger
                className='rounded-none data-[state=active]:bg-transparent data-[state=active]:text-[#FF0000] data-[state=active]:border-b data-[state=active]:border-[#FF0000]'
                value='All'
              >
                All
              </TabsTrigger>
              <TabsTrigger
                className='rounded-none data-[state=active]:bg-transparent data-[state=active]:text-[#FF0000] data-[state=active]:border-b data-[state=active]:border-[#FF0000]'
                value='Admin Officer'
              >
                Admin Officer
              </TabsTrigger>
              <TabsTrigger
                className='rounded-none data-[state=active]:bg-transparent data-[state=active]:text-[#FF0000] data-[state=active]:border-b data-[state=active]:border-[#FF0000]'
                value='Store Keeper'
              >
                Store Keeper
              </TabsTrigger>
            </TabsList>
            <TabsContent className='w-full py-10' value='All'>
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
            </TabsContent>
            <TabsContent className='w-full py-10' value='Admin Officer'>
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
            </TabsContent>
            <TabsContent className='w-full py-10' value='Store Keeper'>
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
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
