"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Badge } from "components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card";
import { cn } from "@/lib/utils";
import DataTable from "@/components/Table/DataTable";
import { useGetVendorFuelStatistics, useGetVendorFuelPurchases } from "@/features/admin/controllers/fuelConsumptionController";
import { IFuelRequestPaginatedData } from "@/features/admin/types/fleet-management/fuel-request";
import { Button } from "components/ui/button";
import Link from "next/link";
import { Eye, TrendingDown, TrendingUp, Building2, Fuel } from "lucide-react";

interface VendorFuelTrackingProps {
  vendorId: string;
  vendorName?: string;
  showTitle?: boolean;
  maxHeight?: string;
}

export default function VendorFuelTracking({
  vendorId,
  vendorName,
  showTitle = true,
  maxHeight = "600px",
}: VendorFuelTrackingProps) {
  // Use proper backend APIs
  const { data: vendorStats, isLoading: statsLoading } = useGetVendorFuelStatistics(vendorId);
  const { data: vendorPurchases, isLoading: purchasesLoading } = useGetVendorFuelPurchases(vendorId, {
    page: 1,
    size: 1000,
  });

  const isLoading = statsLoading || purchasesLoading;
  
  console.log({ 
    vendorStats,
    vendorPurchases,
    totalLiters: vendorStats?.statistics?.total_liters,
    totalValue: vendorStats?.statistics?.total_amount,
  });

  const vendorColumns: ColumnDef<IFuelRequestPaginatedData>[] = [
    {
      header: "Date",
      accessorKey: "date",
      cell: ({ getValue }) => (
        <span className='font-medium'>
          {format(new Date(getValue() as string), "dd MMM yyyy")}
        </span>
      ),
      size: 120,
    },
    {
      header: "Vehicle",
      accessorKey: "asset",
      cell: ({ getValue }) => {
        const asset = getValue() as any;
        return <span className='font-medium'>{asset?.name || "N/A"}</span>;
      },
      size: 150,
    },
    {
      header: "Driver",
      accessorKey: "assigned_driver",
      cell: ({ getValue }) => {
        const driver = getValue() as any;
        return (
          <span>
            {driver ? `${driver.first_name} ${driver.last_name}` : "N/A"}
          </span>
        );
      },
      size: 150,
    },
    {
      header: "Location",
      accessorKey: "location",
      cell: ({ getValue }) => {
        const location = getValue() as any;
        return <span>{location?.name || "N/A"}</span>;
      },
      size: 120,
    },
    {
      header: "Coupon",
      accessorKey: "fuel_coupon",
      size: 120,
    },
    {
      header: "Quantity (L)",
      accessorKey: "quantity",
      cell: ({ getValue }) => (
        <span className='font-medium'>
          {(getValue() as number)?.toLocaleString()}
        </span>
      ),
      size: 100,
    },
    {
      header: "Price/L",
      accessorKey: "price_per_litre",
      cell: ({ getValue }) => (
        <span>₦{parseFloat(getValue() as string)?.toLocaleString()}</span>
      ),
      size: 100,
    },
    {
      header: "Total Amount",
      accessorKey: "amount",
      cell: ({ getValue }) => (
        <span className='font-semibold text-green-600'>
          ₦{parseFloat(getValue() as string)?.toLocaleString()}
        </span>
      ),
      size: 130,
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ getValue }) => {
        const status = getValue() as string;
        return (
          <Badge
            variant='default'
            className={cn(
              "p-1 rounded-lg font-medium text-xs",
              status === "PENDING" &&
                "bg-yellow-100 text-yellow-800 border-yellow-200",
              status === "APPROVED" &&
                "bg-green-100 text-green-800 border-green-200",
              status === "REJECTED" && "bg-red-100 text-red-800 border-red-200"
            )}
          >
            {status}
          </Badge>
        );
      },
      size: 100,
    },
    {
      header: "Actions",
      id: "actions",
      cell: ({ row }) => (
        <Link
          href={`/dashboard/admin/fleet-management/fuel-request/${row.original.id}/details`}
        >
          <Button variant='ghost' size='sm'>
            <Eye size={16} />
          </Button>
        </Link>
      ),
      size: 80,
    },
  ];

  // Use backend statistics directly
  const metrics = vendorStats?.statistics && vendorStats?.status_breakdown ? {
    totalRecords: vendorStats.statistics.total_purchases,
    totalQuantity: vendorStats.statistics.total_liters,
    totalAmount: vendorStats.statistics.total_amount,
    averagePricePerLiter: vendorStats.statistics.average_price_per_liter,
    approvedRecords: vendorStats.status_breakdown.APPROVED || 0,
    pendingRecords: vendorStats.status_breakdown.PENDING || 0,
    rejectedRecords: vendorStats.status_breakdown.REJECTED || 0,
  } : null;

  if (isLoading) {
    return (
      <Card>
        <CardContent className='flex items-center justify-center h-32'>
          <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600'></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className='space-y-4'>
      {/* Vendor Metrics Summary */}
      {metrics && (
        <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
          <Card>
            <CardContent className='p-4'>
              <div className='flex items-center gap-2'>
                <Fuel className='text-blue-500' size={20} />
                <div>
                  <p className='text-sm text-gray-500'>Total Fuel Supplied</p>
                  <p className='text-lg font-semibold'>
                    {metrics.totalQuantity?.toLocaleString()} L
                  </p>
                  <p className='text-xs text-gray-400'>
                    {metrics.approvedRecords} approved transactions
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className='p-4'>
              <div className='flex items-center gap-2'>
                <TrendingUp className='text-green-500' size={20} />
                <div>
                  <p className='text-sm text-gray-500'>Total Value</p>
                  <p className='text-lg font-semibold'>
                    ₦{metrics.totalAmount?.toLocaleString()}
                  </p>
                  <p className='text-xs text-gray-400'>
                    Avg per transaction: ₦{metrics.totalRecords > 0 ? Math.round(metrics.totalAmount / metrics.totalRecords).toLocaleString() : 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className='p-4'>
              <div className='flex items-center gap-2'>
                <TrendingDown className='text-purple-500' size={20} />
                <div>
                  <p className='text-sm text-gray-500'>Avg Price/L</p>
                  <p className='text-lg font-semibold'>
                    ₦{metrics.averagePricePerLiter.toFixed(2)}
                  </p>
                  <p className='text-xs text-gray-400'>
                    {metrics.totalRecords} total transactions
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className='p-4'>
              <div>
                <p className='text-sm text-gray-500'>Transaction Status</p>
                <div className='flex gap-2 mt-1'>
                  <Badge
                    variant='secondary'
                    className='bg-green-100 text-green-800'
                  >
                    {metrics.approvedRecords}
                  </Badge>
                  <Badge
                    variant='secondary'
                    className='bg-yellow-100 text-yellow-800'
                  >
                    {metrics.pendingRecords}
                  </Badge>
                  <Badge
                    variant='secondary'
                    className='bg-red-100 text-red-800'
                  >
                    {metrics.rejectedRecords}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Vendor Fuel Supply History Table */}
      <Card>
        {showTitle && (
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Building2 size={20} />
              Vendor Fuel Supply History{vendorName && ` - ${vendorName}`}
            </CardTitle>
            <p className='text-sm text-gray-500'>
              All fuel consumption records supplied by this vendor
            </p>
          </CardHeader>
        )}
        <CardContent>
          <div style={{ maxHeight }} className='overflow-auto'>
            <DataTable
              columns={vendorColumns}
              data={vendorPurchases?.results || []}
              isLoading={isLoading}
            />
          </div>

          {(!vendorPurchases?.results ||
            vendorPurchases?.results.length === 0) && (
            <div className='text-center py-8'>
              <Building2 className='mx-auto text-gray-400 mb-4' size={48} />
              <p className='text-gray-500'>
                No fuel supply records found for this vendor
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}