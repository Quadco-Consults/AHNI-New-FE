import { ColumnDef } from "@tanstack/react-table";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { Button } from "components/ui/button";
import MoreOptionsHorizontalIcon from "components/icons/MoreOptionsHorizontalIcon";
import Link from "next/link";
import { CG_ROUTES, ProgramRoutes } from "constants/RouterConstants";
import { IConsultancyReportPaginatedData } from "definations/c&g/contract-management/consultancy-report";
import EyeIcon from "components/icons/EyeIcon";
import { IConsultantPaginatedData } from "definations/c&g/contract-management/consultancy-management/consultancy-management";
import { Badge } from "components/ui/badge";
import { cn } from "lib/utils";
import useJobAdvertType from "hooks/useJobAdvertType";

export const consultancyAcceptanceColumns: ColumnDef<IConsultantPaginatedData>[] =
    [
        {
            header: "Consultant Name",
            id: "name",
            accessorKey: "name",
            size: 200,
        },

        {
            header: "Title of Consultancy Call",
            id: "title",
            accessorKey: "title",
            size: 300,
        },

        {
            header: "Acceptance Status",
            id: "status",
            accessorKey: "status",
            size: 200,
            cell: ({ getValue }) => {
                return (
                    <Badge
                        variant="default"
                        className={cn(
                            "p-1 rounded-lg",
                            getValue() === "IN_PROGRESS" &&
                                "bg-green-200 text-green-500",
                            getValue() === "CLOSED" &&
                                "bg-red-200 text-red-500",
                            getValue() === "PENDING" &&
                                "bg-yellow-200 text-yellow-500",
                            getValue() === "On Hold" &&
                                "text-grey-200 bg-grey-500"
                        )}
                    >
                        {getValue() as string}
                    </Badge>
                );
            },
        },

        {
            header: "Start Date",
            id: "start_date",
            accessorKey: "start_date",
            size: 200,
        },

        {
            header: "Effective End Date",
            id: "end_date",
            accessorKey: "end_date",
            size: 200,
        },

        {
            header: "Status",
            id: "status",
            accessorKey: "status",
            size: 200,
            cell: ({ getValue }) => {
                return (
                    <Badge
                        variant="default"
                        className={cn(
                            "p-1 rounded-lg",
                            getValue() === "IN_PROGRESS" &&
                                "bg-green-200 text-green-500",
                            getValue() === "CLOSED" &&
                                "bg-red-200 text-red-500",
                            getValue() === "PENDING" &&
                                "bg-yellow-200 text-yellow-500",
                            getValue() === "On Hold" &&
                                "text-grey-200 bg-grey-500"
                        )}
                    >
                        {getValue() as string}
                    </Badge>
                );
            },
        },

        {
            header: "",
            id: "action",
            size: 80,
            cell: ({ row }) => <TableMenu {...row.original} />,
        },
    ];

const TableMenu = ({ id }: IConsultantPaginatedData) => {
    const advertType = useJobAdvertType();

    // Debug logging
    console.log("TableMenu - Consultant ID:", id);
    console.log("TableMenu - Advert Type:", advertType);

    // Create a parameterized URL with the consultant ID
    const url =
        advertType === "adhoc"
            ? `${ProgramRoutes.ADHOC_ACCEPTANCE_DETAILS}/${id}`
            : advertType === "consultant"
            ? `/dashboard/c-and-g/contract-management/consultant-acceptance/${id}`
            : "";

    console.log("TableMenu - Generated URL:", url);

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
                        <Link href={url}>
                            <Button
                                className="w-full flex items-center justify-start gap-2"
                                variant="ghost"
                            >
                                <EyeIcon />
                                View
                            </Button>
                        </Link>
                    </PopoverContent>
                </Popover>
            </>
        </div>
    );
};
