"use client";

import dynamic from "next/dynamic";

const FuelRequestCreate = dynamic(() => import("@/features/admin/components/fleet-management/fuel-request/create"), {
  ssr: false,
  loading: () => <div>Loading...</div>
});

export default function FuelRequestCreatePage() {
  return <FuelRequestCreate />;
}