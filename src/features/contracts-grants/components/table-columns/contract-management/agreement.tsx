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

// Helper function to extract entity name based on agreement type
const getEntityName = (agreement: IAgreementPaginatedData): string => {
    // Check if backend provided expanded details (separate _details field)
    if (agreement.vendor_details) {
        return agreement.vendor_details.company_name || agreement.vendor_details.name || 'N/A';
    }
    if (agreement.consultant_details) {
        return agreement.consultant_details.user?.full_name ||
               agreement.consultant_details.full_name ||
               `${agreement.consultant_details.user?.first_name || ''} ${agreement.consultant_details.user?.last_name || ''}`.trim() ||
               'N/A';
    }
    if (agreement.facilitator_details) {
        return agreement.facilitator_details.user?.full_name ||
               agreement.facilitator_details.full_name ||
               `${agreement.facilitator_details.user?.first_name || ''} ${agreement.facilitator_details.user?.last_name || ''}`.trim() ||
               'N/A';
    }
    if (agreement.adhoc_staff_details) {
        return agreement.adhoc_staff_details.user?.full_name ||
               agreement.adhoc_staff_details.full_name ||
               `${agreement.adhoc_staff_details.user?.first_name || ''} ${agreement.adhoc_staff_details.user?.last_name || ''}`.trim() ||
               'N/A';
    }

    // Check if fields themselves are objects (Django in-place expansion)
    if (agreement.vendor && typeof agreement.vendor === 'object') {
        return agreement.vendor.company_name || agreement.vendor.name || 'N/A';
    }
    if (agreement.consultant && typeof agreement.consultant === 'object') {
        return agreement.consultant.user?.full_name ||
               agreement.consultant.full_name ||
               `${agreement.consultant.user?.first_name || ''} ${agreement.consultant.user?.last_name || ''}`.trim() ||
               'N/A';
    }
    if (agreement.facilitator && typeof agreement.facilitator === 'object') {
        return agreement.facilitator.user?.full_name ||
               agreement.facilitator.full_name ||
               `${agreement.facilitator.user?.first_name || ''} ${agreement.facilitator.user?.last_name || ''}`.trim() ||
               'N/A';
    }
    if (agreement.adhoc_staff && typeof agreement.adhoc_staff === 'object') {
        return agreement.adhoc_staff.user?.full_name ||
               agreement.adhoc_staff.full_name ||
               `${agreement.adhoc_staff.user?.first_name || ''} ${agreement.adhoc_staff.user?.last_name || ''}`.trim() ||
               'N/A';
    }

    // Backend only returned IDs - show the type
    if (agreement.vendor) {
        return `Vendor (${agreement.type})`;
    }
    if (agreement.consultant) {
        return `Consultant`;
    }
    if (agreement.facilitator) {
        return `Facilitator`;
    }
    if (agreement.adhoc_staff) {
        return `Adhoc Staff`;
    }
    return 'N/A';
};

// Helper function to extract contact person
const getContactPerson = (agreement: IAgreementPaginatedData): string => {
    // Check _details field
    if (agreement.vendor_details) {
        return agreement.vendor_details.contact_person || 'N/A';
    }
    // Check if main field is expanded
    if (agreement.vendor && typeof agreement.vendor === 'object') {
        return agreement.vendor.contact_person || 'N/A';
    }
    // For staff contracts, same as entity name
    if (agreement.consultant_details || agreement.facilitator_details || agreement.adhoc_staff_details ||
        (agreement.consultant && typeof agreement.consultant === 'object') ||
        (agreement.facilitator && typeof agreement.facilitator === 'object') ||
        (agreement.adhoc_staff && typeof agreement.adhoc_staff === 'object')) {
        return getEntityName(agreement);
    }
    return '-';
};

// Helper function to extract contact email
const getContactEmail = (agreement: IAgreementPaginatedData): string => {
    // Vendor - check _details
    if (agreement.vendor_details) {
        return agreement.vendor_details.contact_email || agreement.vendor_details.email || 'N/A';
    }
    // Vendor - check main field
    if (agreement.vendor && typeof agreement.vendor === 'object') {
        return agreement.vendor.contact_email || agreement.vendor.email || 'N/A';
    }
    // Consultant - check _details
    if (agreement.consultant_details) {
        return agreement.consultant_details.user?.email || agreement.consultant_details.email || 'N/A';
    }
    // Consultant - check main field
    if (agreement.consultant && typeof agreement.consultant === 'object') {
        return agreement.consultant.user?.email || agreement.consultant.email || 'N/A';
    }
    // Facilitator - check _details
    if (agreement.facilitator_details) {
        return agreement.facilitator_details.user?.email || agreement.facilitator_details.email || 'N/A';
    }
    // Facilitator - check main field
    if (agreement.facilitator && typeof agreement.facilitator === 'object') {
        return agreement.facilitator.user?.email || agreement.facilitator.email || 'N/A';
    }
    // Adhoc staff - check _details
    if (agreement.adhoc_staff_details) {
        return agreement.adhoc_staff_details.user?.email || agreement.adhoc_staff_details.email || 'N/A';
    }
    // Adhoc staff - check main field
    if (agreement.adhoc_staff && typeof agreement.adhoc_staff === 'object') {
        return agreement.adhoc_staff.user?.email || agreement.adhoc_staff.email || 'N/A';
    }
    return '-';
};

