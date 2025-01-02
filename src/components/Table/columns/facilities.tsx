import { ColumnDef, Row } from "@tanstack/react-table";

import { Badge } from "components/ui/badge";

import { AdminRoutes } from "constants/RouterConstants";
import TableAction from "atoms/TableAction";
import { useDeleteFacilityMutation } from "services/admin/faciityMaintenance";
import { toast } from "sonner";

export interface MaintenanceData {
    facility: string;
    maintenance_type: string;
    description_of_problem: string;
    status: string;
    // Add a property for the checkbox state
    action: boolean;
    id: string;
}

// eslint-disable-next-line react-refresh/only-export-components
const FacilityDelete = ({ row }: { row: Row<MaintenanceData> }) => {
    const [deleteFaculity] = useDeleteFacilityMutation();

    const onDelete = async () => {
        try {
            await deleteFaculity(row.original.id).unwrap();
            toast.success("Facility Deleted");
        } catch (error) {
            toast.error("Failed to delete facility");
        }
    };
    return (
        <TableAction
            action={() => onDelete()}
            route={AdminRoutes.FacilitiesView}
            row={row.original}
        />
    );
};

export const maintenanceColumns: ColumnDef<MaintenanceData>[] = [
    {
        header: "Facility",
        accessorKey: "facility",
    },
    {
        header: "Description",
        accessorKey: "description_of_problem",
    },

    {
        header: "Maintenance Type",
        accessorKey: "maintenance_type",
    },
    {
        header: "Status",
        accessorKey: "status",
        cell: ({ getValue }) => {
            return (
                <Badge
                    variant={
                        getValue<string>().toLowerCase() === "pending"
                            ? "secondary"
                            : "success"
                    }
                >
                    {getValue<string>()}
                </Badge>
            );
        },
    },
    {
        header: "",
        accessorKey: "action",
        cell: ({ row }) => <FacilityDelete row={row} />,
    },
];
