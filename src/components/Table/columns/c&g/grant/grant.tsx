import { ColumnDef } from "@tanstack/react-table";
import { IGrantPaginatedData } from "definations/c&g/grants";
import { generatePath, Link } from "react-router-dom";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { Button } from "components/ui/button";
import MoreOptionsHorizontalIcon from "components/icons/MoreOptionsHorizontalIcon";
import { CG_GROUTES } from "constants/RouterConstants";
import EyeIcon from "components/icons/EyeIcon";
import PencilIcon from "components/icons/PencilIcon";
import DeleteIcon from "components/icons/DeleteIcon";
import ConfirmationDialog from "components/modals/dailog/ConfirmationDialog";
import { useState } from "react";
import { toast } from "sonner";

export const grantColumns: ColumnDef<IGrantPaginatedData>[] = [
    {
        header: "Project Name",
        id: "project",
        accessorKey: "project",
        size: 200,
    },
    {
        header: "Location",
        accessorKey: "location",
        size: 200,
    },
    {
        header: "Funding source",
        accessorKey: "grantor",
        size: 200,
    },
    {
        header: "Award Amount",
        accessorKey: "award_amount",
        size: 200,
    },

    {
        header: "Award Type",
        id: "award_type",
        accessorKey: "award_type",
        size: 200,
    },
    {
        header: "Monthly Spend",
        accessorKey: "monthly_spend",
        size: 200,
    },
    {
        header: "Total Obligations",
        accessorKey: "_",
        size: 200,
    },
    {
        header: "Intervention",
        accessorKey: "intervention_area",
        size: 200,
    },
    {
        header: "Status",
        accessorKey: "status",
        size: 200,
    },

    {
        id: "actions",
        header: "",
        cell: ({ row }) => <TableMenu {...row.original} />,
    },
];

const TableMenu = ({ id }: IGrantPaginatedData) => {
    const [isDialogOpen, setDialogOpen] = useState(false);

    const handleDelete = async () => {
        try {
            // handle delete
        } catch (error: any) {
            toast.error(error.data.message ?? "Something went wrong");
        }
    };

    return (
        <div className="flex items-center gap-2">
            <>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="ghost" className="flex gap-2 py-6">
                            <MoreOptionsHorizontalIcon />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-fit">
                        <div className="flex flex-col items-start justify-between gap-1">
                            <Link
                                className="w-full"
                                to={generatePath(CG_GROUTES.GRANT_DETAILS, {
                                    id,
                                })}
                            >
                                <Button
                                    className="w-full flex items-center justify-start gap-2"
                                    variant="ghost"
                                >
                                    <EyeIcon />
                                    View
                                </Button>
                            </Link>

                            <Link
                                className="w-full"
                                to={{
                                    pathname: CG_GROUTES.GRANT_CREATE,
                                    search: `?id=${id}`,
                                }}
                            >
                                <Button
                                    className="w-full flex items-center justify-start gap-2"
                                    variant="ghost"
                                >
                                    <PencilIcon />
                                    Edit
                                </Button>
                            </Link>

                            <Button
                                className="w-full flex items-center justify-start gap-2"
                                variant="ghost"
                                onClick={() => setDialogOpen(true)}
                            >
                                <DeleteIcon />
                                Delete
                            </Button>
                        </div>
                    </PopoverContent>
                </Popover>
            </>

            <ConfirmationDialog
                open={isDialogOpen}
                title="Are you sure you want to delete this grant?"
                loading={false}
                onCancel={() => setDialogOpen(false)}
                onOk={handleDelete}
            />
        </div>
    );
};
