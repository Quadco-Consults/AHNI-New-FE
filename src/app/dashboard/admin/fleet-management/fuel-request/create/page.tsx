"use client";

import { Loading } from "@/components/Loading";
import dynamic from "next/dynamic";

const FuelRequestCreate = dynamic(
  () =>
    import("@/features/admin/components/fleet-management/fuel-request/create"),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);

export default function FuelRequestCreatePage() {
  return <FuelRequestCreate />;
}
