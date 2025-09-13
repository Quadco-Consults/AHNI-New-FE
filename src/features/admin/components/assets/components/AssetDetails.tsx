"use client";

import { Card, CardContent, CardHeader } from "components/ui/card";
import { Separator } from "components/ui/separator";
// import { TAssetSingleData } from "features/admin/types/inventory-management/asset";
// import { ColumnDef } from "@tanstack/react-table";
import DescriptionCard from "components/DescriptionCard";
import { LoadingSpinner } from "components/Loading";
import { useSearchParams } from "next/navigation";
import BackNavigation from "components/atoms/BackNavigation";
import { useGetSingleItemQuery } from "@/features/modules/controllers";
import { ColumnDef } from "@tanstack/react-table";
import TableFilters from "@/components/TableFilters";
import DataTable from "@/components/DataTable";
import {
  useGetAssetHistoryQuery,
  AssetHistoryData,
} from "@/features/admin/controllers/assetHistoryController";
import { useState } from "react";

export default function AssetDetails() {
  const params = useSearchParams();
  const assetId = params.get("id");
  const [historyPage, setHistoryPage] = useState(1);

  const { data: asset, isLoading } = useGetSingleItemQuery(
    assetId || "",
    !!assetId
  );

  const { data: assetHistory, isLoading: isHistoryLoading } =
    useGetAssetHistoryQuery({
      asset_id: assetId || "",
      page: historyPage,
      size: 10,
      enabled: !!assetId,
    });

  return (
    <>
      <BackNavigation />

      <Card>
        <CardHeader className='font-bold'>
          {asset?.data?.name}
          <Separator className='mt-4' />
        </CardHeader>

        {isLoading ? (
          <LoadingSpinner />
        ) : (
          asset && (
            <>
              <CardContent className='grid grid-cols-4 gap-y-8 gap-x-4'>
                <DescriptionCard
                  label='Asset Name'
                  description={asset?.data?.name}
                />

                <DescriptionCard
                  label='Assignee'
                  description={
                    asset?.data?.assignee?.first_name &&
                    asset?.data?.assignee?.last_name
                      ? `${asset?.data?.assignee?.first_name} ${asset?.data?.assignee?.last_name}`
                      : asset?.data?.assignee?.name || "N/A"
                  }
                />

                <DescriptionCard
                  label='Asset Code'
                  description={asset?.data?.asset_code || "N/A"}
                />

                <DescriptionCard
                  label='Acquisition Date'
                  description={asset?.data?.acquisition_date || "N/A"}
                />

                <DescriptionCard
                  label='Asset Type'
                  description={asset?.data?.asset_type?.name || "N/A"}
                />
                <DescriptionCard
                  label='Serial Number'
                  description={asset?.data?.asset_type?.serial_number || "N/A"}
                />
                <DescriptionCard
                  label='Funding Source'
                  description={
                    asset?.data?.project?.funding_sources?.length > 0
                      ? asset.data?.project?.funding_sources
                          .map((source) => source.name)
                          .join(", ")
                      : "N/A"
                  }
                />

                <DescriptionCard
                  label='State'
                  description={asset?.data?.state || "N/A"}
                />
                <DescriptionCard
                  label='Model'
                  description={asset?.data?.model || "N/A"}
                />

                <DescriptionCard
                  label='Assigned To'
                  description={asset?.data?.assignee?.full_name || "N/A"}
                />

                <DescriptionCard
                  label='Asset Condtion'
                  description={asset?.data?.asset_condition?.name || "N/A"}
                />

                <DescriptionCard
                  label='Manufacturer'
                  description={
                    asset?.data?.asset_type?.name ||
                    asset?.data?.asset_type?.manufacturer ||
                    "N/A"
                  }
                />

                <DescriptionCard
                  label='Location'
                  description={asset?.data?.location?.name || "N/A"}
                />

                <DescriptionCard
                  label='Life of Project'
                  description={asset?.data?.estimated_life_span || "N/A"}
                />

                <DescriptionCard
                  label='Asset Classification'
                  description={asset?.data?.classification?.name || "N/A"}
                />

                <DescriptionCard
                  label='USD Cost'
                  description={`$${asset?.data?.usd_cost}` || "N/A"}
                />

                <DescriptionCard
                  label='NGN Cost'
                  description={`₦${asset?.data?.ngn_cost}` || "N/A"}
                />

                <DescriptionCard
                  label='Unit'
                  description={asset?.data?.unit || "N/A"}
                />

                <DescriptionCard
                  label='Implementer'
                  description={asset?.data?.implementer?.name || "N/A"}
                />

                {asset?.data?.asset_type?.name?.toLowerCase() === "vehicle" && (
                  <>
                    <DescriptionCard
                      label='Plate Number'
                      description={asset?.data?.plate_number || "N/A"}
                    />

                    <DescriptionCard
                      label='Chasis Number'
                      description={asset?.data?.chasis_number || "N/A"}
                    />
                  </>
                )}

                <div className='col-span-3'>
                  <DescriptionCard
                    label='Description'
                    description={asset?.data?.description || "N/A"}
                  />
                </div>
              </CardContent>

              <CardHeader className='font-bold text-lg'>
                <Separator className='my-4' />
                Asset History Movement
              </CardHeader>

              <div className='px-5'>
                <TableFilters>
                  <DataTable
                    data={assetHistory?.data.results || []}
                    columns={columns}
                    isLoading={isHistoryLoading}
                    pagination={{
                      total: assetHistory?.data.pagination.count ?? 0,
                      pageSize: assetHistory?.data.pagination.page_size ?? 10,
                      onChange: (page: number) => setHistoryPage(page),
                    }}
                  />
                </TableFilters>
              </div>
            </>
          )
        )}
      </Card>
    </>
  );
}

