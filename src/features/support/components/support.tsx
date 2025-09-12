import { ColumnDef } from "@tanstack/react-table"; 
import EyeIcon from "components/icons/EyeIcon"; 
import { Badge } from "components/ui/badge";
import { Button } from "components/ui/button"; 
import { AdminRoutes, RouteEnum } from "constants/RouterConstants"; 
import { TSupportPaginatedData } from "../types/support/support";
import { cn } from "lib/utils";
import { useState } from "react";
import Link from "next/link";

export const supportColumn: ColumnDef<TSupportPaginatedData>[] = [
    {
        header: "User",
        id: "user",
        cell: ({ row }) => {
            const email = row.original.email;
            const sender = row.original.sender;
            
            // Extract name from email if sender is not available
            const displayName = sender && sender !== 'N/A' 
                ? sender 
                : email ? email.split('@')[0] : 'Unknown User';
            
            return (
                <div>
                    <p className="font-medium">{displayName}</p>
                    <p className="text-sm text-gray-500">{email}</p>
                </div>
            );
        },
    },

    {
        header: "Department",
        id: "department",
        cell: ({ row }) => {
            const department = row.original.department;
            return (
                <div className="px-2 py-1 bg-gray-100 rounded-md text-sm">
                    {department || 'N/A'}
                </div>
            );
        },
    },

    {
        header: "Subject",
        id: "subject",
        accessorKey: "subject",
    },
    {
        header: "Date",
        id: "created_datetime",
        cell: ({ row }) => {
            const dateString = row.original.created_datetime;
            if (!dateString) return 'N/A';
            
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return 'Invalid Date';
            
            return date.toLocaleDateString("en-US");
        },
    },
    {
        header: "Priority",
        id: "priority",
        accessorKey: `priority`,
         cell: ({ getValue }) => {
                        return (
                            <Badge
                                variant="default"
                                className={cn(
                                    "p-1 rounded-lg",
                                    getValue() === "LOW" &&
                                        "bg-green-200 text-green-500",
                                    
                                    getValue() === "MEDIUM" &&
                                        "bg-yellow-200 text-yellow-500",
                                    getValue() === "HIGH" &&
                                        "text-red-500 bg-red-200"
                                )}
                            >
                                {getValue() as string}
                            </Badge>
                        );
                    },
    }, 

    {
        header: "Status",
        id: "status",
        accessorKey: `status`,
         cell: ({ getValue }) => {
                        return (
                            <Badge
                                variant="default"
                                className={cn(
                                    "p-1 rounded-lg",
                                    getValue() === "RESOLVED" &&
                                        "bg-green-200 text-green-500",
                                    
                                    getValue() === "PENDING" &&
                                        "bg-yellow-200 text-yellow-500",
                                    getValue() === "IN_PROGRESS" &&
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
        cell: ({ row }) => <TableAction {...row.original} />,
    },
];

const TableAction = ({ id }: TSupportPaginatedData) => {
     

    

    return (
        <div className="flex items-center gap-2">
            <Link href={RouteEnum.SUPPORT_DETAILS.replace(':id', id)}>
                <Button
                    className="w-full flex items-center justify-start gap-2"
                    variant="ghost"
                >
                    <EyeIcon />
                    View
                </Button>
            </Link>
        </div>
    );
};
