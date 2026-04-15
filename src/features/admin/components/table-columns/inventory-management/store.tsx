"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, Pencil, Trash2, CheckCircle, XCircle } from "lucide-react";
import { TStorePaginatedData } from "@/features/admin/types/inventory-management/store";
import { cn } from "@/lib/utils";

interface StoreColumnsProps {
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onToggleStatus?: (id: string, currentStatus: boolean) => void;
}

export const getStoreColumns = ({
  onView,
  onEdit,
  onDelete,
  onToggleStatus,
}: StoreColumnsProps = {}): ColumnDef<TStorePaginatedData>[] => [
  {
    accessorKey: "code",
    header: "Store Code",
    cell: ({ row }) => (
      <span className="font-medium text-gray-900">{row.getValue("code")}</span>
    ),
  },
  {
    accessorKey: "name",
    header: "Store Name",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-medium">{row.getValue("name")}</span>
        {row.original.description && (
          <span className="text-xs text-gray-500">{row.original.description}</span>
        )}
      </div>
    ),
  },
  {
    accessorKey: "store_type",
    header: "Type",
    cell: ({ row }) => {
      const type = row.getValue("store_type") as string;
      const store = row.original as any;
      const displayType = store.storeTypeDisplay || type;

      return (
        <Badge
          variant="outline"
          className={cn(
            "font-medium",
            type === "CENTRAL"
              ? "bg-purple-100 text-purple-800 border-purple-200"
              : type === "LOCATION"
              ? "bg-blue-100 text-blue-800 border-blue-200"
              : "bg-gray-100 text-gray-800 border-gray-200"  // GENERAL or other types
          )}
        >
          {displayType}
        </Badge>
      );
    },
  },
  {
    accessorKey: "locationName",
    header: "Location",
    cell: ({ row }) => {
      const store = row.original as any;
      const locationName = store.locationName || store.location_data?.name || store.location?.name || "N/A";
      return <span className="text-gray-700">{locationName}</span>;
    },
  },
  {
    accessorKey: "parentStoreName",
    header: "Parent Store",
    cell: ({ row }) => {
      const store = row.original as any;
      const parentName = store.parentStoreName || store.parent_store_data?.name || store.parent_store?.name || "-";
      return <span className="text-gray-600 text-sm">{parentName}</span>;
    },
  },
  {
    accessorKey: "storeKeeperName",
    header: "Store Keeper",
    cell: ({ row }) => {
      const store = row.original as any;
      const keeperName = store.storeKeeperName ||
        (store.store_keeper_data?.first_name && store.store_keeper_data?.last_name
          ? `${store.store_keeper_data.first_name} ${store.store_keeper_data.last_name}`
          : (store.store_keeper?.first_name && store.store_keeper?.last_name
            ? `${store.store_keeper.first_name} ${store.store_keeper.last_name}`
            : "N/A"));
      return <span className="text-gray-700">{keeperName}</span>;
    },
  },
  {
    accessorKey: "is_active",
    header: "Status",
    cell: ({ row }) => {
      const isActive = row.getValue("is_active") as boolean;
      return (
        <Badge
          variant="outline"
          className={cn(
            "font-medium",
            isActive
              ? "bg-green-100 text-green-800 border-green-200"
              : "bg-red-100 text-red-800 border-red-200"
          )}
        >
          {isActive ? "Active" : "Inactive"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "created_datetime",
    header: "Created",
    cell: ({ row }) => {
      const date = row.getValue("created_datetime") as string;
      return (
        <span className="text-sm text-gray-600">
          {format(new Date(date), "dd MMM yyyy")}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const store = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {onView && (
              <DropdownMenuItem onClick={() => onView(store.id)}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
            )}
            {onEdit && (
              <DropdownMenuItem onClick={() => onEdit(store.id)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit Store
              </DropdownMenuItem>
            )}
            {onToggleStatus && (
              <DropdownMenuItem
                onClick={() => onToggleStatus(store.id, store.is_active)}
              >
                {store.is_active ? (
                  <>
                    <XCircle className="mr-2 h-4 w-4" />
                    Deactivate
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Activate
                  </>
                )}
              </DropdownMenuItem>
            )}
            {onDelete && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => onDelete(store.id)}
                  className="text-red-600 focus:text-red-600"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
