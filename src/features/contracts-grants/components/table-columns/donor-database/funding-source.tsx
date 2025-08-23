"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { Button } from "components/ui/button";
import MoreOptionsHorizontalIcon from "components/icons/MoreOptionsHorizontalIcon";
import { CG_ROUTES } from "constants/RouterConstants";
import EyeIcon from "components/icons/EyeIcon";
import { TFundingSourceData } from "@/features/projects/types/project/funding-source";

export const fundingSourceColumns: ColumnDef<TFundingSourceData>[] = [
    {
        header: "Donor Name",
        id: "name",
        accessorKey: "name",
        size: 200,
    },

    {
        header: "Donor Email",
        id: "email",
        accessorKey: "email",
        size: 200,
    },

    {
        header: "Donor Address",
        id: "address",
        accessorKey: "address",
        size: 200,
    },

    {
        header: "Donor Contact Person",
        id: "email",
        accessorKey: "email",
        size: 200,
    },

    {
        header: "Donor Contact Person Email",
        id: "email",
        accessorKey: "email",
        size: 200,
    },

    {
        header: "Donor Contact Person Phone Number",
        id: "email",
        accessorKey: "email",
        size: 200,
    },

    {
        header: "",
        id: "action",
        cell: ({ row }) => <TableMenu {...row.original} />,
    },
];

const TableMenu = ({ id }: TFundingSourceData) => {
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
