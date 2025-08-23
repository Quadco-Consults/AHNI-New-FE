import { ColumnDef } from "@tanstack/react-table";
import EyeIcon from "components/icons/EyeIcon";
import MoreOptionsHorizontalIcon from "components/icons/MoreOptionsHorizontalIcon";
import { Button } from "components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { AdminRoutes } from "constants/RouterConstants";
import Link from "next/link";
import { TAssetPaginatedData } from "definations/admin/inventory-management/asset";

export const fuelRequestAssetColumns: ColumnDef<TAssetPaginatedData>[] = [
    {
        header: "Vehicle",
        id: "name",
        accessorKey: "name",
    },

    {
        header: "Model",
        id: "model",
        accessorFn: ({ asset_type }) => asset_type.model,
    },

    {
        header: "Manufacturer",
        id: "manufacturer",
        accessorFn: ({ asset_type }) => asset_type.manufacturer,
    },

    {
        header: "Plate Number",
        id: "plate_number",
        accessorKey: "plate_number",
    },

    {
        header: "Implementer",
        id: "implementer",
        accessorKey: "implementer",
    },

    {
        header: "Condition",
        id: "asset_condition",
        accessorKey: "asset_condition",
    },

    {
        header: "",
        accessorKey: "action",
        cell: ({ row }) => {
            return <TableMenu {...row.original} />;
        },
    },
];

const TableMenu = ({ id }: TAssetPaginatedData) => {
    return (
        <div className="flex items-center gap-2">
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant="ghost" className="flex gap-2 py-6">
                        <MoreOptionsHorizontalIcon />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className=" w-fit">
                    <div className="flex flex-col items-start justify-between gap-1">
                        <Link
                            href={`/dashboard/admin/fleet-management/fuel-request/${id}?type=vehicle`}
                        >
                            <Button
                                className="w-full flex items-center justify-start gap-2"
                                variant="ghost"
                            >
                                <EyeIcon />
                                View Fuel Requests
                            </Button>
                        </Link>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
};
