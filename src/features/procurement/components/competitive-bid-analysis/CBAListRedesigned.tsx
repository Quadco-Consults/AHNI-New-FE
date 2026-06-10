"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import {
  Plus,
  Search,
  Filter,
  Eye,
  FileText,
  CheckCircle2,
  Clock,
  XCircle,
  Users,
  TrendingUp,
  MoreHorizontal,
  Calendar,
  Building2
} from "lucide-react";
import { Icon } from "@iconify/react";

import Card from "@/components/Card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import DataTable from "@/components/Table/DataTable";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { RouteEnum } from "@/constants/RouterConstants";
import { useGetAllCbas } from "@/features/procurement/controllers/cbaController";
import { CbaResultsData } from "@/features/procurement/types/cba";
import { CBALoadingState } from "./LoadingStates";

/**
 * Status badge with consistent styling
 */
const StatusBadge = ({ status }: { status: string }) => {
  const statusConfig = {
    DRAFT: { color: "bg-slate-100 text-slate-700 border-slate-300", icon: FileText },
    PENDING: { color: "bg-amber-100 text-amber-700 border-amber-300", icon: Clock },
    COMMITTEE_REVIEW: { color: "bg-blue-100 text-blue-700 border-blue-300", icon: Users },
    APPROVED: { color: "bg-emerald-100 text-emerald-700 border-emerald-300", icon: CheckCircle2 },
    REJECTED: { color: "bg-red-100 text-red-700 border-red-300", icon: XCircle },
    COMPLETED: { color: "bg-green-100 text-green-700 border-green-300", icon: CheckCircle2 },
  };

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;
  const StatusIcon = config.icon;

  return (
    <Badge
      variant="outline"
      className={cn(
        "px-3 py-1 font-medium border flex items-center gap-1.5 w-fit",
        config.color
      )}
    >
      <StatusIcon className="w-3.5 h-3.5" />
      {status.replace(/_/g, " ")}
    </Badge>
  );
};

/**
 * CBA Type badge
 */
const TypeBadge = ({ type }: { type: string }) => {
  const isCommittee = type === "COMMITTEE";
  return (
    <Badge
      variant="outline"
      className={cn(
        "px-3 py-1 font-medium border",
        isCommittee
          ? "bg-purple-50 text-purple-700 border-purple-200"
          : "bg-gray-50 text-gray-700 border-gray-200"
      )}
    >
      {isCommittee && <Users className="w-3.5 h-3.5 mr-1" />}
      {type}
    </Badge>
  );
};

/**
 * Summary stat card
 */
interface StatCardProps {
  title: string;
  value: number;
  icon: React.ElementType;
  color: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const StatCard = ({ title, value, icon: Icon, color, trend }: StatCardProps) => {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-slate-900">{value}</p>
          {trend && (
            <div className={cn(
              "flex items-center gap-1 mt-2 text-sm font-medium",
              trend.isPositive ? "text-emerald-600" : "text-red-600"
            )}>
              <TrendingUp className={cn(
                "w-4 h-4",
                !trend.isPositive && "rotate-180"
              )} />
              <span>{trend.value}% from last month</span>
            </div>
          )}
        </div>
        <div className={cn(
          "w-14 h-14 rounded-full flex items-center justify-center",
          color
        )}>
          <Icon className="w-7 h-7 text-white" />
        </div>
      </div>
    </Card>
  );
};

/**
 * Main CBA List Component - Redesigned
 */
