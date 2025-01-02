import DataTable from "components/Table/DataTable";
import TableFilters from "components/Table/TableFilters";
import { useGetAllPermissionsQuery } from "services/auth/role";

export default function AllPermissions() {
    const { data: permission, isLoading } = useGetAllPermissionsQuery({
        page: 1,
        size: 2000000,
    });

    return (
        <div className="mt-6">
            <TableFilters>
                <DataTable columns={[]} data={[]} isLoading={isLoading} />
            </TableFilters>
        </div>
    );
}
