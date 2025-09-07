"use client";

import { Suspense } from "react";
import { Loading } from "@/components/Loading";
import dynamic from "next/dynamic";

const TechnicalPrequalificationSheet = dynamic(
  () =>
    import(
      "@/features/procurement/components/competitive-bid-analysis/[id]/TechnicalPrequalificationSheet"
    ).catch(() => ({ default: () => <div>Failed to load Technical Prequalification component</div> })),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);

export default function CbaStartPage() {
  return (
    <Suspense fallback={<Loading />}>
      <TechnicalPrequalificationSheet />
    </Suspense>
  );
}