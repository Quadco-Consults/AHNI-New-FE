import BackNavigation from "components/atoms/BackNavigation";
import AddSquareIcon from "components/icons/AddSquareIcon";
import { userColumns } from "components/Table/columns/users";
import DataTable from "components/Table/DataTable";
import TableFilters from "components/Table/TableFilters";
import { Button } from "components/ui/button";
import { RouteEnum } from "constants/RouterConstants";
import { useState } from "react";
import Link from "next/link";
import { useGetAllUsers } from "../../controllers/userController";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
import useDebounce from "utils/useDebounce";

export default function UserTablePage() {
  const [page, setPage] = useState(1);
  const [tabParams, setTabParams] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const { data: user, isLoading: isFetching } = useGetAllUsers({
    page,
    size: 10,
    search: debouncedSearchQuery,
    user_type: tabParams,
  });

  return (
    <div>
      <div className='flex items-center justify-between'>
        <BackNavigation extraText='Users' />
        <Link href={`/dashboard${RouteEnum.CREATE_USERS}`}>
          <Button className='gap-x-2' size='sm'>
            <AddSquareIcon />
            Add User
          </Button>
        </Link>
      </div>
      <div>
        <div className='col-span-3'>
          <Tabs defaultValue=''>
            <TabsList className='border-b !py-0 rounded-none border-[#E4E7EC] w-full justify-start '>
              <TabsTrigger
                className='rounded-none data-[state=active]:bg-transparent data-[state=active]:text-[#FF0000] data-[state=active]:border-b data-[state=active]:border-[#FF0000]'
                value=''
                onClick={() => {
                  setPage(1);
                  setSearchQuery("");
                  setTabParams("");
                }}
              >
                All users
              </TabsTrigger>
              <TabsTrigger
                className='rounded-none data-[state=active]:bg-transparent data-[state=active]:text-[#FF0000] data-[state=active]:border-b data-[state=active]:border-[#FF0000]'
                value='AHNi'
                onClick={() => {
                  setPage(1);
                  setSearchQuery("");
                  setTabParams("AHNI_STAFF");
                }}
              >
                AHNi users
              </TabsTrigger>

              <TabsTrigger
                className='rounded-none data-[state=active]:bg-transparent data-[state=active]:text-[#FF0000] data-[state=active]:border-b data-[state=active]:border-[#FF0000]'
                value='Adhoc'
                onClick={() => {
                  setPage(1);
                  setSearchQuery("");
                  setTabParams("ADHOC_STAFF");
                }}
              >
                Adhoc users
              </TabsTrigger>

              <TabsTrigger
                className='rounded-none data-[state=active]:bg-transparent data-[state=active]:text-[#FF0000] data-[state=active]:border-b data-[state=active]:border-[#FF0000]'
                value='Consultants'
                onClick={() => {
                  setPage(1);
                  setSearchQuery("");
                  setTabParams("CONSULTANT");
                }}
              >
                Consultants
              </TabsTrigger>
              <TabsTrigger
                className='rounded-none data-[state=active]:bg-transparent data-[state=active]:text-[#FF0000] data-[state=active]:border-b data-[state=active]:border-[#FF0000]'
                value='Facilitators'
                onClick={() => {
                  setPage(1);
                  setSearchQuery("");
                  setTabParams("FACILITATOR");
                }}
              >
                Facilitators
              </TabsTrigger>
              <TabsTrigger
                className='rounded-none data-[state=active]:bg-transparent data-[state=active]:text-[#FF0000] data-[state=active]:border-b data-[state=active]:border-[#FF0000]'
                value='Vendors'
                onClick={() => {
                  setPage(1);
                  setSearchQuery("");
                  setTabParams("VENDOR");
                }}
              >
                Vendors
              </TabsTrigger>
              <TabsTrigger
                className='rounded-none data-[state=active]:bg-transparent data-[state=active]:text-[#FF0000] data-[state=active]:border-b data-[state=active]:border-[#FF0000]'
                value='Admin'
                onClick={() => {
                  setPage(1);
                  setSearchQuery("");
                  setTabParams("ADMIN");
                }}
              >
                Admin
              </TabsTrigger>
            </TabsList>
            <TabsContent className='w-full py-10' value=''>
              <TableFilters
                onSearchChange={(e) => setSearchQuery(e.target.value)}
              >
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
              <TableFilters
                onSearchChange={(e) => setSearchQuery(e.target.value)}
              >
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
              <TableFilters
                onSearchChange={(e) => setSearchQuery(e.target.value)}
              >
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
              <TableFilters
                onSearchChange={(e) => setSearchQuery(e.target.value)}
              >
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
              <TableFilters
                onSearchChange={(e) => setSearchQuery(e.target.value)}
              >
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
              <TableFilters
                onSearchChange={(e) => setSearchQuery(e.target.value)}
              >
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
            <TabsContent className='w-full py-10' value='Admin'>
              <TableFilters
                onSearchChange={(e) => setSearchQuery(e.target.value)}
              >
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
