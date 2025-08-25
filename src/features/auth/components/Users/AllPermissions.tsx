import DataTable from "components/Table/DataTable";
import TableFilters from "components/Table/TableFilters";
import { useGetAllPermissions } from "@/features/auth/controllers/roleController";

export default function AllPermissions() {
    const { data: permission, isLoading } = useGetAllPermissions({
        page: 1,
        size: 2000000,
        search: "",
    });

    return (
        <div className="mt-6">
            <TableFilters>
                <DataTable columns={[]} data={[]} isLoading={isLoading} />
            </TableFilters>
        </div>
    );
}
