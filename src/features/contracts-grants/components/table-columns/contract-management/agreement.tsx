import { ColumnDef } from "@tanstack/react-table";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";
import MoreOptionsHorizontalIcon from "@/components/icons/MoreOptionsHorizontalIcon";
import DeleteIcon from "@/components/icons/DeleteIcon";
import PencilIcon from "@/components/icons/PencilIcon";
import EyeIcon from "@/components/icons/EyeIcon";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import Link from "next/link";
import { IAgreementPaginatedData } from "@/features/contracts-grants/types/contract-management/agreement";
import { useDeleteAgreement } from "@/features/contracts-grants/controllers/agreementController";
import { CG_ROUTES } from "@/constants/RouterConstants";

// Helper function to extract entity name based on agreement type
const getEntityName = (agreement: IAgreementPaginatedData): string => {
    // First check if backend provides entity_name (preferred field)
    if (agreement.entity_name) {
        return agreement.entity_name;
    }

    // Backend returns flattened fields with _contact_name suffix
    if (agreement.vendor_name) {
        return agreement.vendor_name;
    }
    if (agreement.consultant_contact_name || agreement.consultant_name) {
        return agreement.consultant_contact_name || agreement.consultant_name;
    }
    if (agreement.facilitator_contact_name || agreement.facilitator_name) {
        return agreement.facilitator_contact_name || agreement.facilitator_name;
    }
    if (agreement.adhoc_staff_contact_name || agreement.adhoc_staff_name) {
        return agreement.adhoc_staff_contact_name || agreement.adhoc_staff_name;
    }

    // Backend hasn't added these fields yet - show a message
    const serviceType = agreement.service_type_display;
    if (serviceType === 'Consultant' || serviceType === 'Adhoc Staff' || serviceType === 'Facilitator') {
        return `⚠️ ${serviceType} (Name field pending)`;
    }

    // Fallback to service type display if no entity name
    return agreement.service_type_display || '-';
};

// Helper function to extract contact person
const getContactPerson = (agreement: IAgreementPaginatedData): string => {
    // Backend returns flattened fields
    if (agreement.vendor_contact_person) {
        return agreement.vendor_contact_person;
    }
    // For staff contracts, return the entity name
    return getEntityName(agreement);
};

// Helper function to extract contact email
const getContactEmail = (agreement: IAgreementPaginatedData): string => {
    // Backend returns flattened fields with _contact_email suffix
    return agreement.vendor_contact_email ||
           agreement.consultant_contact_email ||
           agreement.consultant_email ||
           agreement.facilitator_contact_email ||
           agreement.facilitator_email ||
           agreement.adhoc_staff_contact_email ||
           agreement.adhoc_staff_email ||
           '-';
};

// Helper function to extract contact phone
const getContactPhone = (agreement: IAgreementPaginatedData): string => {
    // Backend returns flattened fields with _contact_phone suffix
    return agreement.vendor_contact_phone ||
           agreement.consultant_contact_phone ||
           agreement.consultant_phone ||
           agreement.facilitator_contact_phone ||
           agreement.facilitator_phone ||
           agreement.adhoc_staff_contact_phone ||
           agreement.adhoc_staff_phone ||
           '-';
};

