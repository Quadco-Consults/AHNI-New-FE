"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import DataTable from "@/components/Table/DataTable";
import { useGetVehicleFuelHistory, useGetAllFuelConsumptions } from "@/features/admin/controllers/fuelConsumptionController";
import { IFuelRequestPaginatedData } from "@/features/admin/types/fleet-management/fuel-request";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Eye, TrendingDown, TrendingUp, Fuel } from "lucide-react";

interface VehicleFuelHistoryProps {
  vehicleId: string;
  vehicleName?: string;
  vehicleData?: any; // Vehicle asset data containing odometer_reading
  showTitle?: boolean;
  maxHeight?: string;
}

export default function VehicleFuelHistory({
  vehicleId,
  vehicleName,
  vehicleData,
  showTitle = true,
  maxHeight = "600px",
}: VehicleFuelHistoryProps) {
  const { data: vehicleHistory, isLoading, error } = useGetVehicleFuelHistory(
    vehicleId,
    !!vehicleId
  );

  // Fallback: Use main fuel API with asset filter if vehicle history fails or returns empty
  const shouldUseFallback = !!error || !vehicleHistory?.data?.results || vehicleHistory.data.results.length === 0;

  const { data: fallbackHistory, isLoading: fallbackLoading } = useGetAllFuelConsumptions({
    page: 1,
    size: 1000,
    asset: vehicleId || "", // Use vehicle ID instead of name
    enabled: shouldUseFallback,
  });

  // Use fallback data if main API fails or returns no results
  const finalHistory = (vehicleHistory?.data?.results && vehicleHistory.data.results.length > 0)
    ? vehicleHistory
    : (fallbackHistory?.data?.results && fallbackHistory.data.results.length > 0)
      ? { data: { results: fallbackHistory.data.results, paginator: fallbackHistory.data.paginator } }
      : null;

  const finalLoading = isLoading || (shouldUseFallback && fallbackLoading);



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
          href={`/dashboard/admin/fleet-management/fuel-request/${row.original.id}`}
        >
          <Button variant='ghost' size='sm'>
            <Eye size={16} />
          </Button>
        </Link>
      ),
      size: 80,
    },
  ];

  // Calculate distance_covered for each record by comparing odometer readings
  const recordsWithDistance = React.useMemo(() => {
    const records = finalHistory?.data?.results || [];
    if (records.length === 0) return [];

    // Get vehicle's starting odometer reading from vehicle details
    const startingOdometer = vehicleData?.odometer_reading
      ? Number(vehicleData.odometer_reading)
      : 0;

    // Sort by created_datetime to ensure correct chronological order
    // (date field alone isn't enough if multiple records have same date)
    const sortedRecords = [...records].sort((a, b) =>
      new Date(a.created_datetime).getTime() - new Date(b.created_datetime).getTime()
    );

    // Calculate distance for each record
    return sortedRecords.map((record, index) => {
      const currentOdometer = record.odometer || 0;

      if (index === 0) {
        // First record: compare with vehicle's starting odometer reading
        const distance = startingOdometer > 0
          ? currentOdometer - startingOdometer
          : 0;
        return {
          ...record,
          distance_covered: distance > 0 ? distance : 0
        };
      }

      // Subsequent records: compare with previous fuel request's odometer
      const previousOdometer = sortedRecords[index - 1].odometer || 0;
      const distance = currentOdometer - previousOdometer;

      return {
        ...record,
        distance_covered: distance > 0 ? distance : 0
      };
    });
  }, [finalHistory, vehicleData]);

  console.log('🔍 Vehicle Fuel History Debug:', {
    vehicleId,
    vehicleName,
    startingOdometer: vehicleData?.odometer_reading,
    hasHistory: !!finalHistory,
    recordCount: recordsWithDistance?.length,
    sampleRecord: recordsWithDistance?.[0],
    recordsWithDistance: recordsWithDistance?.map(r => ({
      date: r.date,
      odometer: r.odometer,
      distance_covered: r.distance_covered,
      fuel_coupon: r.fuel_coupon,
    })),
  });

  // Calculate fuel efficiency and cost metrics
  const calculateMetrics = () => {
    const records = recordsWithDistance || [];
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

  if (finalLoading) {
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
              data={recordsWithDistance || []}
              isLoading={!!finalLoading}
            />
          </div>

          {(!recordsWithDistance || recordsWithDistance.length === 0) && (
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
