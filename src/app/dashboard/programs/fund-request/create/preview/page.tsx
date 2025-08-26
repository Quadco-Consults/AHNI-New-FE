"use client";

import { Loading } from "@/components/Loading";
import dynamic from "next/dynamic";

const FundRequestPreview = dynamic(
  () =>
    import("@/features/programs/components/fund-request/Fund-request-preview"),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);

export default function FundRequestPreviewPage() {
  return <FundRequestPreview />;
}
