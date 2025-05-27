import { ColumnDef } from "@tanstack/react-table";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { Button } from "components/ui/button";
import { toast } from "sonner";
import { useState } from "react";
import MoreOptionsHorizontalIcon from "components/icons/MoreOptionsHorizontalIcon";
import DeleteIcon from "components/icons/DeleteIcon";
import PencilIcon from "components/icons/PencilIcon";
import ConfirmationDialog from "components/modals/dailog/ConfirmationDialog";
import { generatePath, Link } from "react-router-dom";
import { CG_ROUTES } from "constants/RouterConstants";
import { IConsultancyReportPaginatedData } from "definations/c&g/contract-management/consultancy-report";
import { useDeleteConsultancyReportMutation } from "services/c&g/contract-management/consultancy-report";
import EyeIcon from "components/icons/EyeIcon";

export const consultantDatabaseColumns: ColumnDef<IConsultancyReportPaginatedData>[] =
    [
        {
            header: "Name of Consultant",
            id: "consultant",
            accessorKey: "consultant",
            size: 200,
        },

        {
            header: "Phone Number",
            id: "consultant",
            accessorKey: "consultant",
            size: 200,
        },

        {
            header: "Designation",
            id: "consultant",
            accessorKey: "consultant",
            size: 200,
        },

        {
            header: "Location",
            id: "consultant",
            accessorKey: "consultant",
            size: 200,
        },

        {
            header: "Project",
            id: "consultant",
            accessorKey: "consultant",
            size: 200,
        },

        {
            header: "Requesting Unit",
            id: "consultant",
            accessorKey: "consultant",
            size: 200,
        },

        {
            header: "Month",
            id: "consultant",
            accessorKey: "consultant",
            size: 200,
        },

        {
            header: "Start Date",
            id: "consultant",
            accessorKey: "consultant",
            size: 200,
        },

        {
            header: "End Date",
            id: "consultant",
            accessorKey: "consultant",
            size: 200,
        },

        {
            header: "Total Working Days",
            id: "consultant",
            accessorKey: "consultant",
            size: 200,
        },

        {
            header: "Days Worked",
            id: "consultant",
            accessorKey: "consultant",
            size: 200,
        },

        {
            header: "Days Remaining",
            id: "consultant",
            accessorKey: "consultant",
            size: 200,
        },

        {
            header: "Daily Rate",
            id: "consultant",
            accessorKey: "consultant",
            size: 200,
        },

        {
            header: "Contract Amount",
            id: "consultant",
            accessorKey: "consultant",
            size: 200,
        },

        {
            header: "Amount Paid",
            id: "consultant",
            accessorKey: "consultant",
            size: 200,
        },

        {
            header: "Balance",
            id: "consultant",
            accessorKey: "consultant",
            size: 200,
        },

        {
            header: "Payment Date",
            id: "consultant",
            accessorKey: "consultant",
            size: 200,
        },

        {
            header: "Status",
            id: "status",
            accessorKey: "status",
            size: 200,
        },

        {
            header: "Remarks",
            id: "consultant",
            accessorKey: "consultant",
            size: 200,
        },

        {
            header: "",
            id: "action",
            size: 80,
            cell: ({ row }) => <TableMenu {...row.original} />,
        },
    ];

const TableMenu = ({ id }: IConsultancyReportPaginatedData) => {
    const [isDialogOpen, setDialogOpen] = useState(false);

    const [deleteConsultancyReport, { isLoading }] =
        useDeleteConsultancyReportMutation();

    const handleDelete = async () => {
        try {
            await deleteConsultancyReport(id).unwrap();
            toast.success("Consultancy Report Deleted");
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
                        <Link
                            to={generatePath(
                                CG_ROUTES.CONSULTANCY_REPORT_DETAILS,
                                { id }
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
                        <Link
                            to={{
                                pathname: CG_ROUTES.CREATE_CONSULTANCY_REPORT,
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
                    </PopoverContent>
                </Popover>
            </>

            <ConfirmationDialog
                open={isDialogOpen}
                title="Are you sure you want to delete this consultant?"
                loading={isLoading}
                onCancel={() => setDialogOpen(false)}
                onOk={handleDelete}
            />
        </div>
    );
};
