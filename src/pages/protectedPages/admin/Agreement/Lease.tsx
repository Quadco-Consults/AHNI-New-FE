import BackNavigation from "atoms/BackNavigation";
import DataTable from "components/Table/DataTable";
import TableFilters from "components/Table/TableFilters";

const Lease = () => {
    return (
        <div>
            <BackNavigation extraText="Agreements" />
            {/* <div className="flex justify-end my-6">
        <Button>
          <Link to={AdminRoutes.AgrementsCreeate}>Create Agreement</Link>
        </Button>
      </div> */}
            <TableFilters>
                <DataTable columns={[]} data={[]} />
            </TableFilters>
        </div>
    );
};

export default Lease;
