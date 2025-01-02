import BackNavigation from "atoms/BackNavigation";
import DataTable from "components/Table/DataTable";
import TableFilters from "components/Table/TableFilters";
import { columnsLease } from "components/Table/columns/lease";
import { useMemo } from "react";
import { useGetAgreementsQuery } from "services/admin/agreements";

const Lease = () => {
    const { data } = useGetAgreementsQuery({
        page: 1,
        page_size: 20,
    });

    const drivedData = useMemo(() => {
        return data?.results || [];
    }, [data?.results]);

    return (
        <div>
            <BackNavigation extraText="Agreements" />
            {/* <div className="flex justify-end my-6">
        <Button>
          <Link to={AdminRoutes.AgrementsCreeate}>Create Agreement</Link>
        </Button>
      </div> */}
            <TableFilters>
                <DataTable columns={columnsLease} data={drivedData} />
            </TableFilters>
        </div>
    );
};

export default Lease;
