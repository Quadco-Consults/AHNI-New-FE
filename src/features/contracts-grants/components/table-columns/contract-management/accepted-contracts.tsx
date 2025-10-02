import { ColumnDef } from "@tanstack/react-table";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { Button } from "components/ui/button";
import MoreOptionsHorizontalIcon from "components/icons/MoreOptionsHorizontalIcon";
import Link from "next/link";
import { ProgramRoutes } from "constants/RouterConstants";
import { IConsultancyStaffPaginatedData } from "@/features/contracts-grants/types/contract-management/consultancy-management/consultancy-application";
import EyeIcon from "components/icons/EyeIcon";
import { Badge } from "components/ui/badge";
import { cn } from "lib/utils";
import { FileText, CheckCircle, Download, Clock } from "lucide-react";

export const acceptedContractsColumns: ColumnDef<IConsultancyStaffPaginatedData>[] =
    [
        {
            header: "S/N",
            accessorFn: (_, index) => index + 1,
            size: 60,
        },

        {
            header: "Consultant Name",
            id: "consultant_name",
            size: 200,
            cell: ({ row }) => {
                const data = row.original;
                return (
                    <div className="font-medium">
                        {data.name || 'N/A'}
                    </div>
                );
            },
        },

        {
            header: "Email",
            id: "email",
            accessorKey: "email",
            size: 250,
            cell: ({ getValue }) => (
                <div className="text-sm text-gray-600">{getValue() as string}</div>
            ),
        },

        {
            header: "Position",
            id: "position_under_contract",
            accessorKey: "position_under_contract",
            size: 200,
        },

        {
            header: "Contract Number",
            id: "contract_number",
            accessorKey: "contract_number",
            size: 150,
            cell: ({ getValue }) => (
                <div className="font-mono text-sm">{getValue() as string || 'N/A'}</div>
            ),
        },

        {
            header: "Contract Status",
            id: "offer_accepted",
            accessorKey: "offer_accepted",
            size: 120,
            cell: ({ row }) => {
                const offerAccepted = row.original.offer_accepted;
                return offerAccepted ? (
                    <Badge
                        variant="default"
                        className="p-1 rounded-lg flex items-center gap-1 bg-green-100 text-green-700"
                    >
                        <CheckCircle className="h-3 w-3" />
                        Accepted
                    </Badge>
                ) : (
                    <Badge
                        variant="default"
                        className="p-1 rounded-lg flex items-center gap-1 bg-amber-100 text-amber-700"
                    >
                        <Clock className="h-3 w-3" />
                        Pending
                    </Badge>
                );
            },
        },

        {
            header: "Start Date",
            id: "start_duration_date",
            accessorKey: "start_duration_date",
            size: 120,
            cell: ({ getValue }) => {
                const date = getValue() as string;
                return date ? new Date(date).toLocaleDateString() : 'N/A';
            },
        },

        {
            header: "End Date",
            id: "end_duration_date",
            accessorKey: "end_duration_date",
            size: 120,
            cell: ({ getValue }) => {
                const date = getValue() as string;
                return date ? new Date(date).toLocaleDateString() : 'N/A';
            },
        },

        {
            header: "Proposed Salary",
            id: "proposed_salary",
            accessorKey: "proposed_salary",
            size: 130,
            cell: ({ getValue }) => {
                const salary = getValue() as string;
                return (
                    <div className="font-medium">
                        {salary ? `$${parseFloat(salary).toLocaleString()}` : 'N/A'}
                    </div>
                );
            },
        },

        {
            header: "Acceptance Date",
            id: "offer_acceptance_date",
            accessorKey: "offer_acceptance_date",
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

const TableMenu = ({ id }: IConsultancyStaffPaginatedData) => {
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