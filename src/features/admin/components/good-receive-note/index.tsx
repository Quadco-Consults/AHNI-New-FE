"use client";

import AddSquareIcon from "@/components/icons/AddSquareIcon";
import Card from "@/components/Card";
import {
    goodReceiveNoteColumns,
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

    // Fetch pending GRNs with proper server-side filtering
    const { data: pendingData, isFetching: isPendingLoading, refetch: refetchPending } = useGetAllGoodReceiveNoteQuery({
        page: pendingPage,
        size: 20,
        enabled: activeTab === "pending",
    });

    // Fetch approved GRNs with proper server-side filtering
    const { data: approvedData, isFetching: isApprovedLoading, refetch: refetchApproved } = useGetAllGoodReceiveNoteQuery({
        page: approvedPage,
        size: 20,
        status: "approved",
        enabled: activeTab === "approved",
    });

    // Filter GRNs based on status
    const pendingGRNs = (pendingData?.data.results || []).filter(grn => {
        if (grn.status) {
          return ['pending', 'confirmed'].includes(grn.status);
        }
        return !grn.approved_datetime && !grn.rejected_datetime;
    });

    const approvedGRNs = (approvedData?.data.results || []).filter(grn => {
        if (grn.status) {
          return ['received', 'approved', 'rejected'].includes(grn.status);
        }
        return grn.approved_datetime || grn.rejected_datetime;
    });

    const isLoading = isPendingLoading || isApprovedLoading;

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
                        Good Receipt Notes ({pendingGRNs.length})
                    </TabsTrigger>
                    <TabsTrigger value="approved">
                        Approved/Accepted Goods Receipt Notes ({approvedGRNs.length})
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
                                    total: pendingData?.data.paginator.count ?? 0,
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
                                    total: approvedData?.data.paginator.count ?? 0,
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
