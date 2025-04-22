import { ColumnDef } from "@tanstack/react-table"; 
import EyeIcon from "components/icons/EyeIcon"; 
import { Badge } from "components/ui/badge";
import { Button } from "components/ui/button"; 
import { AdminRoutes, RouteEnum } from "constants/RouterConstants"; 
import { TSupportPaginatedData } from "definations/support/support";
import { cn } from "lib/utils";
import { useState } from "react";
import { generatePath, Link } from "react-router-dom"; 
export const supportColumn: ColumnDef<TSupportPaginatedData>[] = [
    {
        header: "User",
        id: "user",
        accessorKey: "user",
    },

    {
        header: "Email",
        id: "email",
        accessorKey: "email", 
    },

    {
        header: "Subject",
        id: "subject",
        accessorKey: "subject",
    },
    {
        header: "Date",
        id: "created_datetime",
        accessorKey: "created_datetime",
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
                    <Link
                            to={generatePath(
                                 RouteEnum.SUPPORT_DETAILS, 
                                {id: id},)
                                 
                            }
                        >
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
