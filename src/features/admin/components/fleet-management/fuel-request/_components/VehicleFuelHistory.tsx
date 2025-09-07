"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Badge } from "components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card";
import { cn } from "@/lib/utils";
import DataTable from "@/components/Table/DataTable";
import { useGetVehicleFuelHistory } from "@/features/admin/controllers/fuelConsumptionController";
import { IFuelRequestPaginatedData } from "@/features/admin/types/fleet-management/fuel-request";
import { Button } from "components/ui/button";
import Link from "next/link";
import { Eye, TrendingDown, TrendingUp, Fuel } from "lucide-react";

interface VehicleFuelHistoryProps {
  vehicleId: string;
  vehicleName?: string;
  showTitle?: boolean;
  maxHeight?: string;
}

export default function VehicleFuelHistory({
  vehicleId,
  vehicleName,
  showTitle = true,
  maxHeight = "600px",
}: VehicleFuelHistoryProps) {
  const { data: vehicleHistory, isLoading } = useGetVehicleFuelHistory(
    vehicleId,
    !!vehicleId
  );

  // Calculate and log totals
  const records = vehicleHistory?.data?.results || [];
  const totalLiters = records.reduce((sum: number, record: any) => sum + (record.quantity || 0), 0);
  const totalValue = records.reduce((sum: number, record: any) => sum + parseFloat(record.amount || '0'), 0);
  
  console.log({ 
    vehicleHistory,
    totalLiters: `${totalLiters.toLocaleString()} L`,
    totalValue: `₦${totalValue.toLocaleString()}`,
    recordCount: records.length
  });

  const historyColumns: ColumnDef<IFuelRequestPaginatedData>[] = [
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
      header: "Coupon",
      accessorKey: "fuel_coupon",
      size: 120,
    },
    {
      header: "Odometer (km)",
      accessorKey: "odometer",
      cell: ({ getValue }) => (
        <span>{(getValue() as number)?.toLocaleString()}</span>
      ),
      size: 130,
    },
    {
      header: "Distance (km)",
      accessorKey: "distance_covered",
      cell: ({ getValue }) => (
        <span>{(getValue() as number)?.toLocaleString()}</span>
      ),
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

  // Calculate fuel efficiency and cost metrics
  const calculateMetrics = () => {
    const records = vehicleHistory?.data?.results || [];
    if (records.length === 0) return null;

    const totalQuantity = records.reduce(
      (sum: number, record: any) => sum + (record.quantity || 0),
      0
    );
    const totalAmount = records.reduce(
      (sum: number, record: any) => sum + parseFloat(record.amount || '0'),
      0
    );
    const totalDistance = records.reduce(
      (sum: number, record: any) => sum + (record.distance_covered || 0),
      0
    );

    const averageConsumption =
      totalDistance > 0 ? (totalQuantity / totalDistance) * 100 : 0;
    const averageCostPerKm =
      totalDistance > 0 ? totalAmount / totalDistance : 0;
    const averageFuelPrice =
      totalQuantity > 0 ? totalAmount / totalQuantity : 0;

    return {
      totalRecords: records.length,
      totalQuantity,
      totalAmount,
      totalDistance,
      averageConsumption,
      averageCostPerKm,
      averageFuelPrice,
      approvedRecords: records.filter((r: any) => r.status === "APPROVED").length,
      pendingRecords: records.filter((r: any) => r.status === "PENDING").length,
      rejectedRecords: records.filter((r: any) => r.status === "REJECTED").length,
    };
  };

  const metrics = calculateMetrics();

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
      {/* Metrics Summary */}
      {metrics && (
        <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
          <Card>
            <CardContent className='p-4'>
              <div className='flex items-center gap-2'>
                <Fuel className='text-blue-500' size={20} />
                <div>
                  <p className='text-sm text-gray-500'>Total Fuel</p>
                  <p className='text-lg font-semibold'>
                    {metrics.totalQuantity?.toLocaleString()} L
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className='p-4'>
              <div className='flex items-center gap-2'>
                <TrendingDown className='text-green-500' size={20} />
                <div>
                  <p className='text-sm text-gray-500'>Avg Consumption</p>
                  <p className='text-lg font-semibold'>
                    {metrics.averageConsumption.toFixed(1)} L/100km
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className='p-4'>
              <div className='flex items-center gap-2'>
                <TrendingUp className='text-purple-500' size={20} />
                <div>
                  <p className='text-sm text-gray-500'>Total Cost</p>
                  <p className='text-lg font-semibold'>
                    ₦{metrics.totalAmount?.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className='p-4'>
              <div>
                <p className='text-sm text-gray-500'>Records</p>
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

      {/* History Table */}
      <Card>
        {showTitle && (
          <CardHeader>
            <CardTitle>
              Vehicle Fuel History{vehicleName && ` - ${vehicleName}`}
            </CardTitle>
            <p className='text-sm text-gray-500'>
              Complete fuel consumption history for this vehicle
            </p>
          </CardHeader>
        )}
        <CardContent>
          <div style={{ maxHeight }} className='overflow-auto'>
            <DataTable
              columns={historyColumns}
              data={vehicleHistory?.data?.results || []}
              isLoading={isLoading}
            />
          </div>

          {(!vehicleHistory?.data?.results ||
            vehicleHistory?.data?.results.length === 0) && (
            <div className='text-center py-8'>
              <Fuel className='mx-auto text-gray-400 mb-4' size={48} />
              <p className='text-gray-500'>
                No fuel consumption records found for this vehicle
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
