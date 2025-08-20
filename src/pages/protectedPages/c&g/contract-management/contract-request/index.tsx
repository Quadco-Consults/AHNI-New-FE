import Card from "components/shared/Card";
import { contractRequestColumns } from "components/Table/columns/c&g/contract-management/contract-request";
import DataTable from "components/Table/DataTable";
import TableFilters from "components/Table/TableFilters";
import { Button } from "components/ui/button";
import { CG_ROUTES } from "constants/RouterConstants";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useGetAllContractRequestsQuery } from "services/c&g/contract-management/contract";

export default function ContractRequest() {
  const [page, setPage] = useState(1);

  const { data, isFetching } = useGetAllContractRequestsQuery({
    page,
    size: 10,
  });

  return (
    <section className='space-y-10'>
      <div className='flex justify-end'>
        <Link to={CG_ROUTES.CREATE_CONTRACT_REQUEST}>
          <Button>
            <Plus size={20} />
            Create Contract Request
          </Button>
        </Link>
      </div>

      <Card>
        <TableFilters>
          <DataTable
            columns={contractRequestColumns}
            data={data?.data.results || []}
            isLoading={isFetching}
            pagination={{
              total: data?.data.pagination.count ?? 0,
              pageSize: data?.data.pagination.page_size ?? 0,
              onChange: (page: number) => setPage(page),
            }}
          />
        </TableFilters>
      </Card>
    </section>
  );
}
