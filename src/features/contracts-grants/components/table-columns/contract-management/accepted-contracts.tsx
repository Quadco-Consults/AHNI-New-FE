import { ColumnDef } from "@tanstack/react-table";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { Button } from "components/ui/button";
import MoreOptionsHorizontalIcon from "components/icons/MoreOptionsHorizontalIcon";
import Link from "next/link";
import { ProgramRoutes } from "constants/RouterConstants";
import { IAdhocApplicant } from "@/features/programs/types/adhoc-management";
import EyeIcon from "components/icons/EyeIcon";
import { Badge } from "components/ui/badge";
import { cn } from "lib/utils";
import { FileText, CheckCircle, Download, Clock } from "lucide-react";

export const acceptedContractsColumns: ColumnDef<IAdhocApplicant>[] =
    [
        {
            header: "S/N",
            accessorFn: (_, index) => index + 1,
            size: 60,
        },

        {
            header: "Applicant Name",
            id: "applicant_name",
            size: 200,
            cell: ({ row }) => {
                const data = row.original;
                const fullName = `${data.sur_name || ''} ${data.other_names || ''}`.trim();
                return (
                    <div className="font-medium">
                        {fullName || 'N/A'}
                    </div>
                );
            },
        },

        {
            header: "Email",
            id: "email_address",
            accessorKey: "email_address",
            size: 250,
            cell: ({ getValue }) => (
                <div className="text-sm text-gray-600">{getValue() as string}</div>
            ),
        },

        {
            header: "Position",
            id: "position",
            size: 200,
            cell: ({ row }) => {
                const data = row.original;
                return data.advertisement?.position_title || 'N/A';
            },
        },

        {
            header: "Application Number",
            id: "application_number",
            accessorKey: "application_number",
            size: 150,
            cell: ({ getValue }) => (
                <div className="font-mono text-sm">{getValue() as string || 'N/A'}</div>
            ),
        },

        {
            header: "Status",
            id: "status",
            accessorKey: "status",
            size: 120,
            cell: ({ getValue }) => {
                const status = getValue() as string;
                return (
                    <Badge
                        variant="default"
                        className={cn(
                            "p-1 rounded-lg flex items-center gap-1",
                            status === "HIRED" && "bg-green-100 text-green-700",
                            status === "SELECTED" && "bg-blue-100 text-blue-700"
                        )}
                    >
                        <CheckCircle className="h-3 w-3" />
                        {status}
                    </Badge>
                );
            },
        },

        {
            header: "Contract Start Date",
            id: "contract_start_date",
            accessorKey: "contract_start_date",
            size: 130,
            cell: ({ getValue }) => {
                const date = getValue() as string;
                return date ? new Date(date).toLocaleDateString() : 'N/A';
            },
        },

        {
            header: "Contract End Date",
            id: "contract_end_date",
            accessorKey: "contract_end_date",
            size: 130,
            cell: ({ getValue }) => {
                const date = getValue() as string;
                return date ? new Date(date).toLocaleDateString() : 'N/A';
            },
        },

        {
            header: "Phone Number",
            id: "phone_number",
            accessorKey: "phone_number",
            size: 130,
            cell: ({ getValue }) => (
                <div className="text-sm">{getValue() as string || 'N/A'}</div>
            ),
        },

        {
            header: "Hired Date",
            id: "hired_at",
            accessorKey: "hired_at",
            size: 130,
            cell: ({ getValue }) => {
                const date = getValue() as string;
                return date ? new Date(date).toLocaleDateString() : 'N/A';
            },
        },

        {
            header: "",
            id: "action",
            size: 80,
            cell: ({ row }) => <TableMenu {...row.original} />,
        },
    ];

const TableMenu = ({ id }: IAdhocApplicant) => {
    console.log("TableMenu - Accepted Contract ID:", id);

    return (
        <div className="flex items-center gap-2">
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant="ghost" className="flex gap-2 py-6">
                        <MoreOptionsHorizontalIcon />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-fit">
                    <Link href={`${ProgramRoutes.ADHOC_ACCEPTANCE_DETAILS}/${id}`}>
                        <Button
                            className="w-full flex items-center justify-start gap-2"
                            variant="ghost"
                        >
                            <EyeIcon />
                            View Details
                        </Button>
                    </Link>
                    <Button
                        className="w-full flex items-center justify-start gap-2 text-blue-600 hover:text-blue-800"
                        variant="ghost"
                        onClick={() => {
                            // TODO: Implement contract document download
                            console.log("Download contract for:", id);
                        }}
                    >
                        <Download className="h-4 w-4" />
                        Download Contract
                    </Button>
                    <Button
                        className="w-full flex items-center justify-start gap-2 text-green-600 hover:text-green-800"
                        variant="ghost"
                        onClick={() => {
                            // TODO: Implement performance tracking
                            console.log("Track performance for:", id);
                        }}
                    >
                        <FileText className="h-4 w-4" />
                        Track Performance
                    </Button>
                </PopoverContent>
            </Popover>
        </div>
    );
};