const columns: ColumnDef<AssetHistoryData>[] = [
  {
    header: "Date",
    accessorKey: "date_created",
    cell: ({ row }) => {
      const dateValue = row.original.date_created;
      if (!dateValue) return "N/A";
      
      const date = new Date(dateValue);
      if (isNaN(date.getTime())) return "Invalid Date";
      
      return date.toLocaleDateString("en-US");
    },
  },
  {
    header: "Action Type",
    accessorKey: "action_type",
    cell: ({ row }) => {
      const actionType = row.original.type;
      const badgeColor =
        {
          MOVEMENT: "bg-blue-100 text-blue-800",
          DISPOSAL: "bg-red-100 text-red-800",
          ASSIGNMENT: "bg-green-100 text-green-800",
          MAINTENANCE: "bg-yellow-100 text-yellow-800",
          OTHER: "bg-gray-100 text-gray-800",
        }[actionType] || "bg-gray-100 text-gray-800";

      return (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${badgeColor}`}
        >
          {actionType}
        </span>
      );
    },
  },
  {
    header: "Description",
    accessorKey: "asset.description",
    // cell: ({ row }) => row.original.from_location?.name || "N/A",
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: ({ row }) => {
      const status = row.original.status;
      const badgeColor = {
        APPROVED: "bg-green-100 text-green-800",
        IN_TRANSIT: "bg-yellow-100 text-yellow-800", 
        DELIVERED: "bg-blue-100 text-blue-800",
        PENDING: "bg-gray-100 text-gray-800",
        CANCELLED: "bg-red-100 text-red-800",
      }[status] || "bg-gray-100 text-gray-800";
      
      return (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${badgeColor}`}
        >
          {status}
        </span>
      );
    },
  },
  {
    header: "From Location",
    cell: ({ row }) => row.original.from_location?.name || "N/A",
  },
  {
    header: "To Location",
    cell: ({ row }) => row.original.to_location?.name || "N/A",
  },
  {
    header: "Remark",
    accessorKey: "remark",
  },
];
