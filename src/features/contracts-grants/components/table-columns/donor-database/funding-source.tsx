"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { Button } from "components/ui/button";
import MoreOptionsHorizontalIcon from "components/icons/MoreOptionsHorizontalIcon";
import { CG_ROUTES } from "constants/RouterConstants";
import EyeIcon from "components/icons/EyeIcon";
import { FundingSourceData } from "@/features/modules/types/project";

export const fundingSourceColumns: ColumnDef<FundingSourceData>[] = [
    {
        header: "Donor Name",
        id: "name",
        accessorKey: "name",
        size: 200,
    },

    {
        header: "Donor Email",
        id: "contact_email",
        accessorKey: "email_donor",
        size: 200,
        cell: ({ row }) => {
            const data = row.original as any;
            return data.contact_information?.email || data.email_donor || "N/A";
        },
    },

    {
        header: "Donor Address",
        id: "contact_address",
        accessorKey: "address_donor",
        size: 200,
        cell: ({ row }) => {
            const data = row.original as any;
            return data.contact_information?.address || data.address_donor || "N/A";
        },
    },

    {
        header: "Donor Contact Person",
        id: "contact_person",
        accessorKey: "contact_person_name",
        size: 200,
        cell: ({ row }) => {
            const data = row.original as any;
            return data.contact_information?.contact_person || data.contact_person_name || "N/A";
        },
    },

    {
        header: "Donor Contact Person Email",
        id: "contact_person_email",
        accessorKey: "email_contact_person",
        size: 200,
        cell: ({ row }) => {
            const data = row.original as any;
            return data.contact_information?.email || data.email_contact_person || "N/A";
        },
    },

    {
        header: "Donor Contact Person Phone Number",
        id: "contact_phone",
        accessorKey: "contact_person_phone",
        size: 200,
        cell: ({ row }) => {
            const data = row.original as any;
            return data.contact_information?.phone || data.contact_person_phone || "N/A";
        },
    },

    {
        header: "",
        id: "action",
        cell: ({ row }) => <TableMenu {...row.original} />,
    },
];

const TableMenu = ({ id }: FundingSourceData) => {
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
                            className="w-full"
                            href={`/dashboard/c-and-g/donor-database/${id}`}
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
            </>
        </div>
    );
};
