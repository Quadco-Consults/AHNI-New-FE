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
        isCommittee ? "bg-blue-50 text-blue-700 border-blue-300" : "bg-purple-50 text-purple-700 border-purple-300"
      )}
    >
      {type}
    </Badge>
  );
};

/**
 * Admin CBA List Component - Filters for SERVICE-related CBAs only
 */
export default function AdminCBA() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<string | null>(null);

  const { data, isLoading } = useGetAllCbas({
    page,
    size: 10,
    job_category: "SERVICES", // Admin department handles services only
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

  // Filter results based on search and filters
  const filteredResults = useMemo(() => {
    const results = data?.data?.results || [];
    return results.filter((cba: any) => {
      const matchesSearch =
        !searchQuery ||
        cba.solicitation_title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cba.solicitation?.rfq_id?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = !statusFilter || cba.status === statusFilter;
      const matchesType = !typeFilter || cba.cba_type === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [data, searchQuery, statusFilter, typeFilter]);

  // Table columns definition
  const columns: ColumnDef<CbaResultsData>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="translate-y-[2px]"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-[2px]"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "solicitation",
      header: "Service RFQ",
      cell: ({ row }) => {
        const rfqId = row.original.solicitation?.rfq_id || "N/A";
        const title = row.original.solicitation_title || "No title";
        return (
          <div className="space-y-1">
            <div className="font-medium text-sm">{rfqId}</div>
            <div className="text-xs text-gray-500 line-clamp-1">{title}</div>
          </div>
        );
      },
    },
    {
      accessorKey: "cba_date",
      header: "CBA Date",
      cell: ({ row }) => {
        const date = row.getValue("cba_date") as string;
        return date ? new Date(date).toLocaleDateString() : "N/A";
      },
    },
    {
      accessorKey: "cba_type",
      header: "Type",
      cell: ({ row }) => {
        const type = row.getValue("cba_type") as string;
        return <TypeBadge type={type} />;
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return <StatusBadge status={status} />;
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const cba = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => router.push(`/dashboard/procurement/competitive-bid-analysis/${cba.id}`)}
              >
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  if (isLoading) {
    return <CBALoadingState />;
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Service Competitive Bid Analysis</h1>
          <p className="text-muted-foreground">
            Manage and review competitive bid analysis for service procurement
          </p>
        </div>
        <Link href={RouteEnum.CBA_CREATE}>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create New CBA
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-blue-50 rounded-lg">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total CBAs</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-amber-50 rounded-lg">
              <Clock className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold">{stats.pending}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-green-50 rounded-lg">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Approved</p>
              <p className="text-2xl font-bold">{stats.approved}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-purple-50 rounded-lg">
              <Users className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Committee</p>
              <p className="text-2xl font-bold">{stats.committee}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters & Search */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by RFQ ID or title..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <select
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            value={statusFilter || ""}
            onChange={(e) => setStatusFilter(e.target.value || null)}
          >
            <option value="">All Statuses</option>
            <option value="DRAFT">Draft</option>
            <option value="PENDING">Pending</option>
            <option value="COMMITTEE_REVIEW">Committee Review</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
            <option value="COMPLETED">Completed</option>
          </select>

          <select
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            value={typeFilter || ""}
            onChange={(e) => setTypeFilter(e.target.value || null)}
          >
            <option value="">All Types</option>
            <option value="INDIVIDUAL">Individual</option>
            <option value="COMMITTEE">Committee</option>
          </select>
        </div>
      </Card>

      {/* Data Table */}
      <Card>
        <DataTable
          columns={columns}
          data={filteredResults}
          onPageChange={setPage}
          currentPage={page}
          totalPages={data?.data?.total_pages || 1}
        />
      </Card>
    </div>
  );
}
