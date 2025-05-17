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

export const consultancyReportColumns: ColumnDef<IConsultancyReportPaginatedData>[] =
    [
        {
            header: "Names",
            id: "location",
            accessorKey: "location",
            size: 200,
        },

        {
            header: "Gender",
            id: "location",
            accessorKey: "location",
            size: 200,
        },

        {
            header: "State",
            id: "project",
            accessorKey: "project",
            size: 200,
        },

        {
            header: "Designation",
            id: "requesting_unit",
            accessorKey: "requesting_unit",
            size: 200,
        },

        {
            header: "Health Facility / Assignment Location",
            id: "month",
            accessorKey: "month",
            size: 200,
        },

        {
            header: "Spoke Site Name",
            id: "year",
            accessorKey: "year",
            size: 200,
        },

        {
            header: "LGA",
            id: "start-date",
            accessorKey: "start-date",
            size: 200,
        },

        {
            header: "Phone Number",
            id: "end_date",
            accessorKey: "end_date",
            size: 200,
        },

        {
            header: "Status of Adhoc Staff",
            id: "total_working_days",
            accessorKey: "total_working_days",
            size: 200,
        },

        {
            header: "QMap Backstop",
            id: "days_worked",
            accessorKey: "days_worked",
            size: 200,
        },

        {
            header: "Program Officer",
            id: "days_remaining",
            accessorKey: "days_remaining",
            size: 200,
        },

        {
            header: "STL",
            id: "daily_rate",
            accessorKey: "daily_rate",
            size: 200,
        },

        {
            header: "SEO",
            id: "contract_amount",
            accessorKey: "contract_amount",
            size: 200,
        },

        {
            header: "LGA 2",
            id: "amount_paid",
            accessorKey: "amount_paid",
            size: 200,
        },

        {
            header: "Cluster",
            id: "balance",
            accessorKey: "balance",
            size: 200,
        },

        {
            header: "Account Name",
            id: "payment_date",
            accessorKey: "payment_date",
            size: 200,
        },

        {
            header: "Bank Name",
            id: "status",
            accessorKey: "status",
            size: 200,
        },

        {
            header: "Account Number",
            id: "remarks",
            accessorKey: "remarks",
            size: 200,
        },

        {
            header: "Sort Code",
            id: "remarks",
            accessorKey: "remarks",
            size: 200,
        },

        {
            header: "Email Address",
            id: "remarks",
            accessorKey: "remarks",
            size: 200,
        },

        {
            header: "Qualification",
            id: "remarks",
            accessorKey: "remarks",
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
                title="Are you sure you want to delete this consultancy report?"
                loading={isLoading}
                onCancel={() => setDialogOpen(false)}
                onOk={handleDelete}
            />
        </div>
    );
};
