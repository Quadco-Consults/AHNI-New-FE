import { ColumnDef } from "@tanstack/react-table";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { Button } from "components/ui/button";
import { toast } from "sonner";
import { useState } from "react";
import MoreOptionsHorizontalIcon from "components/icons/MoreOptionsHorizontalIcon";
import DeleteIcon from "components/icons/DeleteIcon";
import PencilIcon from "components/icons/PencilIcon";
import ConfirmationDialog from "components/modals/dailog/ConfirmationDialog";
import { generatePath, Link, useLocation, useParams } from "react-router-dom";
import { useDeleteAgreementMutation } from "services/c&g/contract-management/agreement";
import { CG_ROUTES, ProgramRoutes } from "constants/RouterConstants";
import { IConsultancyStaffPaginatedData } from "definations/c&g/contract-management/consultancy-management/consultancy-application";
import EyeIcon from "components/icons/EyeIcon";

export const consultancyStaffColumns: ColumnDef<IConsultancyStaffPaginatedData>[] =
    [
        {
            header: "Applicant Name",
            id: "name",
            accessorKey: "name",
            size: 200,
        },

        {
            header: "Email",
            id: "email",
            accessorKey: "email",
            size: 200,
        },

        {
            header: "Phone Number",
            id: "phone_number",
            accessorKey: "phone_number",
            size: 200,
        },

        {
            header: "Start Duration Date",
            id: "start_duration_date",
            accessorKey: "start_duration_date",
            size: 200,
        },

        {
            header: "End Duration Date",
            id: "end_duration_date",
            accessorKey: "end_duration_date",
            size: 200,
        },

        {
            header: "",
            id: "action",
            size: 80,
            cell: ({ row }) => <TableMenu {...row.original} />,
        },
    ];

const TableMenu = ({ id }: IConsultancyStaffPaginatedData) => {
    const [isDialogOpen, setDialogOpen] = useState(false);

    const { id: adhocId } = useParams();

    const { pathname } = useLocation();

    const type = pathname.includes("adhoc-management") ? "ADHOC" : "CONSULTANT";

    const viewPath =
        type === "ADHOC"
            ? ProgramRoutes.ADHOC_APPLICANT_DETAILS
            : CG_ROUTES.CONSULTANCY_APPLICATION_DETAILS;

    const editPath =
        type === "ADHOC"
            ? ProgramRoutes.CREATE_ADHOC_APPLICANT
            : CG_ROUTES.CREATE_CONSULTANCY_APPLICANT;

    const [deleteAgreement, { isLoading }] = useDeleteAgreementMutation();

    const handleDelete = async () => {
        try {
            await deleteAgreement(id).unwrap();
            toast.success("Adhoc Applicant Deleted");
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
                            to={generatePath(viewPath, {
                                adhocId,
                                applicantId: id,
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
                            to={{
                                pathname: generatePath(editPath, {
                                    id: adhocId,
                                }),
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
                title="Are you sure you want to delete this expenditure?"
                loading={isLoading}
                onCancel={() => setDialogOpen(false)}
                onOk={handleDelete}
            />
        </div>
    );
};
