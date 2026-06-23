"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
// import { TAssetSingleData } from "@/features/admin/types/inventory-management/asset";
// import { ColumnDef } from "@tanstack/react-table";
import DescriptionCard from "@/components/DescriptionCard";
import { LoadingSpinner } from "@/components/Loading";
import { useSearchParams } from "next/navigation";
import BackNavigation from "@/components/BackNavigation";
import { useGetSingleItemQuery } from "@/features/modules/controllers";
import { ColumnDef } from "@tanstack/react-table";
import TableFilters from "@/components/TableFilters";
import DataTable from "@/components/DataTable";
import {
  useGetAssetHistoryQuery,
  AssetHistoryData,
} from "@/features/admin/controllers/assetHistoryController";
import { useState, useMemo } from "react";

export default function AssetDetails() {
  const params = useSearchParams();
  const assetId = params.get("id");
  const [historyPage, setHistoryPage] = useState(1);

  const { data: asset, isLoading } = useGetSingleItemQuery(
    assetId || "",
    !!assetId
  );

  // Determine if this is a vehicle based on category or asset type
  const isVehicle = useMemo(() => {
    if (!asset?.data) return false;

    // Check category name
    const categoryName =
      typeof asset.data.category === 'object' && asset.data.category?.name
        ? asset.data.category.name.toLowerCase()
        : asset.data.category_detail?.name?.toLowerCase() || "";

    // Check asset type name as fallback
    const assetTypeName = asset.data.asset_type?.name?.toLowerCase() || "";

    // Check if it's categorized as a vehicle
    const hasVehicleCategory = categoryName.includes("vehicle") || assetTypeName.includes("vehicle");

    // Additional safety check: Only show vehicle fields if it actually HAS vehicle data
    // This prevents incorrectly categorized assets from showing vehicle fields
    const hasVehicleData = !!(
      asset.data.plate_number ||
      asset.data.chasis_number ||
      asset.data.engine_number ||
      asset.data.make ||
      asset.data.odometer_reading
    );

    // Only consider it a vehicle if BOTH conditions are true:
    // 1. It's in a vehicle category
    // 2. It has at least one vehicle-specific field populated
    const isVehicleAsset = hasVehicleCategory && hasVehicleData;

    return isVehicleAsset;
  }, [asset]);

  const { data: assetHistory, isLoading: isHistoryLoading } =
    useGetAssetHistoryQuery({
      asset_id: assetId || "",
      page: historyPage,
      size: 10,
      enabled: !!assetId,
    });

  // Client-side filter to ensure only history for this asset is shown
  // This is a temporary workaround until backend properly filters by asset_id
  const filteredAssetHistory = useMemo(() => {
    if (!assetHistory?.data?.results || !assetId) return [];

    return assetHistory.data.results.filter(
      (history) => history.asset?.id === assetId
    );
  }, [assetHistory, assetId]);

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

                {!isVehicle && (
                  <DescriptionCard
                    label='Model'
                    description={asset?.data?.model || "N/A"}
                  />
                )}

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

                {isVehicle && (
                  <>
                    {/* Section Header: Basic Vehicle Information */}
                    <div className='col-span-4 mt-6'>
                      <h3 className='font-bold text-lg text-gray-800 border-b-2 border-gray-300 pb-2'>
                        Basic Vehicle Information
                      </h3>
                    </div>

                    <DescriptionCard
                      label='Plate Number'
                      description={asset?.data?.plate_number || "N/A"}
                    />

                    <DescriptionCard
                      label='VIN Number'
                      description={asset?.data?.chasis_number || "N/A"}
                    />

                    <DescriptionCard
                      label='Engine Number'
                      description={asset?.data?.engine_number || "N/A"}
                    />

                    <DescriptionCard
                      label='Make'
                      description={asset?.data?.make || "N/A"}
                    />

                    <DescriptionCard
                      label='Model'
                      description={asset?.data?.model || "N/A"}
                    />

                    <DescriptionCard
                      label='Current Odometer Reading'
                      description={
                        asset?.data?.odometer_reading
                          ? `${Number(asset.data.odometer_reading).toLocaleString()} km`
                          : "N/A"
                      }
                    />

                    {/* Section Header: Additional Vehicle Details */}
                    <div className='col-span-4 mt-6'>
                      <h3 className='font-bold text-lg text-gray-800 border-b-2 border-gray-300 pb-2'>
                        Additional Vehicle Details
                      </h3>
                    </div>

                    <DescriptionCard
                      label='Manufacture Year'
                      description={asset?.data?.manufacture_year || "N/A"}
                    />

                    <DescriptionCard
                      label='Vehicle Color'
                      description={asset?.data?.vehicle_color || "N/A"}
                    />

                    <DescriptionCard
                      label='Fuel Type'
                      description={asset?.data?.fuel_type || "N/A"}
                    />

                    <DescriptionCard
                      label='Seating Capacity'
                      description={
                        asset?.data?.seating_capacity
                          ? `${asset.data.seating_capacity} seats`
                          : "N/A"
                      }
                    />

                    <DescriptionCard
                      label='Vehicle Type'
                      description={asset?.data?.vehicle_type || "N/A"}
                    />

                    {/* Section Header: Registration & Insurance */}
                    <div className='col-span-4 mt-6'>
                      <h3 className='font-bold text-lg text-gray-800 border-b-2 border-gray-300 pb-2'>
                        Registration & Insurance
                      </h3>
                    </div>

                    <DescriptionCard
                      label='Registration Number'
                      description={asset?.data?.registration_number || "N/A"}
                    />

                    <DescriptionCard
                      label='Registration Expiry Date'
                      description={
                        asset?.data?.registration_expiry_date
                          ? new Date(asset.data.registration_expiry_date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })
                          : "N/A"
                      }
                    />

                    <DescriptionCard
                      label='Insurance Policy Number'
                      description={asset?.data?.insurance_policy_number || "N/A"}
                    />

                    <DescriptionCard
                      label='Insurance Provider'
                      description={asset?.data?.insurance_provider || "N/A"}
                    />

                    <DescriptionCard
                      label='Insurance Expiry Date'
                      description={
                        asset?.data?.insurance_expiry_date
                          ? new Date(asset.data.insurance_expiry_date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })
                          : "N/A"
                      }
                    />

                    {/* Section Header: Maintenance Schedule */}
                    <div className='col-span-4 mt-6'>
                      <h3 className='font-bold text-lg text-gray-800 border-b-2 border-gray-300 pb-2'>
                        Maintenance Schedule
                      </h3>
                    </div>

                    <DescriptionCard
                      label='Last Service Date'
                      description={
                        asset?.data?.last_service_date
                          ? new Date(asset.data.last_service_date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })
                          : "N/A"
                      }
                    />

                    <DescriptionCard
                      label='Next Service Date'
                      description={
                        asset?.data?.next_service_date
                          ? new Date(asset.data.next_service_date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })
                          : "N/A"
                      }
                    />

                    <DescriptionCard
                      label='Service Interval'
                      description={
                        asset?.data?.service_interval_km
                          ? `Every ${Number(asset.data.service_interval_km).toLocaleString()} km`
                          : "N/A"
                      }
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

              <div className='px-5 pb-6'>
                {isHistoryLoading ? (
                  <div className='flex justify-center items-center py-8'>
                    <LoadingSpinner />
                  </div>
                ) : filteredAssetHistory.length === 0 ? (
                  <div className='text-center py-8 text-gray-500'>
                    <p className='text-sm'>No asset history movements found for this asset.</p>
                    <p className='text-xs mt-2'>Asset movements will appear here once they are recorded.</p>
                  </div>
                ) : (
                  <TableFilters>
                    <DataTable
                      data={filteredAssetHistory}
                      columns={columns}
                      isLoading={false}
                      pagination={{
                        total: filteredAssetHistory.length,
                        pageSize: assetHistory?.data.pagination.page_size ?? 10,
                        onChange: (page: number) => setHistoryPage(page),
                      }}
                    />
                  </TableFilters>
                )}
              </div>
            </>
          )
        )}
      </Card>
    </>
  );
}

const columns: ColumnDef<any>[] = [
  {
    header: "Date",
    accessorKey: "created_datetime",
    cell: ({ row }) => {
      const dateValue = row.original.created_datetime;
      if (!dateValue) return "N/A";

      const date = new Date(dateValue);
      if (isNaN(date.getTime())) return "Invalid Date";

      return date.toLocaleDateString("en-US", {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    },
  },
  {
    header: "Asset Name",
    accessorKey: "asset.name",
    cell: ({ row }) => row.original.asset?.name || "N/A",
  },
  {
    header: "Action Type",
    accessorKey: "type",
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
    accessorKey: "from_location.name",
    cell: ({ row }) => row.original.from_location?.name || "N/A",
  },
  {
    header: "To Location",
    accessorKey: "to_location.name",
    cell: ({ row }) => row.original.to_location?.name || "N/A",
  },
  {
    header: "Assignee",
    accessorKey: "assignee",
    cell: ({ row }) => {
      const assignee = row.original.assignee;
      if (assignee?.first_name && assignee?.last_name) {
        return `${assignee.first_name} ${assignee.last_name}`;
      }
      return "N/A";
    },
  },
];
