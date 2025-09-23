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

    // Fetch all GRNs and filter on frontend to ensure proper separation
    const { data: allGRNData, isFetching: isAllGRNLoading } = useGetAllGoodReceiveNoteQuery({
        page: 1,
        size: 100, // Get more records to ensure we have all data
    });

    // Also fetch with specific status filters as backup
    const { data: pendingData, isFetching: isPendingLoading } = useGetAllGoodReceiveNoteQuery({
        page: pendingPage,
        size: 20,
        status: "pending",
    });

    const { data: approvedData, isFetching: isApprovedLoading } = useGetAllGoodReceiveNoteQuery({
        page: approvedPage,
        size: 20,
        status: "approved",
    });

    // Use all GRNs data for reliable filtering, fallback to specific queries
    const allGRNs = allGRNData?.data.results || [];

    // Filter pending GRNs: pending, confirmed, or no status (fallback to datetime logic)
    const pendingGRNs = allGRNs.length > 0
        ? allGRNs.filter(grn => {
            if (grn.status) {
              return ['pending', 'confirmed'].includes(grn.status);
            }
            // Fallback to datetime logic
            return !grn.approved_datetime && !grn.rejected_datetime;
          })
        : (pendingData?.data.results || []).filter(grn => {
            if (grn.status) {
              return ['pending', 'confirmed'].includes(grn.status);
            }
            return !grn.approved_datetime && !grn.rejected_datetime;
          });

    // Filter approved GRNs: received, approved status or has approved_datetime
    const approvedGRNs = allGRNs.length > 0
        ? allGRNs.filter(grn => {
            if (grn.status) {
              return ['received', 'approved', 'rejected'].includes(grn.status);
            }
            // Fallback to datetime logic
            return grn.approved_datetime || grn.rejected_datetime;
          })
        : (approvedData?.data.results || []).filter(grn => {
            if (grn.status) {
              return ['received', 'approved', 'rejected'].includes(grn.status);
            }
            return grn.approved_datetime || grn.rejected_datetime;
          });

    // Loading state combines all queries
    const isLoading = isAllGRNLoading || isPendingLoading || isApprovedLoading;

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
                                isLoading={isLoading}
                                pagination={{
                                    total: pendingGRNs.length,
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
                                isLoading={isLoading}
                                pagination={{
                                    total: approvedGRNs.length,
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
