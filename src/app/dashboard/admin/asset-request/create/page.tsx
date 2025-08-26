"use client";

import { Loading } from "@/components/Loading";
import dynamic from "next/dynamic";

const AssetRequestCreate = dynamic(
  () => import("@/features/admin/components/asset-request/create/index"),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);

export default function AssetRequestCreatePage() {
  return <AssetRequestCreate />;
}
