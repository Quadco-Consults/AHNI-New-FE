"use client";

import * as React from "react";
import { DataTableAdvanced } from "@/components/DataTableAdvanced";
import { createEOIColumns } from "./eoi-columns";
import { EOIResultsData } from "@/features/procurement/types/eoi";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface EOIDataTableProps {
  data: EOIResultsData[];
  onEdit: (eoi: EOIResultsData) => void;
  onView: (id: string) => void;
  onDelete: (id: string) => void;
}

export function EOIDataTable({
  data,
  onEdit,
  onView,
  onDelete,
}: EOIDataTableProps) {
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [typeFilter, setTypeFilter] = React.useState<string>("all");

  // Calculate stats
  const stats = React.useMemo(() => {
    const total = data.length;
    const open = data.filter((eoi) => eoi.status === "OPEN").length;
    const inProgress = data.filter(
      (eoi) => eoi.status === "IN_PROGRESS"
    ).length;
    const closed = data.filter((eoi) => eoi.status === "CLOSED").length;
    const newVendor = data.filter((eoi) => eoi.type === "NEW_VENDOR").length;
    const openTender = data.filter((eoi) => eoi.type === "OPEN_TENDER").length;

    return {
      total,
      open,
      inProgress,
      closed,
      newVendor,
      openTender,
    };
  }, [data]);

  // Filter data based on selected filters
  const filteredData = React.useMemo(() => {
    let filtered = data;

    if (statusFilter !== "all") {
      filtered = filtered.filter((eoi) => eoi.status === statusFilter);
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter((eoi) => eoi.type === typeFilter);
    }

    return filtered;
  }, [data, statusFilter, typeFilter]);

  // Create columns with callbacks
  const columns = React.useMemo(
    () => createEOIColumns({ onEdit, onView, onDelete }),
    [onEdit, onView, onDelete]
  );

  const hasActiveFilters = statusFilter !== "all" || typeFilter !== "all";

  const clearFilters = () => {
    setStatusFilter("all");
    setTypeFilter("all");
  };

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        <Card className="p-4 space-y-1">
          <div className="text-2xl font-bold">{stats.total}</div>
          <div className="text-sm text-muted-foreground">Total EOIs</div>
        </Card>
        <Card
          className="p-4 space-y-1 cursor-pointer hover:border-green-300 transition-colors"
          onClick={() =>
            setStatusFilter(statusFilter === "OPEN" ? "all" : "OPEN")
          }
        >
          <div className="text-2xl font-bold text-green-700">
            {stats.open}
          </div>
          <div className="text-sm text-muted-foreground flex items-center gap-1">
            <span className="text-lg">🟢</span> Open
          </div>
        </Card>
        <Card
          className="p-4 space-y-1 cursor-pointer hover:border-yellow-300 transition-colors"
          onClick={() =>
            setStatusFilter(
              statusFilter === "IN_PROGRESS" ? "all" : "IN_PROGRESS"
            )
          }
        >
          <div className="text-2xl font-bold text-yellow-700">
            {stats.inProgress}
          </div>
          <div className="text-sm text-muted-foreground flex items-center gap-1">
            <span className="text-lg">🟡</span> In Progress
          </div>
        </Card>
        <Card
          className="p-4 space-y-1 cursor-pointer hover:border-red-300 transition-colors"
          onClick={() =>
            setStatusFilter(statusFilter === "CLOSED" ? "all" : "CLOSED")
          }
        >
          <div className="text-2xl font-bold text-red-700">
            {stats.closed}
          </div>
          <div className="text-sm text-muted-foreground flex items-center gap-1">
            <span className="text-lg">🔴</span> Closed
          </div>
        </Card>
        <Card className="p-4 space-y-1">
          <div className="text-sm text-muted-foreground mb-1">By Type</div>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span>New Vendor:</span>
              <Badge variant="secondary" className="text-xs">
                {stats.newVendor}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span>Open Tender:</span>
              <Badge variant="secondary" className="text-xs">
                {stats.openTender}
              </Badge>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Status:</label>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="OPEN">🟢 Open</SelectItem>
              <SelectItem value="IN_PROGRESS">🟡 In Progress</SelectItem>
              <SelectItem value="CLOSED">🔴 Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Type:</label>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="NEW_VENDOR">New Vendor</SelectItem>
              <SelectItem value="OPEN_TENDER">Open Tender</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="h-9"
          >
            <X className="h-4 w-4 mr-1" />
            Clear Filters
          </Button>
        )}

        <div className="ml-auto text-sm text-muted-foreground">
          Showing {filteredData.length} of {data.length} EOI
          {data.length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* Data Table */}
      <DataTableAdvanced
        columns={columns}
        data={filteredData}
        searchKey="name"
        searchPlaceholder="Search by title or EOI number..."
        pageSize={10}
      />
    </div>
  );
}
