"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Eye, Trash2, ArrowUpDown, MoreHorizontal } from "lucide-react";
import { EOIResultsData } from "@/features/procurement/types/eoi";
import { format, parseISO } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import DeleteIcon from "@/components/icons/DeleteIcon";

interface EOIColumnsProps {
  onEdit: (eoi: EOIResultsData) => void;
  onView: (id: string) => void;
  onDelete: (id: string) => void;
}

export const createEOIColumns = ({
  onEdit,
  onView,
  onDelete,
}: EOIColumnsProps): ColumnDef<EOIResultsData>[] => [
  {
    accessorKey: "eoi_number",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent p-0 h-auto font-medium"
        >
          EOI Number
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="font-medium text-primary">
          {row.getValue("eoi_number")}
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent p-0 h-auto font-medium"
        >
          Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="max-w-[300px]">
          <div className="font-medium">{row.getValue("name")}</div>
          {row.original.description && (
            <div className="text-sm text-muted-foreground line-clamp-2 mt-1">
              {row.original.description}
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "type",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent p-0 h-auto font-medium"
        >
          Type
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const type = row.getValue("type") as string;
      return (
        <Badge
          variant="outline"
          className={
            type === "NEW_VENDOR"
              ? "bg-blue-50 text-blue-700 border-blue-200"
              : "bg-purple-50 text-purple-700 border-purple-200"
          }
        >
          {type === "NEW_VENDOR" ? "New Vendor" : "Open Tender"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent p-0 h-auto font-medium"
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const statusConfig = {
        OPEN: {
          label: "Open",
          className: "bg-green-50 text-green-700 border-green-200",
          icon: "🟢",
        },
        IN_PROGRESS: {
          label: "In Progress",
          className: "bg-yellow-50 text-yellow-700 border-yellow-200",
          icon: "🟡",
        },
        CLOSED: {
          label: "Closed",
          className: "bg-red-50 text-red-700 border-red-200",
          icon: "🔴",
        },
      };

      const config = statusConfig[status as keyof typeof statusConfig] || {
        label: status,
        className: "bg-gray-50 text-gray-700 border-gray-200",
        icon: "⚪",
      };

      return (
        <Badge variant="outline" className={config.className}>
          <span className="mr-1">{config.icon}</span>
          {config.label}
        </Badge>
      );
    },
  },
  {
    accessorKey: "opening_date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent p-0 h-auto font-medium"
        >
          Opening Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = row.getValue("opening_date") as string;
      if (!date) return <span className="text-muted-foreground">-</span>;
      try {
        return format(parseISO(date), "MMM dd, yyyy");
      } catch {
        return <span className="text-muted-foreground">{date}</span>;
      }
    },
  },
  {
    accessorKey: "closing_date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent p-0 h-auto font-medium"
        >
          Closing Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = row.getValue("closing_date") as string;
      if (!date) return <span className="text-muted-foreground">-</span>;
      try {
        const closingDate = parseISO(date);
        const today = new Date();
        const daysUntilClose = Math.ceil(
          (closingDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
        );

        const isClosingSoon = daysUntilClose > 0 && daysUntilClose <= 7;
        const isPastDue = daysUntilClose < 0;

        return (
          <div>
            <div
              className={
                isPastDue
                  ? "text-red-600 font-medium"
                  : isClosingSoon
                  ? "text-orange-600 font-medium"
                  : ""
              }
            >
              {format(closingDate, "MMM dd, yyyy")}
            </div>
            {isClosingSoon && (
              <div className="text-xs text-orange-600">
                Closes in {daysUntilClose} day{daysUntilClose !== 1 ? "s" : ""}
              </div>
            )}
            {isPastDue && (
              <div className="text-xs text-red-600">Overdue</div>
            )}
          </div>
        );
      } catch {
        return <span className="text-muted-foreground">{date}</span>;
      }
    },
  },
  {
    accessorKey: "financial_year",
    header: "Financial Year",
    cell: ({ row }) => {
      const year = row.original.financial_year;
      if (!year) return <span className="text-muted-foreground">-</span>;
      return typeof year === "string" ? year : year.year || "-";
    },
  },
  {
    accessorKey: "categories",
    header: "Categories",
    cell: ({ row }) => {
      const categories = row.original.categories;
      if (!categories || categories.length === 0) {
        return <span className="text-muted-foreground">-</span>;
      }
      return (
        <Badge variant="secondary" className="font-normal">
          {categories.length} categor{categories.length === 1 ? "y" : "ies"}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const eoi = row.original;

      return (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onView(eoi.id)}
            title="View details"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(eoi)}
            title="Edit EOI"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" title="Delete EOI">
                <DeleteIcon />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-5">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">
                    Are you absolutely sure?
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    This action cannot be undone. This will permanently delete
                    this data from our servers.
                  </p>
                </div>
                <Button onClick={() => onDelete(eoi.id)}>Confirm</Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      );
    },
  },
];
