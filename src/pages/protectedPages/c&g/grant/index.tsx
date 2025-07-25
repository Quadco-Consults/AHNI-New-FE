import DataTable from "components/Table/DataTable";
import { Button } from "components/ui/button";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { grantColumns } from "components/Table/columns/c&g/grant/grant";
import TableFilters from "components/Table/TableFilters";
import { CG_ROUTES } from "constants/RouterConstants";
import { useState } from "react";
import Card from "components/shared/Card";
import { useDebounce } from "ahooks";
// import { useGetAllGrantsQuery } from "services/c&g/grant/grant";
import { useGetAllProjectsQuery } from "services/project";

export default function GrantHomePage() {
  const [page, setPage] = useState(1);

  const [searchQuery, setSearchQuery] = useState("");

  const debouncedSearchQuery = useDebounce(searchQuery, {
    wait: 500,
  });

  //   const { data, isFetching } = useGetAllGrantsQuery({
  //     page,
  //     size: 10,
  //     search: debouncedSearchQuery,
  //   });

  const { data: project, isFetching: fetchingProject } = useGetAllProjectsQuery(
    {
      page,
      size: 10,
      search: debouncedSearchQuery,
    }
  );

  return (
    <section className='space-y-5'>
      <div className='flex justify-end'>
        <Link to={CG_ROUTES.GRANT_CREATE}>
          <Button>
            <Plus size={20} /> New Grant
          </Button>
        </Link>
      </div>
      <Card>
        <TableFilters onSearchChange={(e) => setSearchQuery(e.target.value)}>
          <DataTable
            //   @ts-ignore
            columns={grantColumns}
            data={project?.data.results || []}
            isLoading={fetchingProject}
            pagination={{
              total: project?.data.pagination.count ?? 0,
              pageSize: project?.data.pagination.page_size ?? 0,
              onChange: (page: number) => setPage(page),
            }}
          />
        </TableFilters>
      </Card>
    </section>
  );
}
