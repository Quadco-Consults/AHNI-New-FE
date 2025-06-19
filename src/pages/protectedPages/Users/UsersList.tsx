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
  const [tabParams, setTabParams] = useState("");

  const { data: user, isFetching } = useGetAllUsersQuery(
    // @ts-ignore
    { page, size: 10, user_type: tabParams },
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
          <Tabs defaultValue='All'>
            <TabsList className='border-b !py-0 rounded-none border-[#E4E7EC] w-full justify-start '>
              <TabsTrigger
                className='rounded-none data-[state=active]:bg-transparent data-[state=active]:text-[#FF0000] data-[state=active]:border-b data-[state=active]:border-[#FF0000]'
                value='All'
                onClick={() => setTabParams("")}
              >
                All users
              </TabsTrigger>
              <TabsTrigger
                className='rounded-none data-[state=active]:bg-transparent data-[state=active]:text-[#FF0000] data-[state=active]:border-b data-[state=active]:border-[#FF0000]'
                value='AHNi'
                onClick={() => setTabParams("AHNI_STAFF")}
              >
                AHNi users
              </TabsTrigger>

              <TabsTrigger
                className='rounded-none data-[state=active]:bg-transparent data-[state=active]:text-[#FF0000] data-[state=active]:border-b data-[state=active]:border-[#FF0000]'
                value='Adhoc'
                onClick={() => setTabParams("ADHOC_STAFF")}
              >
                Adhoc users
              </TabsTrigger>

              <TabsTrigger
                className='rounded-none data-[state=active]:bg-transparent data-[state=active]:text-[#FF0000] data-[state=active]:border-b data-[state=active]:border-[#FF0000]'
                value='Consultants'
                onClick={() => setTabParams("CONSULTANT")}
              >
                Consultants
              </TabsTrigger>
              <TabsTrigger
                className='rounded-none data-[state=active]:bg-transparent data-[state=active]:text-[#FF0000] data-[state=active]:border-b data-[state=active]:border-[#FF0000]'
                value='Facilitators'
                onClick={() => setTabParams("FACILITATOR")}
              >
                Facilitators
              </TabsTrigger>
              <TabsTrigger
                className='rounded-none data-[state=active]:bg-transparent data-[state=active]:text-[#FF0000] data-[state=active]:border-b data-[state=active]:border-[#FF0000]'
                value='Vendors'
                onClick={() => setTabParams("VENDOR")}
              >
                Vendors
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
            <TabsContent className='w-full py-10' value='AHNi'>
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
            <TabsContent className='w-full py-10' value='Adhoc'>
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
            <TabsContent className='w-full py-10' value='Consultants'>
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
            </TabsContent>{" "}
            <TabsContent className='w-full py-10' value='Facilitators'>
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
            </TabsContent>{" "}
            <TabsContent className='w-full py-10' value='Vendors'>
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
