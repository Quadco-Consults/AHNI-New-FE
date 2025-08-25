"use client";

import dynamic from "next/dynamic";

const AssetRequestCreate = dynamic(() => import("@/features/admin/components/asset-request/create/index"), {
  ssr: false,
  loading: () => <div>Loading...</div>
});

export default function AssetRequestCreatePage() {
  return <AssetRequestCreate />;
}