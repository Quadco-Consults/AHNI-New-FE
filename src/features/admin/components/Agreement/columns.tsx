import { ColumnDef } from "@tanstack/react-table";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import MoreOptionsHorizontalIcon from "@/components/icons/MoreOptionsHorizontalIcon";
import EyeIcon from "@/components/icons/EyeIcon";
import Link from "next/link";
import { IAgreementPaginatedData } from "@/features/contracts-grants/types/contract-management/agreement";
import { CG_ROUTES } from "@/constants/RouterConstants";

// Helper function to extract entity name based on agreement type
const getEntityName = (agreement: IAgreementPaginatedData): string => {
    if (agreement.entity_name) {
        return agreement.entity_name;
    }

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

    const serviceType = agreement.service_type_display;
    if (serviceType === 'Consultant' || serviceType === 'Adhoc Staff' || serviceType === 'Facilitator') {
        return `⚠️ ${serviceType} (Name field pending)`;
    }

    return agreement.service_type_display || '-';
};

const getContactPerson = (agreement: IAgreementPaginatedData): string => {
    if (agreement.vendor_contact_person) {
        return agreement.vendor_contact_person;
    }
    return getEntityName(agreement);
};

const getContactEmail = (agreement: IAgreementPaginatedData): string => {
    return agreement.vendor_contact_email ||
           agreement.consultant_contact_email ||
           agreement.consultant_email ||
           agreement.facilitator_contact_email ||
           agreement.facilitator_email ||
           agreement.adhoc_staff_contact_email ||
           agreement.adhoc_staff_email ||
           '-';
};

const getContactPhone = (agreement: IAgreementPaginatedData): string => {
    return agreement.vendor_contact_phone ||
           agreement.consultant_contact_phone ||
           agreement.consultant_phone ||
           agreement.facilitator_contact_phone ||
           agreement.facilitator_phone ||
           agreement.adhoc_staff_contact_phone ||
           agreement.adhoc_staff_phone ||
           '-';
};

const getLocationName = (agreement: IAgreementPaginatedData): string => {
    return agreement.location_name || '-';
};

const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return 'N/A';
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch {
        return dateString;
    }
};

const getMonth = (agreement: IAgreementPaginatedData): string => {
    return agreement.start_month || 'N/A';
};

const getYear = (agreement: IAgreementPaginatedData): string => {
    return agreement.start_year?.toString() || 'N/A';
};

/**
 * Admin view-only columns for agreements
 * Only shows View action - no Edit or Delete permissions
 */
export const adminAgreementColumns: ColumnDef<IAgreementPaginatedData>[] = [
    {
        header: "Agreement Type",
        id: "service_type_display",
        accessorKey: "service_type_display",
        size: 150,
        cell: ({ row }) => {
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

            if (serviceTypeDisplay === 'Adhoc Staff' || serviceTypeDisplay === 'Consultant' || serviceTypeDisplay === 'Facilitator') {
                return serviceTypeDisplay;
            }

            if (row.original.service_name) {
                return row.original.service_name;
            }

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
        cell: ({ row }) => <ViewOnlyMenu agreementId={row.original.id} />,
    },
];

/**
 * View-only menu for admin users
 * Only shows View option - no Edit or Delete
 */
const ViewOnlyMenu = ({ agreementId }: { agreementId: string }) => {
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
                        href={`${CG_ROUTES.VIEW_AGREEMENT.replace(':id', agreementId)}?readonly=true`}
                    >
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
        </div>
    );
};
