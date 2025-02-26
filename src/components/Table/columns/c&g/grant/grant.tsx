import { ColumnDef } from "@tanstack/react-table";
import { IGrantPaginatedData } from "definations/c&g/grants";
import { generatePath, Link } from "react-router-dom";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { Button } from "components/ui/button";
import MoreOptionsHorizontalIcon from "components/icons/MoreOptionsHorizontalIcon";
import { CG_ROUTES } from "constants/RouterConstants";
import EyeIcon from "components/icons/EyeIcon";
import PencilIcon from "components/icons/PencilIcon";
import DeleteIcon from "components/icons/DeleteIcon";
import ConfirmationDialog from "components/modals/dailog/ConfirmationDialog";
import { useState } from "react";
import { toast } from "sonner";
import { useDeleteGrantMutation } from "services/c&g/grant/grant";

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
        id: "funding_sources",
        accessorFn: ({ funding_sources }) => funding_sources?.join(", "),
        size: 200,
    },
    {
        header: "Award Amount",
        id: "award_amount",
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
        id: "monthly_spend",
        accessorFn: ({ current_month_expenditure_amount }) =>
            current_month_expenditure_amount ?? "N/A",
        size: 200,
    },
    {
        header: "Total Obligations",
        id: "total_obligation_amount",
        accessorFn: ({ total_obligation_amount }) =>
            total_obligation_amount ?? "N/A",
        size: 200,
    },

    {
        header: "Total Expenditure",
        id: "total_expenditure_amount",
        accessorFn: ({ total_expenditure_amount }) =>
            total_expenditure_amount ?? "N/A",
        size: 200,
    },

    {
        header: "Intervention",
        id: "beneficiaries",
        accessorFn: ({ beneficiaries }) => beneficiaries.join(", "),
        size: 200,
    },

    {
        header: "Status",
        id: "status",
        accessorKey: "status",
        size: 200,
    },

    {
        header: "",
        id: "action",
        cell: ({ row }) => <TableMenu {...row.original} />,
    },
];

const TableMenu = ({ id }: IGrantPaginatedData) => {
    const [isDialogOpen, setDialogOpen] = useState(false);

    const [deleteGrant, { isLoading }] = useDeleteGrantMutation();

    const handleDelete = async () => {
        try {
            await deleteGrant(id).unwrap();
            toast.success("Grant Deleted");
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
                                to={generatePath(CG_ROUTES.GRANT_DETAILS, {
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
                                    pathname: CG_ROUTES.GRANT_CREATE,
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
                loading={isLoading}
                onCancel={() => setDialogOpen(false)}
                onOk={handleDelete}
            />
        </div>
    );
};
