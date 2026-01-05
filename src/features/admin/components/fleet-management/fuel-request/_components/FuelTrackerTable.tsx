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
  vendorName = "Unknown Vendor",
  location = "Unknown Location",
  projectTitle = "AHNI HQ for Fuel Consumption Tracker for Project Vehicles",
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
      cell: ({ getValue, row }) => {
        const asset = getValue() as any;

        // Handle string values (when expand doesn't work)
        if (typeof asset === 'string') {
          return (
            <div className="text-center font-medium">
              {asset || "N/A"}
            </div>
          );
        }

        // Handle object values (when expand works)
        const plateNumber = asset?.plate_number || asset?.plateNumber || asset?.registration_number;
        const assetName = asset?.name || asset?.asset_name;
        const assetCode = asset?.code || asset?.asset_code;

        return (
          <div className="text-center font-medium">
            {plateNumber || assetName || assetCode || "N/A"}
          </div>
        );
      },
      size: 120,
    },
    {
      header: "Name of Driver",
      accessorKey: "assigned_driver",
      cell: ({ getValue, row }) => {
        const driver = getValue() as any;

        // Check if driver exists
        if (!driver) return <div className="text-center">N/A</div>;

        // Handle string values (when expand doesn't work)
        if (typeof driver === 'string') {
          return (
            <div className="text-center">
              {driver || "N/A"}
            </div>
          );
        }

        // Handle object values (when expand works)
        const firstName = driver.first_name || driver.firstName || "";
        const lastName = driver.last_name || driver.lastName || "";
        const fullName = driver.full_name || driver.fullName || "";

        // Use fullName if available, otherwise combine first and last names
        const displayName = fullName || `${firstName} ${lastName}`.trim();

        return (
          <div className="text-center">
            {displayName || "N/A"}
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
    <Card className="w-full shadow-lg">
      {/* Header Section with AHNI Branding */}
      <CardHeader className="pb-2">
        <div className="border-2 border-red-600 rounded-lg overflow-hidden">
          {/* AHNI Header with Logo */}
          <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-6">
            <div className="flex items-center justify-center gap-4">
              <img
                src="/imgs/logo.png"
                alt="AHNI Logo"
                className="h-20 w-auto bg-white rounded-lg p-2 shadow-lg"
              />
              <div className="text-center">
                <h1 className="text-3xl font-bold tracking-wide">ACHIEVING HEALTH NIGERIA INITIATIVE</h1>
                <p className="text-red-100 text-base mt-2 font-medium">(AHNI)</p>
              </div>
            </div>
          </div>

          {/* Project Title Section */}
          <div className="bg-white border-t-2 border-red-200 p-4">
            <h2 className="text-xl font-bold text-center text-gray-800 mb-2">
              Fuel Consumption Tracker for Project Vehicles
            </h2>
            <p className="text-center text-gray-600 font-medium">
              Location: {location}
            </p>
          </div>

          {/* Vendor Section */}
          <div className="bg-red-50 border-t-2 border-red-200 p-4">
            <div className="flex items-center justify-center gap-2">
              <span className="text-gray-700 font-semibold">Vendor:</span>
              <span className="text-red-600 font-bold text-lg">{vendorName}</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {/* Main Table */}
        <div className="border-2 border-gray-400 fuel-tracker-table">
          <DataTable
            columns={fuelTrackerColumns}
            data={data}
            isLoading={isLoading}
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