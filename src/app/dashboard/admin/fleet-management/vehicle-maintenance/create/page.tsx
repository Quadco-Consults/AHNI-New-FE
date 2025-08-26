"use client";

import { Loading } from "@/components/Loading";
import dynamic from "next/dynamic";

const VehicleMaintenanceCreate = dynamic(
  () =>
    import(
      "@/features/admin/components/fleet-management/vehicle-maintenance/create"
    ),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);

export default function VehicleMaintenanceCreatePage() {
  return <VehicleMaintenanceCreate />;
}
