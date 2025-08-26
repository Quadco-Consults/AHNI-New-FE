"use client";

import { Loading } from "@/components/Loading";
import dynamic from "next/dynamic";

const AssetMaintenanceCreate = dynamic(
  () => import("@/features/admin/components/asset-maintenance/create"),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);

export default function AssetMaintenanceCreatePage() {
  return <AssetMaintenanceCreate />;
}
