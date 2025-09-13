"use client";

import { Loading } from "@/components/Loading";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const CheckApproval = dynamic(
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