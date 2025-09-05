"use client";

import { useParams, useSearchParams } from "next/navigation";
import BackNavigation from "components/atoms/BackNavigation";
import { Button } from "components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card";
import { DownloadIcon, Building2, Car } from "lucide-react";
import { useGetVendors } from "@/features/procurement/controllers/vendorController";
import { useGetAllItemsQuery } from "@/features/modules/controllers";
import VehicleFuelHistory from "./_components/VehicleFuelHistory";
import VendorFuelTracking from "./_components/VendorFuelTracking";

export default function ViewVehicleFuelConsumption() {
  const params = useParams();
  const id = params?.id as string;
  const searchParams = useSearchParams();
  const windowLocation = searchParams?.toString();

  const type = windowLocation === "type=vehicle" ? "vehicle" : "vendor";

  console.log({
    searchParams,
    params,
    type,
    searchParamsToString: searchParams?.toString(),
    windowLocation:
      typeof window !== "undefined"
        ? window.location.href.lastIndexOf
        : "server-side",
  });

  // Get entity data based on type
  const { data: vendors } = useGetVendors({
    page: 1,
    size: 2000000,
  });

  const { data: assets } = useGetAllItemsQuery({
    page: 1,
    size: 2000000,
    category: "b0983944-f926-4141-8e28-093960d75246",
  });

  // Find the current entity
  const vendor =
    type === "vendor"
      ? vendors?.data?.results?.find((v: any) => v.id === id)
      : null;
  const asset =
    type === "vehicle"
      ? assets?.data?.results?.find((a: any) => a.id === id)
      : null;

  // Auto-detect if no type provided but we can find the entity
  const autoDetectedAsset = assets?.data?.results?.find(
    (a: any) => a.id === id
  );
  const autoDetectedVendor = vendors?.data?.results?.find(
    (v: any) => v.id === id
  );

  // If no type provided, try to auto-detect and redirect
  if (!type && (autoDetectedAsset || autoDetectedVendor)) {
    const detectedType = autoDetectedAsset ? "vehicle" : "vendor";
    const detectedName =
      autoDetectedAsset?.name || autoDetectedVendor?.company_name;

    return (
      <section className='space-y-6'>
        <BackNavigation extraText='Fuel Consumption History' />
        <Card>
          <CardHeader>
            <CardTitle>Auto-detected Entity</CardTitle>
            <p className='text-sm text-gray-500'>
              Found {detectedType}: {detectedName}
            </p>
          </CardHeader>
          <CardContent className='space-y-4'>
            <p>
              We found this {detectedType} in our system. Click below to view
              its fuel history:
            </p>
            <div className='flex gap-4'>
              <Button
                onClick={() =>
                  (window.location.href = `${window.location.pathname}?type=${detectedType}`)
                }
              >
                View {detectedType === "vehicle" ? "Vehicle" : "Vendor"} Fuel
                History
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    );
  }

  //   console.log({ asset, assets, id,vehiccl });

  if (type === "vehicle" && (asset?.id || autoDetectedAsset?.id)) {
    const vehicleData = asset || autoDetectedAsset;
    return (
      <section className='space-y-6'>
        <div className='flex items-center justify-between'>
          <BackNavigation
            extraText={`Vehicle Fuel History - ${
              vehicleData?.name || "Unknown"
            }`}
          />
          <Button>
            <DownloadIcon size={16} className='mr-2' />
            Download History
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Car size={20} />
              {vehicleData?.name || "Unknown"} Fuel Consumption History
            </CardTitle>
            <p className='text-sm text-gray-500'>
              Complete fuel consumption records for this vehicle
            </p>
          </CardHeader>
        </Card>

        <VehicleFuelHistory
          vehicleId={vehicleData?.id || ""}
          vehicleName={vehicleData?.name || "Unknown"}
          showTitle={false}
        />
      </section>
    );
  }

  if (type === "vendor" && vendor?.id) {
    return (
      <VendorFuelConsumptionView
        vendorId={vendor.id}
        vendorName={vendor.company_name}
      />
    );
  }

  return (
    <section className='space-y-6'>
      <BackNavigation extraText='Fuel Consumption History' />
      <Card>
        <CardContent className='flex items-center justify-center h-32'>
          <p className='text-gray-500'>Invalid type or ID provided</p>
        </CardContent>
      </Card>
    </section>
  );
}

// Vendor view component
function VendorFuelConsumptionView({
  vendorId,
  vendorName,
}: {
  vendorId: string;
  vendorName: string;
}) {
  return (
    <section className='space-y-6'>
      <div className='flex items-center justify-between'>
        <BackNavigation extraText={`Vendor Fuel History - ${vendorName}`} />
        <Button>
          <DownloadIcon size={16} className='mr-2' />
          Download History
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Building2 size={20} />
            {vendorName} Fuel Supply History
          </CardTitle>
          <p className='text-sm text-gray-500'>
            All fuel consumption records supplied by this vendor
          </p>
        </CardHeader>
      </Card>

      <VendorFuelTracking
        vendorId={vendorId}
        vendorName={vendorName}
        showTitle={false}
      />
    </section>
  );
}
