import { ColumnDef } from "@tanstack/react-table";
import DeleteIcon from "components/icons/DeleteIcon";
import EyeIcon from "components/icons/EyeIcon";
import MoreOptionsHorizontalIcon from "components/icons/MoreOptionsHorizontalIcon";
import { Button } from "components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { CG_ROUTES } from "constants/RouterConstants";
import { ISubGrantSubmissionPaginatedData } from "definations/c&g/contract-management/sub-grant/sub-grant";
import { generatePath, Link, useLocation, useParams } from "react-router-dom";
import PencilIcon from "components/icons/PencilIcon";
import { toast } from "sonner";
import { useDeleteSubGrantManualSubMutation } from "services/c&g/subgrant/submission";
import { useState } from "react";
import ConfirmationDialog from "components/modals/dailog/ConfirmationDialog";

export const preAwardAssessmentColumns: ColumnDef<ISubGrantSubmissionPaginatedData>[] =
    [
        {
            header: "Sub Grant Title",
            id: "title",
            accessorKey: "title",
            size: 200,
        },
        {
            header: "Pre-Award Assessment Type",
            id: "type",
            accessorKey: "type",
            size: 200,
        },
        {
            header: "Status",
            id: "status",
            accessorKey: "status",
            size: 200,
        },
        {
            header: "Pre-Award Assessment Date",
            id: "date",
            accessorKey: "date",
            size: 200,
        },

        {
            header: "",
            id: "actions",
            size: 50,
            cell: ({ row }) => <TableMenu {...row.original} />,
        },
    ];

const TableMenu = ({
    id: partnerSubId,
    sub_grant_id,
}: ISubGrantSubmissionPaginatedData) => {
    const [isDialogOpen, setDialogOpen] = useState(false);

    const { id: subGrantId = "" } = useParams();

    const { pathname } = useLocation();

    const isPreawardPath = pathname.includes("/preaward-assessment");

    const [deletePartnerSubmission, { isLoading: isDeleteLoading }] =
        useDeleteSubGrantManualSubMutation();

    const handleDelete = async () => {
        try {
            await deletePartnerSubmission(partnerSubId).unwrap();
            toast.success("Submission Deleted");
            setDialogOpen(false);
        } catch (error: any) {
            toast.error(error.data.message ?? "Something went wrong");
        }
    };

    const path = isPreawardPath
        ? generatePath(CG_ROUTES.SUBGRANT_SUBMISSION_DETAILS, {
              subGrantId: sub_grant_id,
              partnerSubId,
          })
        : generatePath(CG_ROUTES.SUBGRANT_SUBMISSION_DETAILS, {
              subGrantId,
              partnerSubId,
          });

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
                        <Link className="w-full" to={path}>
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
                                pathname: generatePath(
                                    CG_ROUTES.CREATE_SUBGRANT_SUBMISSION_DETAILS,
                                    { id: subGrantId }
                                ),
                                search: `?partnerSubId=${partnerSubId}`,
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
                title="Are you sure you want to delete this submission?"
                loading={isDeleteLoading}
                onCancel={() => setDialogOpen(false)}
                onOk={handleDelete}
            />
        </div>
    );
};
