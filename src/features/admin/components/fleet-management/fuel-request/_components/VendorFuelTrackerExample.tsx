"use client";

import { useParams, useRouter } from "next/navigation";
import { useGetVendorFuelPurchases } from "@/features/admin/controllers/fuelConsumptionController";
import { useGetVendor } from "@/features/procurement/controllers/vendorsController";
import FuelTrackerTable from "./FuelTrackerTable";
import { Loading } from "@/components/Loading";
import { Button } from "components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function VendorFuelTrackerExample() {
  const params = useParams();
  const router = useRouter();
  const vendorId = params?.id as string;


  const { data: vendorPurchases, isLoading: purchasesLoading, error: purchasesError, isError: purchasesIsError } = useGetVendorFuelPurchases(
    vendorId,
    {
      page: 1,
      size: 1000,
    }
  );


  const { data: vendorDetails, isLoading: vendorLoading, error: vendorError, isError: vendorIsError } = useGetVendor(
    vendorId,
    !!vendorId
  );

  const isLoading = purchasesLoading || vendorLoading;
  const error = purchasesError || vendorError;
  const isError = purchasesIsError || vendorIsError;


  // Check if vendor was not found
  const vendorNotFound = vendorIsError && (
    vendorError?.message?.includes("404") ||
    (vendorError as any)?.response?.status === 404 ||
    (vendorError as any)?.status === 404
  );

  // Always show something, even if loading
  if (isLoading) {
    return (
      <div className="p-6">
        <h1>Loading vendor fuel data...</h1>
        <Loading />
      </div>
    );
  }

  if (vendorNotFound) {
    return (
      <div className="p-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-8 w-8 text-yellow-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>
            <div className="ml-3 flex-1">
              <h3 className="text-lg font-medium text-yellow-800">Vendor Not Found</h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>The vendor with ID <code className="bg-yellow-100 px-2 py-1 rounded font-mono text-xs">{vendorId}</code> was not found in the system.</p>
                <p className="mt-2">This could mean:</p>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  <li>The vendor ID is incorrect</li>
                  <li>The vendor has been removed from the system</li>
                  <li>This is a hardcoded ID from development/testing</li>
                </ul>
              </div>
              <div className="mt-4 flex gap-3">
                <Button
                  onClick={() => router.back()}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <ArrowLeft size={16} />
                  Go Back
                </Button>
                <Button
                  onClick={() => router.push('/dashboard/admin/fleet-management/fuel-request')}
                  size="sm"
                  className="flex items-center gap-2"
                >
                  View All Fuel Requests
                </Button>
              </div>
            </div>
          </div>
        </div>

      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
        <h3 className="text-red-800 font-semibold">Error Loading Data</h3>
        <p className="text-red-600 text-sm mt-1">
          {error?.message || "Failed to load vendor information or fuel purchases"}
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

  // Extract vendor details
  const vendor = vendorDetails?.data;
  const vendorName = vendor?.company_name || "Unknown Vendor";
  const location = vendor?.state || vendor?.company_address?.split(",").pop()?.trim() || "Unknown Location";
  const projectTitle = "AHNi HQ for Fuel Consumption Tracker for Project Vehicles";

  // Handle case where vendor exists but has no fuel purchases
  const fuelPurchases = vendorPurchases?.data?.results || [];
  const hasNoPurchases = !purchasesLoading && !purchasesIsError && fuelPurchases.length === 0;

  if (hasNoPurchases && vendor) {
    return (
      <div className="p-6">
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
          <h3 className="text-blue-800 font-semibold">No Fuel Requests Found</h3>
          <p className="text-blue-600 text-sm mt-1">
            <strong>{vendorName}</strong> is a registered vendor, but AHNi has not made any fuel requests to this vendor yet.
          </p>
          <p className="text-blue-600 text-sm mt-2">
            Location: {location}
          </p>
        </div>

        <FuelTrackerTable
          data={[]}
          vendorName={vendorName}
          location={location}
          projectTitle={projectTitle}
          isLoading={false}
        />
      </div>
    );
  }


  return (
    <div className="p-6">
      <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
        <h3 className="text-green-800 font-semibold">Fuel Request History</h3>
        <p className="text-green-600 text-sm mt-1">
          Showing all fuel requests made by AHNi to <strong>{vendorName}</strong>
        </p>
        <p className="text-green-600 text-sm">
          Total Records: <strong>{fuelPurchases.length}</strong>
        </p>
      </div>

      <FuelTrackerTable
        data={fuelPurchases}
        vendorName={vendorName}
        location={location}
        projectTitle={projectTitle}
        isLoading={isLoading}
      />
    </div>
  );
}
