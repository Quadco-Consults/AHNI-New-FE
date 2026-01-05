"use client";

export const dynamic = "force-dynamic";
import { Suspense } from "react";
import { Loading } from "@/components/Loading";
import dynamicImport from "next/dynamic";

const CheckApproval = dynamicImport(
  () =>
    import(
      "@/features/procurement/components/competitive-bid-analysis/[id]/CheckApproval"
    ).catch(() => ({ default: () => <div>Failed to load CBA Analysis component</div> })),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);

export default function CheckApprovalPage() {
  return (
    <Suspense fallback={<Loading />}>
      <CheckApproval />
    </Suspense>
  );
}