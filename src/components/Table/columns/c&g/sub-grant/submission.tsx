import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "components/ui/checkbox";
import DeleteIcon from "components/icons/DeleteIcon";
import EyeIcon from "components/icons/EyeIcon";
import MoreOptionsHorizontalIcon from "components/icons/MoreOptionsHorizontalIcon";
import DataTable from "components/Table/DataTable";
import TableFilters from "components/Table/TableFilters";
import { Button } from "components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { CG_GROUTES } from "constants/RouterConstants";
import { ISubGrantSingleData } from "definations/c&g/sub-grant";
import { generatePath, Link } from "react-router-dom";

export const subGrantSubmissionColumns: ColumnDef<any>[] = [
    {
        id: "select",
        size: 50,
        header: ({ table }) => {
            return (
                <Checkbox
                    checked={table.getIsAllPageRowsSelected()}
                    onCheckedChange={(value) => {
                        table.toggleAllPageRowsSelected(!!value);
                    }}
                />
            );
        },

        cell: ({ row }) => {
            return (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => {
                        row.toggleSelected(!!value);
                    }}
                />
            );
        },
    },

    {
        header: "Legal Name of the Organization",
        accessorKey: "organisation_name",
        size: 200,
        // cell: ({ row }) => <p>{row?.original?.project?.title}</p>,
    },
    {
        header: "Address",
        accessorKey: "address",
        size: 200,
    },
    {
        header: "Telephone",
        accessorKey: "telephone",
        size: 200,
        // cell: ({ row }) => <p>{row?.original?.grantor?.name}</p>,
    },
    {
        header: "Email",
        accessorKey: "email",
        size: 200,
    },
    {
        header: "",
        id: "actions",
        size: 50,
        cell: ({ row }) => <TableMenu data={row.original} />,
    },
];

const TableMenu = ({ data }: any) => {
    return (
        <div className="flex items-center gap-2">
            <>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="ghost" className="flex gap-2 py-6">
                            <MoreOptionsHorizontalIcon />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className=" w-fit">
                        <div className="flex flex-col items-start justify-between gap-1">
                            <Link
                                className="w-full"
                                to={generatePath(
                                    CG_GROUTES.SUBMITTED_APPLICATIONS,
                                    {
                                        id: data?.id,
                                    }
                                )}
                            >
                                <Button
                                    className="w-full flex items-center justify-start gap-2"
                                    variant="ghost"
                                >
                                    <EyeIcon />
                                    View
                                </Button>
                            </Link>

                            <Button
                                className="w-full flex items-center justify-start gap-2"
                                variant="ghost"
                            >
                                <DeleteIcon />
                                Delete
                            </Button>
                        </div>
                    </PopoverContent>
                </Popover>
            </>
        </div>
    );
};
