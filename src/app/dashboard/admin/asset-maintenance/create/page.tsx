"use client";

import dynamic from "next/dynamic";

const AssetMaintenanceCreate = dynamic(() => import("@/features/admin/components/asset-maintenance/create"), {
  ssr: false,
  loading: () => <div>Loading...</div>
});

export default function AssetMaintenanceCreatePage() {
  return <AssetMaintenanceCreate />;
}