"use client";

import { useParams } from "next/navigation";
import { useGetVendorFuelPurchases } from "@/features/admin/controllers/fuelConsumptionController";
import FuelTrackerTable from "./FuelTrackerTable";
import { Loading } from "@/components/Loading";

export default function VendorFuelTrackerExample() {
  const params = useParams();
  const vendorId = params?.id as string;
  
  const { data: vendorPurchases, isLoading, error, isError } = useGetVendorFuelPurchases(
    vendorId,
    {
      page: 1,
      size: 1000,
    }
  );
  
  console.log("Debug info:", { 
    vendorId, 
    vendorPurchases, 
    isLoading, 
    error, 
    isError,
    params
  });

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
        <h3 className="text-red-800 font-semibold">Error Loading Data</h3>
        <p className="text-red-600 text-sm mt-1">
          {error?.message || "Failed to load vendor fuel purchases"}
        </p>
        <p className="text-xs text-gray-600 mt-2">
          Endpoint: /admins/fleets/fuel-consumptions/vendor/{vendorId}/purchases/
        </p>
      </div>
    );
  }

  if (!vendorId) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
        <h3 className="text-yellow-800 font-semibold">Missing Vendor ID</h3>
        <p className="text-yellow-600 text-sm mt-1">
          Please provide a valid vendor ID to load fuel purchases.
        </p>
      </div>
    );
  }

  return (
    <FuelTrackerTable
      data={vendorPurchases?.results || []}
      vendorName="EMADEB ENERGY SERVICES LIMITED"
      location="Abuja"
      projectTitle="AHNi HQ for Fuel Consumption Tracker for Project Vehicles"
      isLoading={isLoading}
    />
  );
}
