"use client";

export const dynamic = "force-dynamic";
import { Suspense } from "react";
import { Loading } from "@/components/Loading";
import dynamicImport from "next/dynamic";

const TechnicalPrequalificationSheet = dynamicImport(
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