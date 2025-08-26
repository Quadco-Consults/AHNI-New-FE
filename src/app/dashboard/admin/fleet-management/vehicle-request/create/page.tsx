"use client";

import { Loading } from "@/components/Loading";
import dynamic from "next/dynamic";

const VehicleRequestCreate = dynamic(
  () =>
    import(
      "@/features/admin/components/fleet-management/vehicle-request/create"
    ),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);

export default function VehicleRequestCreatePage() {
  return <VehicleRequestCreate />;
}
