"use client";

export const dynamic = "force-dynamic";
import { Loading } from "@/components/Loading";
import dynamicImport from "next/dynamic";
import { Suspense } from "react";

const CheckApproval = dynamicImport(
  () =>
    import("@/features/procurement/components/competitive-bid-analysis/[id]/CheckApproval").catch(() => ({ 
      default: () => <div>Failed to load component</div> 
    })),
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