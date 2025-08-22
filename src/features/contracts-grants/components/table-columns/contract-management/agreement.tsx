import { ColumnDef } from "@tanstack/react-table";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { Button } from "components/ui/button";
import { toast } from "sonner";
import { useState } from "react";
import MoreOptionsHorizontalIcon from "components/icons/MoreOptionsHorizontalIcon";
import DeleteIcon from "components/icons/DeleteIcon";
import PencilIcon from "components/icons/PencilIcon";
import ConfirmationDialog from "components/ConfirmationDialog";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IAgreementPaginatedData } from "definations/c&g/contract-management/agreement";
import { useDeleteAgreement } from "@/features/contracts-grants/controllers/agreementController";
import { CG_ROUTES } from "constants/RouterConstants";

export const agreementColumns: ColumnDef<IAgreementPaginatedData>[] = [
    {
        header: "Name of Vendor",
        id: "_",
        accessorKey: "service",
        size: 200,
    },

    {
        header: "Contact Person",
        id: "_",
        accessorKey: "_",
        size: 200,
    },

    {
        header: "Contact Person Email",
        id: "_",
        accessorKey: "_",
        size: 200,
    },

    {
        header: "Contact Person Phone Number",
        id: "_",
        accessorKey: "_",
        size: 200,
    },

    {
        header: "Service Type",
        id: "service",
        accessorKey: "service",
        size: 200,
    },

    {
        header: "Location",
        id: "location",
        accessorKey: "location",
        size: 200,
    },

    {
        header: "Month",
        id: "month",
        accessorKey: "month",
        size: 200,
    },

    {
        header: "Year",
        id: "year",
        accessorKey: "year",
        size: 200,
    },

    {
        header: "Effective Date",
        id: "service",
        accessorKey: "service",
        size: 200,
    },

    {
        header: "Expiry Date",
        id: "service",
        accessorKey: "service",
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
        id: "service",
        accessorKey: "service",
        size: 200,
    },

    {
        header: "",
        id: "action",
        size: 80,
        cell: ({ row }) => <TableMenu {...row.original} />,
    },
];

const TableMenu = ({ id }: IAgreementPaginatedData) => {
    const [isDialogOpen, setDialogOpen] = useState(false);

    const { pathname } = useLocation();

    console.log({ pathname });

    const { deleteAgreement, isLoading } = useDeleteAgreement();

    const handleDelete = async () => {
        try {
            await deleteAgreement(id)();
            toast.success("Agreement Deleted");
        } catch (error: any) {
            toast.error(error.data.message ?? "Something went wrong");
        }
    };

    if (pathname === "/admin/agreements/") return null;

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
                            href={{
                                pathname: CG_ROUTES.CREATE_AGREEMENT_DETAILS,
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