// Helper function to get location name
const getLocationName = (agreement: IAgreementPaginatedData): string => {
    // Backend returns flattened location_name field
    return agreement.location_name || '-';
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
const getMonth = (agreement: IAgreementPaginatedData): string => {
    // Backend provides start_month field
    return agreement.start_month || 'N/A';
};

// Helper function to get year from date
const getYear = (agreement: IAgreementPaginatedData): string => {
    // Backend provides start_year field
    return agreement.start_year?.toString() || 'N/A';
};

export const agreementColumns: ColumnDef<IAgreementPaginatedData>[] = [
    {
        header: "Agreement Type",
        id: "service_type_display",
        accessorKey: "service_type_display",
        size: 150,
        cell: ({ row }) => {
            // Backend returns service_type_display like "Sla", "Consultant", "Adhoc Staff"
            return row.original.service_type_display || '-';
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
            const serviceTypeDisplay = row.original.service_type_display;

            // For staff-based agreements (Adhoc Staff, Consultant, Facilitator), show the agreement type
            if (serviceTypeDisplay === 'Adhoc Staff' || serviceTypeDisplay === 'Consultant' || serviceTypeDisplay === 'Facilitator') {
                return serviceTypeDisplay;
            }

            // For vendor-based agreements (SLA, Security, Insurance, etc.), show the service name
            // Check if backend provided service_name field (flattened)
            if (row.original.service_name) {
                return row.original.service_name;
            }
            // Check if backend provided expanded service details (_details suffix)
            if (row.original.service_details) {
                return row.original.service_details.name;
            }
            // Check if service field itself is an object (in-place expansion)
            if (row.original.service && typeof row.original.service === 'object') {
                return row.original.service.name || row.original.service.service_name;
            }
            // Fallback: Display a message that backend needs to add the field for vendor services
            if (row.original.service && typeof row.original.service === 'string') {
                return `⚠️ Service ID: ${row.original.service.substring(0, 8)}... (Name field pending)`;
            }
            // If no service, return the service type display as fallback
            return serviceTypeDisplay || '-';
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
            if (!cost || cost === '0' || cost === 0) return '-';
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
        id: "start_month",
        size: 120,
        cell: ({ row }) => getMonth(row.original),
    },

    {
        header: "Year",
        id: "start_year",
        size: 100,
        cell: ({ row }) => getYear(row.original),
    },

    {
        header: "Status",
        id: "status",
        accessorKey: "status",
        size: 120,
        cell: ({ row }) => {
            const status = row.original.status || 'DRAFT';
            const statusDisplay = row.original.status_display || status;
            return (
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                    status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                    status === 'EXPIRED' ? 'bg-red-100 text-red-800' :
                    status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                    status === 'DRAFT' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                }`}>
                    {statusDisplay}
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

const TableMenu = ({ id, status }: IAgreementPaginatedData) => {
    const [isDialogOpen, setDialogOpen] = useState(false);
    const { deleteAgreement, isLoading } = useDeleteAgreement(id);

    // Allow editing for all agreements except TERMINATED
    // Users can edit to correct information or update details
    const canEdit = status !== 'TERMINATED';
    const canDelete = status === 'DRAFT' || !status; // Only delete drafts

    const handleDelete = async () => {
        try {
            await deleteAgreement();
            toast.success("Agreement Deleted");
            setDialogOpen(false);
        } catch (error: any) {
            toast.error(error.data?.message ?? "Something went wrong");
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
                            href={CG_ROUTES.VIEW_AGREEMENT.replace(':id', id)}
                        >
                            <Button
                                className="w-full flex items-center justify-start gap-2"
                                variant="ghost"
                            >
                                <EyeIcon />
                                View
                            </Button>
                        </Link>
                        {canEdit && (
                            <Link
                                href={`${CG_ROUTES.CREATE_AGREEMENT_DETAILS}?id=${id}`}
                            >
                                <Button
                                    className="w-full flex items-center justify-start gap-2"
                                    variant="ghost"
                                >
                                    <PencilIcon />
                                    Edit
                                </Button>
                            </Link>
                        )}
                        {canDelete && (
                            <Button
                                className="w-full flex items-center justify-start gap-2"
                                variant="ghost"
                                onClick={() => setDialogOpen(true)}
                            >
                                <DeleteIcon />
                                Delete
                            </Button>
                        )}
                    </PopoverContent>
                </Popover>
            </>

            <ConfirmationDialog
                open={isDialogOpen}
                title="Are you sure you want to delete this agreement?"
                loading={isLoading}
                onCancel={() => setDialogOpen(false)}
                onOk={handleDelete}
            />
        </div>
    );
};
