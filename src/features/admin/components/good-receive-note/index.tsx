"use client";

import AddSquareIcon from "@/components/icons/AddSquareIcon";
import Card from "@/components/Card";
import {
    getPendingGRNColumns,
    getApprovedGRNColumns
} from "@/features/admin/components/table-columns/inventory-management/good-receive-note";
import DataTable from "@/components/Table/DataTable";
import TableFilters from "@/components/Table/TableFilters";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import Link from "next/link";
import { useGetAllGoodReceiveNoteQuery } from "@/features/admin/controllers/goodReceiveNoteController";

export default function GoodReceiveNoteHomePage() {
    const [pendingPage, setPendingPage] = useState(1);
    const [approvedPage, setApprovedPage] = useState(1);
    const [activeTab, setActiveTab] = useState("pending");

    // Fetch pending GRNs - server-side filtering via controller
    const { data: pendingData, isFetching: isPendingLoading } = useGetAllGoodReceiveNoteQuery({
        page: pendingPage,
        size: 20,
        status: "pending", // Controller handles this as approved_datetime__isnull=true & rejected_datetime__isnull=true
        enabled: activeTab === "pending",
    });

    // Fetch approved/received GRNs - server-side filtering via controller
    const { data: approvedData, isFetching: isApprovedLoading } = useGetAllGoodReceiveNoteQuery({
        page: approvedPage,
        size: 20,
        status: "approved", // Controller handles this as approved_datetime__isnull=false
        enabled: activeTab === "approved",
    });

    // Extract results safely
    const pendingGRNs = pendingData?.data?.results || [];
    const approvedGRNs = approvedData?.data?.results || [];

    return (
        <div className="space-y-10">
            <div className="flex justify-end">
                <Link href="/dashboard/admin/good-receive-note/create">
                    <Button>
                        <AddSquareIcon />
                        Add GRN
                    </Button>
                </Link>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="pending">
                        Good Receipt Notes ({pendingData?.data?.paginator?.count ?? 0})
                    </TabsTrigger>
                    <TabsTrigger value="approved">
                        Approved/Accepted Goods Receipt Notes ({approvedData?.data?.paginator?.count ?? 0})
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="pending" className="space-y-4">
                    <Card>
                        <TableFilters>
                            <DataTable
                                columns={getPendingGRNColumns()}
                                data={pendingGRNs}
                                isLoading={isPendingLoading}
                                pagination={{
                                    total: pendingData?.data?.paginator?.count ?? 0,
                                    pageSize: 20,
                                    onChange: (page: number) => setPendingPage(page),
                                }}
                            />
                        </TableFilters>
                    </Card>
                </TabsContent>

                <TabsContent value="approved" className="space-y-4">
                    <Card>
                        <TableFilters>
                            <DataTable
                                columns={getApprovedGRNColumns()}
                                data={approvedGRNs}
                                isLoading={isApprovedLoading}
                                pagination={{
                                    total: approvedData?.data?.paginator?.count ?? 0,
                                    pageSize: 20,
                                    onChange: (page: number) => setApprovedPage(page),
                                }}
                            />
                        </TableFilters>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
