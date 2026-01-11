import { ColumnDef } from "@tanstack/react-table";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import MoreOptionsHorizontalIcon from "@/components/icons/MoreOptionsHorizontalIcon";
import Link from "next/link";
import { IAdhocApplicant } from "@/features/programs/types/adhoc-management";
import EyeIcon from "@/components/icons/EyeIcon";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { FileText } from "lucide-react";

export const contractRecipientsColumns: ColumnDef<IAdhocApplicant>[] =
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
                const data = row.original as any;
                // Use 'name' field from consultancy table, fallback to adhoc fields
                const fullName = data.name || `${data.sur_name || ''} ${data.other_names || ''}`.trim();
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
            size: 250,
            cell: ({ row }) => {
                const data = row.original as any;
                // Use 'email' field from consultancy table, fallback to 'email_address'
                const email = data.email || data.email_address;
                return <div className="text-sm text-gray-600">{email || 'N/A'}</div>;
            },
        },

        {
            header: "Position",
            id: "position",
            size: 200,
            cell: ({ row }) => {
                const data = row.original as any;
                // Use 'position_under_contract' from consultancy table, fallback to advertisement
                return data.position_under_contract || data.advertisement?.position_title || 'N/A';
            },
        },

        {
            header: "Contract Number",
            id: "contract_number",
            size: 150,
            cell: ({ row }) => {
                const data = row.original as any;
                // Use 'contract_number' from consultancy table, fallback to 'application_number'
                const number = data.contract_number || data.application_number;
                return <div className="font-mono text-sm">{number || 'N/A'}</div>;
            },
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
                            status === "SELECTED" && "bg-blue-100 text-blue-700",
                            status === "HIRED" && "bg-green-100 text-green-700",
                            status === "REJECTED" && "bg-red-100 text-red-700",
                            status === "INTERVIEWED" && "bg-purple-100 text-purple-700"
                        )}
                    >
                        <FileText className="h-3 w-3" />
                        {status}
                    </Badge>
                );
            },
        },

        {
            header: "Contract Start Date",
            id: "contract_start_date",
            size: 130,
            cell: ({ row }) => {
                const data = row.original as any;
                // Use 'start_duration_date' from consultancy table, fallback to 'contract_start_date'
                const date = data.start_duration_date || data.contract_start_date;
                return date ? new Date(date).toLocaleDateString() : 'N/A';
            },
        },

        {
            header: "Contract End Date",
            id: "contract_end_date",
            size: 130,
            cell: ({ row }) => {
                const data = row.original as any;
                // Use 'end_duration_date' from consultancy table, fallback to 'contract_end_date'
                const date = data.end_duration_date || data.contract_end_date;
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
            header: "",
            id: "action",
            size: 80,
            cell: ({ row }) => <TableMenu {...row.original} />,
        },
    ];

const TableMenu = ({ id }: IAdhocApplicant) => {
    console.log("TableMenu - Contract Recipient ID:", id);

    return (
        <div className="flex items-center gap-2">
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant="ghost" className="flex gap-2 py-6">
                        <MoreOptionsHorizontalIcon />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-fit">
                    <Link href={`/dashboard/programs/adhoc/adhoc-acceptance/applicant/${id}`}>
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
                        <FileText className="h-4 w-4" />
                        Download Contract
                    </Button>
                </PopoverContent>
            </Popover>
        </div>
    );
};