// Helper function to extract contact phone
const getContactPhone = (agreement: IAgreementPaginatedData): string => {
    // Vendor - check _details
    if (agreement.vendor_details) {
        return agreement.vendor_details.contact_phone || agreement.vendor_details.phone_number || 'N/A';
    }
    // Vendor - check main field
    if (agreement.vendor && typeof agreement.vendor === 'object') {
        return agreement.vendor.contact_phone || agreement.vendor.phone_number || 'N/A';
    }
    // Consultant - check _details
    if (agreement.consultant_details) {
        return agreement.consultant_details.user?.phone_number || agreement.consultant_details.phone_number || 'N/A';
    }
    // Consultant - check main field
    if (agreement.consultant && typeof agreement.consultant === 'object') {
        return agreement.consultant.user?.phone_number || agreement.consultant.phone_number || 'N/A';
    }
    // Facilitator - check _details
    if (agreement.facilitator_details) {
        return agreement.facilitator_details.user?.phone_number || agreement.facilitator_details.phone_number || 'N/A';
    }
    // Facilitator - check main field
    if (agreement.facilitator && typeof agreement.facilitator === 'object') {
        return agreement.facilitator.user?.phone_number || agreement.facilitator.phone_number || 'N/A';
    }
    // Adhoc staff - check _details
    if (agreement.adhoc_staff_details) {
        return agreement.adhoc_staff_details.user?.phone_number || agreement.adhoc_staff_details.phone_number || 'N/A';
    }
    // Adhoc staff - check main field
    if (agreement.adhoc_staff && typeof agreement.adhoc_staff === 'object') {
        return agreement.adhoc_staff.user?.phone_number || agreement.adhoc_staff.phone_number || 'N/A';
    }
    return '-';
};

// Helper function to get location name
const getLocationName = (agreement: IAgreementPaginatedData): string => {
    // Check _details field
    if (agreement.location_details) {
        return agreement.location_details.name;
    }
    // Check if main field is expanded object
    if (agreement.location && typeof agreement.location === 'object') {
        return agreement.location.name;
    }
    // Backend only returned ID
    return agreement.location || '-';
};

// Helper function to format date
const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return 'N/A';
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch {
        return dateString;
    }
};

// Helper function to get month from date
const getMonth = (dateString: string): string => {
    if (!dateString) return 'N/A';
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'long' });
    } catch {
        return 'N/A';
    }
};

// Helper function to get year from date
const getYear = (dateString: string): string => {
    if (!dateString) return 'N/A';
    try {
        const date = new Date(dateString);
        return date.getFullYear().toString();
    } catch {
        return 'N/A';
    }
};

export const agreementColumns: ColumnDef<IAgreementPaginatedData>[] = [
    {
        header: "Agreement Type",
        id: "type",
        accessorKey: "type",
        size: 150,
        cell: ({ row }) => {
            const type = row.original.type;
            const typeMap: Record<string, string> = {
                'CONSULTANT': 'Consultant',
                'FACILITATOR': 'Facilitator',
                'ADHOC_STAFF': 'Adhoc Staff',
                'SLA': 'Service Agreement'
            };
            return typeMap[type] || type;
        },
    },

    {
        header: "Entity Name",
        id: "entity_name",
        size: 200,
        cell: ({ row }) => getEntityName(row.original),
    },

    {
        header: "Contact Person",
        id: "contact_person",
        size: 180,
        cell: ({ row }) => getContactPerson(row.original),
    },

    {
        header: "Contact Email",
        id: "contact_email",
        size: 200,
        cell: ({ row }) => getContactEmail(row.original),
    },

    {
        header: "Contact Phone",
        id: "contact_phone",
        size: 150,
        cell: ({ row }) => getContactPhone(row.original),
    },

    {
        header: "Service Type",
        id: "service",
        size: 180,
        cell: ({ row }) => {
            // Check if backend provided expanded service details (_details suffix)
            if (row.original.service_details) {
                return row.original.service_details.name;
            }
            // Check if service field itself is an object (in-place expansion)
            if (row.original.service && typeof row.original.service === 'object') {
                return row.original.service.name;
            }
            // Backend only returned service ID
            return row.original.service || '-';
        },
    },

    {
        header: "Location",
        id: "location",
        size: 150,
        cell: ({ row }) => getLocationName(row.original),
    },

    {
        header: "Contract Cost",
        id: "contract_cost",
        accessorKey: "contract_cost",
        size: 150,
        cell: ({ row }) => {
            const cost = row.original.contract_cost;
            if (!cost) return 'N/A';
            return `₦${Number(cost).toLocaleString()}`;
        },
    },

    {
        header: "Start Date",
        id: "start_date",
        accessorKey: "start_date",
        size: 130,
        cell: ({ row }) => formatDate(row.original.start_date),
    },

    {
        header: "End Date",
        id: "end_date",
        accessorKey: "end_date",
        size: 130,
        cell: ({ row }) => formatDate(row.original.end_date),
    },

    {
        header: "Month",
        id: "month",
        size: 120,
        cell: ({ row }) => getMonth(row.original.start_date),
    },

    {
        header: "Year",
        id: "year",
        size: 100,
        cell: ({ row }) => getYear(row.original.start_date),
    },

    {
        header: "Status",
        id: "status",
        accessorKey: "status",
        size: 120,
        cell: ({ row }) => {
            const status = row.original.status || 'ACTIVE';
            return (
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                    status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                    status === 'EXPIRED' ? 'bg-red-100 text-red-800' :
                    status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                }`}>
                    {status}
                </span>
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

const TableMenu = ({ id }: IAgreementPaginatedData) => {
    const [isDialogOpen, setDialogOpen] = useState(false);

    const pathname = usePathname();

    console.log({ pathname });

    const { deleteAgreement, isLoading } = useDeleteAgreement(id);

    const handleDelete = async () => {
        try {
            await deleteAgreement();
            toast.success("Agreement Deleted");
        } catch (error: any) {
            toast.error(error.data?.message ?? "Something went wrong");
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
