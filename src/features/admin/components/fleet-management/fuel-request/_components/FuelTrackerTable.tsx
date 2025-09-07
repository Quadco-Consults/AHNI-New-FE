"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Card, CardContent, CardHeader } from "components/ui/card";
import { cn } from "@/lib/utils";
import DataTable from "@/components/Table/DataTable";
import { IFuelRequestPaginatedData } from "@/features/admin/types/fleet-management/fuel-request";

interface FuelTrackerTableProps {
  data: IFuelRequestPaginatedData[];
  vendorName?: string;
  location?: string;
  projectTitle?: string;
  isLoading?: boolean;
}

export default function FuelTrackerTable({
  data,
  vendorName = "EMADEB ENERGY SERVICES LIMITED",
  location = "Abuja",
  projectTitle = "AHNi HQ for Fuel Consumption Tracker for Project Vehicles",
  isLoading = false,
}: FuelTrackerTableProps) {
  
  const fuelTrackerColumns: ColumnDef<IFuelRequestPaginatedData>[] = [
    {
      header: "S/No",
      id: "serialNumber",
      cell: ({ row }) => (
        <div className="text-center font-medium">
          {row.index + 1}
        </div>
      ),
      size: 60,
    },
    {
      header: "Date",
      accessorKey: "date",
      cell: ({ getValue }) => (
        <div className="text-center">
          {format(new Date(getValue() as string), "dd/MM/yyyy")}
        </div>
      ),
      size: 100,
    },
    {
      header: "Vehicle No.",
      accessorKey: "asset",
      cell: ({ getValue }) => {
        const asset = getValue() as any;
        return (
          <div className="text-center font-medium">
            {asset?.plate_number || asset?.name || "NA"}
          </div>
        );
      },
      size: 120,
    },
    {
      header: "Name of Driver",
      accessorKey: "assigned_driver",
      cell: ({ getValue }) => {
        const driver = getValue() as any;
        return (
          <div className="text-center">
            {driver ? `${driver.first_name} ${driver.last_name}` : "NA"}
          </div>
        );
      },
      size: 150,
    },
    {
      header: "Coupon No.",
      accessorKey: "fuel_coupon",
      cell: ({ getValue }) => (
        <div className="text-center">
          {getValue() as string || "NA"}
        </div>
      ),
      size: 120,
    },
    {
      header: "Last Odometer (KM) Reading",
      accessorKey: "previous_odometer",
      cell: ({ getValue, row }) => {
        // Calculate previous odometer from distance_covered and current odometer
        const currentOdometer = row.original.odometer;
        const distanceCovered = row.original.distance_covered || 0;
        const previousOdometer = currentOdometer - distanceCovered;
        
        return (
          <div className="text-center">
            {previousOdometer > 0 ? previousOdometer.toLocaleString() : "NA"}
          </div>
        );
      },
      size: 120,
    },
    {
      header: "Present Odometer (KM) Reading",
      accessorKey: "odometer",
      cell: ({ getValue }) => (
        <div className="text-center font-medium">
          {(getValue() as number)?.toLocaleString() || "NA"}
        </div>
      ),
      size: 120,
    },
    {
      header: "Liter Qty",
      accessorKey: "quantity",
      cell: ({ getValue }) => (
        <div className="text-center font-medium bg-blue-50 px-2 py-1">
          {(getValue() as number)?.toLocaleString() || 0}
        </div>
      ),
      size: 80,
    },
    {
      header: "Amount(₦)/L",
      accessorKey: "price_per_litre",
      cell: ({ getValue }) => (
        <div className="text-center bg-blue-50 px-2 py-1">
          {parseFloat(getValue() as string)?.toLocaleString() || 0}
        </div>
      ),
      size: 100,
    },
    {
      header: "Total Amount (₦)",
      accessorKey: "amount",
      cell: ({ getValue }) => (
        <div className="text-center font-semibold bg-blue-100 px-2 py-1">
          {parseFloat(getValue() as string)?.toLocaleString() || 0}
        </div>
      ),
      size: 120,
    },
  ];

  // Calculate totals
  const totalQuantity = data.reduce((sum, record) => sum + (record.quantity || 0), 0);
  const totalAmount = data.reduce((sum, record) => sum + (parseFloat(record.amount) || 0), 0);

  return (
    <Card className="w-full">
      {/* Header Section */}
      <CardHeader className="pb-2">
        <div className="border-2 border-gray-400 p-4 bg-gray-50">
          <h1 className="text-lg font-bold text-center mb-2">
            {projectTitle} in {location}
          </h1>
          <div className="bg-white border border-gray-300 p-2">
            <h2 className="font-semibold">
              Vendor: {vendorName}
            </h2>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {/* Main Table */}
        <div className="border-2 border-gray-400">
          <DataTable
            columns={fuelTrackerColumns}
            data={data}
            isLoading={isLoading}
            className="fuel-tracker-table"
          />
        </div>

        {/* Totals Row */}
        <div className="border-2 border-t-0 border-gray-400 bg-gray-100">
          <div className="flex">
            <div className="flex-1 p-3 font-bold text-center border-r border-gray-400">
              Total
            </div>
            <div className="w-20"></div> {/* Empty columns */}
            <div className="w-24"></div>
            <div className="w-36"></div>
            <div className="w-28"></div>
            <div className="w-28"></div>
            <div className="w-28"></div>
            <div className="w-20 p-3 font-bold text-center border-x border-gray-400 bg-blue-100">
              {totalQuantity.toLocaleString()}
            </div>
            <div className="w-24"></div>
            <div className="w-28 p-3 font-bold text-center border-l border-gray-400 bg-blue-200">
              {totalAmount.toLocaleString()}
            </div>
          </div>
        </div>
      </CardContent>

      <style jsx global>{`
        .fuel-tracker-table table {
          border-collapse: collapse;
        }
        
        .fuel-tracker-table th {
          border: 1px solid #9ca3af;
          background-color: #f9fafb;
          font-weight: bold;
          text-align: center;
          padding: 8px 4px;
          font-size: 13px;
        }
        
        .fuel-tracker-table td {
          border: 1px solid #9ca3af;
          padding: 6px 4px;
          font-size: 12px;
        }
        
        .fuel-tracker-table tr:nth-child(even) {
          background-color: #f9fafb;
        }
        
        .fuel-tracker-table tr:hover {
          background-color: #f3f4f6;
        }
      `}</style>
    </Card>
  );
}