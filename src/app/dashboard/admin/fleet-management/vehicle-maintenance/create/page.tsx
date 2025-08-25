"use client";

import dynamic from "next/dynamic";

const VehicleMaintenanceCreate = dynamic(() => import("@/features/admin/components/fleet-management/vehicle-maintenance/create"), {
  ssr: false,
  loading: () => <div>Loading...</div>
});

export default function VehicleMaintenanceCreatePage() {
  return <VehicleMaintenanceCreate />;
}