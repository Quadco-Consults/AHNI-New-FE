import { ColumnDef } from "@tanstack/react-table";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { Button } from "components/ui/button";
import MoreOptionsHorizontalIcon from "components/icons/MoreOptionsHorizontalIcon";
import PencilIcon from "components/icons/PencilIcon";
import Link from "next/link";
import { CG_ROUTES } from "constants/RouterConstants";
import { IConsultancyReportPaginatedData } from "definations/c&g/contract-management/consultancy-report";
import EyeIcon from "components/icons/EyeIcon";

export const consultancyReportColumns: ColumnDef<IConsultancyReportPaginatedData>[] =
    [
        {
            header: "Purpose",
            id: "purpose",
            accessorKey: "purpose",
            size: 200,
        },

        {
            header: "Consultant",
            id: "consultant",
            accessorKey: "consultant",
            size: 200,
        },

        {
            header: "Report Period",
            id: "report_date",
            accessorKey: "report_date",
            size: 200,
        },

        {
            header: "Consultancy Period",
            id: "consultancy_start_date",
            accessorKey: "consultancy_start_date",
            size: 200,
        },

        {
            header: "Supervisor",
            id: "supervisor",
            accessorKey: "supervisor",
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
    return (
        <div className="flex items-center gap-2">
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant="ghost" className="flex gap-2 py-6">
                        <MoreOptionsHorizontalIcon />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-fit">
                    <Link
                        href={CG_ROUTES.CONSULTANCY_REPORT_DETAILS.replace(":id", id)}
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
                        href={{
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
                </PopoverContent>
            </Popover>
        </div>
    );
};
