import { ColumnDef } from "@tanstack/react-table";
import BackNavigation from "atoms/BackNavigation";
import Card from "components/shared/Card";
import DataTable from "components/Table/DataTable";
import TableFilters from "components/Table/TableFilters";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";

const CloseOutDetails: React.FC = () => {
    const columns: ColumnDef<any>[] = [
        {
            header: "Pre-Closeout & Close-Out Activities",
            accessorKey: "key_task",
            size: 300,
            cell: ({ row }) => (
                <p className="capitalize">{row?.original?.key_task}</p>
            ),
        },
        {
            header: "Designation",
            accessorKey: "designation",
            size: 200,
            cell: ({ row }) => <p>{row?.original?.designation}</p>,
        },
        {
            header: "Start Date",
            accessorKey: "start_date",
            size: 200,
            cell: ({ row }) => <p>{row?.original?.start_date}</p>,
        },
        {
            header: "End Date",
            accessorKey: "end_date",
            size: 200,
            cell: ({ row }) => <p>{row?.original?.end_date}</p>,
        },
        {
            header: "Status",
            accessorKey: "status",
            size: 200,
            cell: ({ row }) => <p>{row?.original?.status || "-"}</p>,
        },
        {
            header: "Remarks",
            accessorKey: "remarks",
            size: 150,
            cell: ({ row }) => <p>{row?.original?.remarks}</p>,
        },
    ];

    return (
        <main className="space-y-5">
            <BackNavigation />

            <Tabs defaultValue="summary">
                <TabsList className="ml-10">
                    <TabsTrigger value="summary">MD OFFICE</TabsTrigger>

                    <TabsTrigger value="obligation">FINANCE</TabsTrigger>

                    <TabsTrigger value="performance">ICT</TabsTrigger>

                    <TabsTrigger value="uploads">C&G</TabsTrigger>

                    <TabsTrigger value="activity">PROCUREMENT</TabsTrigger>
                </TabsList>
            </Tabs>
            <Card>
                <TableFilters>
                    <DataTable columns={columns} data={[]} isLoading={false} />
                </TableFilters>
            </Card>
        </main>
    );
};

export default CloseOutDetails;
