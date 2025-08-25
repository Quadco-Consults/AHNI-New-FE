import Link from "next/link";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { Button } from "components/ui/button";
import MoreOptionsHorizontalIcon from "components/icons/MoreOptionsHorizontalIcon";
import { RouteEnum } from "constants/RouterConstants";
import EyeIcon from "components/icons/EyeIcon";
import DeleteIcon from "components/icons/DeleteIcon";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "components/ui/badge";
import { cn } from "lib/utils";
import { toast } from "sonner";
import EditIcon from "components/icons/EditIcon";
import { useDeleteProject } from "@/features/projects/controllers/projectController";
import { useDeletePartnerMutation } from "@/features/modules/controllers/project/partnerController";
import PencilIcon from "components/icons/PencilIcon";
import { useAppDispatch } from "hooks/useStore";
import { openDialog } from "store/ui";
import { DialogType } from "constants/dailogs";
import ConfirmationDialog from "components/ConfirmationDialog";
import { useState } from "react";
import { IProjectSingleData } from "definations/project";
import { TPartnerData } from "@/features/projects/types/project/partners";
import { useDeletePartner } from "@/features/modules/controllers/project/partnerController";

export const modulePartnerColumn: ColumnDef<TPartnerData>[] = [
    {
        header: "Name",
        accessorKey: "name",
        size: 250,
    },
    {
        header: "Type",
        accessorKey: "partner_type",
        size: 200,
    },

    {
        header: "Address",
        accessorKey: "address",
        size: 130,
    },
    {
        header: "City",
        accessorKey: "city",
        size: 130,
    },

    {
        header: "State",
        accessorKey: "state",
        size: 100,
    },
    {
        header: "Phone",
        accessorKey: "phone",
        size: 120,
    },
    {
        header: "Email",
        accessorKey: "email",
        size: 300,
    },
    {
        header: "Website",
        accessorKey: "website",
        size: 200,
    },
    {
        id: "actions",
        size: 50,
        cell: ({ row }) => <TableMenu {...row.original} />,
    },
];

const TableMenu = ({ id, ...rest }: TPartnerData) => {
    const [dialogOpen, setDialogOpen] = useState(false);

    const [deletePartner, { isLoading }] = useDeletePartnerMutation();
    const dispatch = useAppDispatch();

    const handleDeleteProject = async () => {
        try {
            await deletePartner(id);
            toast.success("Partner deleted.");
        } catch (error: any) {
            toast.error(error.data.message || "Something went wrong");
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
                            <Button
                                className="w-full flex items-center justify-start gap-2"
                                variant="ghost"
                                onClick={() => {
                                    dispatch(
                                        openDialog({
                                            type: DialogType.AddPartners,
                                            dialogProps: {
                                                header: "Update Partner",
                                                data: { id, ...rest },
                                                type: "update",
                                            },
                                        })
                                    );
                                }}
                            >
                                <EditIcon />
                                Edit
                            </Button>

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
                open={dialogOpen}
                title="Are you sure you want to delete this partner?"
                loading={isLoading}
                onCancel={() => setDialogOpen(false)}
                onOk={handleDeleteProject}
            />
        </div>
    );
};
