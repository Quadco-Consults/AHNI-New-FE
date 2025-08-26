"use client";

import { Loading } from "@/components/Loading";
import dynamic from "next/dynamic";

const FundRequestSummary = dynamic(
  () => import("@/features/programs/components/fund-request/create/summary"),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);

export default function FundRequestSummaryPage() {
  return <FundRequestSummary />;
}