const CBAListRedesigned = () => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<string | null>(null);

  const { data, isLoading } = useGetAllCbas({
    page,
    size: 10,
  });

  // Calculate summary statistics
  const stats = useMemo(() => {
    const results = data?.data?.results || [];
    return {
      total: results.length,
      pending: results.filter((r: any) => r.status === "PENDING").length,
      approved: results.filter((r: any) => r.status === "APPROVED").length,
      committee: results.filter((r: any) => r.cba_type === "COMMITTEE").length,
    };
  }, [data]);

  // Filter data based on search and filters
  const filteredData = useMemo(() => {
    let results = data?.data?.results || [];

    if (searchQuery) {
      results = results.filter((item: any) =>
        item.solicitation?.rfq_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.solicitation?.title?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter) {
      results = results.filter((item: any) => item.status === statusFilter);
    }

    if (typeFilter) {
      results = results.filter((item: any) => item.cba_type === typeFilter);
    }

    return results;
  }, [data, searchQuery, statusFilter, typeFilter]);

  if (isLoading) {
    return <CBALoadingState message="Loading competitive bid analyses..." />;
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Competitive Bid Analysis</h1>
          <p className="text-sm text-slate-600 mt-1">
            Manage and review competitive bidding processes
          </p>
        </div>
        <Link href={RouteEnum.RFQ_CREATE_CBA}>
          <Button size="lg" className="gap-2">
            <Plus className="w-4 h-4" />
            Create New CBA
          </Button>
        </Link>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total CBAs"
          value={stats.total}
          icon={FileText}
          color="bg-slate-600"
        />
        <StatCard
          title="Pending Review"
          value={stats.pending}
          icon={Clock}
          color="bg-amber-500"
        />
        <StatCard
          title="Approved"
          value={stats.approved}
          icon={CheckCircle2}
          color="bg-emerald-500"
        />
        <StatCard
          title="Committee Type"
          value={stats.committee}
          icon={Users}
          color="bg-purple-500"
        />
      </div>

      {/* Filters and Search */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by RFQ number or title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="w-4 h-4" />
                Status: {statusFilter || "All"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => setStatusFilter(null)}>
                All Statuses
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("DRAFT")}>
                Draft
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("PENDING")}>
                Pending
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("APPROVED")}>
                Approved
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("REJECTED")}>
                Rejected
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("COMPLETED")}>
                Completed
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Type Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Building2 className="w-4 h-4" />
                Type: {typeFilter || "All"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => setTypeFilter(null)}>
                All Types
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTypeFilter("COMMITTEE")}>
                Committee
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTypeFilter("NON_COMMITTEE")}>
                Non-Committee
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Active Filters Display */}
        {(searchQuery || statusFilter || typeFilter) && (
          <div className="flex items-center gap-2 mt-4 pt-4 border-t">
            <span className="text-sm text-slate-600">Active filters:</span>
            {searchQuery && (
              <Badge variant="secondary" className="gap-1">
                Search: {searchQuery}
                <button
                  onClick={() => setSearchQuery("")}
                  className="ml-1 hover:bg-slate-300 rounded-full p-0.5"
                >
                  <XCircle className="w-3 h-3" />
                </button>
              </Badge>
            )}
            {statusFilter && (
              <Badge variant="secondary" className="gap-1">
                Status: {statusFilter}
                <button
                  onClick={() => setStatusFilter(null)}
                  className="ml-1 hover:bg-slate-300 rounded-full p-0.5"
                >
                  <XCircle className="w-3 h-3" />
                </button>
              </Badge>
            )}
            {typeFilter && (
              <Badge variant="secondary" className="gap-1">
                Type: {typeFilter}
                <button
                  onClick={() => setTypeFilter(null)}
                  className="ml-1 hover:bg-slate-300 rounded-full p-0.5"
                >
                  <XCircle className="w-3 h-3" />
                </button>
              </Badge>
            )}
          </div>
        )}
      </Card>

      {/* CBA Table */}
      <Card className="overflow-hidden">
        <DataTable
          data={filteredData}
          columns={columns}
          isLoading={isLoading}
          pagination={{
            total: data?.data?.pagination?.count ?? 0,
            pageSize: data?.data?.pagination?.page_size ?? 10,
            onChange: (page: number) => setPage(page),
          }}
        />
      </Card>
    </div>
  );
};

export default CBAListRedesigned;

/**
 * Table Columns Definition
 */
const columns: ColumnDef<CbaResultsData>[] = [
  {
    id: "select",
    size: 50,
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all rows"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label={`Select row ${row.index + 1}`}
      />
    ),
  },
  {
    header: "RFQ Details",
    accessorKey: "solicitation",
    size: 350,
    cell: ({ row }) => {
      const rfqId = row.original?.solicitation?.rfq_id;
      const title = row.original?.solicitation?.title;
      return (
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-slate-400" />
            <span className="font-semibold text-slate-900">{rfqId || "N/A"}</span>
          </div>
          {title && (
            <p className="text-sm text-slate-600 line-clamp-1">{title}</p>
          )}
        </div>
      );
    },
  },
  {
    header: "Type",
    accessorKey: "cba_type",
    size: 150,
    cell: ({ getValue }) => <TypeBadge type={getValue() as string} />,
  },
  {
    header: "Status",
    accessorKey: "status",
    size: 180,
    cell: ({ getValue }) => <StatusBadge status={getValue() as string} />,
  },
  {
    header: "CBA Date",
    accessorKey: "cba_date",
    size: 150,
    cell: ({ getValue }) => {
      const date = getValue() as string;
      if (!date) return <span className="text-slate-400">—</span>;
      return (
        <div className="flex items-center gap-2 text-slate-700">
          <Calendar className="w-4 h-4 text-slate-400" />
          <span>{new Date(date).toLocaleDateString()}</span>
        </div>
      );
    },
  },
  {
    header: "Actions",
    id: "actions",
    size: 100,
    cell: ({ row }) => <CBAActions data={row.original} />,
  },
];

/**
 * Actions dropdown for each CBA row
 */
const CBAActions = ({ data }: { data: CbaResultsData }) => {
  const router = useRouter();

  const handleViewDetails = () => {
    router.push(`/dashboard/procurement/competitive-bid-analysis/${data.id}/details`);
  };

  const handleViewAnalysis = () => {
    router.push(
      `/dashboard/procurement/competitive-bid-analysis/${data.id}/vendor-analysis?id=${data.solicitation?.id}&cba=${data.id}`
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={handleViewDetails} className="gap-2">
          <Eye className="w-4 h-4" />
          View Details
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleViewAnalysis} className="gap-2">
          <Users className="w-4 h-4" />
          Vendor Analysis
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
