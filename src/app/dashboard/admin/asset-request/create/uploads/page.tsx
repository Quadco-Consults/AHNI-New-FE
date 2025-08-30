"use client";

import { Loading } from "@/components/Loading";
import dynamic from "next/dynamic";

const AssetRequestUploads = dynamic(
  () => import("@/features/admin/components/asset-request/create/uploads"),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);

export default function AssetRequestUploadsPage() {
  return <AssetRequestUploads />;
}