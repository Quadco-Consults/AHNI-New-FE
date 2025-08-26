"use client";

import { Loading } from "@/components/Loading";
import dynamic from "next/dynamic";

const AssetRequestSummary = dynamic(
  () => import("@/features/admin/components/asset-request/create"),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);

export default function AssetRequestSummaryPage() {
  return <AssetRequestSummary />;
}
