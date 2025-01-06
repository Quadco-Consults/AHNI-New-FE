import { ColumnDef } from "@tanstack/react-table";
import EyeIcon from "components/icons/EyeIcon";
import MoreOptionsHorizontalIcon from "components/icons/MoreOptionsHorizontalIcon";
import { Button } from "components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { AdminRoutes } from "constants/RouterConstants";
import { generatePath, Link } from "react-router-dom";
import { VendorsResultsData } from "definations/procurement-types/vendors";

export const fuelRequestVendorColumns: ColumnDef<VendorsResultsData>[] = [
    {
        header: "Company Name",
        id: "company_name",
        accessorKey: "company_name",
    },

    {
        header: "Type of Business",
        id: "type_of_business",
        accessorKey: "type_of_business",
        size: 150,
    },

    {
        header: "Nature of Business",
        id: "nature_of_business",
        accessorKey: "nature_of_business",
        size: 200,
    },

    {
        header: "Registration Number",
        id: "company_registration_number",
        accessorKey: "company_registration_number",
        size: 200,
    },

    {
        header: "Email",
        id: "email",
        accessorKey: "email",
    },

    {
        header: "Website",
        id: "website",
        accessorKey: "website",
    },

    {
        header: "",
        accessorKey: "action",
        cell: ({ row }) => {
            return <TableMenu {...row.original} />;
        },
    },
];

const TableMenu = ({ id }: VendorsResultsData) => {
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
                            to={{
                                pathname: generatePath(
                                    AdminRoutes.VIEW_FUEL_CONSUMPTION,
                                    { id }
                                ),
                                search: "?type=vendor",
                            }}
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
