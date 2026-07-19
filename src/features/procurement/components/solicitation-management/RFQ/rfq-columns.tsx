"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@iconify/react";
import { ArrowUpDown, Eye, Edit, Trash2 } from "lucide-react";
import { format, parseISO, differenceInDays } from "date-fns";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { RouteEnum } from "@/constants/RouterConstants";

export type RFQData = {
  id: string;
  rfq_id: string;
  title: string;
  tender_type: string;
  request_type: string;
  status: string;
  opening_date: string;
  closing_date: string;
  eoi_tender?: {
    id: string;
    eoi_number: string;
    name: string;
  };
  solicitation_items?: any[];
};

interface RFQColumnsProps {
  onEdit?: (id: string) => void;
  onView?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export const createRFQColumns = ({
  onEdit,
  onView,
  onDelete,
}: RFQColumnsProps): ColumnDef<RFQData>[] => [
  {
    accessorKey: "rfq_id",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="hover:bg-transparent"
      >
        RFQ Number
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const rfqId = row.getValue("rfq_id") as string;
      return (
        <div className="flex items-center gap-2">
          <Icon icon="ooui:reference" fontSize={16} className="text-gray-500" />
          <span className="font-mono text-sm font-medium">{rfqId}</span>
        </div>
      );
    },
    size: 180,
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => {
      const title = row.getValue("title") as string;
      return (
        <div className="max-w-md">
          <p className="font-medium truncate">{title}</p>
        </div>
      );
    },
    size: 300,
  },
  {
    accessorKey: "tender_type",
    header: "Tender Type",
    cell: ({ row }) => {
      const tenderType = row.getValue("tender_type") as string;
      return (
        <Badge
          variant="outline"
          className={cn(
            "px-3 py-1",
            tenderType === "NATIONAL OPEN TENDER" && "bg-blue-50 text-blue-700 border-blue-200",
            tenderType === "SINGLE SOURCE" && "bg-purple-50 text-purple-700 border-purple-200",
            tenderType === "CLOSED SOURCE" && "bg-indigo-50 text-indigo-700 border-indigo-200",
            tenderType === "INTERNATIONAL OPEN TENDER" && "bg-teal-50 text-teal-700 border-teal-200"
          )}
        >
          {tenderType}
        </Badge>
      );
    },
    size: 220,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge
          variant="outline"
          className={cn(
            "px-3 py-1",
            status === "OPEN" && "bg-green-50 text-green-700 border-green-200",
            status === "CLOSED" && "bg-red-50 text-red-700 border-red-200",
            status === "IN_PROGRESS" && "bg-yellow-50 text-yellow-700 border-yellow-200"
          )}
        >
          <span className="mr-1">
            {status === "OPEN" && "🟢"}
            {status === "CLOSED" && "🔴"}
            {status === "IN_PROGRESS" && "🟡"}
          </span>
          {status}
        </Badge>
      );
    },
    size: 130,
  },
  {
    accessorKey: "opening_date",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="hover:bg-transparent"
      >
        Opening Date
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const date = row.getValue("opening_date") as string;
      if (!date) return <span className="text-gray-400">-</span>;
      try {
        return (
          <span className="text-sm">
            {format(parseISO(date), "MMM dd, yyyy")}
          </span>
        );
      } catch {
        return <span className="text-gray-400">Invalid date</span>;
      }
    },
    size: 140,
  },
  {
    accessorKey: "closing_date",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="hover:bg-transparent"
      >
        Closing Date
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const date = row.getValue("closing_date") as string;
      const status = row.getValue("status") as string;

      if (!date) return <span className="text-gray-400">-</span>;

      try {
        const closingDate = parseISO(date);
        const today = new Date();
        const daysRemaining = differenceInDays(closingDate, today);
        const isClosingSoon = daysRemaining > 0 && daysRemaining <= 7 && status === "OPEN";
        const isPastDue = daysRemaining < 0 && status === "OPEN";

        return (
          <div className="flex flex-col">
            <span className={cn(
              "text-sm",
              isClosingSoon && "text-orange-600 font-medium",
              isPastDue && "text-red-600 font-medium"
            )}>
              {format(closingDate, "MMM dd, yyyy")}
            </span>
            {isClosingSoon && (
              <span className="text-xs text-orange-600">
                {daysRemaining} day{daysRemaining !== 1 ? 's' : ''} left
              </span>
            )}
            {isPastDue && (
              <span className="text-xs text-red-600">
                {Math.abs(daysRemaining)} day{Math.abs(daysRemaining) !== 1 ? 's' : ''} overdue
              </span>
            )}
          </div>
        );
      } catch {
        return <span className="text-gray-400">Invalid date</span>;
      }
    },
    size: 140,
  },
  {
    id: "items_count",
    header: "BOQ Items",
    cell: ({ row }) => {
      const items = row.original.solicitation_items;
      const count = items?.length || 0;
      return (
        <div className="flex items-center gap-1">
          <Icon icon="ph:package-duotone" fontSize={16} className="text-gray-500" />
          <span className="text-sm">{count}</span>
        </div>
      );
    },
    size: 100,
  },
  {
    id: "eoi_link",
    header: "Linked EOI",
    cell: ({ row }) => {
      const eoi = row.original.eoi_tender;
      if (!eoi) {
        return <span className="text-xs text-gray-400">-</span>;
      }
      return (
        <Link href={`/dashboard/procurement/vendor-management/eoi/${eoi.id}`}>
          <Badge variant="outline" className="hover:bg-gray-50 cursor-pointer text-xs">
            <Icon icon="mdi:link-variant" className="mr-1" fontSize={12} />
            {eoi.eoi_number}
          </Badge>
        </Link>
      );
    },
    size: 150,
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const rfq = row.original;
      return (
        <div className="flex items-center gap-2">
          <Link href={RouteEnum.RFQ_DETAILS.replace(":id", rfq.id)}>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Eye className="h-4 w-4" />
            </Button>
          </Link>
          {onEdit && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => onEdit(rfq.id)}
            >
              <Edit className="h-4 w-4" />
            </Button>
          )}
          {onDelete && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={() => onDelete(rfq.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      );
    },
    size: 120,
  },
];
