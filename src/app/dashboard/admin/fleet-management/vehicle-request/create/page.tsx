"use client";

import dynamic from "next/dynamic";

const VehicleRequestCreate = dynamic(() => import("@/features/admin/components/fleet-management/vehicle-request/create"), {
  ssr: false,
  loading: () => <div>Loading...</div>
});

export default function VehicleRequestCreatePage() {
  return <VehicleRequestCreate />;
}