"use client";

import { Suspense } from "react";
import { Loading } from "@/components/Loading";
import dynamic from "next/dynamic";

const FinancialBidOpening = dynamic(
  () =>
    import(
      "@/features/procurement/components/competitive-bid-analysis/[id]/FinancialBiding"
    ).catch(() => ({ default: () => <div>Failed to load Financial Bid Opening component</div> })),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);

export default function FinancialBidOpeningPage() {
  return (
    <Suspense fallback={<Loading />}>
      <FinancialBidOpening />
    </Suspense>
  );
}